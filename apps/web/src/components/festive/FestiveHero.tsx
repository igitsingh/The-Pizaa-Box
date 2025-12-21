"use client";

interface FestiveHeroProps {
    children: React.ReactNode;
}

// RESET: Pass-through component, no festive logic
export function FestiveHero({ children }: FestiveHeroProps) {
    return <>{children}</>;
}
