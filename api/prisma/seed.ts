import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const genres = [
  {
    name: 'Software Engineering',
    slug: 'software-engineering',
    description: 'Architecture, clean code, databases, and systems design.',
  },
  {
    name: 'Fiction',
    slug: 'fiction',
    description: 'Literary novels and classic contemporary storytelling.',
  },
  {
    name: 'Science & Mathematics',
    slug: 'science-mathematics',
    description: 'Physics, cosmology, biology, and mathematical thinking.',
  },
  {
    name: 'History',
    slug: 'history',
    description: 'World history, civilizations, and historical analysis.',
  },
  {
    name: 'Philosophy & Psychology',
    slug: 'philosophy-psychology',
    description: 'Ethics, logic, cognitive science, and human behavior.',
  },
];

const books = [
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    publishedYear: 2008,
    description: 'A handbook of agile software craftsmanship.',
    totalCopies: 5,
    availableCopies: 5,
    genreSlug: 'software-engineering',
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '978-1449373320',
    publishedYear: 2017,
    description: 'The big ideas behind reliable, scalable, and maintainable systems.',
    totalCopies: 4,
    availableCopies: 4,
    genreSlug: 'software-engineering',
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    isbn: '978-0135957059',
    publishedYear: 2019,
    description: '20th anniversary edition guide to modern software engineering.',
    totalCopies: 6,
    availableCopies: 6,
    genreSlug: 'software-engineering',
  },
  {
    title: 'Refactoring',
    author: 'Martin Fowler',
    isbn: '978-0134757599',
    publishedYear: 2018,
    description: 'Improving the design of existing code.',
    totalCopies: 3,
    availableCopies: 3,
    genreSlug: 'software-engineering',
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    publishedYear: 1949,
    description: 'Dystopian social science fiction novel.',
    totalCopies: 5,
    availableCopies: 5,
    genreSlug: 'fiction',
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0060935467',
    publishedYear: 1960,
    description: 'Classic American novel exploring justice and moral growth.',
    totalCopies: 4,
    availableCopies: 4,
    genreSlug: 'fiction',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    publishedYear: 1925,
    description: 'A portrait of the Jazz Age and the American Dream.',
    totalCopies: 4,
    availableCopies: 4,
    genreSlug: 'fiction',
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '978-0441172719',
    publishedYear: 1965,
    description: 'Epic science fiction set on the desert planet Arrakis.',
    totalCopies: 3,
    availableCopies: 3,
    genreSlug: 'fiction',
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    isbn: '978-0553380163',
    publishedYear: 1988,
    description: 'Landmark exploration of cosmology, black holes, and the universe.',
    totalCopies: 4,
    availableCopies: 4,
    genreSlug: 'science-mathematics',
  },
  {
    title: 'Cosmos',
    author: 'Carl Sagan',
    isbn: '978-0345539434',
    publishedYear: 1980,
    description: 'The story of cosmic evolution, science, and civilization.',
    totalCopies: 3,
    availableCopies: 3,
    genreSlug: 'science-mathematics',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    isbn: '978-0198788607',
    publishedYear: 1976,
    description: 'A gene-centered view of evolution.',
    totalCopies: 3,
    availableCopies: 3,
    genreSlug: 'science-mathematics',
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '978-0062316097',
    publishedYear: 2011,
    description: 'A sweeping history of the human species.',
    totalCopies: 5,
    availableCopies: 5,
    genreSlug: 'history',
  },
  {
    title: 'The Silk Roads',
    author: 'Peter Frankopan',
    isbn: '978-1101912379',
    publishedYear: 2015,
    description: 'A new history of the world centered on the East-West trade routes.',
    totalCopies: 3,
    availableCopies: 3,
    genreSlug: 'history',
  },
  {
    title: 'Guns, Germs, and Steel',
    author: 'Jared Diamond',
    isbn: '978-0393354324',
    publishedYear: 1997,
    description: 'The fates of human societies shaped by geography and environment.',
    totalCopies: 3,
    availableCopies: 3,
    genreSlug: 'history',
  },
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    isbn: '978-0812968255',
    publishedYear: 180,
    description: 'Stoic reflections on virtue, reason, and resilience.',
    totalCopies: 4,
    availableCopies: 4,
    genreSlug: 'philosophy-psychology',
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    isbn: '978-0374533557',
    publishedYear: 2011,
    description: 'How two systems of thought drive human judgment and decision-making.',
    totalCopies: 4,
    availableCopies: 4,
    genreSlug: 'philosophy-psychology',
  },
];

async function main() {
  const genreBySlug = new Map<string, number>();

  for (const genre of genres) {
    const savedGenre = await prisma.genre.upsert({
      where: { slug: genre.slug },
      update: {
        name: genre.name,
        description: genre.description,
      },
      create: genre,
    });
    genreBySlug.set(savedGenre.slug, savedGenre.id);
  }

  for (const book of books) {
    const genreId = genreBySlug.get(book.genreSlug);
    if (!genreId) {
      throw new Error(`Missing genre for slug: ${book.genreSlug}`);
    }

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        title: book.title,
        author: book.author,
        publishedYear: book.publishedYear,
        description: book.description,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        genreId,
      },
      create: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishedYear: book.publishedYear,
        description: book.description,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        genreId,
      },
    });
  }

  const [genreCount, bookCount] = await Promise.all([
    prisma.genre.count(),
    prisma.book.count(),
  ]);

  console.log(`Seed complete: ${genreCount} genres, ${bookCount} books.`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
