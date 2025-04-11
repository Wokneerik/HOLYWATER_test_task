export interface Slide {
  id: number;
  book_id: number;
  cover: string;
}

export interface Book {
  id: number;
  name: string;
  author: string;
  summary: string;
  genre: string;
  cover_url: string;
  views: string;
  likes: string;
  quotes: string;
}
