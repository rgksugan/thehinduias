/*globals $ */

'use strict';

(function() {

  $.get(chrome.extension.getURL('data/keywords.json'), function(response) {
    var keywords = JSON.parse(response).keywords;
    Array.prototype.slice.call($('.tpaper')).forEach(function(link) {
      $.get($(link).find('a').attr('href'), function(response) {
        var article = '';
        $(response).find('.body').each(function(index, text) {
          article += $(text).text();
        });
        keywords.forEach(function(keyword) {
          if (article.toLowerCase().indexOf(keyword) >= 0) {
            $(link).addClass('tick');
          }
        });
      });
    });
  });

}());