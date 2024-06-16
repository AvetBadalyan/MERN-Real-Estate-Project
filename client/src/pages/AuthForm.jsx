/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signUpStart,
  signInSuccess,
  signUpSuccess,
  signInFailure,
  signUpFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const initialFormData = {
  username: "",
  email: "",
  password: "",
};

const AuthForm = ({ isSignUp }) => {
  const [formData, setFormData] = useState(initialFormData);
  const { error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/signin";
    dispatch(isSignUp ? signUpStart() : signInStart());

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(
          isSignUp ? signUpFailure(data.message) : signInFailure(data.message)
        );
        return;
      }

      dispatch(isSignUp ? signUpSuccess(data) : signInSuccess(data));
      setFormData(initialFormData); // Reset form data after success
      navigate("/");
    } catch (error) {
      dispatch(
        isSignUp ? signUpFailure(error.message) : signInFailure(error.message)
      );
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        {isSignUp ? "Sign Up" : "Sign In"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isSignUp && (
          <input
            type="text"
            placeholder="Username"
            className="border p-3 rounded-lg"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
        </p>
        <Link to={isSignUp ? "/sign-in" : "/sign-up"} className="text-blue-700">
          {isSignUp ? "Sign in" : "Sign up"}
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default AuthForm;
