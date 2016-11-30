var authTokenInput = document.querySelector("input[name=authenticity_token]");

// Stock
var stockButtons = document.querySelectorAll(".StockButton");
Array.prototype.forEach.call(stockButtons, function (stockButton) {
    // Qiitaの登録したイベントを解除
    stockButton.classList.remove("js-stockButton");
    stockButton.addEventListener("click", function (evt) {
        evt.preventDefault();
        if (authTokenInput) {
            var isStocked = stockButton.classList.contains("StockButton--stocked");
            var url = "https://" + location.host + stockButton.getAttribute("data-path") + "/" + (isStocked ? "unstock" : "stock");
            chrome.runtime.sendMessage({
                method: "HttpRequest",
                httpMethod: "POST",
                url: url,
                authenticity_token: authTokenInput.value
            }, function(response) {
                if (response.isSuccess) {
                    Array.prototype.forEach.call(stockButtons, function (stockButton) {
                        stockButton.classList.toggle("StockButton--stocked");
                    });
                } else {
                    console.warn((isStocked ? "ストック解除" : "ストック") + "に失敗しました");
                }
            });
        }
    });
});

// Like
var likeButtons = document.querySelectorAll(".js-likebutton");
Array.prototype.forEach.call(likeButtons, function (likeButton) {
    likeButton.classList.remove("js-likebutton");
    likeButton.addEventListener("click", function (evt) {
        // デフォルトのいいねイベントをキャンセル
        evt.stopPropagation();
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
                        likeButtons[1].querySelector(".LikeButton__balloon")
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