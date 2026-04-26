import os
import subprocess

repo_url = "https://github.com/faustogm-beep/romania-uav-safety.git"

def run(cmd):
    print(f"Running: {cmd}")
    subprocess.run(cmd, shell=True, check=True)

try:
    run("git config user.email \"faustogm@gmail.com\"")
    run("git config user.name \"faustogm-beep\"")
    run("git add .")
    run("git commit -m \"v2: Added 10 languages, satellite view, and geocoding search\"")
    run("git push origin main")
    print("Push successful!")
except Exception as e:
    print(f"Error: {e}")
