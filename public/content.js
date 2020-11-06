chrome.runtime.onMessage.addListener((message, sender, sendRes) => {
  const imgs = [];
  const imgElements = document.querySelectorAll("img");
  imgElements.forEach((img) => imgs.push(img.src));
  sendRes(imgs);
});
