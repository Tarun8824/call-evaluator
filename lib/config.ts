export const CONFIG = {
  supabase: {
    url: 'https://xtgwncozirjyvwpqrnhm.supabase.co',
    serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Z3duY296aXJqeXZ3cHFybmhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzI3MTEwMywiZXhwIjoyMTAyODQ3MTAzfQ.4p3Hbwld5yU73r-uA6bG8MeXYsi_Nh0P071XDHLnWmM',
  },
  ai: {
    apiKey: process.env.NVIDIA_API_KEY || '',
    baseURL: 'https://integrate.api.nvidia.com/v1',
    model: 'meta/llama-3.1-8b-instruct',
  },
};
