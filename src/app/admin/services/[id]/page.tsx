
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
import { ArrowLeft, Edit, PlusCircle, Settings2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const service = services.find(s => s.id === params.id);
  
  // State for the price management dialog
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchPrice | null>(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isActive, setIsActive] = useState(false);

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

  const handleBranchSelect = (branchId: string) => {
    const branchPrice = service.branchPricing.find(p => p.branchId === branchId) || null;
    setSelectedBranch(branchPrice);
    setCurrentPrice(branchPrice?.price || 0);
    setIsActive(branchPrice?.status === 'Active' || false);
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', {
      branchId: selectedBranch?.branchId,
      price: currentPrice,
      status: isActive ? 'Active' : 'Inactive',
    });
    setOpen(false);
    setSelectedBranch(null);
  };

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
                            <DialogContent className="sm:max-w-[480px]">
                                <DialogHeader>
                                <DialogTitle>Manage Branch Price</DialogTitle>
                                <DialogDescription>
                                    Select a branch to adjust the price and availability for the '{service.name}' service.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="branch">Branch</Label>
                                        <Select onValueChange={handleBranchSelect}>
                                            <SelectTrigger id="branch">
                                                <SelectValue placeholder="Select a branch..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {branches.map(branch => (
                                                    <SelectItem key={branch.id} value={branch.id}>
                                                        {branch.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {selectedBranch && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="price">Price ($)</Label>
                                                <Input id="price" type="number" value={currentPrice} onChange={(e) => setCurrentPrice(Number(e.target.value))} />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Switch id="status" checked={isActive} onCheckedChange={setIsActive} />
                                                <Label htmlFor="status">{isActive ? 'Active' : 'Inactive'}</Label>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                    <Button onClick={handleSaveChanges} disabled={!selectedBranch}>Save changes</Button>
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
                                            No branch-specific pricing set.
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
