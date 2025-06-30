
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, DollarSign, Clock, CheckCircle } from "lucide-react";
import StatsCard from "@/components/StatsCard";

export function SPEIValidation() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Mock data for high-value orders pending validation
  const pendingOrders = [
    {
      id: "ORD-001",
      customer: "Empresa ABC S.A. de C.V.",
      amount: 25000,
      paymentRef: "SPEI-240115-001",
      orderDate: "2024-01-15",
      status: "Pending Validation",
      items: "5x iPhone 15 Pro"
    },
    {
      id: "ORD-002", 
      customer: "Tecnología XYZ",
      amount: 45000,
      paymentRef: "SPEI-240114-002",
      orderDate: "2024-01-14",
      status: "Pending Validation",
      items: "3x MacBook Pro, 2x iPad Pro"
    },
    {
      id: "ORD-003",
      customer: "Distribuidora DEF",
      amount: 32000,
      paymentRef: "SPEI-240113-003",
      orderDate: "2024-01-13",
      status: "Validated",
      items: "8x Samsung Galaxy S24"
    }
  ];

  const handleValidatePayment = (orderId: string) => {
    setSelectedOrder(orderId);
    // Here would be the validation logic
    console.log(`Validating payment for order ${orderId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Validation": return "bg-orange-500";
      case "Validated": return "bg-green-500";
      case "Rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">SPEI Payment Validation</h1>
      </div>

      {/* Alert for high-value orders */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Orders over $20,000 MXN with SPEI payment method require manual validation before fulfillment.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Pending Validation"
          value="7"
          change={2.1}
          icon={<Clock className="h-4 w-4 text-orange-500" />}
        />
        <StatsCard
          title="Validated Today"
          value="12"
          change={15.3}
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        />
        <StatsCard
          title="Total Amount"
          value="$542K"
          change={8.7}
          icon={<DollarSign className="h-4 w-4 text-blue-500" />}
        />
        <StatsCard
          title="Avg. Validation Time"
          value="2.3h"
          change={-12.4}
          icon={<Clock className="h-4 w-4 text-purple-500" />}
        />
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>High-Value Orders Requiring Validation</CardTitle>
          <CardDescription>SPEI payments over $20,000 MXN pending manual verification</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount (MXN)</TableHead>
                <TableHead>Payment Reference</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-semibold">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="font-mono">${order.amount.toLocaleString()}</TableCell>
                  <TableCell className="font-mono text-sm">{order.paymentRef}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.status === "Pending Validation" ? (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleValidatePayment(order.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Validate
                        </Button>
                        <Button variant="destructive" size="sm">
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm">View Details</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Validation Form */}
      {selectedOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Validate Payment - {selectedOrder}</CardTitle>
            <CardDescription>Verify SPEI payment details and approve order fulfillment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Bank Reference Number</label>
                <Input placeholder="Enter bank reference..." />
              </div>
              <div>
                <label className="text-sm font-medium">Validation Notes</label>
                <Input placeholder="Optional validation notes..." />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="bg-green-600 hover:bg-green-700">
                Confirm Validation
              </Button>
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
