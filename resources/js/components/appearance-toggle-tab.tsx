// resources/js/components/appearance-toggle-tab.tsx
import { Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({ className = '' }: { className?: string }) {
    const { appearance, updateAppearance } = useAppearance();

    // Determinamos si el modo actual es oscuro (true) o claro (false)
    const isDark = appearance === 'dark';

    const toggleTheme = () => {
        // Alternamos entre 'light' y 'dark'
        updateAppearance(isDark ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                'rounded-full p-2 transition-all duration-200',
                'bg-white/80 backdrop-blur-sm shadow-md',
                'hover:scale-105 active:scale-95',
                'dark:bg-neutral-800/80 dark:text-neutral-200',
                'border border-neutral-200 dark:border-neutral-700',
                className
            )}
            aria-label="Cambiar tema"
        >
            {isDark ? (
                <Sun className="h-5 w-5 text-amber-500" />
            ) : (
                <Moon className="h-5 w-5 text-slate-700" />
            )}
        </button>
    );
}