const Koa = require('koa');
const serve = require('koa-static');
const cors = require('@koa/cors');
const fs = require('fs')

const config = require('./config.json')
const connect = require('./utils/Message')
const WebSocket=require('ws')
if(!fs.existsSync('./www/tiles')){
  fs.mkdirSync('./www/tiles')
  fs.writeFileSync('./www/list.json',JSON.stringify({}))
}
const app = new Koa()
app.use(cors());
const router=require('./controller/index.js')
app.use(router.routes()).use(router.allowedMethods());
app.use(serve('www'));
const wss=new WebSocket.Server({
  port:config.ws.port
},()=>{
  console.log('ws inited');
})
wss.on('headers',(req)=>{
  console.log(req);
})
wss.on('connection',ws=>{
  connect.receieve(msg=>{
    ws.send(JSON.stringify(msg))
  })
})



const server=app.listen(config.port,()=>{
  console.log(`server start at localhost:${config.port}`);
})
server.setTimeout(0)