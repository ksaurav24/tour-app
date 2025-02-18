"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { api } from "@/config/ApiConfig";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .post("/auth/login", { email, password })
      .then((res) => {
        localStorage.setItem("token", res?.data?.data?.token);
        localStorage.setItem("user", JSON.stringify(res?.data?.data?.user));
        window.location.href = "/home/trips";
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.message || "An error occurred");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CCF5FE] to-[#319CB5] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-center text-[#03181F] mb-8"
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
              className="block text-sm font-medium text-[#040D0F] mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 bg-[#CCF5FE] border border-[#319CB5] rounded-lg text-[#03181F] text-sm
                focus:outline-none focus:ring-2 focus:ring-[#319CB5] focus:border-transparent transition duration-300 ease-in-out"
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
              className="block text-sm font-medium text-[#040D0F] mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 bg-[#CCF5FE] border border-[#319CB5] rounded-lg text-[#03181F] text-sm
                focus:outline-none focus:ring-2 focus:ring-[#319CB5] focus:border-transparent transition duration-300 ease-in-out"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-[#319CB5] hover:text-[#03181F] focus:outline-none transition duration-300 ease-in-out"
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
                className="font-medium text-[#319CB5] hover:text-[#03181F] transition duration-300 ease-in-out"
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
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#319CB5] hover:bg-[#03181F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#319CB5] transition duration-300 ease-in-out"
            >
              Sign in
            </button>
          </motion.div>
        </form>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-[#040D0F]">
            Don&apos;t have an account?{" "}
            <Link
              href={"../signup"}
              className="font-medium text-[#319CB5] hover:text-[#03181F] transition duration-300 ease-in-out"
            >
              Register here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
