"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.addItem = void 0;
const db_1 = __importDefault(require("../config/db"));
const zod_1 = require("zod");
const itemSchema = zod_1.z.object({
    categoryId: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number(),
    image: zod_1.z.string().optional(),
    isVeg: zod_1.z.boolean().optional(),
});
const addItem = async (req, res) => {
    try {
        const { categoryId, name, description, price, image, isVeg } = itemSchema.parse(req.body);
        const item = await db_1.default.item.create({
            data: {
                categoryId,
                name,
                description,
                price,
                image,
                isVeg: isVeg || true,
            },
        });
        res.status(201).json(item);
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
exports.addItem = addItem;
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const data = itemSchema.partial().parse(req.body);
        const item = await db_1.default.item.update({
            where: { id },
            data,
        });
        res.json(item);
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
exports.updateItem = updateItem;
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.default.item.delete({ where: { id } });
        res.json({ message: 'Item deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteItem = deleteItem;
