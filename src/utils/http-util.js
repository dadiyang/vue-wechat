var axios = require("axios");
var qs = require("qs");

axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';

function get(url, param) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, param && {
        params: param
      })
      .then((res) => {
        let data = res.data || {
          code: -99,
          msg: res.statusText
        };
        return resolve(data);
      })
      .catch((err) => {
        handleError(err, reject);
      });
  })
}

function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, qs.stringify(params))
      .then((res) => {
        let data = res.data || {
          code: -99,
          msg: res.statusText
        };
        return resolve(data);
      })
      .catch((err) => {
        handleError(err, reject);
      });
  })
}

function getScript(src, cb) {
  var script = document.createElement("script");
  script.type = 'text/javascript';
  script.async = true;
  script.charset = 'utf-8';
  script.src = src;
  if (cb) {
    script.onload = cb;
  }
  document.getElementsByTagName("head")[0].appendChild(script);
}

function upload(url, file) {
  return new Promise((resolve, reject) => {
    //创建form对象
    let param = new FormData();
    //通过append向form对象添加数据
    param.append('file', file, file.name);
    console.log(param.get('file'));
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }; //添加请求头
    axios.post(url, param, config)
      .then((res) => {
        let data = res.data || {
          code: -99,
          msg: res.statusText
        };
        return resolve(data);
      })
      .catch((err) => {
        handleError(err, reject);
      });
  });
}

function handleError(err, reject) {
  if (err.message.indexOf("302") >= 0) {
    this.$message.warning("长时间不使用session过期,自动刷新页面");
    window.location.reload();
  } else {
    console.error(err);
    return reject({
      code: -100,
      msg: "网络错误，如多次出现请尝试刷新页面"
    });
  }
}
export default {
  get,
  post,
  getScript,
  upload
};