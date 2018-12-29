<!-- 消息框 -->
<template>
  <div class="message">
    <header class="header">
      <el-row :gutter="20">
        <el-col :span="18">
          <div class="friendname">{{selectedChat && selectedChat.displayName || "_"}}</div>
        </el-col>
        <el-col :span="6"
                style="text-align: right">
          <el-row :gutter="0">
            <el-col :span="1"
                    :offset="2">
              <breathing-lamp :color="online?'green':'gray'"></breathing-lamp>
            </el-col>
            <el-col :span="16"
                    :offset="5">
              <div class="friendname"
                   style="text-align:left">{{onlineState}}</div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

    </header>
    <div class="message-wrapper"
         ref="list">
      <ul class="message-ul"
          v-if="selectedChat">
        <li v-for="item in selectedMsgs"
            :key="item.msgId"
            class="message-item">
          <div class="time"><span>{{item | time}}</span></div>
          <div class="main"
               v-if="!item.isEvent"
               :class="{ self: isSelf(item.sendType) }">
            <img class="avatar"
                 width="36"
                 height="36"
                 :class="{gray: !allReachable[item.openId] && !isSelf(item.sendType)}"
                 :src="isSelf(item.sendType) ? user.avatar : (selectedChat.avatar || 'static/images/defaultAvatar.jpeg')" />
            <div class="content">
              <div class="text"
                   v-if="item.msgType === 'text'"
                   v-html="format(item)"></div>
              <image-msg v-if="item.msgType === 'image'"
                         :msg="item"></image-msg>
              <voice-msg :msg="item"
                         v-if="item.msgType === 'voice'"></voice-msg>
              <video-msg :msg="item"
                         v-if="item.msgType === 'video' || item.msgType === 'shortvideo'"></video-msg>
              <link-msg :msg="item"
                        v-if="item.msgType === 'link'"></link-msg>
              <location-msg :msg="item"
                            v-if="item.msgType === 'location'"></location-msg>
              <news-msg :msg="item"
                        v-if="item.msgType === 'news'"></news-msg>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
import { replaceEmoji } from "../../utils/emoji-util.js";
const BreathingLamp = () => import("../common/BreathingLamp");
const VoiceMsg = () => import("./VoiceMsg");
const VideoMsg = () => import("./VideoMsg");
const ImageMsg = () => import("./ImageMsg");
const LinkMsg = () => import("./LinkMsg");
const LocationMsg = () => import("./LocationMsg");
const NewsMsg = () => import("./NewsMsg");
import FormatUtil from "../../utils/format-util.js";
const REACHABLE_SEC = 48 * 60 * 60;
import ChatApi from "@/api/chat-api";
export default {
  name: "Message",
  components: {
    BreathingLamp,
    VoiceMsg,
    VideoMsg,
    ImageMsg,
    LinkMsg,
    LocationMsg,
    NewsMsg
  },
  data() {
    return { loading: false };
  },
  mounted() {
    this.scrollUp();
    // 通过$refs获取dom元素
    let box = this.$refs.list; // 监听这个dom的scroll事件
    box.addEventListener(
      "scroll",
      () => {
        //可滚动容器超出当前窗口显示范围的高度
        if (box.scrollTop < 10) {
          //加载更多操作
          if (!this.loading) {
            this.loadMore(box);
          }
        }
      },
      false
    );
  },
  methods: {
    ...mapMutations(["loadMoreNewMsg"]),
    loadMore(box) {
      let first = this.selectedMsgs[0];
      let firstCreateTime = first && first.createTime;
      this.loading = true;
      ChatApi.getRecordsByOpenId(this.selectId, firstCreateTime)
        .then(rs => {
          if (rs && rs.length) {
            // 保存加载前的高度
            let scrollHeight = box.scrollHeight;
            this.loadMoreNewMsg(rs);
            this.$nextTick(() => {
              // 加载完回到之前滚去的位置上
              box.scrollTop = box.scrollHeight - scrollHeight;
            });
          }
        })
        .catch(e => {
          console.log("加载更多聊天记录失败", e);
          this.$alert("加载更多聊天记录失败");
        })
        .finally(() => (this.loading = false));
      console.log("loadmore");
    },
    isSelf(sendType) {
      return (
        sendType &&
        (sendType.toUpperCase() === "SEND" ||
          sendType.toUpperCase() === "AUTO_REPLY")
      );
    },
    format(msg) {
      msg.content = msg.content.replace(/\n/g, "<br>");
      msg.content = msg.content.replace(/ /g, "&nbsp;");
      return replaceEmoji(msg.content);
    },
    scrollUp() {
      let vue = this;
      setTimeout(() => {
        vue.$refs.list.scrollTop = vue.$refs.list.scrollHeight;
      }, 500);
    }
  },
  computed: {
    ...mapGetters(["selectedChat", "allReachable"]),
    ...mapState(["user", "selectedMsgs", "online", "onlineState", "selectId"])
  },
  watch: {
    // 发送信息后,让信息滚动到最下面
    selectedMsgs: {
      handler() {
        if (!this.loading) {
          this.scrollUp();
        }
      },
      deep: true
    }
  },
  filters: {
    time(item) {
      if (!item) {
        return "";
      }
      let date;
      if (item.createTime instanceof Date) {
        date = item.createTime;
      } else if (typeof item.createTime === "number") {
        // 微信回调的时间戳是以秒为单位的
        date = new Date(item.createTime * 1000);
      } else if (typeof item.createTime === "string") {
        date = new Date(item.createTime);
      }
      if (!item.isEvent) {
        return FormatUtil.format(date);
      }
      // 如果是事件则显示为 时间+事件名
      return `${FormatUtil.format(date)} ${item.msgName}`;
    }
  }
};
</script>

<style lang="stylus" scoped>
.message {
  height: 450px;

  .header {
    height: 42px;
    padding: 15px 0 0 30px;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;

    .friendname {
      font-size: 18px;
    }
  }

  .message-wrapper {
    height: 410px;
    padding: 0px 15px;
    box-sizing: border-box;
    overflow-y: auto;
    border-bottom: 1px solid #e7e7e7;

    .message-ul {
      margin-bottom: 15px;
    }

    .time {
      width: 100%;
      font-size: 12px;
      margin: 7px auto;
      text-align: center;

      span {
        display: inline-block;
        padding: 4px 6px;
        color: #fff;
        border-radius: 3px;
        background-color: #dcdcdc;
      }
    }

    .main {
      .avatar {
        float: left;
        margin-left: 15px;
        border-radius: 3px;
      }

      .content {
        display: inline-block;
        margin-left: 10px;
        position: relative;
        padding: 6px 10px;
        max-width: 330px;
        min-height: 36px;
        line-height: 24px;
        box-sizing: border-box;
        font-size: 14px;
        text-align: left;
        word-break: break-all;
        background-color: #fafafa;
        border-radius: 4px;

        &:before {
          content: ' ';
          position: absolute;
          top: 12px;
          right: 100%;
          border: 6px solid transparent;
          border-right-color: #fafafa;
        }
      }
    }

    .self {
      text-align: right;

      .avatar {
        float: right;
        margin: 0 15px;
      }

      .content {
        background-color: #b2e281;

        &:before {
          right: -12px;
          vertical-align: middle;
          border-right-color: transparent;
          border-left-color: #b2e281;
        }
      }
    }
  }
}
</style>
