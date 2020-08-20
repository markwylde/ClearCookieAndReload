/* global chrome */

// triggered when user clicks on installed extention icon
chrome.browserAction.onClicked.addListener(function (tab) {
  const url = tab.url;

  // clear all localstorage
  chrome.tabs.executeScript(tab.id, { code: 'localStorage.clear()' });

  // clear all cookies for the current url
  chrome.cookies.getAll({ url: url }, function (cookies) {
    console.log('Clearing cookies for active url', url, cookies);
    clearCookies(cookies);
  });

  // retrive domain from active tab
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  let domain = matches && matches[1].replace('www.', '');
  domain = '.' + domain;

  // get all cookies for domain
  chrome.cookies.getAll({ domain: domain }, function (cookies) {
    console.log('Clearing cookies for domain', domain, cookies);
    clearCookies(cookies);
  });

  // reload tab
  chrome.tabs.reload(tab.id);
});

function clearCookies (cookies) {
  // iterate on cookie to get cookie detail
  for (let i = 0; i < cookies.length; i++) {
    const url = 'http' + (cookies[i].secure ? 's' : '') + '://' + cookies[i].domain + cookies[i].path;
    const cname = cookies[i].name;

    // delete cookie
    chrome.cookies.remove({
      url: url,
      name: cname
    });
  }
}
