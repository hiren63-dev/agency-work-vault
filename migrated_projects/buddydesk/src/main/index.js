const { app, BrowserWindow, ipcMain, Tray, Menu, Notification, shell, nativeImage } = require('electron')
const path = require('path')
const fs = require('fs')
const Store = require('electron-store')

const store = new Store()

// ─── Resources ────────────────────────────────────────────────────────────────
// resources/ ships inside the asar (see the "files" list in package.json).
// Never assume an icon is present: a missing file must not stop the window or
// the tray from being created.
function resourcePath(fileName) {
  const p = path.join(__dirname, '../../resources', fileName)
  try {
    return fs.existsSync(p) ? p : null
  } catch (e) {
    return null
  }
}

let mainWindow = null
let buddyWindow = null
let tray = null

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

// ─── Shift & Auto-start Logic ─────────────────────────────────────────────────
function isWithinShift() {
  const shiftStart = store.get('shiftStart', '00:00')
  const shiftEnd = store.get('shiftEnd', '23:59')
  const now = new Date()
  const [sh, sm] = shiftStart.split(':').map(Number)
  const [eh, em] = shiftEnd.split(':').map(Number)
  const current = now.getHours() * 60 + now.getMinutes()
  const start = sh * 60 + sm
  const end = eh * 60 + em
  return current >= start && current <= end
}

// ─── Create Main Panel Window ──────────────────────────────────────────────────
function createMainWindow() {
  const { screen } = require('electron')
  const display = screen.getPrimaryDisplay()
  const { width, height } = display.workAreaSize

  const iconPath = resourcePath('icon.png')
  if (!iconPath) {
    console.warn('[main] resources/icon.png not found — using the default window icon.')
  }

  mainWindow = new BrowserWindow({
    width: 420,
    height: height,
    x: width - 420,
    y: 0,
    frame: false,
    transparent: false,
    resizable: false,
    alwaysOnTop: false,
    skipTaskbar: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    ...(iconPath ? { icon: iconPath } : {}),
    title: 'BuddyDesk',
    backgroundColor: '#0f0f1a',
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'))
  }

  mainWindow.on('closed', () => { mainWindow = null })

  // Record login time
  const loginTime = new Date().toISOString()
  store.set('lastLoginTime', loginTime)
}

// ─── Create Buddy Window (floating draggable) ──────────────────────────────────
function createBuddyWindow() {
  const { screen } = require('electron')
  const display = screen.getPrimaryDisplay()
  const { width, height } = display.workAreaSize

  const savedX = store.get('buddyX', width - 120)
  const savedY = store.get('buddyY', height - 150)

  buddyWindow = new BrowserWindow({
    width: 110,
    height: 130,
    x: savedX,
    y: savedY,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    buddyWindow.loadURL('http://localhost:5173/#/buddy')
  } else {
    buddyWindow.loadFile(path.join(__dirname, '../../dist/index.html'), { hash: '/buddy' })
  }

  // Save position on move
  buddyWindow.on('moved', () => {
    const [x, y] = buddyWindow.getPosition()
    store.set('buddyX', x)
    store.set('buddyY', y)
  })

  buddyWindow.on('closed', () => { buddyWindow = null })
}

// ─── System Tray ──────────────────────────────────────────────────────────────
function createTray() {
  const iconPath = resourcePath('icon.png')

  try {
    // Tray icons want a small image; scale down rather than handing the OS a
    // 512px bitmap. An empty image is rejected on some platforms, so that
    // fallback is itself guarded.
    const image = iconPath
      ? nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 })
      : nativeImage.createEmpty()
    tray = new Tray(image)
  } catch (e) {
    console.warn('[main] Could not create the tray icon — continuing without a tray:', e.message)
    tray = null
    return
  }

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open BuddyDesk', click: () => mainWindow ? mainWindow.show() : createMainWindow() },
    { label: 'Show Buddy', click: () => buddyWindow ? buddyWindow.show() : createBuddyWindow() },
    { type: 'separator' },
    { label: 'Quit', click: () => {
      store.set('lastLogoutTime', new Date().toISOString())
      app.quit()
    }},
  ])

  tray.setToolTip('BuddyDesk')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    } else {
      createMainWindow()
    }
  })
}

// ─── IPC Handlers ─────────────────────────────────────────────────────────────
ipcMain.handle('store:get', (_, key) => store.get(key))
ipcMain.handle('store:set', (_, key, value) => store.set(key, value))
ipcMain.handle('store:delete', (_, key) => store.delete(key))

ipcMain.handle('window:togglePanel', () => {
  if (mainWindow) {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  } else {
    createMainWindow()
  }
})

ipcMain.handle('window:minimize', () => mainWindow?.minimize())
ipcMain.handle('window:close', () => {
  store.set('lastLogoutTime', new Date().toISOString())
  mainWindow?.hide()
})

// Hand the OS only what a browser would follow. Without this allowlist a
// compromised or injected renderer could pass `file://`, `javascript:`, `smb://`
// or an OS-handler scheme (`ms-msdt:` and friends) and get local code or file
// access through the shell. http: is kept for plain intranet links.
const ALLOWED_EXTERNAL_PROTOCOLS = ['https:', 'http:']

ipcMain.handle('window:openExternal', async (_, url) => {
  if (typeof url !== 'string' || url.length > 2048) {
    console.warn('[main] openExternal rejected: not a usable URL string')
    return false
  }

  let parsed
  try {
    parsed = new URL(url)
  } catch (e) {
    console.warn('[main] openExternal rejected an unparseable URL:', url.slice(0, 120))
    return false
  }

  if (!ALLOWED_EXTERNAL_PROTOCOLS.includes(parsed.protocol)) {
    console.warn(`[main] openExternal rejected protocol "${parsed.protocol}" — only ${ALLOWED_EXTERNAL_PROTOCOLS.join(', ')} are allowed.`)
    return false
  }

  try {
    await shell.openExternal(parsed.toString())
    return true
  } catch (e) {
    console.warn('[main] openExternal failed to hand the URL to the OS:', e.message)
    return false
  }
})

ipcMain.handle('notification:show', (_, { title, body }) => {
  new Notification({ title, body }).show()
})

ipcMain.handle('buddy:click', () => {
  if (mainWindow) {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  } else {
    createMainWindow()
  }
})

ipcMain.handle('app:logout', () => {
  store.set('lastLogoutTime', new Date().toISOString())
  store.delete('authToken')
})

ipcMain.handle('app:getLoginTime', () => store.get('lastLoginTime'))

// ─── App Lifecycle ─────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  createMainWindow()
  createBuddyWindow()
  createTray()

  app.on('activate', () => {
    if (!mainWindow) createMainWindow()
  })
})

// Deliberately a no-op: BuddyDesk lives in the tray, so closing every window
// must not quit it on any platform. Removing this handler entirely would restore
// Electron's default of quitting on Windows/Linux, which is exactly what we do
// not want — the tray icon has to keep working.
app.on('window-all-closed', () => {})

app.on('before-quit', () => {
  store.set('lastLogoutTime', new Date().toISOString())
})
