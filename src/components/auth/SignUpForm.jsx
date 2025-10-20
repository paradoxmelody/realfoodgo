import { useState } from "react";
import { FaLock, FaUser, FaPhone, FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginForm.css";

const SignUpForm = ({ onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [countryCode, setCountryCode] = useState("+27"); // Default to South Africa
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const navigate = useNavigate();
  const { signup } = useAuth();

  // Popular country codes with flag emojis
  const countryCodes = [
    { code: "+27", country: "ZA", name: "South Africa", flag: "🇿🇦" },
    { code: "+1", country: "US", name: "United States", flag: "🇺🇸" },
    { code: "+44", country: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "+91", country: "IN", name: "India", flag: "🇮🇳" },
    { code: "+86", country: "CN", name: "China", flag: "🇨🇳" },
    { code: "+234", country: "NG", name: "Nigeria", flag: "🇳🇬" },
    { code: "+254", country: "KE", name: "Kenya", flag: "🇰🇪" },
    { code: "+263", country: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
    { code: "+267", country: "BW", name: "Botswana", flag: "🇧🇼" },
    { code: "+264", country: "NA", name: "Namibia", flag: "🇳🇦" },
    { code: "+61", country: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "+81", country: "JP", name: "Japan", flag: "🇯🇵" },
    { code: "+82", country: "KR", name: "South Korea", flag: "🇰🇷" },
    { code: "+33", country: "FR", name: "France", flag: "🇫🇷" },
    { code: "+49", country: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "+39", country: "IT", name: "Italy", flag: "🇮🇹" },
    { code: "+34", country: "ES", name: "Spain", flag: "🇪🇸" },
    { code: "+351", country: "PT", name: "Portugal", flag: "🇵🇹" },
    { code: "+55", country: "BR", name: "Brazil", flag: "🇧🇷" },
    { code: "+52", country: "MX", name: "Mexico", flag: "🇲🇽" },
    { code: "+971", country: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
    { code: "+966", country: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+65", country: "SG", name: "Singapore", flag: "🇸🇬" },
    { code: "+60", country: "MY", name: "Malaysia", flag: "🇲🇾" },
    { code: "+63", country: "PH", name: "Philippines", flag: "🇵🇭" },
    { code: "+1-242", country: "BS", name: "Bahamas", flag: "🇧🇸" },
    { code: "+1-246", country: "BB", name: "Barbados", flag: "🇧🇧" },
    { code: "+1-441", country: "BM", name: "Bermuda", flag: "🇧🇲" },
    { code: "+1-876", country: "JM", name: "Jamaica", flag: "🇯🇲" },
    { code: "+1-684", country: "AS", name: "American Samoa", flag: "🇦🇸" },
    { code: "+687", country: "NC", name: "New Caledonia", flag: "🇳🇨" },
    { code: "+689", country: "PF", name: "French Polynesia", flag: "🇵🇫" },
    { code: "+20", country: "EG", name: "Egypt", flag: "🇪🇬" },
    { code: "+212", country: "MA", name: "Morocco", flag: "🇲🇦" },
    { code: "+216", country: "TN", name: "Tunisia", flag: "🇹🇳" },
    { code: "+228", country: "TG", name: "Togo", flag: "🇹🇬" },
    { code: "+229", country: "BJ", name: "Benin", flag: "🇧🇯" },
    { code: "+230", country: "MU", name: "Mauritius", flag: "🇲🇺" },
    { code: "+231", country: "LR", name: "Liberia", flag: "🇱🇷" },
    { code: "+232", country: "SL", name: "Sierra Leone", flag: "🇸🇱" },
    { code: "+233", country: "GH", name: "Ghana", flag: "🇬🇭" },
    { code: "+235", country: "TD", name: "Chad", flag: "🇹🇩" },
    { code: "+236", country: "CF", name: "Central African Republic", flag: "🇨🇫" },
    { code: "+237", country: "CM", name: "Cameroon", flag: "🇨🇲" },
    { code: "+238", country: "CV", name: "Cape Verde", flag: "🇨🇻" },
    { code: "+239", country: "ST", name: "São Tomé and Príncipe", flag: "🇸🇹" },
    { code: "+240", country: "GQ", name: "Equatorial Guinea", flag: "🇬🇶" },
    { code: "+241", country: "GA", name: "Gabon", flag: "🇬🇦" },
    { code: "+242", country: "CG", name: "Republic of the Congo", flag: "🇨🇬" },
    { code: "+243", country: "CD", name: "Democratic Republic of the Congo", flag: "🇨🇩" },
    { code: "+244", country: "AO", name: "Angola", flag: "🇦🇴" },
    { code: "+245", country: "GW", name: "Guinea-Bissau", flag: "🇬🇼" },
    { code: "+246", country: "IO", name: "British Indian Ocean Territory", flag: "🇮🇴" },
    { code: "+248", country: "SC", name: "Seychelles", flag: "🇸🇨" },
    { code: "+249", country: "SD", name: "Sudan", flag: "🇸🇩" },
    { code: "+250", country: "RW", name: "Rwanda", flag: "🇷🇼" },
    { code: "+251", country: "ET", name: "Ethiopia", flag: "🇪🇹" },
    { code: "+252", country: "SO", name: "Somalia", flag: "🇸🇴" },
    { code: "+253", country: "DJ", name: "Djibouti", flag: "🇩🇯" },
    { code: "+256", country: "UG", name: "Uganda", flag: "🇺🇬" },
    { code: "+257", country: "BI", name: "Burundi", flag: "🇧🇮" },
    { code: "+258", country: "MZ", name: "Mozambique", flag: "🇲🇿" },
    { code: "+260", country: "ZM", name: "Zambia", flag: "🇿🇲" },
    { code: "+261", country: "MG", name: "Madagascar", flag: "🇲🇬" },
    { code: "+262", country: "RE", name: "Réunion", flag: "🇷🇪" },
    { code: "+265", country: "MW", name: "Malawi", flag: "🇲🇼" },
    { code: "+268", country: "SZ", name: "Eswatini", flag: "🇸🇿" },
    { code: "+290", country: "SH", name: "Saint Helena", flag: "🇸🇭" },
    { code: "+291", country: "ER", name: "Eritrea", flag: "🇪🇷" },
    { code: "+376", country: "AD", name: "Andorra", flag: "🇦🇩" },
    { code: "+377", country: "MC", name: "Monaco", flag: "🇲🇨" },
    { code: "+378", country: "SM", name: "San Marino", flag: "🇸🇲" },
    { code: "+380", country: "UA", name: "Ukraine", flag: "🇺🇦" },
    { code: "+381", country: "RS", name: "Serbia", flag: "🇷🇸" },
    { code: "+382", country: "ME", name: "Montenegro", flag: "🇲🇪" },
    { code: "+385", country: "HR", name: "Croatia", flag: "🇭🇷" },
    { code: "+386", country: "SI", name: "Slovenia", flag: "🇸🇮" },
    { code: "+387", country: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
    { code: "+389", country: "MK", name: "North Macedonia", flag: "🇲🇰" },
    { code: "+40", country: "RO", name: "Romania", flag: "🇷🇴" },
    { code: "+41", country: "CH", name: "Switzerland", flag: "🇨🇭" },
    { code: "+43", country: "AT", name: "Austria", flag: "🇦🇹" },
    { code: "+45", country: "DK", name: "Denmark", flag: "🇩🇰" },
    { code: "+46", country: "SE", name: "Sweden", flag: "🇸🇪" },
    { code: "+47", country: "NO", name: "Norway", flag: "🇳🇴" },
    { code: "+48", country: "PL", name: "Poland", flag: "🇵🇱" },
    { code: "+49", country: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "+31", country: "NL", name: "Netherlands", flag: "🇳🇱" },
    { code: "+32", country: "BE", name: "Belgium", flag: "🇧🇪" },
    { code: "+353", country: "IE", name: "Ireland", flag: "🇮🇪" },
    { code: "+354", country: "IS", name: "Iceland", flag: "🇮🇸" },
    { code: "+355", country: "AL", name: "Albania", flag: "🇦🇱" },
    { code: "+356", country: "MT", name: "Malta", flag: "🇲🇹" },
    { code: "+357", country: "CY", name: "Cyprus", flag: "🇨🇾" },
    { code: "+358", country: "FI", name: "Finland", flag: "🇫🇮" },
    { code: "+359", country: "BG", name: "Bulgaria", flag: "🇧🇬" },
    { code: "+30", country: "GR", name: "Greece", flag: "🇬🇷" },
    { code: "+36", country: "HU", name: "Hungary", flag: "🇭🇺" },
    { code: "+420", country: "CZ", name: "Czech Republic", flag: "🇨🇿" },
    { code: "+421", country: "SK", name: "Slovakia", flag: "🇸🇰" },
    { code: "+370", country: "LT", name: "Lithuania", flag: "🇱🇹" },
    { code: "+371", country: "LV", name: "Latvia", flag: "🇱🇻" },
    { code: "+372", country: "EE", name: "Estonia", flag: "🇪🇪" },
    { code: "+7", country: "RU", name: "Russia", flag: "🇷🇺" },
    { code: "+90", country: "TR", name: "Turkey", flag: "🇹🇷" },
    { code: "+92", country: "PK", name: "Pakistan", flag: "🇵🇰" },
    { code: "+93", country: "AF", name: "Afghanistan", flag: "🇦🇫" },
    { code: "+94", country: "LK", name: "Sri Lanka", flag: "🇱🇰" },
    { code: "+95", country: "MM", name: "Myanmar", flag: "🇲🇲" },
    { code: "+98", country: "IR", name: "Iran", flag: "🇮🇷" },
    { code: "+880", country: "BD", name: "Bangladesh", flag: "🇧🇩" },
    { code: "+886", country: "TW", name: "Taiwan", flag: "🇹🇼" },
    { code: "+66", country: "TH", name: "Thailand", flag: "🇹🇭" },
    { code: "+84", country: "VN", name: "Vietnam", flag: "🇻🇳" },
    { code: "+64", country: "NZ", name: "New Zealand", flag: "🇳🇿" },
    { code: "+974", country: "QA", name: "Qatar", flag: "🇶🇦" },
    { code: "+973", country: "BH", name: "Bahrain", flag: "🇧🇭" },
    { code: "+968", country: "OM", name: "Oman", flag: "🇴🇲" },
  ];

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validation
    if (!name.trim() || !surname.trim()) {
      setMessage("Please enter your name and surname");
      return;
    }

    if (!phone.trim()) {
      setMessage("Please enter your phone number");
      return;
    }

    // Validate phone number (should be digits only, 9-10 digits)
    if (!/^\d{9,10}$/.test(phone.trim())) {
      setMessage("Please enter a valid phone number (9-10 digits)");
      return;
    }

    // Check if email ends with @myuwc.ac.za
    if (!email.toLowerCase().endsWith('@myuwc.ac.za')) {
      setMessage("Only @myuwc.ac.za email addresses are allowed");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setMessage("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setMessage("Password must contain at least one lowercase letter");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setMessage("Password must contain at least one number");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setMessage("Password must contain at least one special character (!@#$%^&*...)");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const fullName = `${name.trim()} ${surname.trim()}`;
      const fullPhone = `${countryCode}${phone.trim()}`;
      await signup(email, password, fullName, fullPhone);
      setMessage("Account created successfully!");

      // Redirect to vendor page after successful signup
      setTimeout(() => navigate("/vendor"), 1000);
    } catch (err) {
      console.error("Signup error:", err);

      // Handle specific Firebase error codes
      if (err.code === 'auth/email-already-in-use') {
        setMessage("This email is already registered");
      } else if (err.code === 'auth/invalid-email') {
        setMessage("Invalid email address");
      } else if (err.code === 'auth/weak-password') {
        setMessage("Password is too weak");
      } else {
        setMessage(err.message || "Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "linear-gradient(135deg, #16a34a 0%, #ff9800 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button
        type="button"
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: "30px",
          left: "30px",
          background: "#fff",
          border: "none",
          color: "#16a34a",
          padding: "12px 24px",
          borderRadius: "25px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "15px",
          fontWeight: 600,
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f0f0f0";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        }}
      >
        <FaHome /> Back to Home
      </button>

      <div className="wrapper" style={{ maxWidth: "500px", width: "100%", padding: "20px", backdropFilter: "none" }}>
        <form onSubmit={handleSignUp} style={{
          background: "#fff",
          padding: "50px 40px",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          border: "none",
          backdropFilter: "none"
        }}>
          <div style={{ marginBottom: "40px", textAlign: "center" }}>
            <h1 style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#16a34a",
              marginBottom: "8px",
              letterSpacing: "0.5px"
            }}>
              🍕 FoodGo
            </h1>
            <p style={{ color: "#666", fontSize: "14px", fontWeight: 500 }}>Create your account</p>
          </div>

          <div className="input-box" style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                paddingLeft: "45px",
                border: "2px solid #e5e5e5",
                borderRadius: "12px",
                fontSize: "15px",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                outline: "none",
                color: "#333",
                backgroundColor: "#fff"
              }}
              onFocus={(e) => e.target.style.borderColor = "#16a34a"}
              onBlur={(e) => e.target.style.borderColor = "#e5e5e5"}
            />
            <FaUser style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#16a34a",
              fontSize: "16px"
            }} />
            <style>{`
              input::placeholder {
                color: #999 !important;
              }
            `}</style>
          </div>

          <div className="input-box" style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                paddingLeft: "45px",
                border: "2px solid #e5e5e5",
                borderRadius: "12px",
                fontSize: "15px",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                outline: "none",
                color: "#333",
                backgroundColor: "#fff"
              }}
              onFocus={(e) => e.target.style.borderColor = "#16a34a"}
              onBlur={(e) => e.target.style.borderColor = "#e5e5e5"}
            />
            <FaUser style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#16a34a",
              fontSize: "16px"
            }} />
          </div>

          <div className="input-box" style={{ marginBottom: "20px", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
            <div style={{ position: "relative", width: "35%" }}>
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                style={{
                  width: "100%",
                  padding: "14px 12px",
                  border: "2px solid #e5e5e5",
                  borderRadius: "12px",
                  outline: "none",
                  fontSize: "16px",
                  color: "#333",
                  background: "#fff",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#16a34a"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e5e5e5"}
              >
                <img
                  src={`https://flagcdn.com/${countryCodes.find(c => c.code === countryCode)?.country.toLowerCase()}.svg`}
                  alt="flag"
                  style={{ width: "24px", height: "16px", borderRadius: "2px" }}
                />
                <span style={{ fontSize: "14px" }}>{countryCode}</span>
              </button>
              {showCountryDropdown && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "2px solid #16a34a",
                  borderRadius: "12px",
                  maxHeight: "280px",
                  overflowY: "auto",
                  zIndex: 10,
                  marginTop: "8px",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                  minWidth: "300px"
                }}>
                  <div style={{
                    position: "sticky",
                    top: 0,
                    background: "#fff",
                    padding: "8px 12px",
                    borderBottom: "2px solid #e5e5e5",
                    zIndex: 11
                  }}>
                    <input
                      type="text"
                      placeholder="Search country..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #16a34a",
                        borderRadius: "8px",
                        fontSize: "14px",
                        outline: "none",
                        color: "#333",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  {countryCodes
                    .filter(item =>
                      item.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                      item.code.includes(countrySearch) ||
                      item.country.toLowerCase().includes(countrySearch.toLowerCase())
                    )
                    .map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setCountryCode(item.code);
                        setShowCountryDropdown(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: countryCode === item.code ? "#e8f5e9" : "#fff",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: "14px",
                        color: "#333",
                        transition: "all 0.2s ease",
                        borderBottom: "1px solid #f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                      onMouseLeave={(e) => e.currentTarget.style.background = countryCode === item.code ? "#e8f5e9" : "#fff"}
                    >
                      <img
                        src={`https://flagcdn.com/${item.country.toLowerCase()}.svg`}
                        alt="flag"
                        style={{ width: "24px", height: "16px", borderRadius: "2px" }}
                      />
                      <span style={{ flex: 1 }}>
                        {item.code} - {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  paddingLeft: "45px",
                  border: "2px solid #e5e5e5",
                  borderRadius: "12px",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                  boxSizing: "border-box",
                  outline: "none",
                  color: "#333",
                  backgroundColor: "#fff"
                }}
                onFocus={(e) => e.target.style.borderColor = "#16a34a"}
                onBlur={(e) => e.target.style.borderColor = "#e5e5e5"}
              />
              <FaPhone style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#16a34a",
                fontSize: "16px"
              }} />
            </div>
          </div>

          <div className="input-box" style={{ marginBottom: "20px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                paddingLeft: "45px",
                border: "2px solid #e5e5e5",
                borderRadius: "12px",
                fontSize: "15px",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                outline: "none",
                color: "#333",
                backgroundColor: "#fff"
              }}
              onFocus={(e) => e.target.style.borderColor = "#16a34a"}
              onBlur={(e) => e.target.style.borderColor = "#e5e5e5"}
            />
            <FaUser style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#16a34a",
              fontSize: "16px"
            }} />
          </div>

          <div className="input-box" style={{ marginBottom: "20px", position: "relative" }}>
            <FaLock style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#ff9800",
              fontSize: "16px"
            }} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              style={{
                width: "100%",
                padding: "14px 45px 14px 45px",
                border: "2px solid #e5e5e5",
                borderRadius: "12px",
                fontSize: "15px",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                outline: "none",
                color: "#333",
                backgroundColor: "#fff"
              }}
              onFocus={(e) => e.target.style.borderColor = "#16a34a"}
              onBlur={(e) => e.target.style.borderColor = "#e5e5e5"}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#16a34a",
                fontSize: "16px"
              }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="input-box" style={{ marginBottom: "24px", position: "relative" }}>
            <FaLock style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#ff9800",
              fontSize: "16px"
            }} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 45px 14px 45px",
                border: "2px solid #e5e5e5",
                borderRadius: "12px",
                fontSize: "15px",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
                outline: "none",
                color: "#333",
                backgroundColor: "#fff"
              }}
              onFocus={(e) => e.target.style.borderColor = "#16a34a"}
              onBlur={(e) => e.target.style.borderColor = "#e5e5e5"}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#16a34a",
                fontSize: "16px"
              }}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(22, 163, 74, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.3)";
              }
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {message && (
            <p style={{
              marginTop: "16px",
              color: message.includes("success") ? "#16a34a" : "#ef4444",
              fontSize: "14px",
              textAlign: "center",
              fontWeight: 500,
              padding: "12px",
              background: message.includes("success") ? "rgba(22, 163, 74, 0.08)" : "rgba(239, 68, 68, 0.08)",
              borderRadius: "8px"
            }}>
              {message}
            </p>
          )}

          <div className="register-link" style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#666" }}>
            <p>
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitchToLogin();
                }}
                style={{
                  color: "#ff9800",
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "color 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => e.target.style.color = "#fb923c"}
                onMouseLeave={(e) => e.target.style.color = "#ff9800"}
              >
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;