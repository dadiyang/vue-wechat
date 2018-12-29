<template>
  <div class="link-msg pointer"
       @click="open">
    <p>链接消息(点击打开)</p>
    <el-card class="box-card"
             :body-style="{padding: '10px'}">
      <div slot="header"
           class="clearfix">
        <span>{{msg.title}}</span>
      </div>
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
  name: "LinkMsg",
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
.link-msg .el-card__header {
  padding: 5px 10px;
}
</style>

