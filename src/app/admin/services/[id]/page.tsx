
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { services, branches, type Service, type BranchPrice } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const service = services.find(s => s.id === params.id);
  
  // State for the price management dialog
  const [open, setOpen] = useState(false);
  const [branchPrices, setBranchPrices] = useState(service?.branchPricing || []);

  if (!service) {
    return (
        <div className="container py-12 md:py-20 text-center">
            <h1 className="text-2xl font-bold">Service not found</h1>
            <Button asChild variant="link">
                <Link href="/admin/services">Go back to services</Link>
            </Button>
        </div>
    )
  }

  const handlePriceChange = (branchId: string, price: number) => {
    setBranchPrices(prevPrices => {
      const existing = prevPrices.find(p => p.branchId === branchId);
      if (existing) {
        return prevPrices.map(p => p.branchId === branchId ? { ...p, price } : p);
      }
      return [...prevPrices, { branchId, price, status: 'Inactive' }];
    });
  };

  const handleStatusChange = (branchId: string, isActive: boolean) => {
     setBranchPrices(prevPrices => {
      const existing = prevPrices.find(p => p.branchId === branchId);
      const newStatus = isActive ? 'Active' : 'Inactive';
      if (existing) {
        return prevPrices.map(p => p.branchId === branchId ? { ...p, status: newStatus } : p);
      }
      return [...prevPrices, { branchId, price: 0, status: newStatus }];
    });
  };

  const handleSaveChanges = () => {
    // Here you would typically make an API call to save the changes
    console.log('Saving changes:', branchPrices);
    // For demo purposes, we can update the service in memory, but this won't persist.
    service.branchPricing = branchPrices;
    setOpen(false);
  };
  
  // Create a map for quick lookup
  const priceMap = new Map(branchPrices.map(p => [p.branchId, p]));

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon" className="h-8 w-8">
                <Link href="/admin/services">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back to Services</span>
                </Link>
            </Button>
            <h1 className="text-xl font-semibold sm:text-2xl">Service Details</h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
             <div className="lg:col-span-1 flex flex-col gap-6">
                <Card className="shadow-none border-border">
                    <CardHeader>
                        <Image 
                            src={service.image.imageUrl} 
                            alt={service.name} 
                            width={400} 
                            height={400}
                            className="w-full aspect-video object-cover rounded-lg"
                        />
                    </CardHeader>
                    <CardContent className="pt-4 space-y-2">
                        <CardTitle className="text-2xl">{service.name}</CardTitle>
                        <Badge variant="outline">{service.category}</Badge>
                        <CardDescription>{service.longDescription}</CardDescription>
                    </CardContent>
                    <CardFooter>
                         <p className="font-semibold text-lg">Default Price: ${service.price.toFixed(2)}</p>
                    </CardFooter>
                </Card>
             </div>
             <div className="lg:col-span-2">
                <Card className="shadow-none border-border">
                    <CardHeader className="flex-row items-center justify-between">
                       <div>
                         <CardTitle>Branch Pricing</CardTitle>
                         <CardDescription>Manage prices for this service at different branches.</CardDescription>
                       </div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Settings2 className="mr-2 h-4 w-4" />
                                    Manage Prices
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                <DialogTitle>Manage Branch Prices for '{service.name}'</DialogTitle>
                                <DialogDescription>
                                    Adjust prices and availability for each branch. Click save when you're done.
                                </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="max-h-[60vh] pr-6">
                                    <div className="grid gap-6 py-4">
                                    {branches.map(branch => {
                                        const branchPrice = priceMap.get(branch.id);
                                        const price = branchPrice?.price ?? service.price;
                                        const isActive = branchPrice?.status === 'Active';
                                        
                                        return (
                                        <div key={branch.id} className="grid grid-cols-4 items-center gap-4 border-b pb-4">
                                            <Label htmlFor={`branch-${branch.id}`} className="col-span-4 text-base font-semibold">{branch.name}</Label>
                                            
                                            <div className="col-span-2 space-y-2">
                                                <Label htmlFor={`price-${branch.id}`}>Price ($)</Label>
                                                <Input
                                                    id={`price-${branch.id}`}
                                                    type="number"
                                                    defaultValue={price}
                                                    onChange={(e) => handlePriceChange(branch.id, Number(e.target.value))}
                                                    className="w-full"
                                                />
                                            </div>
                                            
                                            <div className="col-span-2 flex flex-col items-start space-y-2">
                                                 <Label htmlFor={`status-${branch.id}`}>Status</Label>
                                                 <div className="flex items-center gap-2">
                                                    <Switch
                                                        id={`status-${branch.id}`}
                                                        checked={isActive}
                                                        onCheckedChange={(checked) => handleStatusChange(branch.id, checked)}
                                                    />
                                                    <span className="text-sm text-muted-foreground">{isActive ? 'Active' : 'Inactive'}</span>
                                                 </div>
                                            </div>
                                        </div>
                                        )
                                    })}
                                    </div>
                                </ScrollArea>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                    <Button onClick={handleSaveChanges}>Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Branch Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {service.branchPricing.map((bp) => {
                                    const branch = branches.find(b => b.id === bp.branchId);
                                    return (
                                        <TableRow key={bp.branchId}>
                                            <TableCell className="font-medium">{branch?.name}</TableCell>
                                            <TableCell>${bp.price.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Badge variant={bp.status === 'Active' ? 'default' : 'secondary'}
                                                    className={bp.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                                                >
                                                    {bp.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {service.branchPricing.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            No branch-specific pricing set. Uses default price.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
             </div>
        </div>
    </div>
  );
}
