const Koa = require('koa'),
    Router = require('koa-router'),
    cheerio = require('cheerio'),
    charset = require('superagent-charset'),
    superagent = charset(require('superagent')),
    fs = require('fs'),
    path = require('path'),
    app = new Koa(),
    router = new Router();
const {getData, setData} = require('./baseData')
let arr;
let urlData;
let _continue = true;
fs.readFile('./urlData-2020-05-24.json', 'utf-8', function(err, data) {
  if (err) {
    console.log(err)
  } else {
      // console.log(data);
      urlData = JSON.parse(data);
  }
});

function sendHttp(url){
  console.log(url)
  // url = 'http://fgj.wuhan.gov.cn/zwgk_44/xxgk/xxgkml/sjfb/mrxjspfcjtjqk/202005/t20200524_1331136.shtml'; //target地址
  superagent.get(url)
    .charset('utf-8')  // 当前页面编码格式
    .buffer(true)
    .end((err, data) => { //页面获取到的数据
      if (err) {
        // return next(err); 
        _continue = false;
        let _json = JSON.stringify(getData(),null, 4);
        fs.writeFile('./baseData.json', _json, 'utf8', (err) => {
            if (err) throw err;
            // console.log('done');
        });
        console.log('页面不存在', err)
      }
      let html = data.text,
      
      $ = cheerio.load(html, {
        decodeEntities: false,
        ignoreWhitespace: false,
        xmlMode: false,
        lowerCaseTags: false
      }), //用cheerio解析页面数据
      obj = {};
      arr = [];
      let _trs =  $("table tbody").children();
      // cheerio的使用类似jquery的操作
      $(_trs).each((index, element)=> {
        let _tds = $(element).children();
        if(index >1){
          arr.push({
            region:_tds.eq(0).text(),
            number:  _tds.eq(1).text() || 0,
          })
        }
      })
      let date = arr[16].number.substr(5,10).trim()
      setData(date, arr)
    })
}
router.get('/', (ctx, next) => {
  // url = 'http://fgj.wuhan.gov.cn/zwgk_44/xxgk/xxgkml/sjfb/mrxjspfcjtjqk/202005/t20200523_1330884.shtml'; //target地址
  for(let key in urlData){
    let _url = urlData[key].url;
    setTimeout(()=> sendHttp(_url), 100)
  }
 
  ctx.body = arr
 
})


app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3010, () => {
    console.log('[服务已开启,访问地址为：] http://127.0.0.1:3010/');
});