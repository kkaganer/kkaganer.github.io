/* Click-to-load video. Without JS the poster is a link to YouTube. With JS
   it becomes a button, and the player iframe loads only when it is pressed. */
(function () {
  var posters = document.querySelectorAll("a.video-poster[data-video-id]");
  Array.prototype.forEach.call(posters, function (link) {
    var id = link.getAttribute("data-video-id");
    var start = link.getAttribute("data-video-start");
    var title = link.getAttribute("data-video-title");
    var button = document.createElement("button");
    button.type = "button";
    button.className = link.className;
    while (link.firstChild) button.appendChild(link.firstChild);
    link.replaceWith(button);
    button.addEventListener("click", function () {
      var src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1";
      if (start) src += "&start=" + encodeURIComponent(start);
      var frame = document.createElement("iframe");
      frame.className = "video-frame";
      frame.src = src;
      frame.title = title;
      frame.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
      frame.setAttribute("allowfullscreen", "");
      button.replaceWith(frame);
      frame.focus();
    });
  });
})();
