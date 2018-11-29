const { poolPromise } = require("../database/db");
const _ = require("lodash");
var jsonexport = require("jsonexport");
var azure = require("azure-storage");
var accountInfo = require("../config/azureAccount.json");
const configs = require("config");
const axios = require("axios");

async function initEmailSentiment(){
  const emailData = await getVerifiedEmails();
  if(emailData.length>0){
   var result  = await uploadTsvFileToAzure(emailData);
  }
  else return;
}

async function getVerifiedEmails(){
 var query = "select Id, Subject, Verified , IsExported from dbo.SentimentAnalysisMetadata WHERE (Verified = 0 OR Verified = 1) And IsExported = 0";
  const pool = await poolPromise;
  const result = await pool.request().query(query);
  return result.recordset;
}

async function uploadTsvFileToAzure(emailData){
let emailList = [], emailIds = [] ;

emailList = _.map(emailData,_.partialRight(_.pick, ["Subject", "Verified"]));
emailIds = _.map(emailData, _.partialRight(_.pick, ["Id"]));

   jsonexport(emailList, function(err, csvFile) {
    if (err) return console.log(err);
    var azure = require("azure-storage");
    var blobService = azure.createBlobService(
      accountInfo.AccountName,
      accountInfo.AccountKey
    );
    blobService.createBlockBlobFromText(
      "bicontainer",
      "userFeedback.csv",
      csvFile,
      function(error, result, response) {
        if (!error) {
       InitiateBulkUpload(emailIds);
        } else {
        return
        }
      }
    );
  });   
}

async function InitiateBulkUpload(emailIds){
const result = await bulkUpdateExportedEmails(emailIds);
const  tsvUploadResult = await tsvRunEngine();
}

async function bulkUpdateExportedEmails(emailIds){
try{
 let emailData = emailIds;
  for (var i = 0, len = emailData.length; i < len; i++) {
  var query = 'UPDATE dbo.SentimentAnalysisMetadata SET IsExported = 1 WHERE Id = '+ emailData[i].Id; 
  const pool = await poolPromise;
  const result = await pool.request().query(query);  
  }
 } catch (error) {
   return 
  }   
 }

async function tsvRunEngine(){
    try{
       const response = await axios.post(configs.get("tsvRunEngineApiUrl"),{
      });
     return response.data;
    }
    catch(error){
     return ;
   }
} 
exports.initEmailSentiment = initEmailSentiment;