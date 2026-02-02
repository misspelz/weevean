import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import LoginPage from "./Login";

export default async function GoogleLoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <LoginPage user={user} />;
}
