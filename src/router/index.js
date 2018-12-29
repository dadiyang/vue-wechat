import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Chat = () => import('@/components/chat/Chat');
const router = new Router({
  // 共三个页面： 聊天页面，好友页面，个人简历分别对应一下路由
  routes: [{
      path: "/",
      redirect: {
        name: "Chat"
      }
    }, {
      path: '/chat',
      name: "Chat",
      component: Chat,
      props: {
        reachable: true
      }
    },
    {
      path: '/unreachable',
      component: Chat,
      props: {
        reachable: false
      }
    }
  ],
  linkActiveClass: 'active'
})
router.push({
  path: '/chat'
});
export default router;