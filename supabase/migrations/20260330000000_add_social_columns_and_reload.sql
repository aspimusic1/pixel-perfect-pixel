-- Add social media columns to directory_listings (safe - IF NOT EXISTS)
ALTER TABLE directory_listings 
  ADD COLUMN IF NOT EXISTS instagram TEXT,
  ADD COLUMN IF NOT EXISTS spotify TEXT,
  ADD COLUMN IF NOT EXISTS tiktok TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT;

-- Create a function that sends pg_notify to reload PostgREST schema cache
CREATE OR REPLACE FUNCTION notify_pgrst_reload()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NOTIFY pgrst, 'reload schema';
END;
$$;

-- Grant execute to authenticated and anon roles
GRANT EXECUTE ON FUNCTION notify_pgrst_reload() TO authenticated;
GRANT EXECUTE ON FUNCTION notify_pgrst_reload() TO anon;

-- Also create a function to get artist social data (bypasses schema cache issues)
CREATE OR REPLACE FUNCTION get_artist_social(p_slug TEXT)
RETURNS TABLE(
  id UUID,
  name TEXT,
  instagram TEXT,
  spotify TEXT,
  tiktok TEXT,
  website TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dl.id,
    dl.name,
    dl.instagram,
    dl.spotify,
    dl.tiktok,
    dl.website
  FROM directory_listings dl
  WHERE dl.slug = p_slug
    AND dl.listing_type = 'artist';
END;
$$;

GRANT EXECUTE ON FUNCTION get_artist_social(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_artist_social(TEXT) TO anon;

-- Create a function to get all artists with social data
CREATE OR REPLACE FUNCTION get_all_artists_social()
RETURNS TABLE(
  id UUID,
  name TEXT,
  slug TEXT,
  instagram TEXT,
  spotify TEXT,
  tiktok TEXT,
  website TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dl.id,
    dl.name,
    dl.slug,
    dl.instagram,
    dl.spotify,
    dl.tiktok,
    dl.website
  FROM directory_listings dl
  WHERE dl.listing_type = 'artist'
  ORDER BY dl.name;
END;
$$;

GRANT EXECUTE ON FUNCTION get_all_artists_social() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_artists_social() TO anon;
