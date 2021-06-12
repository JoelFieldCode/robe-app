export function grabImages(): Promise<{
  images: string[];
  urlName: string;
  title: string;
  type: "selectImages" | "imageSelected";
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
            function (res: {
              type: "selectImages" | "imageSelected";
              data: string[];
            }) {
              const urlName = activeTab.url;
              const title = activeTab.title;
              resolve({
                images: res.data,
                urlName: urlName ? urlName : "",
                title: title ? title : "",
                type: res.type,
              });
            }
          );
        }
      );
    } else {
      resolve({
        type: "imageSelected",
        images: [
          "https://www.forevernew.com.au/static/version1602800562/frontend/ForeverNew/Australia/en_AU/images/logo.svg",
          "https://www.forevernew.com.au/media/wysiwyg/megamenu/_AU_NZ/Oct_2020/MegaNav01-500x720.jpg",
          "https://www.forevernew.com.au/media/wysiwyg/megamenu/MegaNav-500x720.jpg",
          "https://www.forevernew.com.au/media/wysiwyg/megamenu/MegaNav_3.jpg",
          "https://www.forevernew.com.au/media/wysiwyg/megamenu/MegaNav_5.jpg",
          "https://www.forevernew.com.au/media/wysiwyg/megamenu/MegaNav_4.jpg",
          "https://www.forevernew.com.au/media/wysiwyg/megamenu/_AU_NZ/Oct_2020/MegaNav02-500x720_1_2x.png",
          "https://www.forevernew.com.au/media/wysiwyg/megamenu/_AU_NZ/Oct_2020/MegaNav02-500x720_2x.png",
          "https://www.forevernew.com.au/media/wysiwyg/megamenu/_AU_NZ/Sept_2020/MegaNav02-500x720_3.png",
          "https://www.forevernew.com.au/media/wysiwyg/megamenu/_AU_NZ/Sept_2020/MegaNav02-500x720_2.png",
          "https://www.forevernew.com.au/media/wysiwyg/megamenu/_AU_NZ/Sept_2020/MegaNav032-500x720.png",
          "https://www.forevernew.com.au/media/wysiwyg/megamenu/CA_MegaNav01.jpg",
          "https://www.forevernew.com.au/media/catalog/product/A/l/AllTerritories_OnBody_26572201_D.jpg",
          "https://www.forevernew.com.au/static/version1602800562/frontend/ForeverNew/Australia/en_AU/images/payment_methods/afterpay.png",
          "https://static.secure-afterpay.com.au/banner-large.png",
          "https://static.secure-afterpay.com.au/modal-mobile.png",
          "https://static.zipmoney.com.au/logo/90px/zip.png",
          "https://m2prod-www.forevernew.co.nz/media/gene-cms/s/i/sizeguide-desktop.jpg",
          "https://m2prod-www.forevernew.co.nz/media/gene-cms/s/i/sizeguide-desktop2.jpg",
          "https://m2prod-www.forevernew.co.nz/media/gene-cms/s/i/sizeguide-desktop4.jpg",
        ],
        urlName: "https://www.google.com",
        title: "test",
      });
    }
  });
}
