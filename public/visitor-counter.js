const humanCount = document.querySelector("#human-visits");
const aiCount = document.querySelector("#ai-visits");
const counterStatus = document.querySelector("#visit-counter");

if (humanCount && aiCount && counterStatus) {
  fetch("/api/visits", { headers: { Accept: "application/json" }, cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error(`counter request failed: ${response.status}`);
      return response.json();
    })
    .then(({ human, ai }) => {
      const formatter = new Intl.NumberFormat("ja-JP");
      humanCount.textContent = formatter.format(human);
      aiCount.textContent = formatter.format(ai);
      counterStatus.dataset.state = "ready";
    })
    .catch(() => {
      counterStatus.dataset.state = "unavailable";
      humanCount.textContent = "—";
      aiCount.textContent = "—";
    });
}
