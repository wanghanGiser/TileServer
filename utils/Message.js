class Message {
    constructor() {
        this.cbs = []
    }
    send(msg) {
        for (let cb of this.cbs) {
            cb(msg)
        }
    }
    receieve(cb) {
        this.cbs.push(cb)
    }
    unreceieve(cb){
        this.cbs=this.cbs.filter(item=>item!==cb)
    }
}
let instance=new Message()
module.exports=instance