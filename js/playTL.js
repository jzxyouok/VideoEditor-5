$(document).ready(function () {
    var cursorSelector = $('#cursor'),
        cursorPos = 0,
        playInterval;

    cursor = {
        getPosition: function () {
            return {
                images: cursorPos,
                seconds: parseFloat(Math.round((cursorPos/24)*100)/100)
            };
        },
        setPosition: function (e) {
            cursorPos = e;
            cursorSelector.css({"left": cursorPos});
            scope.actualize("pause");
            var rushToShow = sequence.getElementAt(e);
            var scopePlayer = $('#scopePlayer');
            $.each(rushToShow, function (key) {
                var type = rushToShow[key].src.split('.').pop();
                if (scopePlayer.find('.' + key).length >= 1) {
                    if (type == "mp4" || type == "mp3") {
                        (scopePlayer.find('.' + key).find('.imgInScope'))[0].currentTime = (e/24)+rushToShow[key].start;
                    }
                }
            });
        },
        play : function () {
            cursor.playing = true;
            $('#playbtn').text("||");
            playInterval = setInterval(function () {
                cursor.playing = true;
                var max = sequence.getTotal();
                if (max.images >= cursorPos) {
                    cursorSelector.css({"left": cursorPos});
                    cursorPos++;
                    scope.actualize("play");
                } else {
                    cursor.stopnback();
                }

            }, 1000 / 24);
        },
        pause : function () {
            clearInterval(playInterval);
            cursor.playing = false;
            $('#playbtn').html("&#x25B7;");
            scope.actualize("pause");
        },
        stopnback : function () {
            cursor.pause();
            cursorPos = 0;
            cursorSelector.css({"left": cursorPos});
            scope.actualize("stop");
        },
        playing : false
    };

});