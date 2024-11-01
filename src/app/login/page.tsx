'use client'

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { login } from '@/firebase/auth';
import { useAuth } from '@/context/AuthContext';
import Loading from "@/components/Loading";

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: any) => {
		e.preventDefault();
		try {
			await login(email, password);
      console.log('Logged in successfully')
      setMessage('Logged in successfully')
      router.push('/');
      setEmail('');
      setPassword('');
    } catch (error: any) {
			console.log(error.message);
      if (String(error.message) === 'Firebase: Error (auth/invalid-email).') {
          setMessage('Invalid email address!');
      } else if (String(error.message) === 'Firebase: Error (auth/user-not-found).') {
          setMessage('Email not registered with us!');
      } else if (String(error.message) === 'Firebase: Error (auth/wrong-password).') {
          setMessage('Wrong password!');
      } else if (String(error.message) === 'Firebase: Error (auth/network-request-failed).') {
          setMessage('Network connection issue!')
      } else {
          setMessage('Invalid email/password!');
      }
		}
	};

  if (loading) return <Loading/>

  if (!loading && user) return router.push("/")
  else {
    return (
      <main className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
        <title>Login</title>
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-2xl">
          </div>

          <div className="relative px-4 py-10 bg-gray-800/75 ring-1 ring-blue-800/5 shadow-black shadow-md sm:rounded-3xl sm:p-20 backdrop-blur-2xl">
            <div className="max-w-md mx-auto">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Image
                  className="mx-auto h-16 w-auto"
                  src="ALB.svg"
                  alt="Asian Lift Bangladesh"
                  width={89}
                  height={50}
                />
                <h1 className="mt-5 text-center text-3xl font-bold text-white-500">
                  ASIAN LIFT BANGLADESH
                </h1>
                <h2 className="mt-10 text-center text-2xl font-bold text-white-500">
                  Sign in to your account
                </h2>
              </div>

              <form className="space-y-6 mt-10" action="#" method="POST">
                <div>
                  <label htmlFor="email" className="block text-sm text-white-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm text-white-900">
                      Password
                    </label>
                    <a href="#" className="text-sm text-indigo-200 hover:text-indigo-100">
                      Forgot password?
                    </a>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <span></span>
                </div>

                <div>
                  <button
                    type="submit"
                    onClick={handleLogin}
                    className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text font-semibold leading-6 text-white shadow-sm hover:bg-blue-500">
                    Login
                  </button>
                </div>
              </form>

              <div className="flex flex-1 flex-col justify-center px-6 py-4 lg:px-8">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <p id='resultMessage' className="h-6 text-center text-white">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}}
