(() => {
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const getResolvedTheme = (theme) => {
    if (theme === "light" || theme === "dark") return theme;
    return media.matches ? "dark" : "light";
  };

  const syncTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    const theme = savedTheme === "light" || savedTheme === "dark" || savedTheme === "system" ? savedTheme : "system";
    root.dataset.theme = theme;
    root.dataset.resolvedTheme = getResolvedTheme(theme);
    root.style.colorScheme = root.dataset.resolvedTheme;
  };

  window.__yunmoSyncTheme = syncTheme;
  syncTheme();

  media.addEventListener("change", () => {
    if ((localStorage.getItem("theme") ?? "system") === "system") {
      syncTheme();
    }
  });
})();
