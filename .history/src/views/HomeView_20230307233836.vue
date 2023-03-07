<template>
  <a-layout>
    <a-layout-sider width="220" style="background: #fff">
      <!-- <div class="selectall">
        <template #icon>
          <MailOutlined />
        </template>
        全部
      </div> -->
      <a-menu
        v-model:selectedKeys="selectedKeys"
        style="width: 240px"
        mode="inline"
        :open-keys="openKeys"
      >
        <!-- 遍历得到所有的目录 -->
        <
        <a-sub-menu
          v-for="(item, index) in level1"
          :key="item.id"
          @titleClick="titleClick(item.id)"
        >
          <template #icon>
            <MailOutlined />
          </template>
          <template #title>{{ item.name }}</template>
          <a-menu-item
            v-for="(child, index) in item.children"
            :key="child.id"
            @click="subTitleClick(child.id)"
            >{{ child.name }}</a-menu-item
          >
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout-content
      :style="{
        background: '#fff',
        padding: '.48rem',
        margin: 0,
        minHeight: '5.6rem',
      }"
    >
      <WiKiList :ebooks="ebooks" />
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import { Tool } from "@/util/tool";
import WiKiList from "@/components/WiKiList.vue";
import { message, Pagination } from "ant-design-vue";
export default defineComponent({
  name: "HomeView",
  components: {
    WiKiList,
    MailOutlined,
    AppstoreOutlined,
    SettingOutlined,
  },
  setup() {
    const ebooks = ref();
    onMounted(() => {
      handleQueryCategory(); // 得到分类菜单里的所有数据
    });
    // 初始化
    const initEBookView = () => {
      axios
        .get("/ebook/list", {
          params: {
            page: 1,
            size: 1000,
          },
        })
        .then((resp) => {
          const data = resp.data;
          if (data.success) {
            ebooks.value = resp.data.content.list;
            // 重置分页按钮
          } else {
            message.error(data.message);
          }
        });
    };
    // 得到分类菜单里的所有信息
    const level1 = ref(); // 第一级菜单
    const handleQueryCategory = () => {
      axios.get("/category/list").then((resp) => {
        const data = resp.data;
        if (data.success) {
          const categorys = data.content.list;
          level1.value = [];
          level1.value = Tool.array2Tree(categorys, 0);
          initEBookView(); // 初始化数据，显示全部
          console.log("value", level1.value);
        } else {
          message.error(data.message);
        }
      });
    };

    // =================按需修改的函数的调用
    // 定义一个变量里面存储父子菜单的id便于后面进行搜索
    let selectInfo = ref();
    // 点击父菜单时触发的操作
    const titleClick = (cid: number) => {
      selectInfo.value = {};
      selectInfo.value.category1Id = cid;
      updateEBooks();
      console.log(
        "爸保护你:父" +
          selectInfo.value.category1Id +
          ";子:" +
          selectInfo.value.category2Id
      );
    };
    // 点击子菜单时触发的操作
    const subTitleClick = (cid: number) => {
      selectInfo.value.category2Id = cid;
      updateEBooks();
      console.log(
        "被偷家了:父" +
          selectInfo.value.category1Id +
          ";子:" +
          selectInfo.value.category2Id
      );
    };
    // 向后端请求数据
    const updateEBooks = () => {
      axios.post("/ebook/update", selectInfo.value).then((resp) => {
        const data = resp.data;
        if (data.success) {
          ebooks.value = resp.data.content;
          // 重置分页按钮
        } else {
          message.error(data.message);
        }
      });
    };

    return { ebooks, level1, selectInfo, titleClick, subTitleClick };
  },
});
</script>

<style scoped>
.selectall {
  width: 240.27px;
  height: 40px;
  color: #000000d9;
  font: 14px;
  margin: 4px 0px;
  padding: 0 34px 0px 24px;
  line-height: 40px;
}
</style>
