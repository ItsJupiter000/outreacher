"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
    onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <span className="text-lg font-bold">JO</span>
                    </div>
                    <h1 className="text-xl font-bold hidden sm:block">Job Outreach Bot</h1>
                    <h1 className="text-xl font-bold sm:hidden">JOB</h1>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Status: </span>
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            Active
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
