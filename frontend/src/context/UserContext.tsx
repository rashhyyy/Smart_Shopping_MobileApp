import React, { createContext, useContext, useState } from 'react';

type UserType = {
    fullName: string;
    email: string;
    phone: string;
    avatar: string;
};

type UserContextType = {
    user: UserType;
    setUser: React.Dispatch<React.SetStateAction<UserType>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: any) => {

    const [user, setUser] = useState<UserType>({
        fullName: 'Arjun Mehta',
        email: 'arjun.mehta@email.com',
        phone: '+91 98765 43210',
        avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
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