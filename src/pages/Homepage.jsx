// --------COMPONENTS--------//
import Slider from "../components/ui/Slider";
import SearchBar from "../components/ui/SearchBar";
import RecentBook from "../components/ui/RecentBook";
import BestSellers from "../components/ui/BestSellers";

export default function Homepage({ addToCart }) {
  return (
    <div className="homepage">
      <Slider />
      <SearchBar addToCart={addToCart} />
      <RecentBook addToCart={addToCart} />
      <BestSellers addToCart={addToCart} />
    </div>
  );
}
