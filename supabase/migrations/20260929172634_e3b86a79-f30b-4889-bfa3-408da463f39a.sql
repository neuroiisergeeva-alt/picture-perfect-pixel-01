CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Grants admin to the owner's confirmed account only
CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE ok boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid()
    AND lower(email) = 'admin2@gmail.com' AND email_confirmed_at IS NOT NULL) INTO ok;
  IF ok THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (auth.uid(), 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN public.has_role(auth.uid(), 'admin');
END $$;
REVOKE EXECUTE ON FUNCTION public.claim_admin() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  text text NOT NULL DEFAULT '',
  alt text NOT NULL DEFAULT '',
  image_url text,
  image_key text,
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads visible products" ON public.products FOR SELECT TO anon, authenticated USING (visible OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.products (title, text, alt, image_key, sort_order) VALUES
('Доска сухая строганая','Для строительства, отделки, мебели и интерьерных решений.','Штабель сухой строганой доски в столярной мастерской','doska',1),
('Вагонка','Натуральная отделка стен, потолков, домов, бань и загородных пространств.','Стена, отделанная натуральной деревянной вагонкой','vagonka',2),
('Доска пола','Теплый натуральный деревянный пол для дома и коммерческих помещений.','Натуральный деревянный пол из массивной доски в светлой комнате','pol',3),
('Имитация бруса','Эстетика деревянного дома для внутренней и наружной отделки.','Интерьер с отделкой стен имитацией бруса','imitaciya',4),
('Клееный брус','Стабильный и эстетичный материал для строительства и архитектурных решений.','Конструкция из клееного бруса крупным планом','brus',5),
('Ступени','Натуральное дерево для лестниц и индивидуальных интерьерных проектов.','Ступени лестницы из массива дерева','stupeni',6),
('Мебельные щиты','Для мебели, столешниц, подоконников, лестниц и интерьерных решений.','Мебельный щит из массива дуба на верстаке','shit',7),
('Планкен','Современное решение для фасадов, террас, заборов и архитектурных проектов.','Фасад современного дома, облицованный планкеном','planken',8),
('Бруски и рейки камерной сушки','Для строительства, отделки, декора, мебели и дизайнерских решений.','Связки брусков и рейки камерной сушки','bruski',9);

CREATE TABLE public.site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  expert_name text NOT NULL DEFAULT 'Ваше имя',
  expert_role text NOT NULL DEFAULT 'Эксперт по пиломатериалам · собственное производство',
  phone text NOT NULL DEFAULT '+7 000 000-00-00',
  whatsapp text NOT NULL DEFAULT '70000000000',
  telegram text NOT NULL DEFAULT 'username',
  email text NOT NULL DEFAULT 'mail@example.com',
  geo text NOT NULL DEFAULT 'Поставки по России и ЮФО',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.site_settings (id) VALUES (1);

ALTER TABLE public.leads ADD COLUMN status text NOT NULL DEFAULT 'new';
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
CREATE POLICY "Admins read leads" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update leads" ON public.leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete leads" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Public reads product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins change product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(),'admin'));