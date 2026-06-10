// lib/sponsors.ts
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type Sponsor = {
  id: string;
  name: string;
  logoUrl: string;
  email: string;
  website?: string;
  createdAt: Timestamp;
};

export type SponsorInput = Omit<Sponsor, 'id' | 'createdAt'>;

const COLLECTION = 'sponsors';

export async function getSponsors(): Promise<Sponsor[]> {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Sponsor));
}

export async function addSponsor(data: SponsorInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function updateSponsor(id: string, data: Partial<SponsorInput>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteSponsor(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}