export interface TripData {
  createrId?: string;
  participants?: string[];
  joinRequests?: string[];
  createdAt?: string;
  slug:string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  destination: string;
  startingPoint: string;
  budget: string;
  interest: string;
  isPrivate: boolean;
  isGroupTrip: boolean;
  isForced: boolean;
  groupSize: number;
  whatsappLink: string;
  telegramLink: string;
  discordLink: string;
  _id?: string;
}

