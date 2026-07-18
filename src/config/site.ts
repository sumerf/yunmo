export const siteConfig = {
  name: "Yunmo",
  title: "Yunmo",
  description: "A clean, airy Astro blog theme with glass navigation and an Eastern calm.",
  site: "",
  author: "Yunmo",
  locale: "zh_CN",
  ogImage: "https://t.alcy.cc/fj",
  backgroundImage: "https://t.alcy.cc/fj",
  favicon: "/favicon.svg",
  homeQuote: {
    mode: "api",
    api: "https://v1.hitokoto.cn/?encode=json&charset=utf-8",
    text: "云开见月，风止有声。",
    author: "Yunmo"
  }
};

export const navLinks = [
  { href: "/", label: "首页" },
  { href: "/archives", label: "归档" },
  { href: "/tags", label: "标签" },
  { href: "/friends", label: "友链" },
  { href: "/about", label: "关于" }
];
