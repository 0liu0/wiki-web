<template>
  <a-layout-content
    :style="{
      background: '#fff',
      padding: '24px',
      margin: 0,
      minHeight: '280px',
    }"
  >
    <div v-if="!doc">
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
    </div>
    <a-row v-if="doc" :gutter="24">
      <a-col :span="8">
        <a-space :size="small">
          <a-button type="primary" @click="add" size="small"> 新增 </a-button>
        </a-space>
        <a-table
          :columns="columns"
          :row-key="(record) => record.id"
          :data-source="level1"
          :loading="loading"
          @change="handleTableChange"
          :pagination="false"
          size="small"
          defaultExpandAllRows="true"
        >
          <template #name="{ text, record }">
            {{ record.sort }} {{ text }}
          </template>
          <template v-slot:action="{ text, record }">
            <a-space size="small">
              <a-button type="primary" @click="edit(record)" size="small">
                编辑
              </a-button>
              <a-button type="danger" size="small">
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
      </a-col>
      <a-col :span="16">
        <p>
          <a-form layout="inline" :model="param">
            <a-form-item>
              <a-button type="primary" @click="handleOk"> 保存 </a-button>
            </a-form-item>
          </a-form>
        </p>
        <a-form
          v-if="doc"
          layout="vertical"
          :model="doc"
          :labelCol="{ span: 6 }"
        >
          <a-form-item>
            <a-input v-model:value="doc.name" placeholder="名称" />
          </a-form-item>
          <a-form-item>
            <a-tree-select
              v-model:value="doc.parent"
              show-search
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="父文档"
              allow-clear
              tree-default-expand-all
              :tree-data="treeSelectData"
              :fieldNames="{ label: 'name', value: 'id' }"
            >
              <template #suffixIcon><SmileOutlined /></template>
            </a-tree-select>
          </a-form-item>
          <a-form-item>
            <a-input v-model:value="doc.sort" placeholder="顺序" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handlePreviewContent">
              <EyeOutlined /> 内容预览
            </a-button>
          </a-form-item>
          <a-form-item>
            <div id="content" placeholder="内容"></div>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <a-drawer
      v-model:visible="drawerVisible"
      title="内容预览"
      width="900"
      placement="right"
      :closable="false"
      @close="onDrawerClose"
    >
      <div class="wangeditor" :innerHTML="previewHTML"></div>
    </a-drawer>
    <!-- <a-modal
          title="文档表单"
          v-model:visible="modalVisible"
          :confirm-loading="modalLoading"
          @ok="handleOk"
          :mask="true"
        > -->
    <!-- </a-modal> -->
  </a-layout-content>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { SmileOutlined, EyeOutlined } from "@ant-design/icons-vue";
import { Tool } from "@/util/tool";
import { useRoute } from "vue-router";
import E from "wangeditor";
export default defineComponent({
  name: "AdminDocView",
  components: {
    SmileOutlined,
    EyeOutlined,
  },
  setup() {
    const route = useRoute(); // 得到上一个界面传来的id
    const id = route.query.ebookId;
    const param = ref();
    param.value = {};
    const docs = ref();
    const loading = ref(false);
    const treeSelectData = ref();
    const editor = new E("#content");
    editor.config.zIndex = 0;
    treeSelectData.value = [];
    const columns = [
      {
        title: "名称",
        dataIndex: "name",
        slots: { customRender: "name" },
      },
      {
        title: "Action",
        key: "action",
        slots: { customRender: "action" },
      },
    ];
    onMounted(() => {
      handleQuery();
    });
    // 数据查询
    const level1 = ref();
    const handleQuery = () => {
      loading.value = true;
      axios.get("/doc/get-one/" + id).then((resp) => {
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
    const doc = ref();
    const handleOk = () => {
      const txt = editor.txt.html();
      console.log("txt的值为" + txt);
      if (txt != "" && txt != undefined && txt != null) {
        doc.value.content = editor.txt.html(); // 将内容存放到doc一起发给后端去保存
      }
      axios.post("/doc/save", doc.value).then((resp) => {
        const data = resp.data;
        if (data.success) {
          message.success("操作成功！");
          // 重新加载列表
          handleQuery();
        } else {
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
      // modalVisible.value = true;
      doc.value = {};
      editor.txt.html("");
      doc.value.ebookId = id;
      treeSelectData.value = Tool.copy(level1.value);
      treeSelectData.value.unshift({ id: 0, name: "无" });
      setTimeout(() => {
        editor.create();
      }, 100);
    };
    // 编辑表单
    const edit = (record: any) => {
      doc.value = {};
      editor.txt.html("");
      setTimeout(() => {
        // 发送请求到后端去拿content内容
        axios.get("/doc/get-content/" + record.id).then((resp) => {
          const data = resp.data;
          if (data.success) {
            doc.value.content = data.content;
            editor.txt.html(doc.value.content);
          } else {
            message.error("网络繁忙，请稍后重试");
          }
        });
      }, 100);
      doc.value = Tool.copy(record);
      // 不能选择当前结点以及当前子孙节点作为父结点，否则会使树断开
      treeSelectData.value = Tool.copy(level1.value);
      setDisable(treeSelectData.value, record.id);
      // 为选择树添加一个"无"
      treeSelectData.value.unshift({ id: 0, name: "无" });
      setTimeout(() => {
        editor.create();
      }, 100);
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

    // 富文本预览
    const drawerVisible = ref(false);
    const previewHTML = ref();
    const handlePreviewContent = () => {
      const html = editor.txt.html();
      previewHTML.value = html;
      drawerVisible.value = true;
    };
    const onDrawerClose = () => {
      drawerVisible.value = false;
    };
    return {
      columns,
      level1,
      loading,
      param,
      treeSelectData,
      drawerVisible,
      previewHTML,
      handlePreviewContent,
      onDrawerClose,
      handleQuery,
      edit,
      add,
      cancel,
      confirm,
      // modalVisible,
      // modalLoading,
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