# 目标
- 默认 Node 为 `v24.7.0`，在本机使用 nvm“临时切换”到 Node 18 以便打包 Logseq，完成后再切回 `v24.7.0`

# 安装与初始化 nvm（Apple 芯片，一键脚本）
```bash
#!/usr/bin/env bash
set -e

if ! command -v nvm >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    brew install nvm
  fi
fi

mkdir -p "$HOME/.nvm"

ZSHRC="$HOME/.zshrc"
append_line() { grep -qxF "$1" "$ZSHRC" || printf "%s\n" "$1" >> "$ZSHRC"; }

append_line 'export NVM_DIR="$HOME/.nvm"'
append_line '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && . "/opt/homebrew/opt/nvm/nvm.sh"'
append_line '[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && . "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"'

. "$ZSHRC"
```



# 一键构建：临时切到 Node 18 打包 Logseq 并恢复
```bash
set -e
cd /Users/lizhifeng/fengshuzi/src/jarvis/logseq
nvm install 18
nvm use 18
yarn
yarn release-electron
nvm use 24.7.0
```

# Java 临时切换到 17（Apple 芯片）
```bash
set -e

brew list --versions openjdk@17 >/dev/null 2>&1 || brew install openjdk@17

export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
java -version

cd /Users/lizhifeng/fengshuzi/src/jarvis/logseq
yarn && yarn release-electron

export JAVA_HOME="/Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
java -version
```

# 打包完成后切回默认 Node 版本
- 如果 `v24.7.0` 已通过 nvm 安装：`nvm use 24.7.0`
- 如果未安装：`nvm install 24.7.0 && nvm use 24.7.0`
- 可设置默认（非必须）：`nvm alias default 24.7.0`

# 常见问题
- `nvm: command not found`：确认已在 `~/.zshrc` 添加并加载 nvm 初始化；重新打开终端或执行 `source ~/.zshrc`。
- 构建失败缺依赖：首次构建需安装 Clojure CLI 与 JDK 17；在项目根执行 `yarn` 安装前端依赖。
- Apple Silicon 架构：`node -v && uname -m` 可检查版本与架构；如需指定 ARM 架构打包可使用 `cd static && yarn electron:make-macos-arm64`。