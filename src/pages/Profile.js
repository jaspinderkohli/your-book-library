import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { ArrowLeftIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

// 🎭 Emoji Avatars List 📚🔥
const emojiAvatars = ["📚", "📖", "📕", "📗", "📘", "📙", "📓", "📔", "📒", "📑", "📜", "📃", "📄"];

const Profile = ({ session }) => {
  const [profile, setProfile] = useState({
    username: "Book Lover",
    avatar: "📚",
    favorite_genre: "Unknown",
    bio: "Reading is dreaming with open eyes.",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Fetch Profile Data from Supabase
  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error);
    } else if (data) {
      setProfile(data);
    }
  };

  // ✅ Insert or Update Profile Correctly
  const updateProfile = async () => {
    setLoading(true);

    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching profile before update:", fetchError);
      setLoading(false);
      return;
    }

    let error;
    if (existingProfile) {
      // ✅ Update existing profile
      ({ error } = await supabase
        .from("profiles")
        .update(profile)
        .eq("id", session.user.id));
    } else {
      // ✅ Insert new profile if none exists
      ({ error } = await supabase
        .from("profiles")
        .insert([{ id: session.user.id, ...profile }]));
    }

    if (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } else {
      alert("Profile updated successfully!");
    }

    setLoading(false);
  };

  // ✅ Logout Function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 left-4 bg-white shadow-md p-2 rounded-full"
      >
        <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
      </button>

      {/* 🚀 Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white shadow-md p-2 rounded-full hover:bg-red-600 transition"
      >
        <ArrowRightOnRectangleIcon className="h-6 w-6" />
      </button>

      {/* 📚 Avatar Selection */}
      <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg text-5xl">
        {profile.avatar}
      </div>

      {/* 🎭 Choose Avatar (Horizontally Scrollable) */}
      <div className="mt-3 flex space-x-2 w-full max-w-sm overflow-x-auto whitespace-nowrap p-2">
        {emojiAvatars.map((emoji) => (
          <button
            key={emoji}
            onClick={() => setProfile((prev) => ({ ...prev, avatar: emoji }))}
            className={`text-2xl px-3 py-2 rounded-full transition ${
              profile.avatar === emoji ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* 📖 Profile Info */}
      <div className="mt-6 w-full max-w-lg bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Profile Details</h3>

        <div className="mt-4">
          <label className="block text-gray-600 text-sm">Username:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            value={profile.username}
            onChange={(e) => setProfile((prev) => ({ ...prev, username: e.target.value }))}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-600 text-sm">Favorite Genre:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            value={profile.favorite_genre}
            onChange={(e) => setProfile((prev) => ({ ...prev, favorite_genre: e.target.value }))}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-600 text-sm">Bio:</label>
          <textarea
            className="w-full p-2 border rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            value={profile.bio}
            onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
          />
        </div>

        <button
          className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition font-bold"
          onClick={updateProfile}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>

      {/* 📊 Reading Stats (Refined UI) */}
      <div className="mt-6 w-full max-w-lg bg-white p-5 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">📊 Reading Stats</h3>
        <div className="mt-4 flex justify-between text-gray-600 text-sm">
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold text-blue-500">📘 12</p>
            <p>Books Read</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold text-yellow-500">📖 5</p>
            <p>In Progress</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold text-gray-400">📚 20</p>
            <p>Wishlist</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
