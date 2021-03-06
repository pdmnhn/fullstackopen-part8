import { useEffect, useState } from "react";
import { useApolloClient, useSubscription } from "@apollo/client";

import Authors from "./components/Authors";
import Books from "./components/Books";
import Recommend from "./components/Recommend";
import NewBook from "./components/NewBook";
import Login from "./components/Login";

import { ALL_BOOKS, BOOK_ADDED } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [loginVisible, setLoginVisible] = useState(true);
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      alert(`${subscriptionData.data.bookAdded.title} added!`);
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return { allBooks: allBooks.concat(subscriptionData.data.bookAdded) };
      });
    },
  });

  useEffect(() => {
    if (token) {
      setLoginVisible(false);
    } else {
      setLoginVisible(true);
    }
    setPage("authors");
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem("user-token");
    if (token) {
      setToken(token);
    }
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {loginVisible ? (
          <button onClick={() => setPage("login")}>login</button>
        ) : (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        )}
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      {loginVisible ? (
        <Login show={page === "login"} setToken={setToken} />
      ) : (
        <>
          <NewBook show={page === "add"} />
          <Recommend show={page === "recommend"} />
        </>
      )}
    </div>
  );
};

export default App;
