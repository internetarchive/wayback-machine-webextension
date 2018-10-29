// Get book on amazon page through
// https://archive.org/services/context/amazonbooks?url=...
function get_amazonbooks (url) {
  return fetch('https://archive.org/services/context/amazonbooks?url=' + url)
    .then(res => res.json())
    .catch(err => console.log(err))
}
