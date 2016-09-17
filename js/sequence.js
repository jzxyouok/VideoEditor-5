$(document).ready(function () {
    sequence = {
        fillTlContent: function (tl) {
            var currentTLID = $(tl).attr("data-tlid");
            $(tl).find('.rushElement').each(function () {
                var currentRushId = $(this).attr("data-rushname");
                var currentRushSrc = $(this).attr("data-src");
                var uid = $(this).attr("data-uid");
                var position = $(this).css("left");
                tlObj[currentTLID][uid]={
                    "name": currentRushId,
                    "uid": uid,
                    "src": currentRushSrc,
                    "duration": parseInt($(this).attr("data-dur")),
                    "volume": $(this).attr("data-volume"),
                    "start": parseInt(position),
                    "end": parseInt(parseFloat($(this).attr("data-dur")) + parseFloat(position))
                };
            });
        },
        fillTls : function () {
            var sequence = this;
            $('.timeline').each(function () {
                var currentTLID = $(this).attr("data-tlid");
                if(!tlObj.hasOwnProperty(currentTLID)){
                    tlObj[currentTLID]={};
                    sequence.fillTlContent(this);
                }
            });
        },
        save : function () {
            tlObj = {};
            var sequence = this;
            sequence.fillTls();
            backup.saveTl(project.name, function (data) {
                
            });
            scope.actualize();
        },
        getElementAt : function (timeSeek) {
            var rushAtTime = {};
            $.each(tlObj, function (key) {
                var curTl = key;
                $.each(tlObj[curTl], function (key2) {
                    var curRush = key2;
                    if(tlObj[curTl][curRush].start<=timeSeek && tlObj[curTl][curRush].end>timeSeek){
                        rushAtTime[curRush] = {
                            "src": tlObj[curTl][curRush]['src'],
                            "zindex": parseInt(curTl),
                            "start": tlObj[curTl][curRush]['start'],
                            "end": tlObj[curTl][curRush]['end'],
                            "duration": tlObj[curTl][curRush]['duration']

                        };
                    }

                });
            });
            return rushAtTime;
        },
        getTotal : function () {
            var mostLateRushEnd = -1;
            $.each(tlObj, function (key) {
                var curTl = key;
                $.each(tlObj[curTl], function (key2) {
                    var curRush = key2;
                    if(tlObj[curTl][curRush].end > mostLateRushEnd){
                        mostLateRushEnd = tlObj[curTl][curRush].end;
                    }


                });
            });

            return {
                images: mostLateRushEnd,
                seconds: parseFloat(Math.round((mostLateRushEnd/24)*100)/100)
            };
        }
    };
    
});