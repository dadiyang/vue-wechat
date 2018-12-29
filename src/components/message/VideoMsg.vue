<template>
  <div class="video-msg">
    <div @click="play"
         class="pointer">
      <p>视频消息(点击播放)</p>
      <i class="el-icon-caret-right"
         style="font-size: 18px"
         v-if="!msg.picUrl || !msg.picUrl.startsWith('http')"></i>
      <img style="max-wdith: 300px; max-height: 300px"
           v-if="msg.picUrl && msg.picUrl.startsWith('http')"
           :src="msg.picUrl"></img>
    </div>
    <el-dialog title="视频播放"
               :visible="playing"
               width="60%"
               :before-close="stop">
      <div style="text-align: center">
        <video controls
               autoplay
               v-if="playing"
               :src="msg.srcUrl"></video>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="stop">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 视频类型消息显示
 */
export default {
  name: "VideoMsg",
  props: {
    msg: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      playing: false
    };
  },
  methods: {
    play() {
      this.playing = true;
    },
    stop() {
      this.playing = false;
    }
  }
};
</script>

<style scoped>
.video-msg .el-icon-service {
  font-size: 18px;
  cursor: pointer;
}
</style>
