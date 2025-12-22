import { Request, Response } from 'express';
import prisma from '../../config/db';
import { z } from 'zod';

const locationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    content: z.string().optional(),
});

export const createLocation = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = locationSchema.parse(req.body);

        const existing = await prisma.location.findUnique({
            where: { slug: validatedData.slug }
        });

        if (existing) {
            res.status(400).json({ message: 'Slug already exists' });
            return;
        }

        const location = await prisma.location.create({
            data: validatedData
        });

        res.status(201).json(location);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.issues });
        } else {
            console.error('Create location error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const updateLocation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const validatedData = locationSchema.parse(req.body);

        // Check uniqueness if slug changed
        const existing = await prisma.location.findFirst({
            where: {
                slug: validatedData.slug,
                NOT: { id }
            }
        });

        if (existing) {
            res.status(400).json({ message: 'Slug already taken by another location' });
            return;
        }

        const location = await prisma.location.update({
            where: { id },
            data: validatedData
        });

        res.json(location);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.issues });
        } else {
            // Handle "Record not found" from Prisma
            if ((error as any).code === 'P2025') {
                res.status(404).json({ message: 'Location not found' });
                return;
            }
            console.error('Update location error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export const deleteLocation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await prisma.location.delete({
            where: { id }
        });

        res.json({ message: 'Location deleted successfully' });
    } catch (error) {
        if ((error as any).code === 'P2025') {
            res.status(404).json({ message: 'Location not found' });
            return;
        }
        console.error('Delete location error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllLocations = async (req: Request, res: Response): Promise<void> => {
    try {
        const locations = await prisma.location.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(locations);
    } catch (error) {
        console.error('Get all locations error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
