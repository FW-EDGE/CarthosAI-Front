import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Fingerprint,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { translations, Language } from "../translations";
import { Button } from "./ui/Button";
import { authService } from "../services/api";

export const Auth = ({
  onAuthSuccess,
  initialMode = "register",
  language = "es",
}: {
  onAuthSuccess: (mode: "login" | "register") => void;
  initialMode?: "login" | "register";
  language?: Language;
}) => {
  const t = translations[language];
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const data = isLogin
        ? await authService.login({ email, password })
        : await authService.register({ nombre: name, email, password });

      // Store JWT token locally
      localStorage.setItem("carthos_token", data.token);
      if (data.nombre) localStorage.setItem("carthos_user_name", data.nombre);

      onAuthSuccess(isLogin ? "login" : "register");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--surface)" }}
    >
      {/* Background Layer */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(circle at 50% -20%, rgba(0,195,237,0.1) 0%, transparent 60%), radial-gradient(circle at 50% 120%, rgba(0,100,123,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Grid Pattern overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          opacity: 0.3,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(var(--surface-container-high) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel relative z-10 w-full max-w-md mx-4"
        style={{
          padding: "3rem 2.5rem",
          borderRadius: "24px",
          boxShadow: "0 30px 60px rgba(0,100,123,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, var(--primary) 0%, var(--primary-fixed) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              marginBottom: "1.25rem",
              boxShadow: "0 10px 20px rgba(0,195,237,0.25)",
            }}
          >
            <Fingerprint size={24} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.75rem",
              color: "var(--on-surface)",
              letterSpacing: "-0.03em",
            }}
          >
            {isLogin ? t.auth_welcome_back : t.auth_initialize_link}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              color: "var(--on-surface-var)",
              marginTop: "0.5rem",
              textAlign: "center",
            }}
          >
            {isLogin
              ? t.auth_access_orbit
              : t.auth_create_id}
          </p>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              padding: "1rem",
              borderRadius: "12px",
              background: "rgba(220, 38, 38, 0.1)",
              border: "1px solid rgba(220, 38, 38, 0.2)",
              marginBottom: "1.5rem",
            }}
          >
            <AlertCircle size={18} color="#dc2626" style={{ marginTop: 2 }} />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8rem",
                color: "#ef4444",
                lineHeight: 1.4,
              }}
            >
              {errorMsg}
            </span>
          </motion.div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <label
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--on-surface)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginLeft: 4,
                  }}
                >
                  {t.auth_callsign}
                </label>
                <input
                  type="text"
                  required={!isLogin}
                  className="input-ethereal"
                  placeholder="e.g. Maverick"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--on-surface)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginLeft: 4,
              }}
            >
              {t.auth_network_id}
            </label>
            <div className="relative">
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--outline)",
                }}
              />
              <input
                type="email"
                required
                className="input-ethereal"
                placeholder="user@aetheris.io"
                style={{ paddingLeft: "2.75rem" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--on-surface)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginLeft: 4,
                }}
              >
                {t.auth_passcode}
              </label>
              {isLogin && (
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.7rem",
                    color: "var(--primary)",
                    cursor: "pointer",
                  }}
                >
                  {t.auth_lost_key}
                </button>
              )}
            </div>
            <div className="relative">
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--outline)",
                }}
              />
              <input
                type="password"
                required
                className="input-ethereal"
                placeholder="••••••••"
                style={{ paddingLeft: "2.75rem" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            variant="primary"
            className="w-full mt-2"
            style={{ borderRadius: "12px" }}
            rightIcon={<ArrowRight size={16} />}
          >
            {isLogin ? t.auth_authenticate : t.auth_establish_link}
          </Button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              color: "var(--on-surface-var)",
            }}
          >
            {isLogin ? t.auth_new_network : t.auth_already_explorer}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg("");
            }}
            disabled={loading}
            style={{ fontWeight: 800, color: "var(--primary-fixed)" }}
            className="ml-1"
          >
            {isLogin ? t.auth_register_now : t.auth_signin_here}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
