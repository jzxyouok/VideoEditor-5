$(function () {
    var ajaxFunc;

    backup = {
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
        saveAll: function(name, callback) {
            backup.saveLib(name, function (err) {
                if(!err){
                    backup.saveTl(name, function (err, data) {
                        if(!err){
                            callback(data);
                        }
                    });
                }
            });
        },
        loadTl: function(name, callback) {
            ajaxFunc.getObj(name, "tl", function (err, data) {
                callback(err, data);
            });
        },
        loadLib: function(name, callback) {
            ajaxFunc.getObj(name, "lib", function (err, data) {
                callback(err, data);
            });
        },
        loadProj: function(name, callback) {
            ajaxFunc.getObj(name, "proj", function (err, data) {
                callback(err, data);
            });
        },
        loadAll: function(name, callback) {
            backup.loadLib(name, function (err, dataLib) {
                if(!err){
                    backup.loadTl(name, function (err, dataTl) {
                        if(!err){
                            callback(dataLib, dataTl);
                        }
                    });
                }
            });
        },
        getList: function() {

        }
    };

    ajaxFunc = {
        sendObj: function (obj, name, ext, callback) {
            $.post("save.php",
                {
                    name: name,
                    ext: ext,
                    json: JSON.stringify(obj)
                },
                function(data){
                    var ret = null;
                    if(data == "NOK"){
                        ret = data;
                        console.error("Failed to write " + name + "." + ext + " !");
                    }else{
                        console.log(name+"."+ext+" is saved.");
                    }
                    callback(ret, data);
                });
        },
        getObj: function (name, ext, callback) {
            $.post("getBack.php",
                {
                    name: name,
                    ext: ext
                },
                function(data){
                    if(data == "NOK"){
                        console.warn("Failed to get " + name + "." + ext + " !");
                        callback(name+"."+ext+" doesn't exists !", "");
                    }else{
                        console.log(name+"."+ext+" is loaded.");
                        callback(null, JSON.parse(data));
                    }
                });
        }
    }

});
