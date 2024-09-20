import React, { createContext, useContext, useEffect, useState } from 'react';
import '@/firebase/config'
import {auth} from '@/firebase/config'
import { onAuthStateChanged} from 'firebase/auth';

interface User {
	email: string | null;
	uid: string | null;
    username?: string | null;
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
				setUser({
					email: user.email,
					uid: user.uid,
                    username: user.displayName,
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