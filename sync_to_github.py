import os
import subprocess

repo_url = "https://github.com/faustogm-beep/romania-uav-safety.git"

def run(cmd):
    print(f"Running: {cmd}")
    subprocess.run(cmd, shell=True, check=True)

try:
    if not os.path.exists(".git"):
        run("git init")
        run("git config user.email \"faustogm@gmail.com\"")
        run("git config user.name \"faustogm-beep\"")
        run(f"git remote add origin {repo_url}")
    
    run("git add .")
    run("git commit -m \"Sync local changes to GitHub\"")
    run("git push -f origin main")
    print("Push successful!")
except Exception as e:
    print(f"Error: {e}")
