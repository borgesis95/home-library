import { Book, BookInfo } from "../../client/src/interface/Book";
import { IBook } from "../models/book.model";

export const thumbnailBooksMapping = (
  booksList: IBook[],
  imagePath: string
) => {
  const booksMapping = booksList.map((book: IBook) => {
    return {
      ...book,
      thumbnail: book.thumbnail ? new URL(book?.thumbnail, imagePath).href : "",
    };
  });

  return booksMapping;
};

/**
 * Convert Book information retrieved from web into a format for mobile application
 * @param book
 * @returns
 */
export const mapBookFromService = (book: BookInfo): Book => {
  const bookResponse: Book = {
    authors: book.volumeInfo.authors.join(","),
    isBorrow: false,
    isRead: false,
    title: book.volumeInfo.title,
    libraryId: "",
    startedRead: "",
    isbn: book.volumeInfo.industryIdentifiers[0].identifier,
    borrowPerson: "",
    description: "",
    publishedDate: book.volumeInfo.publishedDate,
    shelfId: "",
    thumbnail: book.volumeInfo.imageLinks.smallThumbnail,
  };

  return bookResponse;
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: string
) => {
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == "K") {
    dist = dist * 1.609344;
  }
  if (unit == "N") {
    dist = dist * 0.8684;
  }
  return dist;
};
