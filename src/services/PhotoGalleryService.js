import { photos } from '@/photos/photos.js';
import { Photo } from '@/models/Photo.js';

export class PhotoGalleryService {
  constructor() {
    this._photos = [];
    this._categories = new Set();
  }

  async loadGallery() {
    // In a real API this would fetch, but we map our generated JSON/JS array here.
    return new Promise((resolve) => {
      // Small simulated delay for loading effect, or just immediate execution.
      setTimeout(() => {
        this._photos = photos.map(photoData => new Photo(photoData));
        this._categories = new Set(this._photos.map(p => p.category));
        resolve(this._photos);
      }, 50);
    });
  }

  get allPhotos() {
    return this._photos;
  }

  get categories() {
    return Array.from(this._categories).sort();
  }

  getPhotosByCategory(category) {
    if (!category || category === 'all') {
      return this._photos;
    }
    return this._photos.filter(p => p.category === category);
  }
}

// Singleton pattern so the whole app uses the same cache
export const photoService = new PhotoGalleryService();

