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
        window.$$title = activeTab.title;
        window.$$urlName = urlName;
      } catch (error) {}
    }
  );
} else {
  window.$$title = window.title;
  window.$$urlName = window.location.href;
}
