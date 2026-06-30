// ==UserScript==
// @name         智能复制解锁
// @name:en       Smart Copy Unlock
// @namespace    https://github.com/Sec-Joe/smart_copy_unlock
// @version      1.0.0
// @description  绕过网站复制限制，Ctrl+C 一键复制，无需登录
// @description:en  Bypass website copy restrictions. Press Ctrl+C to copy directly without login.
// @author       JoeSec
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ===== 1. 强制启用选中 =====
    const style = document.createElement('style');
    style.textContent = `
        * { user-select: text !important; -webkit-user-select: text !important; -moz-user-select: text !important; }
        * { -webkit-touch-callout: default !important; }
    `;
    (document.head || document.documentElement).appendChild(style);

    // ===== 2. 清除内联事件限制 =====
    function clearInlineHandlers() {
        document.querySelectorAll('*').forEach(el => {
            try {
                el.oncopy = null;
                el.oncut = null;
                el.oncontextmenu = null;
                el.onselectstart = null;
                el.style.userSelect = 'text';
                el.style.webkitUserSelect = 'text';
            } catch(e) {}
        });
    }
    clearInlineHandlers();

    // ===== 3. 拦截 copy 事件（捕获阶段）=====
    document.addEventListener('copy', (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        const selection = window.getSelection();
        let text = selection ? selection.toString() : '';

        if (!text.trim()) {
            // 没有选中文本时尝试获取点击元素内容
            try {
                const range = selection.getRangeAt(0);
                const container = range.commonAncestorContainer;
                const elem = container.nodeType === 3 ? container.parentNode : container;
                text = elem.innerText || elem.textContent || '';
            } catch(err) {
                text = '';
            }
        }

        if (!text.trim()) {
            showToast('⚠️ 请先选中要复制的文本');
            return;
        }

        copyToClipboard(text);
    }, true);

    // ===== 4. 复制到剪贴板 =====
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('✅ 已复制');
            }).catch(() => fallbackCopy(text));
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
            document.execCommand('copy');
            showToast('✅ 已复制');
        } catch(e) {
            showToast('❌ 复制失败');
        }
        document.body.removeChild(ta);
    }

    // ===== 5. Ctrl+C 时提前清理 =====
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
            clearInlineHandlers();
        }
    }, true);

    // ===== 6. 持续监控 DOM 变化 =====
    const observer = new MutationObserver(() => clearInlineHandlers());
    observer.observe(document, { childList: true, subtree: true });

    // ===== 7. Toast 提示 =====
    function showToast(message) {
        const old = document.getElementById('scu-toast');
        if (old) old.remove();

        const toast = document.createElement('div');
        toast.id = 'scu-toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border-radius: 6px;
            font-size: 14px;
            z-index: 2147483647 !important;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            font-family: sans-serif;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => { toast.style.opacity = '1'; });
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // ===== 8. 延迟清理 =====
    setTimeout(clearInlineHandlers, 1000);
    setTimeout(clearInlineHandlers, 3000);

})();
