'use client';
const Loading = () => {
	return (
		<div className='fixed inset-0 bg-[#1c1c1e] z-[10000] flex flex-1 items-center justify-center flex-col gap-3'>
			<h1 className='font-bold text-2xl'>TrackIt</h1>
			<hr className='bg-white w-28'></hr>
			<h1 className='font-bold text-2xl'>Loading...</h1>
		</div>
	);
};

export default Loading;
