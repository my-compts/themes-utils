<template>
  <div
    v-show="true"
    style="position: absolute;"
  >
    <el-radio-group
      v-model="curComptTheme"
    >
      <el-radio label="default">
        默认
      </el-radio>
      <el-radio label="lightred">
        铁塔
      </el-radio>
      <el-radio label="jsblue">
        江苏
      </el-radio>
    </el-radio-group>
    <el-color-picker
      v-if="curComptTheme === 'default'"
      v-model="curMainColor"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { THEME_DATA, eleThemeChange, colorPickChange } from './tools/ThemeObject';
export default {
  name: 'ThemeControl',
  data () {
    return {
      curComptTheme: '',
      curMainColor: '#409eff'
    };
  },
  mounted () {
    this.curComptTheme = sessionStorage.getItem('toolTheme') || this.theme;
  },
  computed: {
    ...mapState({
      theme: state => state.ToolThemeMgt.theme
    })
  },
  watch: {
    curComptTheme (nv, ov) {
      this.changeTheme(nv, ov);
    },
    theme (nv, ov) {
      this.changeTheme(nv, ov);
    },
    curMainColor: {
      handler (nv, ov) {
        if (!nv) {
          return;
        }
        this.changeColor(nv);
        this.changeEle(nv, ov);
      }
    }
  },
  methods: {
    ...mapActions({
      setToolColors: 'ToolThemeMgt/setToolColors'
    }),
    changeColor (curMainColor) {
      document.getElementsByTagName('body')[0].style.setProperty('--color-main', curMainColor);
      let colorMains = colorPickChange(curMainColor);
      Object.keys(colorMains).forEach((color, index) => {
        let property = `--color3_${index}`;
        if (color === 'mainColor' && index === colorMains.length - 1) {
          property = '--color-main';
        }
        document.getElementsByTagName('body')[0].style.setProperty(property, colorMains[color]);
      });
    },
    changeTheme (nv, ov) {
      // 获取当前主题的色彩配置信息themeData存到vuex中
      let toolColors = THEME_DATA[`theme-${nv}`];
      let oldToolColors = THEME_DATA[`theme-${ov}`] || '';
      this.setToolColors(toolColors);
      document.getElementsByTagName('body')[0].classList.remove(`tool-theme-${ov}`);
      document.getElementsByTagName('body')[0].classList.add(`tool-theme-${nv}`);
      if (nv === 'default') { // 只在默认default的皮肤下才提供颜色提取换肤
        this.changeEle(this.curMainColor || toolColors['mainColor'], oldToolColors['mainColor']);
      } else {
        this.changeEle(toolColors['mainColor'], this.curMainColor || oldToolColors['mainColor']);
      }
    },
    changeEle (nv, ov) {
      // 调用改变elementui主色调方法
      eleThemeChange(nv, ov || '#409eff');
    }
  }
};
</script>

<style>
</style>
