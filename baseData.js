/**
  {
      '2020-05-24':[]
  }
 */
fs = require('fs'),
path = require('path');

let baseData = {};

	//读取json文件
fs.readFile('./baseData.json', 'utf-8', function(err, data) {
    if (err) {
      console.log(err)
    } else {
        // console.log(data);
        baseData = JSON.parse(data);
    }
});

module.exports.getData = function(){
    return baseData;
}

module.exports.getDataById = function(id){
    return baseData[id];
}

module.exports.setData = function(id, item){
    if(baseData[id]){
        return;
    }else{
        baseData[id]= item;
    }
}
