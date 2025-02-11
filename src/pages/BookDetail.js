import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, CheckCircleIcon, PlayIcon, BookmarkIcon, TrashIcon } from "@heroicons/react/24/solid";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [bookInfo, setBookInfo] = useState({
    summary: "",
    publishDate: "N/A",
    pageCount: "N/A",
    categories: "N/A",
    averageRating: "N/A",
    totalRatings: "N/A",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookDetails();
  }, []);

  const fetchBookDetails = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("❌ Error fetching book details:", error);
    } else {
      setBook(data);
      fetchBookMetadata(data.isbn);
    }
  };

  const fetchBookMetadata = async (isbn) => {
    if (!isbn) return;

    try {
      const googleRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const googleData = await googleRes.json();

      if (googleData.items?.length > 0) {
        const info = googleData.items[0].volumeInfo;

        setBookInfo({
          summary: info.description || "No summary available.",
          publishDate: info.publishedDate || "N/A",
          pageCount: info.pageCount || "N/A",
          categories: info.categories?.join(", ") || "N/A",
          averageRating: info.averageRating ? `${info.averageRating}/5` : "N/A",
          totalRatings: info.ratingsCount || "N/A",
        });

        return;
      }

      setBookInfo((prev) => ({
        ...prev,
        summary: "No summary found.",
      }));
    } catch (error) {
      console.error("❌ Error fetching book metadata:", error);
      setBookInfo((prev) => ({
        ...prev,
        summary: "Failed to retrieve book details.",
      }));
    }
  };

  const deleteBook = async () => {
    if (!book) return;

    const { error } = await supabase.from("books").delete().eq("id", book.id);

    if (error) {
      console.error("❌ Error deleting book:", error);
      alert("Failed to delete book.");
    } else {
      alert("📚 Book deleted successfully!");
      navigate("/library");
    }
  };

  const updateBookStatus = async (newStatus) => {
    if (!book) return;

    const { error } = await supabase
      .from("books")
      .update({ status: newStatus })
      .eq("id", book.id);

    if (error) {
      console.error("Error updating status:", error);
      alert("Failed to update book status.");
    } else {
      setBook((prev) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-4 sm:p-6">
      {/* 🔙 Floating Back Button */}
      <button
        onClick={() => navigate("/library")}
        className="absolute top-4 left-4 bg-white shadow-md p-2 rounded-full"
      >
        <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
      </button>

      {book ? (
        <>
          {/* 📖 Book Cover */}
          <img
            src={book.image_url || "https://via.placeholder.com/180x250?text=No+Cover"}
            alt={book.title}
            className="w-44 h-64 object-cover rounded-lg shadow-lg"
          />

          {/* 📚 Book Title & Author */}
          <h2 className="text-2xl font-bold text-gray-800 mt-4">{book.title}</h2>
          <p className="text-gray-500 text-sm mt-1">by {book.author}</p>

          {/* 📄 Book Details */}
          <div className="mt-6 w-full max-w-lg bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Book Details</h3>

            <table className="mt-4 w-full text-left text-gray-600 text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">📆 Published</td>
                  <td className="py-2">{bookInfo.publishDate}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">📖 Pages</td>
                  <td className="py-2">{bookInfo.pageCount}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">🏷 Categories</td>
                  <td className="py-2">{bookInfo.categories}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">⭐ Rating</td>
                  <td className="py-2">{bookInfo.averageRating} ({bookInfo.totalRatings} reviews)</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">🔖 ISBN</td>
                  <td className="py-2">{book.isbn}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 📖 Update Book Status with Toggle Buttons */}
          <div className="mt-6 w-full max-w-lg bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Reading Status</h3>
            <div className="flex justify-around mt-3">
              <button
                onClick={() => updateBookStatus("not_started")}
                className={`flex flex-col items-center p-3 rounded-lg transition ${
                  book.status === "not_started"
                    ? "bg-gray-200 text-gray-700 font-bold"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <BookmarkIcon className="h-6 w-6" />
                <span className="text-xs mt-1">Not Started</span>
              </button>

              <button
                onClick={() => updateBookStatus("in_progress")}
                className={`flex flex-col items-center p-3 rounded-lg transition ${
                  book.status === "in_progress"
                    ? "bg-yellow-200 text-yellow-800 font-bold"
                    : "hover:bg-yellow-100 text-yellow-600"
                }`}
              >
                <PlayIcon className="h-6 w-6" />
                <span className="text-xs mt-1">In Progress</span>
              </button>

              <button
                onClick={() => updateBookStatus("completed")}
                className={`flex flex-col items-center p-3 rounded-lg transition ${
                  book.status === "completed"
                    ? "bg-green-200 text-green-800 font-bold"
                    : "hover:bg-green-100 text-green-600"
                }`}
              >
                <CheckCircleIcon className="h-6 w-6" />
                <span className="text-xs mt-1">Completed</span>
              </button>
            </div>
          </div>

          {/* 📜 Book Summary */}
          <div className="mt-6 w-full max-w-lg bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Summary</h3>
            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
              {bookInfo.summary}
            </p>
          </div>
        </>
      ) : (
        <p className="text-blue-500 text-center">Loading book details...</p>
      )}

      {/* 🗑 Delete Book Button */}
      <button
            onClick={() => setShowConfirmDelete(true)}
            className="mt-4 flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete Book
       </button>

       {showConfirmDelete && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[90%]">
                <p className="text-lg font-semibold">Are you sure you want to delete this book?</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <button onClick={deleteBook} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    Yes, Delete
                  </button>
                  <button onClick={() => setShowConfirmDelete(false)} className="px-4 py-2 bg-gray-300 rounded-lg">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}


    </div>
  );
};

export default BookDetail;
