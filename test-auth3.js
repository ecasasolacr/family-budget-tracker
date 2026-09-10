require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const email = 'test' + Date.now() + '@gmail.com';
  const password = 'password123';
  
  console.log('Signing up...');
  await supabase.auth.signUp({ email, password });
  
  console.log('Logging in...');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (data.session) {
    console.log('Login successful! Auto-confirm worked.');
  } else {
    console.log('Login failed:', error);
  }
}

test();
