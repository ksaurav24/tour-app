export interface UserProfile {
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
     
    reviews: Array<{ tripName: string; rating: number; comment: string }>;
  }

  