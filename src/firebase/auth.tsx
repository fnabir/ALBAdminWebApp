import '@/firebase/config'
import {auth} from '@/firebase/config'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Login the user
export const login = (email: string, password: string) => {
	return signInWithEmailAndPassword(auth, email, password);
};

// Logout the user
export const logout = async () => {
	try {
		await signOut(auth)
		console.log("Logged out successfully.")
	} catch (error) {
		console.error("Error logging out: ", error)
	}
};