// lib/api.ts
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';

// ==========================================
// 1. DEFINIZIONE DEI TIPI (SCHEMA STRICT)
// ==========================================

export type Book = {
  id: string;
  title: string;
  slug: string;
  authorId: string;
  price: number;
  coverUrl: string;
  description: string;
  amazonUrl?: string;
  collana?: string;
  createdAt?: number;
};

export type Author = {
  id: string;
  name: string;
  slug: string;
  role?: string;
  bio: string;
  photoUrl?: string;
};

export type Event = {
  id: string;
  title: string;
  slug: string;
  location: string;
  description: string;
  date: string; 
  coverUrl?: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverUrl?: string;
  authorId: string;
  relatedBookId?: string;
  status: 'pending' | 'published';
  createdAt: number;
};

export type ForumThread = {
  id: string;
  title: string;
  slug: string;
  content: string;
  authorName: string;
  status: 'pending' | 'published';
  createdAt: number;
};

export type Collana = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

// ==========================================
// 2. PUBLIC API (SERVER-SIDE REAL-TIME FETCHING)
// ==========================================
// Nessuna cache. I Server Components estraggono i dati freschi ad ogni richiesta.

// --- LISTE COMPLETE ---

export const getBooks = async (): Promise<Book[]> => {
  const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Book));
};

export const getAuthors = async (): Promise<Author[]> => {
  const snapshot = await getDocs(collection(db, 'authors'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Author));
};

export const getEvents = async (): Promise<Event[]> => {
  const snapshot = await getDocs(collection(db, 'events'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Event));
};

export const getCollane = async (): Promise<Collana[]> => {
  const snapshot = await getDocs(collection(db, 'collane'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Collana));
};

export const getForumThreads = async (): Promise<ForumThread[]> => {
  const q = query(collection(db, 'forumThreads'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ForumThread));
};

export const getPublishedPosts = async (): Promise<Post[]> => {
  const q = query(collection(db, 'posts'), where('status', '==', 'published'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
};

// --- DETTAGLI SINGOLI PER SLUG ---

export const getBookBySlug = async (slug: string): Promise<Book | null> => {
  const q = query(collection(db, 'books'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docRef = snapshot.docs[0];
  return { id: docRef.id, ...docRef.data() } as Book;
};

export const getAuthorBySlug = async (slug: string): Promise<Author | null> => {
  const q = query(collection(db, 'authors'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docRef = snapshot.docs[0];
  return { id: docRef.id, ...docRef.data() } as Author;
};

export const getEventBySlug = async (slug: string): Promise<Event | null> => {
  const q = query(collection(db, 'events'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docRef = snapshot.docs[0];
  return { id: docRef.id, ...docRef.data() } as Event;
};

export const getThreadBySlug = async (slug: string): Promise<ForumThread | null> => {
  const q = query(collection(db, 'forumThreads'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docRef = snapshot.docs[0];
  return { id: docRef.id, ...docRef.data() } as ForumThread;
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const q = query(collection(db, 'posts'), where('slug', '==', slug), where('status', '==', 'published'));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docRef = snapshot.docs[0];
  return { id: docRef.id, ...docRef.data() } as Post;
};


// ==========================================
// 3. ADMIN API (MUTAZIONI CRUD)
// ==========================================

export const getAllPostsAdmin = async (): Promise<Post[]> => {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
};

// --- BOOKS CRUD ---
export const createBook = async (data: Omit<Book, 'id'>) => {
  return await addDoc(collection(db, 'books'), { ...data, createdAt: Date.now() });
};
export const updateBook = async (id: string, data: Partial<Book>) => {
  return await updateDoc(doc(db, 'books', id), data);
};
export const deleteBook = async (id: string) => {
  return await deleteDoc(doc(db, 'books', id));
};

// --- AUTHORS CRUD ---
export const createAuthor = async (data: Omit<Author, 'id'>) => {
  return await addDoc(collection(db, 'authors'), data);
};
export const updateAuthor = async (id: string, data: Partial<Author>) => {
  return await updateDoc(doc(db, 'authors', id), data);
};
export const deleteAuthor = async (id: string) => {
  return await deleteDoc(doc(db, 'authors', id));
};

// --- EVENTS CRUD ---
export const createEvent = async (data: Omit<Event, 'id'>) => {
  return await addDoc(collection(db, 'events'), data);
};
export const updateEvent = async (id: string, data: Partial<Event>) => {
  return await updateDoc(doc(db, 'events', id), data);
};
export const deleteEvent = async (id: string) => {
  return await deleteDoc(doc(db, 'events', id));
};

// --- FORUM CRUD ---
export const createThread = async (data: Omit<ForumThread, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, 'forumThreads'), { ...data, createdAt: Date.now() });
};
export const updateThread = async (id: string, data: Partial<ForumThread>) => {
  return await updateDoc(doc(db, 'forumThreads', id), data);
};
export const deleteThread = async (id: string) => {
  return await deleteDoc(doc(db, 'forumThreads', id));
};

// --- COLLANE CRUD ---
export const createCollana = async (data: Omit<Collana, 'id'>) => {
  return await addDoc(collection(db, 'collane'), data);
};
export const updateCollana = async (id: string, data: Partial<Collana>) => {
  return await updateDoc(doc(db, 'collane', id), data);
};
export const deleteCollana = async (id: string) => {
  return await deleteDoc(doc(db, 'collane', id));
};

// --- POSTS CRUD ---
export const createPost = async (data: Omit<Post, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, 'posts'), { ...data, createdAt: Date.now() });
};
export const updatePost = async (id: string, data: Partial<Post>) => {
  return await updateDoc(doc(db, 'posts', id), data);
};
export const deletePost = async (id: string) => {
  return await deleteDoc(doc(db, 'posts', id));
};