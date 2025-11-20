好的，我帮你把你整理的文档 **重新梳理成结构更清晰、流程完整、可直接参考的 macOS 构建指南**，把环境、命令、注意事项、常见错误、签名处理都整合进去：

---

# 🍎 Logseq macOS 桌面应用完整构建指南（Apple Silicon & Intel）

## 1. 系统要求

* macOS 12 或更高版本
* Apple Silicon（M1/M2/M3）或 Intel CPU
* Xcode + Command Line Tools

```bash
xcode-select --install
```

---

## 2. 安装 Node 和 Yarn

* **Node.js**：**18.x**（官方 CI 构建版本）

  > Node 16 可用，但 Node >18 不支持

```bash
brew install nvm
nvm install 18
nvm use 18
```

* **Yarn**：>=1.22

```bash
npm install -g yarn
yarn -v
```

---

## 3. 安装 Java / Clojure

* **JDK 17**（用于 ClojureScript 编译）

```bash
brew install openjdk@17
export PATH="/usr/local/opt/openjdk@17/bin:$PATH"
java -version
```

* **Clojure CLI**（Logseq 构建必须）

```bash
brew install clojure/tools/clojure
clojure --version
```

---

## 4. 克隆 Logseq 仓库

```bash
git clone https://github.com/logseq/logseq.git
cd logseq
```

* 建议使用稳定 release 标签：

```bash
git checkout tags/0.10.9
```

---

## 5. 安装项目依赖

```bash
rm -rf node_modules .shadow-cljs target
yarn
```

---

## 6. 重建 Electron 原生模块

```bash
npx electron-rebuild
```

* Apple Silicon 用户：

```bash
export npm_config_arch=arm64
export npm_config_platform=darwin
npx electron-rebuild
```

---

## 7. 构建开发版

* 前端热重载调试：

```bash
yarn watch
```

* Electron 桌面调试：

```bash
yarn dev-electron-app
```

---

## 8. 构建发布版（Mac .dmg / .zip）

1. 单独构建 ClojureScript：

```bash
yarn cljs:release-electron
```

2. 打包 macOS 应用：

```bash
yarn release-electron
```

* 输出路径：`release-builds/Logseq-*.dmg`

---

## 9. Apple Silicon 构建注意事项

* 设置架构：

```bash
export npm_config_arch=arm64
export npm_config_platform=darwin
```

* Node >18 不兼容 ClojureScript + Electron，请保持 Node 18
* 确保 JDK 17 和 clojure CLI 可用

---

## 10. 常见错误及解决方法

| 错误信息                                   | 原因                                    | 解决方法                                                       |
| -------------------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| `/bin/sh: clojure: command not found`  | Clojure CLI 未安装                       | `brew install clojure/tools/clojure`                       |
| `electron:rebuild not found`           | electron-rebuild 未安装或 yarn script 未定义 | `yarn add --dev electron-rebuild` + `npx electron-rebuild` |
| Node 版本过高导致 `cljs:release-electron` 失败 | Node >18 不兼容                          | 使用 Node 18                                                 |
| M1/M2 构建失败                             | 原生模块架构不匹配                             | `export npm_config_arch=arm64`                             |

---

## 11. 本地构建签名和 notarize 处理

如果不需要对外发布或 Apple 公证，可跳过签名和 notarize，避免报错：

```
Error: No authentication properties provided (e.g. appleId, appleApiKey)
```

**方法 1：修改 forge.config.js**

```js
const path = require('path');

module.exports = {
  packagerConfig: {
    name: 'Logseq',
    icon: './icons/logseq_big_sur.icns',
    buildVersion: 75,
    asar: true,
    protocols: [
      {
        protocol: 'logseq',
        name: 'logseq',
        schemes: ['logseq']
      }
    ]
  },
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {
        name: 'Logseq',
        icon: './icons/logseq_big_sur.icns'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    }
  ]
};

```

然后重新构建：

```bash
yarn release-electron
```

* 这样生成的 `.dmg` 就不会再要求 Apple ID / API Key
* 适合本地开发、测试和定制化开发

---

## 12. 建议

* 建议 fork Logseq 仓库用于二开和定制化
* 修改前端 UI 或插件开发，可先用热重载调试 (`yarn watch` + `yarn dev-electron-app`)
* 打包发布版本时再执行 `yarn release-electron`
