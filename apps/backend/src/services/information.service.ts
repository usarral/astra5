import supabase from '../supabaseClient';

export async function fetchInformationList() {
    //get ID, name and geojson from information table to print on map
    const { data, error } = await supabase
        .from('information')
        .select('id, geojson')
        .order('id', { ascending: false });

    if (error) throw error;
    return data;
}

export async function fetchInformationById(id: string) {
    //Get all details from information table for a specific ID when user clicks on a polygon
    const { data, error } = await supabase
        .from('information')
        .select('*')
        .eq('id', id)
        .single();


    if (error) throw error;
    return data;
}

export async function fetchImagesForInformation(id: string) {
    //Get all images linked to a specific information ID
    const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('information_id', id)
        .order('pic_date', { ascending: false });

    if (error) throw error;
    return data;
}

export async function healthCheck() {
    // Check if Supabase client is initialized
    if (!supabase || typeof (supabase.from) !== 'function') {
        return { ok: false, message: 'Supabase client not initialized' };
    }

    // Perform a simple query to verify connectivity
    const { data, error } = await supabase
        .from('information')
        .select('id', { count: 'exact', head: false })
        .limit(1);

    // Return health status based on query result
    if (error) return { ok: false, message: 'DB query failed', detail: error };
    // If we get here, the DB is reachable
    return { ok: true, sample: data ?? [], hasSample: Array.isArray(data) && data.length > 0 };
}
