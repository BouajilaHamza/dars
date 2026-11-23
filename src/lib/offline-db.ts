import { openDB, DBSchema } from 'idb';
import { Course, Lesson } from '../types';

interface DarsDB extends DBSchema {
  offlineLessons: {
    key: string;
    value: {
      lessonId: string;
      courseId: string;
      lesson: Lesson;
      savedAt: string;
    };
  };
  offlineProgress: {
    key: string;
    value: {
      lessonId: string;
      completed: boolean;
      timestamp: string;
      synced: boolean;
    };
  };
}

const DB_NAME = 'dars_offline_db';
const DB_VERSION = 1;

export async function getDarsDB() {
  return openDB<DarsDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('offlineLessons')) {
        db.createObjectStore('offlineLessons', { keyPath: 'lessonId' });
      }
      if (!db.objectStoreNames.contains('offlineProgress')) {
        db.createObjectStore('offlineProgress', { keyPath: 'lessonId' });
      }
    },
  });
}

// Save a lesson for offline study
export async function saveLessonOffline(courseId: string, lesson: Lesson) {
  const db = await getDarsDB();
  await db.put('offlineLessons', {
    lessonId: lesson.id,
    courseId,
    lesson,
    savedAt: new Date().toISOString()
  });
}

// Remove an offline lesson
export async function removeLessonOffline(lessonId: string) {
  const db = await getDarsDB();
  await db.delete('offlineLessons', lessonId);
}

// Check if a lesson is stored offline
export async function isLessonOffline(lessonId: string): Promise<boolean> {
  const db = await getDarsDB();
  const found = await db.get('offlineLessons', lessonId);
  return !!found;
}

// Get all offline lessons
export async function getAllOfflineLessons() {
  const db = await getDarsDB();
  return db.getAll('offlineLessons');
}
