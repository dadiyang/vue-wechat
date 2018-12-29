// websocket api 打桩
const Mock = require("mockjs");
// 保存并导出两个回调的引用，以供其他mock模拟websocket推送消息
let newMsgCallBack;
let reachableChangeCallBack;

function connect(onConnecting, onConnected, onError) {
  // 模拟正在连接
  onConnecting && onConnecting();
  setTimeout(() => {
    // 模拟连接成功
    onConnected && onConnected();
  }, 2000)
}

function subNewMsg(cb) {
  newMsgCallBack = cb;
  setInterval(() => {
    cb(Mock.mock({
      appId: "11",
      openId: "open@integer(1, 30)",
      // 文本类型
      "msgId|1-10000000": 1,
      content: '@csentence', //聊天内容
      sendType: /REC|SEND|AUTO_REPLY/,
      createTime: new Date().getTime() / 1000, //时间
      msgType: "text",
      picUrl: "",
      srcUrl: ""
    }));
  }, 3000);
}

function subReachableChange(cb) {
  reachableChangeCallBack = cb;
  setInterval(() => {
    cb(Mock.mock({
      openId: "open@integer(1, 30)",
      reachable: "@Boolean"
    }));
  }, 5000);
}

export {
  connect,
  subNewMsg,
  subReachableChange,
  newMsgCallBack,
  reachableChangeCallBack
}