"use client"

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTripStore } from "@/stores/tripStore";
import { TripData, trips } from "@/types/TripsTypes";
import Loader from "@/components/loader";

export default function MyTrips() {
  const { trips, fetchAllTrips } = useTripStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("created");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchAllTrips();
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAllTrips]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const TabButton = ({ label, tabName }: { label: string; tabName: string }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-lg ${
        activeTab === tabName 
          ? "bg-blue-500 text-white dark:bg-blue-600" 
          : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      }`}
      onClick={() => setActiveTab(tabName)}
    >
      {label}
    </motion.button>
  );

  const TripCard = ({ trip }: { trip: TripData }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4"
    >
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{trip.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-2">Destination: {trip.destination}</p>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        Date: {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-2">Budget: ${trip.budget}</p>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{trip.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-blue-500 dark:text-blue-400">{trip?.participants.length}/{trip.groupSize} participants</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700 px-4 py-2 rounded transition duration-300"
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  );

  const renderTrips = () => {
    const currentTrips = trips[activeTab === "created" ? "createdTrips" : activeTab === "joined" ? "joinedTrips" : "joinRequests"];
    return currentTrips.length > 0 ? (
      <AnimatePresence>
        {currentTrips.map((trip) => (
          <TripCard key={trip._id} trip={trip} />
        ))}
      </AnimatePresence>
    ) : (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-600 dark:text-gray-300"
      >
        No trips found in this category.
      </motion.p>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">My Trips</h1>
      <div className="flex space-x-4 mb-8">
        <TabButton label="Created Trips" tabName="created" />
        <TabButton label="Joined Trips" tabName="joined" />
        <TabButton label="Join Requests" tabName="requests" />
      </div>
      {isLoading ? <Loader /> : renderTrips()}
    </div>
  );
}
