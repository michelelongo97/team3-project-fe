// --------COMPONENTS--------//
import Slider from "../components/ui/Slider";
import SearchBar from "../components/ui/SearchBar";
import RecentBook from "../components/ui/RecentBook";
import BestSellers from "../components/ui/BestSellers";

export default function Homepage() {
  return (
    <div className="homepage">
      <Slider />
      <SearchBar />
      <RecentBook />
      <BestSellers />
    </div>
  );
}
