(function () {
  var menuButton = document.querySelector(".mobile-navbar-icon");
  var menu = document.getElementById("mobile-menu");
  var backToTop = document.getElementById("back-to-top");

  if (backToTop) {
    function updateBackToTop() {
      backToTop.hidden = window.scrollY < 480;
    }
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    updateBackToTop();
  }

  function setMenuOpen(open) {
    if (!menuButton || !menu) return;
    menu.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
    menuButton.classList.toggle("icon-click", open);
    menuButton.classList.toggle("icon-out", !open);
    document.body.classList.toggle("menu-open", open);
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenuOpen(false);
    });
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenuOpen(false);
    });
  }

  document.querySelectorAll(".post-content pre, .about pre").forEach(function (pre) {
    var code = pre.querySelector(":scope > code");
    if (!code || code.dataset.lang === "mermaid") return;

    var wrapper = document.createElement("div");
    wrapper.className = "code-block";
    var toolbar = document.createElement("div");
    toolbar.className = "code-block__toolbar";
    var name = document.createElement("span");
    name.className = "code-block__name";
    name.textContent = code.dataset.name || code.dataset.lang || "代码";
    var button = document.createElement("button");
    button.type = "button";
    button.className = "code-block__copy";
    button.textContent = "复制";
    button.setAttribute("aria-label", "复制代码");
    toolbar.append(name, button);
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.append(toolbar, pre);

    button.addEventListener("click", async function () {
      var source = code.cloneNode(true);
      source.querySelectorAll(".giallo-ln").forEach(function (number) { number.remove(); });
      var lines = source.querySelectorAll(".giallo-l");
      var text = lines.length
        ? Array.prototype.map.call(lines, function (line) { return line.textContent; }).join("\n")
        : source.textContent;
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = "已复制";
      } catch (error) {
        button.textContent = "复制失败";
      }
      window.setTimeout(function () { button.textContent = "复制"; }, 1800);
    });
  });

  var toc = document.getElementById("post-toc");
  if (toc) {
    if (!window.matchMedia("(min-width: 1520px)").matches) toc.removeAttribute("open");
    var links = Array.prototype.slice.call(toc.querySelectorAll(".toc-link"));
    var headings = links.map(function (link) {
      var id = decodeURIComponent(link.hash.slice(1));
      return document.getElementById(id);
    });
    var ticking = false;
    function updateToc() {
      var active = -1;
      headings.forEach(function (heading, index) {
        if (heading && heading.getBoundingClientRect().top <= 150) active = index;
      });
      links.forEach(function (link, index) {
        var selected = index === active;
        link.classList.toggle("active", selected);
        link.setAttribute("aria-current", selected ? "location" : "false");
      });
      ticking = false;
    }
    document.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(updateToc);
        ticking = true;
      }
    }, { passive: true });
    updateToc();
  }
})();
