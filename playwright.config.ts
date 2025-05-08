import { defineConfig, devices } from '@playwright/test';

// 設置環境變量和端口
const PORT = process.env.PORT || '3000';
const CI = !!process.env.CI;

export default defineConfig({
	// 測試文件位置
	testDir: './tests',
	// 測試檔案模式
	testMatch: '**/*.test.ts',
	// 每個測試的超時時間 (本地和 CI 均為 30 秒)
	timeout: 30 * 1000,
	// 每個斷言的超時時間
	expect: {
		timeout: 5 * 1000,
	},
	// 在 CI 環境中不允許只運行特定的測試
	forbidOnly: CI,
	// CI 環境中的重試次數
	retries: CI ? 2 : 0,
	// CI 環境中使用較少的並行工作進程
	workers: CI ? 1 : undefined,
	// 測試報告格式
	reporter: [
		['html', { open: CI ? 'never' : 'on-failure' }],
		['list', { printSteps: true }],
	],
	// 通用設置
	use: {
		// 基本 URL
		baseURL: `http://localhost:${PORT}`,
		// 捕獲追蹤
		trace: CI ? 'on-first-retry' : 'on',
		// 捕獲截圖
		screenshot: CI ? 'only-on-failure' : 'on',
		// 視頻錄製
		video: CI ? 'on-first-retry' : 'on-first-retry',
	},

	// 設定多瀏覽器專案
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
			},
		},
		// 在 CI 中取消下面的註釋來測試更多瀏覽器
		// {
		//   name: 'firefox',
		//   use: {
		//     ...devices['Desktop Firefox'],
		//   },
		// },
		// {
		//   name: 'webkit',
		//   use: {
		//     ...devices['Desktop Safari'],
		//   },
		// },
	],

	// 啟動 web 服務器
	webServer: {
		command: CI
			? `pnpm run build && pnpm exec wrangler dev --port ${PORT}`
			: `pnpm exec remix vite:dev --port ${PORT} --strictPort`,
		url: `http://localhost:${PORT}`,
		reuseExistingServer: !CI,
		timeout: 120 * 1000, // 增加 webServer 超時至 120 秒
		// stdout: 'pipe', // 如果使用 url，這些通常不是必需的
		// stderr: 'pipe',
	},
});
