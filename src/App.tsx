import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import "./App.css";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./hooks/useAuth.js";

// Lazy import the pages
const LoginPage = lazy(() => import("../pages/Login.tsx"));
const HomePage = lazy(() => import("../pages/Home.tsx"));
const Wallet = lazy(() => import("../pages/Wallet.tsx"));
const Secret = lazy(() => import("../pages/Secret.tsx"));
const ProfilePage = lazy(() => import("../pages/Profile.tsx"));
const JobPage = lazy(() => import("../pages/JobsListing.tsx"));
const NewJobPage = lazy(() => import("../pages/NewJob.tsx"));
const MyJobsPage = lazy(() => import("../pages/MyJobs.tsx"));
const JobDetailsPage = lazy(() => import("../pages/JobDetails.tsx"));

function App() {
  return (
    <Authenticator.Provider>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/secret"
              element={
                <ProtectedRoute>
                  <Secret />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <JobPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/newjob"
              element={
                <ProtectedRoute>
                  <NewJobPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:jobId"
              element={
                <ProtectedRoute>
                  <JobDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/myjobs"
              element={
                <ProtectedRoute>
                  <MyJobsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Authenticator.Provider>
  );
}

export default App;
