const { PythonShell } = require("python-shell");
const connect = require('./Message')
const fs = require('fs');
module.exports = async function runPy(path, nodata) {
  nodata = nodata ? nodata : ""
  return new Promise((res, rej) => {
    if (!fs.existsSync(path)) {
      rej({
        status:0,
        msg:`文件 ${path} 不存在。`
      });
      return;
    }
    PythonShell.run('py/getGeoReference.py', {
      args: [path]
    }, (err, out) => {
      if (err) {
        console.log(err);
        rej({
          status: 0,
          msg: err
        })
        return;
      }
      if (out[0] === "") {
        rej({
          status: 0,
          msg: '文件没有空间参考。'
        });
        return;
      }
      let time = new Date().getTime()
      let ps = new PythonShell("py/main.py", {
        args: [path, `./www/tiles/${time}`, nodata]
      })
      let per = 0
      ps.on('message', msg => {
        // console.log(msg);
        if (/^\d/.test(msg)) {
          let r = msg.split(' ').slice(0, 3).join("");
          if (per < 20) {
            per = 20 * eval(r)
          } else {
            per = 20 + 80 * eval(r)
          }
        }
        connect.send({
          process:per,
          msg,
          status:0,
          id:time
        })
      })
      ps.on('error', err => {
        console.log(err);
        rej({
          status: 0,
          msg: err
        })
      })
      ps.on('close', ()=> {
        connect.send({
          process:per,
          msg:"处理完成",
          status:1,
          id:time
        })
        res({
          status: 1,
          msg: time
        });
      })
    })
  })
}