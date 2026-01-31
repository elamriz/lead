import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#f5f5f7]">
            <AdminSidebar />
            <div className="p-4 sm:ml-64">
                <div className="mt-4 p-4 md:p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
