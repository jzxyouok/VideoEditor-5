$(document).ready(function () {
    scope = {
        actualize: function (play) {
            if (typeof play == "undefined" || play == null){
                play = "stop";
            }

            var scopeCurTime = $('#scopeCurTime'),
                scopeTotalTime = $('#scopeTotalTime'),
                currentTime = cursor.getPosition(),
                rushToShow = sequence.getElementAt(currentTime.images),
                scopePlayer = $('#scopePlayer'),
                totalTime = sequence.getTotal(),
                totalHours = parseInt(totalTime.seconds/3600),
                totalMinutes = parseInt((totalTime.seconds%3600)/60),
                totalSeconds = parseInt(totalTime.seconds%60),
                totalImages = parseInt(totalTime.images%24),
                currentHours = parseInt(currentTime.seconds/3600),
                currentMinutes = parseInt((currentTime.seconds%3600)/60),
                currentSeconds = parseInt(currentTime.seconds%60),
                currentImages = parseInt(currentTime.images%24);
            

            $.each(rushToShow, function (key) {
                var type = rushToShow[key].src.split('.').pop();
                if(scopePlayer.find('.'+key).length >= 1){
                    if(type == "mp4"){
                        var vid = scopePlayer.find('.'+key)[0].querySelector("video");
                        vid.volume = parseInt(tlObj[rushToShow[key].zindex][key].volume/10)/10;
                        if(play == "play"){
                            vid.play();
                        }else if(play == "stop"){
                            vid.pause();
                            vid.currentTime = 0;
                        }else if(play == "pause"){
                            vid.pause();
                        }
                    }else if(type == "mp3"){
                        var aud = scopePlayer.find('.'+key)[0].querySelector("audio");
                        aud.volume = parseInt(tlObj[rushToShow[key].zindex][key].volume/10)/10;
                        if(play == "play"){
                            aud.play();
                        }else if(play == "stop"){
                            aud.pause();
                            aud.currentTime = 0;
                        }else if(play == "pause"){
                            aud.pause();
                        }
                    }

                }else{
                    var zindex = 1000 - rushToShow[key].zindex;
                    if(type == "mp4"){
                        scopePlayer.append('<div data-id="'+key+'" data-tl="'+rushToShow[key].zindex+'" style="z-index: '+zindex+';" class="layer '+key+'"><video class="imgInScope" >' +
                            '<source src="'+rushToShow[key].src+'" type="video/mp4">'+
                            '</video></div>');
                    }else if(type == "mp3"){
                        scopePlayer.append('<div data-id="'+key+'" data-tl="'+rushToShow[key].zindex+'" style="z-index: '+zindex+';" class="layer '+key+'"><audio class="imgInScope" >' +
                            '<source src="'+rushToShow[key].src+'" type="audio/mp3">'+
                            '</audio></div>');
                    }else{
                        scopePlayer.append('<div data-id="'+key+'" data-tl="'+rushToShow[key].zindex+'" style="z-index: '+zindex+';" class="layer '+key+'"><img class="imgInScope" src="'+rushToShow[key].src+'"></div>');
                    }
                }

            });
            scopePlayer.find('.layer').each( function () {
                var id = parseInt($(this).attr("data-id"));
                var tl = parseInt($(this).attr("data-tl"));
                if(typeof tlObj[tl][id] == "undefined" || tlObj[tl][id]['end']<currentTime.images || tlObj[tl][id]['start']>currentTime.images ){
                    $(this).remove();
                }
            });



            scopeCurTime.text(" - "+currentHours+":"+currentMinutes+":"+currentSeconds+"::"+currentImages);
            scopeTotalTime.text(" / "+totalHours+":"+totalMinutes+":"+totalSeconds+"::"+totalImages);
            
        },
        initialize: function (w, h) {
            this.setRatio(w,h);
        },
        setRatio: function (w, h) {
            var scopePlayer = $('#scopePlayer');
            var scopeDiv = $('#scope');
            var maxWidth = (scopeDiv.width()-15);
            var maxHeight = (scopeDiv.height() - 30);
            var scopeHeight = Math.round(maxHeight);
            var scopeWidth = Math.round(scopeHeight*w/h);

            if (scopeWidth >= maxWidth){
                scopeWidth = Math.round(maxWidth-1);
                scopeHeight = Math.round(scopeWidth*h/w);
            }else if (scopeHeight >= maxHeight){
                scopeHeight = Math.round(maxHeight - 1);
                scopeWidth = Math.round(scopeHeight*w/h);
            }

            scopePlayer.css({
                width : scopeWidth,
                height: scopeHeight
            });
        }
    };


});