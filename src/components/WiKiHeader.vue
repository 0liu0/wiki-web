<template>
  <a-layout-header class="header">
    <div class="logo" />
    <div class="login" v-if="!user.id">
      <a-button type="primary" @click="login">点击登录 </a-button>
    </div>
    <div class="layout" v-if="user.id">
      <a-popconfirm
        title="确认退出?"
        ok-text="是"
        cancel-text="否"
        @confirm="confirm()"
        @cancel="cancel"
      >
        退出登录
      </a-popconfirm>
    </div>
    <div class="logined" v-if="user.id">欢迎:{{ user.name }}</div>
    <a-modal
      title="登录"
      v-model:visible="modalVisible"
      :confirm-loading="modalLoading"
      @ok="handleOk"
      :mask="true"
    >
      <a-form :model="loginUser" :labelCol="{ span: 6 }">
        <a-form-item label="登录名">
          <a-input v-model:value="loginUser.loginName" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input v-model:value="loginUser.password" type="password" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-menu
      v-model:selectedKeys="selectedKeys1"
      theme="dark"
      mode="horizontal"
      :style="{ lineHeight: '64px' }"
    >
      <a-menu-item key="1"><router-link to="/">首页</router-link></a-menu-item>
      <a-menu-item key="5"
        ><router-link to="/about">关于我们</router-link></a-menu-item
      >
      <a-menu-item key="2" :style="user.id ? {} : { display: 'none' }"
        ><router-link to="/admin/user">用户管理</router-link></a-menu-item
      >
      <a-menu-item key="3" :style="user.id ? {} : { display: 'none' }"
        ><router-link to="/admin/ebook">电子书管理</router-link></a-menu-item
      >
      <a-menu-item key="4" :style="user.id ? {} : { display: 'none' }"
        ><router-link to="/admin/category">分类管理</router-link></a-menu-item
      >
    </a-menu>
  </a-layout-header>
</template>

<script lang="ts">
import store from "@/store";
import { message } from "ant-design-vue";
import axios from "axios";
import { computed, defineComponent, ref } from "vue";
declare let hexMd5: any;
declare let KEY: any;
export default defineComponent({
  name: "WiKiHeader",
  setup() {
    const loginUser = ref({
      loginName: "tester",
      password: "123lzc",
    });

    // 登录操作**********************************
    let modalLoading = ref(false);
    let modalVisible = ref(false);
    const login = () => {
      console.log("我被点了");
      modalVisible.value = true;
    };

    // 登录请求
    let user: any = computed(() => store.state.user); // 计算属性检测store里面的值如果有更改就赋值给user
    // user.value = {};
    console.log("userbefore", user);
    const handleOk = () => {
      loginUser.value.password = hexMd5(loginUser.value.password + KEY); // 加密密码
      axios.post("/user/login", loginUser.value).then((resp) => {
        const data = resp.data;
        if (data.success) {
          // 登陆成功
          // 处理一些逻辑，例如写入token
          store.commit("setUser", data.content);
          modalLoading.value = false;
          modalVisible.value = false;
        } else {
          // 登录失败
          message.error(data.message);
        }
      });
    };

    // 退出登录操作*******************************
    const confirm = () => {
      axios.get(`/user/layout/${user.value.token}`).then((resp) => {
        const data = resp.data;
        if (data.success) {
          store.commit("setUser", {}); // 从本地上删除user上次登录的信息
          message.info(data.message);
        }
      });
    };

    return {
      loginUser,
      modalLoading,
      modalVisible,
      user,

      login,
      handleOk,
      confirm,
    };
  },
});
</script>

<style scoped>
.login {
  float: right;
}
.logined {
  float: right;
  color: white;
}
.layout {
  margin-left: 10px;
  float: right;
  color: rgb(218, 138, 138);
  cursor: pointer;
}
.layout:hover {
  color: white;
}
</style>