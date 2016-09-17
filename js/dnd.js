$(function () {

    dnd = {

        draggedElement: null,
        onDragMousePos : {left: 0, top: 0},
        applyDragEvents: function (element) {

            element.draggable = true;

            var dnd = this;

            element.addEventListener('dragstart', function (e) {
                dnd.draggedElement = e.target;
                e.dataTransfer.setData('text/plain', '');
                dnd.onDragMousePos.left = e.clientX;
                dnd.onDragMousePos.top = e.clientY;

            }, false);

            element.addEventListener('drop', function (e) {
                //e.stopPropagation();
            }, false);

        },

        applyDropEvents: function (dropper) {

            dropper.addEventListener('dragover', function (e) {
                e.preventDefault();
                $(this).addClass('drop_hover');
                if($(e.target).hasClass('rushElement')) {
                    $(e.target).addClass('insertBefore');
                }
            }, false);

            dropper.addEventListener('dragleave', function (e) {
                $(this).removeClass('drop_hover');
                if($(e.target).hasClass('rushElement')) {
                    $(e.target).removeClass('insertBefore');
                }
            });

            var dnd = this;

            dropper.addEventListener('drop', function (e) {
                e.preventDefault();
                var target = e.target;
                $(this).removeClass('drop_hover');


                $(target).removeClass('drop_hover');

                var files = e.dataTransfer.files,
                    filesLen = files.length;

                if (filesLen) {
                    uploadHandler.processFiles(files);
                    library.fillLib(files, filesLen, target, function () {});
                } else {
                    var tlPos = $(target.parentNode).offset();// position absolue de la TL
                    var tarPos = $(dnd.draggedElement).offset();// position absolue de l'element au drag
                    var tarInTlPosDrag = (tarPos.left - tlPos.left) + target.parentNode.scrollLeft;// position de l'element dans la TL au drag
                    var moInTarPos = dnd.onDragMousePos.left - tarPos.left;// position de la souris dans l'element

                    var mousePos = e.clientX;// position absolue de la souris au drop
                    var moInTlPos = (mousePos - tlPos.left) + target.parentNode.scrollLeft;// position de la souris dans la TL au drop
                    var tarInTLPosDrop = moInTlPos-moInTarPos; //position de l'element dans la TL au drop

                    var posLeft = (tarInTLPosDrop>=0?tarInTLPosDrop:0);

                    dnd.onDragMousePos = {left: 0, top: 0};
                    var draggedElement = dnd.draggedElement,
                        clonedElement = draggedElement.cloneNode(true);
                    var uid = (Math.round(Math.random()*10000000) || clonedElement.uid);
                    if($(target).hasClass('rushElement') && target.parentNode.id != "rush" && target.parentNode.id != "rushDrop"){
                        clonedElement = target.parentNode.insertBefore(clonedElement, target);

                        var targetLeft = $(target).css("left");
                        var targetDur = $(target).css("width");
                        console.log($(target.parentNode).attr("data-tlid"));

                        console.log(sequence.getElementAt(posLeft)[$(target.parentNode).attr("data-tlid")]);

                        $(clonedElement).css({width: clonedElement.getAttribute("data-dur"), "left": posLeft});
                        $(clonedElement).attr("data-uid", uid);
                        $(clonedElement).attr("id", uid);
                        $(clonedElement).on("click", function(){
                            options.showProperties(uid);
                        });
                        $(clonedElement).trigger("click");
                        dnd.applyDragEvents(clonedElement);
                    }else if(target.parentNode.id != "rush"  && target.parentNode.id != "rushDrop") {
                        library.fillTls(clonedElement, target, uid, 0, 0, 0, 0, 0, posLeft);
                    }

                    if (draggedElement.parentNode == clonedElement.parentNode || draggedElement.parentNode.parentNode.id == "timeline" || draggedElement.parentNode.parentNode.id == "timelinesCont") {
                        draggedElement.parentNode.removeChild(draggedElement);
                    }else{
                        console.log(draggedElement.parentNode.parentNode.id);
                    }
                    $(target).removeClass('insertBefore');
                    $(".insertBefore").removeClass('insertBefore');
                    sequence.save();
                }
            });
        }
    };

});