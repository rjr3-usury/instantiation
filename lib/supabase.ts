import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.https://iwpijniytknpyzatblfk.supabase.co
const supabaseKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3cGlqbml5dGtucHl6YXRibGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDg4NTAsImV4cCI6MjA5NjU4NDg1MH0.mvhSv6tExIb7dpXU_YGHY2i-otUBv0B1dp-DsK3yrNc

export const supabase = createClient(supabaseUrl, supabaseKey)