/*globals $ */

'use strict';

(function() {

  // when installed loads keywords from the fixtures
  chrome.runtime.onInstalled.addListener(function() {
    $.get(chrome.extension.getURL('data/keywords.json'), function(response) {
      var keywords = JSON.parse(response).keywords;
      chrome.storage.sync.set({
        'keywords': keywords
      });
    });
  });

  // context menu click handler
  var contextClickHandler = function(selection) {
    chrome.storage.sync.get('keywords', function(response) {
      var index = response.keywords.indexOf(selection.selectionText.toLowerCase());
      if (index < 0) {
        response.keywords.push(selection.selectionText.toLowerCase());
      } else {
        response.keywords.splice(index, 1);
      }
      chrome.storage.sync.set({
        'keywords': response.keywords
      });
    });
  };

  var contextMenu = chrome.contextMenus.create({
    title: 'Add To TheHinduIAS',
    contexts: ['selection'],
    onclick: contextClickHandler
  });

  chrome.runtime.onMessage.addListener(function(message) {
    if (message.request === 'updateContextMenu') {
      var selection = message.selection;
      if (selection === '') {
        if (contextMenu !== null) {
          chrome.contextMenus.remove(contextMenu);
          contextMenu = null;
        }
      } else {
        var title = '';
        chrome.storage.sync.get('keywords', function(response) {
          if (response.keywords.indexOf(selection.toLowerCase()) < 0) {
            title = 'Add To TheHinduIAS';
          } else {
            title = 'Remove From TheHinduIAS';
          }
          var options = {
            title: title,
            contexts: ['selection'],
            onclick: contextClickHandler
          };
          if (contextMenu !== null) {
            chrome.contextMenus.update(contextMenu, options);
          } else {
            contextMenu = chrome.contextMenus.create(options);
          }
        });
      }
    }
  });

  // add tick or cross based on the keywords
  function checkForValidUrl(tabId, changeInfo, tab) {
    if (tab.url.indexOf('http://www.thehindu.com') === 0) {

      chrome.storage.sync.get('keywords', function(response) {
        var keywords = response.keywords;
        //TODO: remove this, this method should be called after the page is loaded
        $.get(tab.url, function(response) {
          var article = '';
          $(response).find('.body').each(function(index, text) {
            article += $(text).text();
          });
          var isToBeRead = false;
          keywords.forEach(function(keyword) {
            if (article.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
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