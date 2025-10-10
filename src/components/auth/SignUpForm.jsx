import { FaLock, FaUser } from "react-icons/fa";
import './LoginForm.css';

const LoginForm = ({onSwitchToLogin}) => {
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