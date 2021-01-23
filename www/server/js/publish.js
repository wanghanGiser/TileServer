function submit() {
  let path = document.getElementById('path').value
  let name = document.getElementById('name').value
  let nodata = document.getElementById('nodata').value

  axios.get('/publish', {
    params: {
      path,
      name,
      nodata
    }
  }).then(res => {
    if (res.data.status === 1) {
      // 
      document.getElementById('process').style.transition = "none"
      document.getElementById('process').style.backgroundColor = "#45aaf2"
      document.getElementById('process').style.width = "0"
      document.getElementById('process').style.transition = "all .3s ease-in-out"
    }

  }).catch((e) => {
    if (e.response.data.status === 0) {
      return;
    }
    document.getElementById('process').style.transition = "none"
    document.getElementById('process').style.backgroundColor = "#eb3b5a"
    document.getElementById('process').style.width = '100%'
    document.getElementById('process').style.transition = "all .3s ease-in-out"
    setTimeout(() => {
      alert(e.response.data.msg)
    }, 0)
  })
}
axios.get('/config.json').then(res => {
  let url = decodeURI(window.location.href).split(":")
  const ws = new WebSocket(`ws:${url[1]}:${res.data.ws.port}`)
  ws.onopen = () => {
    console.log('ws connected');
  }
  ws.onmessage = msg => {
    let data = JSON.parse(msg.data);
    if (data.status === 1) {
      document.getElementById('process').style.backgroundColor = "#20bf6b"
    } else {
      document.getElementById('process').style.width = `${data.process}%`
    }
    let obj=document.getElementById('info')
    obj.value+=`${data.msg}\n`
    obj.scrollTop = obj.scrollHeight
  }
})
