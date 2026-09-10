require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const email = 'test' + Date.now() + '@gmail.com';
  const password = 'password123';
  
  console.log('Signing up...');
  await supabase.auth.signUp({ email, password });
  await supabase.auth.signInWithPassword({ email, password });
  
  console.log('Creating family...');
  const { data: family, error: familyError } = await supabase
    .from('families')
    .insert([{ name: 'Test Family' }])
    .select()
    .single()
    
  console.log('Family:', family);
  console.log('Error:', familyError);
}

test();
