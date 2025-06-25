const collectedCitations = new Set();

function makeCitationBlock(el) {
  const text = el.innerText.trim();
  if (!text) return;

  collectedCitations.add(text);

  el.style.border = '2px dashed #3f51b5';
  el.style.backgroundColor = '#e8eaf6';
  el.style.padding = '4px';
  el.style.borderRadius = '4px';
  el.style.margin = '4px 0';
}

function handleWikipedia() {
  document.querySelectorAll('ol.references > li').forEach(li => {
    const span = li.querySelector('span.reference-text');
    if (
      span &&
      (/\(([^)]*?\d{4})\)/.test(span.innerText) ||
       /, ?\d{4}(?:\.|,|$)|\d{4}\./.test(span.innerText))
    ) {
      makeCitationBlock(li);
    }
  });
}

function handleCitationsy() {
  document.querySelectorAll('div.reference').forEach(el => {
    if (el.innerText.match(/\d{4}/)) {
      makeCitationBlock(el);
    }
  });
}

function handleEasyBib() {
  document.querySelectorAll('table p').forEach(p => {
    const text = p.innerText.trim();
    const citationRegex = /\(\d{4}\)|,\s?\d{4}\.|[^a-zA-Z](\d{4})[.)]/;
    if (citationRegex.test(text)) {
      makeCitationBlock(p);
    }
  });
}

// === Site Detection and Processing ===
function processPageAndSend() {
  const url = window.location.href;

  if (url.includes('wikipedia.org')) {
    handleWikipedia();
  } else if (url.startsWith('https://citationsy.com/references/')) {
    handleCitationsy();
  } else if (url.startsWith('https://www.easybib.com/guides/citation-guides/')) {
    handleEasyBib();
  }

  // Delay the message to ensure citations are collected
  setTimeout(() => {
    if (collectedCitations.size > 0) {
      console.log("Sending collected citations to background:", collectedCitations);
      chrome.runtime.sendMessage({
        type: 'store-citations',
        payload: {
          page_url: window.location.href,
          citations: Array.from(collectedCitations)
        }
      });
    } else {
      console.log("No citations collected.");
    }
  }, 500); // Adjust this if needed
}

processPageAndSend();
