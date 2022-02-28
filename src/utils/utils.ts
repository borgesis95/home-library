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
