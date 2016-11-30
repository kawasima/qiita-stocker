var stockButtons = document.querySelectorAll(".StockButton");
Array.prototype.forEach.call(stockButtons, function (stockButton) {
    // Qiitaの登録したイベントを解除
    stockButton.classList.remove("js-stockButton");
    stockButton.addEventListener("click", function (evt) {
        evt.preventDefault();
        var authTokenInput = document.querySelector("input[name=authenticity_token]");
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
