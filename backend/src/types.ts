export type Activity = {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  participants_count: number;
};

export type ActivityDetails = {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
};

export type Participant = {
  id: number;
  activity_id: number;
  nickname: string;
  joined_at: Date;
};

export type CreateActivityInput = {
  name: string;
  description?: string | null;
};

export type UpdateActivityInput = {
  name: string;
  description?: string | null;
};

