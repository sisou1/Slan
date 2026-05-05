export type Activity = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  participants_count: number;
};

export type Participant = {
  id: number;
  activity_id: number;
  nickname: string;
  joined_at: string;
};

export type CreateActivityPayload = {
  name: string;
  description: string | null;
};

export type JoinActivityPayload = {
  nickname: string;
};

