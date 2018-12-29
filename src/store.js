import Vue from 'vue'
import Vuex from 'vuex'
import CacheUtil from '@/utils/cache-util';
Vue.use(Vuex)
import ChatApi from '@/api/chat-api';
import WsApi from './api/ws-api';
// 一个独立的Vue实例，可用于调用ElementUI的某些方法
let elVue = new Vue();

const state = {
  // 输入的搜索值
  searchText: '',
  // 当前登录用户
  user: {
    name: '客服',
    avatar: 'static/images/UserAvatar.jpg'
  },
  reachable: true,
  // 对话好友列表
  chatlist: [],
  // 得知当前选择的是哪个对话
  selectId: 1,
  // 与当前选中好友的聊天记录
  selectedMsgs: [],
  online: false,
  onlineState: "离线",
  // 输入内容的草稿
  drafts: {},
  inputContent: ""
}

const mutations = {
  // 从localStorage 中获取数据
  initData(state, chatlistData) {
    state.chatlist = chatlistData;
  },
  // 当前选中的联系人对应的聊天记录
  setSelectedMsgs(state, msg) {
    state.selectedMsgs = msg;
  },
  // 获取搜索值
  search(state, value) {
    state.searchText = value
  },
  // 得知用户当前选择的是哪个对话。便于匹配对应的对话框
  selectSession(state, value) {
    state.selectId = value;
  },
  setReachable(state, v) {
    state.reachable = v;
  },
  reachableChange(state, msg) {
    console.log("收到用户可达性变更事件", msg);
    let chatItem = state.chatlist.find(c => c.openId === msg.openId);
    if (chatItem) {
      chatItem.reachable = msg.reachable;
    }
  },
  addNewChatItem(state, item) {
    if (!state.chatlist.find(c => c.openId === item.openId)) {
      state.chatlist.unshift(item);
    }
  },
  // 给当前会话添加新消息
  addNewMsg(state, msg) {
    if (state.selectId !== msg.openId) {
      return;
    }
    if (msg.createTime && !(msg.createTime instanceof Date)) {
      if (typeof msg.createTime === "string") {
        msg.createTime = new Date(msg.createTime);
      } else if (typeof msg.createTime === "number") {
        // 微信回调的时间戳是以秒为单位的
        msg.createTime = new Date(msg.createTime * 1000);
      }
    }
    state.selectedMsgs.push(msg);
    CacheUtil.setWithTime("msgs:" + state.selectId, state.selectedMsgs);
  },
  loadMoreNewMsg(state, msgs) {
    // 将新加载的消息加到消息的头部
    state.selectedMsgs.unshift(...msgs);
  },
  updateChatItem(state, msg) {
    // 有新消息时更新列表
    let index = -1;
    let item;
    for (let i = 0; i < state.chatlist.length; i++) {
      let tmp = state.chatlist[i];
      if (tmp.openId === msg.openId) {
        index = i;
        item = tmp;
        break;
      }
    }
    if (!item) {
      return;
    }
    item.lastMsgContent = msg.content;
    if (msg.msgType !== "text") {
      item.lastMsgContent = msg.msgName;;
    }
    item.lastMsgDate = msg.createTime;
    // 如果不是当前选中的人，则未读数量加一
    if (msg.sendType === "REC" && state.selectId !== msg.openId) {
      item.unreadNum++;
    }
    state.chatlist.splice(index, 1);
    state.chatlist.unshift(item);
  },
  setOnline(state, v) {
    state.online = v;
  },
  setOnlineState(state, v) {
    state.onlineState = v;
  },
  setInputContent(state, c) {
    state.inputContent = c;
  },
  addDraft(state, draft) {
    state.drafts[draft.openId] = draft.content;
  }
}
const getters = {
  // 筛选出含有搜索值的聊天列表
  searchedChatlist(state) {
    return state.chatlist.filter(item =>
      item.displayName &&
      item.reachable == state.reachable &&
      item.displayName.includes(state.searchText));
  },
  // 通过当前选择是哪个对话匹配相应的对话
  selectedChat(state) {
    return state.chatlist.find(item => item.openId === state.selectId);
  },
  allReachable() {
    let allReachable = {};
    state.chatlist.forEach(list => {
      allReachable[list.openId] = list.reachable;
    })
    return allReachable;
  },
  unreadNum() {
    let reachable = 0;
    let unreachable = 0;
    state.chatlist.forEach(list => {
      if (list.reachable) {
        reachable += list.unreadNum;
      } else {
        unreachable += list.unreadNum;
      }
    });
    return {
      reachable,
      unreachable
    }
  }
}

const actions = {
  search: ({
    commit
  }, value) => {
    setTimeout(() => {
      commit('search', value)
    }, 100)
  },
  selectSession: ({
    commit
  }, value) => {
    commit('selectSession', value);
    if (value) {
      ChatApi.setRead(value).then(() => {
        let item = state.chatlist.find(item => item.openId === value);
        item && (item.unreadNum = 0);
      }).catch(e => elVue.$alert(e || "置为已读出错"));
    }
  },
  send: ({
    commit
  }) => commit('send'),
  setReachable: ({
    commit,
    dispatch
  }, v) => {
    commit("setReachable", v);
    if (state.chatlist.length) {
      dispatch("setDefaultSelect");
    }
  },
  setDefaultSelect({
    state,
    dispatch,
    commit
  }) {
    // 设置默认选中第一个
    let item = state.chatlist.find(item => item.reachable === state.reachable);
    if (item) {
      dispatch('selectSession', item.openId)
    } else {
      commit("setSelectedMsgs", []);
      dispatch('selectSession', "");
    }
  },
  initData: ({
    commit,
    dispatch
  }) => {
    WsApi.connect(() => {
      commit("setOnlineState", "连接中...");
    }, () => {
      elVue.$notify({
        title: '成功',
        message: '服务器连接成功',
        type: 'success'
      });
      ChatApi.getChatList().then(list => {
        commit('initData', list);
        elVue.$nextTick(() => {
          dispatch("setDefaultSelect");
        });
      });
      commit("setOnline", true);
      commit("setOnlineState", "在线");
    }, () => {
      elVue.$notify({
        title: '警告',
        message: '与服务器连接断开',
        type: 'warning'
      });
      commit("setOnline", false);
      commit("setOnlineState", "离线");
    });
    WsApi.subNewMsg((msg) => dispatch("handleNewMsg", msg));
    WsApi.subReachableChange((msg) => commit("reachableChange", msg));
  },
  // 处理收到websocket推送的新消息
  handleNewMsg({
    state,
    commit,
    dispatch
  }, msg) {
    if (!msg || !msg.msgId) {
      console.log("无效消息：", msg);
      return;
    }
    console.log("收到新消息：", msg);
    if (state.selectId === msg.openId) {
      // 新消息发送人是当前正在对话的人
      // 添加新记录并更新聊天列表项
      commit("addNewMsg", msg);
      commit("updateChatItem", msg);
      ChatApi.setRead(msg.openId);
    } else {
      // 接收到的消息对应的人
      let chatItem = state.chatlist.find(c => c.openId === msg.openId);
      // 提示的消息内容
      let content = msg.content;
      if (msg.msgType !== "text") {
        content = `[${msg.msgName}]`;
      }
      if (chatItem) {
        // 该用户已在聊天列表中
        // 更新列表
        commit("updateChatItem", msg);
        // 如果是收到的消息则通知
        msg.sendType === "REC" && dispatch("notifyNewMsg", {
          displayName: chatItem.displayName,
          openId: msg.openId,
          content: content
        })
      } else {
        console.debug("不在chatlist中, openId: " + msg.openId, state.chatlist);
        // 该用户不在聊天列表中
        // 获取这个用户的聊天记录并添加到列表中
        ChatApi.getChatItemByOpenId(msg.openId)
          .then((item) => {
            // 添加用户并通知
            commit("addNewChatItem", item);
            // 如果是收到的消息则通知
            msg.sendType === "REC" && dispatch("notifyNewMsg", {
              displayName: item.displayName,
              openId: msg.openId,
              content: content
            })
          })
          .catch(e => {
            console.log('处理新消息查询用户信息出错', e);
            elVue.$alert('处理新消息查询用户信息出错')
          });
      }
    }
  },
  notifyNewMsg({
    dispatch
  }, item) {
    // 先清除缓存，以便加载最新的
    ChatApi.cleanCache(item.openId);
    if (!Notification) {
      // 是接收到的，而且不是当前正在聊天的
      elVue.$notify({
        title: "新消息：" + item.displayName,
        message: item.content,
        position: 'bottom-right',
        onClick() {
          dispatch("selectSession", item.openId);
        }
      });
      return;
    }
    Notification.requestPermission(function(p) {
      if (p === "granted") {
        let title = "微客服：" + item.displayName;
        let notify = new Notification(title, {
          body: item.content,
          tag: item.openId
        });
        notify.onclick = function() {
          //可直接打开通知notification相关联的tab窗口
          window.focus();
          dispatch("selectSession", item.openId);
        }
        setTimeout(() => {
          notify.close();
        }, 10000);
      } else {
        // 是接收到的，而且不是当前正在聊天的
        elVue.$notify({
          title: "新消息：" + item.displayName,
          message: item.content,
          position: 'bottom-right',
          onClick() {
            dispatch("selectSession", item.openId);
          }
        });
      }
    })
  },
  initChatHistory({
    commit,
  }, id) {
    if (!id) {
      return;
    }
    ChatApi.getRecordsByOpenId(id).then(msgs => {
      commit("setSelectedMsgs", msgs);
    }).catch(e => {
      console.log(e);
    });
  }
}
const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})

store.watch(
  (state) => state.selectId,
  (val, old) => {
    store.commit("addDraft", {
      openId: old,
      content: store.state.inputContent
    });
    let draft = store.state.drafts[val];
    store.commit("setInputContent", draft);
    store.dispatch("initChatHistory", val);
  }, {
    deep: true
  }
)
export default store;