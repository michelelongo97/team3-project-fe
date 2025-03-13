

// --------COMPONENTS--------//
import Slider from "../components/ui/Slider";
import SearchBar from "../components/ui/SearchBar";
import RecentBook from "../components/ui/RecentBook";

export default function Homepage() {
  
  return (
    <div className="homepage">
      <Slider/>
      <SearchBar/>
      <RecentBook/>
    </div>
  );
}
