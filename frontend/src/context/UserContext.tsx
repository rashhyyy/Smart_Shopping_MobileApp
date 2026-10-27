import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export type CurrencyItem = {
    code: string;
    symbol: string;
    name: string;
    flag: string;
};

export type CartItem = {
    id: string;
    label: string;
    price: number;
    quantity: number;
    rawText?: string;
    capturedAt: number | string | Date;
    category?: string;
    discount?: number;
    note?: string;
};

export const DEFAULT_CURRENCY: CurrencyItem = {
    code: 'USD',
    symbol: '$',
    name: 'United States Dollar',
    flag: '🇺🇸',
};

export const DEFAULT_USER: UserType = {
    fullName: 'Smart Shopper',
    email: '',
    phone: '+91 98765 43210',
    avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
};

type UserContextType = {
    user: UserType;
    setUser: (newUser: UserType | null) => void;
    isLoggedIn: boolean;
    isLoadingSession: boolean;
    registeredUsers: RegisteredUser[];
    registerUser: (newUser: RegisteredUser) => void;
    authenticateUser: (
        email: string,
        password: string
    ) => { success: boolean; message?: string; user?: RegisteredUser };
    logoutUser: () => Promise<void>;
    currency: CurrencyItem;
    setCurrency: (newCurrency: CurrencyItem) => void;

    // Cart State & Methods
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, 'id' | 'capturedAt'> & { id?: string; capturedAt?: any }) => void;
    updateCartItemQty: (id: string, delta: number) => void;
    removeCartItem: (id: string) => void;
    clearCart: () => void;
    totalCartItems: number;
    totalCartSpend: number;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEYS = {
    SESSION: '@active_user_session',
    USERS: '@registered_users',
    CURRENCY: '@app_currency',
    CART: '@app_cart_items',
};

// Storage helper functions supporting AsyncStorage with localStorage fallback
async function storageGet(key: string): Promise<string | null> {
    try {
        const val = await AsyncStorage.getItem(key);
        if (val !== null) return val;
    } catch (e) {
        // ignore
    }
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            return window.localStorage.getItem(key);
        } catch (e) {
            // ignore
        }
    }
    return null;
}

async function storageSet(key: string, value: string): Promise<void> {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        // ignore
    }
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            window.localStorage.setItem(key, value);
        } catch (e) {
            // ignore
        }
    }
}

async function storageRemove(key: string): Promise<void> {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        // ignore
    }
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            window.localStorage.removeItem(key);
        } catch (e) {
            // ignore
        }
    }
}

// In-memory cache fallback
let inMemoryRegisteredUsers: RegisteredUser[] = [];
let inMemoryCurrency: CurrencyItem = DEFAULT_CURRENCY;
let inMemoryActiveUser: UserType | null = null;
let inMemoryCart: CartItem[] = [];

export const UserProvider = ({ children }: any) => {
    const [user, setUserState] = useState<UserType>(DEFAULT_USER);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);
    const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
    const [currency, setCurrencyState] = useState<CurrencyItem>(DEFAULT_CURRENCY);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Initial load: restore active session, registered users, currency, and cart
    useEffect(() => {
        let isMounted = true;

        async function initStorage() {
            try {
                // 1. Load Currency
                const savedCurrency = await storageGet(STORAGE_KEYS.CURRENCY);
                if (savedCurrency && isMounted) {
                    try {
                        const parsedCurr = JSON.parse(savedCurrency);
                        if (parsedCurr && parsedCurr.code) {
                            inMemoryCurrency = parsedCurr;
                            setCurrencyState(parsedCurr);
                        }
                    } catch (e) {}
                }

                // 2. Load Registered Users
                const savedUsers = await storageGet(STORAGE_KEYS.USERS);
                if (savedUsers && isMounted) {
                    try {
                        const parsedUsers = JSON.parse(savedUsers);
                        if (Array.isArray(parsedUsers)) {
                            inMemoryRegisteredUsers = parsedUsers;
                            setRegisteredUsers(parsedUsers);
                        }
                    } catch (e) {}
                }

                // 3. Load Active User Session
                const savedSession = await storageGet(STORAGE_KEYS.SESSION);
                if (savedSession && isMounted) {
                    try {
                        const parsedSession = JSON.parse(savedSession);
                        if (parsedSession && parsedSession.email) {
                            inMemoryActiveUser = parsedSession;
                            setUserState(parsedSession);
                            setIsLoggedIn(true);
                        }
                    } catch (e) {}
                }

                // 4. Load Cart Items
                const savedCart = await storageGet(STORAGE_KEYS.CART);
                if (savedCart && isMounted) {
                    try {
                        const parsedCart = JSON.parse(savedCart);
                        if (Array.isArray(parsedCart)) {
                            inMemoryCart = parsedCart;
                            setCartItems(parsedCart);
                        }
                    } catch (e) {}
                }
            } catch (err) {
                console.error('[UserContext] Failed to initialize storage session:', err);
            } finally {
                if (isMounted) {
                    setIsLoadingSession(false);
                }
            }
        }

        initStorage();

        return () => {
            isMounted = false;
        };
    }, []);

    // Set user & persist session
    const setUser = (newUser: UserType | null) => {
        if (newUser && newUser.email) {
            inMemoryActiveUser = newUser;
            setUserState(newUser);
            setIsLoggedIn(true);
            storageSet(STORAGE_KEYS.SESSION, JSON.stringify(newUser));
        } else {
            inMemoryActiveUser = null;
            setUserState(DEFAULT_USER);
            setIsLoggedIn(false);
            storageRemove(STORAGE_KEYS.SESSION);
        }
    };

    // Logout: clears session storage completely
    const logoutUser = async () => {
        inMemoryActiveUser = null;
        setUserState(DEFAULT_USER);
        setIsLoggedIn(false);
        await storageRemove(STORAGE_KEYS.SESSION);
    };

    // Currency update & persist
    const setCurrency = (newCurrency: CurrencyItem) => {
        inMemoryCurrency = newCurrency;
        setCurrencyState(newCurrency);
        storageSet(STORAGE_KEYS.CURRENCY, JSON.stringify(newCurrency));
    };

    // Register new user: stores credentials & auto-logs them in immediately
    const registerUser = (newUser: RegisteredUser) => {
        const normalizedEmail = newUser.email.trim().toLowerCase();

        // 1. Update in-memory and state
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
        setRegisteredUsers(updated);

        // 2. Persist registered users
        storageSet(STORAGE_KEYS.USERS, JSON.stringify(updated));

        // 3. Automatically create and persist active login session
        const activeUser: UserType = {
            fullName: newUser.fullName,
            email: newUser.email,
            phone: newUser.phone || '+91 98765 43210',
            avatar:
                newUser.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        };

        setUser(activeUser);
    };

    // Authenticate user: verifies credentials & saves active session
    const authenticateUser = (inputEmail: string, inputPassword: string) => {
        const normalizedEmail = (inputEmail || '').trim().toLowerCase();

        console.log('[UserContext] Authenticating email:', normalizedEmail);

        if (!normalizedEmail || !inputPassword) {
            return {
                success: false,
                message: 'Please enter both email and password.',
            };
        }

        // Search in state & in-memory cache
        const allKnownUsers = [...registeredUsers, ...inMemoryRegisteredUsers];
        const found = allKnownUsers.find(
            u => u && u.email && u.email.trim().toLowerCase() === normalizedEmail
        );

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

        // Correct password -> auto-persist active user session
        const activeUser: UserType = {
            fullName: found.fullName || 'User',
            email: found.email,
            phone: found.phone || '+91 98765 43210',
            avatar:
                found.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        };

        setUser(activeUser);

        return {
            success: true,
            user: found,
        };
    };

    // ── Cart Operations (Global & Shared) ──
    const addToCart = (newItem: Omit<CartItem, 'id' | 'capturedAt'> & { id?: string; capturedAt?: any }) => {
        setCartItems(prev => {
            const id = newItem.id || `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
            const capturedAt = newItem.capturedAt || Date.now();
            const quantity = newItem.quantity || 1;

            // Check if exact same item exists by label & price
            const existingIndex = prev.findIndex(
                i => i.label.trim().toLowerCase() === newItem.label.trim().toLowerCase() &&
                     Math.abs(i.price - newItem.price) < 0.01
            );

            let updated: CartItem[];
            if (existingIndex >= 0) {
                updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity,
                };
            } else {
                updated = [...prev, { ...newItem, id, capturedAt, quantity }];
            }

            inMemoryCart = updated;
            storageSet(STORAGE_KEYS.CART, JSON.stringify(updated));
            return updated;
        });
    };

    const updateCartItemQty = (id: string, delta: number) => {
        setCartItems(prev => {
            const updated = prev
                .map(item => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
                .filter(item => item.quantity > 0);
            inMemoryCart = updated;
            storageSet(STORAGE_KEYS.CART, JSON.stringify(updated));
            return updated;
        });
    };

    const removeCartItem = (id: string) => {
        setCartItems(prev => {
            const updated = prev.filter(item => item.id !== id);
            inMemoryCart = updated;
            storageSet(STORAGE_KEYS.CART, JSON.stringify(updated));
            return updated;
        });
    };

    const clearCart = () => {
        inMemoryCart = [];
        setCartItems([]);
        storageRemove(STORAGE_KEYS.CART);
    };

    const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalCartSpend = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                isLoggedIn,
                isLoadingSession,
                registeredUsers,
                registerUser,
                authenticateUser,
                logoutUser,
                currency,
                setCurrency,

                // Cart exports
                cartItems,
                addToCart,
                updateCartItemQty,
                removeCartItem,
                clearCart,
                totalCartItems,
                totalCartSpend,
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

export const useCart = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useCart must be used inside UserProvider');
    }

    return {
        items: context.cartItems,
        cartItems: context.cartItems,
        addToCart: context.addToCart,
        updateCartItemQty: context.updateCartItemQty,
        removeCartItem: context.removeCartItem,
        clearCart: context.clearCart,
        totalItems: context.totalCartItems,
        totalSpend: context.totalCartSpend,
        currency: context.currency,
    };
};