import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [parentCompany, setParentCompany] = useState("");

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login form submitted");
  };

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-5 md:px-20 font-montserrat">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-black text-black tracking-widest">
          Sign In
        </h2>
        <p className="text-lg md:text-xl text-gray-600">
          Please Login To Continue
        </p>

        <form onSubmit={handleLogin} className="space-y-8 mt-8">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-xl md:text-2xl px-10 py-3 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-xl md:text-2xl px-10 py-3 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Parent Company with Chevron */}
          <div className="relative">
            <select
              value={parentCompany}
              onChange={(e) => setParentCompany(e.target.value)}
              className="w-full text-xl md:text-2xl px-10 py-3 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition appearance-none bg-white pr-12 placeholder:text-gray-400"
            >
              <option value="" disabled hidden>
                Select Parent Company
              </option>
              <option value="Ambani">Ambani</option>
              <option value="Adani">Adani</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
              size={28}
            />
          </div>

          {/* Not Registered? Link */}
          <div className="flex justify-end items-center gap-2 text-lg md:text-xl">
            <p className="m-0">Not Registered?</p>
            <Link
              to="/register"
              className="text-purple-800 font-medium no-underline hover:text-purple-900 transition"
            >
              Register Now
            </Link>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-10 py-3 text-white font-bold text-xl md:text-2xl rounded-lg bg-gradient-to-r from-purple-500 to-purple-800 hover:from-purple-600 hover:to-purple-900 transition shadow-md"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
