<template>
  <a-layout-content
    :style="{
      background: '#fff',
      padding: '24px',
      margin: 0,
      minHeight: '280px',
    }"
  >
    <a-space :size="small">
      <a-input-search
        v-model:value="param.name"
        placeholder="input search text"
        enter-button
        @search="handleQuery({ page: 1, size: pagination.pageSize })"
      />
      <a-button type="primary" @click="add"> 新增 </a-button>
    </a-space>
    <a-table
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="users"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template v-slot:action="{ text, record }">
        <a-space size="small">
          <a-button type="primary" @click="resetPassword(record)">
            重置密码
          </a-button>
          <a-button type="primary" @click="edit(record)"> 编辑 </a-button>
          <a-button type="danger">
            <a-popconfirm
              title="删除后不可恢复，确认删除?"
              ok-text="是"
              cancel-text="否"
              @confirm="confirm(record.id)"
              @cancel="cancel"
            >
              <a href="#">删除</a>
            </a-popconfirm>
          </a-button>
        </a-space>
      </template>
    </a-table>
  </a-layout-content>
  <a-modal
    title="用户表单"
    v-model:visible="modalVisible"
    :confirm-loading="modalLoading"
    @ok="handleOk"
    :mask="true"
  >
    <a-form :model="user" :labelCol="{ span: 6 }">
      <a-form-item label="登录名">
        <a-input v-model:value="user.loginName" :disabled="user.id" />
      </a-form-item>
      <a-form-item label="昵称">
        <a-input v-model:value="user.name" />
      </a-form-item>
      <a-form-item label="密码" v-show="!user.id">
        <a-input v-model:value="user.password" type="password" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    title="重置密码"
    v-model:visible="resetModalVisible"
    :confirm-loading="resetModalLoading"
    @ok="resetHandleOk"
    :mask="true"
  >
    <a-form :model="user" :labelCol="{ span: 6 }">
      <a-form-item label="新密码">
        <a-input v-model:value="user.password" type="text" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import type { CascaderProps } from "ant-design-vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { Tool } from "@/util/tool";
declare let hexMd5: any;
declare let KEY: any;
export default defineComponent({
  name: "AdminEBookView",
  setup() {
    const selectInfo = ref();
    const param = ref();
    param.value = {};
    const users = ref();
    const pagination = ref({
      current: 1,
      pageSize: 4,
      total: 0,
    });
    const loading = ref(false);
    const columns = [
      {
        title: "登陆名",
        dataIndex: "loginName",
      },
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "密码",
        dataIndex: "password",
      },
      {
        title: "Action",
        key: "action",
        slots: { customRender: "action" },
      },
    ];
    // 数据查询
    const handleQuery = (params: any) => {
      loading.value = true;
      axios
        .get("/user/list", {
          params: {
            page: params.page,
            size: params.size,
            loginName: param.value.name,
          },
        })
        .then((resp) => {
          loading.value = false;
          const data = resp.data;
          if (data.success) {
            users.value = data.content.list;
            // 重置分页按钮
            pagination.value.current = params.page;
            pagination.value.total = data.content.total;
          } else {
            message.error(data.message);
            pagination.value.current = params.page;
            pagination.value.total = data.content.total;
          }
        });
    };

    // 控制表单的显现
    const modalLoading = ref(false);
    const modalVisible = ref(false);
    const user = ref();
    const handleOk = () => {
      modalVisible.value = true;
      modalLoading.value = true;
      user.value.password = hexMd5(user.value.password + KEY);
      axios.post("/user/save", user.value).then((resp) => {
        const data = resp.data;
        if (data.success) {
          modalVisible.value = false;
          modalLoading.value = false;
          message.success("操作成功！");
          // 重新加载列表
          handleQuery({
            page: pagination.value.current,
            size: pagination.value.pageSize,
          });
        } else {
          modalVisible.value = false;
          modalLoading.value = false;
          message.error(data.message);
        }
      });
    };
    // 新增接口
    const add = () => {
      modalVisible.value = true;
      user.value = {};
    };
    // 编辑表单
    const edit = (record: any) => {
      modalVisible.value = true;
      user.value = Tool.copy(record);
    };
    // 删除提示框
    const confirm = (id: any) => {
      axios.delete("/user/delete/" + id).then((resp) => {
        const data = resp.data;
        if (data.success) {
          // 重新加载列表
          handleQuery({
            page: pagination.value.current,
            size: pagination.value.pageSize,
          });
          message.success("删除成功！");
        } else {
          message.info("请稍后再试");
        }
      });
    };

    const cancel = (e: MouseEvent) => {
      console.log(e);
      message.info("已取消");
    };

    // 表格点击页码时触发
    const handleTableChange = (pagination: any) => {
      console.log("看看自带的分页参数都有啥:" + pagination);
      handleQuery({
        page: pagination.current,
        size: pagination.pageSize,
      });
    };

    onMounted(() => {
      handleQuery({
        page: 1,
        size: pagination.value.pageSize,
      });
    });
    // 验证密码合不合格
    function validatePassword(password: any) {
      // 正则表达式匹配
      var regExp = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,32}$/;
      return regExp.test(password);
    }

    // 重置密码
    let resetModalVisible = ref(false);
    let resetModalLoading = ref(false);
    const resetPassword = (info: any) => {
      resetModalVisible.value = true;
      user.value = Tool.copy(info);
      user.value.password = "";
    };
    const resetHandleOk = () => {
      resetModalVisible.value = true;
      resetModalLoading.value = true;
      if (!validatePassword(user.value.password)) {
        message.error("【密码】至少包含 数字和英文，长度6-32");
        resetModalLoading.value = false;
        return;
      }
      user.value.password = hexMd5(user.value.password + KEY);
      axios.post("/user/reset-pwd", user.value).then((resp) => {
        const data = resp.data;
        if (data.success) {
          resetModalVisible.value = false;
          resetModalLoading.value = false;
          message.success("操作成功！");
          // 重新加载列表
          handleQuery({
            page: pagination.value.current,
            size: pagination.value.pageSize,
          });
        } else {
          resetModalVisible.value = false;
          resetModalLoading.value = false;
          message.error(data.message);
        }
      });
    };
    return {
      selectInfo,
      columns,
      users,
      pagination,
      loading,
      param,
      resetModalVisible,
      resetModalLoading,
      handleTableChange,
      resetPassword,
      edit,
      add,
      cancel,
      confirm,
      resetHandleOk,
      modalVisible,
      modalLoading,
      handleOk,
      handleQuery,
      user,
    };
  },
});
</script>

<style scoped>
.cover {
  width: 50px;
  height: 50px;
  border-radius: 8%;
  line-height: 50px;
  margin: 5px 0;
}
</style>