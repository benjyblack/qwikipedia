const $ = require('jquery-browserify');

document.addEventListener('DOMContentLoaded', function () {
	
	var urlIsInteresting = function(targetUrl) {
		var currentUrl = document.URL;
		
		// if is not a link to a wikipedia page
		if (targetUrl.indexOf("/wiki/") == -1) return false;
		
		// if is not an anchor reference to this page
		if (targetUrl.indexOf(currentUrl + "#") != -1) return false;
		
		// if is not a link to a wikipedia reference to this page
		if (targetUrl.indexOf("/wiki/Wikipedia:") != -1) return false;
		
		// if it is a link to a file
		if (targetUrl.indexOf("/wiki/File:") != -1) return false;
		
		return true;
	}
	// gets given wikipages information
	var getInformation = function(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				callback(xhr.responseText);
			}
		};
		xhr.send(null);
	}
	
	// parses out the important parts of wiki page
	var parsePage = function(html) {
		return $("#mw-content-text > p", html).first().text();
	}
	
	var timerLength = 200;
	
	$("a").each( function() {
	
		// prune out unwanted links
		if (!$(this).attr('href') || !urlIsInteresting($(this).attr('href'))) return;
		
		// wrap wanted links in our class
		$(this).wrap('<span class="qwiki-reference" />');
		
		// remove title attribute, can obscure tooltip box
		$(this).removeAttr('title');
		
		var tooltipNode, hideTimer, showTimer, checkFlip = false;

		function hide( refLink ){
				if( tooltipNode && tooltipNode.parentNode == document.body ) {
						hideTimer = setTimeout( function() {
								$(tooltipNode).animate({opacity: 0}, 100, function(){ document.body.removeChild( tooltipNode ) })
						}, 100)
				} else {
						//h && (h.style.border = "");
				}
		}
		function show(){
				if( !tooltipNode.parentNode || tooltipNode.parentNode.nodeType === 11 ){
						document.body.appendChild( tooltipNode );
						checkFlip = true;
				}
				$(tooltipNode).stop().animate({opacity: 1}, 100)
				clearTimeout( hideTimer );
		}
		$(this).hover(function( e ){
			
				var _this = this;
				
				showTimer && clearTimeout( showTimer );
				showTimer = setTimeout( function() {
				
					// gather information and place it in text box
					getInformation(_this.getAttribute('href'), function(text)
						{	
							var h = document.createElement("li");
							$(h).append(parsePage(text));
							
							/*if( ( window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0 ) + $(window).height() > $( h ).offset().top + h.offsetHeight ) {
									h.style.border = "#080086 2px solid";
									return;
							}*/
							if(!tooltipNode){
									tooltipNode = document.createElement("ul");
									tooltipNode.className = "qwiki-referencetooltip";
									tooltipNode.appendChild( h.cloneNode( true ) );
									tooltipNode.appendChild( document.createElement( "li" ) );
									$(tooltipNode).hover(show, hide);
							}
							show();
							debugger;
							var o = $(_this).offset(), oH = tooltipNode.offsetHeight;
							$(tooltipNode).css({top: o.top - oH, left: o.left - 7 });
							if( tooltipNode.offsetHeight > oH ) { // is it squished against the right side of the page?
									$(tooltipNode).css({left:'auto',right:0});
									tooltipNode.lastChild.style.marginLeft = (o.left - tooltipNode.offsetLeft) + "px";
							}
							if( checkFlip ) {
									if( o.top < tooltipNode.offsetHeight + ( window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0 ) ) { // is part of it above the top of the screen?
											$(tooltipNode).addClass("RTflipped").css({top: o.top + 12});
									} else if( tooltipNode.className === "qwiki-referencetooltip RTflipped" ) { // cancel previous
											$(tooltipNode).removeClass("RTflipped");
									}
									checkFlip = false;
							}
						})
				}, timerLength);
		}, function(){clearTimeout(showTimer); hide(this); } )

	} );
 
});
