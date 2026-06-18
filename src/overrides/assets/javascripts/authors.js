// Page author display with GitHub avatars
document.addEventListener("DOMContentLoaded", function () {
    var DEFAULT_AUTHOR = "NekoMirra";
    var h1 = document.querySelector(".md-content h1");
    if (!h1) return;

    // Check if author already exists (from frontmatter)
    var existing = h1.parentElement.querySelector(".md-author");
    if (!existing) {
        // Inject default author
        var wrap = document.createElement("div");
        wrap.className = "md-author";
        var link = document.createElement("a");
        link.href = "https://github.com/" + DEFAULT_AUTHOR;
        link.textContent = DEFAULT_AUTHOR;
        wrap.appendChild(link);
        h1.parentElement.insertBefore(wrap, h1.nextElementSibling);
    }

    // Add GitHub avatar to all .md-author links
    document.querySelectorAll(".md-author a").forEach(function (link) {
        var href = link.getAttribute("href") || "";
        var match = href.match(/github\.com\/([^/]+)/);
        if (!match) return;
        var username = match[1];
        var img = document.createElement("img");
        img.src = "https://avatars.githubusercontent.com/" + username + "?s=32";
        img.alt = username;
        img.width = 22;
        img.height = 22;
        img.style.borderRadius = "50%";
        img.style.verticalAlign = "middle";
        img.style.marginRight = "6px";
        link.insertBefore(img, link.firstChild);
    });
});
