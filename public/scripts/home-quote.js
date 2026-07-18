(() => {
  const hero = document.getElementById("home-quote");
  const quoteTextEl = document.getElementById("quote-text");
  const quoteAuthorEl = document.getElementById("quote-author");

  if (!hero || !quoteTextEl || !quoteAuthorEl) return;

  const quoteMode = hero.dataset.quoteMode === "local" ? "local" : "api";
  const quoteApi = hero.dataset.quoteApi || "";

  const normalizeAuthor = (fromWho, from) => {
    const author = fromWho || from || "";
    return author ? (author.startsWith("——") ? author : `—— ${author}`) : "";
  };

  if (quoteMode === "local") {
    quoteAuthorEl.textContent = normalizeAuthor(quoteAuthorEl.textContent, "");
    return;
  }

  if (!quoteApi) return;

  fetch(quoteApi, {
    headers: {
      Accept: "application/json"
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Quote API request failed: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data?.hitokoto) return;
      quoteTextEl.textContent = data.hitokoto;
      quoteAuthorEl.textContent = normalizeAuthor(data.from_who, data.from);
    })
    .catch(() => {
      // Keep the quote area empty when the API is unavailable.
    });
})();
