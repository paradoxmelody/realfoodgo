import { FaLock, FaUser } from "react-icons/fa";
import './LoginForm.css';

const LoginForm = () => {
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
                <p>Don't have an account? <a href="#">Sign Up</a></p>
            </div>

        </form>
        
    </div>
  );
};

export default LoginForm;
