// RegistrationForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../App";

const API_URL =
  "https://considerate-alignment-production-2d97.up.railway.app";

const RegistrationForm = () => {
  const { setUser } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          gender,
          password,
        }),
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server returned:\n${text.substring(0, 200)}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Registration failed."
        );
      }

      if (data.success) {
        localStorage.setItem("trainer", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        setUser(data.user);

        navigate("/ground");
      } else {
        setErrorMsg(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-[#80e9a6]">Your Name:</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-[#15803d] mt-1 p-2 border rounded w-full text-white placeholder:text-[#80e9a6] border-[#80e9a6]"
        />
      </div>

      <div>
        <label className="text-[#80e9a6]">Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-[#15803d] mt-1 p-2 border rounded w-full text-white placeholder:text-[#80e9a6] border-[#80e9a6]"
        />
      </div>

      <div>
        <label className="text-[#80e9a6]">Gender:</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className="bg-[#15803d] mt-1 p-2 border rounded w-full text-white border-[#80e9a6]"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="text-[#80e9a6]">Password:</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-[#15803d] mt-1 p-2 border rounded w-full text-white placeholder:text-[#80e9a6] border-[#80e9a6]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {errorMsg && (
        <div className="mt-4 p-3 rounded bg-red-100 text-red-700 whitespace-pre-wrap">
          {errorMsg}
        </div>
      )}
    </form>
  );
};

export default RegistrationForm;