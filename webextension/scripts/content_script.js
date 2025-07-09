const collectedCitations = new Set();

function collectCitation(text) {
  if (text) {
    collectedCitations.add(text.trim());
  }
}

function handleWikipedia() {
  document.querySelectorAll('ol.references > li').forEach(li => {
    const span = li.querySelector('span.reference-text');
    if (
      span &&
      (/\(([^)]*?\d{4})\)/.test(span.innerText) ||
       /, ?\d{4}(?:\.|,|$)|\d{4}\./.test(span.innerText))
    ) {
      collectCitation(li.innerText);
    }
  });
}

function handleCitationsy() {
  document.querySelectorAll('div.reference').forEach(el => {
    if (el.innerText.match(/\d{4}/)) {
      collectCitation(el.innerText);
    }
  });
}

function handleEasyBib() {
  document.querySelectorAll('table p').forEach(p => {
    const text = p.innerText.trim();
    const citationRegex = /\(\d{4}\)|,\s?\d{4}\.|[^a-zA-Z](\d{4})[.)]/;
    if (citationRegex.test(text)) {
      collectCitation(text);
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

  // Delay sending to allow DOM processing
  setTimeout(() => {
    if (collectedCitations.size > 0) {
      chrome.runtime.sendMessage({
        type: 'store-citations',
        payload: {
          page_url: url,
          citations: Array.from(collectedCitations)
        }
      });
    }
  }, 500);
}

// === Check setting before processing ===
chrome.storage.local.get(['private_mode_setting'], (settings) => {
  if (settings && settings.private_mode_setting === true) {
    return;
  } else {
    processPageAndSend();
  }
});