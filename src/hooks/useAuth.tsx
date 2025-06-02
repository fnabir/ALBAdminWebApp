"use client"

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { getDatabaseReference } from '@/lib/utils';
import { useObject } from 'react-firebase-hooks/database';

export const useAuth = () => {
  const [user, userLoading, userError] = useAuthState(auth);

  const userRef = user ? getDatabaseReference(`info/user/${user.uid}`) : null;
  const [userSnapshot, roleLoading, roleError] = useObject(userRef);

  const userRole = userSnapshot?.val()?.role ?? "";
  const isAdmin = userRole === "admin";
  const loading = userLoading || roleLoading;
  const error = userError || roleError;

  return { user, isAdmin, userLoading: loading, userError: error };
};