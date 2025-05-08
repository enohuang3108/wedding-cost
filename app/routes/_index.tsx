import { useState } from 'react';

export default function Index() {
	const questions = [
		{ id: 'banquet', label: '婚宴費用', min: 0, max: 1000000, step: 10000 },
		{
			id: 'preWeddingPhoto',
			label: '婚紗攝影',
			min: 0,
			max: 200000,
			step: 1000,
		},
		{
			id: 'dressRental',
			label: '婚紗租借／訂製',
			min: 0,
			max: 150000,
			step: 1000,
		},
		{ id: 'mc', label: '婚禮主持人', min: 0, max: 50000, step: 500 },
		{
			id: 'favorsDecor',
			label: '婚禮小物與佈置',
			min: 0,
			max: 100000,
			step: 1000,
		},
		{
			id: 'cakesGiftBoxes',
			label: '喜餅與禮盒',
			min: 0,
			max: 150000,
			step: 1000,
		},
		{
			id: 'betrothalMoney',
			label: '聘金與禮金',
			min: 0,
			max: 600000,
			step: 10000,
		},
		{ id: 'bridalMakeup', label: '新娘秘書', min: 0, max: 80000, step: 1000 },
		{
			id: 'weddingDayPhoto',
			label: '婚禮攝影',
			min: 0,
			max: 100000,
			step: 1000,
		},
	];

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState(() => {
		const initialAnswers: { [key: string]: number } = {};
		questions.forEach(q => {
			initialAnswers[q.id] = q.min !== undefined ? q.min : 0;
		});
		return initialAnswers;
	});

	const currentQuestion = questions[currentQuestionIndex];

	const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAnswers({
			...answers,
			[currentQuestion.id]: Number(event.target.value),
		});
	};

	const handleNext = () => {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		}
	};

	const handlePrevious = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
		}
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// 在這裡處理表單提交邏輯，例如將 `answers` 送到後端
		console.log('Submitted Answers:', answers);
		alert('問卷已提交！答案已記錄在 console。');
	};

	const progressPercentage =
		((currentQuestionIndex + 1) / questions.length) * 100;

	return (
		<div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
			<div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl sm:p-8">
				<h1 className="mb-6 text-center text-2xl font-bold text-gray-800 sm:text-3xl">
					婚禮花費問卷
				</h1>

				{/* Progress Bar */}
				<div className="mb-6">
					<div className="text-sm text-gray-600">
						問題 {currentQuestionIndex + 1} / {questions.length}
					</div>
					<div className="mt-1 h-2.5 w-full rounded-full bg-gray-200">
						<div
							className="h-2.5 rounded-full bg-blue-600 transition-all duration-300 ease-out"
							style={{ width: `${progressPercentage}%` }}
						></div>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-8">
					<div key={currentQuestion.id} className="flex flex-col">
						<label
							htmlFor={currentQuestion.id}
							className="mb-3 text-lg font-semibold text-gray-700"
						>
							{currentQuestion.label}
						</label>
						<input
							type="range"
							id={currentQuestion.id}
							name={currentQuestion.id}
							min={currentQuestion.min}
							max={currentQuestion.max}
							step={currentQuestion.step}
							value={answers[currentQuestion.id]}
							onChange={handleSliderChange}
							className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
						/>
						<div className="mt-2 text-right text-lg font-medium text-blue-700">
							{answers[currentQuestion.id]?.toLocaleString() ??
								currentQuestion.min?.toLocaleString() ??
								'0'}
						</div>
					</div>

					<div className="mt-8 flex justify-between">
						<button
							type="button"
							onClick={handlePrevious}
							disabled={currentQuestionIndex === 0}
							className="rounded-md bg-gray-300 px-6 py-2.5 text-lg font-semibold text-gray-700 hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
						>
							上一題
						</button>

						{currentQuestionIndex < questions.length - 1 ? (
							<button
								type="button"
								onClick={handleNext}
								className="rounded-md bg-blue-600 px-6 py-2.5 text-lg font-semibold text-white hover:bg-blue-700"
							>
								下一題
							</button>
						) : (
							<button
								type="submit"
								className="rounded-md bg-green-600 px-6 py-2.5 text-lg font-semibold text-white hover:bg-green-700"
							>
								提交問卷
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}
