export const CONFIG = {
  supabase: {
    url: 'https://xtgwncozirjyvwpqrnhm.supabase.co',
    serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Z3duY296aXJqeXZ3cHFybmhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzI3MTEwMywiZXhwIjoyMTAyODQ3MTAzfQ.4p3Hbwld5yU73r-uA6bG8MeXYsi_Nh0P071XDHLnWmM',
  },
  nvidia: {
    apiKey: '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',
    baseURL: 'https://integrate.api.nvidia.com/v1',
    model: 'meta/llama-3.1-405b-instruct',
    // Fallback to 'meta/llama-3.1-70b-instruct' if 405B is slow or unavailable
  },
};
