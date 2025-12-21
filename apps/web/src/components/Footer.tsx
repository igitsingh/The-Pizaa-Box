const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">The Pizza Box</h3>
                        <p className="text-gray-400">
                            433, Prabhat Nagar, Meerut<br />
                            Uttar Pradesh 250001<br />
                            <span className="text-sm mt-2 block">Near Nagla Battu Road</span>
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/menu" className="hover:text-white">Order Online</a></li>
                            <li><a href="/menu" className="hover:text-white">Veg Pizza Menu</a></li>
                            <li><a href="/orders" className="hover:text-white">Track Order</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Contact Us</h4>
                        <p className="text-gray-400">Phone: <a href="tel:+911234567890" className="hover:text-white">+91 1234567890</a></p>
                        <p className="text-gray-400">Email: <a href="mailto:hello@thepizzabox.com" className="hover:text-white">hello@thepizzabox.com</a></p>
                        <div className="flex gap-4 mt-4">
                            {/* Social Placeholders */}
                            <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
                            <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
                    <p>© 2024 The Pizza Box. All rights reserved.</p>

                    <div className="mt-6 flex flex-col items-center gap-1">
                        <p className="text-xs font-bold tracking-widest uppercase text-gray-600">
                            <span style={{ color: '#f20707' }}>HOUSE OF FLOYDS</span> CREATION
                        </p>
                        <p className="text-[10px] text-gray-600 uppercase tracking-wider">
                            made in india 🇮🇳
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
