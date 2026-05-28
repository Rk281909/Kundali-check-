import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

interface UserProfile {
    uid: string;
    email: string;
    name?: string;
    role: string;
    dob?: string;
    timeOfBirth?: string;
    placeOfBirth?: string;
    zodiacSign?: string;
    subscriptionPlan?: 'free' | 'premium';
    createdAt?: any;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);
            if (!authUser) {
                setProfile(null);
                setLoading(false);
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!user) return;
        
        const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
            if (doc.exists()) {
                setProfile(doc.data() as UserProfile);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching profile", error);
            setLoading(false);
        });

        return unsubscribe;
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
