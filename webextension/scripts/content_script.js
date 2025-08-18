// === Global Variables ===
const collectedCitations = new Set();
let isProcessing = false; // Prevent multiple executions
let hasProcessed = false; // Track if we've already processed this page

function collectCitation(text) {
  if (text && text.trim().length > 10) {
    const trimmedText = text.trim();
    
    // Check if this text is already contained in an existing citation
    const isDuplicate = Array.from(collectedCitations).some(existing => {
      // If new text is shorter and contained in existing, skip it
      if (trimmedText.length < existing.length && existing.includes(trimmedText)) {
        return true;
      }
      // If existing text is shorter and contained in new, replace it
      if (existing.length < trimmedText.length && trimmedText.includes(existing)) {
        collectedCitations.delete(existing);
        return false;
      }
      // If they're very similar (95%+ overlap), skip the shorter one
      if (Math.min(trimmedText.length, existing.length) / Math.max(trimmedText.length, existing.length) > 0.95) {
        return trimmedText.length <= existing.length;
      }
      return false;
    });
    
    if (!isDuplicate) {
      collectedCitations.add(trimmedText);
    }
  }
}

// === Generic Citation Detection ===
function detectGenericCitations() {
  // Get all text nodes, but filter out non-citation content
  const textNodes = [];
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        const text = node.textContent.trim();
        
        // Skip if text is too short
        if (text.length < 10) return NodeFilter.FILTER_REJECT;
        
        // Skip CSS styles and JavaScript code
        if (text.includes('{') && text.includes('}')) return NodeFilter.FILTER_REJECT;
        if (text.includes('z-index:') || text.includes('position:')) return NodeFilter.FILTER_REJECT;
        if (text.includes('display:') || text.includes('transform:')) return NodeFilter.FILTER_REJECT;
        if (text.includes('box-shadow:') || text.includes('border:')) return NodeFilter.FILTER_REJECT;
        if (text.includes('transition:') || text.includes('visibility:')) return NodeFilter.FILTER_REJECT;
        
        // Skip HTML attributes and technical content
        if (text.includes('class=') || text.includes('id=')) return NodeFilter.FILTER_REJECT;
        if (text.includes('data-') || text.includes('aria-')) return NodeFilter.FILTER_REJECT;
        if (text.includes('<!--') || text.includes('-->')) return NodeFilter.FILTER_REJECT;
        
        // Skip navigation and UI elements
        if (text.includes('Privacy') || text.includes('Terms') || text.includes('Help')) return NodeFilter.FILTER_REJECT;
        if (text.includes('SHOW MORE') || text.includes('VIEW ALL')) return NodeFilter.FILTER_REJECT;
        if (text.includes('GET MY OWN PROFILE')) return NodeFilter.FILTER_REJECT;
        
        // Skip if this text is already part of a collected citation
        const isAlreadyCollected = Array.from(collectedCitations).some(citation => 
          citation.includes(text) || text.includes(citation)
        );
        if (isAlreadyCollected) return NodeFilter.FILTER_REJECT;
        
        // Accept text that looks like citations
        if (text.includes(',') || text.includes('(') || text.includes(')')) return NodeFilter.FILTER_ACCEPT;
        if (text.includes('by') || text.includes('et al') || text.includes('&')) return NodeFilter.FILTER_ACCEPT;
        if (text.includes('University') || text.includes('Institute') || text.includes('Press')) return NodeFilter.FILTER_ACCEPT;
        if (text.includes('Journal') || text.includes('Review') || text.includes('Proceedings')) return NodeFilter.FILTER_ACCEPT;
        
        // Default: accept if it looks like meaningful text
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }
  
  // Citation patterns to look for
  const citationPatterns = [
    // Author patterns: "A Einstein, B Podolsky, N Rosen"
    /[A-Z] [A-Z][a-z]+, [A-Z] [A-Z][a-z]+, [A-Z] [A-Z][a-z]+/g,
    
    // Single authors: "A Einstein"
    /[A-Z] [A-Z][a-z]+/g,
    
    // Years: "1935", "1905"
    /[12]\d{3}/g,
    
    // Journal citations: "Physical Review 47 (10), 777"
    /[A-Z][a-z]+ [A-Z][a-z]+ \d+ \(\d+\), \d+/g,
    
    // DOI patterns: "10.1103/PhysRev.47.777"
    /10\.\d{4}\/[A-Za-z0-9.-]+/g,
    
    // arXiv patterns: "arXiv:quant-ph/0501010"
    /arXiv:[a-z-]+\/\d+/g
  ];
  
  let totalPatterns = 0;
  let newCitations = 0;
  
  textNodes.forEach((textNode, index) => {
    const text = textNode.textContent.trim();
    
    citationPatterns.forEach((pattern, patternIndex) => {
      const matches = text.match(pattern);
      if (matches) {
        totalPatterns += matches.length;
        matches.forEach(match => {
          if (match.length > 3) { // Only collect meaningful matches
            const beforeSize = collectedCitations.size;
            collectCitation(match);
            if (collectedCitations.size > beforeSize) {
              newCitations++;
            }
          }
        });
      }
    });
  });
}

// === Enhanced Bibliography and Reference Detection ===
function detectBibliographySections() {
  // Comprehensive bibliography section selectors for all websites
  const bibliographySelectors = [
    // Common ID patterns
    'div[id*="bibliography"]',
    'div[id*="references"]',
    'div[id*="citations"]',
    'div[id*="works-cited"]',
    'div[id*="sources"]',
    'div[id*="notes"]',
    'div[id*="footnotes"]',
    'div[id*="endnotes"]',
    
    // Common class patterns
    'div[class*="bibliography"]',
    'div[class*="references"]',
    'div[class*="citations"]',
    'div[class*="works-cited"]',
    'div[class*="sources"]',
    'div[class*="notes"]',
    'div[class*="footnotes"]',
    'div[class*="endnotes"]',
    
    // Section elements
    'section[id*="bibliography"]',
    'section[id*="references"]',
    'section[id*="citations"]',
    'section[id*="works-cited"]',
    'section[id*="sources"]',
    'section[id*="notes"]',
    
    // List elements
    'ol.references',
    'ul.references',
    'ol.citations',
    'ul.citations',
    'ol.bibliography',
    'ul.bibliography',
    'ol.sources',
    'ul.sources',
    
    // Generic reference containers
    'div.references',
    'div.citations',
    'div.bibliography',
    'div.sources',
    'div.notes',
    'div.footnotes',
    'div.endnotes',
    
    // Table formats
    'table[id*="references"]',
    'table[id*="citations"]',
    'table[id*="bibliography"]',
    'table.references',
    'table.citations',
    'table.bibliography',
    
    // Article and content areas
    'article .references',
    'article .citations',
    'article .bibliography',
    'main .references',
    'main .citations',
    'main .bibliography',
    
    // Common academic site patterns
    '.reference-list',
    '.citation-list',
    '.bibliography-list',
    '.source-list',
    '.note-list',
    
    // Footer and sidebar references
    'footer .references',
    'footer .citations',
    'aside .references',
    'aside .citations',
    '.sidebar .references',
    '.sidebar .citations'
  ];
  
  let sectionsFound = 0;
  
  bibliographySelectors.forEach((selector, index) => {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach(element => {
          // Process list items, table rows, or any content
          const items = element.querySelectorAll('li, tr, div, p, span, td');
          
          items.forEach(item => {
            const text = item.innerText || item.textContent;
            if (text && text.trim().length > 20) {
              collectCitation(text.trim());
            }
          });
          
          // Also check direct text content of the element
          const directText = element.innerText || element.textContent;
          if (directText && directText.trim().length > 50) {
            // Split into paragraphs or sections
            const sections = directText.split(/\n\s*\n/);
            sections.forEach(section => {
              if (section.trim().length > 30) {
                collectCitation(section.trim());
              }
            });
          }
        });
      }
    } catch (e) {
      // console.log(`❌ Error with selector: ${selector} - ${e.message}`);
    }
  });
}

// === Enhanced Academic Paper Detection ===
function detectAcademicPapers() {
  // Look for academic paper metadata in all websites
  const academicSelectors = [
    // Standard citation meta tags
    'meta[name="citation_title"]',
    'meta[name="citation_author"]',
    'meta[name="citation_publication_date"]',
    'meta[name="citation_journal_title"]',
    'meta[name="citation_doi"]',
    'meta[name="citation_pdf_url"]',
    'meta[name="citation_abstract"]',
    'meta[name="citation_keywords"]',
    'meta[name="citation_volume"]',
    'meta[name="citation_issue"]',
    'meta[name="citation_firstpage"]',
    'meta[name="citation_lastpage"]',
    
    // Dublin Core meta tags
    'meta[name="dc.title"]',
    'meta[name="dc.creator"]',
    'meta[name="dc.date"]',
    'meta[name="dc.publisher"]',
    'meta[name="dc.identifier"]',
    'meta[name="dc.abstract"]',
    'meta[name="dc.subject"]',
    
    // Open Graph meta tags that might contain academic info
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:type"]',
    
    // Schema.org structured data
    'script[type="application/ld+json"]',
    'script[type="application/json"]'
  ];
  
  const academicData = {};
  let metaTagsFound = 0;
  
  // Process meta tags
  academicSelectors.slice(0, -2).forEach((selector, index) => {
    const meta = document.querySelector(selector);
    if (meta && meta.content && meta.getAttribute('name')) {
      const name = meta.getAttribute('name').replace(/^(citation_|dc\.)/, '');
      academicData[name] = meta.content;
      metaTagsFound++;
    }
  });
  
  // Process JSON-LD structured data
  const jsonScripts = document.querySelectorAll('script[type="application/ld+json"], script[type="application/json"]');
  
  jsonScripts.forEach((script, index) => {
    try {
      const data = JSON.parse(script.textContent);
      if (data && typeof data === 'object') {
        
        // Look for academic paper data in structured data
        if (data['@type'] === 'ScholarlyArticle' || 
            data['@type'] === 'Article' || 
            data['@type'] === 'ResearchPaper') {
          
          if (data.author) academicData.author = Array.isArray(data.author) ? data.author.join(', ') : data.author;
          if (data.datePublished) academicData.publication_date = data.datePublished;
          if (data.headline) academicData.title = data.headline;
          if (data.publisher) academicData.journal_title = data.publisher.name || data.publisher;
          if (data.identifier) academicData.doi = data.identifier;
          if (data.abstract) academicData.abstract = data.abstract;
          
        }
      }
    } catch (e) {
      // console.log(`❌ Error parsing JSON-LD script ${index + 1}:`, e.message);
    }
  });
  
  // If we found academic metadata, create a citation
  if (Object.keys(academicData).length > 2) {
    let citation = '';
    if (academicData.author) citation += academicData.author;
    if (academicData.publication_date) citation += ` (${academicData.publication_date})`;
    if (academicData.title) citation += `. ${academicData.title}`;
    if (academicData.journal_title) citation += `. ${academicData.journal_title}`;
    if (academicData.volume) citation += `, ${academicData.volume}`;
    if (academicData.issue) citation += `(${academicData.issue})`;
    if (academicData.firstpage && academicData.lastpage) citation += `, ${academicData.firstpage}-${academicData.lastpage}`;
    if (academicData.doi) citation += `. DOI: ${academicData.doi}`;
    
    if (citation) {
      collectCitation(citation);
    }
  }
}

// === Enhanced Wikipedia Detection ===
function handleWikipedia() {
  document.querySelectorAll('ol.references > li, ul.references > li').forEach(li => {
    const span = li.querySelector('span.reference-text, .reference-text');
    if (span) {
      collectCitation(span.innerText);
    } else {
      collectCitation(li.innerText);
    }
  });
  
  // Also look for inline citations
  document.querySelectorAll('sup.reference').forEach(sup => {
    const text = sup.getAttribute('title') || sup.innerText;
    if (text) {
      collectCitation(text);
    }
  });
}

// === Enhanced Citationsy Detection ===
function handleCitationsy() {
  document.querySelectorAll('div.reference, .citation-item, .reference-item').forEach(el => {
    if (el.innerText.match(/\d{4}/)) {
      collectCitation(el.innerText);
    }
  });
}

// === Enhanced EasyBib Detection ===
function handleEasyBib() {
  document.querySelectorAll('table p, .citation-text, .reference-text').forEach(p => {
    const text = p.innerText.trim();
    const citationRegex = /\(\d{4}\)|,\s?\d{4}\.|[^a-zA-Z](\d{4})[.)]/;
    if (citationRegex.test(text)) {
      collectCitation(text);
    }
  });
}

// === Site-Specific Processing ===
function processPageAndSend() {
  // Prevent multiple executions
  if (isProcessing || hasProcessed) {
    return;
  }
  
  isProcessing = true;
  
  const url = window.location.href;
  const domain = window.location.hostname;
  
  // Site-specific handlers
  if (domain.includes('scholar.google.com')) {
    handleGoogleScholar();
  } else if (domain.includes('inspirehep.net')) {
    handleInspireHep();
  } else if (domain.includes('wikipedia.org')) {
    handleWikipedia();
  } else if (domain.includes('citationsy.com')) {
    handleCitationsy();
  } else if (domain.includes('easybib.com')) {
    handleEasyBib();
  } else if (domain.includes('semanticscholar.org')) {
    handleSemanticScholar();
  } else if (domain.includes('researchgate.net')) {
    handleResearchGate();
  }
  
  // Generic detection for all sites
  detectGenericCitations();
  detectBibliographySections();
  detectAcademicPapers();
  
  // Mark as processed to prevent re-execution
  hasProcessed = true;
  isProcessing = false;
  
  // Send results after a short delay to ensure all citations are collected
  setTimeout(() => {
    if (collectedCitations.size > 0) {
      finalizeAndSend();
    }
  }, 1000);
}

// === Retry Detection Function ===
function retryDetection() {
  const domain = window.location.hostname;
  
  // Check if we have meaningful content before processing
  const allText = document.body.innerText;
  const hasContent = domain.includes('scholar.google.com') ? 
    (allText.includes('Cited by') || allText.includes('Einstein') || allText.includes('Physics')) :
    domain.includes('inspirehep.net') ? 
    (allText.includes('arXiv:') || allText.includes('DOI:') || allText.includes('Physics')) :
    true; // For other sites, assume content is there
  
  if (!hasContent) {
    return; // Don't process yet
  }
  
  // Re-run site-specific handlers
  if (domain.includes('scholar.google.com')) {
    handleGoogleScholar();
  } else if (domain.includes('inspirehep.net')) {
    handleInspireHep();
  } else if (domain.includes('semanticscholar.org')) {
    handleSemanticScholar();
  } else if (domain.includes('researchgate.net')) {
    handleResearchGate();
  }
  
  // Re-run generic detection
  detectGenericCitations();
  detectBibliographySections();
  detectAcademicPapers();
  
}

// === Finalize and Send Function ===
function finalizeAndSend() {
  const url = window.location.href;
  
  if (collectedCitations.size > 0) {
    
    try {
      chrome.runtime.sendMessage({
        type: 'store-citations',
        payload: {
          page_url: url,
          citations: Array.from(collectedCitations)
        }
      }, (response) => {
        if (chrome.runtime.lastError) {
          // console.error('❌ Error sending to background script:', chrome.runtime.lastError);
        } else {
          // console.log('✅ Citations successfully sent to background script');
        }
      });
    } catch (error) {
      // console.error('❌ Exception while sending citations:', error);
    }
  }
}

// === Enhanced Google Scholar Detection ===
function handleGoogleScholar() {
  
  // Check for specific Google Scholar indicators
  const allText = document.body.innerText;
  
  if (!allText.includes('Cited by') && !allText.includes('Einstein') && !allText.includes('Physics')) {
    return; // Don't process yet, let retry mechanism handle it
  }
  
  // Clear previous citations for this page
  collectedCitations.clear();
  
  // Method 1: Look for citation containers in the DOM
  const citationContainers = document.querySelectorAll('[class*="citation"], [class*="paper"], [class*="article"], [class*="publication"]');
  
  citationContainers.forEach((container, index) => {
    const text = container.innerText.trim();
    if (text.length > 50 && text.length < 2000) {
      // Check if this looks like a citation
      if (text.includes('Cited by') || text.includes('(') || text.includes(')') || text.includes(',')) {
        collectCitation(text);
      }
    }
  });
  
  // Method 2: Look for specific citation patterns in the entire text
  const lines = allText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentCitation = null;
  let citationsFound = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for author patterns (e.g., "A Einstein, B Podolsky, N Rosen")
    if (/^[A-Z] [A-Z][a-z]+(?:, [A-Z] [A-Z][a-z]+)*$/.test(line)) {
      // Start a new citation
      if (currentCitation) {
        // Save the previous citation if it's complete
        if (currentCitation.authors && currentCitation.journal) {
          const fullCitation = formatCitation(currentCitation);
          collectCitation(fullCitation);
          citationsFound++;
        }
      }
      
      currentCitation = {
        authors: line,
        journal: null,
        year: null,
        title: null
      };
    }
    
    // Look for journal patterns (e.g., "Physical Review 47 (10), 777")
    else if (/^[A-Z][a-z]+ [A-Z][a-z]+ \d+ \(\d+\), \d+$/.test(line)) {
      if (currentCitation) {
        currentCitation.journal = line;
      }
    }
    
    // Look for years (e.g., "1935", "1905")
    else if (/^[12]\d{3}$/.test(line)) {
      if (currentCitation) {
        currentCitation.year = line;
      }
    }
    
    // Look for titles (longer lines that might be paper titles)
    else if (line.length > 30 && line.length < 200 && 
             !line.includes('{') && !line.includes('}') &&
             !line.includes('z-index') && !line.includes('position:')) {
      if (currentCitation && !currentCitation.title) {
        currentCitation.title = line;
      }
    }
    
    // Look for citation counts (e.g., "26519", "20051")
    else if (/^\d{4,}$/.test(line) && line.length >= 4) {
      if (currentCitation && !currentCitation.citations) {
        currentCitation.citations = line;
      }
    }
  }
  
  // Don't forget the last citation
  if (currentCitation && currentCitation.authors && currentCitation.journal) {
    const fullCitation = formatCitation(currentCitation);
    collectCitation(fullCitation);
    citationsFound++;
  }
  
  // Method 3: Look for broader citation patterns
  const broadPatterns = [
    // Look for lines with authors and years
    /[A-Z][a-z]+ [A-Z][a-z]+.*\d{4}/g,
    // Look for lines with "Cited by" and numbers
    /Cited by \d+/gi,
    // Look for lines with journal-like patterns
    /[A-Z][a-z]+ [A-Z][a-z]+.*\d+.*\d+/g,
    // Look for lines with titles and years
    /[A-Z][a-z].*\d{4}/g
  ];
  
  broadPatterns.forEach((pattern, index) => {
    const matches = allText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        if (match.length > 20 && match.length < 500) {
          collectCitation(match);
        }
      });
    }
  });
  
  // Method 4: Look for table-like structures that might contain citations
  const tables = document.querySelectorAll('table, [role="grid"], .gsc_a_tr, .gsc_a_t');
  
  tables.forEach((table, index) => {
    const rows = table.querySelectorAll('tr, .gsc_a_tr, .gsc_a_t');
    rows.forEach((row, rowIndex) => {
      const text = row.innerText.trim();
      if (text.length > 50 && text.length < 1000) {
        // Check if this row looks like a citation
        if (text.includes('Cited by') || text.includes('(') || text.includes(')') || text.includes(',')) {
          collectCitation(text);
        }
      }
    });
  });
  
}

// === Helper function to check if text is navigation/UI ===
function isNavigationOrUI(text) {
  const navigationPatterns = [
    'INSPIRE', 'About INSPIRE', 'Content Policy', 'Privacy Notice', 'Terms of Use',
    'Help', 'FAQ', 'INSPIRE Help', 'Report metadata issues', 'Tools',
    'Bibliography generator', 'Community', 'Blog', 'Bluesky', 'X', 'Contact',
    'Powered by Invenio', 'Made with ❤ by the INSPIRE Team',
    'Submit', 'Login', 'Literature', 'Authors', 'Jobs', 'Seminars', 'Conferences',
    'DataBETA', 'More', 'refersto:recid:', 'literature'
  ];
  
  return navigationPatterns.some(pattern => text.includes(pattern));
}

// === Helper function to format citations ===
function formatCitation(citation) {
  let parts = [];
  
  if (citation.authors) parts.push(citation.authors);
  if (citation.title) parts.push(citation.title);
  if (citation.journal) parts.push(citation.journal);
  if (citation.year) parts.push(citation.year);
  if (citation.citations) parts.push(`Cited by ${citation.citations}`);
  
  return parts.join('. ');
}

// === INSPIRE-HEP Detection ===
function handleInspireHep() {
  
  // Check if content has loaded - INSPIRE-HEP is a React SPA
  const allText = document.body.innerText;
  
  if (allText.length < 1000) {
    return; // Don't process yet, wait and retry
  }
  
  // Check for INSPIRE-HEP specific indicators
  if (!allText.includes('e-Print:') && !allText.includes('INSPIRE') && !allText.includes('hep-th') && !allText.includes('hep-ph') && !allText.includes('gr-qc') && !allText.includes('citation')) {
    return; // Don't process yet, wait and retry
  }
  
  // Clear previous citations for this page
  collectedCitations.clear();
  
  // Method 1: Look for citation entries in the DOM
  const citationSelectors = [
    '.record-item', '.literature-item', '.paper-item', '.article-item',
    '[class*="record"]', '[class*="literature"]', '[class*="paper"]', '[class*="article"]',
    '.hep-record', '.inspire-record', '.search-result-item',
    'div[data-record-id]', 'div[data-paper-id]',
    // Add more specific selectors for INSPIRE-HEP
    '[class*="hep-"]', '[class*="inspire-"]', '[class*="search-"]',
    '.literature-search-results', '.search-results', '.results-list',
    // Look for the actual citation blocks
    '[class*="citation"]', '[class*="result"]', '[class*="item"]',
    '.hep-record-item', '.inspire-record-item', '.search-result-item'
  ];
  
  let citationElements = [];
  citationSelectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        citationElements = citationElements.concat(Array.from(elements));
      }
    } catch (e) {
      // console.log(`❌ Error with selector: ${selector}`);
    }
  });
  
  // Remove duplicates
  citationElements = [...new Set(citationElements)];
  
  // Process each citation element
  citationElements.forEach((element, index) => {
    const text = element.innerText.trim();
    if (text.length > 50 && text.length < 3000) {
      collectCitation(text);
    }
  });
  
  // Method 1.5: Look for specific citation blocks by their structure
  const allDivs = document.querySelectorAll('div');
  const citationBlocks = [];
  const seenCitations = new Set(); // Track seen citations to avoid duplicates
  
  allDivs.forEach(div => {
    const text = div.innerText.trim();
    // Look for blocks that contain both titles and e-Print identifiers
    if (text.length > 100 && text.length < 2000 && 
        text.includes('e-Print:') && 
        (text.includes('hep-th') || text.includes('hep-ph') || text.includes('gr-qc'))) {
      
      // Create a normalized version for duplicate detection
      const normalizedText = text.replace(/\s+/g, ' ').trim();
      
      // Only add if we haven't seen this exact content before
      if (!seenCitations.has(normalizedText)) {
        seenCitations.add(normalizedText);
        citationBlocks.push(div);
      }
    }
  });
  
  citationBlocks.forEach((block, index) => {
    const text = block.innerText.trim();
    collectCitation(text);
  });
  
  // Method 2: Look for specific INSPIRE-HEP patterns in text
  const lines = allText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentCitation = null;
  let citationsFound = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip navigation and UI elements
    if (isNavigationOrUI(line)) {
      continue;
    }
    
    // Look for arXiv identifiers (e.g., "2508.05134 [hep-th]")
    if (/^\d{4}\.\d{5}\s*\[[a-z-]+\]$/.test(line)) {
      if (currentCitation) {
        currentCitation.arxiv = line;
      }
    }
    
    // Look for e-Print patterns (e.g., "e-Print: 2508.05134 [hep-th]")
    else if (/^e-Print:\s*\d{4}\.\d{5}\s*\[[a-z-]+\]$/.test(line)) {
      if (currentCitation) {
        currentCitation.arxiv = line.replace('e-Print: ', '');
      }
    }
    
    // Look for DOI patterns (e.g., "10.1103/PhysRev.47.777")
    else if (/^10\.\d{4}\/[A-Za-z0-9.-]+$/.test(line)) {
      if (currentCitation) {
        currentCitation.doi = line;
      }
    }
    
    // Look for author patterns (e.g., "Leron Borsten, Simon Jonsson, Dimitri Kanakaris")
    else if (/^[A-Z][a-z]+ [A-Z][a-z]+(?:, [A-Z][a-z]+ [A-Z][a-z]+)*$/.test(line)) {
      // Start a new citation
      if (currentCitation) {
        // Save the previous citation if it's complete
        if (currentCitation.authors && (currentCitation.arxiv || currentCitation.doi)) {
          const fullCitation = formatInspireCitation(currentCitation);
          collectCitation(fullCitation);
          citationsFound++;
        }
      }
      
      currentCitation = {
        authors: line,
        arxiv: null,
        doi: null,
        title: null,
        year: null
      };
    }
    
    // Look for years (e.g., "Aug 7, 2025", "2025")
    else if (/^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}$/.test(line) || /^\d{4}$/.test(line)) {
      if (currentCitation) {
        currentCitation.year = line;
      }
    }
    
    // Look for titles (longer lines that might be paper titles)
    else if (line.length > 30 && line.length < 500 && 
             !line.includes('{') && !line.includes('}') &&
             !line.includes('z-index') && !line.includes('position:') &&
             !line.includes('INSPIRE') && !line.includes('About') &&
             !line.includes('Help') && !line.includes('Submit') &&
             !line.includes('Login') && !line.includes('Literature') &&
             !line.includes('Authors') && !line.includes('Jobs') &&
             !line.includes('Seminars') && !line.includes('Conferences') &&
             !line.includes('e-Print:') && !line.includes('arXiv:')) {
      if (currentCitation && !currentCitation.title) {
        currentCitation.title = line;
      }
    }
  }
  
  // Don't forget the last citation
  if (currentCitation && currentCitation.authors && (currentCitation.arxiv || currentCitation.doi)) {
    const fullCitation = formatInspireCitation(currentCitation);
    collectCitation(fullCitation);
    citationsFound++;
  }
  
  // Method 3: Look for broader INSPIRE-HEP patterns
  const broadPatterns = [
    // Look for lines with titles and arXiv IDs
    /[A-Z][a-z].*\d{4}\.\d{5}\s*\[[a-z-]+\]/g,
    // Look for lines with authors and dates
    /[A-Z][a-z]+ [A-Z][a-z]+.*\d{4}/g,
    // Look for lines with "citation" indicators
    /\d+\s*citation/g,
    // Look for lines with paper types
    /(?:article|published|thesis|conference paper|review|lectures)/gi
  ];
  
  broadPatterns.forEach((pattern, index) => {
    const matches = allText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        if (match.length > 20 && match.length < 500) {
          collectCitation(match);
        }
      });
    }
  });
  
  // If we found citations but couldn't assemble them properly, try to create citations from the raw data
  if (collectedCitations.size > 0 && citationsFound === 0) {
    
    // Look for lines that might be complete citations
    const potentialCitations = lines.filter(line => 
      line.length > 100 && 
      line.length < 1000 &&
      (line.includes('e-Print:') || line.includes('hep-th') || line.includes('hep-ph') || line.includes('gr-qc')) &&
      !isNavigationOrUI(line)
    );
    
    potentialCitations.forEach((line, index) => {
      collectCitation(line);
    });
  }
  
  // Final check - if we still have no citations, try to collect from the citation blocks we found
  if (collectedCitations.size === 0 && citationBlocks.length > 0) {
    citationBlocks.forEach((block, index) => {
      const text = block.innerText.trim();
      if (text.length > 50) {
        collectCitation(text);
      }
    });
  }
  
}

// === Helper function to format INSPIRE citations ===
function formatInspireCitation(citation) {
  let parts = [];
  
  if (citation.authors) parts.push(citation.authors);
  if (citation.title) parts.push(citation.title);
  if (citation.arxiv) parts.push(citation.arxiv);
  if (citation.doi) parts.push(citation.doi);
  if (citation.year) parts.push(citation.year);
  
  return parts.join('. ');
}

// === Semantic Scholar Detection ===
function handleSemanticScholar() {
  document.querySelectorAll('.citation-list__item, .paper-detail__citation, .paper-card').forEach(el => {
    const text = el.innerText || el.textContent;
    if (text && text.trim().length > 20) {
      collectCitation(text.trim());
    }
  });
  
  // Handle paper details
  document.querySelectorAll('.paper-detail__title, .paper-detail__authors').forEach(el => {
    const text = el.innerText || el.textContent;
    if (text && text.trim().length > 10) {
      collectCitation(text.trim());
    }
  });
}

// === ResearchGate Detection ===
function handleResearchGate() {
  document.querySelectorAll('.nova-v-publication-item__title, .nova-v-publication-item__authors').forEach(el => {
    const text = el.innerText || el.textContent;
    if (text && text.trim().length > 10) {
      collectCitation(text.trim());
    }
  });
  
  // Handle publication lists
  document.querySelectorAll('.publication-item, .research-item').forEach(el => {
    const title = el.querySelector('.publication-title, .research-title');
    const authors = el.querySelector('.publication-authors, .research-authors');
    const year = el.querySelector('.publication-year, .research-year');
    
    if (title || authors) {
      let citation = '';
      if (authors) citation += authors.innerText + ' ';
      if (title) citation += title.innerText;
      if (year) citation += ` (${year.innerText})`;
      if (citation) collectCitation(citation);
    }
  });
}

// === Check setting before processing ===
// Extension runs once per page load - no automatic re-detection
chrome.storage.local.get(['private_mode_setting'], (settings) => {
  
  if (settings && settings.private_mode_setting === true) {
    return;
  } else {
    // Run detection immediately
    processPageAndSend();
  }
});

