"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import Link from "next/link";
import { api } from "@/config/ApiConfig";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoaderSimple from "@/components/loaderSimple";

export default function Signup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [usernameAvailable, setUsernameAvailable] =
    useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [hasCheckedUsername, setHasCheckedUsername] = useState(false);

  const [debouncedUsername] = useDebounce(formData.username, 500);

  useEffect(() => {
    if (debouncedUsername) {
      checkUsername(debouncedUsername);
    } else {
      setUsernameAvailable(null);
      setHasCheckedUsername(false);
    }
  }, [debouncedUsername]);

  useEffect(() => {
    setPasswordsMatch(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  const checkUsername = async (username: string) => {
    setIsCheckingUsername(true);
    setHasCheckedUsername(false);
    try {
      const response = await api.post("/auth/checkUsername", { username });
      console.log(response?.data?.data?.isAvailable);
      setUsernameAvailable(response?.data?.data?.isAvailable);
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
      setHasCheckedUsername(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.replace(" ", ""),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (passwordsMatch && usernameAvailable) {
      try {
        const response = await api.post("/auth/register", formData);
        localStorage.setItem("token", response?.data?.data?.token);
        toast.success("Account created successfully!");
        router.push("/home/trips");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Error signing up:", error);
        toast.error(error?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CCF5FE] to-[#319CB5] dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-xl"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-center text-[#03181F] dark:text-white mb-8"
        >
          Create Your Account
        </motion.h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-[#040D0F] dark:text-gray-300 mb-1"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-[#319CB5] dark:text-gray-500" />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-4 py-2 bg-[#CCF5FE] dark:bg-gray-700 border border-[#319CB5] dark:border-gray-600 rounded-lg text-[#03181F] dark:text-gray-200 text-sm
                        focus:outline-none focus:ring-2 focus:ring-[#319CB5] dark:focus:ring-gray-500 focus:border-transparent transition duration-300 ease-in-out"
                      placeholder="John"
                      required
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-[#040D0F] dark:text-gray-300 mb-1"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-[#319CB5] dark:text-gray-500" />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-4 py-2 bg-[#CCF5FE] dark:bg-gray-700 border border-[#319CB5] dark:border-gray-600 rounded-lg text-[#03181F] dark:text-gray-200 text-sm
                        focus:outline-none focus:ring-2 focus:ring-[#319CB5] dark:focus:ring-gray-500 focus:border-transparent transition duration-300 ease-in-out"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-[#040D0F] dark:text-gray-300 mb-1"
                >
                  Username
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-[#319CB5] dark:text-gray-500" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-12 py-2 bg-[#CCF5FE] dark:bg-gray-700 border rounded-lg text-[#03181F] dark:text-gray-200 text-sm
                      focus:outline-none focus:ring-2 focus:ring-[#319CB5] dark:focus:ring-gray-500 focus:border-transparent transition duration-300 ease-in-out... ${
                        hasCheckedUsername && usernameAvailable === false
                          ? "border-red-500"
                          : ""
                      }
                      ${
                        hasCheckedUsername && usernameAvailable === true
                          ? "border-green-500"
                          : "border-[#319CB5] dark:border-gray-600"
                      }`}
                    placeholder="johndoe123"
                    required
                  />
                  <div className="absolute right-3 top-2">
                    {isCheckingUsername && (
                      <svg
                        className="animate-spin h-5 w-5 text-[#319CB5] dark:text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {!isCheckingUsername &&
                      hasCheckedUsername &&
                      usernameAvailable === true && (
                        <svg
                          className="h-5 w-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      )}
                    {!isCheckingUsername &&
                      hasCheckedUsername &&
                      usernameAvailable === false && (
                        <svg
                          className="h-5 w-5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      )}
                  </div>
                </div>
                {!isCheckingUsername &&
                  hasCheckedUsername &&
                  usernameAvailable === false && (
                    <p className="text-red-500 text-xs mt-1">
                      Username is not available
                    </p>
                  )}
                {!isCheckingUsername &&
                  hasCheckedUsername &&
                  usernameAvailable === true && (
                    <p className="text-green-500 text-xs mt-1">
                      Username is available
                    </p>
                  )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#040D0F] dark:text-gray-300 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-[#319CB5] dark:text-gray-500" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-4 py-2 bg-[#CCF5FE] dark:bg-gray-700 border border-[#319CB5] dark:border-gray-600 rounded-lg text-[#03181F] dark:text-gray-200 text-sm
                      focus:outline-none focus:ring-2 focus:ring-[#319CB5] dark:focus:ring-gray-500 focus:border-transparent transition duration-300 ease-in-out"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-4"
            >... <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#040D0F] dark:text-gray-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-[#319CB5] dark:text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-10 py-2 bg-[#CCF5FE] dark:bg-gray-700 border border-[#319CB5] dark:border-gray-600 rounded-lg text-[#03181F] dark:text-gray-200 text-sm
                      focus:outline-none focus:ring-2 focus:ring-[#319CB5] dark:focus:ring-gray-500 focus:border-transparent transition duration-300 ease-in-out"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-[#319CB5] dark:text-gray-500 hover:text-[#03181F] focus:outline-none transition duration-300 ease-in-out"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[#040D0F] dark:text-gray-300 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-[#319CB5] dark:text-gray-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-10 py-2 bg-[#CCF5FE] dark:bg-gray-700 border rounded-lg text-[#03181F] dark:text-gray-200 text-sm
                      focus:outline-none focus:ring-2 focus:ring-[#319CB5] dark:focus:ring-gray-500 focus:border-transparent transition duration-300 ease-in-out
                      ${!passwordsMatch ? "border-red-500" : "border-[#319CB5] dark:border-gray-600"}`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2 text-[#319CB5] dark:text-gray-500 hover:text-[#03181F] focus:outline-none transition duration-300 ease-in-out"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {!passwordsMatch && (
                  <span className="text-red-500 text-xs mt-1">
                    Passwords do not match
                  </span>
                )}
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-center"
          >
            <button
              type="submit"
              className="w-full md:w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#319CB5] hover:bg-[#03181F] dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#319CB5] dark:focus:ring-gray-500 transition duration-300 ease-in-out"
            >
              {isLoading ? <LoaderSimple /> : "Create account"}
            </button>
          </motion.div>
        </form>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-[#040D0F] dark:text-gray-300">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#319CB5] dark:text-gray-500 hover:text-[#03181F] transition duration-300 ease-in-out"
            >
              Log in here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
