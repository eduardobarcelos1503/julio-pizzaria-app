import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Fluxo de cadastro único: concede o papel de admin ao usuário logado
 * SOMENTE se ainda não existir nenhum admin no sistema.
 */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count, error: countError } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");

    if (countError) return { ok: false as const, error: "Falha ao verificar admins." };
    if ((count ?? 0) > 0) {
      return { ok: false as const, error: "Já existe um administrador cadastrado." };
    }

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });

    if (error) return { ok: false as const, error: "Não foi possível conceder o acesso." };
    return { ok: true as const };
  });
