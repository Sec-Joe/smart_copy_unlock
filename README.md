# 智能复制解锁 🚀

> 一键绕过网站复制限制，Ctrl+C 即可复制所需内容

[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-✔-brightgreen)](https://www.tampermonkey.net/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📖 概述

国内大量技术社区（如 51cto、CSDN、希赛网等）要求用户**登录后才能复制**文章内容。当尝试复制时，网站会弹出登录弹窗或阻止复制操作。

本 Tampermonkey 脚本在**捕获阶段**（Capture Phase）拦截 `copy` 事件，**先于网站的处理器执行**，阻止登录弹窗出现，然后手动将选中文本写入剪贴板。

## ✨ 特性

- 🎯 **一键复制** — 按 `Ctrl+C` 直接复制，无弹窗打扰
- ⚡ **捕获阶段拦截** — 比网站的冒泡阶段处理器更早执行
- 🔄 **双重降级** — Clipboard API → `execCommand('copy')`，兼容 HTTP/HTTPS
- 🔍 **自动监控** — 监听 DOM 变化，动态元素也逃不掉
- 🍃 **轻量无依赖** — 纯原生 JS，零外部依赖
- ✅ **绿色提示** — 复制成功/失败一目了然

## 🚀 安装

### 前置条件

安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展（支持 Chrome / Edge / Firefox / Safari）

### 安装步骤

**方法一：直接安装（推荐）**

1. 点击链接直接安装：[smart-copy-unlock.user.js](https://github.com/Sec-Joe/smart_copy_unlock/raw/main/smart-copy-unlock.user.js)
2. Tampermonkey 会自动弹出安装页面，点击「安装」

**方法二：手动安装**

1. 打开 Tampermonkey 管理面板 →「添加新脚本」
2. 删除所有默认代码，粘贴 [smart-copy-unlock.user.js](smart-copy-unlock.user.js) 的完整内容
3. 保存（`Ctrl+S`）
4. 刷新目标页面即可生效

## 🎯 使用方法

| 操作 | 效果 |
|------|------|
| 选中文本 → `Ctrl+C` | ✅ 自动复制到剪贴板 |
| 右键菜单 → 复制 | ✅ 同样生效 |
| 正常网站（无限制） | ✅ 不影响浏览器原生复制行为 |

> 💡 **提示**：脚本运行后会在页面右下角短暂显示绿色 `✅ 已复制` 提示（2秒后自动消失）

## 🧠 实现原理

```
用户按 Ctrl+C
     │
     ▼
浏览器触发 copy 事件
     │
     ├─ [⚠️ 捕获阶段] ── 本脚本拦截（capture: true）
     │   ├── e.preventDefault()          ← 阻止网站处理器
     │   ├── e.stopImmediatePropagation() ← 阻止其他监听器
     │   └── 手动写入剪贴板 ✅
     │
     └─ [👻 冒泡阶段] ── 网站的登录弹窗处理器（永远不会执行）
```

**关键技术：**
- `addEventListener(type, handler, true)` — 第3个参数 `true` 表示在捕获阶段监听，比网站的冒泡阶段处理器优先执行
- `navigator.clipboard.writeText()` — 现代 Clipboard API
- `document.execCommand('copy')` — 兼容 HTTP 的降级方案
- `MutationObserver` — 监控 DOM 变化，自动清除动态添加的限制

## 📁 文件结构

```
smart-copy-unlock/
├── smart-copy-unlock.user.js   # Tampermonkey 脚本（主文件）
├── README.md                   # 本文件
└── LICENSE                     # MIT 许可证
```

## 🔧 自定义配置

如需调整脚本行为，可修改以下部分：

```javascript
// 修改提示文字（第 170 行附近）
showToast('✅ 已复制（v5.1）');

// 关闭提示（删除或注释掉 showToast 调用）
// showToast('✅ 已复制（v5.1）');
```

## 📋 兼容性

| 浏览器 | 支持情况 |
|--------|---------|
| Chrome | ✅ 通过 |
| Edge | ✅ 通过 |
| Firefox | ✅ 通过 |
| Safari | ✅ 通过 |

| 网站 | 支持情况 |
|------|---------|
| 51cto (rkb.51cto.com) | ✅ 通过 |
| CSDN | ✅ 通过 |
| 希赛网 | ✅ 通过 |
| 其他需要登录复制的网站 | ✅ 理论兼容 |

## ⚠️ 注意事项

- 本脚本**仅用于个人学习研究**，请尊重网站的内容版权
- 对于正常允许复制的网站，脚本不干涉原生复制行为
- 如果某个网站无法复制，请提交 Issue 并提供网址

## 🤝 贡献

欢迎提交 Issue 和 PR！如果你发现某个网站无法复制：

1. 在对应网站上按 `F12` 打开开发者工具
2. 在 Console 中查看是否有本脚本的输出
3. [提交 Issue](https://github.com/Sec-Joe/smart_copy_unlock/issues) 并附上网址和截图

## 📄 许可

[MIT License](LICENSE) © 2025 JoeSec
