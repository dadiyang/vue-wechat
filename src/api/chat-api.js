import HttpUtil from '../utils/http-util';
import ApiPaths from './api-paths';
import CacheUtil from '../utils/cache-util';
const MSG_CACHE_KEY = "msgs:";
// 图片最大 2M
const IMAGE_MAX_SIZE = 1 << 21;

/**
 * 获取聊天好友列表
 */
function getChatList() {
  return new Promise((res, rej) => {
    HttpUtil.get(ApiPaths.chat.getChatList)
      .then((rs) => {
        if (rs.code >= 0) {
          if (!rs.data.length) {
            res([]);
          } else {
            let sortedData = rs.data.sort((a, b) => {
              if (a.lastMsgDate == b.lastMsgDate) {
                return 0;
              } else if (a.lastMsgDate > b.lastMsgDate) {
                return -1;
              } else {
                return 1;
              }
            });
            res(sortedData);
          }
        } else {
          rej(rs.msg);
        }
      })
      .catch(e => rej(e.msg));
  });
}

/**
 * 根据 openId 获取聊天记录
 * @param {String} openId 用户openId
 */
function getRecordsByOpenId(openId, firstCreateTime) {
  return new Promise((res, rej) => {
    let cache = CacheUtil.get(MSG_CACHE_KEY + openId + firstCreateTime, 300);
    if (cache) {
      return res(cache);
    }
    HttpUtil.get(ApiPaths.chat.getRecordsByOpenId, {
        firstCreateTime: firstCreateTime,
        openId: openId
      })
      .then((rs) => {
        if (rs.code >= 0) {
          let sortedData = rs.data.sort((a, b) => {
            if (a.createTime == b.createTime) {
              return 0;
            } else if (a.createTime < b.createTime) {
              return -1;
            } else {
              return 1;
            }
          });
          CacheUtil.setWithTime(MSG_CACHE_KEY + openId, sortedData);
          res(sortedData);
        } else {
          rej(rs.msg)
        }
      })
      .catch(e => rej(e.msg));
  });
}

/**
 * 设置已读时间
 * @param {String} openId 用户OpenId
 */
function setRead(openId) {
  return new Promise((res, rej) => {
    HttpUtil.post(ApiPaths.chat.setRead, {
        openId
      })
      .then((rs) => {
        if (rs.code >= 0) {
          res(rs.data);
        } else {
          rej(rs.msg)
        }
      })
      .catch(e => rej(e.msg));
  })
}
/**
 * 根据用户的openId获取聊天列表item
 * @param {String} openId openId
 */
function getChatItemByOpenId(openId) {
  return new Promise((res, rej) => {
    HttpUtil.get(ApiPaths.chat.getChatItemByOpenId, {
        openId
      })
      .then((rs) => {
        if (rs.code >= 0) {
          res(rs.data);
        } else {
          rej(rs.msg)
        }
      })
      .catch(e => rej(e.msg));
  });
}
/**
 * 发送消息
 * @param {Object} msg 消息体
 */
function send(msg) {
  return new Promise((res, rej) => {
    if (!msg.appId) {
      return rej("appId不能为空");
    }
    if (!msg.openId) {
      return rej("openId不能为空");
    }
    if (!msg.content || !msg.content.trim()) {
      return rej("内容不能为空");
    }
    if (msg.content.length > 1024) {
      return rej("内容过长!");
    }
    HttpUtil.post(ApiPaths.chat.send, msg)
      .then((rs) => {
        if (rs.code >= 0) {
          res(rs.data);
        } else {
          rej(rs.msg)
        }
      })
      .catch(e => rej(e.msg));
  });
}

/**
 * 发送图片消息
 * @param {Object} msg 消息体
 */
function sendImage(appType, appId, openId, file) {
  return new Promise((res, rej) => {
    if (file.size > IMAGE_MAX_SIZE) {
      return rej("图片大小不能大于2M");
    }
    HttpUtil.upload(ApiPaths.chat.sendImage + `?appType=${appType}&appId=${appId}&openId=${openId}`, file)
      .then((rs) => {
        if (rs.code >= 0) {
          res(rs.data)
        } else {
          rej(rs.msg)
        }
      })
      .catch(e => rej(e.msg));
  });
}

/**
 * 清除某个用户的聊天记录缓存
 * @param {String} openId id
 */
function cleanCache(openId) {
  CacheUtil.del(MSG_CACHE_KEY + openId);
}

export default {
  getChatList,
  getRecordsByOpenId,
  cleanCache,
  setRead,
  getChatItemByOpenId,
  sendImage,
  send
}