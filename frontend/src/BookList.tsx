import { useEffect, useState } from "react";
import { Book } from "./types/Book";

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(
        `http://localhost:5081/api/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}`
      );
      const data = await response.json();

      const sortedBooks = [...data.books].sort((a: Book, b: Book) =>
        sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      );

      setBooks(sortedBooks);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, sortAsc]);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Bookstore</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-secondary" onClick={() => setSortAsc(!sortAsc)}>
          Sort by Title {sortAsc ? "▲" : "▼"}
        </button>

        <label className="form-label">
          Results per page:
          <select
            className="form-select d-inline-block w-auto ms-2"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </label>
      </div>

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        books.map((b) => (
          <div className="card mb-3" key={b.bookID}>
            <div className="card-body">
              <h5 className="card-title">{b.title}</h5>
              <ul className="list-unstyled">
                <li><strong>Author:</strong> {b.author}</li>
                <li><strong>Publisher:</strong> {b.publisher}</li>
                <li><strong>ISBN:</strong> {b.isbn}</li>
                <li><strong>Category:</strong> {b.classification} / {b.category}</li>
                <li><strong>Pages:</strong> {b.pageCount}</li>
                <li><strong>Price:</strong> ${b.price.toFixed(2)}</li>
              </ul>
            </div>
          </div>
        ))
      )}

      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${pageNum === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPageNum(pageNum - 1)}>Previous</button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li key={i + 1} className={`page-item ${pageNum === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => setPageNum(i + 1)}>{i + 1}</button>
              </li>
            ))}

            <li className={`page-item ${pageNum === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPageNum(pageNum + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default BookList;
