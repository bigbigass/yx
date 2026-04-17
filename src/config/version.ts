/**
 * 应用版本配置
 * 集中管理应用版本信息
 *
 * ⚠️ 注意：修改此处版本号即可，vite.config.ts 会自动读取
 */

// 主版本号 - 修改此处即可同步更新所有地方的版本显示
export const APP_VERSION = '4.0.1';

// 应用名称
export const APP_NAME = '意心AI';

// 完整名称（名称 + 版本）
export const APP_FULL_NAME = `${APP_NAME} ${APP_VERSION}`;

// 构建信息（由 vite 注入）
declare const __GIT_BRANCH__: string;
declare const __GIT_HASH__: string;
declare const __GIT_DATE__: string;
declare const __BUILD_TIME__: string;

// 版本信息（由 vite 注入）
declare const __APP_VERSION__: string;
declare const __APP_NAME__: string;

export interface BuildInfo {
  version: string;
  name: string;
  gitBranch: string;
  gitHash: string;
  gitDate: string;
  buildTime: string;
}

// 获取完整构建信息
export function getBuildInfo(): BuildInfo {
  return {
    version: APP_VERSION,
    name: APP_NAME,
    gitBranch: typeof __GIT_BRANCH__ !== 'undefined' ? __GIT_BRANCH__ : 'unknown',
    gitHash: typeof __GIT_HASH__ !== 'undefined' ? __GIT_HASH__ : 'unknown',
    gitDate: typeof __GIT_DATE__ !== 'undefined' ? __GIT_DATE__ : 'unknown',
    buildTime: typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : new Date().toISOString(),
  };
}

// 在控制台输出构建信息
export function logBuildInfo(): void {
  console.log(
    `%c ${APP_NAME} ${APP_VERSION} %c Build Info `,
    'background:#35495e; padding: 4px; border-radius: 3px 0 0 3px; color: #fff',
    'background:#41b883; padding: 4px; border-radius: 0 3px 3px 0; color: #fff',
  );
  const info = getBuildInfo();
  console.log(`🔹 Version: ${info.version}`);
  // console.log(`🔹 Git Branch: ${info.gitBranch}`);
  console.log(`🔹 Git Commit: ${info.gitHash}`);
  // console.log(`🔹 Commit Date: ${info.gitDate}`);
  // console.log(`🔹 Build Time: ${info.buildTime}`);
}
