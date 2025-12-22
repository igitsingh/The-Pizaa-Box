"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLocations = exports.deleteLocation = exports.updateLocation = exports.createLocation = void 0;
const db_1 = __importDefault(require("../../config/db"));
const zod_1 = require("zod");
const locationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    slug: zod_1.z.string().min(1, "Slug is required"),
    seoTitle: zod_1.z.string().optional(),
    seoDescription: zod_1.z.string().optional(),
    content: zod_1.z.string().optional(),
});
const createLocation = async (req, res) => {
    try {
        const validatedData = locationSchema.parse(req.body);
        const existing = await db_1.default.location.findUnique({
            where: { slug: validatedData.slug }
        });
        if (existing) {
            res.status(400).json({ message: 'Slug already exists' });
            return;
        }
        const location = await db_1.default.location.create({
            data: validatedData
        });
        res.status(201).json(location);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ errors: error.issues });
        }
        else {
            console.error('Create location error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
exports.createLocation = createLocation;
const updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = locationSchema.parse(req.body);
        // Check uniqueness if slug changed
        const existing = await db_1.default.location.findFirst({
            where: {
                slug: validatedData.slug,
                NOT: { id }
            }
        });
        if (existing) {
            res.status(400).json({ message: 'Slug already taken by another location' });
            return;
        }
        const location = await db_1.default.location.update({
            where: { id },
            data: validatedData
        });
        res.json(location);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ errors: error.issues });
        }
        else {
            // Handle "Record not found" from Prisma
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Location not found' });
                return;
            }
            console.error('Update location error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
exports.updateLocation = updateLocation;
const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.default.location.delete({
            where: { id }
        });
        res.json({ message: 'Location deleted successfully' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Location not found' });
            return;
        }
        console.error('Delete location error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteLocation = deleteLocation;
const getAllLocations = async (req, res) => {
    try {
        const locations = await db_1.default.location.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(locations);
    }
    catch (error) {
        console.error('Get all locations error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllLocations = getAllLocations;
