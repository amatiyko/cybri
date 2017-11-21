// CUSTOM CYBERI SCRIPTS

(function ($) {

    "use strict";


    // *** init animation offset top = 0
    var onScrollInit = function (items, trigger) {
        items.each(function () {
            var osElement = $(this),
                osAnimationClass = osElement.attr('data-animation'),
                osAnimationDelay = osElement.attr('data-animation-delay');

            var osTrigger = ( trigger ) ? trigger : osElement;

            osElement.css({
                '-webkit-animation-delay': osAnimationDelay,
                '-moz-animation-delay': osAnimationDelay,
                'animation-delay': osAnimationDelay
            });

            new Waypoint({
                element: osTrigger.get(0),
                handler: function (direction) {
                    if (direction === 'down') {
                        osElement.addClass('animated').addClass(osAnimationClass);
                    }
                    else {
                        osElement.removeClass('animated').removeClass(osAnimationClass);
                    }
                },
                triggerOnce: true,
                offset: '110%'
            });

        });
    };

    //RANDOM ICON SHOW
    var $item = $(".hex-wrapper");

    var randomItem = function () {
        var random = Math.floor(Math.random() * 1000);
        $item.eq(random % $item.length).addClass("on");
    }

    setInterval(function () {
        $(".hex-wrapper").removeClass("on");
        randomItem();
    }, 8000);


    //EMULATION CHAT

    var Message;
    Message = function (arg) {
        this.time = arg.time, this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message-template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $message.find('.time').append(_this.time);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };

    $(function () {
        var getMessageText, message_side, sendMessage, clearMessage;
        message_side = 'right';

        var delay = (function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();

        getMessageText = function () {
            var $message_input;
            $message_input = $('.message-input');
            return $message_input.val();
        };


        sendMessage = function (text, position) {
            var $messages, message;
            var currentdate = new Date();
            var time = (currentdate.getHours() < 10 ? '0' : '') + currentdate.getHours() + ":" + (currentdate.getMinutes() < 10 ? '0' : '') + currentdate.getMinutes();


            if (text.trim() === '') {
                return;
            }
            $('.message-input').val('');
            $messages = $('.messages');


            if (position) {
                message_side = position
            } else {
                message_side = message_side === 'left' ? 'right' : 'left';
            }

            message = new Message({
                text: text,
                message_side: message_side,
                time: time
            });
            message.draw();
            return $messages.animate({scrollTop: $messages.prop('scrollHeight')}, 300);
        };
        $('.send-message').click(function (e) {
            return sendMessage(getMessageText(), 'right');
        });

        $('.message-input').keydown(function (e) {
            $('.typing-indicator').addClass('active');
        });

        $('.message-input').keyup(function (e) {
            delay(function () {
                $('.typing-indicator').removeClass('active');
            }, 1000);
            if (e.which === 13) {
                return sendMessage(getMessageText(), 'right');
            }
        });

        clearMessage = function () {
            var $messages = $('.messages');
            $messages.html('');
        };

        new Waypoint({
            element: $('#chat'),
            handler: function (direction) {
                if (direction === 'down') {
                    sendMessage('Hi David, my name is Kany S.', 'left');
                    setTimeout(function () {
                        return sendMessage('I’m your Cyber Specialist. ', 'left');
                    }, 1000);
                    return setTimeout(function () {
                        return sendMessage('Ok! Perfect');
                    }, 2000);
                } else {
                    clearMessage();
                }
            },
            triggerOnce: true,
            offset: '110%'
        });


    });


    // TAB ANIMATE
    var tabCycle;
    var tabChange = function () {
        var tabs = $('.setup-panel.slide > li');
        var active = tabs.filter('.active');
        var next = active.next('li').length ? active.next('li').find('a') : tabs.filter(':first-child').find('a');
        // Use the Bootsrap tab show method
        next.tab('show');


    }

    function settabchnge() {
        var tabs = $('.setup-panel.slide > li');
        tabCycle = setInterval(tabChange, 5000);
        tabs.on('click', stopFunction)
    }

    function stopFunction() {
        clearInterval(tabCycle);
    }

    settabchnge();


    // MAIN MENU TOGGLE AND SMOOTH SCROLL
    $('.navbar-collapse ul li a').on('click', function () {
        $('.navbar-toggle:visible').click();
    });
    $('.navbar li a').on('click', function () {
        $('.navbar-toggle:visible').click();
    });

    $(function () {
        $('a.page-scroll').on('click', function (event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top - 61
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });
    });

    $('body').scrollspy({
        offset: 64,
        target: '.navbar-fixed-top'
    });

    // ANIMATED MENU
    var cbpAnimatedHeader = (function () {

        var docElem = document.documentElement,
            header = $('.navbar-default'),
            didScroll = false,
            changeHeaderOn = 100;

        function init() {
            window.addEventListener('scroll', function (event) {
                if (!didScroll) {
                    didScroll = true;
                    setTimeout(scrollPage, 100);
                }
            }, false);
            window.addEventListener('load', function (event) {
                if (!didScroll) {
                    didScroll = true;
                    setTimeout(scrollPage, 100);
                }
            }, false);
        }

        function scrollPage() {
            var sy = scrollY();
            if (sy >= changeHeaderOn) {
                header.addClass('navbar-shrink')
            } else {
                header.removeClass('navbar-shrink')
            }
            didScroll = false;
        }

        function scrollY() {
            return window.pageYOffset || docElem.scrollTop;
        }

        init();

    })();

    //animation on scroll
    onScrollInit($('.animate-on'));


})(jQuery);
