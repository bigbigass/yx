import { defineStore } from 'pinia';

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string>();
    const refreshToken = ref<string | undefined>();
    const setToken = (value: string, refreshValue?: string) => {
      token.value = value;
      if (refreshValue) {
        refreshToken.value = refreshValue;
      }
    };
    const clearToken = () => {
      token.value = void 0;
      refreshToken.value = void 0;
    };

    const userInfo = ref<any>();
    const setUserInfo = (value: any) => {
      userInfo.value = value;
    };
    const clearUserInfo = () => {
      userInfo.value = void 0;
    };

    const logout = async () => {
      // 如果需要调用接口，可以在这里调用
      clearToken();
      clearUserInfo();
      // 不在 logout 中进行路由跳转，由调用方决定跳转逻辑
      // 这样可以避免路由守卫中的循环重定向问题
    };

    // 新增：登录弹框状态
    const isLoginDialogVisible = ref(false);

    // 新增：打开弹框方法
    const openLoginDialog = () => {
      isLoginDialogVisible.value = true;
    };

    // 新增：关闭弹框方法（可根据需求扩展）
    const closeLoginDialog = () => {
      isLoginDialogVisible.value = false;
    };

    // 新增：用户中心弹框状态和激活标签
    const isUserCenterVisible = ref(false);
    const userCenterActiveTab = ref('user');

    // 新增：打开用户中心方法
    const openUserCenter = (tab: string = 'user') => {
      isUserCenterVisible.value = true;
      userCenterActiveTab.value = tab;
    };

    // 新增：关闭用户中心方法
    const closeUserCenter = () => {
      isUserCenterVisible.value = false;
    };

    return {
      token,
      refreshToken,
      setToken,
      clearToken,
      userInfo,
      setUserInfo,
      clearUserInfo,
      logout,
      // 新增：暴露弹框状态和方法
      isLoginDialogVisible,
      openLoginDialog,
      closeLoginDialog,
      // 新增：暴露用户中心状态和方法
      isUserCenterVisible,
      userCenterActiveTab,
      openUserCenter,
      closeUserCenter,
    };
  },
  {
    persist: true,
  },
);
