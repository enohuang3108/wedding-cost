import { Fragment, useEffect, useLayoutEffect, useRef } from 'react';
import chevronRightIcon from '~/assets/chevron-right.svg';
import chevronUpIcon from '~/assets/chevron-up.svg';

export interface Menu {
	title: string;
	links: Array<{
		title: string;
		to: string;
	}>;
}

export const useSafeLayoutEffect =
	typeof document === 'undefined' ? useEffect : useLayoutEffect;

export function Breadcrumbs({
	locationKey,
	trails,
	children,
}: {
	locationKey: string;
	trails: string[];
	children: React.ReactNode;
}) {
	const detailsRef = useRef<HTMLDetailsElement>(null);

	useSafeLayoutEffect(() => {
		if (detailsRef.current) {
			detailsRef.current.open = false;
		}
	}, [locationKey]);

	return (
		<>
			<details
				id="breadcrumbs"
				ref={detailsRef}
				className="group peer h-12 border-t bg-white open:bg-neutral-100 hover:bg-neutral-100 lg:hidden"
			>
				<summary className="h-full cursor-pointer select-none px-2 marker:content-none">
					<div className="mx-auto flex h-full max-w-screen-sm flex-row items-center gap-2">
						<img
							src={chevronRightIcon}
							className="block h-4 w-4 group-open:hidden"
							alt="expand"
							aria-hidden
						/>
						<img
							src={chevronUpIcon}
							className="hidden h-4 w-4 group-open:block"
							alt="collapse"
							aria-hidden
						/>
						<div className="truncate">
							{trails.map((trail, index) => (
								<Fragment key={index}>
									{index > 0 ? (
										<span className="px-2 text-zinc-500">/</span>
									) : null}
									<span>{trail}</span>
								</Fragment>
							))}
						</div>
					</div>
				</summary>
			</details>
			<div className="fixed inset-x-0 bottom-12 top-0 hidden max-h-[calc(100vh-3rem)] flex-1 overflow-y-auto border-t bg-white peer-open:block lg:relative lg:inset-x-auto lg:bottom-auto lg:flex lg:max-h-none">
				{children}
			</div>
		</>
	);
}

export function Layout({ children }: { children?: React.ReactNode }) {
	return (
		<div className="mx-auto lg:container">
			<div className="flex flex-col-reverse lg:flex-row">
				<main className="flex-1">
					<div className="px-5 py-5 lg:py-10">{children}</div>
				</main>
			</div>
		</div>
	);
}

export function ErrorLayout({
	title,
	description,
}: {
	title?: string;
	description?: string;
}) {
	return (
		<div className="flex h-screen items-center">
			<div className="mx-auto p-5">
				<h2 className="text-xl">{title}</h2>
				<p className="py-2">{description}</p>
			</div>
		</div>
	);
}
