const Mock = require("mockjs");
import qs from 'qs';
import ApiPaths from "../src/api/api-paths";
import {
  newMsgCallBack
} from "./ws-api-mock";
let chatItem = {
  appId: "11",
  openId: "open@integer(1, 30)",
  displayName: '@cname',
  avatar: "@dataImage('42x42', '客')",
  reachable: "@Boolean",
  "unreadNum|0-3": 1,
  lastMsgContent: '@csentence',
  "lastMsgDate|1543090745-1545290745": 1,
}
let chatList = {
  code: 0,
  "data|15": [chatItem]
}
let msgs = {
  code: 0,
  "data|1-5": [{
    appId: "11",
    openId: "open@integer(1, 30)",
    // 文本类型
    "msgId|1-10000000": 1,
    content: '@csentence', //聊天内容
    sendType: /REC|SEND|AUTO_REPLY/,
    "createTime|1543800000-1543851602": 1, //时间
    msgType: "text",
    msgName: "文本消息",
    isEvent: false,
    picUrl: "",
    srcUrl: ""
  }, {
    // 图片类型
    "msgId|1-10000000": 1,
    openId: "@sentence(1)" + new Date().getTime(),
    content: '',
    sendType: /REC|SEND/,
    "createTime|1543800000-1543851602": 1, //时间
    msgType: "image",
    msgName: "图片消息",
    isEvent: false,
    picUrl: "@dataImage('100x100', '图片类型示例')",
    srcUrl: "@dataImage('100x100', '图片类型示例')"
  }, {
    // 图文类型
    "msgId|1-10000000": 1,
    openId: "@sentence(1)" + new Date().getTime(),
    "content": "@csentence",
    "title": "@csentence",
    sendType: /REC|SEND/,
    "createTime|1543800000-1543851602": 1, //时间
    msgType: "news",
    msgName: "图文消息",
    isEvent: false,
    picUrl: "@dataImage('100x100', '图文类型示例')",
    srcUrl: "https://mp.weixin.qq.com/s/U1YkgKpdjJxJE5Sae1lvxw"
  }, {
    // 语音类型
    "msgId|1-10000000": 1,
    openId: "@sentence(1)" + new Date().getTime(),
    content: '@csentence', // 语音识别结果
    sendType: /REC|SEND/,
    "createTime|1543800000-1543851602": 1, //时间
    msgType: "voice",
    msgName: "语音消息",
    isEvent: false,
    picUrl: "",
    srcUrl: "static/audio/testAudio.mp3"
  }, {
    // 视频类型
    "msgId|1-10000000": 1,
    openId: "@sentence(1)" + new Date().getTime(),
    content: '',
    sendType: /REC|SEND/,
    "createTime|1543800000-1543851602": 1, //时间
    msgType: /video|shortvideo/,
    msgName: "视频消息",
    isEvent: false,
    picUrl: "@dataImage('160x60', '视频类型示例')",
    srcUrl: "http://www.runoob.com/try/demo_source/movie.mp4"
  }, {
    // 链接类型
    "msgId|1-10000000": 1,
    openId: "@sentence(1)" + new Date().getTime(),
    content: '这是58同城官网的链接，请打开查看',
    title: "58同城官网",
    sendType: /REC|SEND/,
    "createTime|1543800000-1543851602": 1, //时间
    msgType: "link",
    msgName: "链接消息",
    isEvent: false,
    picUrl: "",
    srcUrl: "https://www.58.com/"
  }, {
    // 地理位置类型
    "msgId|1-10000000": 1,
    openId: "@sentence(1)" + new Date().getTime(),
    content: '',
    title: "北京市朝阳区58同城总部",
    sendType: /REC|SEND/,
    "createTime|1543800000-1543851602": 1, //时间
    locationX: 116.5164433858,
    locationY: 39.97873316136,
    msgType: "location",
    msgName: "地理位置消息",
    isEvent: false,
    picUrl: "",
    srcUrl: ""
  }, {
    // 关注事件类型
    "msgId|1-10000000": 1,
    openId: "@sentence(1)" + new Date().getTime(),
    content: '',
    sendType: /REC/,
    "createTime|1543000000-1543851602": 1, //时间
    msgType: "SUBSCRIBE",
    msgName: "关注事件",
    isEvent: true,
    picUrl: "",
    srcUrl: ""
  }, {
    // 点击菜单拉取消息事件
    "msgId|1-10000000": 1,
    openId: "@sentence(1)" + new Date().getTime(),
    content: '',
    sendType: /REC/,
    "createTime|1543000000-1543851602": 1, //时间
    msgType: "CLICK",
    msgName: "点击菜单拉取消息事件",
    isEvent: true,
    picUrl: "",
    srcUrl: ""
  }]
}

let sendMsg = {
  code: 0,
  data: {
    appId: "11",
    "msgId|1-10000000": 1,
    content: '@csentence', //聊天内容
    sendType: "SEND",
    "createTime|1543800000-1543851602": 1, //时间
    msgType: "text",
    picUrl: "",
    srcUrl: ""
  }
}
let sendImageRs = {
  code: 0,
  data: {
    // 图片类型
    "msgId|1-10000000": 1,
    openId: "@sentence(1)" + new Date().getTime(),
    content: '',
    sendType: "SEND",
    "createTime|1543800000-1543851602": 1, //时间
    msgType: "image",
    msgName: "图片消息",
    isEvent: false,
    picUrl: "@dataImage('100x100', '图片类型示例')",
    srcUrl: "@dataImage('100x100', '图片类型示例')"
  }
}
Mock.mock(RegExp(ApiPaths.chat.getChatList + ".*"), options => {
  console.debug(ApiPaths.chat.getChatList, options);
  let list = Mock.mock(chatList);
  // 去除重复的openId
  let data = [];
  list.data.forEach(d => data[d.openId] = d);
  list.data = Object.values(data);
  return list;
});

Mock.mock(RegExp(ApiPaths.chat.getRecordsByOpenId + ".*"), options => {
  console.debug(ApiPaths.chat.getRecordsByOpenId, options);
  let openId = options.url.substring(options.url.indexOf("openId=") + 7)
  let result = Mock.mock(msgs);
  result.data.forEach(d => {
    d.openId = openId;
  });
  return result;
});

Mock.mock(ApiPaths.chat.setRead, options => {
  console.debug(ApiPaths.chat.setRead, options);
  return Mock.mock({
    code: 0
  })
})

Mock.mock(RegExp(ApiPaths.chat.getChatItemByOpenId + ".*"), options => {
  console.debug(ApiPaths.chat.getChatItemByOpenId, options);
  let item = JSON.parse(JSON.stringify(chatItem));
  item.openId = /sisf|dsdf|anb2|sss4|safs4|sd22|bbas|sss/;
  return Mock.mock({
    code: 0,
    data: item
  })
})

Mock.mock(RegExp(ApiPaths.chat.sendImage + ".*"), options => {
  console.debug(ApiPaths.chat.sendImage, options);
  // 此请求的url类似：127.0.0.1:8013/chat/sendImage?appId=11&openId=open10
  let body = qs.parse(options.url.split("?")[1]);
  let rs = Mock.mock(sendImageRs);
  rs.data.openId = body.openId;
  // 从请求体中获取文件
  let file = options.body.values().next().value;
  if (file) {
    // 尝试将图片转为base64
    toBase64(file, (base64) => {
      rs.data.picUrl = base64;
      rs.data.srcUrl = base64;
      // 调用新消息的回调
      newMsgCallBack && newMsgCallBack(rs.data);
    })
  } else {
    newMsgCallBack && newMsgCallBack(rs.data);
  }
  return rs;
});

Mock.mock(RegExp(ApiPaths.chat.send + ".*"), options => {
  let body = qs.parse(options.body);
  console.debug(ApiPaths.chat.send, body);
  let rs = Mock.mock(sendMsg);
  rs.data.openId = body.openId;
  rs.data.content = body.content;
  // 调用新消息的回调
  newMsgCallBack && newMsgCallBack(rs.data);
  return rs;
})

function toBase64(file, cb) {
  let reader = new FileReader();
  // 最大限制在2M以内
  const MAX_SIZE = 2 << 20;
  if (file) {
    //将文件以Data URL形式读入页面  
    reader.readAsDataURL(file);
    reader.onload = function(e) {
      if (MAX_SIZE < reader.result.length) {
        return;
      } else {
        cb(reader.result);
      }
    }
  }
}