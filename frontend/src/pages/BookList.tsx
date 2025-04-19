import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { useCart } from "../context/CartContext";
import CategoryFilter from "../components/CategoryFilter";
import CartSummary from "../components/CartSummary";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Needed for Toast and Accordion

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selected, setSelected] = useState<string[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selected
        .map((cat) => `category=${encodeURIComponent(cat)}`)
        .join("&");

      const response = await fetch(
        `http://localhost:5000/api/Books/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}${
          selected.length ? `&${categoryParams}` : ""
        }`
      );
      const data = await response.json();

      setBooks(data.books);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, selected]);

  return (
    <div className="container mt-4">
      <CartSummary />
      <h1 className="text-center mb-4">📚 Bookstore</h1>
      <div className="row">
        <div className="col-md-3">
          <CategoryFilter selected={selected} setSelected={setSelected} />
        </div>

        <div className="col-md-9">
          <div className="row">
            {books.map((b) => (
              <div key={b.bookID} className="col-sm-6 col-md-4 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{b.title}</h5>
                    <p className="card-text">
                      <strong>Author:</strong> {b.author}
                    </p>
                    <p className="card-text">
                      <strong>Price:</strong> ${b.price.toFixed(2)}
                    </p>

                    {/* Bootstrap Accordion - More Details */}
                    <div className="accordion" id={`accordion${b.bookID}`}>
                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id={`heading${b.bookID}`}
                        >
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${b.bookID}`}
                            aria-expanded="false"
                            aria-controls={`collapse${b.bookID}`}
                          >
                            More Details
                          </button>
                        </h2>
                        <div
                          id={`collapse${b.bookID}`}
                          className="accordion-collapse collapse"
                          aria-labelledby={`heading${b.bookID}`}
                          data-bs-parent={`#accordion${b.bookID}`}
                        >
                          <div className="accordion-body">
                            <p>
                              <strong>ISBN:</strong> {b.isbn}
                            </p>
                            <p>
                              <strong>Publisher:</strong> {b.publisher}
                            </p>
                            <p>
                              <strong>Category:</strong> {b.classification} /{" "}
                              {b.category}
                            </p>
                            <p>
                              <strong>Pages:</strong> {b.pageCount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      className="btn btn-success w-100 mt-3"
                      onClick={() => {
                        addToCart(b);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${pageNum === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPageNum(pageNum - 1)}
                  >
                    Previous
                  </button>
                </li>

                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${pageNum === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPageNum(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    pageNum === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPageNum(pageNum + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Page Size Selector */}
          <div className="mt-3">
            <label>
              Results per page:
              <select
                className="form-select d-inline-block w-auto ms-2"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookList;
