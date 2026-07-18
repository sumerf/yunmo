(() => {
  const container = document.getElementById("post-content");
  if (!container) return;

  const lightbox = document.getElementById("image-lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const tocLinks = [...document.querySelectorAll("[data-toc-link]")];
  const images = [...container.querySelectorAll("img")].filter((img) => !img.closest(".wechat-share"));
  let activeIndex = 0;
  let touchStartX = 0;

  const bilibiliMatch = (href) => href.match(/bilibili\.com\/video\/(BV[\w]+|av\d+)/i);

  container.querySelectorAll("p > a:only-child").forEach((anchor) => {
    const href = anchor.getAttribute("href") ?? "";
    const match = bilibiliMatch(href);
    if (!match) return;

    const videoId = match[1];
    const iframe = document.createElement("iframe");
    iframe.src = videoId.toUpperCase().startsWith("BV")
      ? `https://player.bilibili.com/player.html?bvid=${videoId}&autoplay=0`
      : `https://player.bilibili.com/player.html?aid=${videoId.replace(/^av/i, "")}&autoplay=0`;
    iframe.loading = "lazy";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.className = "bilibili-embed";

    const wrap = document.createElement("div");
    wrap.className = "embed-shell";
    wrap.appendChild(iframe);
    anchor.parentElement?.replaceWith(wrap);
  });

  container.querySelectorAll("pre").forEach((pre) => {
    if (pre.querySelector(".code-copy")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy";
    button.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="9" y="9" width="10" height="10" rx="2"></rect>
        <rect x="5" y="5" width="10" height="10" rx="2"></rect>
      </svg>
    `;
    button.setAttribute("aria-label", "复制代码");
    button.addEventListener("click", async () => {
      const code = pre.querySelector("code");
      const content = code?.textContent ?? pre.textContent ?? "";
      if (!content.trim()) return;
      try {
        await navigator.clipboard.writeText(content);
        button.classList.add("is-copied");
        window.setTimeout(() => button.classList.remove("is-copied"), 1400);
      } catch {
        button.classList.add("is-failed");
        window.setTimeout(() => button.classList.remove("is-failed"), 1400);
      }
    });
    pre.appendChild(button);
  });

  const renderImage = (index) => {
    const target = images[index];
    if (!target || !lightboxImage) return;
    activeIndex = index;
    lightboxImage.src = target.currentSrc || target.src;
    lightboxImage.alt = target.alt || "";
  };

  const openLightbox = (index) => {
    renderImage(index);
    lightbox?.classList.add("is-open");
    lightbox?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox?.classList.remove("is-open");
    lightbox?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const moveLightbox = (delta) => {
    if (!images.length) return;
    renderImage((activeIndex + delta + images.length) % images.length);
  };

  images.forEach((img, index) => {
    img.classList.add("zoomable-image");
    img.addEventListener("click", () => openLightbox(index));
  });

  if ("IntersectionObserver" in window && tocLinks.length) {
    const headingMap = new Map(
      tocLinks
        .map((link) => {
          const slug = link.getAttribute("href")?.slice(1);
          const heading = slug ? document.getElementById(slug) : null;
          return heading ? [heading, link] : null;
        })
        .filter(Boolean)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (!visible) return;
        tocLinks.forEach((link) => link.classList.remove("is-active"));
        headingMap.get(visible.target)?.classList.add("is-active");
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 1]
      }
    );

    headingMap.forEach((_, heading) => observer.observe(heading));
  }

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightboxPrev?.addEventListener("click", () => moveLightbox(-1));
  lightboxNext?.addEventListener("click", () => moveLightbox(1));

  document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") moveLightbox(-1);
    if (event.key === "ArrowRight") moveLightbox(1);
  });

  lightbox?.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0]?.clientX ?? 0;
  }, { passive: true });

  lightbox?.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0]?.clientX ?? 0;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) < 36) return;
    moveLightbox(delta > 0 ? -1 : 1);
  }, { passive: true });
})();
