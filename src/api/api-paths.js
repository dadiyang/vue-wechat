let chat_server = process.env.CHAT_SERVER;
let apiPaths = {
  websocket: {
    endpoint: chat_server + "/ws",
    path: {
      subMsg: "/user/topic/subNewMsg",
      reachableChange: "/user/topic/reachableChange"
    }
  },
  chat: {
    getChatList: chat_server + "/chat/getChatList",
    getChatItemByOpenId: chat_server + "/chat/getChatItemByOpenId",
    getRecordsByOpenId: chat_server + "/chat/getRecordsByOpenId",
    setRead: chat_server + '/chat/setRead',
    send: chat_server + "/chat/send",
    // 发送图片消息
    sendImage: chat_server + "/chat/sendImage",
  }
}
export default apiPaths