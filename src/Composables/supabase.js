import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wwgkrawkakwzyagqglih.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Z2tyYXdrYWt3enlhZ3FnbGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNjA4MjYsImV4cCI6MjA0ODgzNjgyNn0.3MOeP8_0xj31cbbXgpeYFYwtHWdF6Dadsd246iZZC4g'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase

