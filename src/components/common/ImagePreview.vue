<template>
  <el-dialog :visible="visible"
             class="image-preview"
             :before-close="close"
             width="60%">
    <div style="text-align:center;">
      <div class="image-container">
        <img style="max-width: 800px;"
             :src="picUrl"
             alt="图片预览">
      </div>
      <span slot="footer"
            class="dialog-footer">
        <slot name="footer"></slot>
      </span>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "ImagePreview",
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    picUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.image-preview .image-container {
  min-height: 300px;
  max-height: 480px;
  overflow-y: auto;
  overflow-x: auto;
}
</style>
