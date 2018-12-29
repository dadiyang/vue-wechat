<!-- 最左边的选择框 -->
<template>
  <div class="side-bar">
    <div class="navbar"
         @click="clearSearch">
      <el-badge :value="unreadNum.reachable"
                :hidden="!unreadNum.reachable"
                :max="99"
                class="item pointer">
        <router-link to="/chat"
                     class="icon iconfont icon-msg">
        </router-link>
      </el-badge>

      <router-link to="/unreachable"
                   class="unreachable-link">
        <el-badge :value="unreadNum.unreachable"
                  :hidden="!unreadNum.unreachable"
                  :max="99"
                  class="item">
          <img src="@/assets/images/unreachable-icon.png"
               :class="{gray: current !== '/unreachable'}"
               class="icon iconfont unreachable-icon">
          </img>
        </el-badge>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "SideBar",
  methods: {
    clearSearch() {
      this.$store.dispatch("search", "");
    }
  },
  computed: {
    ...mapState(["user"]),
    ...mapGetters(["unreadNum"]),
    current() {
      return this.$route.path;
    }
  }
};
</script>

<style lang="stylus" scoped>
.side-bar {
  position: relative;
  width: 100%;
  height: 100%;

  .avatar {
    width: 36px;
    height: 36px;
    margin: 20px 12px 0 12px;
    border-radius: 2px;
  }

  .navbar {
    width: 100%;
    text-align: center;
    padding: 28px 28px 0 0;
  }

  .icon {
    display: inline-block;
    font-size: 28px;
    margin: 0 0 28px 0;
    padding: 0 8px;
    box-sizing: border-box;
    color: rgb(173, 174, 175);
    opacity: 0.8;
    cursor: pointer;

    &.active {
      color: rgb(0, 220, 65);
    }

    &:hover {
      opacity: 1;
    }
  }

  .unreachable-icon {
    margin: 0px;
    width: 28px;
    padding: 0px;
  }
}

footer {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
}
</style>

<style>
.side-bar .unreachable-link .el-badge__content.is-fixed {
  right: 5px;
}
</style>
