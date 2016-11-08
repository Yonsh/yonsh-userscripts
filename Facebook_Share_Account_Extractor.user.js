// ==UserScript==
// @name        Facebook Share Account Extractor
// @namespace   https://github.com/Yonsh/yonsh-userscripts
// @include     https://m.facebook.com/shares/view?id=*
// @include     https://www.facebook.com/*
// @version     1.1.1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     https://gist.githubusercontent.com/BrockA/2625891/raw/9c97aa67ff9c5d56be34a55ad6c18a314e5eb548/waitForKeyElements.js
// ==/UserScript==

function start() {
  var url = window.location.href;
  if (url.indexOf("https://www.facebook.com") == 0) {
    waitForKeyElements('.UFIShareLink', addExtractLink);
  } else {
    if ($.urlParam('extract')) {
      $(window).load(extractAccounts);
    }
  }
}

$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}

function addExtractLink() {
  $shareLinks = $('.UFIShareLink');
  for (var i = 0; i < $shareLinks.length; i++) {
    if ($($shareLinks[i]).siblings().length == 0) {
      var link = $($shareLinks[i]).attr('href').replace("www", "m") + '&extract=true';
      $extractLink = $('<a href="' + link + '">(截取)</a>');
      $extractLink.click(function() {window.location = link; return false;});
      $($shareLinks[i]).after($extractLink);
    }
  }
}

function extractAccounts() {
  var $table = $('<table border="1"></table>');
  $names = $('#m_story_permalink_view div div div div h3 strong a');
  var flags = [];
  for (var i = 0; i < $names.length; i++) {
    var $row = $('<tr></tr>');
    $row.append('<td>' + $($names[i]).html() + '</td>');
    var s = $($names[i]).attr('href');
    s = 'http://facebook.com' + s.substring(0, s.indexOf('fref=nf&') - 1);
    $row.append('<td><a href="' + s + '">' + s + '</a></td>');
    if (!flags[s]) {
      flags[s] = true;
      $table.append($row);
    }
  }
  $('body').html($table);
}

start();