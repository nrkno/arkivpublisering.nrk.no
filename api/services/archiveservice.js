var request = require("request");
var async = require("async");
var util = require('util');

module.exports = function(googledocid){
	if(!googledocid){
		throw new Error('No Google Doc Id specified! Check appconfig.js');
	} 


	var _googleDocid = googledocid;
    var allSpreadSheetsUrl = util.format('https://spreadsheets.google.com/feeds/worksheets/%s/public/basic?alt=json', _googleDocid);
    var contentOfSpreadSheetUrl = util.format('https://spreadsheets.google.com/feeds/list/%s/%s/public/values?alt=json', _googleDocid);

    var psapiserieUrl = 'http://psapi.nrk.no/series/%s/latestornextepisode/mediaelement';
    var psapiprogramUrl = 'http://psapi.nrk.no/mediaelement/%s';
	
	var getAllArchives = function(archiveid, renderView){
		var _allPeriods = [];
	     _currentPeriod = {};
        request.get(allSpreadSheetsUrl, function (err, response, workSheetsBody) {
        	if(!err && response.statusCode == 200){
	            var allWorkSheetsFromGoogle = JSON.parse(workSheetsBody);
	            _.each(allWorkSheetsFromGoogle.feed.entry, function(worksheet, worksheetid){
	            	var isCurrent = worksheetid + 1 == archiveid;
	            	var thisPeriod = {
	                    id : worksheetid + 1,
	                    title : worksheet.title.$t,
	                    isCurrent : isCurrent ? "active" : ""
	                }
	                _allPeriods.push(thisPeriod);
	                if(isCurrent){
	                	_currentPeriod = thisPeriod;
	                }
	            });
        	}
            renderView({
            	allPeriods : _allPeriods,
            	period : _currentPeriod
            });
        });
	};
	

	var getArchive = function(archiveid, renderView) {

	    var _publishedProgramsInPeriod = [];
	    var _currentPeriod = {};

	    var getContentsOfCurrentSpreadSheetTask = function(imfinished){
	    	var url = util.format(contentOfSpreadSheetUrl, archiveid);
	        request.get(url, function (err, response, body) {  
	            if(!err && response.statusCode == 200){
	                var entriesFromGoogle = JSON.parse(body);                
	                _currentPeriod = { 
	                    id : archiveid,
	                    title : entriesFromGoogle.feed.title.$t 
	                };

	                _.each(entriesFromGoogle.feed.entry, function(entry, index){
	                    var entrySeriesId = entry.gsx$serieid.$t;
	                    _publishedProgramsInPeriod.push({
	                        title : entry.title.$t,
	                        serieid : entrySeriesId,
	                        programid : entry.gsx$programid.$t,
	                        ispromo : entry.gsx$promo.$t
	                       
	                    });
	                });
	            }
	            imfinished();
	       });
	    }

	    var setDataFromPsApi = function(programs, imfinished){
	        var fetchImageTasks = [];
	        _.each(programs, function(program, index){
	            if(program.ispromo && (program.serieid || program.programid)){
	             
	                var psapiurl;
	                if(program.programid){
	                    psapiurl = util.format(psapiprogramUrl, program.programid);
	                }else{
	                    psapiurl = util.format(psapiserieUrl, program.serieid)
	                }
	             
	                var reqOptions = {
	                    uri : psapiurl,
	                    timeout : 2000
	                };
	                var fetchImgTask = function(imFinished){
	                    request.get(reqOptions, function (err, response, body) { 
	                        if(!err && response.statusCode == 200){
	                            var apiResponse = JSON.parse(body);
	                            var image = apiResponse.images.webImages[0]; 
	                            var desc = apiResponse.description;
	                            program.imageurl = image.imageUrl;
	                            program.description = desc;                     
	                        }
	                        imFinished();
	                    });
	                }
	                fetchImageTasks.push(fetchImgTask);
	           }
	         
	        });

	        async.parallel(fetchImageTasks, function(){
	            imfinished();
	        });

	    }

	    var asyncTasks = [getContentsOfCurrentSpreadSheetTask];

	    async.parallel(asyncTasks, function(){
	        setDataFromPsApi(_publishedProgramsInPeriod, function(){
	            
	        renderView({
	                period : _currentPeriod, 
	                archive: _publishedProgramsInPeriod 
	            });
	        });
	    
	    });
	}
    return { 
    	getArchive : getArchive,
    	getAllArchives : getAllArchives
    };
};