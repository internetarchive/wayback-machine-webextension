function populateBooks(url) {
  // Gets the data for each book on the wikipedia url
  getWikipediaBooks(url).then(data=>{
    const loaders = document.getElementsByClassName('loader');
    for (const i of loaders) {
      const cur_ele= i;
      cur_ele.style.display = 'none';
    }
    // No need to check the validation of data since promise has already been resolved
    for (let isbn of Object.keys(data)) {  // Iterate over each book to get data
      let metadata = getMetadata(data[isbn]);
      if (metadata) {
        let book_element = addBook(metadata);
        const resultsTray = document.getElementById('resultsTray');
        let containerForPrepend = document.createDocumentFragment();
        const containerForAppend = document.createDocumentFragment();
        if(metadata.readable) {
          if (containerForPrepend.childNodes.length > 0) {
            const firstChild = containerForPrepend.childNodes[0];
            containerForPrepend.insertBefore(book_element, firstChild)
          } else if (containerForPrepend.childNodes.length === 0) {
            containerForPrepend.appendChild(book_element)
          }
        } else {
          containerForAppend.appendChild(book_element);
        }
        const firstNode = resultsTray.childNodes[0];
        resultsTray.insertBefore(containerForPrepend, firstNode);
        resultsTray.appendChild(containerForAppend);
      }
    }
  }).catch( function(error) {
    const loaders = document.getElementsByClassName('loader');
    for (const i of loaders) {
      const cur_ele= i;
      cur_ele.style.display = 'none';
    }
    const resultsTray = document.getElementById('resultsTray');
    resultsTray.style.gridTemplateColumns = 'none';
    const container = document.createElement('div');
    container.innerHTML = error;
    resultsTray.appendChild(container);
  });
}

function addBook(metadata) {
  const text_elements = document.createElement('div');
  text_elements.setAttribute('class', 'text_elements');
  const p1 = document.createElement('p');
  const p2 = document.createElement('p');
  const strongTag = document.createElement('strong');
  strongTag.textContent = metadata.title;
  p1.appendChild(strongTag);
  p2.textContent = metadata.author;
  text_elements.appendChild(p1);
  text_elements.appendChild(p2);

  const details = document.createElement('div');
  details.setAttribute('class', 'bottom_details');
  if (metadata.image) {
    const imgTag = document.createElement('img');
    imgTag.setAttribute('class', 'cover-img');
    imgTag.setAttribute('src', metadata.image);
    details.appendChild(imgTag)
  } else {
    const pTag = document.createElement('p');
    pTag.setAttribute('class', 'cover-img');
    pTag.textContent = 'No cover available';
    details.appendChild(pTag)
  }

  const btn = document.createElement('button');
  btn.setAttribute('class', metadata.button_class);
  btn.textContent = metadata.button_text;
  btn.addEventListener('click', function() {
    chrome.storage.sync.get(['show_context'], function(event1) {
      if (event1.show_context==undefined) {
        event1.show_context="tab";
      }
      if (event1.show_context=="tab") {
        chrome.tabs.create({url:metadata.link});
      } else {
        chrome.system.display.getInfo(function(displayInfo) {
          let height = displayInfo[0].bounds.height;
          let width = displayInfo[0].bounds.width;
          chrome.windows.create({url:metadata.link, width:width/2, height:height, top:0, left:0, focused:true});
        });
      }
    });
  })
  details.appendChild(btn);
  const divTag = document.createElement('div');
  divTag.appendChild(text_elements);
  divTag.appendChild(details);
  return divTag;
}

if(typeof module !=="undefined") {
  module.exports = {
    getMetadata:getMetadata
  };
}
