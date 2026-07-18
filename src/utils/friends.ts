const FALLBACK_BACKGROUND = "#f3dae3";
const FALLBACK_FOREGROUND = "#b16083";

export const createFriendFallbackAvatar = (name: string) => {
  const initial = name.trim().charAt(0).toUpperCase() || "Y";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <rect width="96" height="96" rx="28" fill="${FALLBACK_BACKGROUND}"/>
      <text
        x="48"
        y="56"
        text-anchor="middle"
        font-size="34"
        fill="${FALLBACK_FOREGROUND}"
        font-family="Arial, sans-serif"
      >${initial}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
};
