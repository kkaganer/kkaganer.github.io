/* Small navigation helpers. The site works without them: the floating
   button stays hidden and the "On this page" links simply carry no marker. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Floating back to top: shown after one screen of scrolling */
  var toTop = document.querySelector(".back-to-top");
  if (toTop) {
    var update = function () {
      toTop.hidden = !(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    toTop.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reduce.matches ? "auto" : "smooth" });
      var main = document.getElementById("main");
      if (main) main.focus({ preventScroll: true });
    });
  }

  /* "On this page": mark the link for the section in view */
  var links = document.querySelectorAll(".on-page a[href^='#']");
  if (links.length && "IntersectionObserver" in window) {
    /* Keep a set of the sections inside the band and mark the first one in
       page order, so the marker never goes stale while a section stays in view */
    var entriesInOrder = [];
    var visible = new Set();

    /* The band stops 55% of the way down the viewport, so a short last section
       sits below it even at full scroll and can never be marked. That makes the
       last entry in the list one that never lights up, which is worse than no
       list at all: it tells you that you are not where you are. At the bottom of
       the page the answer is not in doubt, so the last section takes the marker. */
    var atBottom = function () {
      return window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
    };

    var update = function () {
      var current = null;
      if (atBottom() && entriesInOrder.length) {
        current = entriesInOrder[entriesInOrder.length - 1].link;
      } else {
        for (var i = 0; i < entriesInOrder.length; i++) {
          if (visible.has(entriesInOrder[i].section)) { current = entriesInOrder[i].link; break; }
        }
      }
      if (!current) return;
      entriesInOrder.forEach(function (item) {
        if (item.link === current) item.link.setAttribute("aria-current", "true");
        else item.link.removeAttribute("aria-current");
      });
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      update();
    }, { rootMargin: "-130px 0px -55% 0px" });
    Array.prototype.forEach.call(links, function (link) {
      var target = document.getElementById(link.getAttribute("href").slice(1));
      var section = target && target.closest("section");
      if (!section) return;
      entriesInOrder.push({ link: link, section: section });
      observer.observe(section);
    });
    /* Reaching the bottom does not always change which sections intersect the
       band, so the observer alone would not fire there. */
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }
})();
