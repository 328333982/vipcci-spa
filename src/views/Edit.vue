<template>
  <div>
    <div style="margin:0.5em">
      <Poptip trigger="focus">
        <Tag type="dot" :color="this.title ? 'success' : 'error'">请输入标题</Tag>

        <Input v-model="title" prefix="md-bookmarks" placeholder="标题" style="width: 30em;"/>
        <div slot="content">{{ formatTitle }}</div>
      </Poptip>
    </div>

    <div style="margin:0.5em">
      <Poptip trigger="focus">
        <Tag type="dot" :color="this.keywords ? 'success' : 'error'">输入关键词</Tag>

        <Input v-model="keywords" prefix="md-bulb" placeholder="关键词" style="width: 30em;"/>
        <div slot="content">{{ formatKeywords }}</div>
      </Poptip>
    </div>
    <div style="margin:0.5em">
      <Poptip trigger="focus">
        <Tag type="dot" :color="this.url ? 'success' : 'error'">图标的链接</Tag>

        <Input v-model="url" prefix="md-globe" placeholder="链接" style="width: 30em;"/>
        <div slot="content">{{ formatUrl }}</div>
      </Poptip>
    </div>
    <!-- 分类 -->
    <div style="margin:0.5em">
      <Tag type="dot" :color="this.category_id ? 'success' : 'error'">请选择分类</Tag>
      <Select v-model="category_id" style="width: 25.6em;">
        <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
    </div>
    <Tabs value="name1">
      <TabPane label="版本管理" name="name1" icon="ios-timer">
        <!-- 版本管理 -->
        <div>
          <Tag color="magenta" style="margin:-1em 0 0.5em 0.5em">每一个版本对应一个下载地址</Tag>
          <Button
            type="success"
            size="small"
            style="margin:-1em 0 0.5em 0.5em"
            @click="add_app_version"
          >+ 添加一个版本</Button>
          <!-- 版本管理列表 -->
          <Table height="200" :columns="columns_version" :data="data_version"></Table>
        </div>
      </TabPane>
      <TabPane label="微博的图片" name="name2" icon="md-globe">
        <!-- 软件界面截图浏览和上传 textarea-->
        <div>
          <Tag
            color="volcano"
            style="margin:-1em 0 0.5em 0.5em"
          >选择软件运行界面截图(注意:请严格遵守每行一个地址的原则。从这里上传的图片会保存在微博里,不会影响到服务器，我建议这样做。)</Tag>
          <Input v-model="textarea_urls" type="textarea" :rows="10" placeholder="请每一行只写一条地址"/>
        </div>
      </TabPane>
      <TabPane label="网站的图片" name="name3">
        <!-- 软件界面截图浏览和上传 -->
        <div>
          <Tag
            color="blue"
            style="margin:-1em 0 0.5em 0.5em"
          >选择软件运行界面截图(注意:从这里上传的图片会保存到服务器里消耗额外的资源，我不建议这样做。)</Tag>
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
      <Button type="success" :loading="loading" long @click="save">
        <span v-if="!loading">发布</span>
        <span v-else>Loading...</span>
      </Button>
    </div>
    <!-- 模态框版本编辑 -->
    <div>
      <Modal v-model="modal_version" title="请按照提示输入对应信息" @on-ok="ok(ok_index)" @on-cancel="cancel">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>请按照提示输入对应信息</span>
        </p>

        <i-input v-model="app_version">
          <span slot="prepend">软件的版本号</span>
        </i-input>
        <br>
        <i-input v-model="baidu_pan_url">
          <span slot="prepend">百度网盘地址</span>
        </i-input>
        <br>
        <i-input v-model="baidu_pan_secret">
          <span slot="prepend">百度网盘密码</span>
        </i-input>
        <br>
        <i-input v-model="other_pan_url">
          <span slot="prepend">其他网盘地址</span>
        </i-input>
        <br>
        <i-input v-model="update_time">
          <span slot="prepend">软件更新时间</span>
        </i-input>
        <br>
        <i-input v-model="auto_pan_url">
          <span slot="prepend">自动识别地址</span>
        </i-input>
        <br>
      </Modal>
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
      columns_version: [
        {
          title: "版本号",
          key: "app_version",
          width: 100
        },
        {
          title: "百度网盘地址",
          key: "baidu_pan_url"
        },
        {
          title: "百度网盘密码",
          key: "baidu_pan_secret"
        },
        {
          title: "其他网盘地址",
          key: "other_pan_url"
        },
        {
          title: "更新时间",
          key: "update_time"
        },
        {
          title: "操作",
          key: "action",
          width: 160,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    icon: "ios-create"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.edit(params.index);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                    icon: "md-trash"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data_version: [],
      app_name: "",
      app_version: "",
      baidu_pan_url: "",
      baidu_pan_secret: "",
      other_pan_url: "",
      update_time: "",
      auto_pan_url: "",
      ok_index: "",
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
      childDataLoaded: false,
      category_id: "",
      categoryList: [],
      title: "",
      url: "",
      keywords: "",
      mavon_edit_data: "",
      app_img_url: [],
      modal_version: false,
      add_or_edit_version:false,//false 是添加版本
    };
  },
  mounted() {
    axios
      .get("http://vipcci.test/api/topics/" + this.$route.params.id)
      .then(response => {
        // console.log(response.data.topic.app_img_url);

        this.title = response.data.topic.title;
        this.keywords = response.data.topic.keywords;
        this.url = response.data.topic.avatar;
        this.categoryList = response.data.topic.categories;
        this.category_id = response.data.topic.category_id;
        this.app_img_url = response.data.topic.app_img_url;
        this.data_version = response.data.topic.app_version_url;
        this.mavon_edit_data = '软件描述'+response.data.topic.description +'软件介绍'+ response.data.topic.introduction+'激活方法'+response.data.topic.crack+'==到此结束=='
          ? '软件描述'+response.data.topic.description +'软件介绍'+ response.data.topic.introduction+'激活方法'+response.data.topic.crack+'==到此结束=='
          : "暂无数据";
        this.childDataLoaded = true;
        // console.log(this.app_img_url);
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

   

    formatKeywords() {
      if (this.keywords === "") return "请输入关键词";

      function parseNumber(str) {
        return str;
      }
      return parseNumber(this.keywords);
    },

    textarea_urls: {
      get() {
        var weibo_url = [];
        this.app_img_url.map(function(abcd) {
          return weibo_url.push(abcd.url);
        });

        return weibo_url.join("\n");
      },
      set(app_img_urls) {
        var weibo_urls1 = [];
        app_img_urls.split("\n").map(function(abc) {
          return weibo_urls1.push({
            url: abc
          });
        });
        this.app_img_url = weibo_urls1;
      }
    }

    // urls() {
    //   console.log('2222');
    //   var weibo_url = [];
    //   this.app_img_url.map(function(abc) {
    //     return weibo_url.push(abc.url);
    //   });

    //   return weibo_url.join("\n");
    // },
    // app_img_url() {
    //   var weibo_url1 = [];
    //   var weibo_urls1 = [];
    //   weibo_url1 = this.urls.split('\n')
    //   weibo_url1.map(function(abc) {
    //     return weibo_urls1.push({'url':abc});
    //   });
    //   var weibo_urls1 = this.app_img_url;
    //   return weibo_urls1;
    // }
  },
  watch: {
    auto_pan_url() {
      var a =
        "链接: https://pan.baidu.com/s/1OozYDU1cCJIW-k2tPJPnpA 提取码: 9m8u 复制这段内容后打开百度网盘手机App，操作更方便哦";
      var b = "链接:https://pan.baidu.com/s/1OozYDU1cCJIW-k2tPJPnpA 密码:9a8a";

      if (this.auto_pan_url.indexOf("提取码:") > -1) {
        this.baidu_pan_url = this.auto_pan_url
          .replace(/\s+/g, "")
          .split("提取码:")[0]
          .replace("链接:", "");
        this.baidu_pan_secret = this.auto_pan_url
          .replace(/\s+/g, "")
          .split("提取码:")[1]
          .substring(0, 4);
      } else if (this.auto_pan_url.indexOf("密码:") > -1) {
        this.baidu_pan_url = this.auto_pan_url
          .replace(/\s+/g, "")
          .split("密码:")[0]
          .replace("链接:", "");
        this.baidu_pan_secret = this.auto_pan_url
          .replace(/\s+/g, "")
          .split("密码:")[1]
          .substring(0, 4);
      } else {
        this.baidu_pan_url = "";
        this.baidu_pan_secret = "";
      }
      return;
      // this.auto_pan_url = "";
      // console.log(b.indexOf("提取码:"))
      // this.other_pan_url=a.indexOf("提取码:")
    }
  },

  methods: {
    app_img_from_child(data) {
      this.app_img_url = data;
    },

    save() {
      this.loading = true;
      axios
        .post("http://vipcci.test/api/topics/" + this.$route.params.id, {
          title: this.title,
          avatar: this.url,
          category_id: this.category_id,
          app_img_url: this.app_img_url,
          app_version_url: this.data_version,
          // introduction: this.mavon_edit_data,
          introduction: this.mavon_edit_data,
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
    },
    edit(index) {
      this.add_or_edit_version=true,//编辑版本设置成true
      this.modal_version = true;
      this.auto_pan_url = "";
      this.app_name = this.data_version[index].title;
      this.app_version = this.data_version[index].app_version;
      this.baidu_pan_url = this.data_version[index].baidu_pan_url;
      this.baidu_pan_secret = this.data_version[index].baidu_pan_secret;
      this.other_pan_url = this.data_version[index].other_pan_url;
      this.update_time = this.data_version[index].update_time;
      this.ok_index = index;
    },
    add_app_version() {
      this.add_or_edit_version=false,//添加版本设置成false
      this.modal_version = true;
      this.auto_pan_url = "";
      this.app_name = this.title;
      this.app_version = "";
      this.baidu_pan_url = "";
      this.baidu_pan_secret = "";
      this.other_pan_url = "";
      this.update_time ="";
      this.ok_index = this.data_version.length - 1;
      // console.log(this.data_version.length);
    },
    remove(index) {
      // console.log(index);
      this.data_version.splice(index, 1);
    },
    ok(index) {
      if (this.add_or_edit_version==false) {
        this.data_version.push({
          app_name: this.title,
          app_version: this.app_version,
          baidu_pan_url: this.baidu_pan_url,
          baidu_pan_secret:this.baidu_pan_secret,
          other_pan_url:this.other_pan_url,
          update_time:this.update_time,
        });
      } else {
        this.data_version[index].app_name = this.title;
        this.data_version[index].app_version = this.app_version;
        this.data_version[index].baidu_pan_url = this.baidu_pan_url;
        this.data_version[index].baidu_pan_secret = this.baidu_pan_secret;
        this.data_version[index].other_pan_url = this.other_pan_url;
        this.data_version[index].update_time = this.update_time;
        this.ok_index = "";
      }
    },
    cancel() {}
  }
};
</script>