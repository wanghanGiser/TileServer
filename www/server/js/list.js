
function getData() {
  let ul = document.getElementById('list');
  ul.innerHTML=""
  axios.get('/list').then(res => {
    let data = Object.keys(res.data).map(item => {
      return {
        id: item,
        name: res.data[item].name
      }
    })
    data.forEach(item => {
      let li = document.createElement('li');
      li.innerHTML = `<span>${item.name}</span> <code>http://localhost:3000/tiles/${item.id}/</code> <a target="_blank" href=http://localhost:3000/tiles/${item.id}/openlayers.html>查看</a> <a href="javascript:void(0)" onclick="del('${item.id}')">删除</a>`;
      ul.appendChild(li)
    })
  })
}
function del(id) {
  axios.get('/del', {
    params: {
      id
    }
  }).then(res => {
    console.log(res);
    getData()
  })
}
getData()