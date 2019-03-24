const cloud = require('wx-server-sdk')
var rp = require('request-promise');
cloud.init()

const BlogMap = {
  'blogcoreos': {'article-image_url': [
    'https://7465-test-3c9b5e-1258459492.tcb.qcloud.la/trackupdates/coreos.png',
  ]}
}

async function getItems(jobname, id, num) {
  var url = 'http://39.106.218.104:5000/api/items?jobname=' + jobname
  if (id) {
    url += '&id=' + id
  }
  var defaultnum = num || 5;
  url += '&num=' + defaultnum
  console.log('request url:', url)
  var raw = await rp(url).then(function (response) {
      console.log('response:', response)
      return response;
    }).catch(function (err) {
      console.log('request error:', err)
    });
  var data = JSON.parse(raw)
  console.log('data:', data)
  var base_url = data.yaml.parser_config.base_url + '/'
  if (data.data) {
    data.data.map(function (d) {
      if (d['article-image_url'] == base_url) {
        d['article-image_url'] = BlogMap[jobname]['article-image_url'][0]
      }
    })
  }
  return data || {}
}

// 云函数入口函数
exports.main = async (event, context) => {
  var { type, jobname, id } = event;

  return await getItems(jobname, id)
}