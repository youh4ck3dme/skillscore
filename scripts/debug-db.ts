import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debug() {
    console.log('--- Database Diagnostic ---')

    // 1. Check profiles table columns
    const { data: columns, error: colError } = await supabase.rpc('get_table_info', { table_name: 'profiles' })
    if (colError) {
        console.log('Error checking columns (RPC get_table_info might not exist):', colError.message)
        // Fallback: try to select one row
        const { data, error } = await supabase.from('profiles').select('*').limit(1)
        if (error) console.log('Error selecting from profiles:', error.message)
        else console.log('Profiles table exists.')
    } else {
        console.log('Profiles columns:', columns)
    }

    // 2. Try to manually insert a profile with a fake ID to see if it fails
    const fakeId = '00000000-0000-0000-0000-000000000000'
    const { error: insError } = await supabase.from('profiles').upsert({
        id: fakeId,
        email: 'debug@example.com',
        user_type: 'worker',
        full_name: 'Debug User'
    })

    if (insError) {
        console.log('Manual insert to profiles FAILED:', insError.message)
        console.log('Details:', insError.details)
        console.log('Hint:', insError.hint)
    } else {
        console.log('Manual insert to profiles SUCCEEDED.')
        // Clean up
        await supabase.from('profiles').delete().eq('id', fakeId)
    }
}

debug()
