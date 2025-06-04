// === Shared Function: Convert citation element to clickable link ===
function makeCitationLink(el) {
    const text = el.innerText.trim();
  
    // Create a clickable <a> link
    const link = document.createElement('a');
    link.href = '#';
    link.innerText = text;
    link.style.textDecoration = 'underline';
    link.style.color = '#1a0dab';
  
    // Click handler to POST citation info to API
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Don't jump to # on click
      e.stopPropagation();
  
      chrome.runtime.sendMessage({
        type: 'log-citation-click',
        payload: {
          page_url: window.location.href,
          citation_text: text,
          clicked_at: new Date().toISOString()
        }
      }, (response) => {
        if (response && response.ok) {
          console.log("Citation click logged successfully.");
        } else {
          console.warn("Failed to log citation click.");
        }
      });
    });
  
    // Replace citation text with clickable link
    el.innerHTML = '';
    el.appendChild(link);
  
    // Optional: Style the block
    el.style.border = '2px dashed #3f51b5';
    el.style.backgroundColor = '#e8eaf6';
    el.style.padding = '4px';
    el.style.borderRadius = '4px';
    el.style.margin = '4px 0';
  }
  
  
  
  // === Wikipedia Handler ===
  function handleWikipedia() {
    document.querySelectorAll('ol.references > li').forEach(li => {
      const span = li.querySelector('span.reference-text');
      if (
        span &&
        (/\(([^)]*?\d{4})\)/.test(span.innerText) ||
         /, ?\d{4}(?:\.|,|$)|\d{4}\./.test(span.innerText))
      ) {
        makeCitationLink(li);
      }
    });
  }
  
  // === Citationsy Handler ===
  function handleCitationsy() {
    document.querySelectorAll('div.reference').forEach(el => {
      if (el.innerText.match(/\d{4}/)) {
        makeCitationLink(el);
      }
    });
  }
  
  // === EasyBib Handler ===
  function handleEasyBib() {
    const paragraphs = document.querySelectorAll('table p');
    paragraphs.forEach(p => {
      const text = p.innerText.trim();
      const citationRegex = /\(\d{4}\)|,\s?\d{4}\.|[^a-zA-Z](\d{4})[.)]/;
      if (citationRegex.test(text)) {
        makeCitationLink(p);
      }
    });
  }
  
  // === Site Detection ===
  const url = window.location.href;
  
  if (url.includes('wikipedia.org')) {
    handleWikipedia();
  } else if (url.startsWith('https://citationsy.com/references/')) {
    handleCitationsy();
  } else if (url.startsWith('https://www.easybib.com/guides/citation-guides/')) {
    handleEasyBib();
  }
  