// Page author display with GitHub avatars
// Works with Material for MkDocs instant navigation
(function () {
    var DEFAULT_AUTHOR = "NekoMirra";

    function injectAuthors() {
        var h1 = document.querySelector(".md-content h1");
        if (!h1) return;
        var parent = h1.parentElement;
        if (!parent) return;

        // Skip if already injected
        if (parent.querySelector(".md-author")) return;

        // Create author element
        var wrap = document.createElement("div");
        wrap.className = "md-author";
        var img = document.createElement("img");
        img.src = "https://avatars.githubusercontent.com/" + DEFAULT_AUTHOR + "?s=32";
        img.alt = DEFAULT_AUTHOR;
        img.width = 22;
        img.height = 22;
        img.style.borderRadius = "50%";
        img.style.verticalAlign = "middle";
        img.style.marginRight = "6px";
        var link = document.createElement("a");
        link.href = "https://github.com/" + DEFAULT_AUTHOR;
        link.textContent = DEFAULT_AUTHOR;
        link.style.color = "inherit";
        link.style.textDecoration = "none";
        wrap.appendChild(img);
        wrap.appendChild(link);
        parent.insertBefore(wrap, h1.nextElementSibling);
    }

    // Run on initial load
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectAuthors);
    } else {
        injectAuthors();
    }

    // Run on instant navigation (Material for MkDocs)
    if (typeof document$ !== "undefined") {
        document$.subscribe(function () {
            setTimeout(injectAuthors, 100);
        });
    }

    // Fallback: observe DOM changes
    var target = document.querySelector(".md-content");
    if (target) {
        new MutationObserver(function () {
            setTimeout(injectAuthors, 100);
        }).observe(target, { childList: true, subtree: true });
    }
})();
