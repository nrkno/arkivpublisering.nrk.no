var request = require("request");
var appConfig = require("../../config/appconfig.js");
var archiveservice = require('../services/archiveservice')(appConfig.googledoc);

module.exports = {

    index: function(req, res){
        var id = req.param('id') || '1';
        if(!req.param('id')){
            return res.redirect('/1');
        }
    	archiveservice.getAllArchives(id, function(data){
	     	return res.view({ 
	     		title : data.period.title,
	     		data : data });
    	});
   
    }
};