"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddress = exports.deleteAddress = exports.getAddresses = exports.addAddress = void 0;
const db_1 = __importDefault(require("../config/db"));
const zod_1 = require("zod");
const addressSchema = zod_1.z.object({
    street: zod_1.z.string().min(5),
    city: zod_1.z.string().min(2),
    zip: zod_1.z.string().min(5),
    isDefault: zod_1.z.boolean().optional(),
});
const addAddress = async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        const { street, city, zip, isDefault } = addressSchema.parse(req.body);
        if (isDefault) {
            await db_1.default.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        const address = await db_1.default.address.create({
            data: {
                userId,
                street,
                city,
                zip,
                isDefault: isDefault || false,
            },
        });
        res.status(201).json(address);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ errors: error.issues });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
exports.addAddress = addAddress;
const getAddresses = async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        const addresses = await db_1.default.address.findMany({
            where: { userId },
        });
        res.json(addresses);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAddresses = getAddresses;
const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user?.userId;
        const address = await db_1.default.address.findUnique({ where: { id } });
        if (!address || address.userId !== userId) {
            res.status(404).json({ message: 'Address not found' });
            return;
        }
        await db_1.default.address.delete({ where: { id } });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteAddress = deleteAddress;
const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user?.userId;
        const { street, city, zip, isDefault } = addressSchema.parse(req.body);
        const address = await db_1.default.address.findUnique({ where: { id } });
        if (!address || address.userId !== userId) {
            res.status(404).json({ message: 'Address not found' });
            return;
        }
        if (isDefault) {
            await db_1.default.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        const updatedAddress = await db_1.default.address.update({
            where: { id },
            data: {
                street,
                city,
                zip,
                isDefault: isDefault || false,
            },
        });
        res.json(updatedAddress);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ errors: error.issues });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
exports.updateAddress = updateAddress;
