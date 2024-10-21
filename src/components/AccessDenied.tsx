import Link from "next/link";

export default function AccessDenied() {
	return (
		<main className='w-full h-screen flex flex-col space-y-2 items-center justify-center'>
			<title>Access Denied</title>
			<div className='text-xl font-bold'>Access Denied</div>
			<Link className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-1 px-4 rounded-full" href={"/"}>Home</Link>
		</main>
	);
};