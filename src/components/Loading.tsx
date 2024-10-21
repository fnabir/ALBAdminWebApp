import { useEffect, useState } from "react";

export default function Loading() {
	const [showTime, setShowTime] = useState(10000);

	useEffect(() => { 
		const timeoutId = setTimeout(() => {
			window.location.reload();
		}, 10000);
	
		return () => clearTimeout(timeoutId);
	  }, []);

	  useEffect(() => {
		const showTimer = setTimeout(() => {
			setShowTime(showTime-1000);
		}, 1000);
	  }, [showTime]);

	return (
		<div className='w-full h-screen flex items-center flex-col justify-center'>
			<span className="relative flex h-10 w-10 justify-center items-center m-8">
				<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
				<span className="relative inline-flex rounded-full h-5 w-5 bg-sky-500"></span>
			</span>
			<h2 className='text-2xl font-bold'>{showTime < 0 ? "Please refresh" : "Loading, please wait..."}</h2>
			<p>{showTime > 0 ? `If the page doesn't load in ${showTime/1000} seconds, please refresh` : ""}</p>
		</div>
	);
};