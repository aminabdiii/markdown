---
title: 'wsl2-proxy-network-fix-summary'
date: '2025-02-10'
---

# 🛠️ WSL2 Network and Proxy Troubleshooting Summary

## 1. Initial Problem

- WSL2 was running with **Mirrored Networking** enabled.
- Upon attempting to connect to the internet:
  - `ping 8.8.8.8` failed to respond.
  - Tools like **`pnpm`** and **`git`** encountered connection errors to an internal proxy: **`10.255.255.254:3128`**.
- This issue caused all HTTP/HTTPS requests to be routed through a non-existent proxy server.

---

## 2. Checks and Diagnostics 🔍

| Tool/Area | Command Executed | Output/Diagnosis |
| :--- | :--- | :--- |
| **Network Connection** | `ip addr` | Output showed only `lo` (loopback); no `eth0` or valid network IP was present. |
| **Environment Variables** | `env | grep -i proxy` | Proxies were set to: `http://10.255.255.254:3128` |
| **Git Configuration** | `git config --list --show-origin | grep proxy` | Git proxy was **not active** at the user or project level. |
| **Windows WinHTTP** | `netsh winhttp show proxy` | Windows proxy was set to **`Direct access (no proxy server)`**. The issue was not originating from Windows. |
| **Shell Config Files** | `grep -i proxy ~/.bashrc ~/.zshrc ~/.profile` | The old proxy was set in **`~/.zshrc`**: `export HTTP_PROXY=...` and `export HTTPS_PROXY=...` |

---

## 3. Actions Taken ✅

### A. Removing Temporary and Permanent Proxies

1.  **Disabling Proxy in the Current Terminal Session:**
    ```bash
    unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
    # This allowed pnpm install to complete without connection errors.
    ```
2.  **Cleaning Up Hard-Coded Proxies in Shell (`~/.zshrc`):**
    - The following lines were **removed or commented out** from `~/.zshrc`:
      ```bash
      # export HTTP_PROXY=[http://10.255.255.254:3128](http://10.255.255.254:3128)
      # export HTTPS_PROXY=[http://10.255.255.254:3128](http://10.255.255.254:3128)
      ```
    - The file was then reloaded:
      ```bash
      source ~/.zshrc
      ```
3.  **Removing Git Proxy (If applicable):**
    ```bash
    git config --global --unset http.proxy
    git config --global --unset https.proxy
    # Repeat for --system and --local if necessary
    ```

### B. Network Reset and Stability Changes

1.  **Complete WSL Reset:**
    ```bash
    wsl --shutdown
    # This cleared any previous proxy caches.
    ```
2.  **Switched from Mirrored Mode to NAT Mode in `.wslconfig`:**
    - The following setting was applied in the file **`C:\Users\<UserName>\.wslconfig`**:
      ```ini
      [experimental]
      networkingMode=nat
      ```
    - > **Note:** NAT Mode is more stable and prevents the use of the `localhost` Mirrored proxy.

---

## 4. Testing and Conclusion ✨

- **Final Environment Variable Check:**
  ```bash
  env | grep -i proxy
  # → No proxies were displayed.
  ```
- **Tool Testing:**
  - `pnpm install` completed without errors.
  - Git clone and push to GitHub worked without issues:
    ```bash
    git clone [https://github.com/aminabdiii/markdown.git](https://github.com/aminabdiii/markdown.git)
    git push
    ```

### ✅ Final Result:

All old proxies have been removed, the WSL network is stable under **NAT Mode**, and **Git** and **`pnpm`** tools are functioning correctly without relying on any internal proxy.
