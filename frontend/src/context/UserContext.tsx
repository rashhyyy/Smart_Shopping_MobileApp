import React, { createContext, useContext, useState } from 'react';

export type UserType = {
    fullName: string;
    email: string;
    phone: string;
    avatar: string;
};

export type RegisteredUser = {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    avatar?: string;
};

type UserContextType = {
    user: UserType;
    setUser: React.Dispatch<React.SetStateAction<UserType>>;
    registeredUsers: RegisteredUser[];
    registerUser: (newUser: RegisteredUser) => void;
    authenticateUser: (
        email: string,
        password: string
    ) => { success: boolean; message?: string; user?: RegisteredUser };
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Memory fallback cache across components - only users who registered in signup will exist here
let inMemoryRegisteredUsers: RegisteredUser[] = [];

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState<UserType>({
        fullName: 'Smart Shopper',
        email: '',
        phone: '+91 98765 43210',
        avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    });

    const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                const saved = window.localStorage.getItem('@registered_users');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        inMemoryRegisteredUsers = parsed;
                        return parsed;
                    }
                }
            } catch (e) {
                // ignore storage error
            }
        }
        return inMemoryRegisteredUsers;
    });

    const registerUser = (newUser: RegisteredUser) => {
        const normalizedEmail = newUser.email.trim().toLowerCase();

        // 1. Synchronously update in-memory cache first
        const index = inMemoryRegisteredUsers.findIndex(
            u => u.email.trim().toLowerCase() === normalizedEmail
        );
        let updated: RegisteredUser[];
        if (index >= 0) {
            updated = [...inMemoryRegisteredUsers];
            updated[index] = { ...inMemoryRegisteredUsers[index], ...newUser };
        } else {
            updated = [...inMemoryRegisteredUsers, newUser];
        }
        inMemoryRegisteredUsers = updated;

        // 2. Persist to localStorage if available
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                window.localStorage.setItem('@registered_users', JSON.stringify(updated));
            } catch (e) {
                // ignore
            }
        }

        // 3. Update state
        setRegisteredUsers(updated);

    // Set the active session user
    setUser({
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone || '+91 98765 43210',
        avatar:
            newUser.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    });
};

const authenticateUser = (inputEmail: string, inputPassword: string) => {
    const normalizedEmail = (inputEmail || '').trim().toLowerCase();

    console.log('[UserContext] Authenticating email:', normalizedEmail);

    if (!normalizedEmail || !inputPassword) {
        return {
            success: false,
            message: 'Please enter both email and password.',
        };
    }

    // Look up in both state and in-memory fallback list
    const allKnownUsers = [...registeredUsers, ...inMemoryRegisteredUsers];
    const found = allKnownUsers.find(
        u => u && u.email && u.email.trim().toLowerCase() === normalizedEmail
    );

    console.log('[UserContext] Found registered user:', found ? found.email : 'NONE');

    if (!found) {
        return {
            success: false,
            message: 'No account found with this email. Please check your email or sign up.',
        };
    }

    if (found.password !== inputPassword) {
        return {
            success: false,
            message: 'Incorrect password. Please try again.',
        };
    }

    setUser({
        fullName: found.fullName || 'User',
        email: found.email,
        phone: found.phone || '+91 98765 43210',
        avatar:
            found.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    });

    return {
        success: true,
        user: found,
    };
};


    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                registeredUsers,
                registerUser,
                authenticateUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUser must be used inside UserProvider');
    }

    return context;
};