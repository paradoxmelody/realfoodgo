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
    </div>
  );
}
 

export default SignupLogin;
 