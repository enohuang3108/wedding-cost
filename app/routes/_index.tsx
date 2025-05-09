import { useState } from 'react';
import { Progress } from '~/components/ui/progress';
import { Slider } from '~/components/ui/slider';

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

	const handleSliderChange = (value: number[]) => {
		setAnswers({
			...answers,
			[currentQuestion.id]: value[0],
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
		<div className="container mx-auto flex min-h-screen flex-col items-center justify-center">
			<div className="fixed top-0 h-2.5 w-full bg-gray-200">
				<Progress
					value={progressPercentage}
					className="h-2.5 rounded-r-full transition-all duration-300 ease-out [&>div]:bg-red-600"
				/>
			</div>
			<div className="w-full max-w-xl">
				<h1 className="mb-6 text-center text-2xl font-bold text-gray-800 sm:text-3xl">
					{currentQuestion.label}
				</h1>

				<form onSubmit={handleSubmit} className="space-y-8">
					<div key={currentQuestion.id} className="flex flex-col">
						<div className="mb-2 text-center text-2xl font-bold text-red-700">
							{answers[currentQuestion.id]?.toLocaleString() ??
								currentQuestion.min?.toLocaleString() ??
								'0'}
						</div>
						<Slider
							id={currentQuestion.id}
							name={currentQuestion.id}
							min={currentQuestion.min}
							max={currentQuestion.max}
							step={currentQuestion.step}
							value={[answers[currentQuestion.id]]}
							onValueChange={handleSliderChange}
							className="accent-red-600"
						/>
						<div className="mt-1 flex justify-between text-sm text-gray-500">
							<span>{currentQuestion.min?.toLocaleString() ?? '0'}</span>
							<span>{currentQuestion.max?.toLocaleString() ?? 'N/A'}</span>
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
								className="rounded-md bg-red-600 px-6 py-2.5 text-lg font-semibold text-white hover:bg-red-700"
							>
								下一題
							</button>
						) : (
							<button
								type="submit"
								className="rounded-md bg-red-600 px-6 py-2.5 text-lg font-semibold text-white hover:bg-red-700"
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
