import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar is rendered in App.jsx */}
            <div className="flex-grow pt-16">
                <main className="mx-auto w-full">
                    {children}
                </main>
            </div>
            <Toaster
                position="top-center"
                toastOptions={{
                    className: 'glass',
                    style: {
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(12px)',
                        color: '#333',
                    },
                }}
            />
        </div>
    );
};

export default Layout;
