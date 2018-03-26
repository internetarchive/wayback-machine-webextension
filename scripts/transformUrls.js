// Fetch all links from the current web page
var links = document.links;

// Traverse each link and transform it to Archive link
// Change color of each link to a shade of green for some visual feedback
for (var i = 0; i < links.length; i++) {
    links[i].href = 'https://web.archive.org/web/' + links[i].href;
    links[i].target = '_blank';
    links[i].style.color = '#1ABC9C';
}