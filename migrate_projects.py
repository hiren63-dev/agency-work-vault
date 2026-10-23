"""
================================================================================
AGENCY PORTFOLIO & REPO MIGRATION ENGINE
================================================================================
This script consolidates, sanitizes, and stages all 5 projects featured on
hiren.website/work into a clean staging folder ready to push to your new
GitHub organization and deploy to your new Vercel account.
"""

import os
import shutil
import subprocess
import json

VAULT_ROOT = os.path.dirname(os.path.abspath(__file__))
EXPORT_DIR = os.path.join(VAULT_ROOT, "migrated_projects")

PROJECTS_SOURCE = {
    "bnps": {
        "source": r"c:\Users\zediz\Downloads\Portfolio\bnps",
        "description": "BNPS Chartered Accountants & Legal Infrastructure Firm",
        "type": "Vanilla ES Modules + Node Build",
        "buildCommand": "node build.mjs",
        "outputDirectory": "dist",
        "framework": None,
        "defaultDomain": "bnps-agency.vercel.app"
    },
    "harsh-manek": {
        "source": r"c:\Users\zediz\OneDrive\Desktop\antigravity projects\harshmanek-portfolio",
        "description": "Harsh Manek Financial Advisory & Practice Portal",
        "type": "Vite + React + Tailwind + Supabase",
        "buildCommand": "npm run build",
        "outputDirectory": "dist",
        "framework": "vite",
        "defaultDomain": "harshmanek-agency.vercel.app"
    },
    "kadivar-associates": {
        "source": r"D:\Archived_Projects_and_Data\kadivar-redesign",
        "description": "Kadivar & Associates Structural Architectural & Tax Firm",
        "type": "Next.js 15 App Router + Framer Motion + Lenis",
        "buildCommand": "npm run build",
        "outputDirectory": None,
        "framework": "nextjs",
        "defaultDomain": "kadivar-agency.vercel.app"
    },
    "pulse-gms": {
        "source": r"c:\Users\zediz\Downloads\Portfolio\gym-source",
        "description": "Pulse Studio Gym Management System (Multi-tenant)",
        "type": "Full-Stack Node.js API + Web Push + Dashboard",
        "buildCommand": None,
        "outputDirectory": "GMS-deploy",
        "framework": None,
        "defaultDomain": "pulse-gms-agency.vercel.app"
    },
    "buddydesk": {
        "source": r"c:\Users\zediz\Downloads\Portfolio\buddydesk-source",
        "description": "BuddyDesk Startup CRM & Team Workspace Hub",
        "type": "Vite + React + Firebase Firestore + Electron + MCP Server",
        "buildCommand": "npm run build:renderer",
        "outputDirectory": "dist",
        "framework": "vite",
        "defaultDomain": "buddydesk-agency.vercel.app"
    }
}

def stage_projects():
    print(f"Creating migration export directory at: {EXPORT_DIR}")
    os.makedirs(EXPORT_DIR, exist_ok=True)
    
    summary = []
    
    for key, info in PROJECTS_SOURCE.items():
        src = info["source"]
        dst = os.path.join(EXPORT_DIR, key)
        print(f"\n---> Processing [{key}] from {src}")
        
        if not os.path.exists(src):
            print(f"     [!] Warning: Source directory does not exist: {src}")
            continue
            
        # Ignore heavy build artifacts that regenerate
        ignore_patterns = shutil.ignore_patterns(
            "node_modules", ".next", ".turbo", ".vercel", "dist", "*.log"
        )
        
        if os.path.exists(dst):
            print(f"     Target already exists, refreshing...")
            shutil.rmtree(dst)
            
        shutil.copytree(src, dst, ignore=ignore_patterns)
        print(f"     Copied cleanly into: {dst}")
        
        # Create a fresh vercel.json in the staged project
        v_config = {
            "version": 2,
            "name": f"agency-{key}",
        }
        if info["buildCommand"]:
            v_config["buildCommand"] = info["buildCommand"]
        if info["outputDirectory"]:
            v_config["outputDirectory"] = info["outputDirectory"]
        if info["framework"]:
            v_config["framework"] = info["framework"]
            
        vercel_json_path = os.path.join(dst, "vercel.json")
        if not os.path.exists(vercel_json_path):
            with open(vercel_json_path, "w", encoding="utf-8") as f:
                json.dump(v_config, f, indent=2)
            print(f"     Generated custom vercel.json")
            
        summary.append({
            "key": key,
            "staged_path": dst,
            "type": info["type"],
            "buildCommand": info["buildCommand"],
            "outputDirectory": info["outputDirectory"]
        })
        
    print("\n=======================================================")
    print("MIGRATION STAGING COMPLETE!")
    print(f"Total projects staged: {len(summary)}")
    print("=======================================================\n")

if __name__ == "__main__":
    stage_projects()
