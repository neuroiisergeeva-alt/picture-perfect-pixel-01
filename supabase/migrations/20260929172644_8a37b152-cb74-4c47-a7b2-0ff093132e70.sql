DROP POLICY "Public reads visible products" ON public.products;
CREATE POLICY "Anon reads visible products" ON public.products FOR SELECT TO anon USING (visible);
CREATE POLICY "Users read visible products" ON public.products FOR SELECT TO authenticated USING (visible OR public.has_role(auth.uid(),'admin'));
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;