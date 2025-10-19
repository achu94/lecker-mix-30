import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../src/lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
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
            .order('created_at', { ascending: false });
        
        if(error){
            console.log(error)
            return res.status(403).json(error)
        }

        return res.status(200).json(data)
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
