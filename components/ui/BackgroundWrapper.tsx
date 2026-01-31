"use client";

export const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative min-h-screen w-full bg-white">
            {children}
        </div>
    );
};
