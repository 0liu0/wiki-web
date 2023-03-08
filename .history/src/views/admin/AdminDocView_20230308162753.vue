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
      <a-button type="primary" @click="add"> 新增 </a-button>
    </a-space>
    <a-table
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="level1"
      :loading="loading"
      @change="handleTableChange"
      :pagination="false"
    >
      <template #cover="{ text: cover }">
        <img class="cover" v-if="cover" :src="cover" alt="avatar" />
      </template>
      <template v-slot:action="{ text, record }">
        <a-space size="small">
          <a-button type="primary" @click="edit(record)"> 编辑 </a-button>
          <a-button type="danger">
            <a-popconfirm
              title="确认删除这本书吗?"
              ok-text="是的"
              cancel-text="我再想想"
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
    title="文档表单"
    v-model:visible="modalVisible"
    :confirm-loading="modalLoading"
    @ok="handleOk"
    :mask="true"
  >
    <a-form :model="doc" :labelCol="{ span: 6 }">
      <a-form-item label="名称">
        <a-input v-model:value="doc.name" />
      </a-form-item>
      <a-space direction="vertical" style="width: 100%">
        <a-form-item label="名称">
    <a-tree-select
      v-model:value="value"
      show-search
      style="width: 100%"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      placeholder="Please select"
      allow-clear
      tree-default-expand-all
      :tree-data="treeData"
    >
      <template #suffixIcon><SmileOutlined /></template>
    </a-tree-select>
      <a-form-item label="父文档">
        <a-select v-model:value="doc.parent" ref="select">
          <a-select-option value="0"> 无 </a-select-option>
          <a-select-option
            v-for="(c, index) in level1"
            :key="c.id"
            :value="c.id"
            :disabled="doc.id === c.id"
          >
          {{c.name}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="顺序">
        <a-input v-model:value="doc.sort" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { Tool } from "@/util/tool";
export default defineComponent({
  name: "AdminDocView",
  setup() {
    const param = ref();
    param.value = {};
    const docs = ref();
    const loading = ref(false);
    const columns = [
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "父文档",
        key: "parent",
        dataIndex: "parent",
      },
      {
        title: "顺序",
        dataIndex: "sort",
      },
      {
        title: "Action",
        key: "action",
        slots: { customRender: "action" },
      },
    ];
    // 数据查询
    const level1 = ref();
    const handleQuery = () => {
      loading.value = true;
      axios.get("/doc/list").then((resp) => {
        loading.value = false;
        const data = resp.data;
        if (data.success) {
          docs.value = data.content.list;
          level1.value = [];
          level1.value = Tool.array2Tree(docs.value, 0);
        } else {
          message.error(data.message);
        }
      });
    };

    // 控制表单的显现
    const modalLoading = ref(false);
    const modalVisible = ref(false);
    const doc = ref({});
    const handleOk = () => {
      modalVisible.value = true;
      modalLoading.value = true;
      axios.post("/doc/save", doc.value).then((resp) => {
        const data = resp.data;
        if (data.success) {
          modalVisible.value = false;
          modalLoading.value = false;
          message.success("操作成功！");
          // 重新加载列表
          handleQuery();
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
      doc.value = {};
    };
    // 编辑表单
    const edit = (record: any) => {
      modalVisible.value = true;
      doc.value = Tool.copy(record);
    };
    // 删除提示框
    const confirm = (id: any) => {
      axios.delete("/doc/delete/" + id).then((resp) => {
        const data = resp.data;
        if (data.success) {
          // 重新加载列表
          handleQuery();
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

    onMounted(() => {
      handleQuery();
    });
    return {
      columns,
      // docs,
      level1,
      loading,
      param,
      handleQuery,
      edit,
      add,
      cancel,
      confirm,
      modalVisible,
      modalLoading,
      handleOk,
      doc,
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