

Array.prototype.forEach.call(document.querySelectorAll(".itemStockButton.js-stockButton"), function (elem) {
    // Qiitaの登録したイベントを解除
    elem.classList.remove("js-stockButton");
    elem.addEventListener("click", function (evt) {
        evt.preventDefault();
        var authTokenInput = elem.querySelector("input[name=authenticity_token]");
        if (authTokenInput) {
            var isStocked = elem.classList.contains("stocked");
            var url = "https://" + location.host + elem.getAttribute("data-path") + "/" + (isStocked ? "unstock" : "stock");
            var authenticity_token = authTokenInput.value;
            chrome.runtime.sendMessage({
                method: "HttpRequest",
                url: url,
                authenticity_token: authenticity_token
            }, function(response) {
                if (response.isSuccess) {
                    elem.classList.toggle("stocked");
                    Array.prototype.forEach.call(document.querySelectorAll(".js-stocksCount"), function (elem) {
                        var count = parseInt(elem.innerText);
                        if (!isNaN(count)) {
                            // ストックしてる状態→解除で-1
                            elem.innerText = count + (isStocked ? -1 : 1);
                        }
                    });
                } else {
                    console.warn((isStocked ? "ストック解除" : "ストック") + "に失敗しました");
                }
            });
        }
    });
});
