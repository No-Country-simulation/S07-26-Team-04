"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        setError(res.error.message || "Credenciales inválidas. Verifica tu correo y contraseña.");
      } else {
        router.push("/admin");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "Ocurrió un error inesperado al autenticar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--paper)] paper-texture">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-[var(--paper-2)] border border-[var(--rule-soft)] p-8 lg:p-10 rounded-sm shadow-sm">
          <div className="text-center mb-8">
            <div className="eyebrow mb-2">Acceso Reservado</div>
            <h1 className="font-display text-[28px] font-bold text-[var(--forest-800)] leading-tight">
              Iniciar Sesión Superusuario
            </h1>
            <p className="text-[13px] text-[var(--ink-muted)] mt-1.5">
              PhysaFlow — Panel de Administración
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-red-50/80 border-l-2 border-red-600 text-red-800 text-[12px] leading-relaxed rounded-r-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="eyebrow text-[11px] font-semibold tracking-[0.16em] uppercase text-[var(--forest-700)] mb-1.5 block">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] focus:border-[var(--forest-700)] focus:ring-1 focus:ring-[var(--forest-700)] rounded-sm outline-none transition"
                placeholder="admin@physaflow.org"
              />
            </div>

            <div>
              <label className="eyebrow text-[11px] font-semibold tracking-[0.16em] uppercase text-[var(--forest-700)] mb-1.5 block">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-[14px] bg-[var(--paper)] border border-[var(--rule)] text-[var(--ink)] focus:border-[var(--forest-700)] focus:ring-1 focus:ring-[var(--forest-700)] rounded-sm outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[var(--forest-700)] hover:bg-[var(--forest-800)] text-[var(--paper)] text-[13px] font-semibold tracking-wide rounded-sm shadow-sm transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? "Autenticando..." : "Ingresar al Panel"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--rule-soft)] text-center text-[12px] text-[var(--ink-muted)]">
            Acceso privado restringido a personal autorizado.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
