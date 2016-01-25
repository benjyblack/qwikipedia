import $ from 'jquery';
import 'bootstrap';
import fetch from 'isomorphic-fetch';
import  _ from 'lodash';

const BASE_URL = 'https://wikipedia.org';
const POPOVER_ID = 'qwikipop';
const TOOLTIP_DELAY = 500;
const TOOLTIP_HTML = `<div data-id="${POPOVER_ID}" class="popover" role="tooltip">
  <div class="arrow"></div>
  <h3 class="popover-title"></h3>
  <div class="popover-content"></div>
</div>`;

const onReady = () => {
  require('../css/bootstrap.min.css');

  const allLinkTags = $('a');
  const interestingLinkTags = jqify(_.filter(allLinkTags, isLinkTagInteresting));

  _.invokeMap(interestingLinkTags, 'attr', 'data-toggle', 'popover');
  _.invokeMap(interestingLinkTags, 'attr', 'data-placement', 'bottom');
  _.invokeMap(interestingLinkTags, 'popover', {
    trigger: 'hover',
    template: TOOLTIP_HTML,
    delay: TOOLTIP_DELAY,
    content: getTooltipContent
  });
};

const jqify = _.partialRight(_.map, $);

const isLinkTagInteresting = (targetUrl) => {
  const linkTagURL = targetUrl.getAttribute('href');
  return linkTagURL &&
    linkTagURL.match('/wiki/') &&
    !linkTagURL.match(document.URL + '#') &&
    !linkTagURL.match('/wiki/Wikipedia:') &&
    !linkTagURL.match('/wiki/File:');
};

const getTooltipContent = function () {
  const FIRST_PARAGRAPH_SELECTOR = '#mw-content-text p:first-of-type';
  const link = BASE_URL + this.getAttribute('href');

  fetch(link).then(function (response) {
    return response.text();
  }).then(function (html) {
    const parsedHTML = $.parseHTML(html);
    const firstParagraph = $(parsedHTML).find(FIRST_PARAGRAPH_SELECTOR);
    const firstParagraphText = firstParagraph.text();

    $(`[data-id="${POPOVER_ID}"] .popover-content`).text(firstParagraphText);
  });

  return 'Loading...';
};

document.addEventListener('DOMContentLoaded', onReady);