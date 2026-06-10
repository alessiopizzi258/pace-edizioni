// lib/actions/admin.actions.ts
import { db } from '@/lib/firebase'
import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, 
  query, orderBy, Timestamp 
} from 'firebase/firestore'

// Types
export type Author = {
  id?: string
  name: string
  slug: string
  bio?: string
  photoUrl?: string
}

export type Book = {
  id?: string
  title: string
  slug: string
  coverUrl?: string
  price?: string
  description?: string
  authorId?: string
  createdAt: Timestamp
}

export type Event = {
  id?: string
  title: string
  date: Timestamp
  location?: string
  description?: string
  coverUrl?: string
}

export type Thread = {
  id?: string
  title: string
  slug: string
  content: string
  authorName: string
  createdAt: Timestamp
}

// ---------- Authors ----------
export async function getAuthors(): Promise<Author[]> {
  const q = query(collection(db, 'authors'), orderBy('name'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Author))
}

export async function getAuthor(id: string): Promise<Author | null> {
  const ref = doc(db, 'authors', id)
  const snap = await getDoc(ref)
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Author) : null
}

export async function createAuthor(data: Omit<Author, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'authors'), data)
  return ref.id
}

export async function updateAuthor(id: string, data: Partial<Author>): Promise<void> {
  await updateDoc(doc(db, 'authors', id), data)
}

export async function deleteAuthor(id: string): Promise<void> {
  await deleteDoc(doc(db, 'authors', id))
}

// ---------- Books ----------
export async function getBooks(): Promise<Book[]> {
  const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book))
}

export async function getBook(id: string): Promise<Book | null> {
  const ref = doc(db, 'books', id)
  const snap = await getDoc(ref)
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Book) : null
}

export async function createBook(data: Omit<Book, 'id' | 'createdAt'>): Promise<string> {
  const full: Book = { ...data, createdAt: Timestamp.now() }
  const ref = await addDoc(collection(db, 'books'), full)
  return ref.id
}

export async function updateBook(id: string, data: Partial<Book>): Promise<void> {
  await updateDoc(doc(db, 'books', id), data)
}

export async function deleteBook(id: string): Promise<void> {
  await deleteDoc(doc(db, 'books', id))
}

// ---------- Events ----------
export async function getEvents(): Promise<Event[]> {
  const q = query(collection(db, 'events'), orderBy('date', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event))
}

export async function createEvent(data: Omit<Event, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'events'), data)
  return ref.id
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<void> {
  await updateDoc(doc(db, 'events', id), data)
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, 'events', id))
}

// ---------- Threads ----------
export async function getThreads(): Promise<Thread[]> {
  const q = query(collection(db, 'threads'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Thread))
}

export async function createThread(data: Omit<Thread, 'id' | 'createdAt'>): Promise<string> {
  const full: Thread = { ...data, createdAt: Timestamp.now() }
  const ref = await addDoc(collection(db, 'threads'), full)
  return ref.id
}

export async function updateThread(id: string, data: Partial<Thread>): Promise<void> {
  await updateDoc(doc(db, 'threads', id), data)
}

export async function deleteThread(id: string): Promise<void> {
  await deleteDoc(doc(db, 'threads', id))
}