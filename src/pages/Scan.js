import React, { useState, useRef } from "react";
import Quagga from "quagga";
import { supabase } from "../utils/supabaseClient";
import { CameraIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

const Scan = () => {
  const [image, setImage] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // ✅ Handle Image Upload and Barcode Extraction
  const handleImageUpload = async (event) => {
    setLoading(true);
    setError("");
    setBarcode("");
    setBookData(null);

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      setImage(reader.result);
      extractBarcodeFromImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ✅ Extract Barcode from Image using QuaggaJS
  const extractBarcodeFromImage = (imageSrc) => {
    Quagga.decodeSingle(
      {
        src: imageSrc,
        numOfWorkers: 0,
        inputStream: { size: 800 },
        decoder: { readers: ["ean_reader"] },
      },
      async (result) => {
        if (result && result.codeResult) {
          setBarcode(result.codeResult.code);
          fetchBookDetails(result.codeResult.code);
        } else {
          setError("No barcode detected. Try another image.");
        }
        setLoading(false);
      }
    );
  };

  // ✅ Fetch Book Details using ISBN
  const fetchBookDetails = async (isbn) => {
    if (!isbn) {
      setError("Invalid ISBN detected.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
      );
      const data = await response.json();

      if (!data[`ISBN:${isbn}`]) {
        setError("Book not found in database.");
        setLoading(false);
        return;
      }

      const bookInfo = data[`ISBN:${isbn}`];
      const newBook = {
        title: bookInfo.title || "Unknown Title",
        author: bookInfo.authors?.map((a) => a.name).join(", ") || "Unknown Author",
        isbn,
        cover_url: bookInfo.cover?.medium || "",
      };

      setBookData(newBook);
      await saveBookToSupabase(newBook);
    } catch (error) {
      setError("Failed to retrieve book details.");
    }
    setLoading(false);
  };

  // ✅ Save Book to Supabase
  const saveBookToSupabase = async (book) => {
    // ✅ Get the currently logged-in user
    const { data: user, error: userError } = await supabase.auth.getUser();
  
    if (userError || !user?.user) {
      console.error("❌ No user logged in:", userError);
      setError("You must be logged in to save books.");
      return;
    }
  
    // ✅ Check if the book already exists for this user
    const { data: existingBooks, error: fetchError } = await supabase
      .from("books")
      .select("id")
      .eq("user_id", user.user.id)
      .eq("isbn", book.isbn);
  
    if (fetchError) {
      console.error("❌ Error checking for existing book:", fetchError);
      setError("Error checking book availability.");
      return;
    }
  
    if (existingBooks.length > 0) {
      alert("📚 Book already exists in your library!");
      return;
    }
  
    console.log("💾 Saving book to database:", book);
  
    const { error } = await supabase.from("books").insert([
      {
        user_id: user.user.id, // ✅ Correct way to get user ID
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        image_url: book.cover_url,
        created_at: new Date().toISOString(),
        status: "not_started",
      },
    ]);
  
    if (error) {
      console.error("❌ Error inserting book:", error);
      setError("Error saving book to database.");
    } else {
      console.log("✅ Book saved successfully!");
      alert("✅ Book added successfully!");
      setBookData(null);
      setBarcode("");
      setImage(null);
    }
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      {/* 📖 Title */}
      <h2 className="text-3xl font-bold text-gray-900">Scan a Book</h2>
      <p className="text-gray-500 text-sm mt-1">Capture a barcode to add a book to your library</p>

      {/* 📸 Upload Image */}
      <div className="relative mt-6">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />

        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 hover:bg-blue-700 transition"
        >
          <CameraIcon className="h-5 w-5 text-white" />
          <span>Upload Book Cover</span>
        </button>
      </div>

      {/* 📷 Display Uploaded Image */}
      {image && (
        <div className="mt-4">
          <img src={image} alt="Scanned Book" className="w-44 h-44 object-cover rounded-lg shadow-md" />
        </div>
      )}

      {/* 🔄 Processing State */}
      {loading && (
        <p className="mt-4 text-blue-500 flex items-center">
          <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" /> Processing image...
        </p>
      )}

      {/* ❌ Error State */}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* ✅ Show Extracted Book Details */}
      {bookData && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <img src={bookData.cover_url} alt={bookData.title} className="w-full h-48 object-cover rounded-md" />
          <h3 className="text-xl font-semibold mt-4 text-gray-800">{bookData.title}</h3>
          <p className="text-gray-600 text-sm">by {bookData.author}</p>
          <p className="text-sm text-gray-500 mt-2">ISBN: {bookData.isbn}</p>
        </div>
      )}
    </div>
  );
};

export default Scan;
