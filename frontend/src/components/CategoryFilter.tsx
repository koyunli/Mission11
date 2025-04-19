import { useEffect, useState } from "react";

function CategoryFilter({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: (val: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/Books/GetCategories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleChange = (cat: string) => {
    setSelected(
      selected.includes(cat)
        ? selected.filter((c) => c !== cat)
        : [...selected, cat]
    );
  };

  return (
    <div className="mb-4">
      <h5>Filter by Category</h5>
      {categories.map((cat) => (
        <div className="form-check" key={cat}>
          <input
            type="checkbox"
            className="form-check-input"
            id={cat}
            value={cat}
            checked={selected.includes(cat)}
            onChange={() => handleChange(cat)}
          />
          <label className="form-check-label" htmlFor={cat}>
            {cat}
          </label>
        </div>
      ))}
    </div>
  );
}

export default CategoryFilter;
