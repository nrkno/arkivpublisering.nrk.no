var request = require("request");
var appConfig = require("../../config/appconfig.js");
var archiveservice = require('../services/archiveservice')(appConfig.googledoc);

module.exports = {

    getContent: function(req, res){
        var id = req.param('id') ;
        archiveservice.getArchive(id, function(data){
            return res.json(data); 
        });
    },

    allPeriods: function(req, res){
        var id = req.param('id') ;
        archiveservice.getAllArchives(id, function(data){
            return res.json(data); 
        });
    },


};

