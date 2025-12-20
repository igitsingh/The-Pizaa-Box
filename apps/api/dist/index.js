"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("http");
dotenv_1.default.config();
const socket_1 = require("./socket");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = (0, socket_1.initSocket)(httpServer);
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const menu_routes_1 = __importDefault(require("./routes/menu.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const auth_routes_2 = __importDefault(require("./routes/admin/auth.routes"));
const menu_routes_2 = __importDefault(require("./routes/admin/menu.routes"));
const category_routes_1 = __importDefault(require("./routes/admin/category.routes"));
const order_routes_2 = __importDefault(require("./routes/admin/order.routes"));
const coupon_routes_1 = __importDefault(require("./routes/admin/coupon.routes"));
const user_routes_2 = __importDefault(require("./routes/admin/user.routes"));
const settings_routes_1 = __importDefault(require("./routes/admin/settings.routes"));
const location_routes_1 = __importDefault(require("./routes/location.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
// Middleware
app.use(express_1.default.json({
    verify: (req, res, buf) => {
        // @ts-ignore
        if (req.originalUrl.startsWith('/api/payments/webhook')) {
            // @ts-ignore
            req.rawBody = buf.toString();
        }
    }
}));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
const delivery_partner_routes_1 = __importDefault(require("./routes/admin/delivery-partner.routes"));
const analytics_routes_1 = __importDefault(require("./routes/admin/analytics.routes"));
const stock_routes_1 = __importDefault(require("./routes/admin/stock.routes"));
const payment_routes_2 = __importDefault(require("./routes/admin/payment.routes"));
const complaint_routes_1 = __importDefault(require("./routes/admin/complaint.routes"));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/menu', menu_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/admin/auth', auth_routes_2.default);
app.use('/api/admin/menu', menu_routes_2.default);
app.use('/api/admin/categories', category_routes_1.default);
app.use('/api/admin/orders', order_routes_2.default);
app.use('/api/admin/coupons', coupon_routes_1.default);
app.use('/api/admin/users', user_routes_2.default);
app.use('/api/admin/settings', settings_routes_1.default);
app.use('/api/admin/delivery-partners', delivery_partner_routes_1.default);
app.use('/api/admin/analytics', analytics_routes_1.default);
app.use('/api/admin/stock', stock_routes_1.default);
app.use('/api/admin/payments', payment_routes_2.default);
app.use('/api/admin/complaints', complaint_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/locations', location_routes_1.default);
app.use('/api/payments', payment_routes_1.default);
// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to The Pizza Box API' });
});
const order_socket_1 = require("./sockets/order.socket");
// Socket.io connection
(0, order_socket_1.setupOrderSockets)(io);
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
const PORT = 5001; // Force port 5001 to avoid conflict with AirPlay on 5000
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
