<template>
  <div class="voice-msg pointer"
       @click="switchPlay">
    <p>语音消息(点击播放)</p>
    <audio ref="audio"
           v-if="playing"
           @ended="stop"
           :src="msg.srcUrl"
           v-show="false"></audio>
    <div>
      <breathing-lamp color="green"
                      width="200px"
                      v-if="playing"
                      :text="tip"
                      height="20px"></breathing-lamp>
    </div>
    <div>
      <i class="el-icon-service"
         v-if="!playing"></i>
    </div>
    <div class="recognition"
         v-if="msg.content">
      <hr>
      <div>语音识别:</div>
      <div>{{msg.content}}</div>
    </div>
  </div>
</template>

<script>
const BreathingLamp = () => import("../common/BreathingLamp");
export default {
  name: "VoiceMsg",
  components: {
    BreathingLamp
  },
  props: {
    msg: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      playing: false,
      tip: "播放中",
      interval: null
    };
  },
  methods: {
    stop() {
      this.playing = false;
      let audio = this.$refs["audio"];
      if (audio) {
        audio.pause();
        this.interval && clearInterval(this.interval);
      }
    },
    switchPlay() {
      if (this.playing) {
        this.stop();
      } else {
        this.play();
      }
    },
    play() {
      this.playing = true;
      this.$nextTick(() => {
        let audio = this.$refs["audio"];
        if (audio) {
          audio.play();
          let vue = this;
          this.interval = setInterval(() => {
            vue.tip = `播放中: ${this.format(audio.currentTime)}/${this.format(
              audio.duration
            )}`;
          }, 1000);
        }
      });
    },
    format(sec) {
      if (typeof sec !== "number") {
        return sec;
      }
      sec = parseInt(sec);
      if (sec < 60) {
        return "00:" + sec;
      } else {
        return parseInt(sec / 60) + ":" + (sec % 60);
      }
    }
  }
};
</script>

<style scoped>
.voice-msg .el-icon-service {
  font-size: 18px;
  cursor: pointer;
}
</style>
