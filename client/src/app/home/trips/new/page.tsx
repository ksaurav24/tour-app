"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { toast } from "react-toastify";
import { api } from "@/config/ApiConfig";
import Link from "next/link";
import { TripData } from "@/types/TripsTypes";

export default function NewTripPage() {
  const [trip, setTrip] = useState<TripData>({
    slug:'',
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    destination: "",
    startingPoint: "",
    budget: "",
    interest: "",
    isPrivate: false,
    isGroupTrip: true,
    groupSize: 4,
    whatsappLink: "",
    telegramLink: "",
    isForced: false,
    discordLink: "",
  });
  const [popUp, setPopUp] = useState({
    tripFromSameUserExist: false,
    tripFromDifferentUserExits: false,
    tripsData: 
    {} as TripData,
  });

  const controls = useAnimation();

  useEffect(() => {
    if (trip.isGroupTrip) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [trip.isGroupTrip, controls]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.name === "groupSize") {
      if (parseInt(e.target.value) > 60) {
        toast.warn("Group size cannot exceed 60");
        return;
      }
    }
    const { name, value } = e.target;
    setTrip({ ...trip, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (trip.isGroupTrip && trip.groupSize < 2) {
      toast.warn("Group size must be at least 2");
      return;
    }
    if (trip.startDate > trip.endDate) {
      toast.warn("End date must be after start date");
      return;
    }
    e.preventDefault();
    api
      .post("/trip/create", trip,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        if (err?.response?.data?.data?.tripFromSameUserExist) {
          setPopUp({
            tripFromSameUserExist: true,
            tripFromDifferentUserExits: false,
            tripsData: err?.response?.data?.data?.trip,
          });
        } else if (err?.response?.data?.data?.tripFromDifferentUserExits) {
          setPopUp({
            tripFromSameUserExist: false,
            tripFromDifferentUserExits: true,
            tripsData: err?.response?.data?.data?.trip,
          });
        }
      });
  };
  const handleForceSubmit = () => {
    setTrip({ ...trip, isForced: true });
    api
      .post("/trip/create", { ...trip, isForced: true },{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
      }).finally(() => {
        setPopUp({
            tripFromSameUserExist: false,
    tripFromDifferentUserExits: false,
    tripsData: {} as TripData,
        })
      });
  };
  return (
    <motion.div
      className="w-full text-zinc-950 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-r from-[#03181F] to-[#319CB5] text-white">
        <motion.h1
          className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Plan Your New Adventure
        </motion.h1>
        <motion.p
          className="text-sm md:text-base text-[#CCF5FE]"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Fill in the details below to create your dream trip!
        </motion.p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 lg:space-y-8"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-[#03181F] dark:text-gray-200 mb-1 md:mb-2"
          >
            Trip Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={trip.title}
            onChange={handleChange}
            className="w-full px-3 py-2 focus:outline-none rounded-md border-2 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 text-[#03181F] dark:text-gray-200 focus:border-[#319CB5] focus:ring focus:ring-[#319CB5] focus:ring-opacity-50 transition-all duration-300 ease-in-out"
            required
            placeholder="Enter trip title"
          />
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div>
            <label
              htmlFor="startingPoint"
              className="block text-sm font-medium text-[#03181F] dark:text-gray-200 mb-1 md:mb-2"
            >
              Starting Point
            </label>
            <input
              type="text"
              id="startingPoint"
              name="startingPoint"
              value={trip.startingPoint}
              onChange={handleChange}
              className="w-full px-3 py-2 focus:outline-none rounded-md border-2 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 text-[#03181F] dark:text-gray-200 focus:border-[#319CB5] focus:ring focus:ring-[#319CB5] focus:ring-opacity-50 transition-all duration-300 ease-in-out"
              required
              placeholder="Where are you starting from?"
            />
          </div>
          <div>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-[#03181F] dark:text-gray-200 mb-1 md:mb-2"
            >
              Destination
            </label>
            <div className="relative">
              <input
                type="text"
                id="destination"
                name="destination"
                value={trip.destination}
                onChange={handleChange}
                className="w-full px-3 py-2 focus:outline-none rounded-md border-2 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 text-[#03181F] dark:text-gray-200 focus:border-[#319CB5] focus:ring focus:ring-[#319CB5] focus:ring-opacity-50 transition-all duration-300 ease-in-out"
                required
                placeholder="Where are you going?"
              />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[#03181F] dark:text-gray-200 mb-1 md:mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={trip.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 focus:outline-none rounded-md border-2 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 text-[#03181F] dark:text-gray-200 focus:border-[#319CB5] focus:ring focus:ring-[#319CB5] focus:ring-opacity-50 transition-all duration-300 ease-in-out"
            required
            placeholder="Describe your trip"
          ></textarea>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-[#03181F] dark:text-gray-200 mb-1 md:mb-2"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={trip.startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
              className="w-full px-3 py-2 focus:outline-none rounded-md border-2 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 text-[#03181F] dark:text-gray-200 focus:border-[#319CB5] focus:ring focus:ring-[#319CB5] focus:ring-opacity-50 transition-all duration-300 ease-in-out"
              required
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-[#03181F] dark:text-gray-200 mb-1 md:mb-2"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              min={trip.startDate}
              value={trip.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 focus:outline-none rounded-md border-2 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 text-[#03181F] dark:text-gray-200 focus:border-[#319CB5] focus:ring focus:ring-[#319CB5] focus:ring-opacity-50 transition-all duration-300 ease-in-out"
              required
            />
          </div>
        </motion.div>
        <motion.div>
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-[#03181F] dark:text-gray-200 mb-1 md:mb-2"
          >
            Budget
          </label>
          <input
            type="text"
            id="budget"
            name="budget"
            value={trip.budget}
            onChange={handleChange}
            className="w-full px-3 py-2 focus:outline-none rounded-md border-2 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 text-[#03181F] dark:text-gray-200 focus:border-[#319CB5] focus:ring focus:ring-[#319CB5] focus:ring-opacity-50 transition-all duration-300 ease-in-out"
            required
            placeholder="Enter your budget"
          />
        </motion.div>
        <AnimatePresence>
          {trip.isGroupTrip && (
            <motion.div
              className="block text-sm ml-5 w-full font-medium text-[#03181F] dark:text-gray-200 mb-1 md:mb-2"
              animate={controls}
              variants={{
                visible: {
                  opacity: 1,
                  height: "auto",
                  transition: { staggerChildren: 0.1 },
                },
                hidden: { opacity: 0, height: 0 },
              }}
              key="groupSize"
              initial={{ opacity: 0, x: -20 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <label
                htmlFor="groupSize"
                className="block text-sm font-medium text-[#03181F] dark:text-gray-200 mb-1 md:mb-2"
              >
                Group Size
              </label>
              <input
                min={0}
                max={60}
                type="number"
                id="groupSize"
                name="groupSize"
                value={trip.groupSize}
                onChange={handleChange}
                className="w-full px-3 py-2 focus:outline-none rounded-md border-2 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 text-[#03181F] dark:text-gray-200 focus:border-[#319CB5] focus:ring focus:ring-[#319CB5] focus:ring-opacity-50 transition-all duration-300 ease-in-out"
                required
                placeholder="Enter group size"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="flex items-center space-x-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <CheckboxWithAnimation
            name="isPrivate"
            label="Private Trip"
            checked={trip.isPrivate}
            onChange={(e) => setTrip({ ...trip, isPrivate: e.target.checked })}
          />
          <CheckboxWithAnimation
            name="isGroupTrip"
            label="Group Trip"
            checked={trip.isGroupTrip}
            onChange={(e) =>
              setTrip({ ...trip, isGroupTrip: e.target.checked })
            }
          />
        </motion.div>
        <motion.button
          type="submit"
          className="w-full bg-[#319CB5] text-white py-3 px-6 rounded-md hover:bg-[#03181F] transition duration-300 text-lg font-semibold"
          whileHover={{ scale: 1.02, backgroundColor: "#03181F" }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Next
        </motion.button>
      </form>
      <AnimatePresence>
        {(popUp.tripFromDifferentUserExits || popUp.tripFromSameUserExist) && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden p-6 max-w-md w-full"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {popUp.tripFromDifferentUserExits && (
                <>
                  <h2 className="text-lg font-semibold text-[#03181F] dark:text-gray-200 mb-4">
                    Trip Already Exists
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    A similar trip already exists. Do you want to view it or
                    create your own?
                  </p>
                  <div className="flex justify-end space-x-4">
                    <Link href={`/home/trips/${popUp.tripsData.slug}`}>
                      <motion.button
                        className="bg-[#03181F] text-[#CCF5FE] py-2 px-4 rounded-md hover:bg-[#319CB5] transition duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Trip
                      </motion.button>
                    </Link>
                    <motion.button
                      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                      onClick={handleForceSubmit}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Create My Own
                    </motion.button>
                  </div>
                </>
              )}
              {popUp.tripFromSameUserExist && (
                <>
                  {" "}
                  {/* Display this if trip from same user exists */}
                  <h2 className="text-lg font-semibold text-[#03181F] dark:text-gray-200 mb-4">
                    You Already Have a Similar Trip
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    You have already created a similar trip. Do you want to
                    view it?
                  </p>
                  <div className="flex justify-end space-x-4">
                    <Link href={`/home/profile/my-trips/${popUp.tripsData.slug}`}>
                      <motion.button
                        className="bg-[#03181F] text-[#CCF5FE] py-2 px-4 rounded-md hover:bg-[#319CB5] transition duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Trip
                      </motion.button>
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface CheckboxWithAnimationProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxWithAnimation = ({
  name,
  label,
  checked,
  onChange,
}: CheckboxWithAnimationProps) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <motion.div
          className={`w-6 h-6 border-2 rounded-md ${
            checked ? "bg-[#319CB5] border-[#319CB5]" : "border-[#03181F] dark:border-gray-500"
          }`}
          initial={false}
          animate={{
            backgroundColor: checked ? "#319CB5" : "#ffffff",
            borderColor: checked ? "#319CB5" : "#ffffff",
          }}
          transition={{ duration: 0.2 }}
        >
          {checked && (
            <motion.svg
              className="w-5 h-5 text-white absolute"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </motion.svg>
          )}
        </motion.div>
      </div>
      <span className="text-sm text-[#03181F] dark:text-gray-200 group-hover:text-[#319CB5] transition-colors duration-200">
        {label}
      </span>
    </label>
  );
};
