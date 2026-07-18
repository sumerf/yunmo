export type FriendLink = {
  name: string;
  url: string;
  avatar: string;
  description: string;
};

export const friends: FriendLink[] = [
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
