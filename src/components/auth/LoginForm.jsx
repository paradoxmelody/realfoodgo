/*import { FaLock, FaUser } from "react-icons/fa";
import './LoginForm.css';
 

const LoginForm = ({onSwitchToSignup}) => {
  return (
    <div className="wrapper">
        <form action="">
            <h1>FoodGo</h1>
            <div className="input-box">
                <input type="text" 
                placeholder="Username" required/>
                <FaUser className="icon" />
            </div>
            <div className="input-box">
                <input type="password" 
                placeholder="Password" required/>
                <FaLock className="icon" />
            </div>

            <div className="remember-forgot">
                <label><input type="checkbox"/>Remember me</label>
                <a href="#">Forgot Password?</a>
            </div>

            <button type="submit" className="btn">Login</button>
            <div className="register-link">
                <p>Don't have an account? <a href="#" onClick={(e) => {
                    e.preventDefault();
                    onSwitchToSignup();
                }}>Sign Up</a></p>
            </div>
        </form>
    </div>
  );
};

export default LoginForm;
*/

import { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../firebase_data/auth"; // ✅ make sure path is correct
import "./LoginForm.css";

const LoginForm = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await loginUser(email, password);
    setLoading(false);

    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage(result.message);
      // You can redirect user after login here, e.g.:
      navigate("/");
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>FoodGo</h1>

        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>

        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot Password?</a>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p className="message">{message}</p>}

        <div className="register-link">
          <p>
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToSignup();
              }}
            >
              Sign Up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
