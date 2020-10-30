function ping() {
  if (typeof chrome.app.isInstalled !== "undefined") {
    chrome.runtime.sendMessage("ping", (response) => {
      if (chrome.runtime.lastError) {
        setTimeout(ping, 1000);
      } else {
        const imgs = [];
        const imgElements = document.querySelectorAll("img");
        imgElements.forEach((img) => imgs.push(img.src));
        chrome.runtime.sendMessage(imgs);
      }
    });
  }
}
ping();
