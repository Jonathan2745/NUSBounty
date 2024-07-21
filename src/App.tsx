
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify } from 'aws-amplify';
import outputs from "../amplify_outputs.json"

Amplify.configure(outputs);

import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/Login.tsx";
import { HomePage } from "../pages/Home.tsx";
import { Secret } from "../pages/Secret.tsx";
import { ProfilePage } from "../pages/Profile.tsx";
import { JobPage } from "../pages/JobsListing.tsx";
import { NewJobPage } from "../pages/NewJob.tsx";
import { MyJobsPage } from "../pages/MyJobs.tsx";
import { JobDetailsPage } from "../pages/JobDetails.tsx"

import "./App.css";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./hooks/useAuth.js";




function App() {
  return ( 
  <Authenticator.Provider>
    <AuthProvider>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<ProtectedRoute> <HomePage /> </ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute> <ProfilePage /></ProtectedRoute>} />
      <Route path="/secret" element ={<ProtectedRoute> <Secret/> </ProtectedRoute>}/>
      <Route path="/jobs" element ={<ProtectedRoute> <JobPage/> </ProtectedRoute>}/>
      <Route path="/newjob" element ={<ProtectedRoute> <NewJobPage/> </ProtectedRoute>}/>
      <Route path="/jobs/:jobId" element ={<ProtectedRoute> <JobDetailsPage/> </ProtectedRoute>}/>
      <Route path="/myjobs" element ={<ProtectedRoute> <MyJobsPage/> </ProtectedRoute>}/>
  

    </Routes>
    </AuthProvider>
  </Authenticator.Provider>

  );
}

export default App;
