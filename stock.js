var elements = document.querySelectorAll(".StockButton");

Array.prototype.forEach.call(elements, function (elem) {
    // Qiitaの登録したイベントを解除
    elem.classList.remove("js-stockButton");
    elem.addEventListener("click", function (evt) {
        evt.preventDefault();
        var authTokenInput = elem.querySelector("input[name=authenticity_token]");
        if (authTokenInput) {
            var isStocked = elem.classList.contains("StockButton--stocked");
            var url = "https://" + location.host + elem.getAttribute("data-path") + "/" + (isStocked ? "unstock" : "stock");
            var authenticity_token = authTokenInput.value;
            chrome.runtime.sendMessage({
                method: "HttpRequest",
                url: url,
                authenticity_token: authenticity_token
            }, function(response) {
                if (response.isSuccess) {
                    Array.prototype.forEach.call(elements, function (elem) {
                        elem.classList.toggle("StockButton--stocked");
                    });
                } else {
                    console.warn((isStocked ? "ストック解除" : "ストック") + "に失敗しました");
                }
            });
        }
    });
});
