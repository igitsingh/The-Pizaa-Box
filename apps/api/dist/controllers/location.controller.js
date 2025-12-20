"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocations = exports.getLocationBySlug = void 0;
const db_1 = __importDefault(require("../config/db"));
const getLocationBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const location = await db_1.default.location.findUnique({
            where: { slug },
        });
        if (!location) {
            res.status(404).json({ message: 'Location not found' });
            return;
        }
        res.json(location);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getLocationBySlug = getLocationBySlug;
const getLocations = async (req, res) => {
    try {
        const locations = await db_1.default.location.findMany();
        res.json(locations);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getLocations = getLocations;
