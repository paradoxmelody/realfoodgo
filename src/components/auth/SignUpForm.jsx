/* = ({onSwitchToLogin}) => {
  return (
    <div className="wrapper">
        <form action="">
            <h1><img src='./foodgo.png'/></h1>
            <div className="input-box">
                <input type="text" 
                placeholder="email" required/>
                <FaUser className="icon" />
            </div>
            <div className="input-box">
                <input type="password" 
                placeholder="Create Password" required/>
                <FaUser className="icon" />
            </div>
            <div className="input-box">
                <input type="password" 
                placeholder="Enter Password" required/>
                <FaLock className="icon" />
            </div>

            <button type="submit" className="btn">Sign Up</button>
            <div className="register-link">
                <p>Already have an account? <a href="#" onClick={(e) => {
                    e.preventDefault();
                    onSwitchToLogin();
                }}>Login</a></p>
            </div>
        </form>   
    </div>
  );
};

export default LoginForm;
*/

import { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { signUpUser } from "../../firebase_data/auth"; //  make sure path is correct
import "./LoginForm.css";

const SignUpForm = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const result = await signUpUser(email, password);
      if (result.error) {
        setMessage("❌ " + result.error);
      } else {
        setMessage("✅ " + result.message);
      }
    } catch (err) {
      setMessage("❌ " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSignUp}>
        {/* Placeholder instead of image */}
        <h1>🍔 FoodGo — Sign Up</h1>

        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FaUser className="icon" />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {message && <p style={{ marginTop: "10px", color: "white" }}>{message}</p>}

        <div className="register-link">
          <p>
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToLogin();
              }}
            >
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
