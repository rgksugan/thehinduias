/*globals $ */

'use strict';

(function() {

  chrome.storage.sync.get('keywords', function(response) {
    var keywords = response.keywords;

    // adds ticks if the article contains the keywords in http://www.thehindu.com/todays-paper/ page
    $('.tpaper').each(function(index, link) {
      $.get($(link).find('a').attr('href'), function(response) {
        var article = '';
        $(response).find('.body').each(function(index, text) {
          article += $(text).text();
        });
        keywords.forEach(function(keyword) {
          if (article.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
            $(link).addClass('thi-tick');
          }
        });
      });
    });

    // highlights keywords in the articles
    $('.body').each(function() {
      var that = this;
      keywords.forEach(function(keyword) {
        if ($(that).text().toLowerCase().indexOf(keyword.toLowerCase()) >= 0) {
          var replacedWord = $(that).html().match(new RegExp(keyword, 'ig'));
          $(that).html($(that).html().replace(replacedWord, '<span class="thi-highlight">' + replacedWord + '</span>'));
        }
      });
    });
  });

  // remove related articles
  $('.OUTBRAIN').remove();

  // updates context menu on selection
  $(document).on('selectionchange', function() {
    var selection = window.getSelection().toString().trim();
    chrome.runtime.sendMessage({
      request: 'updateContextMenu',
      selection: selection
    });
  });

}());