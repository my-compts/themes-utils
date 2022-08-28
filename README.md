# vue-cli-plugin-ngbd-themes
ngbd-themes plugin for `@vue/cli` 3.0.
为工具更换主题提供的工具包

## 文件说明
   |文件名|文件描述|
   |---|---|
   |index.js|指定项目中需要被引入的文件|
   |mainMixin.js|用于在main.js中引入注册全局mixins|
   |themeMixin.js|注册全局mixins|
   |ThemeObject.js|提供颜色变量对象以及改变elementui主色调方法|
   |ToolThemeMgt.js|vuex存储对象，存放颜色变量重置方法setToolColors|
   |resetCompt.scss|重置通用组件、自定义组件公共样式|
   |toolThemes.json|颜色变量-js|
   |toolThemes.scss|主题变量及样式调用入口方法-css|
   |toolVariables.scss|颜色变量-css|
   |ThemeControl.vue|主题操作入口组件，提供curTheme属性用于项目传入默认主题|

> resetCompt.scss

::: tip 样式重置
重置穿梭框样式--统一为圆形上下排列
:::

## 发布说明
修改package.json版本version
切换NPM源
```shell script
npm config set registry http://10.1.4.161:8085/repository/bd-npm-public
npm publish
```
## 项目引用说明（基础准备工作）
### Install 在项目中执行命令：

vue add ngbd-themes

::: tip vue-nl-interaction-sql插件
需注意，如果项目中有引用vue-nl-interaction-sql插件，需更新到0.1.253以上，否则会出现element样式被覆盖问题
:::

### vue.config.js新增scss全局配置：
```js
chainWebpack: (config) => { //  配置插件
    const oneOfsMap = config.module.rule('scss').oneOfs.store;
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // 全局变量文件路径，只有一个时可将数组省去,项目中如果有在各vue文件中引入theme.scss，在此配置后，可以删除原先每个文件中的引入
          resources: ['./src/utils/themeControl/variables/toolThemes.scss', './src/assets/css/themes/t01/theme.scss']
        })
        .end();
    });
  }
```
### store.js的modules中新增ToolThemeMgt:
```js
export default new Vuex.Store({
  modules: {
    leftTree,
    tab,
    mainFrame,
    tabRightMenu,
    ToolThemeMgt
  },
  state: {
  },
  mutations: {
  },
  getters: {

  },
  actions: {
  }
});
```
### ToolThemeMgt中提供了setTheme方法以及状态theme
::: tip ansibleConfig配置
主题统一走ansibleConfig配置，参考如下两个配置文件
:::
``` json
// loginExplain.json
{
  "explain": {
    "productName": "大数据分析与可视化",
    "showProductIcon": "1",
    "title": "DataEleph",
    "favIcon": "favicon.ico"
  },
  "theme": {
    "theme": "default"
  }
}
```
``` js
// loginExplain.json.j2
{
  "theme": {{ common_theme_explain }},
  "explain": {{ dataeleph_login_explain }}
}
```
- 读取了配置文件之后需调用setTheme(theme)方法把ansibleConfig中的theme存到store中，例：
``` js
// mapactions中引入
...mapActions({
      setTheme: 'ToolThemeMgt/setTheme'
    })
// 查询ansible配置

    let ansible = await this.getAnsibleConfig();
    if(ansible && ansible.data) {
      document.querySelector('link[rel="icon"]').setAttribute('href', ansible.data.explain.favIcon || 'favicon.ico');
      document.title = ansible.data.title;
      // 设置theme
      this.setTheme(ansible.data.theme.theme);
      let ansibleConfig = JSON.stringify(ansible.data.explain);
      sessionStorage.setItem('ansibleConfig', ansibleConfig);
    } else {
      console.error('查询ansible配置异常');
    }
```

### 在框架首页App.vue引入组件ThemeControl.vue并设置默认主题:
```html
<!-- 本地开发时可显示此组件，提交代码请将此组件v-show="false"-->
<!-- 原先的:cur-theme="theme"去掉-->
<ThemeControl v-show="false" />
```
```js
import ThemeControl from '@/utils/themeControl/ThemeControl';
components: {
ThemeControl
}

```
## 使用说明
### css样式修改
修改具体页面时，把原先定义了颜色的样式统一调整为@include style-tool-color('属性名称', '颜色变量类型')
```scss
/deep/.home-frame-menu {
    // background-color: $bg-clr05;
    @include style-tool-color('background-color', 'toolsub');
    border-right: 1px solid $border-clr02;
    padding: 0px;
    overflow-x: hidden;
    position: relative;
    .el-tree {
      // background-color: $bg-clr05;
      background-color: transparent;
      // color: $font-clr05;
      @include style-tool-color('color', 'frame');
    }
  }
```

如需要important,在参数中加入important即可，如：
```scss
/deep/.home-frame-menu {
    // background-color: $bg-clr05;
    @include style-tool-color('background-color', 'toolsub', important);
  }
```

### js属性方式修改
toolColors已经在全局中引入，可以直接引用，toolColors中的颜色变量
```html
<div
  class="head-title"
  :style="{color: toolColors.mainColor}"
>
  指标开发工具
</div>
```

## css颜色变量
### 背景色
<table>
<tr><td>变量名</td><td>展示效果</td><td>主题</td><td>使用场景</td><td width="160px">示例图</td></tr>
<tr><td rowspan=3>toolmain</td><td bgcolor=#0a2b4c></td><td>默认</td><td rowspan=3>框架头部</td></tr>
<tr><td bgcolor=#fff></td><td>铁塔</td></tr>
<tr><td bgcolor=#fff></td><td>江苏</td></tr>
<tr><td rowspan=3>toolsub</td><td bgcolor=#0c355e></td><td>默认</td><td rowspan=3>一级菜单</td></tr>
<tr><td bgcolor=#89040e></td><td>铁塔</td></tr>
<tr><td bgcolor=#0081cc></td><td>江苏</td></tr>
<tr><td rowspan=3>tooltrd</td><td bgcolor=#3f5a77></td><td>默认</td><td rowspan=3>二级菜单</td></tr>
<tr><td bgcolor=#fff></td><td>铁塔</td></tr>
<tr><td bgcolor=#fff></td><td>江苏</td></tr>
<tr><td rowspan=3>newtab</td><td bgcolor=#0a2b4c></td><td>默认</td><td rowspan=3>打开的标签页头部</td></tr>
<tr><td bgcolor=#89040e></td><td>铁塔</td></tr>
<tr><td bgcolor=#0081cc></td><td>江苏</td></tr>
<tr><td rowspan=3>design-subhead</td><td bgcolor=#0c355e></td><td>默认</td><td rowspan=3>设置面板头部</td></tr>
<tr><td bgcolor=#919398></td><td>铁塔</td></tr>
<tr><td bgcolor=#919398></td><td>江苏</td></tr>
<tr><td rowspan=3>design-pane</td><td bgcolor=#3f5a77></td><td>默认</td><td rowspan=3>设置面板</td></tr>
<tr><td bgcolor=#606266></td><td>铁塔</td></tr>
<tr><td bgcolor=#606266></td><td>江苏</td></tr>
<tr><td rowspan=3>design-paneform</td><td bgcolor=#0c355e></td><td>默认</td><td rowspan=3>设置面板表单</td></tr>
<tr><td bgcolor=#3b3c3e></td><td>铁塔</td></tr>
<tr><td bgcolor=#3b3c3e></td><td>江苏</td></tr>
<tr><td rowspan=3>maintitle</td><td bgcolor=#409eff></td><td>默认</td><td rowspan=3>通用标题左边图标</td></tr>
<tr><td bgcolor=#e70012></td><td>铁塔</td></tr>
<tr><td bgcolor=#0081cc></td><td>江苏</td></tr>
<tr><td rowspan=3>tagitem</td><td bgcolor=#ecf5ff></td><td>默认</td><td rowspan=3>特殊标签强调背景</td></tr>
<tr><td bgcolor=#feecec></td><td>铁塔</td></tr>
<tr><td bgcolor=#e6f2fa></td><td>江苏</td></tr>
<tr><td rowspan=3>blockselect</td><td bgcolor=#d9ecff></td><td>默认</td><td rowspan=3>块面选中背景色</td></tr>
<tr><td bgcolor=#fcd8d8></td><td>铁塔</td></tr>
<tr><td bgcolor=#fcd8d8></td><td>江苏</td></tr>
<tr><td rowspan=3>specialblock</td><td bgcolor=#0c345e style="border-bottom: 2px solid #0a2b4c"></td><td>默认</td><td rowspan=3>深色背景下的输入框背景色</td><td></td></tr>
<tr><td bgcolor=#3b3c3e style="border-bottom: 2px solid #181819"></td><td>铁塔</td><img src="./img/specialblock1.png" /></td></tr>
<tr><td bgcolor=#3b3c3e style="border-bottom: 2px solid #181819"></td><td>江苏</td><img src="./img/specialblock1.png" /></td></tr>
<tr><td rowspan=3>bigblock</td><td bgcolor=#f2f6fc></td><td>默认</td><td rowspan=3>大块面填充背景色</td><td><img src="./img/bigblock2.png" /></td></tr>
<tr><td bgcolor=#f5f7fa></td><td>铁塔</td><td><img src="./img/bigblock1.png" /></td></tr>
<tr><td bgcolor=#f5f7fa></td><td>江苏</td><td><img src="./img/bigblock1.png" /></td></tr>
<tr><td rowspan=3>midblock</td><td bgcolor=#409eff style="opacity: 0.6"></td><td>默认</td><td rowspan=3>小块面背景</td><td></td></tr>
<tr><td bgcolor=#909399 style="opacity: 0.6"></td><td>铁塔</td><td></td></tr>
<tr><td bgcolor=#909399 style="opacity: 0.6"></td><td>江苏</td><td></td></tr>
</table>

### 文字色
<table>
<tr><td>变量名</td><td>展示效果与主题</td><td>使用场景</td></tr>
<tr><td rowspan=3>toolmain</td><td><font color=#333>默认</font></td><td rowspan=3>主题通用</td></tr>
<tr><td><font color=#333>铁塔</font></td></tr>
<tr><td><font color=#333>江苏</font></td></tr>
<tr><td rowspan=3>frame</td><td bgcolor=#0a2b4c><font color=#fff>默认</font></td><td rowspan=3>框架通用</td></tr>
<tr><td><font color=#333>铁塔</font></td></tr>
<tr><td><font color=#333>江苏</font></td></tr>
<tr><td rowspan=3>subframe</td><td bgcolor=#0c355e><font color=#afc0d0>默认</font></td><td rowspan=3>框架菜单</td></tr>
<tr><td><font color=#606266>铁塔</font></td></tr>
<tr><td><font color=#606266>江苏</font></td></tr>
<tr><td rowspan=3>frametree</td><td bgcolor=#0c355e><font color=#afc0d0>默认</font></td><td rowspan=3>框架菜单树</td></tr>
<tr><td bgcolor=#89040e><font color=#fff>铁塔</font></td></tr>
<tr><td bgcolor=#0081cc><font color=#fff>江苏</font></td></tr>
<tr><td rowspan=3>emphasize</td><td><font color=#409eff>默认</font></td><td rowspan=3>强调色</td></tr>
<tr><td><font color=#e70012>铁塔</font></td></tr>
<tr><td><font color=#0081cc>江苏</font></td></tr>
<tr><td rowspan=3>special-emp</td><td><font color=#45fffd>默认</font></td><td rowspan=3>特殊强调色</td></tr>
<tr><td><font color=#ffb6bc>铁塔</font></td></tr>
<tr><td><font color=#9bdaff>江苏</font></td></tr>
<tr><td rowspan=3>special-emp1</td><td><font color=#45fffd>默认</font></td><td rowspan=3>特殊强调色1</td></tr>
<tr><td><font color=#e70012>铁塔</font></td></tr>
<tr><td><font color=#0081cc>江苏</font></td></tr>
<tr><td rowspan=3>tbIcon</td><td><font color=#409eff>默认</font></td><td rowspan=3>表格内操作按钮</td></tr>
<tr><td><font color=#909399>铁塔</font></td></tr>
<tr><td><font color=#909399>江苏</font></td></tr>
<tr><td rowspan=3>tbIcon-emp</td><td><font color=#b3d8ff>默认</font></td><td rowspan=3>表格内操作按钮-移入</td></tr>
<tr><td><font color=#f9b1b1>铁塔</font></td></tr>
<tr><td><font color=#66b3e0>江苏</font></td></tr>
<tr><td rowspan=3>disabled</td><td><font color=#c8c9cc>默认</font></td><td rowspan=3>表格内操作按钮-禁用</td></tr>
<tr><td><font color=#c8c9cc>铁塔</font></td></tr>
<tr><td><font color=#c8c9cc>江苏</font></td></tr>
<tr><td rowspan=3>subtagicon</td><td><font color=#afc0d0>默认</font></td><td rowspan=3>提示信息图标</td></tr>
<tr><td><font color=#f89e9e>铁塔</font></td></tr>
<tr><td><font color=#66b3e0>江苏</font></td></tr>
<tr><td rowspan=3>indark</td><td bgcolor=#2f5277><font color=#afc0d0>默认</font></td><td rowspan=3>深色面板下的文字颜色</td></tr>
<tr><td bgcolor=#606266><font color=#ddd>铁塔</font></td></tr>
<tr><td bgcolor=#606266><font color=#ddd>江苏</font></td></tr>
<tr><td rowspan=3>activelabelIndark</td><td bgcolor=#2f5277><font color=#409eff>默认</font></td><td rowspan=3>深色面板下的多选复选框选中文字颜色（切换到铁塔时，只需变化选中框色值）</td></tr>
<tr><td bgcolor=#606266><font color=#ddd>铁塔</font></td></tr>
<tr><td bgcolor=#606266><font color=#ddd>江苏</font></td></tr>
</table>

### 边框色
<table>
<tr><td>变量名</td><td>展示效果</td><td>主题</td><td>使用场景</td></tr>
<tr><td rowspan=3>toolmain</td><td style="border-bottom: 2px solid #0a2b4c"></td><td>默认</td><td rowspan=3>深色背景下输入框边框</td></tr>
<tr><td  style="border-bottom: 2px solid #DCDFE6"></td><td>铁塔</td></tr>
<tr><td  style="border-bottom: 2px solid #DCDFE6"></td><td>江苏</td></tr>
<tr><td rowspan=3>toolsub</td><td style="border-bottom: 2px solid #0a2b4c"></td><td>默认</td><td rowspan=3>一级菜单边框</td></tr>
<tr><td  style="border-bottom: 2px solid #450308"></td><td>铁塔</td></tr>
<tr><td  style="border-bottom: 2px solid #021c2b"></td><td>江苏</td></tr>
<tr><td rowspan=3>tooltrd</td><td style="border-bottom: 2px solid #577ea5"></td><td>默认</td><td rowspan=3>二级菜单边框</td></tr>
<tr><td  style="border-bottom: 2px solid #dfe0e0"></td><td>铁塔</td></tr>
<tr><td  style="border-bottom: 2px solid #dfe0e0"></td><td>江苏</td></tr>
<tr><td rowspan=3>frame-head</td><td style="border-bottom: 3px solid #0a2b4c"></td><td>默认</td><td rowspan=3>框架头部底边(统一使用3px的底边)</td></tr>
<tr><td  style="border-bottom: 3px solid #e70012"></td><td>铁塔</td></tr>
<tr><td  style="border-bottom: 3px solid #0081cc"></td><td>江苏</td></tr>
<tr><td rowspan=3>toolthead</td><td style="border-bottom: 2px solid #409eff"></td><td>默认</td><td rowspan=3>表格头部底边(统一使用2px的底边)</td></tr>
<tr><td  style="border-bottom: 2px solid #e70012"></td><td>铁塔</td></tr>
<tr><td  style="border-bottom: 2px solid #0081cc"></td><td>江苏</td></tr>
<tr><td rowspan=3>darkTodark</td><td bgcolor=#0c345e style="border-bottom: 2px solid #0a2b4c"></td><td>默认</td><td rowspan=3>深色背景下的输入框边框</td></tr>
<tr><td bgcolor=#3b3c3e style="border-bottom: 2px solid #181819"></td><td>铁塔</td></tr>
<tr><td bgcolor=#3b3c3e style="border-bottom: 2px solid #181819"></td><td>江苏</td></tr>
</table>

## 变量说明参考图
>![An image](./img/themedesc.png)

## 版本说明
**v1.0.23**
 - 1.为避免style-color方法与可视化组件主题方法重复，此版本中将名称修改为style-tool-color
 - 2.调整了部分变量名称，如main->toolmain
 
**v1.0.24**
- 1.新增边框变量toolsub，tooltrd; 文字变量special-emp

**v1.0.25**
- 1.将主题组变量改为$themes-tool，避免与原可视化组件主题冲突
- 2.changeTheme方法中原先直接修改body的class方法调整为classList.add

**v1.0.26**
- 1.新增背景变量newtab,design-subhead,design-pane,design-paneform
- 2.重置公共样式.el-header.design-page,.head-opt-btn,.field-tb-wrap

**v1.0.27**
- 1.新增目录树样式重置.el-tree-node
- 2.新增背景变量：通用标题左侧图标maintitle，特殊样式标签强调tagitem
- 3.新增字体颜色变量：提示信息图标subtagicon

**v1.0.28**
- 1.全局重置下拉面板样式
- 2.新增背景变量：块面选中背景色blockselect
- 3.更新样式.field-tb-wrap

**v1.0.29**
- 1.全局重置vxe-table，handsontable样式
- 2.开放主题下可用取色板调整主色调--目前只支持默认主题的调整
- 3.element的index.css统一用本地方式引入

**v1.0.31**
- 1.文件名colorPlugin改为Color
- 2.解决ele样式被覆盖问题，需注意，如果项目中有引用vue-nl-interaction-sql插件，需更新到0.1.253以上

**v1.0.34**
- 1.style-tool-color方法中的参数新增nochange,表示无论在什么主题下都不需要改变颜色, @include style-tool-color('background-color', $bg-clr03, nochange);

**v1.0.36**
- 1.客户确认铁塔样式后的调整：修改一级菜单背景色，新增文字颜色变量frametree, 深色到深色背景情况下表单的边框色darkTodark变量

**v1.0.37**
- 1.新增深色到深色背景情况下表单的边框色darkTodark变量

**v1.0.38-39**
- 1.修改index.css中的.el-dialog和.el-loading-mask样式，与项目样式一直，否则会覆盖项目中的设置
- 2.新增变量sepline1,sepline2,sepline3,tipblock,indark,specialblock
- 3.ToolThemeMgt.js中新增setTheme设置theme

**v1.0.40-42**
- 1.index.css要以压缩的形式，否则会造成页面卡死
- 2.交互式sql组件样式换肤设置

**v1.0.43-46**
- 1.主题走缓存sessionStorage.getItem('toolTheme')

**v1.0.47**
- 1.重置穿梭框样式--统一为圆形上下排列
- 2.更新js方式颜色json配置(新增了bgColor)

**v1.0.48**
- 1.和样稿核对后，修改变量tbIcon值为#909399
- 2.和样稿核对后，修改变量design-paneform值为#3b3c3e
- 3.和样稿核对后，修改变量darkTodark值为#181819
- 4.和样稿核对后，修改变量toolsub值为#450308
- 5.和样稿核对后，修改变量special-emp值为#ffb6bc

**v1.0.49**
- 1.表格样式重置中去掉表头的text-align:center;

**v1.0.50**
- 1.深色背景下选中文字颜色变量activelabelIndark(铁塔深色背景下的强调色如果用主色调会看不清晰)
- 2.下拉树样式reset, 下拉树要加上.el-select-dropdown前缀，否则会影响树
- 3.给表格内图标新增禁用样式变量disabled

**v1.0.51-57**
- 1.ie不支持css的变量--* var()写法, 因此版本中暂时改成普通写法，普通写法就不能满足色板取色实现一键换肤，这个后面优化
- 2.新增大块面背景色变量bigblock,适用于大块面填充的背景色
- 3.更新交互式样式
- 4.代码规范：如果是纯字符串，不允许使用模版字符串
- 5.新增小块面变量midblock,适用于比较集中的小块面

**v1.0.58-60**
- 1.交互式公共样式调整
- 2.弹窗样式统一
- 3.滚动条样式重置
- 4.el-table表格不用border属性时，给表格加上样式bd-table，保证样式的统一

**v1.0.65-69**
- 1.新增江苏主题色系
- 2.theme主题新增名称的时候注意尽量不要用到css中的关键字，例如lightblue这种，会导致报错
