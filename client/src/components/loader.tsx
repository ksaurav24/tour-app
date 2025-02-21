import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen ">
      <motion.div
        className="relative w-40 h-40"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-[#CCF5FE] opacity-20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-[#319CB5] opacity-40"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, delay: 0.2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-4 border-[#CCF5FE] opacity-60"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, delay: 0.4, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-[#319CB5]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
