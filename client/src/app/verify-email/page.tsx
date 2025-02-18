"use client"
import { motion } from 'framer-motion';
import { FaEnvelope, FaRedo } from 'react-icons/fa';
import Link from 'next/link';

export default function VerificationEmailSent() {
  const handleResendEmail = () => {
    // Logic to resend verification email
    console.log('Resending verification email');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-600 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <FaEnvelope className="text-indigo-600 text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Verify Your Email</h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-600 mb-6"
        >
          We&apos;ve sent a verification email to your registered email address. Please check your inbox and click on the verification link to complete your registration.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-6"
        >
          <button
            onClick={handleResendEmail}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            <FaRedo className="mr-2" />
            Resend Verification Email
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-sm text-gray-500"
        >
          Didn&apos;t receive the email? Check your spam folder or try resending the verification email.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 text-sm"
        >
          <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Back to Login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
