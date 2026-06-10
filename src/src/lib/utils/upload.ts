// lib/utils/upload.ts
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function uploadFile(
  file: File,
  path: string
): Promise<string> {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef)
}

export async function uploadImageForBook(bookSlug: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const fileName = `cover.${ext}`
  const path = `books/${bookSlug}/${fileName}`
  return uploadFile(file, path)
}

export async function uploadImageForAuthor(authorSlug: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const fileName = `photo.${ext}`
  const path = `authors/${authorSlug}/${fileName}`
  return uploadFile(file, path)
}