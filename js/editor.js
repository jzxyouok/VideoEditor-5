/// <reference path="./jquery.d.ts"/>
var Default_Project_Name = "Projet_1";
var tlObj = {}, libObj = [], optionsFormSelector = $('#optionsForm'), cursorSelector = $('#cursor'), cursorPos = 0, playInterval, ajaxFunc, result = $('#result'), progress = $('#progress'), progressPercent = $('#progressPercent'), downloadWindow = $('#downloadWindow');
var uploadHandler = {
    list: [],
    totalSize: 0,
    totalProgress: 0,
    uploadFile: function (file) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'upload.php');
        xhr.upload.onprogress = function (event) {
            uploadHandler.handleProgress(event);
        };
        xhr.addEventListener('load', function () {
            result.html(this.responseText);
            uploadHandler.handleComplete(file.size);
        });
        var formData = new FormData();
        formData.append('myfile', file);
        xhr.send(formData);
    },
    handleProgress: function (event) {
        var progress = uploadHandler.totalProgress + event.loaded;
        uploadHandler.drawProgress(progress / uploadHandler.totalSize);
    },
    handleComplete: function (size) {
        uploadHandler.totalProgress += size;
        uploadHandler.drawProgress(uploadHandler.totalProgress / uploadHandler.totalSize);
        uploadHandler.uploadNext();
    },
    processFiles: function (filelist) {
        downloadWindow.removeClass('hidden');
        if (!filelist || !filelist.length || uploadHandler.list.length) {
            downloadWindow.addClass('hidden');
            return;
        }
        uploadHandler.totalSize = 0;
        uploadHandler.totalProgress = 0;
        result.html("");
        for (var i = 0; i < filelist.length; i++) {
            uploadHandler.list.push(filelist[i]);
            uploadHandler.totalSize += filelist[i].size;
        }
        uploadHandler.uploadNext();
    },
    drawProgress: function (progressLoaded) {
        progress.attr("value", Math.ceil(progressLoaded * 100));
        progress.attr("max", 100);
        progressPercent.text(progress.attr("value") + "%");
    },
    uploadNext: function () {
        if (uploadHandler.list.length) {
            var nextFile = uploadHandler.list.shift();
            uploadHandler.uploadFile(nextFile);
        }
        else {
            downloadWindow.addClass('hidden');
        }
    }
};
var sequence = {
    fillTlContent: function (tl) {
        var currentTLID = $(tl).attr("data-tlid");
        $(tl).find('.rushElement').each(function () {
            var currentRushId = $(this).attr("data-rushname");
            var currentRushSrc = $(this).attr("data-src");
            var uid = parseInt($(this).attr("data-uid"));
            var position = $(this).css("left");
            tlObj[currentTLID][uid] = {
                name: currentRushId,
                uid: uid,
                src: currentRushSrc,
                duration: parseInt($(this).attr("data-dur")),
                volume: parseInt($(this).attr("data-volume")),
                start: parseInt(position),
                end: Math.round(parseFloat($(this).attr("data-dur")) + parseFloat(position))
            };
        });
    },
    fillTls: function () {
        var sequence = this;
        $('.timeline').each(function () {
            var currentTLID = $(this).attr("data-tlid");
            if (!tlObj.hasOwnProperty(currentTLID)) {
                tlObj[currentTLID] = {};
                sequence.fillTlContent(this);
            }
        });
    },
    save: function () {
        tlObj = {};
        var sequence = this;
        sequence.fillTls();
        setTimeout(function () { backup.saveTl(project.name, function () { }); }, 3000);
        scope.actualize();
    },
    getElementAt: function (timeSeek) {
        var rushAtTime = {};
        $.each(tlObj, function (key) {
            var curTl = key;
            $.each(tlObj[curTl], function (key2) {
                var curRush = key2;
                if (tlObj[curTl][curRush].start <= timeSeek && tlObj[curTl][curRush].end > timeSeek) {
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
    getTotal: function () {
        var mostLateRushEnd = -1;
        $.each(tlObj, function (key) {
            var curTl = key;
            $.each(tlObj[curTl], function (key2) {
                var curRush = key2;
                if (tlObj[curTl][curRush].end > mostLateRushEnd) {
                    mostLateRushEnd = tlObj[curTl][curRush].end;
                }
            });
        });
        return {
            images: mostLateRushEnd,
            seconds: Math.round((mostLateRushEnd / 24) * 100) / 100
        };
    }
};
var scope = {
    actualize: function (play) {
        if (typeof play == "undefined" || play == null) {
            play = "stop";
        }
        var scopeCurTime = $('#scopeCurTime'), scopeTotalTime = $('#scopeTotalTime'), currentTime = cursor.getPosition(), rushToShow = sequence.getElementAt(currentTime.images), scopePlayer = $('#scopePlayer'), totalTime = sequence.getTotal(), totalHours = Math.floor(totalTime.seconds / 3600), totalMinutes = Math.floor((totalTime.seconds % 3600) / 60), totalSeconds = Math.floor(totalTime.seconds % 60), totalImages = Math.floor(totalTime.images % 24), currentHours = Math.floor(currentTime.seconds / 3600), currentMinutes = Math.floor((currentTime.seconds % 3600) / 60), currentSeconds = Math.floor(currentTime.seconds % 60), currentImages = Math.floor(currentTime.images % 24);
        $.each(rushToShow, function (key) {
            var type = rushToShow[key].src.split('.').pop();
            if (scopePlayer.find('.' + key).length >= 1) {
                if (type == "mp4") {
                    var vid = scopePlayer.find('.' + key)[0].querySelector("video");
                    vid.volume = Math.round(tlObj[rushToShow[key].zindex][key].volume / 10) / 10;
                    if (play == "play") {
                        vid.play();
                    }
                    else if (play == "stop") {
                        vid.pause();
                        vid.currentTime = 0;
                    }
                    else if (play == "pause") {
                        vid.pause();
                    }
                }
                else if (type == "mp3") {
                    var aud = scopePlayer.find('.' + key)[0].querySelector("audio");
                    aud.volume = Math.round(tlObj[rushToShow[key].zindex][key].volume / 10) / 10;
                    if (play == "play") {
                        aud.play();
                    }
                    else if (play == "stop") {
                        aud.pause();
                        aud.currentTime = 0;
                    }
                    else if (play == "pause") {
                        aud.pause();
                    }
                }
            }
            else {
                var zindex = 1000 - rushToShow[key].zindex;
                if (type == "mp4") {
                    scopePlayer.append('<div data-id="' + key + '" data-tl="' + rushToShow[key].zindex + '" style="z-index: ' + zindex + ';" class="layer ' + key + '"><video class="imgInScope" >' +
                        '<source src="' + rushToShow[key].src + '" type="video/mp4">' +
                        '</video></div>');
                }
                else if (type == "mp3") {
                    scopePlayer.append('<div data-id="' + key + '" data-tl="' + rushToShow[key].zindex + '" style="z-index: ' + zindex + ';" class="layer ' + key + '"><audio class="imgInScope" >' +
                        '<source src="' + rushToShow[key].src + '" type="audio/mp3">' +
                        '</audio></div>');
                }
                else {
                    scopePlayer.append('<div data-id="' + key + '" data-tl="' + rushToShow[key].zindex + '" style="z-index: ' + zindex + ';" class="layer ' + key + '"><img class="imgInScope" src="' + rushToShow[key].src + '"></div>');
                }
            }
        });
        scopePlayer.find('.layer').each(function () {
            var id = parseInt($(this).attr("data-id"));
            var tl = parseInt($(this).attr("data-tl"));
            if (typeof tlObj[tl][id] == "undefined" || tlObj[tl][id]['end'] < currentTime.images || tlObj[tl][id]['start'] > currentTime.images) {
                $(this).remove();
            }
        });
        scopeCurTime.text(" - " + currentHours + ":" + currentMinutes + ":" + currentSeconds + "::" + currentImages);
        scopeTotalTime.text(" / " + totalHours + ":" + totalMinutes + ":" + totalSeconds + "::" + totalImages);
    },
    initialize: function (w, h) {
        this.setRatio(w, h);
    },
    setRatio: function (w, h) {
        var scopePlayer = $('#scopePlayer');
        var scopeDiv = $('#scope');
        var maxWidth = scopeDiv.width() - 15;
        var maxHeight = scopeDiv.height() - 30;
        var scopeHeight = Math.round(maxHeight);
        var scopeWidth = Math.round(scopeHeight * w / h);
        if (scopeWidth >= maxWidth) {
            scopeWidth = Math.round(maxWidth - 1);
            scopeHeight = Math.round(scopeWidth * h / w);
        }
        else if (scopeHeight >= maxHeight) {
            scopeHeight = Math.round(maxHeight - 1);
            scopeWidth = Math.round(scopeHeight * w / h);
        }
        scopePlayer.css({
            width: scopeWidth,
            height: scopeHeight
        });
    }
};
var backup = {
    saveTl: function (name, callback) {
        ajaxFunc.sendObj(tlObj, name, "tl", function (err, data) {
            callback(err, data);
        });
    },
    saveLib: function (name, callback) {
        ajaxFunc.sendObj(libObj, name, "lib", function (err, data) {
            callback(err, data);
        });
    },
    saveProj: function (name, callback) {
        ajaxFunc.sendObj(project.getObj(), name, "proj", function (err, data) {
            callback(err, data);
        });
    },
    saveAll: function (name, callback) {
        backup.saveLib(name, function (err) {
            if (!err) {
                backup.saveTl(name, function (err, data) {
                    if (!err) {
                        callback(data);
                    }
                });
            }
        });
    },
    loadTl: function (name, callback) {
        ajaxFunc.getObj(name, "tl", function (err, data) {
            callback(err, data);
        });
    },
    loadLib: function (name, callback) {
        ajaxFunc.getObj(name, "lib", function (err, data) {
            callback(err, data);
        });
    },
    loadProj: function (name, callback) {
        ajaxFunc.getObj(name, "proj", function (err, data) {
            callback(err, data);
        });
    },
    loadAll: function (name, callback) {
        backup.loadLib(name, function (err, dataLib) {
            if (!err) {
                backup.loadTl(name, function (err, dataTl) {
                    if (!err) {
                        callback(dataLib, dataTl);
                    }
                });
            }
        });
    },
    getList: function () {
    }
};
ajaxFunc = {
    sendObj: function (obj, name, ext, callback) {
        $.post("save.php", {
            name: name,
            ext: ext,
            json: JSON.stringify(obj)
        }, function (data) {
            var ret = null;
            if (data == "NOK") {
                ret = data;
                console.error("Failed to write " + name + "." + ext + " !");
            }
            else {
                console.log(name + "." + ext + " is saved.");
            }
            callback(ret, data);
        });
    },
    getObj: function (name, ext, callback) {
        $.post("getBack.php", {
            name: name,
            ext: ext
        }, function (data) {
            if (data == "NOK") {
                console.warn("Failed to get " + name + "." + ext + " !");
                callback(name + "." + ext + " doesn't exists !", "");
            }
            else {
                console.log(name + "." + ext + " is loaded.");
                callback(null, JSON.parse(data));
            }
        });
    }
};
var project = {
    width: 16,
    height: 9,
    name: "",
    save: function () {
        backup.saveProj(project.name, function () { });
    },
    getBack: function (name, callback) {
        var proj = this;
        backup.loadProj(project.name, function (err, data) {
            if (!err) {
                proj.width = data.width;
                proj.height = data.height;
                proj.name = data.name;
            }
            else {
                console.log(err);
            }
            callback(err);
        });
    },
    getObj: function () {
        return {
            width: this.width,
            height: this.height,
            name: this.name
        };
    }
};
var cursor = {
    getPosition: function () {
        return {
            images: cursorPos,
            seconds: Math.round((cursorPos / 24) * 100) / 100
        };
    },
    setPosition: function (e) {
        cursorPos = e;
        cursorSelector.css({ "left": cursorPos });
        scope.actualize("pause");
        var rushToShow = sequence.getElementAt(e);
        var scopePlayer = $('#scopePlayer');
        $.each(rushToShow, function (key) {
            var type = rushToShow[key].src.split('.').pop();
            if (scopePlayer.find('.' + key).length >= 1) {
                if (type == "mp4" || type == "mp3") {
                    var vid = scopePlayer.find('.' + key).find('.imgInScope')[0];
                    vid.currentTime = (e / 24) + rushToShow[key].start;
                }
            }
        });
    },
    play: function () {
        cursor.playing = true;
        $('#playbtn').text("||");
        playInterval = setInterval(function () {
            cursor.playing = true;
            var max = sequence.getTotal();
            if (max.images >= cursorPos) {
                cursorSelector.css({ "left": cursorPos });
                cursorPos++;
                scope.actualize("play");
            }
            else {
                cursor.stopnback();
            }
        }, 1000 / 24);
    },
    pause: function () {
        clearInterval(playInterval);
        cursor.playing = false;
        $('#playbtn').html("&#x25B7;");
        scope.actualize("pause");
    },
    stopnback: function () {
        cursor.pause();
        cursorPos = 0;
        cursorSelector.css({ "left": cursorPos });
        scope.actualize("stop");
    },
    playing: false
};
var options = {
    showProperties: function (uid) {
        var currentRush = $('#' + uid);
        var currentType = currentRush.attr("data-extension");
        $('.selectedRush').removeClass('selectedRush');
        currentRush.addClass('selectedRush');
        var selectedRush = currentRush.attr("data-rushname");
        var rushDur = Math.round((parseInt(currentRush.attr("data-dur")) / 24) * 100) / 100;
        var blackBefore = Math.round((parseInt(currentRush.attr("data-blackBefore")) / 24) * 100) / 100;
        var volumeOption = '';
        if (currentType == "mp3" || currentType == "mp4") {
            var currentVol = parseInt(currentRush.attr("data-volume"));
            volumeOption = '<br>Volume : ' +
                '<input id="volumeInput" min="0" max="100" type="number" value="' + currentVol + '" name="duration"> %';
        }
        optionsFormSelector.html('<form id="properties"><div class="rushname" contenteditable="true">' + selectedRush + '</div><br>' +
            'Duration : ' +
            '<input id="durationInput" type="number" value="' + rushDur + '" name="duration"> secondes' +
            volumeOption +
            '<br><input type="submit" value="Submit" id="optionValidateForm"></form>' +
            '<br><input type="button" value="Delete selected item" id="optionDelete">');
        $('#properties').on("submit", function (e) {
            options.validateProperties(uid);
            e.preventDefault();
        });
        $('#optionDelete').on("click", function () {
            options.deleteItem(uid);
        });
    },
    validateProperties: function (uid) {
        var currentRush = $('#' + uid), currentType = currentRush.attr("data-extension"), duration = $('#durationInput').val() * 24, name = $('#optionsForm').find('.rushname').text();
        currentRush.css({ width: duration });
        currentRush.attr("data-dur", duration);
        currentRush.attr("data-rushname", name);
        currentRush.text(name);
        if (currentType == "mp3" || currentType == "mp4") {
            var volume = parseInt($('#volumeInput').val());
            if (volume > 100) {
                volume = 100;
            }
            else if (volume < 0) {
                volume = 0;
            }
            currentRush.attr("data-volume", volume);
        }
        sequence.save();
    },
    deleteItem: function (uid) {
        var currentRush = $('#' + uid);
        currentRush.remove();
        optionsFormSelector.html("");
        sequence.save();
    },
    showProjectProperties: function () {
        optionsFormSelector.html('<form id="properties"><div class="projectname" contenteditable="true">' + project.name + '</div><br>' +
            'Width : ' +
            '<input id="widthInput" type="number" value="' + project.width + '" name="widthInput">' +
            '<br>Height : ' +
            '<input id="heightInput" type="number" value="' + project.height + '" name="heightInput">' +
            '<br><input type="submit" value="Submit" id="optionValidateForm"></form>');
        $('#properties').on("submit", function (e) {
            options.validateProjectProperties();
            e.preventDefault();
        });
    },
    validateProjectProperties: function () {
        project.width = $('#widthInput').val();
        project.height = $('#heightInput').val();
        project.name = $('#optionsForm').find('.projectname').text();
        scope.initialize(project.width, project.height);
        project.save();
    }
};
var dnd = {
    draggedElement: null,
    onDragMousePos: { left: 0, top: 0 },
    applyDragEvents: function (element) {
        element.draggable = true;
        var dnd = this;
        element.addEventListener('dragstart', function (e) {
            dnd.draggedElement = e.target;
            e.dataTransfer.setData('text/plain', '');
            dnd.onDragMousePos.left = e.clientX;
            dnd.onDragMousePos.top = e.clientY;
        }, false);
        element.addEventListener('drop', function () {
            //e.stopPropagation();
        }, false);
    },
    applyDropEvents: function (dropper) {
        dropper.addEventListener('dragover', function (e) {
            e.preventDefault();
            $(this).addClass('drop_hover');
            if ($(e.target).hasClass('rushElement')) {
                $(e.target).addClass('insertBefore');
            }
        }, false);
        dropper.addEventListener('dragleave', function (e) {
            $(this).removeClass('drop_hover');
            if ($(e.target).hasClass('rushElement')) {
                $(e.target).removeClass('insertBefore');
            }
        });
        var dnd = this;
        dropper.addEventListener('drop', function (e) {
            e.preventDefault();
            var target = e.target;
            $(this).removeClass('drop_hover');
            $(target).removeClass('drop_hover');
            var files = e.dataTransfer.files, filesLen = files.length;
            if (filesLen) {
                uploadHandler.processFiles(files);
                library.fillLib(files, filesLen, target, function () { });
            }
            else {
                var tlPos = $(target.parentNode).offset().left; // position absolue de la TL
                var tarPos = $(dnd.draggedElement).offset().left; // position absolue de l'element au drag
                var moInTarPos = dnd.onDragMousePos.left - tarPos; // position de la souris dans l'element
                var mousePos = e.clientX; // position absolue de la souris au drop
                var moInTlPos = (mousePos - tlPos) + target.parentNode.scrollLeft; // position de la souris dans la TL au drop
                var tarInTLPosDrop = moInTlPos - moInTarPos; //position de l'element dans la TL au drop
                var posLeft = (tarInTLPosDrop >= 0 ? tarInTLPosDrop : 0);
                dnd.onDragMousePos = { left: 0, top: 0 };
                var draggedElement = dnd.draggedElement, clonedElement = draggedElement.cloneNode(true);
                var uid = (Math.round(Math.random() * 10000000) || clonedElement.uid);
                if ($(target).hasClass('rushElement') && target.parentNode.id != "rush" && target.parentNode.id != "rushDrop") {
                    clonedElement = target.parentNode.insertBefore(clonedElement, target);
                    $(clonedElement).css({ width: clonedElement.getAttribute("data-dur"), "left": posLeft });
                    $(clonedElement).attr("data-uid", uid);
                    $(clonedElement).attr("id", uid);
                    $(clonedElement).on("click", function () {
                        options.showProperties(uid);
                    });
                    $(clonedElement).trigger("click");
                    dnd.applyDragEvents(clonedElement);
                }
                else if (target.parentNode.id != "rush" && target.parentNode.id != "rushDrop") {
                    library.fillTls(clonedElement, target, uid, 0, 0, 0, 0, 0, posLeft);
                }
                if (draggedElement.parentNode == clonedElement.parentNode || draggedElement.parentNode.parentNode.id == "timeline" || draggedElement.parentNode.parentNode.id == "timelinesCont") {
                    draggedElement.parentNode.removeChild(draggedElement);
                }
                $(target).removeClass('insertBefore');
                $(".insertBefore").removeClass('insertBefore');
                sequence.save();
            }
        });
    }
};
var library = {
    fillLib: function (files, filesLen, target, callback) {
        for (var i = 0; i < filesLen; i++) {
            var tmpuid = (Math.round(Math.random() * 10000000) || files[i].uid);
            if (target.parentNode.id == "rush" || target.parentNode.id == "rushDrop") {
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
                backup.saveLib(project.name, function () { });
                $('#rushDrop').append(newElement);
                var tmpUidSelector = $('#' + tmpuid);
                tmpUidSelector.attr("data-uid", tmpuid);
                dnd.applyDragEvents(tmpUidSelector[0]);
                if (type == "mp4") {
                    tmpUidSelector.on('mousedown', function () {
                        var balisemp4 = this;
                        $('#miniScopePlayer').html('<video class="thumb" controls preload="metadata">' +
                            '<source src="' + $(this).attr("data-src") + '" type="video/mp4">' +
                            '</video>');
                        document.querySelector(".thumb").addEventListener('loadedmetadata', function () {
                            var vid = document.querySelector(".thumb");
                            $(balisemp4).attr("data-dur", Math.floor((vid.duration) * 24));
                            libObj[libId].dur = Math.floor((vid.duration) * 24);
                            backup.saveLib(project.name, function () { });
                        });
                    });
                }
                else if (type == "mp3") {
                    tmpUidSelector.on('mousedown', function () {
                        var balisemp3 = this;
                        $('#miniScopePlayer').html('<audio class="thumb" controls preload="metadata">' +
                            '<source src="' + $(this).attr("data-src") + '" type="audio/mp3">' +
                            '</audio>');
                        document.querySelector(".thumb").addEventListener('loadedmetadata', function () {
                            var aud = document.querySelector(".thumb");
                            $(balisemp3).attr("data-dur", Math.floor((aud.duration) * 24));
                            libObj[libId].dur = Math.floor((aud.duration) * 24);
                            backup.saveLib(project.name, function () { });
                        });
                    });
                }
                else {
                    tmpUidSelector.on('mousedown', function () {
                        $('#miniScopePlayer').html('<img class="thumb" src="' + $(this).attr("data-src") + '">');
                    });
                }
            }
        }
        callback(null);
    },
    fillTls: function (clonedElement, target, uid, width, name, src, dur, volume, start) {
        start = (start >= 0 ? start : 0);
        clonedElement = target.appendChild(clonedElement);
        $(clonedElement).css({ "left": start, width: clonedElement.getAttribute("data-dur") });
        $(clonedElement).attr("data-uid", uid);
        $(clonedElement).attr("id", uid);
        if (width != 0) {
            $(clonedElement).attr("data-rushname", name);
            $(clonedElement).addClass("rushElement");
            $(clonedElement).attr("data-src", src);
            $(clonedElement).css({ "left": start, "width": width });
            $(clonedElement).attr("data-volume", volume);
            $(clonedElement).attr("data-dur", dur);
            $(clonedElement).text(name);
            sequence.save();
        }
        dnd.applyDragEvents(clonedElement);
        $(clonedElement).on("click", function () {
            options.showProperties(uid);
        });
        $(clonedElement).trigger("click");
    }
};
function initEditor() {
    $('#playbtn').on('click', function () {
        if (cursor.playing) {
            cursor.pause();
        }
        else {
            cursor.play();
        }
    });
    $(window).on('keydown', function (event) {
        if (event.which == 32 || event.keyCode == 32) {
            $('#playbtn').trigger("click");
            event.preventDefault();
            event.stopPropagation();
        }
    });
    $('#stopbtn').on('click', function () {
        cursor.stopnback();
    });
    $('#prevbtn').on('click', function () {
        var cursorCurrentPos = cursor.getPosition();
        if (cursorCurrentPos > 0) {
            cursor.setPosition(cursorCurrentPos - 1);
        }
    });
    $('#nextbtn').on('click', function () {
        var cursorCurrentPos = cursor.getPosition();
        cursor.setPosition(cursorCurrentPos + 1);
    });
    $('#optionsbtn').on('click', function () {
        options.showProjectProperties();
    });
    $("#timeGrad").on('click', function (e) {
        var elementOffset = $(this).offset();
        cursor.setPosition(e.pageX - elementOffset.left);
    });
    if (typeof project.width == "undefined" || project.width == null) {
        project.width = 16;
    }
    if (typeof project.height == "undefined" || project.height == null) {
        project.height = 9;
    }
    scope.initialize(project.width, project.height);
    $(window).resize(function () {
        scope.initialize(project.width, project.height);
    });
    var elements = document.querySelectorAll('.rushElement'), elementsLen = elements.length;
    for (var i = 0; i < elementsLen; i++) {
        dnd.applyDragEvents(elements[i]);
    }
    var droppers = document.querySelectorAll('.dropper'), droppersLen = droppers.length;
    for (var j = 0; j < droppersLen; j++) {
        dnd.applyDropEvents(droppers[j]);
    }
    backup.loadLib(project.name, function (err, data) {
        if (!err) {
            var lastFiles = data;
            var lastFilesLen = lastFiles.length;
            var lastTarget = document.querySelector("#rushDrop");
            library.fillLib(lastFiles, lastFilesLen, lastTarget, function (err) {
                if (!err) {
                    backup.loadTl(project.name, function (err, data) {
                        if (!err) {
                            var lastFiles = data;
                            $.each(lastFiles, function (i) {
                                var lastTarget = document.querySelector("#timelineDrop" + i);
                                $.each(lastFiles[i], function (key) {
                                    var clonedElement = document.createElement("div");
                                    library.fillTls(clonedElement, lastTarget, lastFiles[i][key].uid, lastFiles[i][key].duration, lastFiles[i][key].name, lastFiles[i][key].src, lastFiles[i][key].duration, lastFiles[i][key].volume, lastFiles[i][key].start);
                                });
                            });
                        }
                        else {
                            console.log(err);
                        }
                    });
                }
                else {
                    console.log(err);
                }
            });
        }
        else {
            console.log(err);
        }
    });
    project.save();
}
project.name = Default_Project_Name;
project.getBack(project.name, function () {
    initEditor();
});
//# sourceMappingURL=editor.js.map