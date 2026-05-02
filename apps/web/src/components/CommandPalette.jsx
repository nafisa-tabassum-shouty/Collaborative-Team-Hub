"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  LayoutDashboard, 
  Briefcase, 
  Trophy, 
  CheckSquare, 
  Megaphone, 
  Users, 
  Settings, 
  Command,
  X
} from 'lucide-react';
import useCommandStore from '@/store/commandStore';
import useWorkspaceStore from '@/store/workspaceStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const CommandPalette = () => {
  const router = useRouter();
  const { isOpen, setIsOpen, toggle } = useCommandStore();
  const { workspaces, activeWorkspace } = useWorkspaceStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Command groups
  const commands = [
    {
      group: 'Navigation',
      items: [
        { id: 'dashboard', title: 'Go to Dashboard', icon: LayoutDashboard, action: () => router.push('/dashboard'), shortcut: ['G', 'D'] },
        { id: 'workspaces', title: 'Switch Workspace', icon: Briefcase, action: () => { /* Logic to show workspaces */ }, shortcut: ['G', 'W'] },
      ]
    },
    {
      group: 'Workspace',
      items: activeWorkspace ? [
        { id: 'goals', title: 'View Goals', icon: Trophy, action: () => router.push(`/workspaces/${activeWorkspace.id}?tab=goals`) },
        { id: 'tasks', title: 'View Action Items', icon: CheckSquare, action: () => router.push(`/workspaces/${activeWorkspace.id}?tab=tasks`) },
        { id: 'announcements', title: 'View Announcements', icon: Megaphone, action: () => router.push(`/workspaces/${activeWorkspace.id}?tab=announcements`) },
        { id: 'members', title: 'View Members', icon: Users, action: () => router.push(`/workspaces/${activeWorkspace.id}?tab=members`) },
      ] : []
    },
    {
      group: 'Settings',
      items: [
        { id: 'profile', title: 'Profile Settings', icon: Settings, action: () => router.push('/settings') },
      ]
    }
  ];

  // Flattened items for keyboard navigation
  const filteredItems = commands.flatMap(group => 
    group.items.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase())
    )
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Command Palette (Cmd/Ctrl + K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }

      // Sequential shortcuts (G + D, G + W)
      if (!isOpen && e.key) {
        if (e.key.toLowerCase() === 'g') {
          const handleSecondKey = (e2) => {
            if (e2.key && e2.key.toLowerCase() === 'd') {
              router.push('/dashboard');
              window.removeEventListener('keydown', handleSecondKey);
            } else if (e2.key && e2.key.toLowerCase() === 'w') {
              // We could open the palette specifically for workspaces here
              setIsOpen(true);
              setQuery('workspace');
              window.removeEventListener('keydown', handleSecondKey);
            }
          };
          window.addEventListener('keydown', handleSecondKey, { once: true });
          // Cleanup after 1s if no second key
          setTimeout(() => window.removeEventListener('keydown', handleSecondKey), 1000);
        }
      }

      // Inside Palette Navigation
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredItems.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const selected = filteredItems[selectedIndex];
          if (selected) {
            selected.action();
            setIsOpen(false);
          }
        } else if (e.key === 'Escape') {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggle, setIsOpen, filteredItems, selectedIndex, router]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Search Bar */}
        <div className="flex items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          {commands.map((group, groupIdx) => {
            const groupItems = group.items.filter(item => 
              item.title.toLowerCase().includes(query.toLowerCase())
            );

            if (groupItems.length === 0) return null;

            return (
              <div key={group.group} className="mb-2">
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group.group}
                </h3>
                {groupItems.map((item) => {
                  const globalIdx = filteredItems.indexOf(item);
                  const isSelected = globalIdx === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-150 text-left",
                        isSelected 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn("w-5 h-5", isSelected ? "text-white" : "text-gray-400")} />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      {item.shortcut && (
                        <div className="flex items-center gap-1">
                          {item.shortcut.map((key) => (
                            <kbd 
                              key={key}
                              className={cn(
                                "px-1.5 py-0.5 text-[10px] rounded border font-sans",
                                isSelected 
                                  ? "bg-indigo-500 border-indigo-400 text-white" 
                                  : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500"
                              )}
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="py-12 text-center">
              <Search className="w-12 h-12 text-gray-200 dark:text-gray-800 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No commands found for &quot;{query}&quot;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">Enter</kbd>
              Select
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">Esc</kbd>
              Close
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
