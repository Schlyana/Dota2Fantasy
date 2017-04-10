const express = require('express');
const connection_string = 'mongodb://localhost:27017/dota2fl';
const db = require('mongoskin').db(connection_string);
const builder = require('./jsonBuilder.js');

exports.registerDataDB = function(data_type, user_data, search_key, callback){
  exports.findDataDB(data_type, user_data[search_key], search_key, function(result){
    result = JSON.parse(result);
    if (result["success"]){
      response = builder.json(data_type + " already registered",false);
    }
    else{
      db.collection(data_type).insert(user_data);
      result = data_type + " registered";
      response = builder.json(result,true);
    }
    callback(response);
  });
}

exports.findDataDB = function(data_type, search_value, search_key, callback){
  var query = {};
  query[search_key] = search_value;
  db.collection(data_type).find(query).toArray(function(err,result){
    if (err) throw err;
    if (result === null || result.length === 0){
      result = data_type + " not found";
      response = builder.json(result,false);
    }
    else{
      response = builder.json(result,true);
    }
    callback(response);
  });
}

var removeDataDB = function(data_type, search_value, search_key, callback){
  var query = {};
  query[search_key] = search_value;
  db.collection(data_type).remove(query, function(err, result){
    if (err) throw err;
    callback()
  })
}