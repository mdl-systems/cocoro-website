#!/usr/bin/env python3
"""
さくらサーバーへの公開鍵登録スクリプト（paramiko使用）
Usage: python3 scripts/install-pubkey.py
"""
import subprocess
import sys

REMOTE_HOST = "www3398.sakura.ne.jp"
REMOTE_USER = "mdl-japan"
REMOTE_PASS = "UDM.r7K9Hy33"
PUBKEY_PATH = "/mnt/c/Users/MDL/.ssh/id_ed25519.pub"

def main():
    # paramikoインストール確認
    try:
        import paramiko
    except ImportError:
        print("▶ Installing paramiko...")
        subprocess.run([sys.executable, "-m", "pip", "install", "paramiko", "-q"], check=True)
        import paramiko

    with open(PUBKEY_PATH) as f:
        pubkey = f.read().strip()

    print(f"▶ Connecting to {REMOTE_USER}@{REMOTE_HOST}...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(REMOTE_HOST, username=REMOTE_USER, password=REMOTE_PASS, timeout=15)

    commands = [
        "mkdir -p ~/.ssh",
        "chmod 700 ~/.ssh",
        f"echo '{pubkey}' >> ~/.ssh/authorized_keys",
        "sort -u ~/.ssh/authorized_keys -o ~/.ssh/authorized_keys",
        "chmod 600 ~/.ssh/authorized_keys",
        "echo KEY_INSTALLED",
    ]

    for cmd in commands:
        _, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode().strip()
        err = stderr.read().decode().strip()
        if out: print(f"  {out}")
        if err: print(f"  ERR: {err}", file=sys.stderr)

    client.close()
    print("✓ Public key installed on sakura server!")
    print("  Next deploys will not require a password.")

if __name__ == "__main__":
    main()
