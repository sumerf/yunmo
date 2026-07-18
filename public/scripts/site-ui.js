(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const backToTop = document.getElementById("back-to-top");
  const shareTrigger = document.getElementById("share-trigger");
  const sharePopover = document.getElementById("share-popover");
  const shareFloat = document.getElementById("share-float");
  const wechatToggle = document.getElementById("wechat-toggle");
  const wechatShare = document.getElementById("wechat-share");
  const copyButton = document.querySelector("[data-copy-link]");
  const canonicalLink = document.getElementById("canonical-link");
  const ogUrlMeta = document.getElementById("og-url-meta");
  const jsonLdSite = document.getElementById("jsonld-site");
  const shareLinks = sharePopover?.querySelectorAll("a[href]");
  const qrImage = wechatShare?.querySelector("img");
  const themeOrder = ["system", "light", "dark"];
  const syncTheme = window.__yunmoSyncTheme || (() => {});
  const shareTitle = document.body.dataset.shareTitle || document.title;
  const shareSummary = document.body.dataset.shareSummary || "";

  const syncRuntimeUrls = () => {
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedSummary = encodeURIComponent(shareSummary);

    canonicalLink?.setAttribute("href", currentUrl);
    ogUrlMeta?.setAttribute("content", currentUrl);
    copyButton?.setAttribute("data-copy-link", currentUrl);
    qrImage?.setAttribute("src", `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodedUrl}`);

    if (shareLinks?.[0]) {
      shareLinks[0].setAttribute("href", `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`);
    }
    if (shareLinks?.[1]) {
      shareLinks[1].setAttribute("href", `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`);
    }

    if (jsonLdSite?.textContent) {
      try {
        const data = JSON.parse(jsonLdSite.textContent);
        if (data && typeof data === "object" && !Array.isArray(data)) {
          if (data.url) data.url = window.location.origin;
          if (data.mainEntityOfPage) data.mainEntityOfPage = currentUrl;
          jsonLdSite.textContent = JSON.stringify(data);
        }
      } catch {
        // Ignore invalid JSON-LD payloads.
      }
    }
  };

  const syncLabel = () => {
    const theme = root.dataset.theme || "system";
    toggle?.setAttribute("aria-label", `切换主题模式，当前${theme === "system" ? "跟随系统" : theme === "light" ? "浅色" : "深色"}`);
  };

  const applyTheme = (theme) => {
    localStorage.setItem("theme", theme);
    syncTheme();
  };

  toggle?.addEventListener("click", () => {
    const current = root.dataset.theme || "system";
    const next = themeOrder[(themeOrder.indexOf(current) + 1) % themeOrder.length];
    applyTheme(next);
    syncLabel();
  });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  shareTrigger?.addEventListener("click", () => {
    if (!sharePopover) return;
    if (sharePopover.hasAttribute("hidden")) {
      sharePopover.removeAttribute("hidden");
    } else {
      sharePopover.setAttribute("hidden", "");
      wechatShare?.classList.remove("is-open");
    }
  });

  wechatToggle?.addEventListener("click", () => {
    wechatShare?.classList.toggle("is-open");
  });

  document.addEventListener("click", (event) => {
    if (!shareFloat?.contains(event.target) && !sharePopover?.hasAttribute("hidden")) {
      sharePopover?.setAttribute("hidden", "");
      wechatShare?.classList.remove("is-open");
    }
  });

  copyButton?.addEventListener("click", async () => {
    const url = copyButton.getAttribute("data-copy-link");
    if (!url) return;
    await navigator.clipboard.writeText(url);
    copyButton.textContent = "已复制";
    window.setTimeout(() => {
      copyButton.textContent = "复制链接";
    }, 1600);
    sharePopover?.setAttribute("hidden", "");
    wechatShare?.classList.remove("is-open");
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if ((localStorage.getItem("theme") ?? "system") === "system") {
      syncTheme();
    }
    syncLabel();
  });

  syncRuntimeUrls();
  syncLabel();
})();
