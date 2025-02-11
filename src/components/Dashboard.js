import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Dashboard = ({ session }) => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    inProgress: 0,
    completed: 0,
  });
  const defaultCover = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching books:", error);
      } else {
        setBooks(data);
        console.log(data);
        setStats({
          totalBooks: data.length,
          inProgress: data.filter((book) => book.status === "in_progress").length,
          completed: data.filter((book) => book.status === "completed").length,
        });
      }
    } catch (error) {
      console.error("Unexpected error fetching books:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <div className="flex-grow p-4 md:p-6 space-y-6">
        {/* 👤 Personalized Greeting */}
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold">Hello, {session.user.email.split("@")[0]}! 👋</h2>
          <p className="text-sm mt-1">Let's track your reading journey 📚</p>
        </div>

        {/* 🔥 Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/scan")}
            className="bg-yellow-500 text-white p-3 rounded-lg shadow-md hover:bg-yellow-600 transition"
          >
            📷 Scan a Book
          </button>
          <button
            onClick={() => navigate("/library")}
            className="bg-green-500 text-white p-3 rounded-lg shadow-md hover:bg-green-600 transition"
          >
            📚 View Library
          </button>
        </div>

        {/* 📖 Recently Added Books */}
        <div>
          <h3 className="text-lg font-bold text-gray-800">Recently Added</h3>
          {books.length === 0 ? (
            <p className="text-gray-500 mt-2">No books added yet.</p>
          ) : (
            <div className="flex overflow-x-auto space-x-4 mt-2 pb-2 scrollbar-hide">
              {books.slice(0, 5).map((book) => (
                <div
                  key={book.id}
                  className="bg-white p-3 rounded-lg shadow-md min-w-[120px] flex flex-col items-center"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <img
                    src={book.image_url || defaultCover}
                    alt={book.title}
                    className="w-24 h-36 object-cover rounded-md"
                  />
                  <p className="text-xs font-medium mt-2 text-center">{book.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 📊 Reading Stats */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-bold text-gray-800">📊 Reading Stats</h3>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.totalBooks}</p>
              <p className="text-xs text-gray-500">Books Added</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-gray-500">Books Read</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
          </div>
        </div>

      </div>

      <Navbar />
    </div>
  );
};

export default Dashboard;
