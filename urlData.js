/**
  {
      '2020-05-24':[]
  }
 */
fs = require('fs'),
path = require('path');

let urlData = {};

	//读取json文件
fs.readFile('./urlData.json', 'utf-8', function(err, data) {
    if (err) {
      console.log(err)
    } else {
        urlData = data&&JSON.parse(data);
    }
});

module.exports.getData = function(){
    return urlData;
}

module.exports.getDataById = function(id){
    return urlData[id];
}

module.exports.setData = function(id, item){
    if(urlData[id]){
        return;
    }else{
        urlData[id]= item;
    }
}
