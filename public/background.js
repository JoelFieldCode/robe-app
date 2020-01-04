if (chrome.tabs) {
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
      if (!activeTab) {
        return;
      }
      try {
        var urlName = activeTab.url;
        var path = new URL(activeTab.url).pathname;
        window.$$pathName = path;
        window.$$urlName = urlName;
      } catch (error) {}
    }
  );
} else {
  window.$$pathName = window.location.pathname;
  window.$$urlName = window.location.href;
}
