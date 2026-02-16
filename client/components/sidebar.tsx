"use client";

import { Home, History, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function Sidebar({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) {
    const menuItems = [
        { id: "search", label: "Search", icon: Home },
        { id: "history", label: "History", icon: History },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-300 md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col gap-2 p-4">
                    {/* Close button for mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden self-end"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    {/* Menu items */}
                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Button
                                    key={item.id}
                                    variant={activeTab === item.id ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => {
                                        onTabChange(item.id);
                                        onClose();
                                    }}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </Button>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="mt-auto">
                        <div className="rounded-lg bg-muted p-4 text-sm">
                            <p className="font-semibold">Quick Stats</p>
                            <p className="text-muted-foreground text-xs mt-1">
                                Track your outreach progress
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
