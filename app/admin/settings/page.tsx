export default function SettingsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-2xl font-bold text-neutral-900">Global Settings</h1>
            <p className="text-neutral-500 mt-2 max-w-md">
                Configure store currency, shipping rates, and site metadata here.
            </p>
        </div>
    );
}
