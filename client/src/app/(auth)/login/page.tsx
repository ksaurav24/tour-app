"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { api } from "@/config/ApiConfig";
import { toast } from "react-toastify";
import LoaderSimple from "@/components/loaderSimple";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    api
      .post("/auth/login", { email, password })
      .then((res) => {
        localStorage.setItem("token", res?.data?.data?.token);
        localStorage.setItem("user", JSON.stringify(res?.data?.data?.user));
        router.push('/home')
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.message || "An error occurred");
      }).finally(()=>{   setIsLoading(false)
        
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CCF5FE] to-[#319CB5] dark:from-gray-900 dark:to-black p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-center text-[#03181F] dark:text-gray-100 mb-8"
        >
          Welcome Back
        </motion.h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#040D0F] dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 bg-[#CCF5FE] dark:bg-gray-700 border border-[#319CB5] dark:border-gray-600 rounded-lg text-[#03181F] dark:text-gray-100 text-sm
                focus:outline-none focus:ring-2 focus:ring-[#319CB5] dark:focus:ring-gray-500 focus:border-transparent transition duration-300 ease-in-out"
              placeholder="you@example.com"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative"
          >
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#040D0F] dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 bg-[#CCF5FE] dark:bg-gray-700 border border-[#319CB5] dark:border-gray-600 rounded-lg text-[#03181F] dark:text-gray-100 text-sm
                focus:outline-none focus:ring-2 focus:ring-[#319CB5] dark:focus:ring-gray-500 focus:border-transparent transition duration-300 ease-in-out"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-[#319CB5] dark:text-gray-400 hover:text-[#03181F] dark:hover:text-gray-200 focus:outline-none transition duration-300 ease-in-out"
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5" />
              ) : (
                <FaEye className="h-5 w-5" />
              )}
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-[#319CB5] dark:text-gray-400 hover:text-[#03181F] dark:hover:text-gray-200 transition duration-300 ease-in-out"
              >
                Forgot password?
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#319CB5] dark:bg-gray-600 hover:bg-[#03181F] dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#319CB5] dark:focus:ring-gray-500 transition duration-300 ease-in-out"
            >
              {isLoading? <LoaderSimple/>:"Sign In"}
            </button>
          </motion.div>
        </form>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-[#040D0F] dark:text-gray-300">
            Don&apos;t have an account?{" "}
            <Link
              href={"../signup"}
              className="font-medium text-[#319CB5] dark:text-gray-400 hover:text-[#03181F] dark:hover:text-gray-200 transition duration-300 ease-in-out"
            >
              Register here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
