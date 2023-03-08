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
              title="确认删除吗?这个结点及其子节点都会被删除哦"
              ok-text="确认删除"
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
    <div id="mycontent"></div>
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
      <a-form-item label="父文档">
        <a-tree-select
          v-model:value="doc.parent"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="Please select"
          allow-clear
          tree-default-expand-all
          :tree-data="treeSelectData"
          :fieldNames="{ label: 'name', value: 'id' }"
        >
          <template #suffixIcon><SmileOutlined /></template>
        </a-tree-select>
      </a-form-item>
      <a-form-item label="顺序">
        <a-input v-model:value="doc.sort" />
      </a-form-item>
      <a-form-item label="内容"> </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { SmileOutlined } from "@ant-design/icons-vue";
import { Tool } from "@/util/tool";
import { useRoute } from "vue-router";
import E from "wangeditor";
export default defineComponent({
  name: "AdminDocView",
  components: {
    SmileOutlined,
  },
  setup() {
    const route = useRoute(); // 得到上一个界面传来的id
    const id = route.query.ebookId;
    const param = ref();
    param.value = {};
    const docs = ref();
    const loading = ref(false);
    const treeSelectData = ref();
    treeSelectData.value = [];
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
    onMounted(() => {
      handleQuery();
      editor.create();
    });
    // 数据查询
    const level1 = ref();
    const handleQuery = () => {
      loading.value = true;
      axios.get("/doc/list").then((resp) => {
        loading.value = false;
        const data = resp.data;
        console.log(resp);
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
    const doc = ref();
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
    /**
     * 将某节点及其子孙节点全部置为disabled
     */
    const setDisable = (treeSelectData: any, id: any) => {
      // console.log(treeSelectData, id);
      // 遍历数组，即遍历某一层节点
      for (let i = 0; i < treeSelectData.length; i++) {
        const node = treeSelectData[i];
        if (node.id === id) {
          // 如果当前节点就是目标节点
          console.log("disabled", node);
          // 将目标节点设置为disabled
          node.disabled = true;

          // 遍历所有子节点，将所有子节点全部都加上disabled
          const children = node.children;
          if (Tool.isNotEmpty(children)) {
            for (let j = 0; j < children.length; j++) {
              setDisable(children, children[j].id);
            }
          }
        } else {
          // 如果当前节点不是目标节点，则到其子节点再找找看。
          const children = node.children;
          if (Tool.isNotEmpty(children)) {
            setDisable(children, id);
          }
        }
      }
    };

    // 新增接口
    const add = () => {
      modalVisible.value = true;
      doc.value = {};
      doc.value.ebookId = id;
      treeSelectData.value = Tool.copy(level1.value);
      treeSelectData.value.unshift({ id: 0, name: "无" });
    };
    // 编辑表单
    const edit = (record: any) => {
      modalVisible.value = true;
      doc.value = Tool.copy(record);

      // 不能选择当前结点以及当前子孙节点作为父结点，否则会使树断开
      treeSelectData.value = Tool.copy(level1.value);
      setDisable(treeSelectData.value, record.id);
      // 为选择树添加一个"无"
      treeSelectData.value.unshift({ id: 0, name: "无" });
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
    return {
      columns,
      level1,
      loading,
      param,
      treeSelectData,
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