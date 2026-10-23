import os
import subprocess

try:
    import rembg
except ImportError:
    subprocess.check_call(["pip", "install", "rembg[cli]"])

subprocess.check_call(["rembg", "i", "C:\\Users\\zediz\\Downloads\\Portrait_of_person_with_folded_202608291341.jpeg", "C:\\Users\\zediz\\OneDrive\\Desktop\\antigravity projects\\harshmanek-portfolio\\public\\harsh_nobg.png"])

