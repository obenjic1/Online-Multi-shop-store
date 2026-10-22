import { Service } from '@angular/core';
import { environment } from '../../../environments/environment';

@Service()
export class FileService {


  private readonly apiUrl = environment.apiUrl.replace('/api', '');

  getImageUrl(url: string | null | undefined): string {

    if (!url) {
      return '';
    }

    // Already a complete URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return `${this.apiUrl}${url}`;
  }
}
