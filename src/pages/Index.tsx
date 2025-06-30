
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { InventoryDashboard } from "@/components/InventoryDashboard";
import { SPEIValidation } from "@/components/SPEIValidation";
import { QuoteGenerator } from "@/components/QuoteGenerator";
import { AdminValidation } from "@/components/AdminValidation";
import { AuditLogs } from "@/components/AuditLogs";

const Index = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  const renderContent = () => {
    switch (activeTab) {
      case "inventory":
        return <InventoryDashboard />;
      case "spei":
        return <SPEIValidation />;
      case "quotes":
        return <QuoteGenerator />;
      case "validation":
        return <AdminValidation />;
      case "audit":
        return <AuditLogs />;
      default:
        return <InventoryDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
