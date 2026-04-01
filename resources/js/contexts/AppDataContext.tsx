import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import apiClient from '@/utils/api';

interface MenuItem {
    id: number | null;
    label: string;
    url: string;
    target: '_self' | '_blank';
    active: boolean;
}

interface CachedData {
    [key: string]: any[];
}

interface AppDataContextType {
    menuItems: MenuItem[];
    loadingMenuItems: boolean;
    refreshMenuItems: () => Promise<void>;
    getCachedData: (key: string) => any[] | null;
    setCachedData: (key: string, data: any[]) => void;
    isLoading: (key: string) => boolean;
    setIsLoading: (key: string, loading: boolean) => void;
    getOrCreatePromise: <T>(key: string, fetcher: () => Promise<T>) => Promise<T>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const useAppData = () => {
    const context = useContext(AppDataContext);
    if (!context) {
        throw new Error('useAppData must be used within AppDataProvider');
    }
    return context;
};

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loadingMenuItems, setLoadingMenuItems] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const activePromisesRef = useRef<Map<string, Promise<any>>>(new Map());

    // Cache para otros endpoints
    const [cache, setCache] = useState<CachedData>({});
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

    const fetchMenuItems = useCallback(async (force = false) => {
        if (loaded && !force) return;
        
        setLoadingMenuItems(true);
        try {
            const baseUrl = import.meta.env.VITE_API_URL || '';
            const response = await apiClient.get(`${baseUrl}menu-items`);

            setMenuItems(response.data);
            setLoaded(true);
        } catch (error) {
            console.error('Error loading menu items:', error);
        } finally {
            setLoadingMenuItems(false);
        }
    }, [loaded]);

    useEffect(() => {
        fetchMenuItems();
    }, [fetchMenuItems]);

    const refreshMenuItems = useCallback(async () => {
        await fetchMenuItems(true);
    }, [fetchMenuItems]);
    
    const getCachedData = (key: string) => {
        return cache[key] || null;
    };

    const setCachedData = (key: string, data: any[]) => {
        setCache(prev => ({ ...prev, [key]: data }));
    };

    const isLoading = (key: string) => {
        return loadingStates[key] || false;
    };
    
    const setIsLoading = useCallback((key: string, loading: boolean) => {
        setLoadingStates(prev => ({ ...prev, [key]: loading }));
    }, []);

    const getOrCreatePromise = useCallback(<T,>(key: string, fetcher: () => Promise<T>): Promise<T> => {
        const existingPromise = activePromisesRef.current.get(key);
        if (existingPromise) {
            return existingPromise;
        }

        const promise = fetcher()
            .finally(() => {
                activePromisesRef.current.delete(key);
                setIsLoading(key, false); // limpiar loading state global
            });

        activePromisesRef.current.set(key, promise);
        setIsLoading(key, true);
        return promise;
    }, [setIsLoading]);

    return (
        <AppDataContext.Provider value={{
            menuItems,
            loadingMenuItems,
            refreshMenuItems,
            getCachedData,
            setCachedData,
            isLoading,
            setIsLoading,
            getOrCreatePromise

        }}>
            {children}
        </AppDataContext.Provider>
    );
};
