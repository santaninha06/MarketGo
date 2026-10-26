import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!url || !key) {
  console.error('ERRO: confira as variáveis do arquivo .env');
  process.exit(1);
}

const supabase = createClient(url, key);

const { data, error } = await supabase
  .from('stores')
  .select('name')
  .limit(10);

if (error) {
  console.error('Erro ao consultar o Supabase:', error.message);
  process.exit(1);
}

console.log('Conexão funcionando!');
console.log('Estabelecimentos encontrados:', data.length);
console.table(data);
