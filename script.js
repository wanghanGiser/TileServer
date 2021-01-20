const { PythonShell } = require("python-shell");
const fs = require('fs');
module.exports=async function runPy(path, nodata) {
  nodata=nodata?nodata:""
  return new Promise((res, rej) => {
    if (!fs.existsSync(path)) {
      rej(`file ${path} does not exist`);
      return;
    }
    PythonShell.run('getGeoReference.py', {
      args: [path]
    }, (err, out) => {
      if (err) {
        rej({
          status:0,
          msg:err
        })
        return;
      }
      if (out[0] === "") {
        rej({
          status:0,
          msg:'no georeference'
        });
        return;
      }
      let time=new Date().getTime()
      PythonShell.run('main.py', {
        args: [path, `./www/tiles/${time}`, nodata]
      }, (err) => {
        if (err) {
          rej({
            status:0,
            msg:err
          })
          return;
        };
        res({
          status:1,
          msg:time
        });
      })
    })
  })
}
// runPy('E:/Python/gdal1/input/bohai.tif',"0").then(res=>{
//   console.log(res);
// }).catch(e=>{
//   console.log(e);
// })