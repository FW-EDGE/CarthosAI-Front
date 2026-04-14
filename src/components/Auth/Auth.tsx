import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Fingerprint,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { translations, Language } from "../../constants/translations";
import { Button } from "../ui/Button";
import { authService } from "../../services/api";
import "./Auth.css";

export const Auth = ({
  onAuthSuccess,
  onBack,
  initialMode = "register",
  language = "es",
}: {
  onAuthSuccess: (mode: "login" | "register") => void;
  onBack: () => void;
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
    <div className="landing-container flex items-center justify-center p-6">
      <div className="bg-ambience" />
      <div className="grid-overlay" />

      <button onClick={onBack} className="auth-back-btn">
        <ArrowLeft size={16} />
        {language === "es" ? "Volver" : "Back"}
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="glass-panel w-full max-w-md p-10 relative z-10 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[var(--primary-container)] text-[var(--primary)] flex items-center justify-center mb-6 shadow-sm">
            <Fingerprint size={28} />
          </div>
          <h2 className="section-title text-[1.75rem] mb-2 text-center">
            {isLogin ? t.auth_welcome_back : t.auth_initialize_link}
          </h2>
          <p className="font-sans text-[0.9rem] text-[var(--on-surface-var)] text-center">
            {isLogin ? t.auth_access_orbit : t.auth_create_id}
          </p>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6"
          >
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <span className="font-sans text-[0.85rem] text-red-500 leading-relaxed font-semibold">
              {errorMsg}
            </span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-2 overflow-hidden"
              >
                <label className="font-sans text-[0.75rem] font-bold text-[var(--on-surface-var)] uppercase tracking-wider px-1">
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

          <div className="flex flex-col gap-2">
            <label className="font-sans text-[0.75rem] font-bold text-[var(--on-surface-var)] uppercase tracking-wider px-1">
              {t.auth_network_id}
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--outline)]"
              />
              <input
                type="email"
                required
                className="input-ethereal auth-input-with-icon"
                placeholder="user@carthosai.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <label className="font-sans text-[0.75rem] font-bold text-[var(--on-surface-var)] uppercase tracking-wider">
                {t.auth_passcode}
              </label>
              {isLogin && (
                <button
                  type="button"
                  className="font-sans text-[0.75rem] font-bold text-[var(--primary)] hover:underline"
                >
                  {t.auth_lost_key}
                </button>
              )}
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--outline)]"
              />
              <input
                type="password"
                required
                className="input-ethereal auth-input-with-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            variant="primary"
            className="w-full h-12 rounded-xl font-bold mt-2"
            rightIcon={<ArrowRight size={18} />}
          >
            {isLogin ? t.auth_authenticate : t.auth_establish_link}
          </Button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-[var(--surface-container-high)]">
          <span className="font-sans text-[0.875rem] text-[var(--on-surface-var)]">
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
            className="font-extrabold text-[var(--primary-fixed)] ml-1 hover:bg-[var(--primary-container)] h-auto py-1"
          >
            {isLogin ? t.auth_register_now : t.auth_signin_here}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
