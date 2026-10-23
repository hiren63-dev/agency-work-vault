<#
================================================================================
AUTOMATED VERCEL & GITHUB AGENCY ONBOARDING SCRIPT
================================================================================
Usage:
1. Open PowerShell in this directory:
   cd "c:\Users\zediz\Documents\Codex\2026-10-01\i-have-a-goal-for-you\outputs\website-factory\agency-work-vault"
2. Run:
   .\deploy-to-new-vercel.ps1 -NewGithubOrg "my-new-agency" -NewVercelScope "agency-team"
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$NewGithubOrg = "YOUR_NEW_GITHUB_USER_OR_ORG",

    [Parameter(Mandatory=$false)]
    [string]$NewVercelScope = ""
)

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " STARTING AGENCY PORTFOLIO CLONING & DEPLOYMENT ENGINE" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

$stagedDirs = @(
    @{ Name = "bnps"; Folder = "migrated_projects\bnps"; Framework = "other" },
    @{ Name = "harsh-manek"; Folder = "migrated_projects\harsh-manek"; Framework = "vite" },
    @{ Name = "kadivar-associates"; Folder = "migrated_projects\kadivar-associates"; Framework = "nextjs" },
    @{ Name = "pulse-gms"; Folder = "migrated_projects\pulse-gms\GMS-deploy"; Framework = "other" },
    @{ Name = "buddydesk"; Folder = "migrated_projects\buddydesk"; Framework = "vite" }
)

foreach ($item in $stagedDirs) {
    $folderPath = Join-Path $PSScriptRoot $item.Folder
    Write-Host "`n---> Setting up project: [$($item.Name)] at $folderPath" -ForegroundColor Yellow

    if (!(Test-Path $folderPath)) {
        Write-Host "     [ERROR] Folder does not exist: $folderPath" -ForegroundColor Red
        continue
    }

    Push-Location $folderPath

    # 1. Clean Git remotes and attach new GitHub remote if specified
    if (Test-Path ".git") {
        Write-Host "     Existing Git repository detected." -ForegroundColor Gray
    } else {
        Write-Host "     Initializing new Git repository..." -ForegroundColor Gray
        git init -b main
    }

    if ($NewGithubOrg -ne "YOUR_NEW_GITHUB_USER_OR_ORG") {
        $remoteUrl = "https://github.com/$NewGithubOrg/$($item.Name).git"
        Write-Host "     Setting origin remote to $remoteUrl" -ForegroundColor Green
        git remote remove origin 2>$null
        git remote add origin $remoteUrl
        git add .
        git commit -m "feat(agency): initialize production deployment for new agency" 2>$null
        Write-Host "     To push now: git push -u origin main" -ForegroundColor DarkCyan
    }

    # 2. Deploy to New Vercel Account
    Write-Host "     Deploying to Vercel..." -ForegroundColor Cyan
    $vercelCmd = "vercel --prod --yes"
    if ($NewVercelScope -ne "") {
        $vercelCmd += " --scope $NewVercelScope"
    }

    Write-Host "     Executing: $vercelCmd" -ForegroundColor DarkYellow
    Invoke-Expression $vercelCmd

    Pop-Location
}

Write-Host "`n=================================================================" -ForegroundColor Green
Write-Host " ALL 5 AGENCY PROJECTS MIGRATED AND DEPLOYED!" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green
