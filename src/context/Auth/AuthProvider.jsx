import React, { useEffect, useState } from 'react';
import { 
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';

import { auth, db } from '../../auth/firebase.init';
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    const registerUser = async (email, password) => {
        setLoading(true);
        setAuthError(null);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setAuthError('This email is already registered.');
            } else if (error.code === 'auth/invalid-email') {
                setAuthError('Invalid email address.');
            } else if (error.code === 'auth/weak-password') {
                setAuthError('Password should be at least 6 characters.');
            } else {
                setAuthError('Registration failed. Please try again.');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signInUser = async (email, password) => {
        setLoading(true);
        setAuthError(null);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setAuthError('No account found with this email.');
            } else if (error.code === 'auth/wrong-password') {
                setAuthError('Incorrect password.');
            } else if (error.code === 'auth/invalid-email') {
                setAuthError('Invalid email address.');
            } else {
                setAuthError('Login failed. Please try again.');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
        } catch {
            setAuthError('Logout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateUserProfile = async (profile) => {
        try {
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, profile);
                setUser({ ...auth.currentUser });
            }
        } catch {
            setAuthError('Profile update failed.');
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const ref = doc(db, "users", currentUser.uid);
                const snap = await getDoc(ref);

                if (snap.exists()) {
                    setUser({
                        uid: currentUser.uid,
                        email: currentUser.email,
                        ...snap.data(),
                    });
                } else {
                    setUser({
                        uid: currentUser.uid,
                        email: currentUser.email,
                    });
                }
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        authError,
        registerUser,
        signInUser,
        logOut,
        updateUserProfile
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
