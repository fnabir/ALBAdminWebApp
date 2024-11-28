import React, { createContext, useContext, useEffect, useState } from 'react';
import '@/firebase/config'
import {auth} from '@/firebase/config'
import { onAuthStateChanged} from 'firebase/auth';

interface User {
	email: string | null;
	uid: string | null;
    username?: string | null;
	role?: string | null;
}

interface AuthContextType {
	user: User | null;
	loading: Boolean
}

export const AuthContext = createContext<AuthContextType>({
	user: null, loading: true
});

// Make auth context available across the app by exporting it
export const useAuth = () => useContext<any>(AuthContext);

// Create the auth context provider
export const AuthProvider = ({children}: {children: React.ReactNode;}) => {
	// Define the constants for the user and loading state
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true)

	// Update the state depending on auth
	useEffect(() => {
		return onAuthStateChanged(auth, (user) => {
			if (user) {
				const admin = ["HrnlOpNxfpTJ4JHjEE7E7lZXJ3n2", "STFXbv1ZzrbxDSWPCMpATVbOekh2", "WhAnZZh7CfNGhe1ejIUlAy1QAh33", "yB7jBuPIo7PxuhpliZ7VNnsL21l2"];
				const manager = ["LzcKIs2huyaK83FEOqbkJCumezu2"]
				const staff = ["BrY63rJXVifG4ywnhstNhmpjKqU2", "CCZjPhuI8CbaTV4sVnoRS0WDENI2", "MFsOlJGGx4QOtBDQhng6OLtCjGt2", "OUL5Xzi3lBT5bucafWGd0hfI3q32"]
				setUser({
					email: user.email,
					uid: user.uid,
					username: user.displayName,
					role: admin.includes(user.uid) ? "admin" : manager.includes(user.uid) ? "manager" : staff.includes(user.uid) ? "staff" : "",
				});
			} else {
				setUser(null);
			}
			setLoading(false)
		});
	}, []);

	// Wrap the children with the context provider
	return (
		<AuthContext.Provider value={{ user, loading}}>
			{children}
		</AuthContext.Provider>
	);
};