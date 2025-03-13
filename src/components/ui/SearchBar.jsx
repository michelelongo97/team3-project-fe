export default function SearchBar() {
  return (
    <section className="search-bar">
      <input
        type="text"
        placeholder="Cerca un libro..."
        className="search-input"
      />
      <button className="search-button">🔍</button>
    </section>
  );
}
