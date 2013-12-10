
document.addEventListener('DOMContentLoaded', function () {
	
	var urlIsInteresting = function(targetUrl) {
		var currentUrl = document.URL;
		
		// if is not a link to a wikipedia page
		if (targetUrl.indexOf("/wiki/") == -1) return false;
		
		// if is not an anchor reference to this page
		if (targetUrl.indexOf(currentUrl + "#") != -1) return false;
		
		// if is not a link to a wikipedia reference to this page
		if (targetUrl.indexOf("/wiki/Wikipedia:") != -1) return false;
		
		return true;
	}
	// gets given wikipages information
	var getInformation = function(url, source, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				callback(xhr.responseText, source);
			}
		};
		xhr.send(null);
	}
	
	// parses out the important parts of wiki page
	var parsePage = function(html) {
		return $("#mw-content-text > p", html).first().text();
	}
	
	// Make sure we are in article, project, or help namespace
    if ( wgCanonicalNamespace === '' || wgCanonicalNamespace === 'Project' || wgCanonicalNamespace === 'Help' ) {
        var timerLength = 200;
		
        $("a").each( function() {
		
			// prune out unwanted links
			if (!$(this).attr('href') || !urlIsInteresting($(this).attr('href'))) return;
			
			// wrap wanted links in our class
			$(this).wrap('<span class="qwiki-reference" />');
			
            var tooltipNode, hideTimer, showTimer, checkFlip = false;
            function findRef( h ){
                    h = h.firstChild.getAttribute("href"); h = h && h.split("#"); h = h && h[1];
                    h = h && document.getElementById( h );
                    h = h && h.nodeName == "LI" && h;
                    return h;
            }
            function hide( refLink ){
                    if( tooltipNode && tooltipNode.parentNode == document.body ) {
                            hideTimer = setTimeout( function() {
                                    $(tooltipNode).animate({opacity: 0}, 100, function(){ document.body.removeChild( tooltipNode ) })
                            }, 100)
                    } else {
						// gather information and place it in text box
						getInformation(url, $(this).offset(), function(text, source)
							{	
								
							}
						);
                            h && (h.style.border = "");
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
                            var h = findRef( _this );
                            if( !h ){return};
                            if( ( window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0 ) + $(window).height() > $( h ).offset().top + h.offsetHeight ) {
                                    h.style.border = "#080086 2px solid";
                                    return;
                            }
                            if(!tooltipNode){
                                    tooltipNode = document.createElement("ul");
                                    tooltipNode.className = "referencetooltip";
                                    var c = tooltipNode.appendChild( h.cloneNode( true ) );
                                    try {
                                            if( c.firstChild.nodeName != "A" ) {
                                                    while( c.childNodes[1].nodeName == "A" && c.childNodes[1].getAttribute( "href" ).indexOf("#cite_ref-") !== -1 ) {
                                                            do { c.removeChild( c.childNodes[1] ) } while ( c.childNodes[1].nodeValue == " " );
                                                    }
                                            }
                                    } catch (e) { mw.log(e) }
                                    c.removeChild( c.firstChild );
                                    $( tooltipNode.firstChild.insertBefore( document.createElement( "span" ), tooltipNode.firstChild.firstChild ) ).addClass("RTsettings").attr("title", "Tooltip settings").click(function(){
                                            mw.loader.using(["jquery.cookie","jquery.ui.dialog"], openSettingsMenu);
                                    })
                                    tooltipNode.appendChild( document.createElement( "li" ) );
                                    $(tooltipNode).hover(show, hide);
                            }
                            show();
                            var o = $(_this).offset(), oH = tooltipNode.offsetHeight;
                            $(tooltipNode).css({top: o.top - oH, left: o.left - 7 });
                            if( tooltipNode.offsetHeight > oH ) { // is it squished against the right side of the page?
                                    $(tooltipNode).css({left:'auto',right:0});
                                    tooltipNode.lastChild.style.marginLeft = (o.left - tooltipNode.offsetLeft) + "px";
                            }
                            if( checkFlip ) {
                                    if( o.top < tooltipNode.offsetHeight + ( window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0 ) ) { // is part of it above the top of the screen?
                                            $(tooltipNode).addClass("RTflipped").css({top: o.top + 12});
                                    } else if( tooltipNode.className === "referencetooltip RTflipped" ) { // cancel previous
                                            $(tooltipNode).removeClass("RTflipped");
                                    }
                                    checkFlip = false;
                            }
                    }, timerLength);
            }, function(){clearTimeout(showTimer); hide(this); } )
 
        } );
        
    }
	/*
	// add reference section
	$(".references").append("<li id=" + referenceId + ">"
			+ "<span class='mw-cite-backlink'><b><a href='#'>Pineapples</a></b></span>"
			+ "<span class='reference-text'><a href='#'></a></span>"
			+ "</li>");

	$("a").each(function () {
		if (!$(this).attr('href') || !urlIsInteresting($(this).attr('href'))) return;
		
		$(this).hover(function () {
			$("#" + referenceId).attr('id', '#' + $(this).attr('href'));
		});
		
		$(this).wrap('<span id="qwiki-reference" class="reference" />');
	});
	
	/// second try

	// add popup div to page
	$("body").append("<ul class='referencetooltip' id='qwiki-box' style='opacity:1;pointer-events:none;'>"
					+ "<li>"
					+ "<span class='citation news'></span>"
					+ "</li><li></li></ul>");

	// set up hover functionality
	$("a").hover(function(e) { 
		var url = $(this).attr('href');
		// check to see if the URL is not one we care about
		if (!urlIsInteresting(url)) return;
		
		// gather information and place it in text box
		getInformation(url, $(this).offset(), function(text, source)
			{	
				$("#qwiki-box li:first-child span").text(parsePage(text));
				
				$("#qwiki-box").stop().show();
				
				$("#qwiki-box").css({
					left: source['left'],
					top: source['top'] - 35 - $("#qwiki-box li:first-child").height()
				});
			}
		);
	}, function() {
		$("#qwiki-box").hide();
	});
	*/
});
