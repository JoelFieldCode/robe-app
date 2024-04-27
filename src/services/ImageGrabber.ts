export function grabImages(): Promise<{
  images: string[];
  urlName: string;
  title: string;
}> {
  return new Promise((resolve, reject) => {
    if (chrome.extension && chrome.runtime) {
      chrome.tabs.query(
        {
          //This method output active URL
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          const activeTab = tabs[0];
          if (!activeTab) {
            return;
          }
          chrome.tabs.sendMessage(
            activeTab.id!,
            { type: "getImages" },
            function (images: string[]) {
              const urlName = activeTab.url;
              const title = activeTab.title;
              resolve({
                images,
                urlName: urlName ? urlName : "",
                title: title ? title : "",
              });
            }
          );
        }
      );
    } else {
      resolve({
        images: [
          "https://www.forevernew.com.au/media/catalog/product/A/l/AllTerritories_OnBody_26572201_D.jpg",
          "https://www.forevernew.com.au/media/catalog/product/A/l/AllTerritories_OnBody_26572201_D.jpg",
          "https://www.forevernew.com.au/media/catalog/product/A/l/AllTerritories_OnBody_26572201_D.jpg",
          "https://www.forevernew.com.au/media/catalog/product/A/l/AllTerritories_OnBody_26572201_D.jpg",
          "https://www.forevernew.com.au/media/catalog/product/A/l/AllTerritories_OnBody_26572201_D.jpg",
          "https://www.forevernew.com.au/media/catalog/product/A/l/AllTerritories_OnBody_26572201_D.jpg",
          "https://www.forevernew.com.au/media/catalog/product/A/l/AllTerritories_OnBody_26572201_D.jpg",
          "https://www.forevernew.com.au/media/catalog/product/A/l/AllTerritories_OnBody_26572201_D.jpg",
          "https://www.forevernew.com.au/media/catalog/product/A/l/AllTerritories_OnBody_26572201_D.jpg",

        ],
        urlName: "https://www.google.com",
        title: "",
      });
    }
  });
}
