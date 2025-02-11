import React, { useState, useEffect } from "react";
import { supabase } from "./utils/supabaseClient";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthComponent from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Profile from "./pages/Profile";
import ScanBook from "./pages/Scan";
import Library from "./pages/Library";
import BookDetail from "./pages/BookDetail";
import Layout from "./components/Layout";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={session ? <Navigate to="/dashboard" /> : <AuthComponent />} />
        <Route path="/dashboard" element={session ? <Layout><Dashboard session={session} /></Layout> : <Navigate to="/" />} />
        <Route path="/profile" element={session ? <Layout><Profile session={session} /></Layout> : <Navigate to="/" />} />
        <Route path="/scan" element={session ? <Layout><ScanBook session={session} /></Layout> : <Navigate to="/" />} />
        <Route path="/library" element={session ? <Layout><Library session={session} /></Layout> : <Navigate to="/" />} />
        <Route path="/book/:id" element={session ? <Layout><BookDetail session={session} /></Layout> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
