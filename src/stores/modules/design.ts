import type { CollapseType, LayoutType } from '@/config/design';
import { defineStore } from 'pinia';
import designSetting from '@/config/design';

const {
  darkMode: reDarkMode,
  themeColor,
  themeColorList,
  isPageAnimate,
  pageAnimateType: rePageAnimateType,
  layout: reLayout,
  collapseType: reCollapseType,
  isCollapse: reIsCollapse,
  isCollapseConversationList: reIsCollapseConversationList,

} = designSetting;

export const useDesignStore = defineStore(
  'design',
  () => {
    const darkMode = ref(reDarkMode);
    const setDarkMode = (modeType: 'light' | 'dark' | 'inverted') => {
      darkMode.value = modeType;
    };

    const pageAnimateType = ref(rePageAnimateType);

    const setPageAnimateType = (type: string) => {
      pageAnimateType.value = type;
    };

    const layout = ref<LayoutType>(reLayout);

    // 当前只有一个布局，暂时不将这个方法暴露出去
    // const _setLayout = (layoutType: LayoutType) => {
    const _setLayout = (layoutType: any) => {
      layout.value = layoutType;
    };

    // 折叠状态
    const collapseType = ref<CollapseType>(reCollapseType);
    const setCollapseType = (type: CollapseType) => {
      collapseType.value = type;
    };

    // 最终是否展开左侧菜单
    const isCollapse = ref<boolean>(reIsCollapse);
    const setCollapse = (collapseFinal: boolean) => {
      console.log('c---', collapseFinal);
      isCollapse.value = collapseFinal;
    };
    const toggleCollapse = () => {
      isCollapse.value = !isCollapse.value;
    };
    // 新- 对话列表折叠
    const isCollapseConversationList = ref<boolean>(reIsCollapseConversationList);
    const setIsCollapseConversationList = (collapseFinal: boolean) => {
      isCollapseConversationList.value = collapseFinal;
    };
    const toggleCollapseConversationList = () => {
      isCollapseConversationList.value = !isCollapseConversationList.value;
    };
    return {
      darkMode,
      setDarkMode,
      themeColor: ref(themeColor),
      themeColorList: ref(themeColorList),
      isPageAnimate: ref(isPageAnimate),
      pageAnimateType,
      setPageAnimateType,
      layout,
      collapseType,
      setCollapseType,
      isCollapse,
      setCollapse,
      _setLayout,
      toggleCollapse,
      isCollapseConversationList,
      setIsCollapseConversationList,
      toggleCollapseConversationList,
    };
  },
  {
    persist: true,
  },
);
