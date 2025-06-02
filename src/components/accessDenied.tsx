import { MdOutlineWarningAmber } from "react-icons/md";
import { Button } from "./ui/button";
import Link from "@/components/link";

export default function AccessDenied() {
	return (
		<div className="absolute w-full z-50 bg-background h-screen flex items-center flex-col justify-center opacity-0 duration-300 animate-fade-in-y">
			<MdOutlineWarningAmber className="size-12 text-amber-500"/>
			<div className='text-base lg:text-xl font-semibold'>Access denied!</div>
      <p>Not authorized to access the page</p>
      <Link href="/">
        <Button>Go to Home</Button>
        </Link>
		</div>
	);
};