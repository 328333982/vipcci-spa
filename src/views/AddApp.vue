<template>
  <div>
    <div style="margin:0.5em">
      <Poptip trigger="focus">
        <Tag type="dot" color="error">请输入标题</Tag>

        <Input v-model="title" prefix="md-bookmarks" placeholder="标题" style="width: 30em;"/>
        <div slot="content">{{ formatTitle }}</div>
      </Poptip>
    </div>

    <div style="margin:0.5em">
      <Poptip trigger="focus">
        <Tag type="dot" color="primary">图标的链接</Tag>
        <Input v-model="url" prefix="md-globe" placeholder="链接" style="width: 30em;"/>
        <div slot="content">{{ formatUrl }}</div>
      </Poptip>
    </div>
    <!-- 分类 -->
    <div style="margin:0.5em">
      <Tag type="dot" color="success">请选择分类</Tag>
      <Select v-model="category_id" style="width: 25em;">
        <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </div>
    <Tabs value="name1">
      <TabPane label="微博的图片" name="name1" style="8em">
        <!-- 软件界面截图浏览和上传 textarea-->
        <Button type="success" shape="circle" style="margin:0.5em 0em">
          <h3>选择软件运行界面截图(注意:请严格遵守每行一个地址的原则。从这里上传的图片会保存在微博里,不会影响到服务器，我建议这样做。)</h3>
        </Button>
        <Input v-model="textarea_urls" type="textarea" :rows="8" placeholder="请每一行只写一条地址"/>
      </TabPane>
      <TabPane label="网站的图片" name="name2">
        <!-- 软件界面截图浏览和上传 -->
        <div style="margin:0.5em">
          <Button type="error" shape="circle" style="margin:0.5em 0em">
            <h3>选择软件运行界面截图(注意:从这里上传的图片会保存到服务器里消耗额外的资源，我不建议这样做。)</h3>
          </Button>

          <ImgUpload
            v-if="childDataLoaded"
            :app_img_url="app_img_url"
            v-on:defaultList_from_child="app_img_from_child"
          />
        </div>
      </TabPane>
      
    </Tabs>
    <!-- markdown编辑器 -->
    <div style="margin:0.5em">
      <mavon-editor
        :toolbars="mavonEditorToolbars"
        fontSize="16px"
        defaultOpen="edit"
        style="z-index: 1000"
        v-model="mavon_edit_data"
      />
    </div>
    <!-- 发布按钮 -->
    <div style="margin:0.5em">
      <Button type="success" :loading="loading" long @click="AddApp">
        <span v-if="!loading">发布</span>
        <span v-else>Loading...</span>
      </Button>
    </div>
  </div>
</template>

<script>
import ImgUpload from "../components/ImgUpload.vue";
export default {
  components: {
    ImgUpload
  },

  data() {
    return {
      mavonEditorToolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        // subfield: true, // 单双栏模式
        preview: true // 预览
      },
      loading: false,
      childDataLoaded: true,
      category_id: "",
      categoryList: [],
      title: "",
      url: "",
      mavon_edit_data: "",
      app_img_url: []
    };
  },
  mounted() {
    axios.get("http://vipcci.test/api/create").then(response => {
      // console.log(response.data);
      this.categoryList = response.data;
    });
  },
  computed: {
    formatTitle() {
      if (this.title === "") return "请输入标题（必填）";
      function parseNumber(str) {
        return str;
      }
      return parseNumber(this.title);
    },
    formatUrl() {
      if (this.url === "") return "请输入链接（必填）以http://开头";
      function parseNumber(str) {
        return str;
      }
      return parseNumber(this.url);
    },
    textarea_urls: {
      get() {
        var weibo_url = [];
        this.app_img_url.map(function(abc) {
          return weibo_url.push(abc.url);
        });

        return weibo_url.join("\n");
      },
      set(app_img_urls) {
        var weibo_urls1 = [];
        app_img_urls.split("\n").map(function(abc) {
          return weibo_urls1.push({ url: abc });
        });
        this.app_img_url = weibo_urls1;
      }
    }
  },
  methods: {
    app_img_from_child(data) {
      this.app_img_url = data;
    },

    AddApp() {
      this.loading = true;
      axios
        .post("http://vipcci.test/api/create", {
          title: this.title,
          avatar: this.url,
          category_id: this.category_id,
          app_img_url: this.app_img_url,
          introduction: this.mavon_edit_data,
          description: "description",
          download: "1111"
        })
        .then(response => {
          console.log(response.data);
          this.loading = false;
          this.$Message.success({
            content: "发布成功了",
            duration: 3
          });
        });
    }
  }
};
</script>
