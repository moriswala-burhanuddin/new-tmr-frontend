import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFloat from '../common/WhatsAppFloat';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <WhatsAppFloat />
        </div>
    );
};

export default Layout;
