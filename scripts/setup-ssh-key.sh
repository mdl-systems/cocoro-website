#!/bin/bash
# WSLで直接実行するSSHパスワード自動入力スクリプト
set -e

PASS="UDM.r7K9Hy33"
REMOTE="mdl-japan@www3398.sakura.ne.jp"
PUBKEY=$(cat /mnt/c/Users/MDL/.ssh/id_ed25519.pub)

echo "▶ Registering public key on sakura server..."

# Python pty で自動パスワード入力
python3 << PYEOF
import pty, os, sys, time, select

PASS = "${PASS}"
PUBKEY = """${PUBKEY}"""
REMOTE = "${REMOTE}"

cmd_str = f"mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '{PUBKEY}' >> ~/.ssh/authorized_keys && sort -u ~/.ssh/authorized_keys -o ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo KEY_INSTALLED"

cmd = ["ssh", "-o", "StrictHostKeyChecking=accept-new", REMOTE, cmd_str]

master, slave = pty.openpty()
pid = os.fork()
if pid == 0:
    os.setsid()
    os.dup2(slave, 0); os.dup2(slave, 1); os.dup2(slave, 2)
    os.close(master)
    os.execvp(cmd[0], cmd)
    sys.exit(1)

os.close(slave)
pw_sent = False
buf = b""

for _ in range(60):
    r, _, _ = select.select([master], [], [], 1)
    if r:
        try:
            data = os.read(master, 4096)
            buf += data
            sys.stdout.buffer.write(data)
            sys.stdout.flush()
            if not pw_sent and b"password:" in buf.lower():
                time.sleep(0.3)
                os.write(master, (PASS + "\n").encode())
                pw_sent = True
        except OSError:
            break
    try:
        wpid, status = os.waitpid(pid, os.WNOHANG)
        if wpid:
            sys.exit(os.WEXITSTATUS(status))
    except ChildProcessError:
        break

os.waitpid(pid, 0)
os.close(master)
PYEOF

echo "▶ Testing key-based SSH..."
ssh -i /mnt/c/Users/MDL/.ssh/id_ed25519 \
  -o StrictHostKeyChecking=accept-new \
  -o BatchMode=yes \
  "$REMOTE" "echo SSH_KEY_AUTH_OK && uname -a"
