type FriendLink = {
  name: string;
  url: string;
  avatar: string;
  description: string;
};

const friends: FriendLink[] = [
  {
    name: "Tangbao",
    url: "https://blog.tangbao.ltd/",
    avatar: "https://blog.tangbao.ltd/favicon.ico",
    description: "清爽、安静、偏日常写作气质的个人博客。"
  },
  {
    name: "Astro",
    url: "https://astro.build/",
    avatar: "https://astro.build/favicon.svg",
    description: "内容驱动站点框架，适合静态博客和主题开发。"
  },
  {
    name: "Bilibili",
    url: "https://www.bilibili.com/",
    avatar: "https://www.bilibili.com/favicon.ico",
    description: "视频内容与创作社区，也可以作为文章嵌入的视频来源。"
  }
];

const fallbackAvatar = (name: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="28" fill="#f3dae3"/><text x="48" y="56" text-anchor="middle" font-size="34" fill="#b16083" font-family="Arial, sans-serif">${name.slice(0, 1).toUpperCase()}</text></svg>`
  )}`;

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export const buildFriendCardsHtml = () =>
  friends
    .map((friend) => {
      const fallback = fallbackAvatar(friend.name);
      return `
        <a class="friend-card" href="${escapeHtml(friend.url)}" target="_blank" rel="noopener noreferrer">
          <span class="friend-avatar">
            <img
              src="${escapeHtml(friend.avatar)}"
              alt="${escapeHtml(friend.name)}"
              width="56"
              height="56"
              loading="lazy"
              data-fallback="${escapeHtml(fallback)}"
              onerror="if (this.dataset.fallback && this.src !== this.dataset.fallback) { this.src = this.dataset.fallback; }"
            />
          </span>
          <div class="friend-copy">
            <strong>${escapeHtml(friend.name)}</strong>
            <span>${escapeHtml(friend.description)}</span>
          </div>
        </a>
      `;
    })
    .join("");
