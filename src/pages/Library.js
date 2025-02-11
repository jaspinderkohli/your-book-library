import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const Library = ({ session }) => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    // Filter books based on search input & status filter
    setFilteredBooks(
      books.filter(
        (book) =>
          (statusFilter === "all" || book.status === statusFilter) &&
          (book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase()) ||
            book.isbn.includes(search))
      )
    );
  }, [search, books, statusFilter]);

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error fetching books:", error);
    } else {
      setBooks(data);
      setFilteredBooks(data); // Initialize filtered books
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800">📚 Your Library</h2>

      {/* 🔍 Search Bar */}
      <div className="relative mt-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Search books by title, author, or ISBN..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <MagnifyingGlassIcon className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
      </div>

      {/* 📑 Status Filter Tabs */}
      <div className="mt-4 flex space-x-3">
        {["all", "not_started", "in_progress", "completed"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              statusFilter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setStatusFilter(status)}
          >
            {status === "all"
              ? "All"
              : status === "not_started"
              ? "Not Started"
              : status === "in_progress"
              ? "In Progress"
              : "Completed"}
          </button>
        ))}
      </div>

      {/* 📚 Book List */}
      <div className="mt-6 w-full max-w-md">
        {loading ? (
          <p className="text-blue-500 text-center">Loading books...</p>
        ) : filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className="flex items-center p-4 bg-white rounded-lg shadow-md mb-3 cursor-pointer transition hover:shadow-lg"
              onClick={() => navigate(`/book/${book.id}`)}
            >
              {/* 📖 Book Cover */}
              <img
                src={book.image_url || "https://via.placeholder.com/120x180?text=No+Cover"}
                alt={book.title}
                className="w-16 h-24 object-cover rounded-md"
              />

              {/* 📄 Book Details */}
              <div className="ml-4 flex-grow">
                <h3 className="font-semibold text-lg">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
              </div>

              {/* 🔖 Status Indicator */}
              <span
                className={`px-2 py-1 text-xs font-bold rounded-lg ${
                  book.status === "not_started"
                    ? "bg-gray-200 text-gray-700"
                    : book.status === "in_progress"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {book.status === "not_started"
                  ? "Not Started"
                  : book.status === "in_progress"
                  ? "In Progress"
                  : "Completed"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Library;
