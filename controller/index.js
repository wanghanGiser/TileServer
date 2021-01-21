const Router = require("@koa/router");
const router = new Router()
const fs = require('fs')
const path=require('path')
const config = require('../config.json')

const delDir = require('../utils/delDir')
const script = require('../utils/script');
router.get("/publish", async (ctx) => {
  let data = await script(ctx.request.query.path, ctx.request.query.nodata).then(res => res).catch(e => e)
  if (data.status === 1) {
    let json = require('../www/list.json');
    json[data.msg] = {
      name: ctx.request.query.name
    }
    fs.writeFileSync(path.resolve(__dirname,'../www/list.json'), JSON.stringify(json));
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
    delDir(path.resolve(__dirname,'../www/tiles/' + id));
    let json = require('../www/list.json')
    delete json[id];
    fs.writeFileSync(path.resolve(__dirname,'../www/list.json'), JSON.stringify(json))
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
router.get("/list",async ctx=>{
  ctx.body=require('../www/list.json')
})
module.exports=router