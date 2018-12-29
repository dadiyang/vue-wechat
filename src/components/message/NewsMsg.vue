<template>
  <div class="news-msg pointer"
       @click="open">
    <p>图文消息(点击打开)</p>
    <el-card class="box-card"
             :body-style="{padding: '10px'}">
      <div slot="header"
           class="clearfix">
        <span>{{msg.title}}</span>
      </div>
      <img style="max-width: 300px; max-height: 300px"
           @click="visible = true"
           :src="msg.picUrl"></img>
      <div class="text item">
        {{ msg.content }}
      </div>
    </el-card>
  </div>
</template>

<script>
/**
 * 链接类型消息显示
 */
export default {
  name: "NewsMsg",
  props: {
    msg: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    open() {
      window.open(this.msg.srcUrl);
    }
  }
};
</script>

<style scoped>
</style>
<style>
.news-msg .el-card__header {
  padding: 5px 10px;
}
</style>

