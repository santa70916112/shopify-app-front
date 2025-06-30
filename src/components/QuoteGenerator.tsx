
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Plus, Minus, Calculator, Users } from "lucide-react";
import StatsCard from "@/components/StatsCard";

export function QuoteGenerator() {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    company: "",
    contact: "",
    email: ""
  });

  // Mock inventory data
  const availableProducts = [
    { id: 1, name: "iPhone 15 Pro", available: 25, price: 22999, category: "Smartphones" },
    { id: 2, name: "Samsung Galaxy S24", available: 18, price: 19999, category: "Smartphones" },
    { id: 3, name: "MacBook Pro 14\"", available: 8, price: 45999, category: "Laptops" },
    { id: 4, name: "iPad Pro 12.9\"", available: 12, price: 29999, category: "Tablets" },
    { id: 5, name: "AirPods Pro", available: 0, price: 6999, category: "Audio" },
  ];

  const addToQuote = (product: any) => {
    const existing = selectedItems.find(item => item.id === product.id);
    if (existing) {
      setSelectedItems(selectedItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: Math.min(item.quantity + 1, product.available) }
          : item
      ));
    } else {
      setSelectedItems([...selectedItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setSelectedItems(selectedItems.filter(item => item.id !== productId));
    } else {
      setSelectedItems(selectedItems.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const hasOutOfStock = selectedItems.some(item => 
    availableProducts.find(p => p.id === item.id)?.available === 0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">B2B Quote Generator</h1>
        <Button variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          Backorder Form
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Active Quotes"
          value="24"
          change={8.3}
          icon={<Calculator className="h-4 w-4 text-blue-500" />}
        />
        <StatsCard
          title="B2B Customers"
          value="156"
          change={12.1}
          icon={<Users className="h-4 w-4 text-green-500" />}
        />
        <StatsCard
          title="Avg Quote Value"
          value="$89K"
          change={5.7}
          icon={<Calculator className="h-4 w-4 text-purple-500" />}
        />
        <StatsCard
          title="Conversion Rate"
          value="68%"
          change={15.2}
          icon={<Users className="h-4 w-4 text-orange-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Enter B2B customer details for the quote</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Company Name"
              value={customerInfo.company}
              onChange={(e) => setCustomerInfo({...customerInfo, company: e.target.value})}
            />
            <Input
              placeholder="Contact Person"
              value={customerInfo.contact}
              onChange={(e) => setCustomerInfo({...customerInfo, contact: e.target.value})}
            />
            <Input
              placeholder="Email Address"
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
            />
          </CardContent>
        </Card>

        {/* Quote Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Summary</CardTitle>
            <CardDescription>
              {selectedItems.length} items • Total: ${calculateTotal().toLocaleString()} MXN
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No items selected</p>
            ) : (
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {hasOutOfStock && (
                  <Alert>
                    <AlertDescription>
                      Some items are out of stock. 
                      <Button variant="link" className="p-0 ml-1">
                        Submit backorder request
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${calculateTotal().toLocaleString()} MXN</span>
                  </div>
                  <Button className="w-full mt-4">Generate Quote</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Product Catalog */}
      <Card>
        <CardHeader>
          <CardTitle>Live Inventory</CardTitle>
          <CardDescription>Available products for B2B quotes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Available Stock</TableHead>
                <TableHead>Unit Price (MXN)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Badge variant={product.available > 0 ? "default" : "destructive"}>
                      {product.available > 0 ? `${product.available} units` : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">${product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    {product.available > 0 ? (
                      <Button size="sm" onClick={() => addToQuote(product)}>
                        Add to Quote
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Backorder
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
