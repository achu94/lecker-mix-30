import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: Request) {
    const url = new URL(request.url)
    const myParam = url.searchParams.get('myParam')

    const { data, error } = await supabase
        .from('tags')
        .select(`
      id,
      name,
      description,
      repice_tags (
        recipes (
          id,
          title,
          video_url,
          recipe_link,
          created_at,
          recipe_thum_name
        )
      )
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
        return NextResponse.json(error, { status: 403 })
    }

    return NextResponse.json(data)
}
