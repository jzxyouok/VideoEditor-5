$(function () {

    var progress = document.querySelector('#progress');
    var progressPercent = document.querySelector('#progressPercent');

    uploadHandler = {
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
                result.innerHTML = this.responseText;
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
            $('#downloadWindow').removeClass('hidden');
            if (!filelist || !filelist.length || uploadHandler.list.length){
                $('#downloadWindow').addClass('hidden');
                return;
            }

            uploadHandler.totalSize = 0;
            uploadHandler.totalProgress = 0;
            result.textContent = '';

            for (var i = 0; i < filelist.length; i++) {
                uploadHandler.list.push(filelist[i]);
                uploadHandler.totalSize += filelist[i].size;
            }
            uploadHandler.uploadNext();
        },
        drawProgress: function (progressLoaded) {

            progress.value = Math.ceil(progressLoaded*100);
            progress.max = 100;
            progressPercent.innerText = progress.value + "%";

        },
        uploadNext: function () {
            if (uploadHandler.list.length) {
                var nextFile = uploadHandler.list.shift();
                uploadHandler.uploadFile(nextFile);
            } else {
                $('#downloadWindow').addClass('hidden');
            }
        }
    };


});
