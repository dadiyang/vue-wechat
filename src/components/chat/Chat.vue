<template>
  <div class="content"
       key="chat">
    <el-row :gutter="0">
      <el-col :span="8">
        <div class="msglist">
          <search></search>
          <chatlist></chatlist>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="chatbox">
          <message></message>
          <v-text></v-text>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const Search = () => import("@/components/search/Search");
const Chatlist = () => import("@/components/chatlist/ChatList");
const Message = () => import("@/components/message/Message");
const VText = () => import("@/components/text/VText");
import { mapActions } from "vuex";
/**
 * 聊天界面
 * @prop reachable 筛选用户是否可达
 */
export default {
  name: "Chat",
  props: { reachable: { type: Boolean, required: false, default: true } },
  components: {
    Search,
    Chatlist,
    Message,
    VText
  },
  mounted() {
    this.setReachable(this.reachable);
  },
  methods: {
    ...mapActions(["setReachable"])
  },
  watch: {
    reachable(v) {
      this.setReachable(v);
    }
  }
};
</script>

<style lang="stylus" scoped>
.content {
  width: 100%;

  .msglist {
    background: rgb(230, 230, 230);
  }
}
</style>
