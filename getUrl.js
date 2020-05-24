const Koa = require('koa'),
    Router = require('koa-router'),
    cheerio = require('cheerio'),
    charset = require('superagent-charset'),
    superagent = charset(require('superagent')),
    fs = require('fs'),
    path = require('path'),
    app = new Koa(),
    router = new Router();
const {getData, setData} = require('./urlData')
let arr;
let _continue = true;
let activeUrl = 0;
let _activeUrl;
function setUrl(){
    if(activeUrl === 0){
        _activeUrl = '';
    }else{
        _activeUrl =  '_' + activeUrl;
    }
    url = `http://fgj.wuhan.gov.cn/zwgk_44/xxgk/xxgkml/sjfb/mrxjspfcjtjqk/index${_activeUrl}.shtml`
}
// http://fgj.wuhan.gov.cn/zwgk_44/xxgk/xxgkml/sjfb/mrxjspfcjtjqk/index_10.shtml
 
function sendHttp(){
    setUrl();
    console.log(url);

    superagent.get(url)
    .charset('utf-8')  // 当前页面编码格式
    .buffer(true)
    .end((err, data) => { //页面获取到的数据
        if (err) {
            // return next(err); 
            _continue = false;
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
        let _lis =  $(".info-list").children();
        // cheerio的使用类似jquery的操作
        $(_lis).each((index, element)=> {
            _children = $(element).children();
            arr.push({
                url:  _children.first().attr('href'),
                date:_children.last().text()
            })
          
            setData(_children.last().text(), {
                url:  _children.first().attr('href'),
                date:_children.last().text()
            })
        })
        console.log(getData());
      
        console.log(_continue)
        if(_continue){
            activeUrl +=1;
            setTimeout(sendHttp, 200)
        }else{
            let _json = JSON.stringify(getData());
            fs.writeFile('./urlData.json', _json, 'utf8', (err) => {
                if (err) throw err;
                console.log('done');
            });
        }
    })
 
}

router.get('/', (ctx, next) => {
    sendHttp(ctx);
 
    ctx.body = arr   
})


app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3011, () => {
    console.log('[服务已开启,访问地址为：] http://127.0.0.1:3011/');
});