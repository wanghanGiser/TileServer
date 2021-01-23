const Router = require("@koa/router");
const router = new Router()
const fs = require('fs')
const path = require('path')
const config = require('../www/config.json')

const delDir = require('../utils/delDir')
const script = require('../utils/script');
router.get("/", async (ctx) => {
  ctx.redirect("/server")
})

let runing = 0
router.get("/publish", async (ctx) => {
  console.log("/publish");
  if (runing === 1) {
    console.log("有任务正在处理，无法开始新的任务，请等待完成。");
    ctx.body = {
      status: 0,
      msg: "有任务正在处理，无法开始新的任务，请等待完成。"
    }
  } else {
    runing = 1
    script(ctx.request.query.path, ctx.request.query.nodata).then(res => {
      runing = 0
      let data = res;
      let json = require('../www/list.json');
      json[data.msg] = {
        name: ctx.request.query.name
      }
      fs.writeFileSync(path.resolve(__dirname, '../www/list.json'), JSON.stringify(json));
      // ctx.body = {
      //   ...data,
      //   data: {
      //     id: data.msg,
      //     url: '/tiles/' + data.msg,
      //     port: config.port
      //   }
      // }
    }).catch(e => {
      runing = 0
      // let data = e;
      // ctx.status = 400;
      // ctx.body = data
    })
    ctx.body = {
      status:1,
      msg:"处理中"
    }
  }

})
router.get("/del", async (ctx) => {
  let id = ctx.query.id
  try {
    delDir(path.resolve(__dirname, '../www/tiles/' + id));
    let json = require('../www/list.json')
    delete json[id];
    fs.writeFileSync(path.resolve(__dirname, '../www/list.json'), JSON.stringify(json))
    ctx.body = {
      status: 1,
      msg: "删除成功"
    }
  } catch (error) {
    ctx.body = {
      status: 0,
      msg: error
    }
  }
})
router.get("/list", async ctx => {
  console.log("/list");
  ctx.body = require('../www/list.json')
})
module.exports = router