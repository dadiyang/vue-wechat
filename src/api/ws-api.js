import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import ApiPaths from './api-paths';
import CacheUtil from "@/utils/cache-util";
let client;
let sock;
let subscribes = [];
let errorTimes = 0;
/**
 * 建立websocket连接
 * @param {Function} onConnecting 开始连接时的回调
 * @param {Function} onConnected 连接成功回调
 * @param {Function} onError 连接异常或断开回调
 */
function connect(onConnecting, onConnected, onError) {
  onConnecting instanceof Function && onConnecting();
  sock = new SockJS(ApiPaths.websocket.endpoint);
  client = Stomp.over(sock);
  console.log("ws: start connect to " + ApiPaths.websocket.endpoint);
  client.connect({}, function(frame) {
    errorTimes = 0;
    console.log('connected: ' + frame);
    subscribes.forEach(s => {
      client.subscribe(s.path, function(resp) {
        console.debug("ws收到消息: " + resp.body);
        s.cb(JSON.parse(resp.body));
      });
    });
    onConnected instanceof Function && onConnected();
  }, function(err) {
    console.warn(err);
    errorTimes = errorTimes > 8 ? 0 : errorTimes;
    let nextTime = ++errorTimes * 3000;
    console.warn("与服务器断开连接，" + nextTime + " 秒后重新连接");
    setTimeout(() => {
      console.log("尝试重连……");
      connect(onConnecting, onConnected, onError);
    }, nextTime);
    onError instanceof Function && onError();
  });
}

/**
 * 订阅新消息，就算连接还未建立也可以，程序会记录订阅情况，在连接建立后再次订阅
 * @param {Function} cb 回调
 */
function subNewMsg(cb) {
  subscribe(ApiPaths.websocket.path.subMsg, cb);
}
/**
 * 订阅用户可达性变更事件
 * @param {Function} cb 回调
 */
function subReachableChange(cb) {
  subscribe(ApiPaths.websocket.path.reachableChange, cb);
}

function subscribe(path, cb) {
  // 记录所有订阅，在连接成功时统一处理
  subscribes.push({
    path,
    cb
  });
  if (client && client.connected) {
    client.subscribe(path, function(resp) {
      console.debug("ws收到消息: " + resp.body);
      cb instanceof Function && cb(resp.body);
    });
  } else {
    console.warn("ws未连接，无法订阅：" + path)
  }
}

window.onbeforeunload = () => {
  // 当窗口关闭时断开ws连接
  if (client && client.connected) {
    client.disconnect(() => {
      console.log("websocket disconnected ");
    });
    CacheUtil.clear();
  }
}
let mock;
if (process.env.MOCK) {
  mock = require('../../mock/ws-api-mock')
}
export default mock || {
  connect,
  subNewMsg,
  subReachableChange
}