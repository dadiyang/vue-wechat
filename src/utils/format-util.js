/**
 * 将后端返回的时间转换成页面上友好的格式
 * @param {*} date 
 */
function displayTime(date) {
  if (!date) {
    return "";
  }
  if (typeof date === "number") {
    if (date <= 0) {
      return "";
    }
    // 微信回调的时间戳是以秒为单位的
    date = new Date(date * 1000);
  }
  if (typeof date === "string") {
    date = new Date(date);
  }
  let now = new Date();
  if (date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()) {
    return format(date, "HH:mm:ss");
  } else {
    return format(date, "yyyy-MM-dd");
  }
}

/**
 * 在Date原型上添加format方法
 * @param {*} format 格式，默认为 yyyy-MM-dd HH:mm:ss
 */
function format(date, format) {
  if (!format) {
    format = "yyyy-MM-dd HH:mm:ss";
  }
  var o = {
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
    "H+": date.getHours(), //hour
    "m+": date.getMinutes(), //minute
    "s+": date.getSeconds(), //second
    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
    S: date.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format))
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return format;
};

/**
 * 将文本转换为固定长度的文本，如果超过指定长度则添加 ...
 * @param {String} txt 文本
 * @param {int} length 长度
 */
function fixLength(txt, length) {
  if (!txt || txt.length < length) {
    return txt;
  } else {
    return txt.substring(0, length) + "...";
  }
}

export default {
  displayTime,
  format,
  fixLength
}