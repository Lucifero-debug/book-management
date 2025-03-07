"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [user, setUser] = React.useState({
    username: "",
    password: "",
})

  const handleLogin = async(e) => {
    e.preventDefault();
    
    const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      localStorage.setItem("token", response.data.token);
      router.push("/");
};

const handleSignup=(e)=>{
  e.preventDefault();
  router.push('/signup')
}


const handleForgotPassword = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/users/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    alert(data.message);
    setShowForgotPassword(false);
  } catch (error) {
    console.error("Error sending reset email", error);
    alert("Failed to send reset link. Try again.");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="font-inria text-center text-3xl text-gray-800">
          <span className="text-blue-600">HOME</span> LIBRARY
        </h1>
        <h2 className="font-inria text-center text-xl font-semibold text-gray-700 mt-2">
          ADMIN
        </h2>
        <form onSubmit={handleLogin} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              onChange={(e) => setUser({...user, username: e.target.value})}
              autoComplete="off"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              autoComplete="off"
              onChange={(e) => setUser({...user, password: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Login
          </button>
          <button onClick={(e)=>handleSignup(e)}>Signup</button>
          <p
            className="text-center text-blue-600 text-sm mt-4 cursor-pointer hover:underline"
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot Password?
          </p>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">
          Powered By <span className="text-blue-600">@PankajDev</span>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold text-gray-800 text-center">Reset Password</h2>
            <p className="text-gray-600 text-sm text-center mt-2">
              Enter your email to receive a reset link.
            </p>
            <form onSubmit={handleForgotPassword} className="mt-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                Send Reset Link
              </button>
              <button
                type="button"
                className="w-full mt-2 text-gray-600 hover:underline text-sm"
                onClick={() => setShowForgotPassword(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}