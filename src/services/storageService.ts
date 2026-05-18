// src/services/storageService.ts
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  UploadTask,
} from 'firebase/storage';
import { storage } from './firebase';
import { Attachment } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const uploadFile = (
  chatId: string,
  file: File,
  onProgress: (progress: number) => void,
): Promise<Attachment> => {
  return new Promise((resolve, reject) => {
    const ext      = file.name.split('.').pop() ?? '';
    const fileName = `${uuidv4()}.${ext}`;
    const path     = `uploads/${chatId}/${fileName}`;
    const fileRef  = storageRef(storage, path);
    const task: UploadTask = uploadBytesResumable(fileRef, file);

    task.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(Math.round(progress));
      },
      (error) => reject(new Error(error.message)),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({
          id:   uuidv4(),
          name: file.name,
          url,
          type: file.type,
          size: file.size,
        });
      },
    );
  });
};
