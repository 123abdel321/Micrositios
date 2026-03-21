import React, { createContext, useContext, useEffect, useState } from 'react';

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
    
    // Cache para otros endpoints
    const [cache, setCache] = useState<CachedData>({});
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

    const fetchMenuItems = async () => {
        if (loaded) return;
        
        setLoadingMenuItems(true);
        try {
            const baseUrl = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${baseUrl}menu-items`);
            const data = await response.json();
            setMenuItems(data);
            setLoaded(true);
        } catch (error) {
            console.error('Error loading menu items:', error);
        } finally {
            setLoadingMenuItems(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const refreshMenuItems = async () => {
        setLoaded(false);
        await fetchMenuItems();
    };
    
    const getCachedData = (key: string) => {
        return cache[key] || null;
    };
    
    const setCachedData = (key: string, data: any[]) => {
        setCache(prev => ({ ...prev, [key]: data }));
    };
    
    const isLoading = (key: string) => {
        return loadingStates[key] || false;
    };
    
    const setIsLoading = (key: string, loading: boolean) => {
        setLoadingStates(prev => ({ ...prev, [key]: loading }));
    };

    return (
        <AppDataContext.Provider value={{ 
            menuItems, 
            loadingMenuItems, 
            refreshMenuItems,
            getCachedData,
            setCachedData,
            isLoading,
            setIsLoading
        }}>
            {children}
        </AppDataContext.Provider>
    );
};