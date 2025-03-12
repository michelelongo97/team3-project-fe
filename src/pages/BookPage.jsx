import axios from "../api/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CardSinglePage from "../components/ui/CardSinglePage";

export default function BookPage() {
  const [book, setBook] = useState([]);
  const { id } = useParams();

  const fetchBook = () => {
    axios
      .get(`/books/${id}`)
      .then((res) => {
        console.log(res.data);
        setBook(res.data);
      })
      .catch((err) => {
        if (err.status === 404) {
          console.log("/404");
        }
      });
  };

  useEffect(fetchBook, [id]);

  return (
    <section>
      <CardSinglePage {...book} />
    </section>
  );
}
