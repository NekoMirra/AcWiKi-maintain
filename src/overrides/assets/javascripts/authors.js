// Add GitHub avatars to git-authors plugin output
(function () {
    function addAvatars() {
        document.querySelectorAll(".git-page-authors a").forEach(function (link) {
            if (link.querySelector("img")) return;
            var href = link.getAttribute("href") || "";
            var match = href.match(/github\.com\/([^/]+)/);
            if (!match) return;
            var username = match[1];
            var img = document.createElement("img");
            img.src = "https://avatars.githubusercontent.com/" + username + "?s=32";
            img.alt = username;
            img.width = 28;
            img.height = 28;
            img.style.borderRadius = "50%";
            img.style.verticalAlign = "middle";
            img.style.marginRight = "8px";
            link.insertBefore(img, link.firstChild);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addAvatars);
    } else {
        addAvatars();
    }

    if (typeof document$ !== "undefined") {
        document$.subscribe(function () {
            setTimeout(addAvatars, 100);
        });
    }
    var target = document.querySelector(".md-content");
    if (target) {
        new MutationObserver(function () {
            setTimeout(addAvatars, 100);
        }).observe(target, { childList: true, subtree: true });
    }
})();
