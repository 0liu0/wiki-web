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
      :data-source="ebooks"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template #cover="{ text: cover }">
        <img class="cover" v-if="cover" :src="cover" alt="avatar" />
      </template>
      <template v-slot:category="{ text, record }">
        <span
          >{{ getCategoryName(record.category1Id) }} /
          {{ getCategoryName(record.category2Id) }}</span
        >
      </template>
      <template v-slot:action="{ text, record }">
        <a-space size="small">
          <a-button type="primary""> 文档管理 </a-button>
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
    title="电子书表单"
    v-model:visible="modalVisible"
    :confirm-loading="modalLoading"
    @ok="handleOk"
    :mask="true"
  >
    <a-form :model="ebook" :labelCol="{ span: 6 }">
      <a-form-item label="封面">
        <a-input v-model:value="ebook.cover" />
      </a-form-item>
      <a-form-item label="名称">
        <a-input v-model:value="ebook.name" />
      </a-form-item>
      <a-form-item label="分类">
        <a-cascader
          v-model:value="selectInfo"
          :options="level1"
          :field-names="{ label: 'name', value: 'id', children: 'children' }"
          placeholder="Please select"
        />
      </a-form-item>
      <a-form-item label="描述">
        <a-input v-model:value="ebook.description" type="text" />
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
export default defineComponent({
  name: "AdminEBookView",
  setup() {
    const selectInfo = ref();
    const param = ref();
    param.value = {};
    const ebooks = ref();
    const pagination = ref({
      current: 1,
      pageSize: 4,
      total: 0,
    });
    const loading = ref(false);
    const columns = [
      {
        title: "封面",
        dataIndex: "cover",
        slots: { customRender: "cover" },
      },
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "分类",
        slots: { customRender: "category" },
      },
      {
        title: "文档数",
        dataIndex: "docCount",
      },
      {
        title: "阅读数",
        dataIndex: "viewCount",
      },
      {
        title: "点赞数",
        dataIndex: "voteCount",
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
        .get("/ebook/list", {
          params: {
            page: params.page,
            size: params.size,
            name: param.value.name,
          },
        })
        .then((resp) => {
          loading.value = false;
          const data = resp.data;
          if (data.success) {
            ebooks.value = data.content.list;
            // 重置分页按钮
            pagination.value.current = params.page;
            pagination.value.total = data.content.total;
          } else {
            message.error(data.message);
          }
        });
    };

    // 控制表单的显现
    const modalLoading = ref(false);
    const modalVisible = ref(false);
    const ebook = ref();
    const handleOk = () => {
      modalVisible.value = true;
      modalLoading.value = true;
      ebook.value.category1Id = selectInfo.value[0];
      ebook.value.category2Id = selectInfo.value[1];
      axios.post("/ebook/save", ebook.value).then((resp) => {
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
      ebook.value = {};
    };
    // 编辑表单
    const edit = (record: any) => {
      modalVisible.value = true;
      ebook.value = Tool.copy(record);
      selectInfo.value = [ebook.value.category1Id, ebook.value.category2Id];
    };
    // 删除提示框
    const confirm = (id: any) => {
      axios.delete("/ebook/delete/" + id).then((resp) => {
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
    // 得到分类菜单里的所有信息
    let listCategoryName: any;
    const level1 = ref();
    const handleQueryCategory = () => {
      //
      loading.value = true;
      axios.get("/category/list").then((resp) => {
        loading.value = false;
        const data = resp.data;
        if (data.success) {
          const categorys = data.content.list;
          listCategoryName = categorys;
          level1.value = [];
          level1.value = Tool.array2Tree(categorys, 0);
        } else {
          message.error(data.message);
        }
      });
    };

    // 通过category的id得到分类名称
    const getCategoryName = (id: number) => {
      let result = "";
      if (listCategoryName) {
        listCategoryName.forEach((item: any) => {
          if (item.id === id) result = item.name;
        });
      }
      return result;
    };
    onMounted(() => {
      handleQueryCategory(); // 得到分类菜单里的所有信息
      handleQuery({
        page: 1,
        size: pagination.value.pageSize,
      });
    });
    return {
      selectInfo,
      columns,
      ebooks,
      pagination,
      loading,
      param,
      level1,
      handleTableChange,
      edit,
      add,
      cancel,
      confirm,
      modalVisible,
      modalLoading,
      handleOk,
      handleQuery,
      getCategoryName,
      ebook,
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