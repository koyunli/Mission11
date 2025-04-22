// import { useEffect, useState } from 'react';
// import { fetchBooks, addBook, updateBook, deleteBook } from '../api/BooksAPI';
// import { Book } from '../types/Book';
// import Pagination from '../components/Pagination';
// import NewBookForm from '../components/NewBookForm';

// const AdminBooksPage = () => {
//   const [books, setBooks] = useState<Book[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [pageSize, setPageSize] = useState<number>(10);
//   const [pageNum, setPageNum] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(0);
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [formData, setFormData] = useState<Book>({
//     bookId: 0,
//     title: '',
//     author: '',
//     publisher: '',
//     isbn: '',
//     classification: '',
//     category: '',
//     price: 0,
//     pageCount: 0,
//   });
//   const [editingId, setEditingId] = useState<number | null>(null);

//   const loadBooks = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchBooks(pageSize, pageNum, []);
//       setBooks(data.books);
//       const total = data.totalNumBooks ?? data.books.length;
//       setTotalPages(Math.ceil(total / pageSize));
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadBooks();
//   }, [pageSize, pageNum]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'number' ? Number(value) : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await updateBook(editingId, { ...formData, bookId: editingId });
//       } else {
//         await addBook({ ...formData, bookId: 0 });
//       }
//       setFormData({
//         bookId: 0,
//         title: '',
//         author: '',
//         publisher: '',
//         isbn: '',
//         classification: '',
//         category: '',
//         price: 0,
//         pageCount: 0,
//       });
//       setEditingId(null);
//       setShowForm(false);
//       loadBooks();
//     } catch (error) {
//       console.error('Error saving book', error);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteBook(id);
//       loadBooks();
//     } catch (error) {
//       console.error('Error deleting book', error);
//     }
//   };

//   const handleEditing = (book: Book) => {
//     setFormData({
//       bookId: book.bookId,
//       title: book.title,
//       author: book.author,
//       publisher: book.publisher,
//       isbn: book.isbn,
//       classification: book.classification,
//       category: book.category,
//       price: book.price,
//       pageCount: book.pageCount,
//     });
//     setEditingId(book.bookId);
//     setShowForm(true);
//   };

//   if (loading) {
//     return (
//       <div className="text-center mt-5">
//         <div className="spinner-border text-primary" role="status" />
//         <p className="mt-3">Loading books...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return <p className="text-danger">Error: {error}</p>;
//   }

//   return (
//     <div className="container mt-4">
//       <h2>Admin - Books</h2>

//       {!showForm && (
//         <button
//           className="btn btn-success mb-3"
//           onClick={() => setShowForm(true)}
//         >
//           Add Book
//         </button>
//       )}

//       {showForm && (
//         <NewBookForm
//           formData={formData}
//           onChange={handleChange}
//           onSubmit={handleSubmit}
//           onCancel={() => {
//             setShowForm(false);
//             setEditingId(null);
//             setFormData({
//               bookId: 0,
//               title: '',
//               author: '',
//               publisher: '',
//               isbn: '',
//               classification: '',
//               category: '',
//               price: 0,
//               pageCount: 0,
//             });
//           }}
//           editingId={editingId}
//         />
//       )}

//       <table className="table table-bordered table-striped table-hover">
//         <thead className="table-dark">
//           <tr>
//             <th>ID</th>
//             <th>Title</th>
//             <th>Author</th>
//             <th>Publisher</th>
//             <th>ISBN</th>
//             <th>Classification</th>
//             <th>Category</th>
//             <th>Price</th>
//             <th>Page Count</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {books.map((b) => (
//             <tr key={b.bookId}>
//               <td>{b.bookId}</td>
//               <td>{b.title}</td>
//               <td>{b.author}</td>
//               <td>{b.publisher}</td>
//               <td>{b.isbn}</td>
//               <td>{b.classification}</td>
//               <td>{b.category}</td>
//               <td>${b.price.toFixed(2)}</td>
//               <td>{b.pageCount}</td>
//               <td>
//                 <div className="d-flex flex-column gap-1">
//                   <button
//                     className="btn btn-primary btn-sm"
//                     onClick={() => handleEditing(b)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => handleDelete(b.bookId)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <Pagination
//         currentPage={pageNum}
//         totalPages={totalPages}
//         pageSize={pageSize}
//         onPageChange={setPageNum}
//         onPageSizeChange={(newSize) => {
//           setPageSize(newSize);
//           setPageNum(1);
//         }}
//       />
//     </div>
//   );
// };

// export default AdminBooksPage;

import { useEffect, useState } from 'react';
import { fetchBooks, addBook, updateBook, deleteBook } from '../api/BooksAPI';
import { Book } from '../types/Book';
import Pagination from '../components/Pagination';
import NewBookForm from '../components/NewBookForm';
import EditBookForm from '../components/EditBookForm'; // ⭐️ 加這個！

const AdminBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<Book>({
    bookId: 0,
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    price: 0,
    pageCount: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await fetchBooks(pageSize, pageNum, []);
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
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateBook(editingId, { ...formData, bookId: editingId });
      } else {
        await addBook({ ...formData, bookId: 0 });
      }
      resetForm();
      loadBooks();
    } catch (error) {
      console.error('Error saving book', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBook(id);
      loadBooks();
    } catch (error) {
      console.error('Error deleting book', error);
    }
  };

  const startEditing = (book: Book) => {
    setFormData({
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      price: book.price,
      pageCount: book.pageCount,
    });
    setEditingId(book.bookId);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      bookId: 0,
      title: '',
      author: '',
      publisher: '',
      isbn: '',
      classification: '',
      category: '',
      price: 0,
      pageCount: 0,
    });
    setEditingId(null);
    setShowForm(false);
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
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          Add Book
        </button>
      )}

      {showForm &&
        (editingId ? (
          <EditBookForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        ) : (
          <NewBookForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            editingId={editingId}
          />
        ))}

      <table className="table table-bordered table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Price</th>
            <th>Page Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.bookId}>
              <td>{b.bookId}</td>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.isbn}</td>
              <td>{b.classification}</td>
              <td>{b.category}</td>
              <td>${b.price.toFixed(2)}</td>
              <td>{b.pageCount}</td>
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
