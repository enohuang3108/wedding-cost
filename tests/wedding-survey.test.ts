import { expect, test } from '@playwright/test';

test.describe('婚禮花費問卷測試', () => {
	test.beforeEach(async ({ page }) => {
		// 每個測試前先打開頁面
		await page.goto('/');
	});

	test('頁面載入測試', async ({ page }) => {
		// 檢查標題是否正確顯示
		const title = page.getByRole('heading', {
			name: '婚禮花費問卷',
			level: 1,
		});
		await expect(title).toBeVisible();

		// 檢查第一個問題是否顯示
		const firstQuestion = page.getByText('婚宴費用');
		await expect(firstQuestion).toBeVisible();

		// 檢查進度顯示
		const progressText = page.getByText('問題 1 / 9');
		await expect(progressText).toBeVisible();
	});

	test('滑桿操作測試', async ({ page }) => {
		const slider = page.locator('input[type="range"]');
		await expect(slider).toBeVisible();

		const valueTextLocator = page.locator('.text-lg.font-medium.text-blue-700');
		// 假設第一個問題的初始值總是 "0"
		await expect(valueTextLocator).toHaveText('0');

		// 從滑桿屬性動態獲取 min, max, step
		const minString = await slider.getAttribute('min');
		const maxString = await slider.getAttribute('max');
		const stepString = await slider.getAttribute('step');

		const min = minString ? Number(minString) : 0;
		const max = maxString ? Number(maxString) : 100000; // 預設一個最大值以防萬一
		const step = stepString ? Number(stepString) : 1; // 預設一個步長以防萬一

		// 計算一個新的、非零的、有效的滑桿值 (例如，從最小值開始移動5個步長)
		let newValue = min + step * 5;
		newValue = Math.min(newValue, max); // 確保不超過最大值
		newValue = Math.max(newValue, min); // 確保不小於最小值

		// 使用 fill() 方法設定滑桿值，它通常能更好地模擬用戶輸入並觸發相關事件
		await slider.fill(String(newValue));

		// 直接等待並驗證顯示的文字是否已更新為新的期望值
		const expectedNewValueText = newValue.toLocaleString();
		await expect(valueTextLocator).toHaveText(expectedNewValueText, {
			timeout: 10000,
		}); // 增加超時至10秒
	});

	test('導航按鈕測試', async ({ page }) => {
		// 檢查初始狀態
		const progressText = page.getByText('問題 1 / 9');
		await expect(progressText).toBeVisible();

		// 初始時「上一題」按鈕應該被禁用
		const prevButton = page.getByRole('button', { name: '上一題' });
		await expect(prevButton).toBeDisabled();

		// 點擊「下一題」按鈕
		const nextButton = page.getByRole('button', { name: '下一題' });
		await nextButton.click();

		// 檢查是否進入第二題
		await expect(page.getByText('問題 2 / 9')).toBeVisible();

		// 現在「上一題」按鈕應該可用
		await expect(prevButton).toBeEnabled();

		// 點擊「上一題」返回第一題
		await prevButton.click();
		await expect(page.getByText('問題 1 / 9')).toBeVisible();
	});

	test('最後一題按鈕測試', async ({ page }) => {
		// 點擊「下一題」直到到達最後一題
		for (let i = 0; i < 8; i++) {
			const nextButton = page.getByRole('button', { name: '下一題' });
			await nextButton.click();
		}

		// 檢查是否到最後一題
		await expect(page.getByText('問題 9 / 9')).toBeVisible();

		// 檢查「提交問卷」按鈕是否出現
		const submitButton = page.getByRole('button', { name: '提交問卷' });
		await expect(submitButton).toBeVisible();

		// 確認「下一題」按鈕不再顯示
		const nextButton = page.getByRole('button', { name: '下一題' });
		await expect(nextButton).not.toBeVisible();
	});

	test('提交問卷功能測試', async ({ page }) => {
		// 點擊「下一題」直到到達最後一題
		for (let i = 0; i < 8; i++) {
			const nextButton = page.getByRole('button', { name: '下一題' });
			await nextButton.click();
		}

		// 設置監聽 console.log
		let loggedAnswers = '';
		page.on('console', msg => {
			if (msg.text().includes('Submitted Answers:')) {
				loggedAnswers = msg.text();
			}
		});

		// 監聽 dialog 事件
		let dialogShown = false;
		page.on('dialog', async dialog => {
			expect(dialog.message()).toBe('問卷已提交！答案已記錄在 console。');
			dialogShown = true;
			await dialog.accept();
		});

		// 點擊提交按鈕
		const submitButton = page.getByRole('button', { name: '提交問卷' });
		await submitButton.click();

		// 檢查是否顯示提交完成提示
		await page.waitForTimeout(500); // 給點時間讓 dialog 顯示
		expect(dialogShown).toBe(true);

		// 檢查是否有輸出到 console
		expect(loggedAnswers).toContain('Submitted Answers:');
	});
});
