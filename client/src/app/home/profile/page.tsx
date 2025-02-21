"use client";

import { useState, useEffect, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaEdit, FaSave, FaTimes, FaRoute } from 'react-icons/fa'; // Import FaRoute for the trip icon
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import the Link component
import Loader from '@/components/loader';
import { UserProfile } from '@/types/ProfileTypes';
import useUserStore from '@/stores/userStore'; // Import the user store
import { api } from '@/config/ApiConfig';

interface EditedData {
  bio: string;
  travelStyle: string;
  interests: string[];
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedIn: string;
  };
}

interface InterestInputProps {
  interests: string[];
  setInterests: React.Dispatch<SetStateAction<string[]>>;
}

const InterestInput: React.FC<InterestInputProps> = ({ interests, setInterests }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: { target: { value: string }; }) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: { key: string; preventDefault: () => void; }) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addInterest();
    }
  };

  const addInterest = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !interests.includes(trimmedValue)) {
      setInterests([...interests, trimmedValue]);
      setInputValue('');
    }
  };

  const removeInterest = (index: number) => {
    const updatedInterests = interests.filter((_: string, i: number) => i !== index);
    setInterests(updatedInterests);
  };

  useEffect(() => {
    const lastChar = inputValue.slice(-1);
    if (lastChar === ',') {
      addInterest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <div className="interest-input-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Add interests (separate by comma or press Enter)"
        className="w-full p-3 rounded-lg border border-[#319CB5] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#319CB5] dark:focus:ring-blue-500 text-[#03181F] dark:text-gray-200 bg-transparent dark:bg-gray-700"
      />
      <div className="interest-tags mt-2 flex flex-wrap">
        {interests.map((interest: string, index: number) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="interest-tag bg-[#CCF5FE] dark:bg-gray-600 text-[#03181F] dark:text-gray-200 px-3 py-1 rounded-full m-1 flex items-center"
          >
            {interest}
            <button
              onClick={() => removeInterest(index)}
              className="ml-2 text-[#03181F] dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
            >
              &times;
            </button>
          </motion.span>
        ))}
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  const router = useRouter();
  const { user, setUser, fetchProfile } = useUserStore(); // Access user state and setUser function from the store
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<EditedData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showFullBio, setShowFullBio] = useState(false);
  const [originalData, setOriginalData] = useState<EditedData | null>(null);
  const [hasFetched, setHasFetched] = useState(false);  // NEW STATE

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    if (user) {
      setIsLoading(false);
      setHasFetched(true);
      return;
    }
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        await fetchProfile(); // Fetch profile using the store function
        setHasFetched(true); // Set to true after fetching
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!hasFetched) {
      loadProfile();
    }

  }, [router, fetchProfile, hasFetched]);

  useEffect(() => {
    if (user && hasFetched) {
      const initialEditedData = {
        bio: user.bio || '',
        travelStyle: user.travelStyle || '',
        interests: user.interests || [],
        socialMedia: user.socialMedia || {
          facebook: '',
          instagram: '',
          twitter: '',
          linkedIn: ''
        },
      };
      setEditedData(initialEditedData);
      setOriginalData(initialEditedData);
    }
  }, [user, hasFetched]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData(originalData);
    setIsEditing(false);
  };

  const handleSave = () => {
    // const token = localStorage.getItem('token'); // No need to get token again, you can access data from the store directly.
    if (editedData) {
      setIsLoading(true);
      // No need to get token again, you can access data from the store directly.
      api.put<{ data: UserProfile }>('/user/profile', editedData, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        .then(res => {
          const updatedProfile = res?.data?.data;
          setUser(updatedProfile); // Update user store with updated data
          setOriginalData({ ...editedData });
          setIsEditing(false);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => prev ? ({
      ...prev,
      [name]: value
    }) : null);
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setEditedData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [platform]: value
        }
      };
    });
  };

  const toggleBio = () => {
    setShowFullBio(!showFullBio);
  };

  if (isLoading) {
    return (
      <Loader />
    );
  }

  if (!user) {
    return <div className="text-center text-2xl text-[#03181F] dark:text-gray-200">No profile data available.</div>;
  }

  const bioDisplay = user?.bio?.length > 150 && !showFullBio
    ? user.bio.substring(0, 150) + '...'
    : user.bio;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-[#03181F] dark:text-gray-200">My Profile</h1>
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-[#CCF5FE] dark:bg-gray-700 text-[#03181F] dark:text-gray-200 rounded-lg hover:bg-[#319CB5] dark:hover:bg-gray-600 hover:text-[#040D0F] transition-colors duration-300"
            >
              <FaEdit className="mr-2" /> Edit Profile
            </motion.button>
          ) : (
            <motion.div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-red-500 text-[#CCF5FE] rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                <FaTimes className="mr-2" /> Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-[#CCF5FE] dark:bg-gray-700 text-[#03181F] dark:text-gray-200 rounded-lg hover:bg-[#319CB5] dark:hover:bg-gray-600 hover:text-[#040D0F] transition-colors duration-300"
              >
                <FaSave className="mr-2" /> Save Changes
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image and Basic Info */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-[#CCF5FE] dark:bg-gray-800 p-6 rounded-2xl shadow-md border-2 border-[#319CB5] dark:border-gray-700">
              <Image
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.firstName} ${user?.lastName}&backgroundColor=white`}
                alt="Profile"
                width={200}
                height={200}
                className="w-full max-w-[200px] mx-auto rounded-full mb-4 border-4 border-[#319CB5] dark:border-gray-600"
              />
              <h2 className="text-2xl font-semibold text-center text-[#03181F] dark:text-gray-200">{`${user?.firstName} ${user?.lastName}`}</h2>
              <p className="text-[#319CB5] dark:text-blue-400 text-center font-medium">@{user?.username}</p>
            </div>
          </motion.div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Me */}
            <motion.div className="bg-[#CCF5FE] dark:bg-gray-800 p-6 rounded-2xl shadow-md border-2 border-[#319CB5] dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-[#03181F] dark:text-gray-200">About Me</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editedData?.bio || ""}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-[#319CB5] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#319CB5] dark:focus:ring-blue-500 text-[#03181F] dark:text-gray-200 bg-transparent dark:bg-gray-700"
                  rows={4}
                />
              ) : (
                <div>
                  <p className="text-[#03181F] dark:text-gray-200">{bioDisplay}</p>
                  {user?.bio?.length > 150 && (
                    <button onClick={toggleBio} className="text-[#319CB5] dark:text-blue-400 hover:text-[#03181F] dark:hover:text-gray-300 focus:outline-none">
                      {showFullBio ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
              )}
            </motion.div>

            {/* Travel Style */}
            <motion.div className="bg-[#CCF5FE] dark:bg-gray-800 p-6 rounded-2xl shadow-md border-2 border-[#319CB5] dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-[#03181F] dark:text-gray-200">Travel Style</h3>
              {isEditing ? (
                <textarea
                  name="travelStyle"
                  value={editedData?.travelStyle || ""}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-[#319CB5] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#319CB5] dark:focus:ring-blue-500 text-[#03181F] dark:text-gray-200 bg-transparent dark:bg-gray-700"
                  rows={4}
                />
              ) : (
                <p className="text-[#03181F] dark:text-gray-200">{user?.travelStyle}</p>
              )}
            </motion.div>

            {/* Interests */}
            <motion.div className="bg-[#CCF5FE] dark:bg-gray-800 p-6 rounded-2xl shadow-md border-2 border-[#319CB5] dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-[#03181F] dark:text-gray-200">Interests</h3>
              {isEditing ? (
                <InterestInput
                  interests={editedData?.interests || []}
                  setInterests={(newInterests) =>
                    setEditedData((prev) => prev ? ({ ...prev, interests: Array.isArray(newInterests) ? [...newInterests] : [] }) : null)
                  }
                />
              ) : (
                <p className="text-[#03181F] dark:text-gray-200">
                  {user?.interests?.length > 0 ? user.interests.join(', ') : 'No interests added yet'}
                </p>
              )}
            </motion.div>

            {/* Social Media Links */}
            <motion.div className="bg-[#CCF5FE] dark:bg-gray-800 p-6 rounded-2xl shadow-md border-2 border-[#319CB5] dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-[#03181F] dark:text-gray-200">Social Media</h3>
              <div className="flex flex-wrap justify-center sm:justify-start space-x-4 mb-4">
                {(user?.socialMedia) &&
                  Object.entries(user.socialMedia).map(([platform, link]) => (
                    <motion.a
                      key={platform}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-2xl ${link ? 'text-[#319CB5] dark:text-blue-400 hover:text-[#03181F] dark:hover:text-gray-300' : 'text-gray-400 dark:text-gray-500'} transition-colors duration-300`}
                      whileHover={{ scale: 1.2 }}
                    >
                      {platform === 'facebook' && <FaFacebook />}
                      {platform === 'instagram' && <FaInstagram />}
                      {platform === 'twitter' && <FaTwitter />}
                      {platform === 'linkedIn' && <FaLinkedin />}
                    </motion.a>
                  ))
                }
              </div>
              {isEditing && (
                <div className="space-y-3">
                  {Object.entries(editedData?.socialMedia || {}).map(([platform, link]) => (
                    <div key={platform} className="flex flex-col sm:flex-row items-start sm:items-center">
                      <label className="w-full sm:w-24 mb-1 sm:mb-0 capitalize text-[#03181F] dark:text-gray-200">{platform}:</label>
                      <input
                        type="text"
                        name={platform}
                        value={link || ''} // Ensure value is a string
                        onChange={(e) => {
                          handleSocialMediaChange(platform, e.target.value);
                        }}
                        className="w-full p-3 rounded-lg border border-[#319CB5] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#319CB5] dark:focus:ring-blue-500 text-[#03181F] dark:text-gray-200 bg-transparent dark:bg-gray-700"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* My Trips Section */}
            <motion.div className="bg-[#CCF5FE] dark:bg-gray-800 p-6 rounded-2xl shadow-md border-2 border-[#319CB5] dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-[#03181F] dark:text-gray-200">My Trips</h3>
              <div className="flex items-center justify-between">
                <p className="text-[#03181F] dark:text-gray-200">Explore your planned and past adventures.</p>
                <Link href="/home/profile/my-trips" className="flex items-center text-[#319CB5] dark:text-blue-400 hover:text-[#03181F] dark:hover:text-gray-300 transition-colors duration-300">
                  <FaRoute className="mr-2" />
                  View Trips
                </Link>
              </div>
            </motion.div>

            {/* My Reviews Section */}
            <motion.div className="bg-[#CCF5FE] dark:bg-gray-800 p-6 rounded-2xl shadow-md border-2 border-[#319CB5] dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-[#03181F] dark:text-gray-200">My Reviews</h3>
              {user?.reviews?.length > 0 ? (
                <div className="space-y-4">
                  {user.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h4 className="text-lg font-medium text-[#03181F] dark:text-gray-200">{review.tripName}</h4>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-[#03181F] dark:text-gray-200">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No reviews yet</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
