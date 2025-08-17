import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/app-sidebar";

export default function DashboardLayout() {
    return (
        <div className="flex h-screen">
            <SidebarProvider >
                <AppSidebar />
                <main className="flex-1">
                    <SidebarTrigger />
                    <Outlet />
                </main>
            </SidebarProvider>
        </div>
    );
}
