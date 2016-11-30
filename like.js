var likeButtons = document.querySelectorAll(".js-likebutton");
Array.prototype.forEach.call(likeButtons, function (likeButton) {
    likeButton.classList.remove("js-likebutton");
    likeButton.addEventListener("click", function (evt) {
        // デフォルトのいいねイベントをキャンセル
        evt.stopPropagation();
        var authTokenInput = document.querySelector("input[name=authenticity_token]");
        if (authTokenInput) {
            var uuid = document.querySelector(".StockButton").getAttribute("data-uuid");
            var isLiked = likeButton.querySelector(".p-button").classList.contains("liked");
            var url = "https://" + location.host + "/api/internal/items/" + uuid + "/likes";
            var httpMethod = isLiked ? "DELETE" : "POST";
            chrome.runtime.sendMessage({
                method: "HttpRequest",
                httpMethod: httpMethod,
                url: url,
                authenticity_token: authTokenInput.value
            }, function(response) {
                if (response.isSuccess) {
                    var headerLikeCount = document.querySelector(".js-likecount");
                    var footerLikeCount = document.querySelector(".ArticleFooter__menu").querySelector(".LikeButton__balloon");
                    var likeCount = parseInt(headerLikeCount.innerText);
                    if (isLiked) { // いいね取消
                        Array.prototype.forEach.call(likeButtons, function (likeButton) {
                            likeButton.querySelector(".p-button").classList.remove("liked");
                            likeButton.querySelector(".fa.fa-fw").classList.remove("fa-check");
                            likeButton.querySelector(".fa.fa-fw").classList.add("fa-thumbs-up");
                        });
                        headerLikeCount.innerText = likeCount - 1;
                        footerLikeCount.innerText = likeCount - 1;
                    } else { // いいね
                        Array.prototype.forEach.call(likeButtons, function (likeButton) {
                            likeButton.querySelector(".p-button").classList.add("liked");
                            likeButton.querySelector(".fa.fa-fw").classList.remove("fa-thumbs-up");
                            likeButton.querySelector(".fa.fa-fw").classList.add("fa-check");
                        });
                        headerLikeCount.innerText = likeCount + 1;
                        footerLikeCount.innerText = likeCount + 1;
                    }
                } else {
                    console.warn((isLiked ? "いいね取消" : "いいね") + "に失敗しました");
                }
            });
        }
    });
});
