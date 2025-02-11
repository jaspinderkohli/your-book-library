import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { BookOpenIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const AuthComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setError("");

    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    if (result.error) setError(result.error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <div className="w-full max-w-sm p-6 bg-white shadow-xl rounded-lg space-y-6 text-center">
        
        {/* Logo / Branding */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center">
            <BookOpenIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-3">
            {isSignUp ? "Join the Book Lovers" : "Welcome Back, Reader!"}
          </h2>
          <p className="text-gray-500 text-sm">
            {isSignUp ? "Sign up to track and scan your books." : "Log in to access your library."}
          </p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Email Input */}
        <div className="relative">
          <input
            type="email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-600" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Auth Button */}
        <button
          className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition font-bold"
          onClick={handleAuth}
          disabled={loading}
        >
          {loading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
        </button>

        {/* Toggle between Login & Signup */}
        <p className="text-gray-600 text-sm">
          {isSignUp ? "Already have an account?" : "New here?"}{" "}
          <span
            className="text-yellow-700 font-semibold cursor-pointer"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </span>
        </p>

        {/* Forgot Password */}
        {!isSignUp && (
          <p className="text-sm text-gray-500">
            <span className="cursor-pointer hover:underline">Forgot Password?</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthComponent;
