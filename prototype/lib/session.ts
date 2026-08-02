import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Devuelve la sesión activa del request actual (valida la cookie de
 * better-auth) o null si no hay una sesión válida. Se usa como puerta de
 * entrada para las rutas de administración; nunca confiar solo en la UI.
 */
export async function getAdminSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}
