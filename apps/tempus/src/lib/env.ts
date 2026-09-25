// Supabase/Google の値は .env.local に置く（リポジトリには入れない）
const need = (k: string): string => {
  const v = import.meta.env[k as keyof ImportMetaEnv] as string | undefined;
  if (!v) throw new Error(`環境変数 ${k} が未設定です。.env.local を確認してください`);
  return v;
};

export const SUPABASE_URL = need('VITE_SUPABASE_URL');
export const SUPABASE_ANON_KEY = need('VITE_SUPABASE_ANON_KEY');
