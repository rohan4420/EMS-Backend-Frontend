import { useEffect, useState } from "react";
import "./App.css";
import Loading from "./Loading";
import Tours from "./Tours";

const url = "https://course-api.com/react-tours-project";
function App() {
  // when there are no items
  const [isLoading, setIsLoading] = useState(true);
  const [tours, setTours] = useState([]);

  // remove tours by single click
  const removeTours = (id) => {
    const newTours = tours.filter((tour) => tour.id !== id);
    setTours(newTours);
  };

  // fetch tours from given url
  const fetchTours = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      const tours = await response.json();
      setTours(tours);
      console.log(tours);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  // pass fetchTours in useEffect ([] => renders only intially)
  useEffect(() => {
    fetchTours();
  }, []);

  // when tours are present
  if (isLoading) {
    return (
      <main>
        <Loading />
      </main>
    );
  }

  // tours with 0 items
  if (tours.length === 0) {
    return (
      <main>
        <h2>No tours left</h2>
        <button
          type="button"
          className="btn"
          style={{ marginTop: "2rem" }}
          onClick={fetchTours}
        >
          Refetch
        </button>
      </main>
    );
  }
  // pass tours object and removetourse reference to Tours component
  return (
    <main>
      <Tours tours={tours} removeTour={removeTours} />
    </main>
  );
}
export default App;
