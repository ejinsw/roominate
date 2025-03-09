export interface User {
  id: string;
  groupID?: string | null;
  group?: Group | null;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  year?: number | null;
  preferences?: UserPreferences | null;
  requests: Request[];
  invites: Invite[];
  major: string;
  bio: string;
  interests: string[];
  onBoardingComplete: Boolean;

}

export interface Group {
  id: string;
  users: User[];
  createdAt: Date;
  name: string;
  description?: string | null;
  numRoomates?: number | null;
  openToJoin: boolean;
  requests: Request[];
  invitations: Invite[];
  preferences?: GroupPreferences | null;
}

export interface Request {
  id: string;
  createdAt: Date;
  userID: string;
  user: User;
  groupID: string;
  group: Group;
  status: string;
  message?: string | null;
}

export interface Invite {
  id: string;
  createdAt: Date;
  userID: string;
  user: User;
  groupID: string;
  group: Group;
  status: string;
  message?: string | null;
}

export interface Housing {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  relatedUserPreferences: UserHousingPreferencesRelation[];
  relatedGroupPreferences: GroupHousingPreferencesRelation[];
  name?: string | null;
  isApartment?: boolean | null;
  numBedrooms?: number | null;
  numBathrooms?: number | null;
  parking?: boolean | null;
  numRoommates?: number | null;
  communalBathroom?: boolean | null;
  sharedBathroom?: boolean | null;
  privateBathroom?: boolean | null;
}

export interface Preference {
  id: string;
  relatedUserPreferences: UserPreferencesRelation[];
  relatedGroupPreferences: GroupPreferencesRelation[];
  category: string;
  value: string;
  options: string[];
  importance: string[];
}

export interface UserPreferences {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userID?: string | null;
  user?: User | null;
  preferredHousing: UserHousingPreferencesRelation[];
  preferences: UserPreferencesRelation[];
}

export interface UserPreferencesRelation {
  id: string;
  userPreferencesID: string;
  userPreferences: UserPreferences;
  preferenceID: string;
  preference: Preference;
  option?: string | null;
  importance?: string | null;
}

export interface UserHousingPreferencesRelation {
  id: string;
  housingID: string;
  housing: Housing;
  preferencesID: string;
  preferences: UserPreferences;
}

export interface GroupPreferences {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  groupID?: string | null;
  group?: Group | null;
  preferredHousing: GroupHousingPreferencesRelation[];
  preferences: GroupPreferencesRelation[];
}

export interface GroupPreferencesRelation {
  id: string;
  groupPreferencesID: string;
  groupPreferences: GroupPreferences;
  preferenceID: string;
  preference: Preference;
  option?: string | null;
  importance?: string | null;
}

export interface GroupHousingPreferencesRelation {
  id: string;
  housingID: string;
  housing: Housing;
  preferencesID: string;
  preferences: GroupPreferences;
}
