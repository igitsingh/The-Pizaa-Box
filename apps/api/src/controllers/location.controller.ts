import { Request, Response } from 'express';
import prisma from '../config/db';

export const getLocationBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const location = await prisma.location.findUnique({
            where: { slug },
        });

        if (!location) {
            res.status(404).json({ message: 'Location not found' });
            return;
        }

        res.json(location);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getLocations = async (req: Request, res: Response): Promise<void> => {
    try {
        const locations = await prisma.location.findMany();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
