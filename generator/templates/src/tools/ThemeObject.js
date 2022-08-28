import Color from './Color';
const THEME_DATA = require('../variables/toolThemes.json');
// const version = require('element-ui/package.json').version;
// const Color = require('./colorPlugins').Color;
// 如果themedata有需要特殊处理，可以在此处写具体处理逻辑

// elementui主色调改变方法
let chalk = '';
const eleThemeChange = (val, oldVal) => {
  if (typeof val !== 'string') return;
  const themeCluster = getThemeCluster(val.replace('#', ''));
  const originalCluster = getThemeCluster(oldVal.replace('#', ''));
  const getHandler = (variable, id) => {
    return () => {
      const newStyle = updateStyle(chalk, originalCluster, themeCluster);

      let styleTag = document.getElementById(id);
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.setAttribute('id', id);
        document.head.appendChild(styleTag);
      }
      styleTag.innerText = newStyle;
    };
  };

  const chalkHandler = getHandler('chalk', 'chalk-style');
  if (!chalk) {
    // const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;
    const url = './theme/index.css';
    getCSSString(url, chalkHandler, 'chalk');
  } else {
    chalkHandler();
  }

  const styles = [].slice.call(document.querySelectorAll('style'))
    .filter(style => {
      const text = style.innerText;
      return new RegExp(oldVal, 'i').test(text) && /toolTheme Variables/.test(text);
    });
  styles.forEach(style => {
    const { innerText } = style;
    if (typeof innerText !== 'string') return;
    style.innerText = updateStyle(innerText, originalCluster, themeCluster);
  });
};
const updateStyle = (style, oldCluster, newCluster) => {
  let newStyle = style;
  oldCluster.forEach((color, index) => {
    newStyle = newStyle.replace(new RegExp(color, 'ig'), `${newCluster[index]}`);
  });
  chalk = newStyle;
  return newStyle;
};

const getCSSString = (url, callback, variable) => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      chalk = xhr.responseText.replace(/@font-face{[^}]+}/, '');
      callback();
    }
  };
  xhr.open('GET', url);
  xhr.send();
};

const getThemeCluster = (theme) => {
  const tintColor = (color, tint) => {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);

    if (tint === 0) { // when primary color is in its rgb space
      return [red, green, blue].join(',');
    } else {
      red += Math.round(tint * (255 - red));
      green += Math.round(tint * (255 - green));
      blue += Math.round(tint * (255 - blue));

      red = red.toString(16);
      green = green.toString(16);
      blue = blue.toString(16);

      return `#${red}${green}${blue}`;
    }
  };

  const shadeColor = (color, shade) => {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);

    red = Math.round((1 - shade) * red);
    green = Math.round((1 - shade) * green);
    blue = Math.round((1 - shade) * blue);

    red = red.toString(16);
    green = green.toString(16);
    blue = blue.toString(16);

    return `#${red}${green}${blue}`;
  };

  const clusters = [theme];
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
  }
  clusters.push(shadeColor(theme, 0.1));
  return clusters;
};
// elementui主色调改变方法
const eleColorPickChange = (mainColor) => {
  let amount = 0.037;
  let retColor = [mainColor];
  for (let i = 1; i < 11; i++) {
    let colorExchange = Color(mainColor).lightenByAmount(amount * i).toCSS();
    if (i === 11) {
      colorExchange = Color(mainColor).setLightness(0.564).setSaturation(0.774).toCSS();
    }
    retColor.push(colorExchange);
  }
  return retColor;
};
// 取色器改变颜色
const colorPickChange = (mainColor) => {
  let colorMain0 = Color(mainColor).setSaturation(0.767).setLightness(0.168).toCSS();
  let curMainColor = colorMain0;
  let colorMain1 = Color(curMainColor).lightenByAmount(0.061).toCSS();
  let colorMain2 = Color(curMainColor).lightenByAmount(0.157).setSaturation(0.4337).toCSS();
  let colorMain3 = Color(curMainColor).lightenByAmount(0.583).setSaturation(0.26).toCSS();
  let colorMain4 = Color(curMainColor).lightenByAmount(0.04).toCSS();
  let colorMain5 = Color(curMainColor).setLightness(0.494).setSaturation(0.31).toCSS();
  let colorMain6 = Color(mainColor).setLightness(0.962).toCSS();
  let colorMain7 = Color(mainColor).setLightness(0.925).toCSS();
  let colorMain8 = Color(mainColor).setLightness(0.851).toCSS();
  let colorMain9 = Color(mainColor).setLightness(0.409).setSaturation(0.301).toCSS();
  return {
    colorMain0,
    colorMain1,
    colorMain2,
    colorMain3,
    colorMain4,
    colorMain5,
    colorMain6,
    colorMain7,
    colorMain8,
    colorMain9,
    mainColor
  };
};

export { THEME_DATA, eleThemeChange, colorPickChange, eleColorPickChange };
