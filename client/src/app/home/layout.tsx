'use client';

import { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaPlane, FaBell, FaBars, FaSignOutAlt, FaTimes, FaCompass, FaChevronRight } from 'react-icons/fa';
import { ThemeToggle } from '@/components/ThemeToggle';

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

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token){
      router.push('/login')
    }
  }, [])

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    return pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      return { label: segment.charAt(0).toUpperCase() + segment.slice(1), path };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <motion.nav
            initial={{ x: isMobile ? -280 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg z-30 flex flex-col ${
              isMobile ? '' : 'lg:relative'
            }`}
          >
           <div className="flex items-center justify-between h-16 px-6 bg-blue-50 dark:bg-gray-700">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Tour App</h1>
              {isMobile && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleSidebar}
                  className="focus:outline-none text-gray-800 dark:text-gray-200"
                >
                  <FaTimes className="w-6 h-6" />
                </motion.button>
              )}
            </div>
            <div className="flex-grow overflow-y-auto">
              <ul className="py-4">
                {sidebarItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={toggleSidebar}>
                      <motion.div
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center px-6 py-3 cursor-pointer transition-colors duration-200 ${
                          pathname === item.href ? 'border-r-4 border-blue-500 dark:border-blue-400' : ''
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
                        <span>{item.label}</span>
                      </motion.div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center justify-center w-full px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
              >
                <FaSignOutAlt className="w-5 h-5 mr-2" />
                Logout
              </motion.button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 border-b-2 dark:border-zinc-600 border-zinc-200 shadow-sm h-16 flex items-center lg:pl-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none lg:hidden ml-4"
          >
            <FaBars className="w-6 h-6" />
          </motion.button>
          <div className="flex w-full px-6 justify-between">
            <nav className="ml-4 flex items-center">
              {breadcrumbs.map((crumb, index) => (
                <motion.div
                  key={crumb.path}
                  className="flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {index > 0 && <FaChevronRight className="mx-2 text-blue-500 dark:text-blue-400" />}
                  <Link href={crumb.path}>
                    <span className={`text-sm font-medium ${index === breadcrumbs.length - 1 ? 'text-gray-800 dark:text-gray-200' : 'text-blue-500 dark:text-blue-400 hover:text-gray-800 dark:hover:text-gray-200'} transition-colors duration-200`}>
                      {crumb.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 shadow-lg "
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
