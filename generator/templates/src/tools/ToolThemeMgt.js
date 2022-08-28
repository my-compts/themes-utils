const ToolThemeMgt = {
  namespaced: true,
  state: {
    toolColors: {},
    theme: 'default'
  },
  mutations: {
    setToolColors(state, data) {
      state.toolColors = data;
    },
    setTheme(state, data) {
      sessionStorage.setItem('toolTheme', data);
      state.theme = data;
    }
  },
  actions: {
    setToolColors({ commit }, data) {
      commit('setToolColors', data);
    },
    setTheme({ commit }, data) {
      commit('setTheme', data);
    }
  }
};
export default ToolThemeMgt;
