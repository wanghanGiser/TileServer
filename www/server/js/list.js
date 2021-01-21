
function getData() {
  let url = decodeURI(window.location.href).split(":")
  let ul = document.getElementById('list');
  ul.innerHTML = ""
  axios.get('/config.json').then(d => {
    let cfg=d.data
    axios.get('/list').then(res => {
      let data = Object.keys(res.data).map(item => {
        return {
          id: item,
          name: res.data[item].name
        }
      })
      console.log(data);
      data.forEach(item => {
        let li = document.createElement('li');
        li.innerHTML = `<span>${item.name}</span> <code>http:${url[1]}:${cfg.port}/tiles/${item.id}/</code> <a target="_blank" href=http:${url[1]}:${cfg.port}/server/openlayers.html?id=${item.id}&name=${item.name}>查看</a> <a href="javascript:void(0)" onclick="del('${item.id}')">删除</a>`;
        ul.appendChild(li)
      })
    })
  })
}
function del(id) {
  let b = confirm("是否删除服务？")
  if (b) {
    axios.get('/del', {
      params: {
        id
      }
    }).then(res => {
      console.log(res);
      getData()
    })
  }
}
getData()