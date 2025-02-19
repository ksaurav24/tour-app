"use client";

import { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaPlane, FaBell, FaBars, FaSignOutAlt, FaTimes, FaCompass } from 'react-icons/fa';

type LayoutProps = {
  children: ReactNode;
};

const sidebarItems = [
  { icon: FaCompass, label: 'Dashboard', href: '/home' },
  { icon: FaUser, label: 'Profile', href: '/home/profile' },
  { icon: FaPlane, label: 'Trips', href: '/home/trips' },
  { icon: FaBell, label: 'Notifications', href: '/home/notifications' },
];

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(!token){
      router.push('/login')
    }
  },[])

  return (
    <div className="flex h-screen bg-white">
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <motion.nav
            initial={{ x: isMobile ? -280 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`fixed left-0 top-0 bottom-0 w-72 bg-white text-[#03181F] shadow-lg z-30 flex flex-col ${
              isMobile ? '' : 'lg:relative'
            }`}
          >
            <div className="flex items-center justify-between h-16 px-6 bg-[#CCF5FE]">
              <h1 className="text-2xl font-bold text-[#03181F]">Tour App</h1>
              {isMobile && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleSidebar}
                  className="focus:outline-none text-[#03181F]"
                >
                  <FaTimes className="w-6 h-6" />
                </motion.button>
              )}
            </div>
            <div className="flex-grow overflow-y-auto">
              <ul className="py-4">
                {sidebarItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ backgroundColor: '#CCF5FE' }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center px-6 py-3 cursor-pointer transition-colors bg-white duration-200 ${
                          pathname === item.href ? ' border-r-4 border-[#319CB5]' : ''
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3 text-[#319CB5]" />
                        <span className="text-[#03181F]">{item.label}</span>
                      </motion.div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 border-t border-[#CCF5FE]">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center justify-center w-full px-4 py-2 bg-[#319CB5] text-white rounded-md hover:bg-[#03181F] transition-colors duration-200"
              >
                <FaSignOutAlt className="w-5 h-5 mr-2" />
                Logout
              </motion.button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm h-16 flex items-center lg:pl-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="text-[#03181F] hover:text-[#319CB5] focus:outline-none lg:hidden ml-4"
          >
            <FaBars className="w-6 h-6" />
          </motion.button>
          <h2 className="text-xl font-semibold text-[#03181F] ml-4">
            {sidebarItems.find((item) => item.href === pathname)?.label || 'Dashboard'}
          </h2>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F0F4F8] p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {isMobile && isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
