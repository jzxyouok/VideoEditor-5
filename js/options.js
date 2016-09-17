$(document).ready(function () {
    var optionsFormSelector = $('#optionsForm');
    options = {
        showProperties : function (uid) {
            var currentRush = $('#'+uid);
            var currentType = currentRush.attr("data-extension");
            $('.selectedRush').removeClass('selectedRush');
            currentRush.addClass('selectedRush');
            var selectedRush = currentRush.attr("data-rushname");
            var rushDur = parseInt((currentRush.attr("data-dur")/24)*100)/100;
            var blackBefore = parseInt((currentRush.attr("data-blackBefore")/24)*100)/100;
            
            var volumeOption = '';
            
            if(currentType == "mp3" || currentType == "mp4"){
                var currentVol = parseInt(currentRush.attr("data-volume"));
                volumeOption = '<br>Volume : ' +
                    '<input id="volumeInput" min="0" max="100" type="number" value="'+currentVol+'" name="duration"> %';
            }
            optionsFormSelector.html('<form id="properties"><div class="rushname" contenteditable="true">'+selectedRush +'</div><br>'+
                'Duration : ' +
                '<input id="durationInput" type="number" value="'+rushDur+'" name="duration"> secondes' +
                volumeOption +
                '<br><input type="submit" value="Submit" id="optionValidateForm"></form>' +
                '<br><input type="button" value="Delete selected item" id="optionDelete">');
            $('#properties').on("submit", function (e) {
                options.validateProperties(uid);
                e.preventDefault()
            });
            $('#optionDelete').on("click", function () {
                options.deleteItem(uid);
            });
        },
        validateProperties : function (uid) {
            var currentRush = $('#'+uid),
                currentType = currentRush.attr("data-extension"),
                duration = $('#durationInput').val()*24,
                name = $('#optionsForm').find('.rushname').text();

            currentRush.css({width: duration, "margin-left": blackBefore});
            currentRush.attr("data-dur", duration);
            currentRush.attr("data-rushname", name);
            currentRush.text(name);

            if(currentType == "mp3" || currentType == "mp4"){
                var volume = parseInt($('#volumeInput').val());
                if(volume>100){
                    volume = 100;
                }else if(volume<0){
                    volume = 0;
                }
                currentRush.attr("data-volume", volume);
            }
            sequence.save();
        },
        deleteItem : function (uid) {
            var currentRush = $('#'+uid);
            currentRush.remove();
            optionsFormSelector.html("");
            sequence.save();
        },
        showProjectProperties: function () {
            optionsFormSelector.html('<form id="properties"><div class="projectname" contenteditable="true">'+project.name +'</div><br>'+
                'Width : ' +
                '<input id="widthInput" type="number" value="'+project.width+'" name="widthInput">' +
                '<br>Height : ' +
                '<input id="heightInput" type="number" value="'+project.height+'" name="heightInput">' +
                '<br><input type="submit" value="Submit" id="optionValidateForm"></form>');
            $('#properties').on("submit", function (e) {
                options.validateProjectProperties();
                e.preventDefault()
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
});