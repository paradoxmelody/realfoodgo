import { useState } from "react";
import { FaLock, FaUser, FaEye, FaEyeSlash, FaHome, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../firebase_data/auth";
import "./LoginForm.css";

const LoginForm = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetStep, setResetStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const checkLockout = (email) => {
    const lockoutData = localStorage.getItem(`lockout_${email}`);
    if (!lockoutData) return { isLocked: false, attempts: 0 };

    const { attempts, lockedUntil } = JSON.parse(lockoutData);
    const now = Date.now();

    if (lockedUntil && now < lockedUntil) {
      const minutesLeft = Math.ceil((lockedUntil - now) / (1000 * 60));
      return { isLocked: true, minutesLeft, attempts };
    }

    if (lockedUntil && now >= lockedUntil) {
      localStorage.removeItem(`lockout_${email}`);
      return { isLocked: false, attempts: 0 };
    }

    return { isLocked: false, attempts };
  };

  const updateFailedAttempts = (email) => {
    const lockoutData = checkLockout(email);
    const newAttempts = lockoutData.attempts + 1;

    if (newAttempts >= 5) {
      const lockedUntil = Date.now() + (20 * 60 * 1000);
      localStorage.setItem(`lockout_${email}`, JSON.stringify({
        attempts: newAttempts,
        lockedUntil
      }));
      return { locked: true, attemptsRemaining: 0 };
    }

    localStorage.setItem(`lockout_${email}`, JSON.stringify({
      attempts: newAttempts,
      lockedUntil: null
    }));

    return { locked: false, attemptsRemaining: 5 - newAttempts };
  };

  const clearAttempts = (email) => {
    localStorage.removeItem(`lockout_${email}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate email format first
    if (!email.trim()) {
      setMessage("Please enter your email address");
      setLoading(false);
      return;
    }

    if (!email.toLowerCase().endsWith('@myuwc.ac.za')) {
      setMessage("Only @myuwc.ac.za email addresses are allowed");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setMessage("Please enter your password");
      setLoading(false);
      return;
    }

    // Check if account is locked
    const lockStatus = checkLockout(email);
    if (lockStatus.isLocked) {
      setMessage(`Account locked. Too many failed attempts. Try again in ${lockStatus.minutesLeft} minute(s).`);
      setLoading(false);
      return;
    }

    const result = await loginUser(email, password);
    setLoading(false);

    if (result.error) {
      const attemptStatus = updateFailedAttempts(email);

      let errorMessage = "";

      if (attemptStatus.locked) {
        errorMessage = "Too many failed login attempts. Your account has been locked for 20 minutes.";
      } else if (result.error.includes("user-not-found") || result.error.includes("wrong-password") || result.error.includes("invalid")) {
        errorMessage = `Invalid email or password. ${attemptStatus.attemptsRemaining} attempt(s) remaining.`;
      } else if (result.error.includes("network")) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (result.error.includes("too-many-requests")) {
        errorMessage = "Too many requests. Please wait a moment before trying again.";
      } else {
        errorMessage = `Login failed: ${result.error}. ${attemptStatus.attemptsRemaining} attempt(s) remaining.`;
      }

      setMessage(errorMessage);
    } else {
      clearAttempts(email);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/vendor"), 1000);
    }
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setForgotMessage("");

    if (!forgotEmail.trim()) {
      setForgotMessage("Please enter your email address");
      return;
    }

    if (!forgotEmail.toLowerCase().endsWith('@myuwc.ac.za')) {
      setForgotMessage("Only @myuwc.ac.za email addresses are allowed");
      return;
    }

    setForgotLoading(true);

    try {
      const newOtp = generateOTP();
      setGeneratedOtp(newOtp);

      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotEmail,
          otp: newOtp
        })
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setForgotMessage(`OTP sent to ${forgotEmail}. Check your email.`);
      setTimeout(() => {
        setResetStep(2);
        setForgotMessage("");
      }, 2000);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setForgotMessage("Failed to send OTP. Please check your email address and try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setForgotMessage("");

    if (!otp.trim()) {
      setForgotMessage("Please enter the OTP");
      return;
    }

    if (otp === generatedOtp) {
      setForgotMessage("OTP verified! Set your new password.");
      setTimeout(() => {
        setResetStep(3);
        setForgotMessage("");
      }, 1500);
    } else {
      setForgotMessage("Invalid OTP. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotMessage("");

    if (!newPassword.trim() || !confirmNewPassword.trim()) {
      setForgotMessage("Please enter both passwords");
      return;
    }

    if (newPassword.length < 8) {
      setForgotMessage("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setForgotMessage("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setForgotMessage("Password must contain at least one lowercase letter");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setForgotMessage("Password must contain at least one number");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setForgotMessage("Password must contain at least one special character");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setForgotMessage("Passwords do not match");
      return;
    }

    setForgotLoading(true);

    try {
      // Call your backend API to reset the password
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotEmail,
          newPassword: newPassword
        })
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      setForgotMessage("Password reset successfully!");
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetStep(1);
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmNewPassword("");
        setGeneratedOtp("");
        setForgotMessage("");
      }, 2000);
    } catch (err) {
      console.error("Error resetting password:", err);
      setForgotMessage("Failed to reset password. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setResetStep(1);
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setGeneratedOtp("");
    setForgotMessage("");
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

      <div className="wrapper" style={{ maxWidth: "450px", width: "100%", padding: "20px", backdropFilter: "none" }}>
        <form onSubmit={handleSubmit} style={{
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
            <p style={{ color: "#666", fontSize: "14px", fontWeight: 500 }}>Sign in to your account</p>
          </div>

          <div className="input-box" style={{ marginBottom: "20px", position: "relative" }}>
            <FaUser style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#16a34a",
              fontSize: "16px",
              zIndex: 1
            }} />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px 14px 45px",
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
            <style>{`
              input::placeholder {
                color: #999 !important;
              }
            `}</style>
          </div>

          <div className="input-box" style={{ marginBottom: "24px", position: "relative" }}>
            <FaLock style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#ff9800",
              fontSize: "16px",
              zIndex: 1
            }} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                fontSize: "16px",
                zIndex: 1
              }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="remember-forgot" style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
            fontSize: "14px"
          }}>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#666" }}>
              <input type="checkbox" style={{ marginRight: "6px", cursor: "pointer" }} />
              Remember me
            </label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPassword(true);
              }}
              style={{
                color: "#ff9800",
                textDecoration: "none",
                fontWeight: 600,
                transition: "color 0.3s ease",
                cursor: "pointer",
                fontSize: "14px"
              }}
              onMouseEnter={(e) => e.target.style.color = "#fb923c"}
              onMouseLeave={(e) => e.target.style.color = "#ff9800"}
            >
              Forgot Password?
            </a>
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
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p style={{
              marginTop: "16px",
              color: message.includes("success") || message.includes("Redirecting") ? "#16a34a" : "#ef4444",
              fontSize: "14px",
              textAlign: "center",
              fontWeight: 500,
              padding: "12px",
              background: message.includes("success") || message.includes("Redirecting") ? "rgba(22, 163, 74, 0.08)" : "rgba(239, 68, 68, 0.08)",
              borderRadius: "8px"
            }}>
              {message}
            </p>
          )}

          <div className="register-link" style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#666" }}>
            <p>
              Don't have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitchToSignup();
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
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>

      {showForgotPassword && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "40px",
            maxWidth: "400px",
            width: "90%",
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.2)",
            position: "relative"
          }}>
            <button
              type="button"
              onClick={closeForgotPassword}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                color: "#999",
                fontSize: "24px",
                cursor: "pointer"
              }}
            >
              <FaTimes />
            </button>

            <h2 style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#16a34a",
              marginBottom: "24px",
              textAlign: "center"
            }}>
              Reset Password
            </h2>

            {resetStep === 1 && (
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: "20px" }}>
                  <input
                    type="email"
                    placeholder="Enter your @myuwc.ac.za email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e5e5e5",
                      borderRadius: "12px",
                      fontSize: "14px",
                      boxSizing: "border-box",
                      outline: "none",
                      color: "#333",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#16a34a"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e5e5"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: forgotLoading ? "#9ca3af" : "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: forgotLoading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease"
                  }}
                >
                  {forgotLoading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {resetStep === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <p style={{ fontSize: "13px", color: "#666", marginBottom: "16px", textAlign: "center" }}>
                  We've sent an OTP to <strong>{forgotEmail}</strong>
                </p>
                <div style={{ marginBottom: "20px" }}>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    maxLength="6"
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e5e5e5",
                      borderRadius: "12px",
                      fontSize: "16px",
                      boxSizing: "border-box",
                      outline: "none",
                      color: "#333",
                      transition: "all 0.3s ease",
                      textAlign: "center",
                      letterSpacing: "8px"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#16a34a"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e5e5"}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                >
                  Verify OTP
                </button>
                <button
                  type="button"
                  onClick={() => setResetStep(1)}
                  style={{
                    width: "100%",
                    marginTop: "12px",
                    padding: "12px 16px",
                    background: "#f0f0f0",
                    color: "#666",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Back
                </button>
              </form>
            )}

            {resetStep === 3 && (
              <form onSubmit={handleResetPassword}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "6px" }}>
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 40px 12px 16px",
                        border: "2px solid #e5e5e5",
                        borderRadius: "12px",
                        fontSize: "14px",
                        boxSizing: "border-box",
                        outline: "none",
                        color: "#333",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#16a34a"}
                      onBlur={(e) => e.target.style.borderColor = "#e5e5e5"}
                    />
                    <span
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#16a34a",
                        fontSize: "14px"
                      }}
                    >
                      {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "6px" }}>
                    Confirm Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 40px 12px 16px",
                        border: "2px solid #e5e5e5",
                        borderRadius: "12px",
                        fontSize: "14px",
                        boxSizing: "border-box",
                        outline: "none",
                        color: "#333",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#16a34a"}
                      onBlur={(e) => e.target.style.borderColor = "#e5e5e5"}
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#16a34a",
                        fontSize: "14px"
                      }}
                    >
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: forgotLoading ? "#9ca3af" : "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: forgotLoading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease"
                  }}
                >
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            {forgotMessage && (
              <p style={{
                marginTop: "16px",
                color: forgotMessage.includes("success") || forgotMessage.includes("verified") || forgotMessage.includes("sent") ? "#16a34a" : "#ef4444",
                fontSize: "13px",
                textAlign: "center",
                fontWeight: 500,
                padding: "12px",
                background: forgotMessage.includes("success") || forgotMessage.includes("verified") || forgotMessage.includes("sent") ? "rgba(22, 163, 74, 0.08)" : "rgba(239, 68, 68, 0.08)",
                borderRadius: "8px"
              }}>
                {forgotMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;