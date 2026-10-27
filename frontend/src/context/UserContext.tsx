import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserType = {
    fullName: string;
    email: string;
    phone: string;
    avatar: string;
    memberSince?: string;
};

export type RegisteredUser = {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    avatar?: string;
    monthlyBudget?: number;
    scansCount?: number;
    streakDays?: number;
    memberSince?: string;
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

export type CustomCategory = {
    id: string;
    name: string;
    icon: string;
    color: string;
    lightBg: string;
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
    memberSince: new Date().toISOString(),
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
    totalCartSavings: number;
    // Monthly Budget State & Methods
    monthlyBudget: number;
    setMonthlyBudget: (newBudget: number) => void;
    // Stats State & Methods
    scansCount: number;
    setScansCount: (newCount: number) => void;
    incrementScansCount: () => void;
    streakDays: number;
    setStreakDays: (newStreak: number) => void;

    // Custom Categories Shared Globally
    customCategories: CustomCategory[];
    addCustomCategory: (category: { name: string; icon?: string; color?: string; lightBg?: string }) => CustomCategory;
    deleteCustomCategory: (id: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEYS = {
    SESSION: '@active_user_session',
    USERS: '@registered_users',
    CURRENCY: '@app_currency',
    CART: '@app_cart_items',
    BUDGET: '@app_monthly_budget',
    SCANS: '@app_scans_count',
    STREAK: '@app_streak_days',
    ORDERS: '@app_shopping_orders',
    SCANS_LIST: '@app_scans_list',
    DISCOUNTS: '@app_saved_discounts',
    CUSTOM_CATEGORIES: '@app_custom_categories_v2',
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
let inMemoryMonthlyBudget: number = 0;
let inMemoryScansCount: number = 0;
let inMemoryStreakDays: number = 0;
let inMemoryCustomCategories: CustomCategory[] = [];

export const UserProvider = ({ children }: any) => {
    const [user, setUserState] = useState<UserType>(DEFAULT_USER);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);
    const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
    const [currency, setCurrencyState] = useState<CurrencyItem>(DEFAULT_CURRENCY);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [monthlyBudget, setMonthlyBudgetState] = useState<number>(0);
    const [scansCount, setScansCountState] = useState<number>(0);
    const [streakDays, setStreakDaysState] = useState<number>(0);
    const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);

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
                            if (!parsedSession.memberSince) {
                                const matched = inMemoryRegisteredUsers.find(
                                    u => u.email.trim().toLowerCase() === parsedSession.email.trim().toLowerCase()
                                );
                                parsedSession.memberSince = matched?.memberSince || new Date().toISOString();
                                storageSet(STORAGE_KEYS.SESSION, JSON.stringify(parsedSession));
                            }
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

                // 5. Load Monthly Budget
                const savedBudget = await storageGet(STORAGE_KEYS.BUDGET);
                if (savedBudget && isMounted) {
                    try {
                        const parsedBudget = parseFloat(savedBudget);
                        if (!isNaN(parsedBudget) && parsedBudget > 0) {
                            inMemoryMonthlyBudget = parsedBudget;
                            setMonthlyBudgetState(parsedBudget);
                        }
                    } catch (e) {}
                }

                // 6. Load Scans Count
                const savedScans = await storageGet(STORAGE_KEYS.SCANS);
                if (savedScans && isMounted) {
                    try {
                        const parsedScans = parseInt(savedScans, 10);
                        if (!isNaN(parsedScans) && parsedScans >= 0) {
                            inMemoryScansCount = parsedScans;
                            setScansCountState(parsedScans);
                        }
                    } catch (e) {}
                }

                // 7. Load Streak Days
                const savedStreak = await storageGet(STORAGE_KEYS.STREAK);
                if (savedStreak && isMounted) {
                    try {
                        const parsedStreak = parseInt(savedStreak, 10);
                        if (!isNaN(parsedStreak) && parsedStreak >= 0) {
                            inMemoryStreakDays = parsedStreak;
                            setStreakDaysState(parsedStreak);
                        }
                    } catch (e) {}
                }

                // 8. Load Custom Categories
                const savedCustomCats = await storageGet(STORAGE_KEYS.CUSTOM_CATEGORIES);
                if (savedCustomCats && isMounted) {
                    try {
                        const parsedCats = JSON.parse(savedCustomCats);
                        if (Array.isArray(parsedCats)) {
                            inMemoryCustomCategories = parsedCats;
                            setCustomCategories(parsedCats);
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
        if (newUser && (newUser.email || newUser.fullName)) {
            const memberSince = newUser.memberSince || inMemoryActiveUser?.memberSince || new Date().toISOString();
            const userWithMember: UserType = {
                ...newUser,
                memberSince,
            };
            inMemoryActiveUser = userWithMember;
            setUserState(userWithMember);
            if (userWithMember.email) {
                setIsLoggedIn(true);
            }
            storageSet(STORAGE_KEYS.SESSION, JSON.stringify(userWithMember));

            // Also sync profile changes to registered user record if applicable
            if (userWithMember.email) {
                const normEmail = userWithMember.email.trim().toLowerCase();
                const idx = inMemoryRegisteredUsers.findIndex(u => u.email.trim().toLowerCase() === normEmail);
                if (idx >= 0) {
                    inMemoryRegisteredUsers[idx] = {
                        ...inMemoryRegisteredUsers[idx],
                        fullName: userWithMember.fullName,
                        phone: userWithMember.phone,
                        avatar: userWithMember.avatar,
                        memberSince: inMemoryRegisteredUsers[idx].memberSince || memberSince,
                    };
                    setRegisteredUsers([...inMemoryRegisteredUsers]);
                    storageSet(STORAGE_KEYS.USERS, JSON.stringify(inMemoryRegisteredUsers));
                } else {
                    // New user via social login - initialize with 0 stats and real member date
                    const newRegUser: RegisteredUser = {
                        fullName: userWithMember.fullName,
                        email: userWithMember.email,
                        password: '',
                        phone: userWithMember.phone,
                        avatar: userWithMember.avatar,
                        monthlyBudget: 0,
                        scansCount: 0,
                        streakDays: 0,
                        memberSince,
                    };
                    inMemoryRegisteredUsers = [...inMemoryRegisteredUsers, newRegUser];
                    setRegisteredUsers(inMemoryRegisteredUsers);
                    storageSet(STORAGE_KEYS.USERS, JSON.stringify(inMemoryRegisteredUsers));
                    setMonthlyBudgetState(0);
                    inMemoryMonthlyBudget = 0;
                    setScansCountState(0);
                    inMemoryScansCount = 0;
                    setStreakDaysState(0);
                    inMemoryStreakDays = 0;
                    setCartItems([]);
                    inMemoryCart = [];
                    storageRemove(STORAGE_KEYS.ORDERS);
                    storageRemove(STORAGE_KEYS.SCANS_LIST);
                    storageRemove(STORAGE_KEYS.DISCOUNTS);
                }
            }
        } else {
            inMemoryActiveUser = null;
            setUserState(DEFAULT_USER);
            setIsLoggedIn(false);
            storageRemove(STORAGE_KEYS.SESSION);
        }
    };

    // Logout: clears session storage completely and resets state to zero
    const logoutUser = async () => {
        inMemoryActiveUser = null;
        setUserState(DEFAULT_USER);
        setIsLoggedIn(false);
        setMonthlyBudgetState(0);
        inMemoryMonthlyBudget = 0;
        setCartItems([]);
        inMemoryCart = [];
        setScansCountState(0);
        inMemoryScansCount = 0;
        setStreakDaysState(0);
        inMemoryStreakDays = 0;
        await storageRemove(STORAGE_KEYS.SESSION);
        await storageRemove(STORAGE_KEYS.CART);
        await storageRemove(STORAGE_KEYS.BUDGET);
        await storageRemove(STORAGE_KEYS.SCANS);
        await storageRemove(STORAGE_KEYS.STREAK);
        await storageRemove(STORAGE_KEYS.ORDERS);
        await storageRemove(STORAGE_KEYS.SCANS_LIST);
        await storageRemove(STORAGE_KEYS.DISCOUNTS);
        await storageRemove('@app_budget_categories');
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
        const memberSince = newUser.memberSince || new Date().toISOString();
        const userToRegister: RegisteredUser = {
            ...newUser,
            memberSince,
            monthlyBudget: typeof newUser.monthlyBudget === 'number' ? newUser.monthlyBudget : 0,
            scansCount: typeof newUser.scansCount === 'number' ? newUser.scansCount : 0,
            streakDays: typeof newUser.streakDays === 'number' ? newUser.streakDays : 0,
        };

        // 1. Update in-memory and state
        const index = inMemoryRegisteredUsers.findIndex(
            u => u.email.trim().toLowerCase() === normalizedEmail
        );
        let updated: RegisteredUser[];
        if (index >= 0) {
            updated = [...inMemoryRegisteredUsers];
            updated[index] = { ...inMemoryRegisteredUsers[index], ...userToRegister };
        } else {
            updated = [...inMemoryRegisteredUsers, userToRegister];
        }
        inMemoryRegisteredUsers = updated;
        setRegisteredUsers(updated);

        // 2. Persist registered users
        storageSet(STORAGE_KEYS.USERS, JSON.stringify(updated));

        // 3. Clear cart and reset monthly budget, scans, streak to 0 for a brand new user
        setCartItems([]);
        inMemoryCart = [];
        storageRemove(STORAGE_KEYS.CART);
        setMonthlyBudget(0);
        setScansCount(0);
        setStreakDays(0);
        storageRemove(STORAGE_KEYS.ORDERS);
        storageRemove(STORAGE_KEYS.SCANS_LIST);
        storageRemove(STORAGE_KEYS.DISCOUNTS);
        storageRemove('@app_budget_categories');

        // 4. Automatically create and persist active login session
        const activeUser: UserType = {
            fullName: userToRegister.fullName,
            email: userToRegister.email,
            phone: userToRegister.phone || '+91 98765 43210',
            avatar:
                userToRegister.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
            memberSince,
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

        const memberSince = found.memberSince || new Date().toISOString();
        if (!found.memberSince) {
            found.memberSince = memberSince;
            storageSet(STORAGE_KEYS.USERS, JSON.stringify(inMemoryRegisteredUsers));
        }

        // Correct password -> auto-persist active user session
        const activeUser: UserType = {
            fullName: found.fullName || 'User',
            email: found.email,
            phone: found.phone || '+91 98765 43210',
            avatar:
                found.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
            memberSince,
        };

        // User budget: default to 0 for a first-time user
        const userBudget = typeof found.monthlyBudget === 'number' ? found.monthlyBudget : 0;
        setMonthlyBudgetState(userBudget);
        inMemoryMonthlyBudget = userBudget;
        storageSet(STORAGE_KEYS.BUDGET, userBudget.toString());

        // User stats: default to 0 for a first-time user
        const userScans = typeof found.scansCount === 'number' ? found.scansCount : 0;
        setScansCountState(userScans);
        inMemoryScansCount = userScans;
        storageSet(STORAGE_KEYS.SCANS, userScans.toString());

        const userStreak = typeof found.streakDays === 'number' ? found.streakDays : 0;
        setStreakDaysState(userStreak);
        inMemoryStreakDays = userStreak;
        storageSet(STORAGE_KEYS.STREAK, userStreak.toString());

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
    const totalCartSavings = cartItems.reduce((acc, item) => {
        if (item.discount && item.discount > 0) {
            const origPrice = item.price / (1 - item.discount / 100);
            return acc + (origPrice - item.price) * item.quantity;
        }
        return acc;
    }, 0);

    const setMonthlyBudget = (newBudget: number) => {
        const validBudget = typeof newBudget === 'number' && !isNaN(newBudget) && newBudget > 0 ? newBudget : 0;
        inMemoryMonthlyBudget = validBudget;
        setMonthlyBudgetState(validBudget);
        storageSet(STORAGE_KEYS.BUDGET, validBudget.toString());

        // Also save on active registered user account
        if (inMemoryActiveUser && inMemoryActiveUser.email) {
            const email = inMemoryActiveUser.email.toLowerCase();
            const idx = inMemoryRegisteredUsers.findIndex(u => u.email.toLowerCase() === email);
            if (idx >= 0) {
                inMemoryRegisteredUsers[idx].monthlyBudget = validBudget;
                setRegisteredUsers([...inMemoryRegisteredUsers]);
                storageSet(STORAGE_KEYS.USERS, JSON.stringify(inMemoryRegisteredUsers));
            }
        }
    };

    const setScansCount = (newCount: number) => {
        const valid = Math.max(0, newCount);
        inMemoryScansCount = valid;
        setScansCountState(valid);
        storageSet(STORAGE_KEYS.SCANS, valid.toString());

        if (inMemoryActiveUser && inMemoryActiveUser.email) {
            const email = inMemoryActiveUser.email.toLowerCase();
            const idx = inMemoryRegisteredUsers.findIndex(u => u.email.toLowerCase() === email);
            if (idx >= 0) {
                inMemoryRegisteredUsers[idx].scansCount = valid;
                setRegisteredUsers([...inMemoryRegisteredUsers]);
                storageSet(STORAGE_KEYS.USERS, JSON.stringify(inMemoryRegisteredUsers));
            }
        }
    };

    const incrementScansCount = () => {
        setScansCountState(prev => {
            const next = prev + 1;
            inMemoryScansCount = next;
            storageSet(STORAGE_KEYS.SCANS, next.toString());

            if (inMemoryActiveUser && inMemoryActiveUser.email) {
                const email = inMemoryActiveUser.email.toLowerCase();
                const idx = inMemoryRegisteredUsers.findIndex(u => u.email.toLowerCase() === email);
                if (idx >= 0) {
                    inMemoryRegisteredUsers[idx].scansCount = next;
                    setRegisteredUsers([...inMemoryRegisteredUsers]);
                    storageSet(STORAGE_KEYS.USERS, JSON.stringify(inMemoryRegisteredUsers));
                }
            }
            return next;
        });
    };

    const setStreakDays = (newStreak: number) => {
        const valid = Math.max(0, newStreak);
        inMemoryStreakDays = valid;
        setStreakDaysState(valid);
        storageSet(STORAGE_KEYS.STREAK, valid.toString());

        if (inMemoryActiveUser && inMemoryActiveUser.email) {
            const email = inMemoryActiveUser.email.toLowerCase();
            const idx = inMemoryRegisteredUsers.findIndex(u => u.email.toLowerCase() === email);
            if (idx >= 0) {
                inMemoryRegisteredUsers[idx].streakDays = valid;
                setRegisteredUsers([...inMemoryRegisteredUsers]);
                storageSet(STORAGE_KEYS.USERS, JSON.stringify(inMemoryRegisteredUsers));
            }
        }
    };

    const addCustomCategory = (category: { name: string; icon?: string; color?: string; lightBg?: string }): CustomCategory => {
        const cleanName = (category.name || '').trim();
        const baseId = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'cat';
        const id = `${baseId}_${Date.now().toString(36)}`;
        const icon = category.icon || '🏷️';
        const color = category.color || '#FF6B00';
        const lightBg = category.lightBg || 'rgba(255, 107, 0, 0.12)';

        const newCat: CustomCategory = {
            id,
            name: cleanName,
            icon,
            color,
            lightBg,
        };

        setCustomCategories(prev => {
            const updated = [...prev, newCat];
            inMemoryCustomCategories = updated;
            storageSet(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(updated));
            return updated;
        });

        return newCat;
    };

    const deleteCustomCategory = (id: string) => {
        setCustomCategories(prev => {
            const updated = prev.filter(c => c.id !== id);
            inMemoryCustomCategories = updated;
            storageSet(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(updated));
            return updated;
        });
    };

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
                totalCartSavings,

                // Monthly Budget exports
                monthlyBudget,
                setMonthlyBudget,

                // Stats exports
                scansCount,
                setScansCount,
                incrementScansCount,
                streakDays,
                setStreakDays,

                // Custom Categories exports
                customCategories,
                addCustomCategory,
                deleteCustomCategory,
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