import Link from "next/link"

export default function Footer() {
    return (
        <footer className="rounded-lg shadow bg-slate-800 hidden md:block">
            <div className="w-full mx-auto px-6 py-3 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-300 sm:text-center">© 2024 <a href="https://asianliftbd.com/" className="hover:underline">Asian Lift Bangladesh</a>. All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-300 sm:mt-0">
                <li>
                    <Link href="https://asianliftbd.com/privacy-policy" className="hover:underline me-4 md:me-6">Privacy Policy</Link>
                </li>
                <li>
                    <Link href="https://asianliftbd.com/terms-of-use" className="hover:underline">Terms Of Use</Link>
                </li>
            </ul>
            </div>
        </footer>
    )
}