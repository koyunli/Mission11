import { Book } from '../types/Book';

interface EditBookFormProps {
  formData: Book;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const EditBookForm = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
}: EditBookFormProps) => {
  return (
    <form onSubmit={onSubmit} className="mb-4">
      <h4>Edit Book</h4>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={onChange}
        className="form-control my-1"
      />
      <input
        type="text"
        name="author"
        placeholder="Author"
        value={formData.author}
        onChange={onChange}
        className="form-control my-1"
      />
      <input
        type="text"
        name="publisher"
        placeholder="Publisher"
        value={formData.publisher}
        onChange={onChange}
        className="form-control my-1"
      />
      <input
        type="text"
        name="isbn"
        placeholder="ISBN"
        value={formData.isbn}
        onChange={onChange}
        className="form-control my-1"
      />
      <input
        type="text"
        name="classification"
        placeholder="Classification"
        value={formData.classification}
        onChange={onChange}
        className="form-control my-1"
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={onChange}
        className="form-control my-1"
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={onChange}
        className="form-control my-1"
      />
      <input
        type="number"
        name="pageCount"
        placeholder="Page Count"
        value={formData.pageCount}
        onChange={onChange}
        className="form-control my-1"
      />

      <div className="mt-2">
        <button type="submit" className="btn btn-primary me-2">
          Update Book
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditBookForm;
