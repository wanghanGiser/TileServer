const { PythonShell } = require("python-shell");
const connect = require('./Message')
const fs = require('fs');
module.exports = async function runPy(path, nodata) {
  nodata = nodata ? nodata : ""
  return new Promise((res, rej) => {
    if (!fs.existsSync(path)) {
      rej(`file ${path} does not exist`);
      return;
    }
    PythonShell.run('getGeoReference.py', {
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
          msg: 'no georeference'
        });
        return;
      }
      let time = new Date().getTime()
      let ps = new PythonShell("main.py", {
        args: [path, `./www/tiles/${time}`, nodata]
      })
      let per = 0
      ps.on('message', msg => {
        if (/^\d/.test(msg)) {
          msg = msg.split(' ').slice(0, 3).join("");
          if (per < 70) {
            per = 70 * eval(msg)
          } else {
            per = 70 + 30 * eval(msg)
          }
          connect.send({
            process:parseInt(per),
            id:time
          })
        }
      })
      ps.on('error', err => {
        console.log(err);
        rej({
          status: 0,
          msg: err
        })
      })
      ps.on('close', ()=> {
        res({
          status: 1,
          msg: time
        });
      })
    })
  })
}