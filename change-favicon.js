const setIcon = () => {
  const head = document.getElementsByTagName('head')[0];

  let link;
  do {
    link = head.querySelector("link[rel~='icon']");
    link?.remove()
  } while (link);

  link = document.createElement('link');
  link.rel = 'icon';
  head.appendChild(link);

  const projectIcon = document.querySelector('#project-avatar')?.src;

  const icons = {
    'jira.internal.dnanexus.com': projectIcon ?? 'https://wac-cdn-bfldr.atlassian.com/K3MHR9G8/at/hmv84b686k38wqh7tpwrfkcv/jira-logo.svg',
    'confluence.internal.dnanexus.com': 'https://wac-cdn-bfldr.atlassian.com/K3MHR9G8/at/wfr836ffrrh5b7qs43qhgkv/confluence-logo.svg',
    // fix for dark theme
    'github.com': 'https://github.githubassets.com/favicons/favicon-dark.png',
    'docs.github.com': 'https://github.com/fluidicon.png',

    'docs.google.com/document/': chrome.runtime.getURL("gdocs.png"),
    'docs.google.com/spreadsheets/': chrome.runtime.getURL("gspreadsheet.png"),
  }

  for (const host of Object.keys(icons)) {
    const pageUrl = host.includes('/') ? location.href : location.host;

    if (pageUrl.includes(host)) {
      link.href = icons[host];
    }
  }
};

setIcon();
setTimeout(setIcon, 2000);
