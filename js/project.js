$(function () {
    project = {
        width: 16,
        height: 9,
        name: "",
        save: function () {
            backup.saveProj(project.name, function () {});
        },
        getBack: function (name, callback) {
            var proj = this;
            backup.loadProj(project.name, function (err, data) {
                if (!err) {
                    proj.width = data.width;
                    proj.height = data.height;
                    proj.name = data.name;
                }else{
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
});