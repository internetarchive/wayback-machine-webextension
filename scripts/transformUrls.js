var links = document.links;

for (var i = 0; i < links.length; i++) {
    if (!links[i].hasAttribute('data-original-url')) {
        links[i].setAttribute('data-original-url', links[i].href);
    }
    links[i].style.color = '#1ABC9C';
}