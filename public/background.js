chrome.tabs.query(
  {
    //This method output active URL
    active: true,
    currentWindow: true,
    status: "complete",
    windowType: "normal"
  },
  function(tabs) {
    var activeTab = tabs[0];
    var urlName = activeTab.url;
    var path = new URL(activeTab.url).pathname;
    window.$$pathName = path;
    window.$$urlName = urlName;
  }
);
