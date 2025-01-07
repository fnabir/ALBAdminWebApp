"use client"

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';

export const useAuth = () => {
	const [user, loading, error] = useAuthState(auth);
	const admin = ["HrnlOpNxfpTJ4JHjEE7E7lZXJ3n2", "STFXbv1ZzrbxDSWPCMpATVbOekh2", "WhAnZZh7CfNGhe1ejIUlAy1QAh33", "yB7jBuPIo7PxuhpliZ7VNnsL21l2"];
	const manager = ["LzcKIs2huyaK83FEOqbkJCumezu2"];
	const userRole = user ? admin.includes(user.uid) ? "admin" : manager.includes(user.uid) ? "manager" : "user" : "";
	return { user, userRole, loading, error };
};