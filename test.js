const {PythonShell}=require('python-shell')
const connect = require('./Message')
const script=require('./script')
connect.receieve((msg)=>{
    console.log(msg);
})
script('E:/tif/散射强度.tiff').then(res=>{
    console.log(res);
})
// let pyshell = new PythonShell('main.py',{
//     args:['E:/tif/散射强度.tiff','E:/tif/out',undefined]
// });
 
// // sends a message to the Python script via stdin
// let per=0
// pyshell.on('message', function (message) {
//     if(/^\d/.test(message)){
//        message=message.split(' ').slice(0,3).join("");
//        if(per<50){
//            per=50*eval(message)
//        }else{
//            per=50+50*eval(message)
//        }
//        console.log(parseInt(per));
//     }
// });
// // end the input stream and allow the process to exit
// pyshell.end(function (err,code,signal) {
//   if (err) throw err;
//   console.log('The exit code was: ' + code);
//   console.log('The exit signal was: ' + signal);
//   console.log('finished');
// });
