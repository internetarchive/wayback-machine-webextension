pchrome.storage.sync.get(['wikibooks'], function (event) {
  if(event.wikibooks){
    addCitations();
  }
})
