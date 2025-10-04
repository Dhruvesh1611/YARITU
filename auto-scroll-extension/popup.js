const btn = document.getElementById("toggleBtn");

function updateButtonText(isOn) {
  btn.textContent = isOn ? "✅ Auto-Scroll ON" : "⛔ Auto-Scroll OFF";
}

chrome.storage.local.get("autoScrollEnabled", (data) => {
  const isOn = data.autoScrollEnabled ?? true;
  updateButtonText(isOn);
});

btn.addEventListener("click", () => {
  chrome.storage.local.get("autoScrollEnabled", (data) => {
    const current = data.autoScrollEnabled ?? true;
    const next = !current;

    chrome.storage.local.set({ autoScrollEnabled: next }, () => {
      updateButtonText(next);
    });
  });
});
