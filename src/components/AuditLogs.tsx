
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, User, Clock } from "lucide-react";
import StatsCard from "@/components/StatsCard";

export function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");

  // Mock audit log data
  const auditLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 14:32:15",
      user: "admin@company.com",
      action: "Payment Approved",
      target: "ORD-2024-001",
      details: "SPEI payment validation completed",
      ipAddress: "192.168.1.100"
    },
    {
      id: 2,
      timestamp: "2024-01-15 13:45:22",
      user: "validator@company.com", 
      action: "Payment Rejected",
      target: "ORD-2024-005",
      details: "Invalid payment reference number",
      ipAddress: "192.168.1.105"
    },
    {
      id: 3,
      timestamp: "2024-01-15 12:18:33",
      user: "admin@company.com",
      action: "Inventory Updated",
      target: "IMEI: 123456789012345",
      details: "Status changed from Available to Sold",
      ipAddress: "192.168.1.100"
    },
    {
      id: 4,
      timestamp: "2024-01-15 11:05:44",
      user: "validator@company.com",
      action: "Quote Generated",
      target: "QUO-2024-012",
      details: "B2B quote for Empresa ABC - $89,300 MXN",
      ipAddress: "192.168.1.105"
    },
    {
      id: 5,
      timestamp: "2024-01-15 10:22:11",
      user: "admin@company.com",
      action: "CSV Import",
      target: "Inventory Batch",
      details: "Imported 125 new IMEI entries",
      ipAddress: "192.168.1.100"
    }
  ];

  const getActionColor = (action: string) => {
    switch (action) {
      case "Payment Approved": return "bg-green-500";
      case "Payment Rejected": return "bg-red-500";
      case "Inventory Updated": return "bg-blue-500";
      case "Quote Generated": return "bg-purple-500";
      case "CSV Import": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterAction === "all" || log.action === filterAction;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Audit Logs</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Actions Today"
          value="47"
          change={18.5}
          icon={<FileText className="h-4 w-4 text-blue-500" />}
        />
        <StatsCard
          title="Active Users"
          value="8"
          change={12.5}
          icon={<User className="h-4 w-4 text-green-500" />}
        />
        <StatsCard
          title="Validations Today"
          value="23"
          change={25.3}
          icon={<Clock className="h-4 w-4 text-purple-500" />}
        />
        <StatsCard
          title="System Uptime"
          value="99.9%"
          change={0.1}
          icon={<FileText className="h-4 w-4 text-orange-500" />}
        />
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity Log</CardTitle>
          <CardDescription>Track all user actions and system events for compliance and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by user, action, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="Payment Approved">Payment Approved</SelectItem>
                <SelectItem value="Payment Rejected">Payment Rejected</SelectItem>
                <SelectItem value="Inventory Updated">Inventory Updated</SelectItem>
                <SelectItem value="Quote Generated">Quote Generated</SelectItem>
                <SelectItem value="CSV Import">CSV Import</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Audit Log Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <Badge className={`${getActionColor(log.action)} text-white`}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{log.target}</TableCell>
                  <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
