//Get book on amazon page through https://archive.org/services/context/amazonbooks?url=...
//Using new api http://vbanos-dev.us.archive.org:5002/amazonbooks?url=
function get_amazonbooks(url){
  let api = "https://archive.org/services/context/amazonbooks?url=" + url;
  return fetch(api)
    .then(res => res.json())
    .catch(err => console.log(err));
}
