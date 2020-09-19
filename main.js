chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({
    autoSearch: false
  });
});

chrome.browserAction.setBadgeBackgroundColor({
  color: [122, 186, 122, 255]
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {

    console.log('lel');

    chrome.storage.sync.get(['autoSearch', 'prefix'], function (data) {
      console.log(data);
      if (data.autoSearch) {
        SearhReddit();
      }
    });
  }
})

function SearhReddit() {
  console.log("Searching reddit for link")
  chrome.tabs.getSelected(null, function (tab) {
    var link = tab.url;
    console.log(link);

    let posts = fetch(`https://www.reddit.com/search.json?q=${link}&type=link`);
    posts.then(response => {
      return response.json();
    }).then(posts => {
      console.log(posts);

      if (posts == null || posts == undefined || posts == "{}") {
        console.log("there are no reddit posts");
        document.getElementById("PostList").innerHTML = '<div id="NoPosts">There are no reddit posts for this link</div>';
      } else {

        if (Array.isArray(posts)) {
          console.log("its array");
          posts = posts[0];
        }

        chrome.browserAction.setBadgeText({
          tabId: tab.id,
          text: posts.data.children.length.toString()
        });
      }
    });

  });
}