//(function ($, Drupal) {

  //Drupal.behaviors.state = {
    //attach: function(context, settings) {
    	
        $(document).ready(function() {
            // https://gist.github.com/zachleat/2008932
            // * iOS zooms on form element focus. This script prevents that behavior.
            // * <meta name="viewport" content="width=device-width,initial-scale=1">
            //      If you dynamically add a maximum-scale where no default exists,
            //      the value persists on the page even after removed from viewport.content.
            //      So if no maximum-scale is set, adds maximum-scale=10 on blur.
            //      If maximum-scale is set, reuses that original value.
            // * <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=2.0,maximum-scale=1.0">
            //      second maximum-scale declaration will take precedence.
            // * Will respect original maximum-scale, if set.
            // * Works with int or float scale values.
            function cancelZoom(){
              var d = document,
                viewport,
                content,
                maxScale = ',maximum-scale=',
                maxScaleRegex = /,*maximum\-scale\=\d*\.*\d*/;
              // this should be a focusable DOM Element
              if(!this.addEventListener || !d.querySelector) {
                return;
              }
              viewport = d.querySelector('meta[name="viewport"]');
              content = viewport.content;
              function changeViewport(event){
                // http://nerd.vasilis.nl/prevent-ios-from-zooming-onfocus/
                viewport.content = content + (event.type == 'blur' ? (content.match(maxScaleRegex, '') ? '' : maxScale + 10) : maxScale + 1);
              }
              // We could use DOMFocusIn here, but it's deprecated.
              this.addEventListener('focus', changeViewport, true);
              this.addEventListener('blur', changeViewport, false);
            }
            // jQuery plugin
            (function($){
              $.fn.cancelZoom = function()
              {
                return this.each(cancelZoom);
              };
              // Usage:
              $('input:text,select,textarea').cancelZoom();
            })(jQuery);
      
            // Removing inline style applied to Flickr:
            // .flickr-album
            $('.flickr-album').addClass('clearfix') &&
            // .flickr-wrap
            $('.flickr-wrap').removeAttr('style');
      
            // http://stackoverflow.com/questions/16285791/how-do-you-replace-an-html-tag-with-another-tag-in-jquery
            // Replacing Foundation's topbar default h5 back link wrapper tag:
            $('.title.back.js-generated h5').contents().unwrap().wrap('<h3/>');
      
            // Equalize heights on Calendar - NOTE: It would be nice to only load this on the Calendar page vs. every page.
            // Moved this function here, and remarked out the <script> block containing this function inside the "calendar-month.tpl.php" file.
            // This gets us around "Uncaught ReferenceError: jQuery is not defined" in the console since the <script> block in the file was appearing before JQuery in the markup. 
            //;(function($) {
            //  try {
            //    $(".calendar-day").equalHeights(150, 150);
            //  }
            //  catch(ex) {/* Exit gracefully*/}
            //})(jQuery);
      
            // Back to Top Button:
            $(window).scroll(function(){
              if ($(this).scrollTop() > 100) {
                $('.b-back-to-top').fadeIn();
              } else {
                $('.b-back-to-top').fadeOut();
              }
            });
            $('.b-back-to-top').click(function(){
              $("html, body").animate({ scrollTop: 0 }, 600);
              return false;
            });
      
            // Remarking this out for now...
            // It causes JS errors on pages that do NOT have the ".chosen-container" on them.
            // It also creates a delay of resizing the Top Story photo when the browser is resized.
            // Need to determine how to only load this script on node level pages when the ".chosen-container" is present.
            // It is not needed on the Home Page.
            // Resize Chosen dropdown list on window resize:
            // http://stackoverflow.com/questions/26425643/how-to-resize-a-chosen-jquery-dropdownlist-on-windows-resize
            //$(window).resize(function () {
            //  var width = $(".form-item")[0].offsetWidth + "px";
            //  $(".form-item .chosen-container").css("width", width);
            //});
      
            // Foundation Responsive Tables:
            // http://zurb.com/playground/responsive-tables
            var switched = false;
            var updateTables = function() {
              if (($(window).width() < 640) && !switched ){
                switched = true;
                $("table.responsive").each(function(i, element) {
                  splitTable($(element));
                });
                return true;
              }
              else if (switched && ($(window).width() > 640)) {
                switched = false;
                $("table.responsive").each(function(i, element) {
                  unsplitTable($(element));
                });
              }
            };
            $(window).load(updateTables);
            $(window).on("redraw",function(){switched=false;updateTables();}); // An event to listen for
            $(window).on("resize", updateTables);
            function splitTable(original)
            {
              original.wrap("<div class='table-wrapper' />");
              var copy = original.clone();
              copy.find("td:not(:first-child), th:not(:first-child)").css("display", "none");
              copy.removeClass("responsive");
              original.closest(".table-wrapper").append(copy);
              copy.wrap("<div class='pinned' />");
              original.wrap("<div class='scrollable' />");
              //setCellHeights(original, copy);
            }
            function unsplitTable(original) {
              original.closest(".table-wrapper").find(".pinned").remove();
              original.unwrap();
              original.unwrap();
            }
            /*
            function setCellHeights(original, copy) {
              var tr = original.find('tr'),
                  tr_copy = copy.find('tr'),
                  heights = [];
              tr.each(function (index) {
                var self = $(this),
                    tx = self.find('th, td');
                tx.each(function () {
                  var height = $(this).outerHeight(true);
                  heights[index] = heights[index] || 0;
                  if (height > heights[index]) heights[index] = height;
                });
              });
              tr_copy.each(function (index) {
                $(this).height(heights[index]);
              });
            }
            */
      
            // Slick - Top Stories
            $('.top-stories-slick').slick({
              accessibility: true,
              //adaptiveHeight: true,
              autoplay: false,
              arrows: false,
              //appendDots: '.top-stories-nav',
              //appendDots: '.l-top-stories',
              //dotsClass: 'slick-dots',
              cssEase: 'linear',
              dots: true,
              fade: true,
              focusOnSelect: true,
              mobileFirst: true,
              slide: '.slide',
              speed: 500
            });
            //$('.top-stories-nav .slick-dots').addClass('inline-list'); // Adding Foundation's "inline-list" class to Slick dots.
            $('.slick-dots').addClass('inline-list'); // Adding Foundation's "inline-list" class to Slick dots.
            
            // Responsive Nav
            // Jen added a check to see that the class exists so errors are not thrown if it doesn't, for example in the IMCE window
            if ($(".nav-collapse")[0]){
              // Responsive Nav:
              // http://responsive-nav.com/
              // Max height doesn't account for padding on .nav-collapse, see:
              // https://github.com/viljamis/responsive-nav.js/issues/95
              var nav = responsiveNav(".nav-collapse", { // Selector
                animate: true, // Boolean: Use CSS3 transitions, true or false
                transition: 200, // Integer: Speed of the transition, in milliseconds
                label: "Menu", // String: Label for the navigation toggle
                insert: "before", // String: Insert the toggle before or after the navigation
                customToggle: "", // Selector: Specify the ID of a custom toggle
                closeOnNavClick: false, // Boolean: Close the navigation when one of the links are clicked
                openPos: "relative", // String: Position of the opened nav, relative or static
                navClass: "nav-collapse", // String: Default CSS class. If changed, you need to edit the CSS too!
                navActiveClass: "js-nav-active", // String: Class that is added to <html> element when nav is active
                jsClass: "js", // String: 'JS enabled' class which is added to <html> element
                init: function(){
                  $(".nav-toggle").addClass('right hide-for-print');
                }, // Function: Init callback
                open: function(){}, // Function: Open callback
                close: function(){} // Function: Close callback
              });
            }
      
            // Accordion to Full
            // http://codepen.io/bradfrost/pen/dlwBD#null
            $('body').addClass('js');
            var $tab = $('.tab');
            
            $tab.on("click", function(e){
              e.preventDefault();
              var $this = $(this);
              $this.toggleClass('active');
              $this.next('.content').toggleClass('active');
            });
      
            /*
            // Skip Navigation Link (Hmmm...):
            // Bind a click event to the 'skip' link:
            $(".skip").click(function(event){
              
              // Strip the leading hash and declare the content we're skipping to:
              var skipTo="#"+this.href.split('#')[1];
              
              // Setting 'tabindex' to -1 takes an element out of normal tab flow but allows it to be focused via JS:
              $(skipTo).attr('tabindex', -1).on('blur focusout', function () {
                
                // When focus leaves this element, remove the tabindex attribute:
                $(this).removeAttr('tabindex');
                
              }).focus(); // Focus on the content container.
            });
            */
      
            // IMPORTANT: Commenting this out because it causes the IMCE buttons to disappear.
            // Adding this as an inline script inside the "html.tpl.php" file, see the "script" block right before "noscript" block...
            //
            // Added the following to equalize the heights of the DPB Calendar
            // NOTE: I modified "calendar-datebox.tpl.php", and "calendar-month.tpl.php".
            // http://foundation.zurb.com/forum/posts/18883-equalizer-with-ul--li-instead-of-divs
            // See Robert Stark's comment about using the following, otherwise multiple rows of block-grid don't work:
            //$(document).foundation({
            //  equalizer: {
            //    equalize_on_stack: true
            //  }
            //});
      
            // Read More/Show Less Buttons
            // http://jedfoster.com/Readmore.js/
            // Nested everything inside $(window).load function to prevent YouTube videos from
            // disappearing in Safari. This seems to be working now.
            //$(window).load(function(){ // https://github.com/jedfoster/Readmore.js/issues/39
            //  $('article.node').readmore({
            //    speed: 75, // In milliseconds
            //    collapsedHeight: 768, // In pixels
            //    //heightMargin: 16, // In pixels, avoids collapsing blocks that are only slightly larger than collapsedHeight.
            //    moreLink: '<div class="text-center"><a href="#" class="button b-read-more">Read More</a></div>',
            //    lessLink: '<div class="text-center"><a href="#" class="button b-show-less">Show Less</a></div>',
            //    embedCSS: true, // Insert required CSS dynamically, set this to false if you include the necessary CSS in a stylesheet.
            //    blockCSS: 'display: block;', // Sets the styling of the blocks, ignored if embedCSS is false.
            //    afterToggle: function(trigger, element, expanded) {
            //      if(! expanded) { // The "Read Less" link was clicked.
            //        $('html, body').animate({scrollTop: element.offset().top}, {duration: 75});
            //      }
            //      //$('article.node').readmore('destroy');
            //    } // Called after the block is collapsed or expanded.
            //  });
            //});
      
            // Twitter Feed (Adjust Min/Max Width):
            // Source: http://stackoverflow.com/a/31579594
            $(window).load(function(){
              twitterCheck = setInterval(function() {
                //var twitterFrame = $("#twitter-widget-0"); // Ryder remarked out 02/08/16
                // Ryder added the following on 02/08/16:
                var twitterFrame = $(".l-twitter-feed.responsive > iframe#twitter-widget-0"); // Making this more specific (NOTE: This is only being used on the Home Page and the Secretary's Landing Page for now.)
                // end
                if(twitterFrame.length) {
                  twitterFrame.contents().find(".timeline").attr("style", "max-width: 100% !important; min-width: 160px !important; height: 390px !important;");
                  twitterFrame.attr("style", "max-width: 100% !important; min-width: 160px !important; width: 100% !important; height: 390px !important;");
                  clearInterval(twitterCheck);
                }
              }, 1000);
            });
      
            // Removing the .fixed class from .l-topbar when scrolling...
            // Hopefully this fixes the issue with the main nav being pulled out of the document flow and sticking to the top of the browser window.
            $(window).scroll(function(){
              $(".l-topbar").removeClass("fixed");
            });
      
            // START NEW TOGGLE TOPBAR EDITS:
            // Toggle Topbar
            $('.customTopbarToggle').click(function(e) {
              $('#customToggle').click();
            })
            // Reinit Topbar on window resize:
            $(window).on('resize', function(e){
              //$(document).foundation('topbar', 'init');
              //$(document).foundation('topbar', 'start');
              $(document).foundation('topbar', 'reflow');
            });
            // END NEW TOGGLE TOPBAR EDITS
      
            //$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?id=35591378@N03&format=json&jsoncallback=?", function(data) {
            //$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?id=9364837@N06&format=json&jsoncallback=?", function(data) {
            //$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?id=9364837@N06&format=json&jsoncallback=?", function(data) {
      
            apiKey = '3dfba32e8efc27c459c77fee567cf5ef';
            //setID = '72157669741744552';
            //https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=9ffb484ba2dfead45ffcf3b07359e06d&user_id=9364837%40N06&extras=url_q&format=rest&api_sig=b636b79dd3dddd495dcc23211c20e433
      
            $.getJSON('https://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&user_id=9364837@N06&api_key=' + apiKey + '&extras=url_q&format=json&jsoncallback=?', function(data) {
              
              var target = ".flickr-album"; // Where is it going?
              for (i = 0; i <= 5; i = i + 1) { // Loop through the 6 most recent, [0-5]
                var pic = data.photos.photo[i];
                var liNumber = i + 1; // Add class to each LI
                $(target).append("<span class='flickr-wrap flickr-no-title'><span class='flickr-image'><a class='flickr-img-wrap' href='https://www.flickr.com/photos/statephotos/" + pic.id + "' target='_blank'><img src='" + pic.url_q + "' alt='" + pic.title + "' class='flickr-photo-img' /></a></span></span>");
                //console.log(pic.media);
                //console.log(pic);
              }
      
              /*var target = ".flickr-album"; // Where is it going?
              $.each(data.photos.photo, function(i,item){
                //console.log(item.url_q);
                $(target).append("<span class='flickr-wrap flickr-no-title'><span class='flickr-image'><a class='flickr-img-wrap' title='" + item.title + "' href='" + item.url_q + "'><img src='" + item.url_q + "' alt='" + item.title + "' class='flickr-photo-img' /></a></span></span>");
              });
              */
      
              //console.log(data);
            });
      
            // Close Media Box
            $('#close-media-box').click(function(){
              //$(this).parent().hide();
              $(this).parent().fadeOut("slow");
              return false;
            });
      
            // Remove <p>, <div>, and <h2> tags containing &nbsp;
            $("p, div, h2").filter(function(){
              return $.trim(this.innerHTML) === "&nbsp;"
            }).remove();
      
            // jQuery DoubleScroll Plugin
            // A Simple jQuery plugin to display additional scrollbar on top of the element.
            // https://github.com/avianey/jqDoubleScroll
            if(typeof jQuery.fn.doubleScroll != "undefined"){
              $('.table-responsive.double-scroll > div').doubleScroll({
                //contentElement: undefined, // Widest element, if not specified first child element will be used.
                scrollCss: {
                  'overflow-x': 'auto',
                  //'overflow-x': 'scroll',
                  'overflow-y': 'hidden'//,
                  //'-webkit-overflow-scrolling:': 'touch'
                },
                contentCss: {
                  'overflow-x': 'auto',
                  //'overflow-x': 'scroll',
                  'overflow-y': 'hidden'//,
                  //'-webkit-overflow-scrolling:': 'touch'
                },
                onlyIfScroll: true, // Top scrollbar is not shown if the bottom one is not present.
                resetOnWindowResize: true // Recompute the top scrollbar requirements when the window is resized.
              });
      
              // ADDED THE FOLLOWING ON 10.14.16 (NOTE: Per Don) - RDJ:
              function require(script) {
                  $.ajax({
                      url: script,
                      dataType: "script",
                      async: false, // This is the key
                      success: function () {
                        // all good...
                      },
                      error: function () {
                        throw new Error("Could not load script " + script);
                      }
                  });
              }
              var agent = navigator.userAgent.toLowerCase();
              var regex = /(iphone|ipod|ipad).* os 8/i;
              // do not include fastclick.js for IOS 8 devices
              if (typeof agent == "undefined" || agent.search(regex) == -1) {
                require("/state-responsive/js/vendor/fastclick.js");
              }
              // END ADDED THE FOLLOWING ON 10.14.16 (NOTE: Per Don) - RDJ
      
            }
          });
      
          //}
        //};
      
      //})(jQuery, Drupal);
      