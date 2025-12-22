'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';

interface Location {
    id: string;
    name: string;
    slug: string;
    seoTitle?: string;
    seoDescription?: string;
    content?: string;
}

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        seoTitle: '',
        seoDescription: '',
        content: '',
    });

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            // Using api client (baseURL: /api/admin) -> GET /locations -> /api/admin/locations
            const res = await api.get('/locations');
            setLocations(res.data);
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Failed to load locations',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingLocation) {
                await api.put(`/locations/${editingLocation.id}`, formData);
            } else {
                await api.post('/locations', formData);
            }

            toast({
                title: 'Success',
                description: `Location ${editingLocation ? 'updated' : 'created'} successfully`,
            });

            setIsDialogOpen(false);
            fetchLocations();
            resetForm();
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Failed to save location',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this location?')) return;

        try {
            await api.delete(`/locations/${id}`);

            toast({
                title: 'Success',
                description: 'Location deleted successfully',
            });

            fetchLocations();
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Failed to delete location',
                variant: 'destructive',
            });
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            seoTitle: '',
            seoDescription: '',
            content: '',
        });
        setEditingLocation(null);
    };

    const handleEdit = (location: Location) => {
        setEditingLocation(location);
        setFormData({
            name: location.name,
            slug: location.slug,
            seoTitle: location.seoTitle || '',
            seoDescription: location.seoDescription || '',
            content: location.content || '',
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Locations</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" /> Add Location
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingLocation ? 'Edit Location' : 'Add Location'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seoTitle">SEO Title</Label>
                                <Input
                                    id="seoTitle"
                                    value={formData.seoTitle}
                                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seoDescription">SEO Description</Label>
                                <Textarea
                                    id="seoDescription"
                                    value={formData.seoDescription}
                                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content (HTML)</Label>
                                <Textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="h-32"
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                {editingLocation ? 'Update' : 'Create'} Location
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>SEO Title</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {locations.map((location) => (
                            <TableRow key={location.id}>
                                <TableCell className="font-medium">{location.name}</TableCell>
                                <TableCell>{location.slug}</TableCell>
                                <TableCell className="truncate max-w-xs">{location.seoTitle}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(location)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-600"
                                        onClick={() => handleDelete(location.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {locations.length === 0 && !isLoading && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    No locations found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
