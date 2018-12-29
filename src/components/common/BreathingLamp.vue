<template>
  <div :class="color"
       :style="{width: width, height: height}"
       class="breathing-lamp">
    {{text}}
  </div>
</template>

<script>
export default {
  name: "BreathingLamp",
  props: {
    color: {
      type: String,
      required: false,
      default: "green"
    },
    width: {
      type: String,
      required: false,
      default: "10px"
    },
    height: {
      type: String,
      required: false,
      default: "10px"
    },
    text: {
      type: String,
      required: false,
      default: "" 
    }
  }
};
</script>

<style scoped>
.green {
  background-image: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#2bd47d),
    to(#2bd47d)
  );
  border: 1px solid #2bd47d;
}

.gray {
  background-image: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#000),
    to(#aaa)
  );
  border: 1px solid #aaa;
}

.breathing-lamp {
  position: relative;
  margin: 3px 0 0 0;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  text-align: center;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-name: breathe;
  -webkit-animation-duration: 1500ms;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
  animation-timing-function: ease-in-out;
  animation-name: breathe;
  animation-duration: 1500ms;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes breathe {
  0% {
    opacity: 0.2;
    box-shadow: 0 1px 2px rgba(255, 255, 255, 0.1);
  }
  100% {
    opacity: 1;
    border: 1px solid white;
    box-shadow: 0 1px 30px white;
  }
}
</style>