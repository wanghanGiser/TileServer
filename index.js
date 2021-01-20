const Koa = require('koa');
const serve = require('koa-static');
const cors = require('@koa/cors');
const Router = require("@koa/router");
const fs = require('fs')
const delDir = require('./delDir')
const script = require('./script');
const config = require('./config.json')
if(!fs.existsSync('./www')){
  fs.mkdirSync('./www');
  fs.mkdirSync('./www/tiles')
  fs.writeFileSync('./www/list.json',JSON.stringify({}))
}
const router = new Router()
const app = new Koa()
app.use(cors());
app.use(serve('www'));
router.get("/publish", async (ctx) => {
  let data = await script(ctx.request.query.path, ctx.request.query.nodata).then(res => res).catch(e => e)
  if (data.status === 1) {
    let json = require('./www/list.json');
    json[data.msg] = {
      name: ctx.request.query.name
    }
    fs.writeFileSync('./www/list.json', JSON.stringify(json));
    ctx.body = {
      ...data,
      data: {
        id: data.msg,
        url: '/tiles/' + data.msg,
        port: config.port
      }
    }
  } else {
    ctx.status = 400;
    ctx.body = data
  }
})
router.get("/del", async (ctx) => {
  let id = ctx.query.id
  try {
    delDir('./www/tiles/' + id);
    let json = require('./www/list.json')
    delete json[id];
    fs.writeFileSync('./www/list.json', JSON.stringify(json))
    ctx.body = {
      status:1,
      msg:"删除成功"
    }
  } catch (error) {
    ctx.body={
      status:0,
      msg:error
    }
  }
   
 
  
})
app.use(router.routes()).use(router.allowedMethods());
app.listen(config.port)