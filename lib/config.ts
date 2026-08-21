export const CONFIG = {
  supabase: {
    url: 'https://xtgwncozirjyvwpqrnhm.supabase.co',
    serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Z3duY296aXJqeXZ3cHFybmhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzI3MTEwMywiZXhwIjoyMTAyODQ3MTAzfQ.4p3Hbwld5yU73r-uA6bG8MeXYsi_Nh0P071XDHLnWmM',
  },
  ai: {
    apiKey: process.env.GEMINI_API_KEY || '',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
    model: 'gemini-2.0-flash',
  },
};
