const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // Store
  storeGet: (key) => ipcRenderer.invoke('store:get', key),
  storeSet: (key, value) => ipcRenderer.invoke('store:set', key, value),
  storeDelete: (key) => ipcRenderer.invoke('store:delete', key),

  // Window controls
  togglePanel: () => ipcRenderer.invoke('window:togglePanel'),
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  openExternal: (url) => ipcRenderer.invoke('window:openExternal', url),

  // Notifications
  showNotification: (opts) => ipcRenderer.invoke('notification:show', opts),

  // Buddy
  buddyClick: () => ipcRenderer.invoke('buddy:click'),

  // Auth
  logout: () => ipcRenderer.invoke('app:logout'),
  getLoginTime: () => ipcRenderer.invoke('app:getLoginTime'),

  // Platform info
  platform: process.platform,
})
