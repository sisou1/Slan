import axios from "axios";
import type {
  Activity,
  CreateActivityPayload,
  JoinActivityPayload,
  Participant,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

export async function fetchActivities() {
  const response = await api.get<Activity[]>("/activities");
  return response.data;
}

export async function createActivity(payload: CreateActivityPayload) {
  const response = await api.post<Activity>("/activities", payload);
  return response.data;
}

export async function fetchParticipants(activityId: number) {
  const response = await api.get<Participant[]>(`/activities/${activityId}/participants`);
  return response.data;
}

export async function joinActivity(activityId: number, payload: JoinActivityPayload) {
  const response = await api.post<Participant>(`/activities/${activityId}/participants`, payload);
  return response.data;
}

