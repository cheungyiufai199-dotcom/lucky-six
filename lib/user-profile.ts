import { ref, get, set, remove, child } from "firebase/database";
import { db } from "./firebase";
export interface UserProfile { uid: string; email: string; fullName?: string; birthYear: number; birthMonth: number; birthDay: number; birthHour: number; birthMinute: number; birthLatitude: number; birthLongitude: number; isAdmin: boolean; updatedAt: number; }
const COLLECTION = "profiles";
export async function getUserProfile(uid: string): Promise<UserProfile | null> { const snapshot = await get(child(ref(db), COLLECTION + "/" + uid)); return snapshot.exists() ? (snapshot.val() as UserProfile) : null; }
export async function saveUserProfile(profile: UserProfile): Promise<void> { await set(ref(db, COLLECTION + "/" + profile.uid), { ...profile, updatedAt: Date.now() }); }
export async function deleteUserProfile(uid: string): Promise<void> { await remove(ref(db, COLLECTION + "/" + uid)); }
export async function getAllProfiles(): Promise<UserProfile[]> { const snapshot = await get(ref(db, COLLECTION)); if (!snapshot.exists()) return []; return Object.values(snapshot.val()) as UserProfile[]; }
