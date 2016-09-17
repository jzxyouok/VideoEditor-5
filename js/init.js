$(document).ready(function () {

    function initEditor() {

        $('#playbtn').on('click', function () {
            if (cursor.playing) {
                cursor.pause();
            } else {
                cursor.play();
            }
        });
        $( window ).on('keydown', function(event) {
            if ( event.which == 32 || event.keyCode == 32 ) {
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
            if(cursorCurrentPos>0){
                cursor.setPosition(cursorCurrentPos-1);
            }
        });
        $('#nextbtn').on('click', function () {
            var cursorCurrentPos = cursor.getPosition();
            cursor.setPosition(cursorCurrentPos+1);
        });

        $('#optionsbtn').on('click', function () {
            options.showProjectProperties();
         });
        $("#timeGrad").on('click', function(e){
            var elementOffset = $(this).offset();
            cursor.setPosition(e.pageX - elementOffset.left);
        });


        if (typeof project.width == "undefined" || project.width == null){
            project.width = 16
        }
        if (typeof project.height == "undefined" || project.height == null){
            project.height = 9
        }

        scope.initialize(project.width, project.height);

        $(window).resize( function () {
            scope.initialize(project.width, project.height);
        });

        var elements = document.querySelectorAll('.rushElement'),
            elementsLen = elements.length;

        for (var i = 0; i < elementsLen; i++) {
            dnd.applyDragEvents(elements[i]);
        }

        var droppers = document.querySelectorAll('.dropper'),
            droppersLen = droppers.length;

        for (var j = 0; j < droppersLen; j++) {
            dnd.applyDropEvents(droppers[j]);
        }

        backup.loadLib(project.name, function (err, data) {
            if(!err) {
                var lastFiles = data;
                var lastFilesLen = lastFiles.length;
                var lastTarget = document.querySelector("#rushDrop");

                library.fillLib(lastFiles, lastFilesLen, lastTarget, function (err) {
                    if(!err){
                        backup.loadTl(project.name, function (err, data) {
                            if (!err) {
                                var lastFiles = data;
                                $.each(lastFiles, function (i) {
                                    var lastTarget = document.querySelector("#timelineDrop"+i);
                                    $.each(lastFiles[i], function (key) {
                                        var clonedElement = document.createElement("div");
                                        library.fillTls(clonedElement, lastTarget, lastFiles[i][key].uid, lastFiles[i][key].duration, lastFiles[i][key].name, lastFiles[i][key].src, lastFiles[i][key].duration, lastFiles[i][key].volume, lastFiles[i][key].start);
                                    });
                                });
                            }else{
                                console.log(err);
                            }
                        });

                    }else{
                        console.log(err);
                    }
                });
            }else{
                console.log(err);
            }
        });

        project.save();
    }

    project.name = "Projet_1";
    project.getBack(project.name, function (err) {
        initEditor();
    });


});