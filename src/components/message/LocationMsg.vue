<template>
  <div class="link-msg"
       @click="open">
    <p>地理位置消息</p>
    <el-card class="box-card"
             :body-style="{padding: '10px'}">
      <div slot="header"
           class="clearfix">
        <span>{{msg.title}}</span>
      </div>
      <div class="text item">
        纬度: {{ msg.locationX }}<br>
        经度: {{ msg.locationY }}<br>
      </div>
    </el-card>
  </div>
</template>

<script>
/**
 * 地理位置类型消息显示
 */
export default {
  name: "LocationMsg",
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
      // todo
      打开地图;
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

