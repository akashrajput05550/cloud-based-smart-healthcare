const SUPABASE_URL = "https://xefkjcappzhwyvaotedc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZmtqY2FwcHpod3l2YW90ZWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwOTYyMzgsImV4cCI6MjA4NzY3MjIzOH0.4OMOAuxy_IQA2ElMWN_7pIqwIgdAQ1yfWjixLQh7lQE";

const { createClient } = window.supabase;

window.supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);