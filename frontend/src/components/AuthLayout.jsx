import { GraduationCap } from "lucide-react";
import "./auth.css";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-container">
      
      {/* LEFT SIDE */}
      <div className="auth-left">
        <div className="logo-box">
          <GraduationCap size={28} />
        </div>

        <h1>Your Campus Journey Starts Here</h1>

        <p>
          Complete your onboarding seamlessly with AI-guided steps,
          real-time progress tracking, and instant support.
        </p>

        <div className="users">
          <div className="avatar"></div>
          <div className="avatar"></div>
          <div className="avatar"></div>
          <span>1,200+ active users this semester</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>{title}</h2>
          <p className="subtitle">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}