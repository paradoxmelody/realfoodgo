import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';


function SignupLogin(){
  const [action, setAction] = useState("Login");
  return(
    <div className='app' style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {action === "Login" ? <LoginForm onSwitchToSignup={() => setAction("SignUp")}/> : <SignUpForm onSwitchToLogin={() => setAction("Login")}/>}
      {/*<div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        {action === "Login" ? <LoginForm onSwitchToSignup={() => setAction("SignUp")}/> : <SignUpForm onSwitchToLogin={() => setAction("Login")}/>}
      </div>*/}
    </div>
  );
}
 

export default SignupLogin;
/*function SignupLogin() {

  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="App">

      <div className="auth-container">
        <div className="auth-toggle">
          <button 
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}>
            Sign Up
          </button>
        </div>
        <div className="switch-auth">
          {isLogin ? (
            <p>
              Don't have an account? {''}
              <button onClick={() => setIsLogin(false)}>Sign Up</button>
            </p>
          ) : (
            <p>
              Already have an account? {''}
              <button onClick={() => setIsLogin(true)}>Login</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignupLogin;*/
