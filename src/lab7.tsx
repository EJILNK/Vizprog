import React, { useEffect, useMemo, useState } from 'react'

const BOOKS_API_URL = 'https://fakeapi.extendsclass.com/books'
const REQUEST_TIMEOUT_MS = 20000000

export type ApiBook = {
  id: number
  title: string
  isbn: string
  pageCount: number
  authors: string[]
}

export type BookWithCover = ApiBook & {
  coverUrl: string | null
}

type BookCardProps = {
  title: string
  authors: string[]
  coverUrl: string | null
}

const styles = {
  page: {
    fontFamily: 'Arial, sans-serif',
    margin: '0 auto',
    maxWidth: '1200px',
    padding: '24px'
  } satisfies React.CSSProperties,
  title: {
    fontSize: '32px',
    margin: '0 0 20px'
  } satisfies React.CSSProperties,
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px'
  } satisfies React.CSSProperties,
  card: {
    border: '1px solidrgb(28, 69, 249)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    width: '210px'
  } satisfies React.CSSProperties,
  cover: {
    alignSelf: 'center',
    background: '#939393',
    borderRadius: '4px',
    height: '280px',
    objectFit: 'cover',
    width: '180px'
  } satisfies React.CSSProperties,
  placeholder: {
    alignItems: 'center',
    color: '#777777',
    display: 'flex',
    fontSize: '14px',
    justifyContent: 'center'
  } satisfies React.CSSProperties,
  bookName: {
    fontSize: '22px',
    fontWeight: 700,
    margin: '12px 0 8px'
  } satisfies React.CSSProperties,
  authors: {
    color: '#555555',
    fontSize: '16px',
    margin: 0
  } satisfies React.CSSProperties,
  message: {
    color: '#444444',
    fontSize: '16px',
    marginTop: '8px'
  } satisfies React.CSSProperties,
  error: {
    color: '#b00020'
  } satisfies React.CSSProperties
}

export function BookCard({ title, authors, coverUrl }: BookCardProps) {
  return (
    <article style={styles.card}>
      {coverUrl ? (
        <img src={coverUrl} alt={`Обложка книги ${title}`} style={styles.cover} />
      ) : (
        <div style={{ ...styles.cover, ...styles.placeholder }}>Нет обложки</div>
      )}

      <h2 style={styles.bookName}>{title}</h2>
      <p style={styles.authors}>{authors.length > 0 ? authors.join(', ') : 'Автор неизвестен'}</p>
    </article>
  )
}

export async function fetchBooks(): Promise<ApiBook[]> {
  const response = await fetchWithTimeout(BOOKS_API_URL, REQUEST_TIMEOUT_MS)

  if (!response.ok) {
    throw new Error(`Не удалось получить список книг: ${response.status}`)
  }

  const data = (await response.json()) as ApiBook[]
  return data
}

export async function fetchCoverByIsbn(isbn: string): Promise<string | null> {
  const normalizedIsbn = isbn.trim()
  if (!normalizedIsbn) {
    return null
  }

  const baseUrl = `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(normalizedIsbn)}-M.jpg`

  try {
    const response = await fetchWithTimeout(`${baseUrl}?default=false`, REQUEST_TIMEOUT_MS)
    if (!response.ok) {
      return null
    }
    return baseUrl
  } catch {
    return null
  }
}

export async function buildBooksWithCovers(books: ApiBook[]): Promise<BookWithCover[]> {
  const withCovers = await Promise.all(
    books.map(async (book) => {
      const coverUrl = book.isbn ? await fetchCoverByIsbn(book.isbn) : null
      return { ...book, coverUrl }
    })
  )

  return withCovers
}

function fetchWithTimeout(input: RequestInfo | URL, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  return fetch(input, { signal: controller.signal }).finally(() => {
    clearTimeout(timeout)
  })
}

export default function Lab7() {
  const [books, setBooks] = useState<BookWithCover[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    const load = async () => {
      try {
        const apiBooks = await fetchBooks()
        const initialBooks: BookWithCover[] = apiBooks.map((book) => ({ ...book, coverUrl: null }))

        if (!isCancelled) {
          setBooks(initialBooks)
          setIsLoading(false)
        }

        const booksWithCovers = await buildBooksWithCovers(apiBooks)
        if (!isCancelled) {
          setBooks(booksWithCovers)
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error instanceof Error ? error.message : 'Неизвестная ошибка')
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      isCancelled = true
    }
  }, [])

  const hasBooks = useMemo(() => books.length > 0, [books])

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Лаба 7</h1>

      {!isLoading && !errorMessage && !hasBooks && <p style={styles.message}>Список книг пуст.</p>}

      {!isLoading && !errorMessage && hasBooks && (
        <section style={styles.grid}>
          {books.map((book) => (
            <BookCard key={book.id} title={book.title} authors={book.authors} coverUrl={book.coverUrl} />
          ))}
        </section>
      )}
    </main>
  )
}
