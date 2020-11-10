chrome.runtime.onMessage.addListener((message, sender, sendRes) => {
  const imgs = [];
  const imgElements = document.querySelectorAll("body img");
  const keyWordsToIgnore = [
    "zipmoney",
    "afterpay",
    "logo",
    "header",
    "footer",
    "menu",
    "chat",
    "location",
    "facebook",
    "twitter",
    "instagram",
    "youtube",
    "App store",
    "Google play",
    "Visa",
    "Amex",
    "Paypal",
    "Mastercard",
  ];
  imgElements.forEach((img) => imgs.push(img));
  const filteredImages = imgs
    .filter((img) => {
      return (
        img.src &&
        img.src.length &&
        !keyWordsToIgnore.find((keyWord) => {
          return (
            (img.alt &&
              img.alt.toLowerCase().includes(keyWord.toLowerCase())) ||
            (img.classList && img.classList.contains(keyWord.toLowerCase()))
          );
        })
      );
    })
    .sort(
      (imgA, imgB) =>
        imgA.getBoundingClientRect().top - imgB.getBoundingClientRect().top
    )
    .map((img) => img.src);
  sendRes(filteredImages);
});
