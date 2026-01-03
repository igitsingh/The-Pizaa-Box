import { Request, Response } from 'express';
import {
    getPendingOrders,
    getKitchenOrders,
    getReadyOrders,
    getOrderCountsByStatus
} from '../../utils/orderQueries';

/**
 * KITCHEN BOARD CONTROLLER
 * Provides real-time order data for kitchen display
 */

/**
 * Get all orders relevant to kitchen operations
 * Returns: Pending (new), Kitchen (in progress), Ready (for pickup/delivery)
 */
export const getKitchenBoard = async (req: Request, res: Response) => {
    try {
        const [pending, kitchen, ready] = await Promise.all([
            getPendingOrders(),
            getKitchenOrders(),
            getReadyOrders(),
        ]);

        res.json({
            pending,
            kitchen,
            ready,
            counts: {
                pending: pending.length,
                kitchen: kitchen.length,
                ready: ready.length,
            },
        });
    } catch (error: any) {
        console.error('Kitchen board error:', error);
        // Never crash - return empty state
        res.json({
            pending: [],
            kitchen: [],
            ready: [],
            counts: {
                pending: 0,
                kitchen: 0,
                ready: 0,
            },
        });
    }
};

/**
 * Get kitchen stats (for header/summary)
 */
export const getKitchenStats = async (req: Request, res: Response) => {
    try {
        const counts = await getOrderCountsByStatus();

        res.json({
            pending: counts.pending,
            kitchen: counts.kitchen,
            ready: counts.ready,
            active: counts.active,
        });
    } catch (error: any) {
        console.error('Kitchen stats error:', error);
        res.json({
            pending: 0,
            kitchen: 0,
            ready: 0,
            active: 0,
        });
    }
};

/**
 * Sync kitchen board (WebSocket alternative - polling endpoint)
 * Returns only counts for lightweight polling
 */
export const syncKitchen = async (req: Request, res: Response) => {
    try {
        const counts = await getOrderCountsByStatus();

        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            counts: {
                pending: counts.pending,
                kitchen: counts.kitchen,
                ready: counts.ready,
            },
        });
    } catch (error: any) {
        console.error('Kitchen sync error:', error);
        res.json({
            success: false,
            timestamp: new Date().toISOString(),
            counts: {
                pending: 0,
                kitchen: 0,
                ready: 0,
            },
        });
    }
};
