/*globals $ */

'use strict';

(function() {

  chrome.contextMenus.create({
    title: 'Add to IAS Hindu keywords',
    contexts: ['selection'],
    onclick: function() {
      console.log('i am clicked');
      chrome.storage.sync.get('keywords', function() {
        console.log('i am clicked', arguments);
      });
    }
  });

  function checkForValidUrl(tabId, changeInfo, tab) {
    if (tab.url.indexOf('http://www.thehindu.com') === 0) {

      //TODO: remove this, this method should be called after the page is loaded
      $.get(chrome.extension.getURL('data/keywords.json'), function(response) {
        var keywords = JSON.parse(response).keywords;
        $.get(tab.url, function(response) {
          var article = '';
          $(response).find('.body').each(function(index, text) {
            article += $(text).text();
          });
          var isToBeRead = false;
          keywords.forEach(function(keyword) {
            if (article.toLowerCase().indexOf(keyword) >= 0) {
              isToBeRead = true;
            }
          });
          if (isToBeRead) {
            chrome.pageAction.setIcon({
              tabId: tabId,
              path: 'images/circle-ok.png'
            });
          } else {
            chrome.pageAction.setIcon({
              tabId: tabId,
              path: 'images/circle-remove.png'
            });
          }
        });
        chrome.pageAction.show(tabId);
      });
    }
  }

  chrome.tabs.onUpdated.addListener(checkForValidUrl);

}());