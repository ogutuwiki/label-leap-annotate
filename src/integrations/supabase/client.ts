import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cxcrdrlotyjkmuwzktre.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4Y3JkcmxvdHlqa211d3prdHJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODIwMzUsImV4cCI6MjA2ODg1ODAzNX0.uxkicoyklrBwTq7uudjZNdDCOchkWZsybU7eaBRiZxU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)