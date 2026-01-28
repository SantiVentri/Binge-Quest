import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  // Validar que tengamos los parámetros necesarios
  if (!token_hash || !type) {
    return NextResponse.redirect(
      new URL("/signin?error=invalid_token", request.url)
    );
  }

  try {
    const cookieStore = await cookies();
    const supabase = await createClient(Promise.resolve(cookieStore));

    // Verificar la sesión con el token
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "email" | "recovery",
    });

    if (error) {
      console.error("Error verifying OTP:", error);
      return NextResponse.redirect(
        new URL("/signin?error=invalid_token", request.url)
      );
    }

    // Si la verificación fue exitosa, el usuario debe estar autenticado
    if (data.session) {
      // Crear una respuesta que redirige a /profile
      const response = NextResponse.redirect(new URL("/profile", request.url));
      
      // Las cookies de sesión se configuran automáticamente por Supabase
      return response;
    }

    return NextResponse.redirect(
      new URL("/signin?error=authentication_failed", request.url)
    );
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.redirect(
      new URL("/signin?error=server_error", request.url)
    );
  }
}
