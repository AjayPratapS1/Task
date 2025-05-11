import { EyeOff, Lock, LogIn, Mail, Eye } from "lucide-react";
import React, { use, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { BUTTON_CLASSES, INPUTWRAPPER } from "../assets/dummy";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const INITIAL_FORM = {
  email: "",
  password: "",
};
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const Login = ({ onSubmit, onSwitchMode }) => {
  const [loading, setLoading] = useState(false);
  const [showpassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const navigate = useNavigate();
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token) {
      (async () => {
        try {
          const { data } = await axios.get(`${API_BASE}/user/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (data.success) {
            onSubmit?.({ token, userId, ...data.user });
            toast.success("Session restored");
            navigate("/", { replace: true });
          } else {
            localStorage.clear();
          }
        } catch {
          localStorage.clear();
        }
      })();
    }
  }, [navigate, onSubmit]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rememberMe) {
      toast.error('You must enable "Remember Me" to login.');
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/user/login`, formData);
      if (!data.token) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      setFormData(INITIAL_FORM);
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user });
      toast.success("Login successful");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  const handleSwitchMode = () => {
    toast.dismiss();
    onSwitchMode();
  };
  const fields = [
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      icon: Mail,
    },
    {
      name: "password",
      type: showpassword ? "text" : "password",
      placeholder: "Password",
      icon: Lock,
      isPassword: true,
    },
  ];
  return (
    <div className="max-w-md bg-white shadow-lg border border-purple-100 rounded-xl p-8">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <div className="mb-6 text-center">
        <div
          className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full
            mx-auto flex items-center justify-center mb-4"
        >
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500">Sign in to continue to Task</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          <div key={name} className={INPUTWRAPPER}>
            <Icon className="text-purple-500 w-5 h-5 mr-2" />
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) =>
                setFormData({ ...formData, [name]: e.target.value })
              }
              className="w-full focus:outline-none text-sm  text-gray-700"
              required
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 text-gray-500 hover:text-purple-500 transition-colors"
              >
                {showpassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        ))}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-400"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 block text-sm text-gray-600"
          >
            Remember Me
          </label>
        </div>
        <button type="submit" className={BUTTON_CLASSES} disabled={loading}>
          {loading ? (
            "Logging..."
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Login
            </>
          )}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <button
          type="button"
          className="text-purple-600 hover:text-purple-700 hover:underline
            font-medium transition-colors "
          onClick={handleSwitchMode}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
