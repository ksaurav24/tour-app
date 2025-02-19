"use client";

import { useState, useEffect, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import { api } from '@/config/ApiConfig';
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/loader';

interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  travelStyle: string;
  interests: string[];
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedIn: string;
  };
  upcomingTrips: Array<{ name: string; startDate: string }>;
  pastTrips: Array<{ name: string; endDate: string }>;
  reviews: Array<{ tripName: string; rating: number; comment: string }>;
}

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

  const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
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
        className="w-full p-3 rounded-lg border border-[#319CB5] focus:outline-none focus:ring-2 focus:ring-[#319CB5] text-[#03181F] bg-transparent"
      />
      <div className="interest-tags mt-2 flex flex-wrap">
        {interests.map((interest: string, index: number) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="interest-tag bg-[#CCF5FE] text-[#03181F] px-3 py-1 rounded-full m-1 flex items-center"
          >
            {interest}
            <button
              onClick={() => removeInterest(index)}
              className="ml-2 text-[#03181F] hover:text-red-500 focus:outline-none"
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<EditedData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showFullBio, setShowFullBio] = useState(false);
  const [originalData, setOriginalData] = useState<EditedData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    api.get<{ data: UserProfile }>('/user/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setUserProfile(res.data?.data);
        const initialEditedData = {
          bio: res.data?.data?.bio,
          travelStyle: res.data?.data?.travelStyle,
          interests: res.data?.data?.interests,
          socialMedia: res.data?.data?.socialMedia,
        };
        setEditedData(initialEditedData);
        setOriginalData(initialEditedData);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData(originalData);
    setIsEditing(false);
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    if (editedData) {
      setIsLoading(true);
      api.put<{ data: UserProfile }>('/user/profile', editedData, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setUserProfile(res?.data?.data);
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
      <Loader/>
    );
  }

  if (!userProfile) {
    return <div className="text-center text-2xl text-[#03181F]">No profile data available.</div>;
  }

  const bioDisplay = userProfile?.bio?.length > 150 && !showFullBio
    ? userProfile.bio.substring(0, 150) + '...'
    : userProfile.bio;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-white py-12"
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-[#03181F]">My Profile</h1>
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="flex items-center px-4 py-2 bg-[#CCF5FE]  text-[#03181F] rounded-lg hover:bg-[#319CB5]  hover:text-[#040D0F] transition-colors duration-300"
            >
              <FaEdit className="mr-2" /> Edit Profile
            </motion.button>
          ) : (
            <motion.div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-red-500 text-[#CCF5FE] rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                <FaTimes className="mr-2" /> Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-[#CCF5FE] text-[#03181F] rounded-lg hover:bg-[#319CB5] hover:text-[#040D0F] transition-colors duration-300"
              >
                <FaSave className="mr-2" /> Save Changes
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Profile Image and Basic Info */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-[#CCF5FE] p-6 rounded-2xl shadow-md border-2 border-[#319CB5]">
              <Image
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${userProfile?.firstName} ${userProfile?.lastName}&backgroundColor=white`}
                alt="Profile"
                width={200}
                height={200}
                className="w-full rounded-full mb-4 border-4 border-[#319CB5]"
              />
              <h2 className="text-2xl font-semibold text-center text-[#03181F]">{`${userProfile?.firstName} ${userProfile?.lastName}`}</h2>
              <p className="text-[#319CB5] text-center font-medium">@{userProfile?.username}</p>
            </div>
          </motion.div>

          {/* Profile Details */}
          <div className="md:col-span-2 space-y-6">
            {/* About Me */}
            <motion.div className="bg-[#CCF5FE] p-6 rounded-2xl shadow-md border-2 border-[#319CB5]">
              <h3 className="text-xl font-semibold mb-4 text-[#03181F]">About Me</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editedData?.bio || ""}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-[#319CB5] focus:outline-none focus:ring-2 focus:ring-[#319CB5] text-[#03181F] bg-transparent"
                  rows={4}
                />
              ) : (
                <div>
                  <p className="text-[#03181F]">{bioDisplay}</p>
                  {userProfile?.bio?.length > 150 && (
                    <button onClick={toggleBio} className="text-[#319CB5] hover:text-[#03181F] focus:outline-none">
                      {showFullBio ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
              )}
            </motion.div>

            {/* Travel Style */}
            <motion.div className="bg-[#CCF5FE] p-6 rounded-2xl shadow-md border-2 border-[#319CB5]">
              <h3 className="text-xl font-semibold mb-4 text-[#03181F]">Travel Style</h3>
              {isEditing ? (
                <textarea
                  name="travelStyle"
                  value={editedData?.travelStyle || ""}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-[#319CB5] focus:outline-none focus:ring-2 focus:ring-[#319CB5] text-[#03181F] bg-transparent"
                  rows={4}
                />
              ) : (
                <p className="text-[#03181F]">{userProfile.travelStyle}</p>
              )}
            </motion.div>

            {/* Interests */}
            <motion.div className="bg-[#CCF5FE] p-6 rounded-2xl shadow-md border-2 border-[#319CB5]">
              <h3 className="text-xl font-semibold mb-4 text-[#03181F]">Interests</h3>
              {isEditing ? (
                <InterestInput
                interests={editedData?.interests || []}
                setInterests={(newInterests: SetStateAction<string[]>) =>
                  setEditedData((prev) => prev ? ({ ...prev, interests: typeof newInterests === 'function' ? newInterests(prev.interests) : newInterests }) : null)
                }
              />
              ) : (
                <p className="text-[#03181F]">
                  {userProfile?.interests?.length > 0 ? userProfile.interests.join(', ') : 'No interests added yet'}
                </p>
              )}
            </motion.div>

            {/* Social Media Links */}
            <motion.div className="bg-[#CCF5FE] p-6 rounded-2xl shadow-md border-2 border-[#319CB5]">
              <h3 className="text-xl font-semibold mb-4 text-[#03181F]">Social Media</h3>
              <div className="flex space-x-4 mb-4">
                {Object.entries(userProfile.socialMedia).map(([platform, link]) => (
                  <motion.a
                    key={platform}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-2xl ${link ? 'text-[#319CB5] hover:text-[#03181F]' : 'text-gray-400'} transition-colors duration-300`}
                    whileHover={{ scale: 1.2 }}
                  >
                    {platform === 'facebook' && <FaFacebook />}
                    {platform === 'instagram' && <FaInstagram />}
                    {platform === 'twitter' && <FaTwitter />}
                    {platform === 'linkedIn' && <FaLinkedin />}
                  </motion.a>
                ))}
              </div>
              {isEditing && (
                <div className="space-y-3">
                  {Object.entries(editedData?.socialMedia || {}).map(([platform, link]) => (
                    <div key={platform} className="flex items-center">
                      <label className="w-24 capitalize text-[#03181F]">{platform}:</label>
                      <input
                        type="text"
                        name={platform}
                        value={link}
                        onChange={(e) => {
                          handleSocialMediaChange(platform, e.target.value);
                        }}
                        className="flex-grow p-3 rounded-lg border border-[#319CB5] focus:outline-none focus:ring-2 focus:ring-[#319CB5] text-[#03181F] bg-transparent"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* My Trips Section */}
            <motion.div className="bg-[#CCF5FE] p-6 rounded-2xl shadow-md border-2 border-[#319CB5]">
              <h3 className="text-xl font-semibold mb-4 text-[#03181F]">My Trips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg font-medium mb-2 text-[#03181F]">Upcoming Trips</h4>
                  {userProfile?.upcomingTrips?.length > 0 ? (
                    <ul className="list-disc list-inside text-[#03181F]">
                      {userProfile.upcomingTrips.map((trip, index) => (
                        <li key={index}>{trip.name} - {new Date(trip.startDate).toLocaleDateString()}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No upcoming trips</p>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-2 text-[#03181F]">Past Trips</h4>
                  {userProfile?.pastTrips?.length > 0 ? (
                    <ul className="list-disc list-inside text-[#03181F]">
                      {userProfile.pastTrips.map((trip, index) => (
                        <li key={index}>{trip.name} - {new Date(trip.endDate).toLocaleDateString()}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No past trips</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* My Reviews Section */}
            <motion.div className="bg-[#CCF5FE] p-6 rounded-2xl shadow-md border-2 border-[#319CB5]">
              <h3 className="text-xl font-semibold mb-4 text-[#03181F]">My Reviews</h3>
              {userProfile?.reviews?.length > 0 ? (
                <div className="space-y-4">
                  {userProfile.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <h4 className="text-lg font-medium text-[#03181F]">{review.tripName}</h4>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-[#03181F]">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No reviews yet</p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
