import { useEffect, useState } from "react";
import Pagination from "../components/Pagination"; // 這要有喔！

interface Book {
  bookId: number;
  title: string;
  author: string;
  category: string;
  price: number;
  pageCount: number;
  publisher: string;
}

const AdminBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<Omit<Book, "bookId">>({
    title: "",
    author: "",
    category: "",
    price: 0,
    pageCount: 0,
    publisher: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const apiUrl = "http://localhost:5000/api/books";

  const loadBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${apiUrl}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}`
      );
      const data = await res.json();
      setBooks(data.books);
      const total = data.totalNumBooks ?? data.books.length;
      setTotalPages(Math.ceil(total / pageSize));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [pageSize, pageNum]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${apiUrl}/UpdateBook/${editingId}`
      : `${apiUrl}/AddBook`;

    const payload = {
      bookId: editingId ?? 0, // 沒有 editingId (新增) 就是 0
      title: formData.title,
      author: formData.author,
      category: formData.category,
      price: Number(formData.price), // 確保是 number
      pageCount: Number(formData.pageCount), // 確保是 number
      publisher: formData.publisher,
    };

    await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setFormData({
      title: "",
      author: "",
      category: "",
      price: 0,
      pageCount: 0,
      publisher: "",
    });
    setEditingId(null);
    setShowForm(false);
    loadBooks();
  };

  const handleDelete = async (id: number) => {
    await fetch(`${apiUrl}/DeleteBook/${id}`, {
      method: "DELETE",
    });
    loadBooks();
  };

  const startEditing = (book: Book) => {
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      price: book.price,
      pageCount: book.pageCount,
      publisher: book.publisher,
    });
    setEditingId(book.bookId);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger">Error: {error}</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Admin - Books</h2>

      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Book
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <h4>{editingId ? "Edit Book" : "Add New Book"}</h4>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="form-control my-1"
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            className="form-control my-1"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="form-control my-1"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="form-control my-1"
          />
          <input
            type="number"
            name="pageCount"
            placeholder="Page Count"
            value={formData.pageCount}
            onChange={handleChange}
            className="form-control my-1"
          />
          <input
            type="text"
            name="publisher"
            placeholder="Publisher"
            value={formData.publisher}
            onChange={handleChange}
            className="form-control my-1"
          />

          <div className="mt-2">
            <button type="submit" className="btn btn-primary me-2">
              {editingId ? "Update Book" : "Add Book"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({
                  title: "",
                  author: "",
                  category: "",
                  price: 0,
                  pageCount: 0,
                  publisher: "",
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="table table-bordered table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Price</th>
            <th>Page Count</th>
            <th>Publisher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.bookId}>
              <td>{b.bookId}</td>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.category}</td>
              <td>${b.price}</td>
              <td>{b.pageCount}</td>
              <td>{b.publisher}</td>
              <td>
                <div className="d-flex flex-column gap-1">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => startEditing(b)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(b.bookId)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Section */}
      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </div>
  );
};

export default AdminBooksPage;
