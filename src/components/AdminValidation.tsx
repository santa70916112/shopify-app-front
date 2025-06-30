
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import StatsCard from "@/components/StatsCard";

export function AdminValidation() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [validationNotes, setValidationNotes] = useState("");

  // Mock data for orders requiring validation
  const ordersToValidate = [
    {
      id: "ORD-2024-001",
      customer: "Empresa Tecnológica ABC",
      amount: 127500,
      paymentMethod: "SPEI",
      reference: "SPEI240115001",
      priority: "High",
      orderDate: "2024-01-15 14:30",
      items: ["5x iPhone 15 Pro Max", "3x iPad Pro 12.9\""],
      status: "Pending Validation"
    },
    {
      id: "ORD-2024-002", 
      customer: "Distribuidora XYZ S.A.",
      amount: 89300,
      paymentMethod: "SPEI",
      reference: "SPEI240115002",
      priority: "Medium",
      orderDate: "2024-01-15 11:15",
      items: ["8x Samsung Galaxy S24", "2x MacBook Air"],
      status: "Pending Validation"
    },
    {
      id: "ORD-2024-003",
      customer: "Corporativo DEF",
      amount: 234600,
      paymentMethod: "SPEI", 
      reference: "SPEI240114003",
      priority: "Critical",
      orderDate: "2024-01-14 16:45",
      items: ["10x iPhone 15 Pro", "5x iPad Pro", "3x MacBook Pro"],
      status: "Validation Required"
    }
  ];

  const handleValidateOrder = (orderId: string, action: 'approve' | 'reject') => {
    console.log(`${action} order ${orderId} with notes: ${validationNotes}`);
    setSelectedOrder(null);
    setValidationNotes("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-yellow-500";
      default: return "bg-blue-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Validation": return "bg-orange-500";
      case "Validation Required": return "bg-red-500";
      case "Approved": return "bg-green-500";
      case "Rejected": return "bg-red-600";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Validation Center</h1>
        <Badge variant="outline" className="text-sm">
          <Shield className="h-3 w-3 mr-1" />
          Validation Role
        </Badge>
      </div>

      {/* Alert for pending validations */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You have {ordersToValidate.length} high-value orders pending validation. Critical orders should be processed within 2 hours.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Pending Validations"
          value={ordersToValidate.length.toString()}
          change={12.5}
          icon={<Clock className="h-4 w-4 text-orange-500" />}
        />
        <StatsCard
          title="Approved Today"
          value="18"
          change={25.3}
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        />
        <StatsCard
          title="Rejected Today"
          value="2"
          change={-15.7}
          icon={<XCircle className="h-4 w-4 text-red-500" />}
        />
        <StatsCard
          title="Avg Response Time"
          value="1.2h"
          change={-8.4}
          icon={<Clock className="h-4 w-4 text-blue-500" />}
        />
      </div>

      {/* Orders Requiring Validation */}
      <Card>
        <CardHeader>
          <CardTitle>Orders Requiring Validation</CardTitle>
          <CardDescription>High-value SPEI payments requiring manual approval</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount (MXN)</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Payment Ref</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersToValidate.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-semibold">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="font-mono">${order.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={`${getPriorityColor(order.priority)} text-white`}>
                      {order.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{order.reference}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedOrder(order.id)}
                      variant="outline"
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Validation Form */}
      {selectedOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Validate Order - {selectedOrder}</CardTitle>
            <CardDescription>Review order details and provide validation decision</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(() => {
              const order = ordersToValidate.find(o => o.id === selectedOrder);
              if (!order) return null;
              
              return (
                <>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <strong>Customer:</strong> {order.customer}
                    </div>
                    <div>
                      <strong>Amount:</strong> ${order.amount.toLocaleString()} MXN
                    </div>
                    <div>
                      <strong>Payment Reference:</strong> {order.reference}
                    </div>
                    <div>
                      <strong>Priority:</strong> {order.priority}
                    </div>
                    <div className="col-span-2">
                      <strong>Items:</strong> {order.items.join(", ")}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Bank Reference Number</label>
                    <Input placeholder="Enter bank reference for verification..." />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Validation Notes</label>
                    <Textarea 
                      placeholder="Add validation notes, concerns, or additional information..."
                      value={validationNotes}
                      onChange={(e) => setValidationNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => handleValidateOrder(selectedOrder, 'approve')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Payment
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleValidateOrder(selectedOrder, 'reject')}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Payment
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedOrder(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
