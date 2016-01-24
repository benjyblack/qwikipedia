const $ = require('jquery-browserify');
const fetch = require('isomorphic-fetch');
const _ = require('lodash');

const TIMER_LENGTH = 200;

const onReady = () => {
  let allLinkTags = $('a');
  let interestingLinkTags = _.filter(allLinkTags, isLinkTagInteresting);
  debugger;

  _.invoke(interestingLinkTags, 'addClass', 'qwiki-reference');
  _.invoke(interestingLinkTags, 'removeAttr', 'title');
};

const isLinkTagInteresting = (targetUrl) => {
  let linkTagURL = targetUrl.getAttribute('href');
  return linkTagURL &&
    linkTagURL.match('/wiki/') &&
    !linkTagURL.match(document.URL + '#') &&
    !linkTagURL.match('/wiki/Wikipedia:') &&
    !linkTagURL.match('/wiki/File:');
};

const getInterestingLinkTags = () => {
  return $('a').filter((index, linkTag) => {
    return isLinkTagInteresting($(linkTag).attr('href'));
  });
};


document.addEventListener('DOMContentLoaded', onReady);

function x() {
	// gets given wikipages information
  const getInformation = function (url, callback) {
    return fetch(url).then(function (response) {
      callback(response);
    });
  };

  // parses out the important parts of wiki page
  const parsePage = function (html) {
    return $('#mw-content-text > p', html).first().text();
  };

  $('a').each(function () {
    //// prune out unwanted links
    //if (!$(this).attr('href') || !isURLInteresting($(this).attr('href')), document.URL) {
    //  return;
    //}
    //
    //// wrap wanted links in our class
    //$(this).wrap('<span class="qwiki-reference" />');
    //
    //// remove title attribute, can obscure tooltip box
    //$(this).removeAttr('title');

    let tooltipNode;
    let hideTimer;
    let showTimer;
    let checkFlip = false;

    function hide() {
      if (tooltipNode && tooltipNode.parentNode === document.body) {
        hideTimer = setTimeout(function () {
          $(tooltipNode).animate({opacity: 0}, 100, function (){
            document.body.removeChild(tooltipNode);
          });
        }, 100);
      } else {
        // h && (h.style.border = ')
      }
    }

    function show() {
      if (!tooltipNode.parentNode || tooltipNode.parentNode.nodeType === 11 ){
        document.body.appendChild(tooltipNode);
        checkFlip = true;
      }
      $(tooltipNode).stop().animate({opacity: 1}, 100);
      clearTimeout(hideTimer);
    }

    $(this).hover(function (e) {
      let _this = this;

      showTimer && clearTimeout(showTimer);
      showTimer = setTimeout(function () {

        // gather information and place it in text box
        getInformation(_this.getAttribute('href'), function (text) {
          let h = document.createElement('li');
          $(h).append(parsePage(text));

          /*if (( window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0 ) + $(window).height() > $( h ).offset().top + h.offsetHeight ) {
              h.style.border = '#080086 2px solid'
              return
          }*/

          if (!tooltipNode){
            tooltipNode = document.createElement('ul');
            tooltipNode.className = 'qwiki-referencetooltip';
            tooltipNode.appendChild(h.cloneNode(true));
            tooltipNode.appendChild(document.createElement('li'));
            $(tooltipNode).hover(show, hide);
          }
          show();

          let o = $(_this).offset();
          let oH = tooltipNode.offsetHeight;
          $(tooltipNode).css({top: o.top - oH, left: o.left - 7 });

          if (tooltipNode.offsetHeight > oH ) { // is it squished against the right side of the page?
            $(tooltipNode).css({left: 'auto', right: 0});
            tooltipNode.lastChild.style.marginLeft = (o.left - tooltipNode.offsetLeft) + 'px';
          }

          if (checkFlip) {
            if (o.top < tooltipNode.offsetHeight + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0)) { // is part of it above the top of the screen?
              $(tooltipNode).addClass('RTflipped').css({top: o.top + 12});
            } else if (tooltipNode.className === 'qwiki-referencetooltip RTflipped') { // cancel previous
              $(tooltipNode).removeClass('RTflipped');
            }
            checkFlip = false;
          }
        });
      }, TIMER_LENGTH);
    }, function (){
      clearTimeout(showTimer);
      hide(this);
    });
	});
};