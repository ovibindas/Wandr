import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const p = url.searchParams;

    const latitude  = parseFloat(p.get('latitude')  ?? '');
    const longitude = parseFloat(p.get('longitude') ?? '');

    if (isNaN(latitude) || isNaN(longitude)) {
      return new Response(
        JSON.stringify({ error: 'latitude and longitude query parameters are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const radius_km = parseFloat(p.get('radius_km') ?? '10');
    const category  = p.get('category') ?? null;
    const limit     = parseInt(p.get('limit')  ?? '20', 10);
    const offset    = parseInt(p.get('offset') ?? '0',  10);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error, count } = await supabase.rpc(
      'get_places_scored',
      { p_latitude: latitude, p_longitude: longitude, p_radius_km: radius_km, p_category: category, p_limit: limit, p_offset: offset },
      { count: 'exact' },
    );

    if (error) throw error;

    return new Response(
      JSON.stringify({ data, total: count ?? data.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
