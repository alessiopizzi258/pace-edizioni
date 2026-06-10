// lib/forum.ts
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type PostStatus = 'pending' | 'approved' | 'rejected';

export type ForumPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  authorId: string;
  authorName: string;
  status: PostStatus;
  createdAt: Timestamp;
  reviewedAt?: Timestamp;
};

export type ForumPostInput = Pick<ForumPost, 'title' | 'slug' | 'content' | 'authorId' | 'authorName'>;

const COL = 'forum_posts';

// Pubblica — solo approvati
export async function getApprovedPosts(): Promise<ForumPost[]> {
  const q = query(collection(db, COL), where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ForumPost));
}

// Admin — tutti
export async function getAllPosts(): Promise<ForumPost[]> {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ForumPost));
}

// Autore — solo i propri
export async function getMyPosts(authorId: string): Promise<ForumPost[]> {
  const q = query(collection(db, COL), where('authorId', '==', authorId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ForumPost));
}

export async function submitPost(data: ForumPostInput): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    status: 'pending',
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function reviewPost(id: string, status: 'approved' | 'rejected'): Promise<void> {
  await updateDoc(doc(db, COL, id), { status, reviewedAt: Timestamp.now() });
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}