let AutoSearchCheckBox = document.getElementById("autoSearch");

function DisplaySettings() {
    chrome.storage.sync.get('autoSearch', function (data) {
        console.log(data);
        AutoSearchCheckBox.checked = data.autoSearch;
    });
}

function SearhReddit() {
    console.log("Searching reddit for link")
    chrome.tabs.getSelected(null, function (tab) {
        var link = tab.url;
        console.log(link);

        let posts = fetch(`https://www.reddit.com/search.json?q=${link}&type=link`);
        posts.then( response => {
            return response.json();
        }).then( posts => {
            console.log(posts);

            if (posts == null || posts == undefined || posts == "{}") {
                console.log("there are no reddit posts");
                document.getElementById("PostList").innerHTML = '<div id="NoPosts">There are no reddit posts for this link</div>';
                document.getElementById("LoadingBar").style.display = 'none';
            } else {

                if (Array.isArray(posts)) {
                    console.log("its array");
                    posts = posts[0];
                }

                let postsHtml = posts.data.children.map(post => {
                
                    var dt = new Date(0);
                    dt.setUTCSeconds(post.data.created_utc);
                    var DD = ("0" + dt.getDate()).slice(-2);
                    var MM = ("0" + (dt.getMonth() + 1)).slice(-2);
                    var YYYY = dt.getFullYear();
                    var hh = ("0" + dt.getHours()).slice(-2);
                    var mm = ("0" + dt.getMinutes()).slice(-2);
                    var ss = ("0" + dt.getSeconds()).slice(-2);
                    var date_string = YYYY + "-" + MM + "-" + DD + " " + hh + ":" + mm + ":" + ss;
                    
                    let html = `<div class="Post">
                                <div class="PostUps"><div>${post.data.score}</div></div>
                                <div class="PostInfo">
                                    <div class="PostHeading">
                                        <a target="_blank" class="PostTitle" href="https://reddit.com${post.data.permalink}">${post.data.title}</a>`
                    
                    if (post.data.over_18) {
                        html += '<div class="nsfw">nsfw</div>'
                    }

                    return html +=  `</div>
                                    <div class="PostExtraInfo">
                                        <a target="_blank" class="PostSubreddit" href="https://reddit.com/r/${post.data.subreddit}">${post.data.subreddit}</a>
                                        <div class="PostCreated">${date_string}</div>
                                    </div>
                                    <div>${post.data.num_comments} Comments</div>
                                </div>
                            </div>`}).join("\n");
    
                document.getElementById("PostList").innerHTML = postsHtml;
                document.getElementById("LoadingBar").style.display = 'none';

                chrome.browserAction.setBadgeText({
                    tabId: tab.id,
                    text: posts.data.children.length.toString()
                });
            }
        });

    });
}

function SetAutoSearch() {
    console.log('Setting auto search setting',AutoSearchCheckBox.checked);
    chrome.storage.sync.set({
        autoSearch: AutoSearchCheckBox.checked
    });
}

DisplaySettings();
SearhReddit();

AutoSearchCheckBox.addEventListener('change', SetAutoSearch);