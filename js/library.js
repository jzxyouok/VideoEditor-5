$(document).ready(function () {

    library = {
        fillLib: function (files, filesLen, target, callback) {
            for (var i = 0; i < filesLen; i++) {
                var tmpuid = (Math.round(Math.random()*10000000) || files[i].uid);
                if(target.parentNode.id == "rush" || target.parentNode.id == "rushDrop"){

                    var type = files[i].name.split('.').pop();
                    var newElement = '<div id="' + tmpuid + '" ' +
                        'class="rushElement" ' +
                        'data-extension="' + type + '" ' +
                        'data-volume="100" ' +
                        'data-dur="96" ' +
                        'data-rushname="' + files[i].name + '" ' +
                        'data-src="upload/' + files[i].name + '">' +
                        files[i].name + '</div>';

                    var libId = (libObj.length || 0);

                    libObj[libId] = {
                        extension: type,
                        uid: tmpuid,
                        volume: 100,
                        dur: 96,
                        rushname: files[i].name,
                        src: "upload/" + files[i].name,
                        name: files[i].name
                    };

                    backup.saveLib(project.name, function () {});

                    $('#rushDrop').append(newElement);
                    $('#' + tmpuid).attr("data-uid", tmpuid);
                    dnd.applyDragEvents($('#' + tmpuid)[0]);

                    if (type == "mp4") {
                        $('#' + tmpuid).on('mousedown', function () {
                            var balisemp4 = this;
                            $('#miniScopePlayer').html('<video class="thumb" controls preload="metadata">' +
                                '<source src="' + $(this).attr("data-src") + '" type="video/mp4">' +
                                '</video>');
                            document.querySelector(".thumb").addEventListener('loadedmetadata', function () {
                                $(balisemp4).attr("data-dur", Math.floor((document.querySelector(".thumb").duration) * 24));
                                libObj[libId].dur = Math.floor((document.querySelector(".thumb").duration) * 24);
                                backup.saveLib(project.name, function () {});
                            });
                        });
                    } else if (type == "mp3") {
                        $('#' + tmpuid).on('mousedown', function () {
                            var balisemp3 = this;
                            $('#miniScopePlayer').html('<audio class="thumb" controls preload="metadata">' +
                                '<source src="' + $(this).attr("data-src") + '" type="audio/mp3">' +
                                '</audio>');
                            document.querySelector(".thumb").addEventListener('loadedmetadata', function () {
                                $(balisemp3).attr("data-dur", Math.floor((document.querySelector(".thumb").duration) * 24));
                                libObj[libId].dur = Math.floor((document.querySelector(".thumb").duration) * 24);
                                backup.saveLib(project.name, function () {});
                            });
                        });
                    } else {
                        $('#' + tmpuid).on('mousedown', function () {
                            $('#miniScopePlayer').html('<img class="thumb" src="' + $(this).attr("data-src") + '">');
                        });
                    }

                }
            }
            callback(null);
        },
        fillTls: function (clonedElement, target, uid, width, name, src, dur, volume, start) {

            start = (start>=0?start:0);
                clonedElement = target.appendChild(clonedElement);
                $(clonedElement).css({"left": start, width: clonedElement.getAttribute("data-dur")});
                $(clonedElement).attr("data-uid", uid);
                $(clonedElement).attr("id", uid);
            if(width != 0){
                $(clonedElement).attr("data-rushname", name);
                $(clonedElement).addClass("rushElement");
                $(clonedElement).attr("data-src", src);
                $(clonedElement).css({"left": start, "width": width});
                $(clonedElement).attr("data-volume", volume);
                $(clonedElement).attr("data-dur", dur);
                $(clonedElement).text(name);
                sequence.save();
            }
            dnd.applyDragEvents(clonedElement);
                $(clonedElement).on("click", function(){
                    options.showProperties(uid);
                });
                $(clonedElement).trigger("click");
        }
    };

});
