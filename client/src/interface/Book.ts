export interface Book {
  isbn: string;
  title: string;
  authors: string;
  publishedDate?: string;
  isRead: boolean;
  startedRead?: string | null;
  description?: string;
  thumbnail?: string;
  isBorrow: boolean;
  borrowPerson?: string;
  libraryId?: string;
  shelfId?: string;
}

export interface BookCardInfo {
  _id: string;
  libraryId: number | string;
  library: string;
  shelfId: number | string;
  shelf: string;
  isbn: string;
  title: string;
  authors: string;
  isRead: boolean;
  thumbnail?: string;
  isBorrow: boolean;
  borrowPerson?: string;
  publisher?: string;
  description: string;
}

export interface SharedBook {
  username: string;
  books: BookCardInfo[];
}

/** Types derived from google api */
export interface BookInfo {
  kind: 'books#volume';
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: {
    title: string;
    subtitle: string;
    authors: [string];
    publisher: string;
    publishedDate: string;
    description: string;
    industryIdentifiers: [
      {
        type: string;
        identifier: string;
      }
    ];
    pageCount: number;
    dimensions: {
      height: string;
      width: string;
      thickness: string;
    };
    printType: string;
    mainCategory: string;
    categories: [string];
    averageRating: number;
    ratingsCount: number;
    contentVersion: string;
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
      small: string;
      medium: string;
      large: string;
      extraLarge: string;
    };
    language: string;
    previewLink: string;
    infoLink: string;
    canonicalVolumeLink: string;
  };
  userInfo: {
    review: string;
    readingPosition: string;
    isPurchased: boolean;
    isPreordered: boolean;
    updated: string;
  };
  accessInfo: {
    country: string;
    viewability: string;
    embeddable: boolean;
    publicDomain: boolean;
    textToSpeechPermission: string;
    epub: {
      isAvailable: boolean;
      downloadLink: string;
      acsTokenLink: string;
    };
    pdf: {
      isAvailable: boolean;
      downloadLink: string;
      acsTokenLink: string;
    };
    webReaderLink: string;
    accessViewStatus: string;
    downloadAccess: {
      kind: any;
      volumeId: string;
      restricted: boolean;
      deviceAllowed: boolean;
      justAcquired: boolean;
      maxDownloadDevices: number;
      downloadsAcquired: number;
      nonce: string;
      source: string;
      reasonCode: string;
      message: string;
      signature: string;
    };
  };
  searchInfo: {
    textSnippet: string;
  };
}
