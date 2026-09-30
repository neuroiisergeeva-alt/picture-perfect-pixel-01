CREATE OR REPLACE FUNCTION public.claim_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE ok boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid()
    AND lower(email) = 'neuroiisergeeva@gmail.com' AND email_confirmed_at IS NOT NULL) INTO ok;
  IF ok THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (auth.uid(), 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN public.has_role(auth.uid(), 'admin');
END $function$;