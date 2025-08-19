"use client";

import { useTheme } from '@/lib/theme-context';
import { SunIcon, MoonIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import React from 'react';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: 'light' as const,
      name: 'Light',
      icon: SunIcon,
      description: 'Clean and bright'
    },
    {
      id: 'dark' as const,
      name: 'Dark',
      icon: MoonIcon,
      description: 'Easy on the eyes'
    },
    {
      id: 'monastic' as const,
      name: 'Monastic',
      icon: BookOpenIcon,
      description: 'Warm and focused'
    }
  ];

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-sm font-medium text-primary mb-2">Theme</h3>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isActive = theme === themeOption.id;
          
          return (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`
                relative p-3 rounded-lg border transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                  : 'bg-surface text-primary border-accent hover:bg-accent/10'
                }
              `}
              title={themeOption.description}
            >
              <div className="flex flex-col items-center space-y-1">
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{themeOption.name}</span>
              </div>
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-surface" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
