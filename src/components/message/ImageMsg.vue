<template>
  <div class="image-msg pointer">
    <p>图片消息(点击预览)</p>
    <img style="max-width: 300px; max-height: 300px"
         @click="visible = true"
         :src="msg.picUrl || msg.srcUrl"></img>
    <image-preview :pic-url="msg.picUrl || msg.srcUrl"
                   :visible="visible"
                   v-if="msg.picUrl || msg.srcUrl"
                   @close="visible = false">
      <span slot="footer">
        <div style="margin-top: 30px;">
          <el-button @click="visible = false">关闭</el-button>
        </div>
      </span>
    </image-preview>
  </div>
</template>

<script>
const ImagePreview = () => import("../common/ImagePreview");
/**
 * 图片类型消息显示
 */
export default {
  name: "VideoMsg",
  components: {
    ImagePreview
  },
  props: {
    msg: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {}
};
</script>

<style scoped>
.audio-msg .el-icon-service {
  font-size: 18px;
  cursor: pointer;
}
</style>
