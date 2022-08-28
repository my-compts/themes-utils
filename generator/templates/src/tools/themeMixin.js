import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      toolColors: state => state.ToolThemeMgt.toolColors
    })
  }
};
