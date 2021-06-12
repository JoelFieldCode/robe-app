function getSelection(info) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "select_image", data: info },
      function (response) {}
    );
  });
}
chrome.contextMenus.create({
  title: "Save",
  contexts: ["selection", "image"],
  onclick: getSelection,
});
