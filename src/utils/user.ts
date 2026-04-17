import { useUserStore } from '@/stores/index.js';

// 判断是否是 VIP 用户
export function isUserVip(): boolean {
  const userStore = useUserStore();
  return userStore?.userInfo?.isVip;
}

// 判断是否是企业用户
export function isUserCompany(): boolean {
  const userStore = useUserStore();
  return userStore?.userInfo?.isCompany || false;
}
// 判断是否意管理员角色
export function isAdminRole(): boolean {
  const userStore = useUserStore();
  return userStore?.userInfo?.roles?.some(item => item.roleCode === 'admin') || false;
}

// 返回用户角色名称数组
export function getUserRoleNames(): string[] {
  const userStore = useUserStore();
  return userStore?.userInfo?.roles?.map(item => item.roleCode) || [];
}

// 用户头像
export function getUserProfilePicture(): string {
  const userStore = useUserStore();
  return userStore.userInfo?.user?.icon
    ? `https://ccnetcore.com/${import.meta.env.VITE_WEB_BASE_API}/file/${userStore.userInfo.user.icon}`
    : `/images/user.png`;
}
// 系统头像（可以常量）
export const systemProfilePicture = `/images/logo.png`;

// 获取微信二维码类型
// 获取二维码 LoginOrRegister 登录注册, Bind 绑定
export const WECHAT_QRCODE_TYPE = {
  LoginOrRegister: 'LoginOrRegister',
  Bind: 'Bind',
};
