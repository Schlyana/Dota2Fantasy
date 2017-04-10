const express = require('express')

exports.json = function (data, result){
  response = {
    "success" : result,
    "data" : data
  };
  return JSON.stringify(response);
}