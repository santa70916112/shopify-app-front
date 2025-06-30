import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Upload, Download, Search, Plus, Package, X } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { useToast } from "@/hooks/use-toast";

export function InventoryDashboard() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerm1, setSearchTerm1] = useState("");
  const [filterModel, setFilterModel] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  const [filterSKU, setFilterSKU] = useState("all");
  const [filterColor, setFilterColor] = useState("all");
  const [filterBatch, setFilterBatch] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    model: "",
    product: "",
    imei: "",
    sku: "",
    serialNumber: "",
    color: "",
    location: "",
    batch: "",
    status: "Available",
    dateAdded: new Date().toISOString().slice(0, 10),
  });
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [sellProduct, setSellProduct] = useState("");
  const [sellQuantity, setSellQuantity] = useState(1);
  const [sellLoading, setSellLoading] = useState(false);

  // Fetch inventory from backend
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterModel !== "all") params.append("model", filterModel);
      if (filterProduct !== "all") params.append("product", filterProduct);
      if (filterSKU !== "all") params.append("sku", filterSKU);
      if (filterColor !== "all") params.append("color", filterColor);
      if (filterBatch !== "all") params.append("batch", filterBatch);
      if (searchTerm) params.append("imei", searchTerm);
      if (searchTerm1) params.append("serialNumber", searchTerm1);

      const url = `http://localhost:5001/api/inventory?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      if (Array.isArray(data)) {
        setInventoryItems(data);
      } else {
        setInventoryItems([]);
        toast({ title: "Error", description: "Inventory data is invalid.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to load inventory.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [filterModel, filterProduct, filterSKU, filterColor, filterBatch, searchTerm, searchTerm1]);

  useEffect(() => {
    fetch('http://localhost:5001/api/inventory/unique-categories')
      .then(res => res.json())
      .then(setAllCategories);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-500";
      case "Reserved": return "bg-yellow-500";
      case "Sold": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleAddItem = async () => {
    // Generate a unique id (max id + 1)
    const maxId = inventoryItems.length > 0 ? Math.max(...inventoryItems.map((item: any) => item.id || 0)) : 0;
    // Convert dateAdded to ISO string for Mongoose
    let dateAddedISO = newItem.dateAdded;
    if (dateAddedISO && !dateAddedISO.includes('T')) {
      // If it's in 'YYYY-MM-DD', convert to ISO
      // Also, ensure the input is not in MM/DD/YYYY format
      const parts = dateAddedISO.split('-');
      if (parts.length === 3) {
        // YYYY-MM-DD
        dateAddedISO = new Date(dateAddedISO).toISOString();
      } else {
        // fallback: try to parse as Date
        dateAddedISO = new Date(Date.parse(dateAddedISO)).toISOString();
      }
    }
    const itemToSend = { ...newItem, id: maxId + 1, dateAdded: dateAddedISO };
    console.log("Sending item to backend:", itemToSend);
    try {
      const res = await fetch("http://localhost:5001/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemToSend),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("POST /api/inventory failed", errorText);
        throw new Error("Failed to add item");
      }
      toast({ title: "Success", description: "Item added successfully!" });
      setIsAddModalOpen(false);
      setNewItem({
        model: "",
        product: "",
        imei: "",
        sku: "",
        serialNumber: "",
        color: "",
        location: "",
        batch: "",
        status: "Available",
        dateAdded: new Date().toISOString().slice(0, 10)
      });
      fetchInventory();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to add item.", variant: "destructive" });
    }
  };

  // Get unique values for filter options
  const uniqueModels = [...new Set(inventoryItems.map(item => item.model))];
  const uniqueProducts = [...new Set(inventoryItems.map(item => item.product))];
  const uniqueSKUs = [...new Set(inventoryItems.map(item => item.sku))];
  const uniqueColors = [...new Set(inventoryItems.map(item => item.color))];
  const uniqueBatches = [...new Set(inventoryItems.map(item => item.batch))];

  // Dynamic status counts
  const totalItems = inventoryItems.length;
  const availableCount = inventoryItems.filter(item => String(item.status).toLowerCase() === 'available').length;
  const reservedCount = inventoryItems.filter(item => String(item.status).toLowerCase() === 'reserved').length;
  const today = new Date().toISOString().slice(0, 10);
  const soldTodayCount = inventoryItems.filter(item => {
    const status = String(item.status).toLowerCase();
    const date = new Date(item.dateAdded).toISOString().slice(0, 10);
    return status === 'sold' && date === today;
  }).length;

  // Get available count for selected product
  const availableForProduct = sellProduct
    ? inventoryItems.filter(item => String(item.status).toLowerCase() === 'available' && item.product === sellProduct).length
    : 0;

  // Handle SELL action
  const handleSell = async () => {
    // Validate product and quantity
    if (!sellProduct || typeof sellProduct !== 'string' || !sellProduct.trim()) {
      toast({ title: "Error", description: "Please select a product.", variant: "destructive" });
      return;
    }
    const qty = Number(sellQuantity);
    if (!qty || isNaN(qty) || qty < 1) {
      toast({ title: "Error", description: "Please enter a valid quantity (number > 0).", variant: "destructive" });
      return;
    }
    if (qty > availableForProduct) {
      toast({ title: "Error", description: `Only ${availableForProduct} available for this product.`, variant: "destructive" });
      return;
    }
    setSellLoading(true);
    const payload = { product: String(sellProduct).trim(), quantity: Number(qty) };
    console.log("SELL payload:", payload);
    try {
      const res = await fetch("http://localhost:5001/api/inventory/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "Error", description: data.error || "Sale failed.", variant: "destructive" });
      } else {
        toast({ title: "Success", description: data.message || "Sale completed!" });
        setSellProduct("");
        setSellQuantity(1);
        fetchInventory();
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to process sale.", variant: "destructive" });
    } finally {
      setSellLoading(false);
    }
  };

  // Disable SELL button unless both fields are valid
  const canSell = !!sellProduct && Number(sellQuantity) > 0 && Number(sellQuantity) <= availableForProduct;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
                <DialogDescription>
                  Enter the product properties to add a new item to inventory.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model" className="text-right">Model</Label>
                  <Input
                    id="model"
                    value={newItem.model}
                    onChange={(e) => setNewItem({...newItem, model: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product" className="text-right">Product</Label>
                  <Input
                    id="product"
                    value={newItem.product}
                    onChange={(e) => setNewItem({...newItem, product: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imei" className="text-right">IMEI</Label>
                  <Input
                    id="imei"
                    value={newItem.imei}
                    onChange={(e) => setNewItem({...newItem, imei: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sku" className="text-right">SKU</Label>
                  <Input
                    id="sku"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="serialNumber" className="text-right">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={newItem.serialNumber}
                    onChange={(e) => setNewItem({...newItem, serialNumber: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="color" className="text-right">Color</Label>
                  <Input
                    id="color"
                    value={newItem.color}
                    onChange={(e) => setNewItem({...newItem, color: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">Location</Label>
                  <Input
                    id="location"
                    value={newItem.location}
                    onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="batch" className="text-right">Batch</Label>
                  <Input
                    id="batch"
                    value={newItem.batch}
                    onChange={(e) => setNewItem({ ...newItem, batch: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select value={newItem.status} onValueChange={(val) => setNewItem({ ...newItem, status: val })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Reserved">Reserved</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateAdded" className="text-right">Date Added</Label>
                  <Input
                    id="dateAdded"
                    type="date"
                    value={newItem.dateAdded}
                    onChange={(e) => setNewItem({ ...newItem, dateAdded: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddItem}>Add Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Items"
          value={totalItems.toLocaleString()}
          change={0}
          icon={<Package className="h-4 w-4 text-blue-500" />}
        />
        <StatsCard
          title="Available"
          value={availableCount.toLocaleString()}
          change={0}
          icon={<Package className="h-4 w-4 text-green-500" />}
        />
        <StatsCard
          title="Reserved"
          value={reservedCount.toLocaleString()}
          change={0}
          icon={<Package className="h-4 w-4 text-yellow-500" />}
        />
        <StatsCard
          title="Sold Today"
          value={soldTodayCount.toLocaleString()}
          change={0}
          icon={<Package className="h-4 w-4 text-purple-500" />}
        />
      </div>

                 {/* FIFO Sell Section */}
                 <Card className="mb-4">
        <CardHeader>
          <CardTitle>Sell Product (FIFO)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-center">
          <Select value={sellProduct} onValueChange={setSellProduct}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              {uniqueProducts.map((product) => (
                <SelectItem key={product} value={product}>{product}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            min={1}
            max={availableForProduct || 1}
            value={sellQuantity}
            onChange={e => setSellQuantity(Number(e.target.value))}
            className="w-32"
            placeholder="Quantity"
            disabled={!sellProduct}
          />
          <Button
            onClick={handleSell}
            disabled={sellLoading || !canSell}
            className="w-32"
          >
            {sellLoading ? "Selling..." : "SELL"}
          </Button>
          {sellProduct && (
            <span className="text-sm text-muted-foreground">Available: {availableForProduct}</span>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>IMEI Inventory</CardTitle>
          <CardDescription>Manage individual product units by IMEI with FIFO logic</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Filter Controls */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            <Select value={filterModel} onValueChange={setFilterModel}>
              <SelectTrigger>
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {uniqueModels.map((model) => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterProduct} onValueChange={setFilterProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {uniqueProducts.map((product) => (
                  <SelectItem key={product} value={product}>{product}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterSKU} onValueChange={setFilterSKU}>
              <SelectTrigger>
                <SelectValue placeholder="SKU" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All SKUs</SelectItem>
                {uniqueSKUs.map((sku) => (
                  <SelectItem key={sku} value={sku}>{sku}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Input
                placeholder="IMEI"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <Input
                placeholder="Serial Number"
                value={searchTerm1}
                onChange={(e) => setSearchTerm1(e.target.value)}
              />
            </div>

            <Select value={filterColor} onValueChange={setFilterColor}>
              <SelectTrigger>
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colors</SelectItem>
                {uniqueColors.map((color) => (
                  <SelectItem key={color} value={color}>{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterBatch} onValueChange={setFilterBatch}>
              <SelectTrigger>
                <SelectValue placeholder="Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {uniqueBatches.map((batch) => (
                  <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Inventory Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead> 
                <TableHead>Serial Number</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item._id || `${item.id}-${item.serialNumber}`}>
                  <TableCell className="font-mono text-sm">{item.model}</TableCell>
                  <TableCell>{item.product}</TableCell>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell className="font-mono text-sm">{item.serialNumber}</TableCell>
                  <TableCell>{item.color}</TableCell>
                  <TableCell className="font-mono text-sm">{item.batch}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(item.status)} text-white`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(item.dateAdded).toISOString().slice(0, 10)}</TableCell>
                  <TableCell>{item.location}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
