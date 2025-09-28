import './Navbar.css';
const Navbar = () => {
  return (
     <header className="header">
        <a href="/" className="logo">Logo</a>
        <nav className="navbar">
            <a href="/">Home</a>
            <a href="/">About</a>
            <a href="/">Restaurants</a>
            <a href="/">Sign Up/Login</a>
        </nav>
        

     </header>
  )
}

export default Navbar
