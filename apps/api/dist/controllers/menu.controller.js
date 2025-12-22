"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryBySlug = exports.getItem = exports.getMenu = void 0;
const db_1 = __importDefault(require("../config/db"));
const getMenu = async (req, res) => {
    try {
        const categories = await db_1.default.category.findMany({
            include: {
                items: {
                    include: {
                        options: {
                            include: {
                                choices: true,
                            },
                        },
                        addons: true,
                        variants: true,
                    },
                },
            },
        });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getMenu = getMenu;
const getItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await db_1.default.item.findUnique({
            where: { id },
            include: {
                options: {
                    include: {
                        choices: true,
                    },
                },
                addons: true,
                variants: true,
            },
        });
        if (!item) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getItem = getItem;
const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await db_1.default.category.findUnique({
            where: { slug },
            include: {
                items: {
                    include: {
                        options: {
                            include: {
                                choices: true,
                            },
                        },
                        addons: true,
                        variants: true,
                    },
                },
            },
        });
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCategoryBySlug = getCategoryBySlug;
