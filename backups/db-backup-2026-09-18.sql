--
-- PostgreSQL database dump
--

\restrict 8o0UYcQcvetCfOP91a4M1peUwADWW0fxug7U1Qggs7Yw2ITkjBhPuvHA3l7J1mx

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.specification_definitions DROP CONSTRAINT IF EXISTS "specification_definitions_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS "sessions_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS "products_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS "products_brandId_fkey";
ALTER TABLE IF EXISTS ONLY public.product_specifications DROP CONSTRAINT IF EXISTS "product_specifications_specificationDefinitionId_fkey";
ALTER TABLE IF EXISTS ONLY public.product_specifications DROP CONSTRAINT IF EXISTS "product_specifications_productId_fkey";
ALTER TABLE IF EXISTS ONLY public.product_images DROP CONSTRAINT IF EXISTS "product_images_productId_fkey";
ALTER TABLE IF EXISTS ONLY public.menu_items DROP CONSTRAINT IF EXISTS "menu_items_parentId_fkey";
ALTER TABLE IF EXISTS ONLY public.menu_items DROP CONSTRAINT IF EXISTS "menu_items_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS "categories_parentId_fkey";
ALTER TABLE IF EXISTS ONLY public.accounts DROP CONSTRAINT IF EXISTS "accounts_userId_fkey";
DROP INDEX IF EXISTS public.users_email_key;
DROP INDEX IF EXISTS public."specification_definitions_categoryId_key_key";
DROP INDEX IF EXISTS public."specification_definitions_categoryId_idx";
DROP INDEX IF EXISTS public."sessions_sessionToken_key";
DROP INDEX IF EXISTS public."products_stockStatus_idx";
DROP INDEX IF EXISTS public.products_slug_key;
DROP INDEX IF EXISTS public.products_slug_idx;
DROP INDEX IF EXISTS public.products_sku_key;
DROP INDEX IF EXISTS public.products_sku_idx;
DROP INDEX IF EXISTS public.products_price_idx;
DROP INDEX IF EXISTS public."products_categoryId_idx";
DROP INDEX IF EXISTS public."products_brandId_idx";
DROP INDEX IF EXISTS public."product_specifications_specificationDefinitionId_idx";
DROP INDEX IF EXISTS public."product_specifications_productId_specificationDefinitionId_key";
DROP INDEX IF EXISTS public."product_specifications_productId_idx";
DROP INDEX IF EXISTS public."product_images_productId_idx";
DROP INDEX IF EXISTS public.menu_items_slug_idx;
DROP INDEX IF EXISTS public."menu_items_parentId_sortOrder_idx";
DROP INDEX IF EXISTS public."menu_items_level_sortOrder_idx";
DROP INDEX IF EXISTS public."menu_items_isVisible_idx";
DROP INDEX IF EXISTS public."filterable_specifications_key_value_categoryId_key";
DROP INDEX IF EXISTS public.filterable_specifications_key_idx;
DROP INDEX IF EXISTS public."filterable_specifications_categoryId_idx";
DROP INDEX IF EXISTS public.categories_slug_key;
DROP INDEX IF EXISTS public.categories_slug_idx;
DROP INDEX IF EXISTS public."categories_parentId_idx";
DROP INDEX IF EXISTS public.brands_slug_key;
DROP INDEX IF EXISTS public.brands_slug_idx;
DROP INDEX IF EXISTS public.brands_name_key;
DROP INDEX IF EXISTS public."accounts_provider_providerAccountId_key";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.specification_definitions DROP CONSTRAINT IF EXISTS specification_definitions_pkey;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.product_specifications DROP CONSTRAINT IF EXISTS product_specifications_pkey;
ALTER TABLE IF EXISTS ONLY public.product_images DROP CONSTRAINT IF EXISTS product_images_pkey;
ALTER TABLE IF EXISTS ONLY public.menu_items DROP CONSTRAINT IF EXISTS menu_items_pkey;
ALTER TABLE IF EXISTS ONLY public.filterable_specifications DROP CONSTRAINT IF EXISTS filterable_specifications_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.brands DROP CONSTRAINT IF EXISTS brands_pkey;
ALTER TABLE IF EXISTS ONLY public.accounts DROP CONSTRAINT IF EXISTS accounts_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.specification_definitions;
DROP TABLE IF EXISTS public.sessions;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.product_specifications;
DROP TABLE IF EXISTS public.product_images;
DROP TABLE IF EXISTS public.menu_items;
DROP TABLE IF EXISTS public.filterable_specifications;
DROP TABLE IF EXISTS public.categories;
DROP TABLE IF EXISTS public.brands;
DROP TABLE IF EXISTS public.accounts;
DROP TYPE IF EXISTS public."UserRole";
DROP TYPE IF EXISTS public."StockStatus";
DROP TYPE IF EXISTS public."DataType";
--
-- Name: DataType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DataType" AS ENUM (
    'TEXT',
    'NUMBER',
    'BOOLEAN',
    'SELECT'
);


ALTER TYPE public."DataType" OWNER TO postgres;

--
-- Name: StockStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StockStatus" AS ENUM (
    'IN_STOCK',
    'OUT_OF_STOCK',
    'PRE_ORDER',
    'UPCOMING',
    'DISCONTINUED'
);


ALTER TYPE public."StockStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'USER',
    'ADMIN',
    'SUPER_ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    logo text,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    image text,
    "parentId" text,
    level integer DEFAULT 0 NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: filterable_specifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.filterable_specifications (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    count integer DEFAULT 0 NOT NULL,
    "categoryId" text
);


ALTER TABLE public.filterable_specifications OWNER TO postgres;

--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_items (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "parentId" text,
    level integer DEFAULT 0 NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    href text,
    "categoryId" text,
    "isVisible" boolean DEFAULT true NOT NULL,
    "hideArrow" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.menu_items OWNER TO postgres;

--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id text NOT NULL,
    "productId" text NOT NULL,
    url text NOT NULL,
    alt text,
    "order" integer DEFAULT 0 NOT NULL,
    "isPrimary" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: product_specifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_specifications (
    id text NOT NULL,
    "productId" text NOT NULL,
    "specificationDefinitionId" text NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.product_specifications OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    sku text NOT NULL,
    description text,
    "shortDescription" text,
    price numeric(10,2) NOT NULL,
    "compareAtPrice" numeric(10,2),
    "costPrice" numeric(10,2),
    "stockStatus" public."StockStatus" DEFAULT 'IN_STOCK'::public."StockStatus" NOT NULL,
    "stockQuantity" integer DEFAULT 0 NOT NULL,
    "lowStockAlert" integer DEFAULT 5 NOT NULL,
    "categoryId" text NOT NULL,
    "brandId" text NOT NULL,
    "metaTitle" text,
    "metaDescription" text,
    "metaKeywords" text,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "publishedAt" timestamp(3) without time zone
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: specification_definitions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.specification_definitions (
    id text NOT NULL,
    "categoryId" text NOT NULL,
    name text NOT NULL,
    key text NOT NULL,
    "dataType" public."DataType" DEFAULT 'TEXT'::public."DataType" NOT NULL,
    unit text,
    "isFilterable" boolean DEFAULT false NOT NULL,
    "isRequired" boolean DEFAULT false NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.specification_definitions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    password text,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    "emailVerified" timestamp(3) without time zone,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands (id, name, slug, logo, description, "isActive", "createdAt", "updatedAt") FROM stdin;
cmr9bvrz90001njjljsucapm3	NVIDIA	nvidia	\N	Graphics card leader	t	2026-07-06 14:41:27.141	2026-07-06 14:41:27.141
cmr9bvs0u0002njjlrpqvkmbi	AMD	amd	\N	Advanced Micro Devices	t	2026-07-06 14:41:27.141	2026-07-06 14:41:27.141
cmr9bvs0z0003njjlsrhhfag8	Samsung	samsung	\N	Memory and storage solutions	t	2026-07-06 14:41:27.141	2026-07-06 14:41:27.141
cmr9bvs140004njjlq3f0ltgt	Intel	intel	\N	Leading processor manufacturer	t	2026-07-06 14:41:27.141	2026-07-06 14:41:27.141
cmr9bvs160005njjlpsmet0fp	ASUS	asus	\N	Computer hardware and electronics	t	2026-07-06 14:41:27.141	2026-07-06 14:41:27.141
cmr9bvs1i000anjjlofuysxcv	MiPhi	miphi	\N	Storage products	t	2026-07-06 14:41:27.223	2026-07-06 14:41:27.223
cmr9bvs1n000dnjjlcwqqzlt2	MSI	msi	\N	Gaming hardware manufacturer	t	2026-07-06 14:41:27.227	2026-07-06 14:41:27.227
cmr9bvs1p000enjjltzj0jtog	SanDisk	sandisk	\N	Flash storage solutions	t	2026-07-06 14:41:27.229	2026-07-06 14:41:27.229
cmr9bvs1r000fnjjlexhh71q3	Seagate	seagate	\N	Data storage solutions	t	2026-07-06 14:41:27.231	2026-07-06 14:41:27.231
cmr9bvs1u000injjlydlokmi4	Western Digital	western-digital	\N	Storage solutions	t	2026-07-06 14:41:27.235	2026-07-06 14:41:27.235
cmr9bvs1y000knjjlah0rj635	Acer	acer	\N	Computer hardware	t	2026-07-06 14:41:27.239	2026-07-06 14:41:27.239
cmr9bvs2b000unjjlcpum54gp	Biwintech	biwintech	\N	Storage solutions	t	2026-07-06 14:41:27.252	2026-07-06 14:41:27.252
cmr9bvs2d000vnjjl4w4taofp	Kingbox	kingbox	\N	Storage products	t	2026-07-06 14:41:27.254	2026-07-06 14:41:27.254
cmr9bvs2g000xnjjlq6cg2c0l	NCX	ncx	\N	Storage products	t	2026-07-06 14:41:27.256	2026-07-06 14:41:27.256
cmr9bvs2h000ynjjlow55tox4	Orico	orico	\N	Digital accessories	t	2026-07-06 14:41:27.258	2026-07-06 14:41:27.258
cmr9bvs2k0010njjlu958m2rd	King Super	king-super	\N	Storage products	t	2026-07-06 14:41:27.261	2026-07-06 14:41:27.261
cmr9bvs2t0015njjlg51gja4h	Ramsta	ramsta	\N	Storage solutions	t	2026-07-06 14:41:27.269	2026-07-06 14:41:27.269
cmr9bvs2u0016njjlss5t7fwy	Redragon	redragon	\N	Gaming peripherals	t	2026-07-06 14:41:27.271	2026-07-06 14:41:27.271
cmr9bvs2x0018njjlgob85pwv	AGI	agi	\N	Storage solutions	t	2026-07-06 14:41:27.273	2026-07-06 14:41:27.273
cmr9bvs2y0019njjllkoa9c2z	Revenger	revenger	\N	Gaming storage	t	2026-07-06 14:41:27.275	2026-07-06 14:41:27.275
cmr9bvs32001bnjjlwdt9w53v	LENOVO	lenovo	\N	Computing solutions	t	2026-07-06 14:41:27.278	2026-07-06 14:41:27.278
cmr9bvs37001enjjlk5ngzmtq	Suneest	suneest	\N	Storage products	t	2026-07-06 14:41:27.283	2026-07-06 14:41:27.283
cmrdanvpu001g11pzvc3or0hz	MSI (Intel)	msi-intel	\N	MSI Intel chipset motherboards	t	2026-07-09 09:18:23.826	2026-07-09 09:18:23.826
cmrdanvq6001h11pz8gu6h96b	MSI (AMD)	msi-amd	\N	MSI AMD chipset motherboards	t	2026-07-09 09:18:23.839	2026-07-09 09:18:23.839
cmrdanvq8001i11pzh84wiqng	ASRock (Intel)	asrock-intel	\N	ASRock Intel chipset motherboards	t	2026-07-09 09:18:23.84	2026-07-09 09:18:23.84
cmrdanvq8001j11pzm8ggkaua	ASRock (AMD)	asrock-amd	\N	ASRock AMD chipset motherboards	t	2026-07-09 09:18:23.841	2026-07-09 09:18:23.841
cmrdanvq9001k11pz2gprvud2	ASUS (Intel)	asus-intel	\N	ASUS Intel chipset motherboards	t	2026-07-09 09:18:23.841	2026-07-09 09:18:23.841
cmrdanvqa001l11pzanfwwru5	ASUS (AMD)	asus-amd	\N	ASUS AMD chipset motherboards	t	2026-07-09 09:18:23.842	2026-07-09 09:18:23.842
cmrdanvqa001m11pzgzu1n54x	GIGABYTE (Intel)	gigabyte-intel	\N	GIGABYTE Intel chipset motherboards	t	2026-07-09 09:18:23.843	2026-07-09 09:18:23.843
cmrdanvqb001n11pzcboyvwqr	GIGABYTE (AMD)	gigabyte-amd	\N	GIGABYTE AMD chipset motherboards	t	2026-07-09 09:18:23.844	2026-07-09 09:18:23.844
cmrdanvqc001o11pzgpmnlomv	Colorful (Intel)	colorful-intel	\N	Colorful Intel chipset motherboards	t	2026-07-09 09:18:23.844	2026-07-09 09:18:23.844
cmrdanvqc001p11pzzqx0o89h	Colorful (AMD)	colorful-amd	\N	Colorful AMD chipset motherboards	t	2026-07-09 09:18:23.845	2026-07-09 09:18:23.845
cmrdanvqd001q11pzpwu54amr	Intel Motherboard	intel-motherboard	\N	Intel platform motherboards	t	2026-07-09 09:18:23.845	2026-07-09 09:18:23.845
cmrdanvqe001r11pzvxxtnny0	AMD Motherboard	amd-motherboard	\N	AMD platform motherboards	t	2026-07-09 09:18:23.846	2026-07-09 09:18:23.846
cmr9bvs1c0007njjliydjdegy	Kingston	kingston	\N	Memory and storage products	t	2026-07-06 14:41:27.216	2026-07-10 10:54:18.661
cmr9bvs1e0008njjldd9yn8gy	Team	team	\N	Memory and storage solutions	t	2026-07-06 14:41:27.219	2026-07-10 10:54:18.662
cmr9bvs190006njjl0etcmten	Corsair	corsair	\N	Gaming peripherals and components	t	2026-07-06 14:41:27.214	2026-07-10 10:54:18.663
cmr9bvs27000rnjjlpj0622kg	PNY	pny	\N	Memory and storage products	t	2026-07-06 14:41:27.248	2026-07-10 10:54:18.664
cmr9bvs1s000gnjjlrepfjl63	Adata	adata	\N	Memory and storage manufacturer	t	2026-07-06 14:41:27.232	2026-07-10 10:54:18.666
cmr9bvs1t000hnjjllhkj3m9h	OCPC	ocpc	\N	Gaming hardware	t	2026-07-06 14:41:27.234	2026-07-10 10:54:18.667
cmr9bvs1l000cnjjlf6abi45d	Lexar	lexar	\N	Memory and storage products	t	2026-07-06 14:41:27.225	2026-07-10 10:54:18.668
cmr9bvs1w000jnjjl4karmtf7	AITC	aitc	\N	Storage products	t	2026-07-06 14:41:27.236	2026-07-10 10:54:18.669
cmr9bvs22000nnjjltuvxe04m	Apacer	apacer	\N	Digital storage solutions	t	2026-07-06 14:41:27.243	2026-07-10 10:54:18.67
cmrethhjc0007vdfbun9quctm	G.SKILL	g-skill	\N	G.SKILL memory	t	2026-07-10 10:53:04.392	2026-07-10 10:54:18.67
cmr9bvs1g0009njjlxlcnxd7x	XOC	xoc	\N	Storage solutions	t	2026-07-06 14:41:27.221	2026-07-10 10:54:18.671
cmr9bvs2f000wnjjlhveyideo	Gigabyte	gigabyte	\N	Computer hardware manufacturer	t	2026-07-06 14:41:27.255	2026-07-10 10:54:18.675
cmr9bvs2r0014njjlz6pepre3	Patriot	patriot	\N	Memory and storage	t	2026-07-06 14:41:27.268	2026-07-10 10:54:18.676
cmr9bvs24000onjjll00hq9a9	Colorful	colorful	\N	Graphics cards and storage	t	2026-07-06 14:41:27.244	2026-07-10 10:54:18.677
cmr9bvs2p0013njjllkbpbnva	Hikvision	hikvision	\N	Security and storage	t	2026-07-06 14:41:27.266	2026-07-10 10:54:18.678
cmr9bvs1k000bnjjl4cavdy9l	Oscoo	oscoo	\N	SSD manufacturer	t	2026-07-06 14:41:27.224	2026-07-10 10:54:18.678
cmr9bvs2w0017njjlb0niwu01	Kimtigo	kimtigo	\N	Memory products	t	2026-07-06 14:41:27.272	2026-07-10 10:54:18.679
cmrethhjd0009vdfbdw0iykme	HIKSEMI	hiksemi	\N	HIKSEMI memory	t	2026-07-10 10:53:04.394	2026-07-10 10:54:18.68
cmr9bvs2m0011njjlho8s259o	Addlink	addlink	\N	Memory and storage	t	2026-07-06 14:41:27.262	2026-07-10 10:54:18.68
cmr9bvs26000qnjjlhrbbplxh	Netac	netac	\N	Flash memory products	t	2026-07-06 14:41:27.247	2026-07-10 10:54:18.682
cmr9bvs21000mnjjlfy16ibyn	Crucial	crucial	\N	Memory and storage by Micron	t	2026-07-06 14:41:27.242	2026-07-10 10:54:18.683
cmr9bvs20000lnjjljsh2985w	Transcend	transcend	\N	Memory and storage	t	2026-07-06 14:41:27.24	2026-07-10 10:54:18.684
cmr9bvs25000pnjjlv8x188gl	KingSpec	kingspec	\N	SSD manufacturer	t	2026-07-06 14:41:27.245	2026-07-10 10:54:18.684
cmr9bvs38001fnjjly085bwns	Kingbank	kingbank	\N	Memory products	t	2026-07-06 14:41:27.284	2026-07-10 10:54:18.685
cmr9bvs30001anjjllga9jbta	Dahua	dahua	\N	Security and storage	t	2026-07-06 14:41:27.276	2026-07-10 10:54:18.685
cmr9bvs34001cnjjlx7v4l8qw	Smart	smart	\N	Storage products	t	2026-07-06 14:41:27.28	2026-07-10 10:54:18.686
cmrethhje000avdfbqmyzo826	Thermaltake	thermaltake	\N	Thermaltake memory	t	2026-07-10 10:53:04.395	2026-07-10 10:54:18.687
cmrethhjg000bvdfblrnpmwme	Abmoto	abmoto	\N	Abmoto memory	t	2026-07-10 10:53:04.396	2026-07-10 10:54:18.687
cmr9bvs2a000tnjjlgf4ozydd	PC Power	pc-power	\N	Computer components	t	2026-07-06 14:41:27.251	2026-07-10 10:54:18.688
cmr9bvs29000snjjlcu8q19no	TwinMos	twinmos	\N	Memory solutions	t	2026-07-06 14:41:27.249	2026-07-10 10:54:18.688
cmr9bvs35001dnjjlv2qqi2o9	Walton	walton	\N	Electronics manufacturer	t	2026-07-06 14:41:27.281	2026-07-10 10:54:18.69
cmrethhjh000cvdfboab681vt	MICROFROM	microfrom	\N	MICROFROM memory	t	2026-07-10 10:53:04.398	2026-07-10 10:54:18.691
cmr9bvs2j000znjjliyv1sc4m	HP	hp	\N	Computing and printing solutions	t	2026-07-06 14:41:27.259	2026-07-10 10:54:18.691
cmrethhjj000dvdfb1snxrqfj	GeIL	geil	\N	GeIL memory	t	2026-07-10 10:53:04.399	2026-07-10 10:54:18.692
cmrethhjj000evdfbikoa84tp	Biostar	biostar	\N	Biostar memory	t	2026-07-10 10:53:04.4	2026-07-10 10:54:18.692
cmr9bvs2n0012njjldwoed7p1	Neo forza	neo-forza	\N	Memory and storage	t	2026-07-06 14:41:27.264	2026-07-10 10:54:18.672
cmtn590a70000jq5x2w1gp882	PELADN	peladn	\N	PELADN graphics cards	t	2026-09-04 16:03:58.256	2026-09-04 16:03:58.256
cmtn5e2yh0000udp65aqs32hi	Sapphire	sapphire	\N	Sapphire AMD graphics cards	t	2026-09-04 16:07:55.001	2026-09-04 16:07:55.001
cmtn64tgf000iatz6wiljp0f1	Antec	antec	\N	\N	t	2026-09-04 16:28:42.4	2026-09-04 16:28:42.4
cmtn64tgh000jatz6l9dpalhj	Gamdias	gamdias	\N	\N	t	2026-09-04 16:28:42.402	2026-09-04 16:28:42.402
cmtn64tgk000katz6io5e0nxb	1STPLAYER	1stplayer	\N	\N	t	2026-09-04 16:28:42.404	2026-09-04 16:28:42.404
cmtn64tgl000latz6kkrgg1go	MaxGreen	maxgreen	\N	\N	t	2026-09-04 16:28:42.406	2026-09-04 16:28:42.406
cmtn64tgn000matz6kuasrw0z	Cooler Master	cooler-master	\N	\N	t	2026-09-04 16:28:42.408	2026-09-04 16:28:42.408
cmtn64tgp000natz60tb1gtfc	DeepCool	deepcool	\N	\N	t	2026-09-04 16:28:42.41	2026-09-04 16:28:42.41
cmtn64tgq000oatz6gysf49zd	NZXT	nzxt	\N	\N	t	2026-09-04 16:28:42.411	2026-09-04 16:28:42.411
cmtn64tgr000patz6b1qnl12q	Ocypus	ocypus	\N	\N	t	2026-09-04 16:28:42.412	2026-09-04 16:28:42.412
cmtn64tgs000qatz61plfhrc6	Value-Top	value-top	\N	\N	t	2026-09-04 16:28:42.413	2026-09-04 16:28:42.413
cmtn64tgt000ratz66ryiqp52	Xtreme	xtreme	\N	\N	t	2026-09-04 16:28:42.414	2026-09-04 16:28:42.414
cmtn64tgv000satz60jrtl8bw	Xigmatek	xigmatek	\N	\N	t	2026-09-04 16:28:42.415	2026-09-04 16:28:42.415
cmtn64tgw000tatz6i6fjvlzz	Cougar	cougar	\N	\N	t	2026-09-04 16:28:42.417	2026-09-04 16:28:42.417
cmtn64tgz000uatz6wuf24r7h	T-WOLF	t-wolf	\N	\N	t	2026-09-04 16:28:42.419	2026-09-04 16:28:42.419
cmtn64th0000vatz6bkdrhltg	Solitine	solitine	\N	\N	t	2026-09-04 16:28:42.42	2026-09-04 16:28:42.42
cmtn64th1000watz6gl63lmgf	Huntkey	huntkey	\N	\N	t	2026-09-04 16:28:42.421	2026-09-04 16:28:42.421
cmtn6rmky000is5veg44kwxe7	Monarch	monarch	\N	\N	t	2026-09-04 16:46:26.578	2026-09-04 16:46:26.578
cmtn6rml0000js5ve05tripqh	Carbono	carbono	\N	\N	t	2026-09-04 16:46:26.58	2026-09-04 16:46:26.58
cmtn6rml2000ks5vemp12s9xs	Arctic	arctic	\N	\N	t	2026-09-04 16:46:26.582	2026-09-04 16:46:26.582
cmtn6rml4000ls5vebgexyz27	Aigo	aigo	\N	\N	t	2026-09-04 16:46:26.585	2026-09-04 16:46:26.585
cmtn6rml6000ms5vebqapxfwu	AVESTA	avesta	\N	\N	t	2026-09-04 16:46:26.587	2026-09-04 16:46:26.587
cmtn6rml7000ns5veh8rsv6te	BitFenix	bitfenix	\N	\N	t	2026-09-04 16:46:26.588	2026-09-04 16:46:26.588
cmtn6rml8000os5vefvkh9wu1	Fantech	fantech	\N	\N	t	2026-09-04 16:46:26.589	2026-09-04 16:46:26.589
cmtn6rml9000ps5veob7a2prt	Fractal Design	fractal-design	\N	\N	t	2026-09-04 16:46:26.59	2026-09-04 16:46:26.59
cmtn6rmla000qs5vehoxow63c	Golden Field	golden-field	\N	\N	t	2026-09-04 16:46:26.591	2026-09-04 16:46:26.591
cmtn6rmlb000rs5ve1vs2rxjq	Lian Li	lian-li	\N	\N	t	2026-09-04 16:46:26.592	2026-09-04 16:46:26.592
cmtn6rmld000ss5veh8d8jk6q	Phanteks	phanteks	\N	\N	t	2026-09-04 16:46:26.594	2026-09-04 16:46:26.594
cmtn6rmle000ts5vehs30hm83	Razer	razer	\N	\N	t	2026-09-04 16:46:26.595	2026-09-04 16:46:26.595
cmtn6rmlg000us5vekkiu3ral	Rosewill	rosewill	\N	\N	t	2026-09-04 16:46:26.596	2026-09-04 16:46:26.596
cmtn6rmlh000vs5veuonsl4e4	SilverStone	silverstone	\N	\N	t	2026-09-04 16:46:26.598	2026-09-04 16:46:26.598
cmtn6rmlj000ws5veanra5f9b	Zalman	zalman	\N	\N	t	2026-09-04 16:46:26.599	2026-09-04 16:46:26.599
cmtn6rmlj000xs5venn65wr67	ARS	ars	\N	\N	t	2026-09-04 16:46:26.6	2026-09-04 16:46:26.6
cmtn72krc000mgqqvx5zuqd34	upHere	uphere	\N	\N	t	2026-09-04 16:54:57.433	2026-09-04 16:54:57.433
cmtn72krf000ngqqvf73x0bl5	Yeston	yeston	\N	\N	t	2026-09-04 16:54:57.435	2026-09-04 16:54:57.435
cmtn72krk000ogqqvdeqn6ys7	Noctua	noctua	\N	\N	t	2026-09-04 16:54:57.441	2026-09-04 16:54:57.441
cmtn72krm000pgqqvrfl8qbmt	Montech	montech	\N	\N	t	2026-09-04 16:54:57.442	2026-09-04 16:54:57.442
cmtn72kro000qgqqvuftqsidc	Aorus	aorus	\N	\N	t	2026-09-04 16:54:57.444	2026-09-04 16:54:57.444
cmtn72krq000rgqqv0elro91d	APC	apc	\N	\N	t	2026-09-04 16:54:57.446	2026-09-04 16:54:57.446
cmtn72krs000sgqqv0ykfqmsg	Havit	havit	\N	\N	t	2026-09-04 16:54:57.449	2026-09-04 16:54:57.449
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, description, image, "parentId", level, "order", "isActive", "createdAt", "updatedAt") FROM stdin;
cmr9bvs3a001gnjjlt52ef84a	Desktop PC	desktop-pc	Complete desktop computer systems	\N	\N	0	1	t	2026-07-06 14:41:27.287	2026-07-06 14:41:27.287
cmr9bvs3f001hnjjl01z95nzo	Components	components	Computer components and parts	\N	\N	0	2	t	2026-07-06 14:41:27.291	2026-07-06 14:41:27.291
cmr9bvs3g001injjl7l96ngta	Laptop	laptop	Laptops and notebooks	\N	\N	0	3	t	2026-07-06 14:41:27.293	2026-07-06 14:41:27.293
cmr9bvs3i001knjjlqcd26aib	Processor	processor	CPUs and processors	\N	cmr9bvs3f001hnjjl01z95nzo	1	1	t	2026-07-06 14:41:27.295	2026-07-06 14:41:27.295
cmr9bvs3l001mnjjlqu2ps65y	Intel	intel	Intel Processors	\N	cmr9bvs3i001knjjlqcd26aib	2	1	t	2026-07-06 14:41:27.298	2026-07-06 14:41:27.298
cmr9bvs3n001onjjl46q890qi	AMD	amd	AMD Processors	\N	cmr9bvs3i001knjjlqcd26aib	2	2	t	2026-07-06 14:41:27.299	2026-07-06 14:41:27.299
cmr9bvs3p001qnjjlnzrmtdrs	Graphics Card	graphics-card	GPUs and graphics cards	\N	cmr9bvs3f001hnjjl01z95nzo	1	2	t	2026-07-06 14:41:27.301	2026-07-06 14:41:27.301
cmr9bvs3q001snjjl5bz9ep3j	NVIDIA	nvidia	NVIDIA Graphics Cards	\N	cmr9bvs3p001qnjjlnzrmtdrs	2	1	t	2026-07-06 14:41:27.302	2026-07-06 14:41:27.302
cmr9bvs3r001unjjlz6a3qh23	AMD	amd-gpu	AMD Graphics Cards	\N	cmr9bvs3p001qnjjlnzrmtdrs	2	2	t	2026-07-06 14:41:27.304	2026-07-06 14:41:27.304
cmr9bvs3u001wnjjl81hph6nx	SSD	ssd	Solid State Drives	\N	cmr9bvs3f001hnjjl01z95nzo	1	3	t	2026-07-06 14:41:27.306	2026-07-06 14:41:27.306
cmrdawgoj0001t4sx2iu7z3q7	Motherboard	motherboard	Intel and AMD motherboards	\N	cmr9bvs3f001hnjjl01z95nzo	1	2	t	2026-07-09 09:25:04.243	2026-07-09 09:48:03.658
cmrdawgow0003t4sxu1aulbfu	Intel Motherboard	intel-motherboard	Intel chipset motherboards	\N	cmrdawgoj0001t4sx2iu7z3q7	2	1	t	2026-07-09 09:25:04.256	2026-07-09 09:48:03.669
cmrdawgox0005t4sx9zy0pfy3	AMD Motherboard	amd-motherboard	AMD chipset motherboards	\N	cmrdawgoj0001t4sx2iu7z3q7	2	2	t	2026-07-09 09:25:04.258	2026-07-09 09:48:03.671
cmr9bvs3w001ynjjlz6a42lgs	RAM	ram	Memory modules	\N	cmr9bvs3f001hnjjl01z95nzo	1	5	t	2026-07-06 14:41:27.308	2026-07-10 10:54:18.653
cmrethhiz0003vdfb4lfktnqj	Desktop RAM	desktop-ram	Desktop DDR4 and DDR5 memory	\N	cmr9bvs3w001ynjjlz6a42lgs	2	1	t	2026-07-10 10:53:04.379	2026-07-10 10:54:18.658
cmrethhj40005vdfbnhhoj6ap	Laptop RAM	laptop-ram	Laptop SO-DIMM memory	\N	cmr9bvs3w001ynjjlz6a42lgs	2	2	t	2026-07-10 10:53:04.384	2026-07-10 10:54:18.66
cmtn64tfl0001atz6goiay309	Power Supply	power-supply	PC Power Supply Units (PSU)	\N	cmr9bvs3f001hnjjl01z95nzo	1	7	t	2026-09-04 16:28:42.369	2026-09-04 16:28:42.369
cmtn6rmk30001s5veqp939d88	Computer Case	computer-case	PC chassis / computer casing	\N	cmr9bvs3f001hnjjl01z95nzo	1	10	t	2026-09-04 16:46:26.547	2026-09-04 16:46:26.547
cmtn72kpw0001gqqvt6fvuyzo	CPU Cooler	cpu-cooler	Air & liquid CPU coolers	\N	cmr9bvs3f001hnjjl01z95nzo	1	2	t	2026-09-04 16:54:57.38	2026-09-04 16:54:57.38
\.


--
-- Data for Name: filterable_specifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.filterable_specifications (id, key, value, count, "categoryId") FROM stdin;
cmr9esnvo0007t1wvo5jzadfn	gpu_chipset	NVIDIA's GB206 GPU chipset	1	cmr9bvs3p001qnjjlnzrmtdrs
cmr9esnvx0008t1wvo9hhvhe2	memory_size	8	1	cmr9bvs3p001qnjjlnzrmtdrs
cmr9esnvz0009t1wvb7e0sqgl	memory_type	GDDR7	2	cmr9bvs3p001qnjjlnzrmtdrs
cmr9jbay60017t1wvonke3pnw	gpu_chipset	GeForce RTX 5060 Ti	1	cmr9bvs3p001qnjjlnzrmtdrs
cmrdc2of4000ugb3wak6qcup6	chipset	Intel H610 Chipset	2	cmrdawgoj0001t4sx2iu7z3q7
cmrdc2ofc000vgb3wyjc6tda4	memory_size	64GB	2	cmrdawgoj0001t4sx2iu7z3q7
cmrdc2ofg000wgb3wndxfm9q4	memory_type	DDR4	2	cmrdawgoj0001t4sx2iu7z3q7
cmrdc2ofo000xgb3wchv2iyyp	form_factor	mATX	2	cmrdawgoj0001t4sx2iu7z3q7
cmrj08qkj000cykwwxnwhgthf	memory_type	DDR5	1	cmr9bvs3w001ynjjlz6a42lgs
cmrj08qkw000dykwwso7eb639	speed	6000 MHz	1	cmr9bvs3w001ynjjlz6a42lgs
cmrj08ql0000eykwwe3favb70	capacity	16GB	1	cmr9bvs3w001ynjjlz6a42lgs
cmrj08ql7000fykwwa364lq31	ram_features	RGB RAM	1	cmr9bvs3w001ynjjlz6a42lgs
cmtn590ca000mjq5xc5xwb7by	memory_size	4 GB	1	cmr9bvs3p001qnjjlnzrmtdrs
cmtn590cf000njq5x3inrqf14	memory_type	GDDR3	1	cmr9bvs3p001qnjjlnzrmtdrs
cmtn590cj000ojq5x0w6va0yq	gpu_chipset	GeForce GT 730	1	cmr9bvs3p001qnjjlnzrmtdrs
cmtn590cl000pjq5xqk956mv3	chipset_series	GT 700	1	cmr9bvs3p001qnjjlnzrmtdrs
cmtn590co000qjq5xddnr2ql9	port_types	HDMI, DVI, VGA (D-Sub)	1	cmr9bvs3p001qnjjlnzrmtdrs
cmtn590cp000rjq5xo2uxqya9	port_count	3 Ports	1	cmr9bvs3p001qnjjlnzrmtdrs
cmr9j8yle000ht1wvd4gh5k3r	memory_size	8 GB	4	cmr9bvs3p001qnjjlnzrmtdrs
cmtn5e30p000qudp6be957kxd	memory_type	GDDR6	1	cmr9bvs3p001qnjjlnzrmtdrs
cmtn5e30t000rudp6y05rr7ba	resolution	7680x4320	1	cmr9bvs3p001qnjjlnzrmtdrs
cmtn5e30u000sudp6f4mgmcno	gpu_chipset	Radeon RX 6600 XT	1	cmr9bvs3p001qnjjlnzrmtdrs
cmtn5e30v000tudp64df6wy24	chipset_series	RX 6000	1	cmr9bvs3p001qnjjlnzrmtdrs
cmtn5e30z000uudp60rxtmh3j	cooling_type	Dual Fan	1	cmr9bvs3p001qnjjlnzrmtdrs
cmtn5e311000vudp6zid2amob	port_types	HDMI, DisplayPort	1	cmr9bvs3p001qnjjlnzrmtdrs
cmtn5e312000wudp632zsrhcm	port_count	4 Ports	1	cmr9bvs3p001qnjjlnzrmtdrs
cmtn5tr4c000udjde21kztt5i	memory_type	DDR4	1	cmrethhj40005vdfbnhhoj6ap
cmtn5tr4e000vdjdeb5x372jb	speed	3200 MHz	1	cmrethhj40005vdfbnhhoj6ap
cmtn5tr4g000wdjdeml2qr85z	capacity	8GB	1	cmrethhj40005vdfbnhhoj6ap
cmrcbkzjo001r5men9i73ykpq	number_of_cores	10 Core	2	cmr9bvs3l001mnjjlqu2ps65y
cmrcbkzjq001s5menz5made1c	number_of_threads	16 Threads	2	cmr9bvs3l001mnjjlqu2ps65y
cmrcbkzju001u5menefjgrrli	generation	14th Gen (Raptor Lake Refresh)	2	cmr9bvs3l001mnjjlqu2ps65y
cmrcbkzjz001w5menar8vfr5n	integrated_graphics	Intel UHD Graphics 770	2	cmr9bvs3l001mnjjlqu2ps65y
cmrcbkzk0001x5menr01ciwmo	memory_type	DDR4 + DDR5	2	cmr9bvs3l001mnjjlqu2ps65y
cmrca989t000f5men92el2rqk	socket_type	AM4	2	cmr9bvs3n001onjjl46q890qi
cmrca989y000g5menmjmeep3z	number_of_cores	6 Core	2	cmr9bvs3n001onjjl46q890qi
cmrca98a0000h5menx2q651ee	number_of_threads	12 Threads	2	cmr9bvs3n001onjjl46q890qi
cmrca98a3000i5men2krvcuqi	cache_size	32 MB	2	cmr9bvs3n001onjjl46q890qi
cmrca98a5000j5mencezcn2ok	processor_model	Ryzen 5	2	cmr9bvs3n001onjjl46q890qi
cmrca98a7000k5menr85dgdnx	generation	Ryzen 5000 Series	2	cmr9bvs3n001onjjl46q890qi
cmrca98a9000l5mend1tl34fc	memory_type	DDR4	2	cmr9bvs3n001onjjl46q890qi
cmrcaa5mj00115men2q2yowoa	socket_type	LGA 1700	4	cmr9bvs3l001mnjjlqu2ps65y
cmrcaa5mm00125men8dyylj70	number_of_cores	6 Core	2	cmr9bvs3l001mnjjlqu2ps65y
cmrcaa5mo00135men2lq4savj	number_of_threads	12 Threads	2	cmr9bvs3l001mnjjlqu2ps65y
cmrcaa5mr00145menp1wya44u	cache_size	18 MB	4	cmr9bvs3l001mnjjlqu2ps65y
cmrcaa5mt00155menh4zljn58	processor_model	Intel Core i5	4	cmr9bvs3l001mnjjlqu2ps65y
cmrcaa5mv00165menfivd4n6l	generation	12th Gen (Alder Lake)	2	cmr9bvs3l001mnjjlqu2ps65y
cmrcaa5mx00175menr2ghqfp4	memory_type	DDR5	2	cmr9bvs3l001mnjjlqu2ps65y
cmu6pynlp004414lfbxz5fpil	chipset	AMD A520	7	cmrdawgox0005t4sx9zy0pfy3
cmu6pynko003k14lf0281xtys	chipset	AMD A620	2	cmrdawgox0005t4sx9zy0pfy3
cmu6pynin002g14lfe3vbtffn	chipset	Intel H610	15	cmrdawgow0003t4sxu1aulbfu
cmu6pynmt004o14lfe3lhljsq	chipset	AMD B550	1	cmrdawgox0005t4sx9zy0pfy3
cmu6pynit002h14lfmwxakxdx	memory_size	64GB	11	cmrdawgow0003t4sxu1aulbfu
cmu6pyniv002i14lf4h1oxeuh	memory_type	DDR4	11	cmrdawgow0003t4sxu1aulbfu
cmu6pynrx009414lfamxpfbxf	chipset	AMD B450	2	cmrdawgox0005t4sx9zy0pfy3
cmu6pynks003m14lfkb2xgtqq	memory_type	DDR5	2	cmrdawgox0005t4sx9zy0pfy3
cmu6r4g6y0018eqewvhm1bbvl	memory_type	DDR4	23	cmrethhiz0003vdfb4lfktnqj
cmu6pyniy002j14lftimo91q7	form_factor	Micro ATX	17	cmrdawgow0003t4sxu1aulbfu
cmu6pynjl003114lf3rvc7u0j	memory_size	96GB	6	cmrdawgow0003t4sxu1aulbfu
cmu6pynjm003214lfni8ba87n	memory_type	DDR5	6	cmrdawgow0003t4sxu1aulbfu
cmu6pynkq003l14lfelqmtpfp	memory_size	128GB	6	cmrdawgox0005t4sx9zy0pfy3
cmu6pynlr004514lfv2gevs1d	memory_size	64GB	6	cmrdawgox0005t4sx9zy0pfy3
cmu6r4g8x002heqewvvk3kjk3	memory_type	DDR5	6	cmrethhiz0003vdfb4lfktnqj
cmu6pynls004614lf20upj0f2	memory_type	DDR4	10	cmrdawgox0005t4sx9zy0pfy3
cmu6pynl0003n14lf2r0bs2ka	form_factor	Micro ATX	12	cmrdawgox0005t4sx9zy0pfy3
cmu6pynz400f814lf83kts0kf	chipset	Intel H510	1	cmrdawgow0003t4sxu1aulbfu
cmu6pyo2b00i014lfgclnl6mj	chipset	Intel H410	1	cmrdawgow0003t4sxu1aulbfu
cmu6r4ga6003feqew9afwhajq	speed	6000 MHz	4	cmrethhiz0003vdfb4lfktnqj
cmu6r4g8z002ieqewfdf4dfu3	speed	5600 MHz	1	cmrethhiz0003vdfb4lfktnqj
cmu6r4g700019eqewgj5qi3ea	speed	3200 MHz	20	cmrethhiz0003vdfb4lfktnqj
cmu6r4gam003peqewvw7oskoi	memory_type	DDR3	1	cmrethhiz0003vdfb4lfktnqj
cmu6r4gao003qeqew7vnina28	speed	1600 MHz	1	cmrethhiz0003vdfb4lfktnqj
cmu6r4gh1008deqewhofjcg0q	speed	2400 MHz	1	cmrethhiz0003vdfb4lfktnqj
cmu6r4gfr007eeqew1tahtssw	speed	2666 MHz	2	cmrethhiz0003vdfb4lfktnqj
cmu6r4ghl008peqewrpxfg9o4	capacity	4GB	1	cmrethhiz0003vdfb4lfktnqj
cmu6r4g72001aeqew7hg5t7s5	capacity	8GB	18	cmrethhiz0003vdfb4lfktnqj
cmu6r4gb70044eqewg4ipblnf	ram_features	RGB RAM	8	cmrethhiz0003vdfb4lfktnqj
cmu6r4gk200afeqewg75r292p	speed	5200 MHz	1	cmrethhiz0003vdfb4lfktnqj
cmu6r4gk300ageqew9qxgxjgg	capacity	32GB	1	cmrethhiz0003vdfb4lfktnqj
cmu6r4g9r0035eqew0iaplfo5	capacity	16GB	10	cmrethhiz0003vdfb4lfktnqj
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_items (id, name, slug, "parentId", level, "sortOrder", href, "categoryId", "isVisible", "hideArrow", "createdAt", "updatedAt") FROM stdin;
cmtvrso5i0001cqht6cpf5xcc	Component	components	\N	0	0	\N	\N	t	f	2026-09-10 16:57:16.614	2026-09-10 16:57:16.614
cmtvrso5p0005cqht3w9b69uh	Intel	intel	cmtvrso5m0003cqhtz06extfa	2	0	\N	\N	t	f	2026-09-10 16:57:16.621	2026-09-10 16:57:16.621
cmtvrso5r0007cqhtuzcagg9g	AMD Ryzen	amd-ryzen	cmtvrso5m0003cqhtz06extfa	2	1	\N	\N	t	f	2026-09-10 16:57:16.623	2026-09-10 16:57:16.623
cmtvrso5u000dcqht0vkxrbeu	Intel Motherboard	intel-motherboard	cmtvrso5t000bcqhtf2witnbk	2	0	\N	\N	t	f	2026-09-10 16:57:16.626	2026-09-10 16:57:16.626
cmtvrso5w000fcqht05ryhylw	AMD Motherboard	amd-motherboard	cmtvrso5t000bcqhtf2witnbk	2	1	\N	\N	t	f	2026-09-10 16:57:16.628	2026-09-10 16:57:16.628
cmtvrso5y000jcqht7q2ztbts	NVIDIA	nvidia	cmtvrso5x000hcqhtnqo566uk	2	0	\N	\N	t	f	2026-09-10 16:57:16.631	2026-09-10 16:57:16.631
cmtvrso5z000lcqhtz1vqyg8v	AMD	amd-gpu	cmtvrso5x000hcqhtnqo566uk	2	1	\N	\N	t	f	2026-09-10 16:57:16.631	2026-09-10 16:57:16.631
cmtvrso68000zcqhtir5n1cjn	Monitor	monitor	\N	0	1	\N	\N	t	f	2026-09-10 16:57:16.641	2026-09-10 16:57:16.641
cmtzhfivn000199c9kapvxox7	Team	team	cmtvrso60000ncqhtl4g7ndp5	2	0	/products?category=components&sub=desktop-ram&brand=team	\N	t	f	2026-09-13 07:18:11.796	2026-09-13 07:18:11.796
cmtzhfivr000399c9pe9sqk96	Colorful	colorful	cmtvrso60000ncqhtl4g7ndp5	2	1	/products?category=components&sub=desktop-ram&brand=colorful	\N	t	f	2026-09-13 07:18:11.8	2026-09-13 07:18:11.8
cmtzhfivs000599c9jh5hffox	Corsair	corsair	cmtvrso60000ncqhtl4g7ndp5	2	2	/products?category=components&sub=desktop-ram&brand=corsair	\N	t	f	2026-09-13 07:18:11.801	2026-09-13 07:18:11.801
cmtzhfivt000799c9zla3yhx1	Kingston	kingston	cmtvrso60000ncqhtl4g7ndp5	2	3	/products?category=components&sub=desktop-ram&brand=kingston	\N	t	f	2026-09-13 07:18:11.802	2026-09-13 07:18:11.802
cmtzhfivu000999c92hkuyg2h	PNY	pny	cmtvrso60000ncqhtl4g7ndp5	2	4	/products?category=components&sub=desktop-ram&brand=pny	\N	t	f	2026-09-13 07:18:11.803	2026-09-13 07:18:11.803
cmtzhfivv000b99c986xtcndt	G.SKILL	g-skill	cmtvrso60000ncqhtl4g7ndp5	2	5	/products?category=components&sub=desktop-ram&brand=g-skill	\N	t	f	2026-09-13 07:18:11.803	2026-09-13 07:18:11.803
cmtzhfivw000d99c9ciok4uwo	AITC	aitc	cmtvrso60000ncqhtl4g7ndp5	2	6	/products?category=components&sub=desktop-ram&brand=aitc	\N	t	f	2026-09-13 07:18:11.804	2026-09-13 07:18:11.804
cmtzhfivx000f99c9j9r424qg	Lexar	lexar	cmtvrso60000ncqhtl4g7ndp5	2	7	/products?category=components&sub=desktop-ram&brand=lexar	\N	t	f	2026-09-13 07:18:11.805	2026-09-13 07:18:11.805
cmtzhfivx000h99c92abjxi2p	Netac	netac	cmtvrso60000ncqhtl4g7ndp5	2	8	/products?category=components&sub=desktop-ram&brand=netac	\N	t	f	2026-09-13 07:18:11.806	2026-09-13 07:18:11.806
cmtzhfivy000j99c9w8gltaut	OCPC	ocpc	cmtvrso60000ncqhtl4g7ndp5	2	9	/products?category=components&sub=desktop-ram&brand=ocpc	\N	t	f	2026-09-13 07:18:11.807	2026-09-13 07:18:11.807
cmtzhfivz000l99c99y90w7lw	Oscoo	oscoo	cmtvrso60000ncqhtl4g7ndp5	2	10	/products?category=components&sub=desktop-ram&brand=oscoo	\N	t	f	2026-09-13 07:18:11.807	2026-09-13 07:18:11.807
cmtzhfiw0000n99c97il3y83a	Kingbank	kingbank	cmtvrso60000ncqhtl4g7ndp5	2	11	/products?category=components&sub=desktop-ram&brand=kingbank	\N	t	f	2026-09-13 07:18:11.808	2026-09-13 07:18:11.808
cmtzhfiw1000p99c9km8z6hgq	Adata	adata	cmtvrso60000ncqhtl4g7ndp5	2	12	/products?category=components&sub=desktop-ram&brand=adata	\N	t	f	2026-09-13 07:18:11.81	2026-09-13 07:18:11.81
cmtzhfiw2000r99c9w7dhvoas	Apacer	apacer	cmtvrso60000ncqhtl4g7ndp5	2	13	/products?category=components&sub=desktop-ram&brand=apacer	\N	t	f	2026-09-13 07:18:11.811	2026-09-13 07:18:11.811
cmtzhfiw3000t99c9mv1izcgz	XOC	xoc	cmtvrso60000ncqhtl4g7ndp5	2	14	/products?category=components&sub=desktop-ram&brand=xoc	\N	t	f	2026-09-13 07:18:11.812	2026-09-13 07:18:11.812
cmtzhfiw4000v99c9sqkjlm13	Neo forza	neo-forza	cmtvrso60000ncqhtl4g7ndp5	2	15	/products?category=components&sub=desktop-ram&brand=neo-forza	\N	t	f	2026-09-13 07:18:11.813	2026-09-13 07:18:11.813
cmtzhfiw5000x99c9qdb0i1cg	Gigabyte	gigabyte	cmtvrso60000ncqhtl4g7ndp5	2	16	/products?category=components&sub=desktop-ram&brand=gigabyte	\N	t	f	2026-09-13 07:18:11.814	2026-09-13 07:18:11.814
cmtzhfiw6000z99c9s7qqktba	Patriot	patriot	cmtvrso60000ncqhtl4g7ndp5	2	17	/products?category=components&sub=desktop-ram&brand=patriot	\N	t	f	2026-09-13 07:18:11.814	2026-09-13 07:18:11.814
cmtzhfiw7001199c9lm8i2m9m	Hikvision	hikvision	cmtvrso60000ncqhtl4g7ndp5	2	18	/products?category=components&sub=desktop-ram&brand=hikvision	\N	t	f	2026-09-13 07:18:11.815	2026-09-13 07:18:11.815
cmtzhfiw7001399c92vxlu2mq	Kimtigo	kimtigo	cmtvrso60000ncqhtl4g7ndp5	2	19	/products?category=components&sub=desktop-ram&brand=kimtigo	\N	t	f	2026-09-13 07:18:11.816	2026-09-13 07:18:11.816
cmtzhfiw8001599c9wmh9nl64	HIKSEMI	hiksemi	cmtvrso60000ncqhtl4g7ndp5	2	20	/products?category=components&sub=desktop-ram&brand=hiksemi	\N	t	f	2026-09-13 07:18:11.816	2026-09-13 07:18:11.816
cmtzhfiw9001799c9ml9y4c4n	Addlink	addlink	cmtvrso60000ncqhtl4g7ndp5	2	21	/products?category=components&sub=desktop-ram&brand=addlink	\N	t	f	2026-09-13 07:18:11.817	2026-09-13 07:18:11.817
cmtzhfiwa001999c9k3ujuora	Crucial	crucial	cmtvrso60000ncqhtl4g7ndp5	2	22	/products?category=components&sub=desktop-ram&brand=crucial	\N	t	f	2026-09-13 07:18:11.818	2026-09-13 07:18:11.818
cmtzhfiwa001b99c9jpy6l9s5	Transcend	transcend	cmtvrso60000ncqhtl4g7ndp5	2	23	/products?category=components&sub=desktop-ram&brand=transcend	\N	t	f	2026-09-13 07:18:11.819	2026-09-13 07:18:11.819
cmtzhfiwb001d99c9rcn8a0l1	KingSpec	kingspec	cmtvrso60000ncqhtl4g7ndp5	2	24	/products?category=components&sub=desktop-ram&brand=kingspec	\N	t	f	2026-09-13 07:18:11.82	2026-09-13 07:18:11.82
cmtzhfiwc001f99c9pest3f7b	Dahua	dahua	cmtvrso60000ncqhtl4g7ndp5	2	25	/products?category=components&sub=desktop-ram&brand=dahua	\N	t	f	2026-09-13 07:18:11.821	2026-09-13 07:18:11.821
cmtzhfiwd001h99c9ku4mi69d	Smart	smart	cmtvrso60000ncqhtl4g7ndp5	2	26	/products?category=components&sub=desktop-ram&brand=smart	\N	t	f	2026-09-13 07:18:11.821	2026-09-13 07:18:11.821
cmtzhfiwd001j99c986v64gff	Thermaltake	thermaltake	cmtvrso60000ncqhtl4g7ndp5	2	27	/products?category=components&sub=desktop-ram&brand=thermaltake	\N	t	f	2026-09-13 07:18:11.822	2026-09-13 07:18:11.822
cmtzhfiwe001l99c9umkan75w	Abmoto	abmoto	cmtvrso60000ncqhtl4g7ndp5	2	28	/products?category=components&sub=desktop-ram&brand=abmoto	\N	t	f	2026-09-13 07:18:11.823	2026-09-13 07:18:11.823
cmtvrso5s0009cqhts9qs9ek5	CPU Cooler	cpu-cooler	cmtvrso5i0001cqht6cpf5xcc	1	1	\N	\N	t	f	2026-09-10 16:57:16.624	2026-09-14 10:54:35.091
cmtvrso5t000bcqhtf2witnbk	Motherboard	motherboard	cmtvrso5i0001cqht6cpf5xcc	1	2	\N	\N	t	f	2026-09-10 16:57:16.625	2026-09-14 10:54:35.093
cmtvrso5x000hcqhtnqo566uk	Graphics Card	graphics-card	cmtvrso5i0001cqht6cpf5xcc	1	3	\N	\N	t	f	2026-09-10 16:57:16.63	2026-09-14 10:54:35.094
cmtvrso60000ncqhtl4g7ndp5	RAM (Desktop)	desktop-ram	cmtvrso5i0001cqht6cpf5xcc	1	4	\N	\N	t	f	2026-09-10 16:57:16.632	2026-09-14 10:54:35.096
cmtvrso61000pcqht40ji4t1f	RAM (Laptop)	laptop-ram	cmtvrso5i0001cqht6cpf5xcc	1	5	\N	\N	t	f	2026-09-10 16:57:16.634	2026-09-14 10:54:35.098
cmtvrso63000rcqhtillr8oyc	Power Supply	power-supply	cmtvrso5i0001cqht6cpf5xcc	1	6	\N	\N	t	f	2026-09-10 16:57:16.635	2026-09-14 10:54:35.1
cmtvrso64000tcqht817xeonc	SSD	ssd	cmtvrso5i0001cqht6cpf5xcc	1	9	\N	\N	t	f	2026-09-10 16:57:16.637	2026-09-14 10:54:35.106
cmtvrso66000vcqht8s28afg9	Casing	computer-case	cmtvrso5i0001cqht6cpf5xcc	1	11	\N	\N	t	f	2026-09-10 16:57:16.638	2026-09-14 10:54:35.11
cmtzhfiwf001n99c9e35r8owi	PC Power	pc-power	cmtvrso60000ncqhtl4g7ndp5	2	29	/products?category=components&sub=desktop-ram&brand=pc-power	\N	t	f	2026-09-13 07:18:11.823	2026-09-13 07:18:11.823
cmtzhfiwg001p99c9qv73qhqc	TwinMos	twinmos	cmtvrso60000ncqhtl4g7ndp5	2	30	/products?category=components&sub=desktop-ram&brand=twinmos	\N	t	f	2026-09-13 07:18:11.824	2026-09-13 07:18:11.824
cmtzhfiwh001r99c9b84c0wjy	Walton	walton	cmtvrso60000ncqhtl4g7ndp5	2	31	/products?category=components&sub=desktop-ram&brand=walton	\N	t	f	2026-09-13 07:18:11.825	2026-09-13 07:18:11.825
cmtzhfiwh001t99c9yuz97uyt	MICROFROM	microfrom	cmtvrso60000ncqhtl4g7ndp5	2	32	/products?category=components&sub=desktop-ram&brand=microfrom	\N	t	f	2026-09-13 07:18:11.826	2026-09-13 07:18:11.826
cmtzhfiwj001v99c9fbvlxyz2	HP	hp	cmtvrso60000ncqhtl4g7ndp5	2	33	/products?category=components&sub=desktop-ram&brand=hp	\N	t	f	2026-09-13 07:18:11.827	2026-09-13 07:18:11.827
cmtzhfiwk001x99c9znqvy5b9	GeIL	geil	cmtvrso60000ncqhtl4g7ndp5	2	34	/products?category=components&sub=desktop-ram&brand=geil	\N	t	f	2026-09-13 07:18:11.828	2026-09-13 07:18:11.828
cmtzhfiwm001z99c9fae85l07	Biostar	biostar	cmtvrso60000ncqhtl4g7ndp5	2	35	/products?category=components&sub=desktop-ram&brand=biostar	\N	t	f	2026-09-13 07:18:11.83	2026-09-13 07:18:11.83
cmtzhfiwp002199c9ih2gg88v	TEAM	team	cmtvrso61000pcqht40ji4t1f	2	0	/products?category=components&sub=laptop-ram&brand=team	\N	t	f	2026-09-13 07:18:11.833	2026-09-13 07:18:11.833
cmtzhfiwp002399c9512h42j8	Adata	adata	cmtvrso61000pcqht40ji4t1f	2	1	/products?category=components&sub=laptop-ram&brand=adata	\N	t	f	2026-09-13 07:18:11.834	2026-09-13 07:18:11.834
cmtzhfiwq002599c9mkufwap5	G.Skill	g-skill	cmtvrso61000pcqht40ji4t1f	2	2	/products?category=components&sub=laptop-ram&brand=g-skill	\N	t	f	2026-09-13 07:18:11.834	2026-09-13 07:18:11.834
cmtzhfiwr002799c97cupn6s6	Lexar	lexar	cmtvrso61000pcqht40ji4t1f	2	3	/products?category=components&sub=laptop-ram&brand=lexar	\N	t	f	2026-09-13 07:18:11.835	2026-09-13 07:18:11.835
cmtzhfiwr002999c96d23xdkk	Corsair	corsair	cmtvrso61000pcqht40ji4t1f	2	4	/products?category=components&sub=laptop-ram&brand=corsair	\N	t	f	2026-09-13 07:18:11.836	2026-09-13 07:18:11.836
cmtzhfiws002b99c9e8y68bk4	PNY	pny	cmtvrso61000pcqht40ji4t1f	2	5	/products?category=components&sub=laptop-ram&brand=pny	\N	t	f	2026-09-13 07:18:11.836	2026-09-13 07:18:11.836
cmtzhfiwt002d99c9n9ic1ywx	OCPC	ocpc	cmtvrso61000pcqht40ji4t1f	2	6	/products?category=components&sub=laptop-ram&brand=ocpc	\N	t	f	2026-09-13 07:18:11.837	2026-09-13 07:18:11.837
cmtzhfiwt002f99c9ctppyx0y	Netac	netac	cmtvrso61000pcqht40ji4t1f	2	7	/products?category=components&sub=laptop-ram&brand=netac	\N	t	f	2026-09-13 07:18:11.838	2026-09-13 07:18:11.838
cmtzhfiwv002h99c9ds1f2h6p	MSI	msi	cmtvrso63000rcqhtillr8oyc	2	0	/products?category=components&sub=power-supply&brand=msi	\N	t	f	2026-09-13 07:18:11.84	2026-09-13 07:18:11.84
cmtzhfiww002j99c9p8fuichr	Antec	antec	cmtvrso63000rcqhtillr8oyc	2	1	/products?category=components&sub=power-supply&brand=antec	\N	t	f	2026-09-13 07:18:11.841	2026-09-13 07:18:11.841
cmtzhfiwx002l99c9e0paiaps	Gamdias	gamdias	cmtvrso63000rcqhtillr8oyc	2	2	/products?category=components&sub=power-supply&brand=gamdias	\N	t	f	2026-09-13 07:18:11.841	2026-09-13 07:18:11.841
cmtzhfiwx002n99c94o4dyzcq	1STPLAYER	1stplayer	cmtvrso63000rcqhtillr8oyc	2	3	/products?category=components&sub=power-supply&brand=1stplayer	\N	t	f	2026-09-13 07:18:11.842	2026-09-13 07:18:11.842
cmtzhfiwy002p99c9c2jdl8b6	MaxGreen	maxgreen	cmtvrso63000rcqhtillr8oyc	2	4	/products?category=components&sub=power-supply&brand=maxgreen	\N	t	f	2026-09-13 07:18:11.843	2026-09-13 07:18:11.843
cmtzhfiwz002r99c9lzfsz6sn	Corsair	corsair	cmtvrso63000rcqhtillr8oyc	2	5	/products?category=components&sub=power-supply&brand=corsair	\N	t	f	2026-09-13 07:18:11.843	2026-09-13 07:18:11.843
cmtzhfiwz002t99c9h2u9v62m	Cooler Master	cooler-master	cmtvrso63000rcqhtillr8oyc	2	6	/products?category=components&sub=power-supply&brand=cooler-master	\N	t	f	2026-09-13 07:18:11.844	2026-09-13 07:18:11.844
cmtzhfix0002v99c94diecvqg	Gigabyte	gigabyte	cmtvrso63000rcqhtillr8oyc	2	7	/products?category=components&sub=power-supply&brand=gigabyte	\N	t	f	2026-09-13 07:18:11.844	2026-09-13 07:18:11.844
cmtzhfix1002x99c9k8k653u4	Asus	asus	cmtvrso63000rcqhtillr8oyc	2	8	/products?category=components&sub=power-supply&brand=asus	\N	t	f	2026-09-13 07:18:11.845	2026-09-13 07:18:11.845
cmtzhfix1002z99c9v2qbvqm4	DeepCool	deepcool	cmtvrso63000rcqhtillr8oyc	2	9	/products?category=components&sub=power-supply&brand=deepcool	\N	t	f	2026-09-13 07:18:11.846	2026-09-13 07:18:11.846
cmtzhfix2003199c91ab5wcxv	NZXT	nzxt	cmtvrso63000rcqhtillr8oyc	2	10	/products?category=components&sub=power-supply&brand=nzxt	\N	t	f	2026-09-13 07:18:11.846	2026-09-13 07:18:11.846
cmtzhfix2003399c9h5zpxvgw	Ocypus	ocypus	cmtvrso63000rcqhtillr8oyc	2	11	/products?category=components&sub=power-supply&brand=ocypus	\N	t	f	2026-09-13 07:18:11.847	2026-09-13 07:18:11.847
cmtzhfix3003599c9sa4sj7tq	Value-Top	value-top	cmtvrso63000rcqhtillr8oyc	2	12	/products?category=components&sub=power-supply&brand=value-top	\N	t	f	2026-09-13 07:18:11.847	2026-09-13 07:18:11.847
cmtzhfix4003799c9v7l5wsn2	Xtreme	xtreme	cmtvrso63000rcqhtillr8oyc	2	13	/products?category=components&sub=power-supply&brand=xtreme	\N	t	f	2026-09-13 07:18:11.848	2026-09-13 07:18:11.848
cmtzhfix5003999c9qefb8iks	Acer	acer	cmtvrso63000rcqhtillr8oyc	2	14	/products?category=components&sub=power-supply&brand=acer	\N	t	f	2026-09-13 07:18:11.849	2026-09-13 07:18:11.849
cmtzhfix6003b99c9tlt8wu05	Xigmatek	xigmatek	cmtvrso63000rcqhtillr8oyc	2	15	/products?category=components&sub=power-supply&brand=xigmatek	\N	t	f	2026-09-13 07:18:11.851	2026-09-13 07:18:11.851
cmtzhfix7003d99c9s0igypgb	Cougar	cougar	cmtvrso63000rcqhtillr8oyc	2	16	/products?category=components&sub=power-supply&brand=cougar	\N	t	f	2026-09-13 07:18:11.851	2026-09-13 07:18:11.851
cmtzhfix8003f99c9t8yvezeg	OCPC	ocpc	cmtvrso63000rcqhtillr8oyc	2	17	/products?category=components&sub=power-supply&brand=ocpc	\N	t	f	2026-09-13 07:18:11.852	2026-09-13 07:18:11.852
cmtzhfix8003h99c976x2hkut	T-WOLF	t-wolf	cmtvrso63000rcqhtillr8oyc	2	18	/products?category=components&sub=power-supply&brand=t-wolf	\N	t	f	2026-09-13 07:18:11.853	2026-09-13 07:18:11.853
cmtzhfix9003j99c92mtnd7i8	Solitine	solitine	cmtvrso63000rcqhtillr8oyc	2	19	/products?category=components&sub=power-supply&brand=solitine	\N	t	f	2026-09-13 07:18:11.853	2026-09-13 07:18:11.853
cmtzhfixa003l99c9xbissxzl	Huntkey	huntkey	cmtvrso63000rcqhtillr8oyc	2	20	/products?category=components&sub=power-supply&brand=huntkey	\N	t	f	2026-09-13 07:18:11.854	2026-09-13 07:18:11.854
cmtzhfixb003n99c9btn3fbql	TEAM	team	cmtvrso64000tcqht817xeonc	2	0	/products?category=components&sub=ssd&brand=team	\N	t	f	2026-09-13 07:18:11.856	2026-09-13 07:18:11.856
cmtzhfixc003p99c9xnuupfyc	Colorful	colorful	cmtvrso64000tcqht817xeonc	2	1	/products?category=components&sub=ssd&brand=colorful	\N	t	f	2026-09-13 07:18:11.856	2026-09-13 07:18:11.856
cmtzhfixd003r99c97k1jah2h	MiPhi	miphi	cmtvrso64000tcqht817xeonc	2	2	/products?category=components&sub=ssd&brand=miphi	\N	t	f	2026-09-13 07:18:11.857	2026-09-13 07:18:11.857
cmtzhfixd003t99c90fu0y6g6	Corsair	corsair	cmtvrso64000tcqht817xeonc	2	3	/products?category=components&sub=ssd&brand=corsair	\N	t	f	2026-09-13 07:18:11.858	2026-09-13 07:18:11.858
cmtzhfixe003v99c93wtsnisn	Kingston	kingston	cmtvrso64000tcqht817xeonc	2	4	/products?category=components&sub=ssd&brand=kingston	\N	t	f	2026-09-13 07:18:11.858	2026-09-13 07:18:11.858
cmtzhfixf003x99c9nnex56r7	Western Digital	western-digital	cmtvrso64000tcqht817xeonc	2	5	/products?category=components&sub=ssd&brand=western-digital	\N	t	f	2026-09-13 07:18:11.86	2026-09-13 07:18:11.86
cmtzhfixg003z99c9mrac7ox7	Lexar	lexar	cmtvrso64000tcqht817xeonc	2	6	/products?category=components&sub=ssd&brand=lexar	\N	t	f	2026-09-13 07:18:11.86	2026-09-13 07:18:11.86
cmtzhfixh004199c9h238s0v2	Transcend	transcend	cmtvrso64000tcqht817xeonc	2	7	/products?category=components&sub=ssd&brand=transcend	\N	t	f	2026-09-13 07:18:11.861	2026-09-13 07:18:11.861
cmtzhfixh004399c907owywdn	Seagate	seagate	cmtvrso64000tcqht817xeonc	2	8	/products?category=components&sub=ssd&brand=seagate	\N	t	f	2026-09-13 07:18:11.862	2026-09-13 07:18:11.862
cmtzhfixi004599c92963mhla	AITC	aitc	cmtvrso64000tcqht817xeonc	2	9	/products?category=components&sub=ssd&brand=aitc	\N	t	f	2026-09-13 07:18:11.862	2026-09-13 07:18:11.862
cmtzhfixj004799c994vasqfx	Netac	netac	cmtvrso64000tcqht817xeonc	2	10	/products?category=components&sub=ssd&brand=netac	\N	t	f	2026-09-13 07:18:11.863	2026-09-13 07:18:11.863
cmtzhfixj004999c98sd3tem0	OCPC	ocpc	cmtvrso64000tcqht817xeonc	2	11	/products?category=components&sub=ssd&brand=ocpc	\N	t	f	2026-09-13 07:18:11.864	2026-09-13 07:18:11.864
cmtzhfixk004b99c9r7q2ddj3	OSCOO	oscoo	cmtvrso64000tcqht817xeonc	2	12	/products?category=components&sub=ssd&brand=oscoo	\N	t	f	2026-09-13 07:18:11.864	2026-09-13 07:18:11.864
cmtzhfixk004d99c9mm099a7h	Addlink	addlink	cmtvrso64000tcqht817xeonc	2	13	/products?category=components&sub=ssd&brand=addlink	\N	t	f	2026-09-13 07:18:11.865	2026-09-13 07:18:11.865
cmtzhfixl004f99c9qvyu249j	KingBank	kingbank	cmtvrso64000tcqht817xeonc	2	14	/products?category=components&sub=ssd&brand=kingbank	\N	t	f	2026-09-13 07:18:11.865	2026-09-13 07:18:11.865
cmtzhfixm004h99c9k3oclf9x	ADATA	adata	cmtvrso64000tcqht817xeonc	2	15	/products?category=components&sub=ssd&brand=adata	\N	t	f	2026-09-13 07:18:11.866	2026-09-13 07:18:11.866
cmtzhfixm004j99c99cee9oke	Samsung	samsung	cmtvrso64000tcqht817xeonc	2	16	/products?category=components&sub=ssd&brand=samsung	\N	t	f	2026-09-13 07:18:11.867	2026-09-13 07:18:11.867
cmtzhfixn004l99c90z02lr18	HP	hp	cmtvrso64000tcqht817xeonc	2	17	/products?category=components&sub=ssd&brand=hp	\N	t	f	2026-09-13 07:18:11.867	2026-09-13 07:18:11.867
cmtzhfixn004n99c98dcmk3hk	Gigabyte	gigabyte	cmtvrso64000tcqht817xeonc	2	18	/products?category=components&sub=ssd&brand=gigabyte	\N	t	f	2026-09-13 07:18:11.868	2026-09-13 07:18:11.868
cmtzhfixo004p99c9z828gs74	Dahua	dahua	cmtvrso64000tcqht817xeonc	2	19	/products?category=components&sub=ssd&brand=dahua	\N	t	f	2026-09-13 07:18:11.869	2026-09-13 07:18:11.869
cmtzhfixp004r99c9jgz2pot9	PNY	pny	cmtvrso64000tcqht817xeonc	2	20	/products?category=components&sub=ssd&brand=pny	\N	t	f	2026-09-13 07:18:11.87	2026-09-13 07:18:11.87
cmtzhfixq004t99c9blevayav	TwinMOS	twinmos	cmtvrso64000tcqht817xeonc	2	21	/products?category=components&sub=ssd&brand=twinmos	\N	t	f	2026-09-13 07:18:11.87	2026-09-13 07:18:11.87
cmtzhfixr004v99c9a2udp3b6	Apacer	apacer	cmtvrso64000tcqht817xeonc	2	22	/products?category=components&sub=ssd&brand=apacer	\N	t	f	2026-09-13 07:18:11.871	2026-09-13 07:18:11.871
cmtzhfixs004x99c9s3k1x77s	Patriot	patriot	cmtvrso64000tcqht817xeonc	2	23	/products?category=components&sub=ssd&brand=patriot	\N	t	f	2026-09-13 07:18:11.872	2026-09-13 07:18:11.872
cmtzhfixs004z99c9jp95ibw7	Biostar	biostar	cmtvrso64000tcqht817xeonc	2	24	/products?category=components&sub=ssd&brand=biostar	\N	t	f	2026-09-13 07:18:11.873	2026-09-13 07:18:11.873
cmtzhfixt005199c9hx72a9xv	Acer	acer	cmtvrso64000tcqht817xeonc	2	25	/products?category=components&sub=ssd&brand=acer	\N	t	f	2026-09-13 07:18:11.874	2026-09-13 07:18:11.874
cmtzhfixu005399c9vlzmw1yt	Kingspec	kingspec	cmtvrso64000tcqht817xeonc	2	26	/products?category=components&sub=ssd&brand=kingspec	\N	t	f	2026-09-13 07:18:11.874	2026-09-13 07:18:11.874
cmtzhfixw005599c9sjzc0fvs	MSI	msi	cmtvrso66000vcqht8s28afg9	2	0	/products?category=components&sub=computer-case&brand=msi	\N	t	f	2026-09-13 07:18:11.876	2026-09-13 07:18:11.876
cmtzhfixw005799c9kihi7qnv	Antec	antec	cmtvrso66000vcqht8s28afg9	2	1	/products?category=components&sub=computer-case&brand=antec	\N	t	f	2026-09-13 07:18:11.877	2026-09-13 07:18:11.877
cmtzhfixx005999c9at2ulr1a	Gamdias	gamdias	cmtvrso66000vcqht8s28afg9	2	2	/products?category=components&sub=computer-case&brand=gamdias	\N	t	f	2026-09-13 07:18:11.877	2026-09-13 07:18:11.877
cmtzhfixy005b99c926q9k49p	MaxGreen	maxgreen	cmtvrso66000vcqht8s28afg9	2	3	/products?category=components&sub=computer-case&brand=maxgreen	\N	t	f	2026-09-13 07:18:11.878	2026-09-13 07:18:11.878
cmtzhfixz005d99c99kbr02l0	Corsair	corsair	cmtvrso66000vcqht8s28afg9	2	4	/products?category=components&sub=computer-case&brand=corsair	\N	t	f	2026-09-13 07:18:11.879	2026-09-13 07:18:11.879
cmtzhfiy0005f99c9tkuhy328	Asus	asus	cmtvrso66000vcqht8s28afg9	2	5	/products?category=components&sub=computer-case&brand=asus	\N	t	f	2026-09-13 07:18:11.88	2026-09-13 07:18:11.88
cmtzhfiy0005h99c9ezo1sanf	1STPLAYER	1stplayer	cmtvrso66000vcqht8s28afg9	2	6	/products?category=components&sub=computer-case&brand=1stplayer	\N	t	f	2026-09-13 07:18:11.881	2026-09-13 07:18:11.881
cmtzhfiy1005j99c9cemuhnrw	NZXT	nzxt	cmtvrso66000vcqht8s28afg9	2	7	/products?category=components&sub=computer-case&brand=nzxt	\N	t	f	2026-09-13 07:18:11.881	2026-09-13 07:18:11.881
cmtzhfiy2005l99c9gm5clqpt	Gigabyte	gigabyte	cmtvrso66000vcqht8s28afg9	2	8	/products?category=components&sub=computer-case&brand=gigabyte	\N	t	f	2026-09-13 07:18:11.882	2026-09-13 07:18:11.882
cmtzhfiy2005n99c9vr8t9vtb	Xtreme	xtreme	cmtvrso66000vcqht8s28afg9	2	9	/products?category=components&sub=computer-case&brand=xtreme	\N	t	f	2026-09-13 07:18:11.883	2026-09-13 07:18:11.883
cmtzhfiy3005p99c98ehmv4ec	DeepCool	deepcool	cmtvrso66000vcqht8s28afg9	2	10	/products?category=components&sub=computer-case&brand=deepcool	\N	t	f	2026-09-13 07:18:11.883	2026-09-13 07:18:11.883
cmtzhfiy3005r99c9071ru02y	Xigmatek	xigmatek	cmtvrso66000vcqht8s28afg9	2	11	/products?category=components&sub=computer-case&brand=xigmatek	\N	t	f	2026-09-13 07:18:11.884	2026-09-13 07:18:11.884
cmtzhfiy4005t99c90bfzfo5a	Value-Top	value-top	cmtvrso66000vcqht8s28afg9	2	12	/products?category=components&sub=computer-case&brand=value-top	\N	t	f	2026-09-13 07:18:11.884	2026-09-13 07:18:11.884
cmtzhfiy5005v99c9uo5kgj5w	Cougar	cougar	cmtvrso66000vcqht8s28afg9	2	13	/products?category=components&sub=computer-case&brand=cougar	\N	t	f	2026-09-13 07:18:11.885	2026-09-13 07:18:11.885
cmtzhfiy5005x99c9g2t2zqe0	PC Power	pc-power	cmtvrso66000vcqht8s28afg9	2	14	/products?category=components&sub=computer-case&brand=pc-power	\N	t	f	2026-09-13 07:18:11.886	2026-09-13 07:18:11.886
cmtzhfiy6005z99c9g69i8mn2	Monarch	monarch	cmtvrso66000vcqht8s28afg9	2	15	/products?category=components&sub=computer-case&brand=monarch	\N	t	f	2026-09-13 07:18:11.886	2026-09-13 07:18:11.886
cmtzhfiy6006199c9xgrxjb2f	Acer	acer	cmtvrso66000vcqht8s28afg9	2	16	/products?category=components&sub=computer-case&brand=acer	\N	t	f	2026-09-13 07:18:11.887	2026-09-13 07:18:11.887
cmtzhfiy7006399c9uvipoq8e	Carbono	carbono	cmtvrso66000vcqht8s28afg9	2	17	/products?category=components&sub=computer-case&brand=carbono	\N	t	f	2026-09-13 07:18:11.887	2026-09-13 07:18:11.887
cmtzhfiy8006599c9g133wuzk	T-Wolf	t-wolf	cmtvrso66000vcqht8s28afg9	2	18	/products?category=components&sub=computer-case&brand=t-wolf	\N	t	f	2026-09-13 07:18:11.888	2026-09-13 07:18:11.888
cmtzhfiy9006799c9tepbid7c	Arctic	arctic	cmtvrso66000vcqht8s28afg9	2	19	/products?category=components&sub=computer-case&brand=arctic	\N	t	f	2026-09-13 07:18:11.889	2026-09-13 07:18:11.889
cmtzhfiyb006999c9d5a8zjab	Cooler Master	cooler-master	cmtvrso66000vcqht8s28afg9	2	20	/products?category=components&sub=computer-case&brand=cooler-master	\N	t	f	2026-09-13 07:18:11.891	2026-09-13 07:18:11.891
cmtzhfiyc006b99c9gwk0y3pd	Adata	adata	cmtvrso66000vcqht8s28afg9	2	21	/products?category=components&sub=computer-case&brand=adata	\N	t	f	2026-09-13 07:18:11.893	2026-09-13 07:18:11.893
cmtzhfiyd006d99c9i0tvhg2i	Aigo	aigo	cmtvrso66000vcqht8s28afg9	2	22	/products?category=components&sub=computer-case&brand=aigo	\N	t	f	2026-09-13 07:18:11.894	2026-09-13 07:18:11.894
cmtzhfiye006f99c99txvyj1s	Apacer	apacer	cmtvrso66000vcqht8s28afg9	2	23	/products?category=components&sub=computer-case&brand=apacer	\N	t	f	2026-09-13 07:18:11.894	2026-09-13 07:18:11.894
cmtzhfiyf006h99c9ie8a9q7t	AVESTA	avesta	cmtvrso66000vcqht8s28afg9	2	24	/products?category=components&sub=computer-case&brand=avesta	\N	t	f	2026-09-13 07:18:11.895	2026-09-13 07:18:11.895
cmtzhfiyf006j99c9dmo2nr53	BitFenix	bitfenix	cmtvrso66000vcqht8s28afg9	2	25	/products?category=components&sub=computer-case&brand=bitfenix	\N	t	f	2026-09-13 07:18:11.896	2026-09-13 07:18:11.896
cmtzhfiyg006l99c9pe5l389n	Fantech	fantech	cmtvrso66000vcqht8s28afg9	2	26	/products?category=components&sub=computer-case&brand=fantech	\N	t	f	2026-09-13 07:18:11.896	2026-09-13 07:18:11.896
cmtzhfiyg006n99c9upg09xla	Fractal Design	fractal-design	cmtvrso66000vcqht8s28afg9	2	27	/products?category=components&sub=computer-case&brand=fractal-design	\N	t	f	2026-09-13 07:18:11.897	2026-09-13 07:18:11.897
cmtzhfiyh006p99c9f961xfq2	Golden Field	golden-field	cmtvrso66000vcqht8s28afg9	2	28	/products?category=components&sub=computer-case&brand=golden-field	\N	t	f	2026-09-13 07:18:11.897	2026-09-13 07:18:11.897
cmtzhfiyi006r99c9j0zfc6xt	Lian Li	lian-li	cmtvrso66000vcqht8s28afg9	2	29	/products?category=components&sub=computer-case&brand=lian-li	\N	t	f	2026-09-13 07:18:11.898	2026-09-13 07:18:11.898
cmtzhfiyj006t99c96yoblzsf	Phanteks	phanteks	cmtvrso66000vcqht8s28afg9	2	30	/products?category=components&sub=computer-case&brand=phanteks	\N	t	f	2026-09-13 07:18:11.899	2026-09-13 07:18:11.899
cmtzhfiyk006v99c9eov8ej3n	Razer	razer	cmtvrso66000vcqht8s28afg9	2	31	/products?category=components&sub=computer-case&brand=razer	\N	t	f	2026-09-13 07:18:11.9	2026-09-13 07:18:11.9
cmtzhfiyk006x99c9b61j2k9u	Rosewill	rosewill	cmtvrso66000vcqht8s28afg9	2	32	/products?category=components&sub=computer-case&brand=rosewill	\N	t	f	2026-09-13 07:18:11.901	2026-09-13 07:18:11.901
cmtzhfiyl006z99c9plh0tcw4	Sapphire	sapphire	cmtvrso66000vcqht8s28afg9	2	33	/products?category=components&sub=computer-case&brand=sapphire	\N	t	f	2026-09-13 07:18:11.901	2026-09-13 07:18:11.901
cmtzhfiym007199c99qjcusnk	SilverStone	silverstone	cmtvrso66000vcqht8s28afg9	2	34	/products?category=components&sub=computer-case&brand=silverstone	\N	t	f	2026-09-13 07:18:11.902	2026-09-13 07:18:11.902
cmtzhfiym007399c99yka744b	Thermaltake	thermaltake	cmtvrso66000vcqht8s28afg9	2	35	/products?category=components&sub=computer-case&brand=thermaltake	\N	t	f	2026-09-13 07:18:11.903	2026-09-13 07:18:11.903
cmtzhfiyn007599c99cr4tgzs	Zalman	zalman	cmtvrso66000vcqht8s28afg9	2	36	/products?category=components&sub=computer-case&brand=zalman	\N	t	f	2026-09-13 07:18:11.903	2026-09-13 07:18:11.903
cmtzhfiyo007799c9knxlftz0	ARS	ars	cmtvrso66000vcqht8s28afg9	2	37	/products?category=components&sub=computer-case&brand=ars	\N	t	f	2026-09-13 07:18:11.904	2026-09-13 07:18:11.904
cmtzhfiyq007999c9egaexmcs	MSI	msi	cmtvrso5s0009cqhts9qs9ek5	2	0	/products?category=components&sub=cpu-cooler&brand=msi	\N	t	f	2026-09-13 07:18:11.906	2026-09-13 07:18:11.906
cmtzhfiyq007b99c9stedgsa1	Antec	antec	cmtvrso5s0009cqhts9qs9ek5	2	1	/products?category=components&sub=cpu-cooler&brand=antec	\N	t	f	2026-09-13 07:18:11.907	2026-09-13 07:18:11.907
cmtzhfiyr007d99c9ofdjku50	Gamdias	gamdias	cmtvrso5s0009cqhts9qs9ek5	2	2	/products?category=components&sub=cpu-cooler&brand=gamdias	\N	t	f	2026-09-13 07:18:11.907	2026-09-13 07:18:11.907
cmtzhfiys007f99c9skjesbb5	ARCTIC	arctic	cmtvrso5s0009cqhts9qs9ek5	2	3	/products?category=components&sub=cpu-cooler&brand=arctic	\N	t	f	2026-09-13 07:18:11.908	2026-09-13 07:18:11.908
cmtzhfiyt007h99c99bz1f0hi	Corsair	corsair	cmtvrso5s0009cqhts9qs9ek5	2	4	/products?category=components&sub=cpu-cooler&brand=corsair	\N	t	f	2026-09-13 07:18:11.909	2026-09-13 07:18:11.909
cmtzhfiyt007j99c9iyxnb2op	Ocypus	ocypus	cmtvrso5s0009cqhts9qs9ek5	2	5	/products?category=components&sub=cpu-cooler&brand=ocypus	\N	t	f	2026-09-13 07:18:11.91	2026-09-13 07:18:11.91
cmtzhfiyu007l99c9f6jlrefh	DeepCool	deepcool	cmtvrso5s0009cqhts9qs9ek5	2	6	/products?category=components&sub=cpu-cooler&brand=deepcool	\N	t	f	2026-09-13 07:18:11.911	2026-09-13 07:18:11.911
cmtzhfiyv007n99c9jzzc4qj9	Asus	asus	cmtvrso5s0009cqhts9qs9ek5	2	7	/products?category=components&sub=cpu-cooler&brand=asus	\N	t	f	2026-09-13 07:18:11.911	2026-09-13 07:18:11.911
cmtzhfiyv007p99c9p41wf7ab	1STPLAYER	1stplayer	cmtvrso5s0009cqhts9qs9ek5	2	8	/products?category=components&sub=cpu-cooler&brand=1stplayer	\N	t	f	2026-09-13 07:18:11.912	2026-09-13 07:18:11.912
cmtzhfiyw007r99c9svrddssm	NZXT	nzxt	cmtvrso5s0009cqhts9qs9ek5	2	9	/products?category=components&sub=cpu-cooler&brand=nzxt	\N	t	f	2026-09-13 07:18:11.912	2026-09-13 07:18:11.912
cmtzhfiyw007t99c9564ryrus	Cooler Master	cooler-master	cmtvrso5s0009cqhts9qs9ek5	2	10	/products?category=components&sub=cpu-cooler&brand=cooler-master	\N	t	f	2026-09-13 07:18:11.913	2026-09-13 07:18:11.913
cmtzhfiyx007v99c9ghujuht3	Cougar	cougar	cmtvrso5s0009cqhts9qs9ek5	2	11	/products?category=components&sub=cpu-cooler&brand=cougar	\N	t	f	2026-09-13 07:18:11.914	2026-09-13 07:18:11.914
cmtzhfiyy007x99c9ssb4pght	Gigabyte	gigabyte	cmtvrso5s0009cqhts9qs9ek5	2	12	/products?category=components&sub=cpu-cooler&brand=gigabyte	\N	t	f	2026-09-13 07:18:11.914	2026-09-13 07:18:11.914
cmtzhfiyy007z99c9h757b5l3	Xigmatek	xigmatek	cmtvrso5s0009cqhts9qs9ek5	2	13	/products?category=components&sub=cpu-cooler&brand=xigmatek	\N	t	f	2026-09-13 07:18:11.915	2026-09-13 07:18:11.915
cmtzhfiyz008199c9xupfbawp	Xtreme	xtreme	cmtvrso5s0009cqhts9qs9ek5	2	14	/products?category=components&sub=cpu-cooler&brand=xtreme	\N	t	f	2026-09-13 07:18:11.915	2026-09-13 07:18:11.915
cmtzhfiyz008399c99iyo3yy5	TEAM	team	cmtvrso5s0009cqhts9qs9ek5	2	15	/products?category=components&sub=cpu-cooler&brand=team	\N	t	f	2026-09-13 07:18:11.916	2026-09-13 07:18:11.916
cmtzhfiz0008599c9y8xunrfx	upHere	uphere	cmtvrso5s0009cqhts9qs9ek5	2	16	/products?category=components&sub=cpu-cooler&brand=uphere	\N	t	f	2026-09-13 07:18:11.916	2026-09-13 07:18:11.916
cmtzhfiz1008799c9ksxtr1sc	Yeston	yeston	cmtvrso5s0009cqhts9qs9ek5	2	17	/products?category=components&sub=cpu-cooler&brand=yeston	\N	t	f	2026-09-13 07:18:11.917	2026-09-13 07:18:11.917
cmtzhfiz1008999c9xzyh7kpa	Value-Top	value-top	cmtvrso5s0009cqhts9qs9ek5	2	18	/products?category=components&sub=cpu-cooler&brand=value-top	\N	t	f	2026-09-13 07:18:11.918	2026-09-13 07:18:11.918
cmtzhfiz2008b99c9w27e074c	Lian Li	lian-li	cmtvrso5s0009cqhts9qs9ek5	2	19	/products?category=components&sub=cpu-cooler&brand=lian-li	\N	t	f	2026-09-13 07:18:11.918	2026-09-13 07:18:11.918
cmtzhfiz3008d99c9ng06rzzs	Thermaltake	thermaltake	cmtvrso5s0009cqhts9qs9ek5	2	20	/products?category=components&sub=cpu-cooler&brand=thermaltake	\N	t	f	2026-09-13 07:18:11.919	2026-09-13 07:18:11.919
cmtzhfiz4008f99c92q2a644y	Noctua	noctua	cmtvrso5s0009cqhts9qs9ek5	2	21	/products?category=components&sub=cpu-cooler&brand=noctua	\N	t	f	2026-09-13 07:18:11.92	2026-09-13 07:18:11.92
cmtzhfiz4008h99c95fkb6tcf	Montech	montech	cmtvrso5s0009cqhts9qs9ek5	2	22	/products?category=components&sub=cpu-cooler&brand=montech	\N	t	f	2026-09-13 07:18:11.921	2026-09-13 07:18:11.921
cmtzhfiz5008j99c9d5g420bp	PNY	pny	cmtvrso5s0009cqhts9qs9ek5	2	23	/products?category=components&sub=cpu-cooler&brand=pny	\N	t	f	2026-09-13 07:18:11.922	2026-09-13 07:18:11.922
cmtzhfiz6008l99c9qhb26i2j	Aorus	aorus	cmtvrso5s0009cqhts9qs9ek5	2	24	/products?category=components&sub=cpu-cooler&brand=aorus	\N	t	f	2026-09-13 07:18:11.922	2026-09-13 07:18:11.922
cmtzhfiz6008n99c9ypu46o5u	APC	apc	cmtvrso5s0009cqhts9qs9ek5	2	25	/products?category=components&sub=cpu-cooler&brand=apc	\N	t	f	2026-09-13 07:18:11.923	2026-09-13 07:18:11.923
cmtzhfiz7008p99c99ns1wznb	Havit	havit	cmtvrso5s0009cqhts9qs9ek5	2	26	/products?category=components&sub=cpu-cooler&brand=havit	\N	t	f	2026-09-13 07:18:11.923	2026-09-13 07:18:11.923
cmtvrso5m0003cqhtz06extfa	Processor	processor	cmtvrso5i0001cqht6cpf5xcc	1	0	\N	\N	t	f	2026-09-10 16:57:16.619	2026-09-14 10:54:35.084
cmu14lnj1000114nj4gwkhwub	Hard Disk Drive	hdd	cmtvrso5i0001cqht6cpf5xcc	1	7	\N	\N	t	f	2026-09-14 10:54:35.102	2026-09-14 10:54:35.102
cmu14lnj5000314njobbbhwnt	Portable Hard Disk Drive	portable-hdd	cmtvrso5i0001cqht6cpf5xcc	1	8	\N	\N	t	f	2026-09-14 10:54:35.105	2026-09-14 10:54:35.105
cmu14lnj8000514njtxk4wy74	Portable SSD	portable-ssd	cmtvrso5i0001cqht6cpf5xcc	1	10	\N	\N	t	f	2026-09-14 10:54:35.108	2026-09-14 10:54:35.108
cmu14lnjb000714nj1mp08tds	Casing Cooler	casing-fan	cmtvrso5i0001cqht6cpf5xcc	1	12	\N	\N	t	f	2026-09-14 10:54:35.111	2026-09-14 10:54:35.111
cmu14lnjc000914njucl4r04g	Optical Disk Drive	optical-disk-drive	cmtvrso5i0001cqht6cpf5xcc	1	13	\N	\N	t	f	2026-09-14 10:54:35.113	2026-09-14 10:54:35.113
cmu14lnje000b14nj6npf8drm	Vertical GPU Holder	gpu-vertical-mount	cmtvrso5i0001cqht6cpf5xcc	1	14	\N	\N	t	f	2026-09-14 10:54:35.114	2026-09-14 10:54:35.114
cmu14lnjf000d14njgvv4a8vf	Water / Liquid Cooling	liquid-cooling	cmtvrso5i0001cqht6cpf5xcc	1	15	\N	\N	t	f	2026-09-14 10:54:35.115	2026-09-14 10:54:35.115
cmtvrso67000xcqht3z8j8i8o	Show All Component	components-all	cmtvrso5i0001cqht6cpf5xcc	1	16	/products?category=components	\N	t	t	2026-09-10 16:57:16.639	2026-09-14 10:54:35.117
cmu14qxx00001zcwk5ermibvr	MSI	msi	cmtvrso68000zcqhtir5n1cjn	1	0	/products?category=monitor&brand=msi	\N	t	t	2026-09-14 10:58:41.844	2026-09-14 10:58:41.844
cmu14qxx30003zcwkf2jf3z3i	AOC	aoc	cmtvrso68000zcqhtir5n1cjn	1	1	/products?category=monitor&brand=aoc	\N	t	t	2026-09-14 10:58:41.848	2026-09-14 10:58:41.848
cmu14qxx60005zcwkcy2nnpem	Asus	asus	cmtvrso68000zcqhtir5n1cjn	1	2	/products?category=monitor&brand=asus	\N	t	t	2026-09-14 10:58:41.85	2026-09-14 10:58:41.85
cmu14qxx90007zcwkfvkuv2mu	Lenovo	lenovo	cmtvrso68000zcqhtir5n1cjn	1	3	/products?category=monitor&brand=lenovo	\N	t	t	2026-09-14 10:58:41.853	2026-09-14 10:58:41.853
cmu14qxxb0009zcwks1o23e36	BenQ	benq	cmtvrso68000zcqhtir5n1cjn	1	4	/products?category=monitor&brand=benq	\N	t	t	2026-09-14 10:58:41.855	2026-09-14 10:58:41.855
cmu14qxxc000bzcwkzfg141f1	LG	lg	cmtvrso68000zcqhtir5n1cjn	1	5	/products?category=monitor&brand=lg	\N	t	t	2026-09-14 10:58:41.857	2026-09-14 10:58:41.857
cmu14qxxe000dzcwkrlmw15p1	Acer	acer	cmtvrso68000zcqhtir5n1cjn	1	6	/products?category=monitor&brand=acer	\N	t	t	2026-09-14 10:58:41.858	2026-09-14 10:58:41.858
cmu14qxxg000fzcwkdsh0uf3r	HP	hp	cmtvrso68000zcqhtir5n1cjn	1	7	/products?category=monitor&brand=hp	\N	t	t	2026-09-14 10:58:41.861	2026-09-14 10:58:41.861
cmu14qxxi000hzcwk2qo1oho1	Dell	dell	cmtvrso68000zcqhtir5n1cjn	1	8	/products?category=monitor&brand=dell	\N	t	t	2026-09-14 10:58:41.862	2026-09-14 10:58:41.862
cmu14qxxj000jzcwkkrvktnqw	Samsung	samsung	cmtvrso68000zcqhtir5n1cjn	1	9	/products?category=monitor&brand=samsung	\N	t	t	2026-09-14 10:58:41.864	2026-09-14 10:58:41.864
cmu14qxxk000lzcwky93cylbm	Gigabyte	gigabyte	cmtvrso68000zcqhtir5n1cjn	1	10	/products?category=monitor&brand=gigabyte	\N	t	t	2026-09-14 10:58:41.865	2026-09-14 10:58:41.865
cmu14qxxm000nzcwknyy4xuvb	Philips	philips	cmtvrso68000zcqhtir5n1cjn	1	11	/products?category=monitor&brand=philips	\N	t	t	2026-09-14 10:58:41.866	2026-09-14 10:58:41.866
cmu14qxxn000pzcwk9yln3j0o	Viewsonic	viewsonic	cmtvrso68000zcqhtir5n1cjn	1	12	/products?category=monitor&brand=viewsonic	\N	t	t	2026-09-14 10:58:41.867	2026-09-14 10:58:41.867
cmu14qxxo000rzcwkdrm3n6bz	Corsair	corsair	cmtvrso68000zcqhtir5n1cjn	1	13	/products?category=monitor&brand=corsair	\N	t	t	2026-09-14 10:58:41.869	2026-09-14 10:58:41.869
cmu14qxxq000tzcwksju8t8t3	ThunderRobot	thunderrobot	cmtvrso68000zcqhtir5n1cjn	1	14	/products?category=monitor&brand=thunderrobot	\N	t	t	2026-09-14 10:58:41.871	2026-09-14 10:58:41.871
cmu14qxxs000vzcwk4ow2panl	Koorui	koorui	cmtvrso68000zcqhtir5n1cjn	1	15	/products?category=monitor&brand=koorui	\N	t	t	2026-09-14 10:58:41.872	2026-09-14 10:58:41.872
cmu14qxxu000xzcwkhahm2deg	Dahua	dahua	cmtvrso68000zcqhtir5n1cjn	1	16	/products?category=monitor&brand=dahua	\N	t	t	2026-09-14 10:58:41.874	2026-09-14 10:58:41.874
cmu14qxxv000zzcwkqwyvhe99	PC Power	pc-power	cmtvrso68000zcqhtir5n1cjn	1	17	/products?category=monitor&brand=pc-power	\N	t	t	2026-09-14 10:58:41.876	2026-09-14 10:58:41.876
cmu14qxxw0011zcwkaig68pct	Hikvision	hikvision	cmtvrso68000zcqhtir5n1cjn	1	18	/products?category=monitor&brand=hikvision	\N	t	t	2026-09-14 10:58:41.877	2026-09-14 10:58:41.877
cmu14qxxy0013zcwk7u2ybcom	Eurovision	eurovision	cmtvrso68000zcqhtir5n1cjn	1	19	/products?category=monitor&brand=eurovision	\N	t	t	2026-09-14 10:58:41.878	2026-09-14 10:58:41.878
cmu14qxy00015zcwk0db247ea	Walton	walton	cmtvrso68000zcqhtir5n1cjn	1	20	/products?category=monitor&brand=walton	\N	t	t	2026-09-14 10:58:41.88	2026-09-14 10:58:41.88
cmu14qxy10017zcwk2vxqcyxg	Arzopa	arzopa	cmtvrso68000zcqhtir5n1cjn	1	21	/products?category=monitor&brand=arzopa	\N	t	t	2026-09-14 10:58:41.882	2026-09-14 10:58:41.882
cmu14qxy20019zcwkmu7eq7ae	GEESUU	geesuu	cmtvrso68000zcqhtir5n1cjn	1	22	/products?category=monitor&brand=geesuu	\N	t	t	2026-09-14 10:58:41.883	2026-09-14 10:58:41.883
cmu14qxy4001bzcwkq6vz4044	Titan Army	titan-army	cmtvrso68000zcqhtir5n1cjn	1	23	/products?category=monitor&brand=titan-army	\N	t	t	2026-09-14 10:58:41.884	2026-09-14 10:58:41.884
cmu14qxy5001dzcwkhm53udgg	Value-Top	value-top	cmtvrso68000zcqhtir5n1cjn	1	24	/products?category=monitor&brand=value-top	\N	t	t	2026-09-14 10:58:41.885	2026-09-14 10:58:41.885
cmu14qxy6001fzcwkmkdbc1v7	AIWA	aiwa	cmtvrso68000zcqhtir5n1cjn	1	25	/products?category=monitor&brand=aiwa	\N	t	t	2026-09-14 10:58:41.887	2026-09-14 10:58:41.887
cmu14qxy8001hzcwk7gi9bccs	Xiaomi	xiaomi	cmtvrso68000zcqhtir5n1cjn	1	26	/products?category=monitor&brand=xiaomi	\N	t	t	2026-09-14 10:58:41.888	2026-09-14 10:58:41.888
cmu14qxya001jzcwkck0ewilt	Fopo	fopo	cmtvrso68000zcqhtir5n1cjn	1	27	/products?category=monitor&brand=fopo	\N	t	t	2026-09-14 10:58:41.89	2026-09-14 10:58:41.89
cmu14qxyc001lzcwkvfx8omts	Gigasonic	gigasonic	cmtvrso68000zcqhtir5n1cjn	1	28	/products?category=monitor&brand=gigasonic	\N	t	t	2026-09-14 10:58:41.892	2026-09-14 10:58:41.892
cmu14qxyd001nzcwkdm51d79y	TrendSonic	trendsonic	cmtvrso68000zcqhtir5n1cjn	1	29	/products?category=monitor&brand=trendsonic	\N	t	t	2026-09-14 10:58:41.894	2026-09-14 10:58:41.894
cmu14qxyf001pzcwkssb3hcgj	FeuVision	feuvision	cmtvrso68000zcqhtir5n1cjn	1	30	/products?category=monitor&brand=feuvision	\N	t	t	2026-09-14 10:58:41.895	2026-09-14 10:58:41.895
cmu14qxyg001rzcwkmd1ty7tm	Gaming Monitor	gaming-monitor	cmtvrso68000zcqhtir5n1cjn	1	31	/products?category=monitor&sub=gaming-monitor	\N	t	t	2026-09-14 10:58:41.896	2026-09-14 10:58:41.896
cmu14qxyh001tzcwk8ubf2tuv	Curved Monitor	curved-monitor	cmtvrso68000zcqhtir5n1cjn	1	32	/products?category=monitor&sub=curved-monitor	\N	t	t	2026-09-14 10:58:41.897	2026-09-14 10:58:41.897
cmu14qxyi001vzcwkio7zo9vi	Touch Monitor	touch-monitor	cmtvrso68000zcqhtir5n1cjn	1	33	/products?category=monitor&sub=touch-monitor	\N	t	t	2026-09-14 10:58:41.898	2026-09-14 10:58:41.898
cmu14qxyk001xzcwky43b6pgl	4K Monitor	4k-monitor	cmtvrso68000zcqhtir5n1cjn	1	34	/products?category=monitor&sub=4k-monitor	\N	t	t	2026-09-14 10:58:41.9	2026-09-14 10:58:41.9
cmu14qxyl001zzcwkiagu12cc	Portable Monitor	portable-monitor	cmtvrso68000zcqhtir5n1cjn	1	35	/products?category=monitor&sub=portable-monitor	\N	t	t	2026-09-14 10:58:41.902	2026-09-14 10:58:41.902
cmu14qxyn0021zcwkat8yl2vi	Monitor Arm	monitor-arm	cmtvrso68000zcqhtir5n1cjn	1	36	/products?category=monitor&sub=monitor-arm	\N	t	t	2026-09-14 10:58:41.903	2026-09-14 10:58:41.903
cmu14qxyo0023zcwk45izfzkg	Show All Monitor	monitor-all	cmtvrso68000zcqhtir5n1cjn	1	37	/products?category=monitor	\N	t	t	2026-09-14 10:58:41.904	2026-09-14 10:58:41.904
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, "productId", url, alt, "order", "isPrimary", "createdAt") FROM stdin;
cmr9jbaxd000nt1wvndp217jt	cmr9esnv10002t1wvup6a0f8w	https://www.techlandbd.com/cache/images/uploads/products/P0322511005/gigabyte-graphics-card-geforce-rtx-5060-aero-oc-8g-cover.webp	Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card	0	t	2026-07-06 18:09:28.85
cmrdav7j10003gb3wnb3kzs63	cmrdav7iw0002gb3wq5ky2u80	https://www.startech.com.bd/image/cache/catalog/motherboard/msi/pro-h610m-e-ddr4/pro-h610m-e-ddr4-01-500x500.webp	MSI PRO H610M-E DDR4 mATX Motherboard	0	t	2026-07-09 09:24:05.725
cmrdav7j10004gb3wq2iaqr8q	cmrdav7iw0002gb3wq5ky2u80	https://www.startech.com.bd/image/cache/catalog/motherboard/msi/pro-h610m-e-ddr4/pro-h610m-e-ddr4-03-500x500.webp	MSI PRO H610M-E DDR4 mATX Motherboard	1	f	2026-07-09 09:24:05.725
cmtn590bl0004jq5x6ufzdxci	cmtn590bg0003jq5xqmmmsw7w	https://placehold.co/800x800/1a1a1a/ffffff/png?text=PELADN+GT+730+4GB	PELADN GeForce KaiTian GT 730 4GB GDDR3 Graphics Card	0	t	2026-09-04 16:03:58.306
cmtn5e2zv0004udp6drfbdw1m	cmtn5e2zr0003udp6yvyg5ila	https://placehold.co/800x800/111111/e11d48/png?text=Sapphire+RX+6600+XT	Sapphire Pulse AMD Radeon RX 6600 XT Gaming OC 8GB GDDR6 Graphics Card	0	t	2026-09-04 16:07:55.052
cmtn5tr3w000ldjdeknjlfgls	cmtn5tr3t000kdjded7l6qx1m	https://placehold.co/800x800/111111/ffffff/png?text=TEAM+ELITE+8GB+Laptop+RAM	TEAM ELITE 8GB 3200MHz Laptop RAM	0	t	2026-09-04 16:20:06.141
cmu1dbkyw000p2hq4lxfrp9g0	cmr9bvsa7004jnjjlzqzyt643	https://www.startech.com.bd/image/cache/catalog/processor/amd/5600x/5600x-001-500x500.jpg	AMD Ryzen 5 5600X	0	t	2026-09-14 14:58:41.768
cmu1h8rzd0001bpnxr51w1ip9	cmrcbkzit001a5menuqtjvxca	https://www.startech.com.bd/image/cache/catalog/processor/intel/i5-14400/i5-14400-01-500x500.webp	Intel Core i5 14400F 14th Gen Raptor Lake Processor	0	t	2026-09-14 16:48:29.354
cmu1hwflo0001yid2ltot1uox	cmr9bvs9s0042njjlfqeg1cdv	https://www.startech.com.bd/image/cache/catalog/processor/intel/i5-12400/i5-12400-001-500x500.jpg	Intel Core i5-12400F	0	t	2026-09-14 17:06:53.053
cmu2p7k3j003faap1oqmnu98c	cmu2p7k3d003eaap1g3pu2qg3	/uploads/processors/i5-14600k.jpg	Intel Core i5-14600K	0	t	2026-09-15 13:19:15.583
cmu2p7k4v0042aap1voy6ij0x	cmu2p7k4u0041aap1z5iwkuq2	/uploads/processors/ryzen-7-7800x3d.jpg	AMD Ryzen 7 7800X3D	0	t	2026-09-15 13:19:15.632
cmu2p7k75004paap1b13msdll	cmu2p7k73004oaap136n88e7i	/uploads/processors/ultra-7-265k.jpg	Intel Core Ultra 7 265K	0	t	2026-09-15 13:19:15.713
cmu2p7k8r005caap1u0r7z5k8	cmu2p7k8p005baap13y3b5gko	/uploads/processors/ryzen-5-7600.jpg	AMD Ryzen 5 7600	0	t	2026-09-15 13:19:15.772
cmu2p7ka0005zaap1paywarex	cmu2p7k9z005yaap11hik0ma8	/uploads/processors/i7-14700k.jpg	Intel Core i7-14700K	0	t	2026-09-15 13:19:15.817
cmu2p7kb4006maap1brnfj7kp	cmu2p7kb3006laap1k0e6z4b3	/uploads/processors/ryzen-9-7950x.jpg	AMD Ryzen 9 7950X	0	t	2026-09-15 13:19:15.857
cmu2p7kca0079aap1rmur3aib	cmu2p7kc80078aap1yam8femo	/uploads/processors/i3-14100.jpg	Intel Core i3-14100	0	t	2026-09-15 13:19:15.898
cmu3w20lv000muyr5rknpaw2s	cmu2p7kdf007vaap1w8ihfmcu	https://www.ultratech.com.bd/image/cache/2022/07/AMD-Ryzen-5-5600-Processor-500x500.jpg	AMD Ryzen 5 5600	0	t	2026-09-16 09:18:40.531
cmu3w20lv000nuyr5841r1idt	cmu2p7kdf007vaap1w8ihfmcu	https://www.custompc.com/wp-content/sites/custompc/2022/05/AMD-Ryzen-5-5600-review.jpg	AMD Ryzen 5 5600 Desktop Processor	1	f	2026-09-16 09:18:40.531
cmu6pynux00bj14lfzem8zmds	cmu6pynux00bi14lfx6crv5wy	/uploads/motherboards/asrock-a520m-hvs-amd-am4-micro-atx-motherboard.webp	ASRock A520M-HVS AMD AM4 Micro ATX Motherboard	0	t	2026-09-18 08:51:24.874
cmu6pynqd007n14lfu8qce8dy	cmu6pynqc007m14lfu9ra7yvv	/uploads/motherboards/asus-prime-a520m-a-ii-am4-micro-atx-motherboard.webp	Asus PRIME A520M-A II AM4 micro ATX Motherboard	0	t	2026-09-18 08:51:24.709
cmu6pynnu005f14lfic5axgzd	cmu6pynnt005e14lf46rlo8dw	/uploads/motherboards/asus-prime-a520m-k-am4-micro-atx-amd-motherboard.jpg	Asus Prime A520M-K AM4 Micro-ATX AMD Motherboard	0	t	2026-09-18 08:51:24.618
cmu6pynn7004v14lfhkshf3st	cmu6pynn6004u14lf1upst9p2	/uploads/motherboards/asus-prime-a520m-r-am4-micro-atx-motherboard.webp	Asus PRIME A520M-R AM4 micro ATX Motherboard	0	t	2026-09-18 08:51:24.595
cmu6pynoh005z14lf6yv8s0df	cmu6pynog005y14lf22i6m8d1	/uploads/motherboards/asus-prime-h610m-f-d4-r2-0-ddr4-lga1700-matx-motherboard.webp	ASUS PRIME H610M-F D4 R2.0 DDR4 LGA1700 mATX Motherboard	0	t	2026-09-18 08:51:24.642
cmu6pynp4006j14lfplxzvrwg	cmu6pynp3006i14lfiw3ej7xk	/uploads/motherboards/asus-prime-h610m-r-d4-ddr4-lga1700-matx-motherboard.webp	ASUS PRIME H610M-R D4 DDR4 LGA1700 mATX Motherboard	0	t	2026-09-18 08:51:24.665
cmu6pynpr007314lf6sxucwqo	cmu6pynpq007214lfxnazof8b	/uploads/motherboards/asus-prime-h610m-r-ddr5-lga1700-matx-motherboard.webp	ASUS PRIME H610M-R DDR5 LGA1700 mATX Motherboard	0	t	2026-09-18 08:51:24.688
cmu6pynr1008714lftv2kp7u3	cmu6pynr0008614lf9j7jqodq	/uploads/motherboards/gigabyte-a520m-k-v2-am4-micro-atx-motherboard.webp	GIGABYTE A520M K V2 AM4 Micro ATX Motherboard	0	t	2026-09-18 08:51:24.733
cmu6pynu700az14lf3y5ed9mj	cmu6pynu700ay14lf9u2x0psh	/uploads/motherboards/gigabyte-a620m-h-am5-micro-atx-motherboard.webp	GIGABYTE A620M H AM5 Micro-ATX Motherboard	0	t	2026-09-18 08:51:24.848
cmu6pynrm008r14lf9pva5ohs	cmu6pynrl008q14lf6340ni1v	/uploads/motherboards/gigabyte-b450m-k-amd-am4-micro-atx-motherboard.webp	GIGABYTE B450M K AMD AM4 Micro ATX Motherboard	0	t	2026-09-18 08:51:24.754
cmu6pynsy009v14lfvdn0fayh	cmu6pynsx009u14lflgy1fc53	/uploads/motherboards/gigabyte-h610m-h-ddr4-micro-atx-motherboard.jpg	GIGABYTE H610M H DDR4 Micro ATX Motherboard	0	t	2026-09-18 08:51:24.803
cmu6pynsa009b14lf07ja27l8	cmu6pyns9009a14lfmpt8ulet	/uploads/motherboards/gigabyte-h610m-k-ddr4-micro-atx-motherboard.webp	GIGABYTE H610M K DDR4 Micro ATX Motherboard	0	t	2026-09-18 08:51:24.779
cmu6pyntl00af14lftp6tjdwl	cmu6pyntk00ae14lfm0qqeg8e	/uploads/motherboards/gigabyte-h610m-k-ddr5-micro-atx-motherboard.webp	GIGABYTE H610M K DDR5 Micro ATX Motherboard	0	t	2026-09-18 08:51:24.826
cmu6pynla003r14lf17h4yjuo	cmu6pynl9003q14lfiwe0pdd4	/uploads/motherboards/msi-a520m-a-pro-am4-amd-micro-atx-motherboard.jpg	MSI A520M-A Pro AM4 AMD Micro-ATX Motherboard	0	t	2026-09-18 08:51:24.526
cmu6pynm8004b14lf84eb0ok2	cmu6pynm6004a14lfbyp1ggq0	/uploads/motherboards/msi-b550m-a-pro-ddr4-amd-am4-micro-atx-motherboard.jpg	MSI B550M-A PRO DDR4 AMD AM4 Micro ATX Motherboard	0	t	2026-09-18 08:51:24.56
cmu6pynk6003714lf9z731qwq	cmu6pynk5003614lfs7alffu6	/uploads/motherboards/msi-pro-a620m-e-amd-am5-matx-motherboard.webp	MSI PRO A620M-E AMD AM5 mATX Motherboard	0	t	2026-09-18 08:51:24.487
cmrdcb3ek000zgb3w3bdeq7y4	cmrdc2oe5000ggb3wsfqedq5d	/uploads/motherboards/msi-pro-h610m-g-wifi-ddr4-lga1700-motherboard.webp	MSI PRO H610M-E DDR4 mATX Motherboard	0	t	2026-07-09 10:04:26.493
cmu6pyni1002314lfr2pnwv4o	cmu6pynhp002214lfh21ky430	/uploads/motherboards/msi-pro-h610m-g-ddr4-micro-atx-motherboard.jpg	MSI PRO H610M-G DDR4 Micro-ATX Motherboard	0	t	2026-09-18 08:51:24.41
cmu6pynj9002n14lfqhqoz00k	cmu6pynj8002m14lfy6mvvgq9	/uploads/motherboards/msi-pro-h610m-g-ddr5-matx-motherboard.webp	MSI PRO H610M-G DDR5 mATX Motherboard	0	t	2026-09-18 08:51:24.454
cmu6r4gbe0048eqewumayw9st	cmu6r4gbd0047eqewx63iixqf	/uploads/ram/aitc-kingsman-innovator-8gb-ddr4-3200mhz-desktop-ram-black.webp	AITC Kingsman Innovator 8GB DDR4 3200MHz Desktop RAM Black	0	t	2026-09-18 09:23:54.65
cmu6r4gib0097eqewn17tynzu	cmu6r4gia0096eqew48z4sl8h	/uploads/ram/aitc-kingsman-rgb-8gb-ddr4-3200mhz-gaming-desktop-ram.webp	AITC Kingsman RGB 8GB DDR4 3200MHz Gaming Desktop RAM	0	t	2026-09-18 09:23:54.899
cmu6r4gcc004weqewdepltl4q	cmu6r4gcb004veqew06h8boj6	/uploads/ram/colorful-battle-ax-16gb-ddr5-6000mhz-cl40-desktop-ram.webp	Colorful Battle-AX 16GB DDR5 6000MHz CL40 Desktop RAM	0	t	2026-09-18 09:23:54.685
cmu6r4g7d001eeqewxqx2fn8i	cmu6r4g7c001deqew5xd51myk	/uploads/ram/corsair-vengeance-lpx-8gb-3200mhz-ddr4-desktop-ram.png	Corsair Vengeance LPX 8GB 3200MHz DDR4 Desktop RAM	0	t	2026-09-18 09:23:54.505
cmu6r4gf3006veqewj39aw2nv	cmu6r4gf2006ueqewbz1ejqzu	/uploads/ram/corsair-vengeance-rgb-pro-sl-8gb-ddr4-3200mhz-desktop-ram.webp	CORSAIR Vengeance RGB PRO SL 8GB DDR4 3200MHz Desktop RAM	0	t	2026-09-18 09:23:54.783
cmu6r4g7t001peqewe06n5bju	cmu6r4g7s001oeqew5evuclei	/uploads/ram/g-skill-aegis-8gb-ddr4-3200mhz-desktop-ram.webp	G.SKILL Aegis 8GB DDR4 3200Mhz Desktop RAM	0	t	2026-09-18 09:23:54.522
cmu6r4gfj0078eqewdoavlwgd	cmu6r4gfi0077eqewdbl8c9xu	/uploads/ram/g-skill-value-8gb-ddr4-2666mhz-desktop-ram.webp	G.SKILL Value 8GB DDR4 2666Mhz Desktop RAM	0	t	2026-09-18 09:23:54.8
cmu6r4gbv004keqewd0iube6q	cmu6r4gbu004jeqewdasszspy	/uploads/ram/kimtigo-wolfrine-8gb-3200mhz-ddr4-udimm-desktop-ram-white.webp	Kimtigo WOLFRINE 8GB 3200MHz DDR4 UDIMM Desktop RAM White	0	t	2026-09-18 09:23:54.667
cmu6r4gdc005keqewi3qgs9o5	cmu6r4gdb005jeqewi00quivx	/uploads/ram/kingbank-kjxb-8gb-ddr4-3200mhz-desktop-ram.webp	KingBank KJXB 8GB DDR4 3200MHz Desktop RAM	0	t	2026-09-18 09:23:54.72
cmu6r4gep006keqewpijis5pv	cmu6r4geo006jeqew6cc81d02	/uploads/ram/kingston-fury-beast-16gb-3200mhz-ddr4-desktop-ram.jpg	Kingston FURY Beast 16GB 3200MHz DDR4 Desktop RAM	0	t	2026-09-18 09:23:54.77
cmu6r4g6k0013eqewr6kj7u2u	cmu6r4g6a0012eqewtktu2yyy	/uploads/ram/kingston-fury-beast-8gb-3200mhz-ddr4-desktop-ram.jpg	Kingston FURY Beast 8GB 3200MHz DDR4 Desktop RAM	0	t	2026-09-18 09:23:54.476
cmu6r4gdq005veqewzoaddyrh	cmu6r4gdo005ueqewevlonqz0	/uploads/ram/lexar-16gb-ddr4-3200mhz-desktop-ram.webp	Lexar 16GB DDR4 3200Mhz Desktop RAM	0	t	2026-09-18 09:23:54.735
cmu6r4g96002neqewhxd8x1ap	cmu6r4g95002meqewhxmnbb1h	/uploads/ram/lexar-thor-8gb-ddr4-3200mhz-udimm-desktop-ram.webp	Lexar THOR 8GB DDR4 3200Mhz UDIMM Desktop RAM	0	t	2026-09-18 09:23:54.571
cmu6r4ghc008ieqewameei0s5	cmu6r4gha008heqewo62vh99s	/uploads/ram/netac-basic-4gb-ddr4-2666mhz-desktop-ram.webp	Netac Basic 4GB DDR4 2666MHZ Desktop RAM	0	t	2026-09-18 09:23:54.864
cmu6r4gag003keqewpwq6pey7	cmu6r4gag003jeqewog4h5uso	/uploads/ram/netac-basic-ddr3-8gb-1600mhz-desktop-ram.webp	Netac Basic DDR3 8GB 1600MHZ Desktop RAM	0	t	2026-09-18 09:23:54.617
cmu6r4gax003veqewj9qfe7sj	cmu6r4gaw003ueqewgaku1jo7	/uploads/ram/ocpc-x3-rgb-ddr4-3200mhz-8gb-desktop-ram.webp	OCPC X3 RGB DDR4 3200MHz 8GB Desktop RAM	0	t	2026-09-18 09:23:54.633
cmu6r4ghs008teqewftwybs4e	cmu6r4ghr008seqew1uadyrx8	/uploads/ram/ocpc-x3-rgb-ddr4-3200mhz-8gb-desktop-ram-white.webp	OCPC X3 RGB DDR4 3200MHz 8GB Desktop RAM White	0	t	2026-09-18 09:23:54.88
cmu6r4gcv0057eqewezbuczr4	cmu6r4gct0056eqewl1d14foq	/uploads/ram/oscoo-r500-rgb-16gb-ddr5-6000mhz-cl46-desktop-ram.webp	OSCOO R500 RGB 16GB DDR5 6000MHz CL46 Desktop RAM	0	t	2026-09-18 09:23:54.703
cmu6r4g9k002yeqewi82xzka9	cmu6r4g9j002xeqew48h4fl84	/uploads/ram/pny-xlr8-16gb-ddr4-3200mhz-desktop-gaming-ram.jpg	PNY XLR8 16GB DDR4 3200MHz Desktop Gaming RAM	0	t	2026-09-18 09:23:54.584
cmu6r4gge007ueqewu51mwblc	cmu6r4ggd007teqewzvz4a4qp	/uploads/ram/pny-xlr8-gaming-rgb-16gb-ddr5-6000mhz-cl36-desktop-ram.webp	PNY XLR8 Gaming RGB 16GB DDR5 6000MHz CL36 Desktop RAM	0	t	2026-09-18 09:23:54.831
cmu6r4ge70066eqewjxhaxvze	cmu6r4ge60065eqewddtcjcqs	/uploads/ram/pny-xlr8-rgb-16gb-ddr4-3200mhz-desktop-ram-white.webp	PNY XLR8 RGB 16GB DDR4 3200MHz Desktop RAM White	0	t	2026-09-18 09:23:54.752
cmu6r4gfz007jeqewaq0rkyua	cmu6r4gfz007ieqewbuc34a6w	/uploads/ram/team-t-create-expert-8gb-ddr4-3200mhz-desktop-ram.webp	Team T-CREATE EXPERT 8GB DDR4 3200MHz Desktop RAM	0	t	2026-09-18 09:23:54.816
cmu6r4g8a0020eqewpouz7apz	cmu6r4g8a001zeqew4kx9ss79	/uploads/ram/team-t-force-vulcan-z-red-8gb-ddr4-3200mhz-desktop-gaming-ram.jpg	Team T-Force VULCAN Z Red 8GB DDR4 3200MHz Desktop Gaming RAM	0	t	2026-09-18 09:23:54.539
cmu6r4ggu0087eqewkm13sejs	cmu6r4ggu0086eqewkiv8jjjh	/uploads/ram/twinmos-8gb-ddr4-2400mhz-desktop-ram.jpg	Twinmos 8GB DDR4 2400MHz Desktop RAM	0	t	2026-09-18 09:23:54.847
cmu6r4g9z0039eqewwb2xln8h	cmu6r4g9z0038eqewbcb6z2np	/uploads/ram/twinmos-voltx-16gb-ddr5-6000mhz-desktop-ram.webp	TwinMOS VOLTX 16GB DDR5 6000MHz Desktop RAM	0	t	2026-09-18 09:23:54.6
cmu6pynyu00ev14lfuaps2hj5	cmu6pynyt00eu14lf8kemzt70	/uploads/motherboards/asus-prime-h510m-k-r2-0-10th-and-11th-gen-micro-atx-motherboard.webp	ASUS PRIME H510M-K R2.0 10th and 11th Gen Micro-ATX Motherboard	0	t	2026-09-18 08:51:25.014
cmu6pynw400cn14lf00bj78oj	cmu6pynw400cm14lf0ve7ekcp	/uploads/motherboards/colorful-battle-ax-h610m-e-wifi-v20-matx-motherboard.webp	Colorful BATTLE-AX H610M-E WIFI V20 mATX Motherboard	0	t	2026-09-18 08:51:24.917
cmu6pynwr00d714lfaj2x0hnf	cmu6pynwq00d614lfwblmos3x	/uploads/motherboards/gigabyte-a520m-ds3h-v2-micro-atx-ddr4-amd-am4-motherboard.webp	Gigabyte A520M DS3H V2 Micro-ATX DDR4 AMD AM4 Motherboard	0	t	2026-09-18 08:51:24.939
cmu6pynxc00dr14lfdo3vjqvw	cmu6pynxc00dq14lf3fb6dcu6	/uploads/motherboards/gigabyte-b450m-ds3h-v3-amd-am4-micro-atx-motherboard.webp	Gigabyte B450M DS3H V3 AMD AM4 Micro ATX Motherboard	0	t	2026-09-18 08:51:24.961
cmu6pyo2000hn14lfqwf2qhpk	cmu6pyo1z00hm14lf8ln55j0p	/uploads/motherboards/gigabyte-h410m-h-10th-gen-micro-atx-motherboard.jpg	Gigabyte H410M H 10th Gen Micro ATX Motherboard	0	t	2026-09-18 08:51:25.129
cmu6pyo0200fz14lfcc9ddhlq	cmu6pyo0200fy14lfkvcj93kc	/uploads/motherboards/gigabyte-h610m-h-ddr5-matx-motherboard.webp	GIGABYTE H610M H DDR5 mATX Motherboard	0	t	2026-09-18 08:51:25.059
cmu6pynzf00ff14lf2nxnxtol	cmu6pynze00fe14lfh5xauu7g	/uploads/motherboards/gigabyte-h610m-h-v3-ddr4-micro-atx-motherboard.webp	GIGABYTE H610M H V3 DDR4 Micro ATX Motherboard	0	t	2026-09-18 08:51:25.035
cmu6pyo1f00h314lf99gcs0k3	cmu6pyo1e00h214lfy6uwilf9	/uploads/motherboards/msi-pro-h610m-e-matx-motherboard.webp	MSI PRO H610M-E mATX Motherboard	0	t	2026-09-18 08:51:25.108
cmu6pyny100eb14lfj3gxfoho	cmu6pyny000ea14lfi7waffpz	/uploads/motherboards/msi-pro-h610m-s-ddr4-ii-matx-motherboard.webp	MSI PRO H610M-S DDR4 II mATX Motherboard	0	t	2026-09-18 08:51:24.986
cmu6pyo0t00gj14lfxjm14gqu	cmu6pyo0s00gi14lfjfngwo9u	/uploads/motherboards/msi-pro-h610m-s-ddr4-m-atx-motherboard.webp	MSI PRO H610M-S DDR4 m-ATX Motherboard	0	t	2026-09-18 08:51:25.085
cmu6r4g8r002ceqeww0m68b3t	cmu6r4g8q002beqew38zed8wq	/uploads/ram/adata-8gb-ddr5-5600mhz-cl46-u-dimm-desktop-ram.webp	Adata 8GB DDR5 5600MHz CL46 U-DIMM Desktop RAM	0	t	2026-09-18 09:23:54.556
cmu6r4gjf009weqewzqzo8wpt	cmu6r4gje009veqewqm14yift	/uploads/ram/colorful-cvn-guardian-8gb-ddr4-3200mhz-rgb-desktop-ram.webp	Colorful CVN Guardian 8GB DDR4 3200MHz RGB Desktop RAM	0	t	2026-09-18 09:23:54.94
cmu6r4giw009keqewg28pwieu	cmu6r4giv009jeqewwv6hvpgl	/uploads/ram/kimtigo-wolfrine-16gb-3200mhz-ddr4-udimm-desktop-ram-white.webp	Kimtigo WOLFRINE 16GB 3200MHz DDR4 UDIMM Desktop RAM White	0	t	2026-09-18 09:23:54.92
cmu6r4gka00akeqew9xdlvtnr	cmu6r4gk800ajeqewqntcnzam	/uploads/ram/kingbank-kjxb-16gb-ddr4-3200mhz-desktop-ram.webp	KingBank KJXB 16GB DDR4 3200MHz Desktop RAM	0	t	2026-09-18 09:23:54.97
cmu6r4gjw00a9eqew23w079xo	cmu6r4gjv00a8eqewlxe2djxh	/uploads/ram/oscoo-warrior-e500-32gb-ddr5-5200mhz-cl36-desktop-ram.webp	OSCOO Warrior E500 32GB DDR5 5200MHz CL36 Desktop RAM	0	t	2026-09-18 09:23:54.956
cmrj08qjt0003ykwwqgf03v5s	cmrj08qjc0002ykwwkebscxas	/uploads/ram/g-skill-trident-z5-16gb-ddr5-5600mhz-cl36-desktop-ram-silver.jpg	G.Skill Trident Z5 16GB DDR5 5600MHz CL36 Desktop RAM Silver	0	t	2026-07-13 09:13:18.185
cmu6pynvi00c314lfwry8j92h	cmu6pynvi00c214lfh2lvojue	/uploads/motherboards/asrock-h610m-h2-m-2-14th-13th-and-12th-gen-matx-ddr5-motherboard.webp	ASROCK H610M-H2/M.2 14th, 13th and 12th Gen mATX DDR5 Motherboard	0	t	2026-09-18 08:51:24.895
\.


--
-- Data for Name: product_specifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_specifications (id, "productId", "specificationDefinitionId", value, "createdAt", "updatedAt") FROM stdin;
cmr9jbaxw000ot1wvuq3u7tky	cmr9esnv10002t1wvup6a0f8w	cmr9bvs9c003mnjjl66ggue09	8 GB	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw000pt1wv715ntcyz	cmr9esnv10002t1wvup6a0f8w	cmr9fdu2i0003znc8m0i2htvy	28 GBPs	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw000qt1wvqx3909qn	cmr9esnv10002t1wvup6a0f8w	cmr9bvs9c003nnjjldprfoq71	GDDR7	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw000rt1wvanwgba4i	cmr9esnv10002t1wvup6a0f8w	cmr9fdu2m0007znc8kc698wgu	2595	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw000st1wvynn9dcsj	cmr9esnv10002t1wvup6a0f8w	cmr9fdu2p0009znc81h27hava	128 bit	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw000tt1wv3je6qkdf	cmr9esnv10002t1wvup6a0f8w	cmr9fdu2q000bznc8nqnk6n3y	7680x2540	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw000ut1wvclmxg5vp	cmr9esnv10002t1wvup6a0f8w	cmr9fdu2s000dznc862mxbzdr	4	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw000vt1wvo854keod	cmr9esnv10002t1wvup6a0f8w	cmr9bvs9c003onjjl73rcf6jj	GeForce RTX 5060 Ti	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw000wt1wv5n4qt4el	cmr9esnv10002t1wvup6a0f8w	cmr9fdu2v000hznc8hqkuplm8	3840	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw000xt1wvk2pet7gu	cmr9esnv10002t1wvup6a0f8w	cmr9fdu2x000jznc8fy1302of	PCI-E 5.0	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw000yt1wv5zx0hqk7	cmr9esnv10002t1wvup6a0f8w	cmr9fdu2z000lznc8a23p949m	DirectX 12 API	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw000zt1wve1l74s1a	cmr9esnv10002t1wvup6a0f8w	cmr9fdu30000nznc8r71v4upj	4.6	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw0010t1wvla7x3w4s	cmr9esnv10002t1wvup6a0f8w	cmr9fdu34000tznc8rgc4pj4c	8-pin x3	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw0011t1wvj4uzy9l3	cmr9esnv10002t1wvup6a0f8w	cmr9fdu31000pznc8qjtoyzrk	550	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw0012t1wvqz7p9nmk	cmr9esnv10002t1wvup6a0f8w	cmr9fdu33000rznc8knkdzgst	2.1	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw0013t1wv5iak651k	cmr9esnv10002t1wvup6a0f8w	cmr9fdu35000vznc86eleam5x	2.1	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmr9jbaxw0014t1wv8giubfvk	cmr9esnv10002t1wvup6a0f8w	cmr9fdu38000zznc8rwpfa7k5	3	2026-07-06 18:09:28.868	2026-07-06 18:09:28.868
cmu2p7k43003gaap18c08rgz2	cmu2p7k3d003eaap1g3pu2qg3	cmr9bvs6u002mnjjl4mw9r2r4	Intel Core i5	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k43003haap11710tc7o	cmu2p7k3d003eaap1g3pu2qg3	cmr9bvs69002enjjlzzee8gs4	i5-14600K	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k43003iaap10hdsao39	cmu2p7k3d003eaap1g3pu2qg3	cmr9bvs3z0028njjl78cbu80i	14 Core	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k43003jaap1g9tfy2dt	cmu2p7k3d003eaap1g3pu2qg3	cmr9bvs3y0027njjlmnphc78d	20 Threads	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k43003kaap1dw27koul	cmu2p7k3d003eaap1g3pu2qg3	cmr9bvs3y0026njjlozqqv8z0	3.5	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k43003laap1sp6abb9b	cmu2p7k3d003eaap1g3pu2qg3	cmr9bvs3y0024njjl9e3ah51v	5.3	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k43003maap1q6esqsj2	cmu2p7k3d003eaap1g3pu2qg3	cmr9bvs3y0023njjljhlzuud0	LGA 1700	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k43003naap1ymyj2rq7	cmu2p7k3d003eaap1g3pu2qg3	cmr9bvs6f002hnjjl1x3olffk	14th Gen (Raptor Lake Refresh)	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k43003oaap1fuycopev	cmu2p7k3d003eaap1g3pu2qg3	cmr9bvs6g002injjlwouuh804	24 MB	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k43003paap1z8co180k	cmu2p7k3d003eaap1g3pu2qg3	cmr9bvs5i002anjjlcuk2lj5u	125W	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k43003qaap17oov8cc1	cmu2p7k3d003eaap1g3pu2qg3	cmr9bvs64002cnjjl2ip49dn5	Intel UHD Graphics 770	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k44003raap1lh9bs8o7	cmu2p7k3d003eaap1g3pu2qg3	cmr9bvs6x002onjjln15z5srx	DDR4 + DDR5	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k44003saap1cw0ugbtj	cmu2p7k3d003eaap1g3pu2qg3	cmr9bvs6i002knjjlemi601rt	DDR5-5600	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k44003taap1561o5m59	cmu2p7k3d003eaap1g3pu2qg3	cmr9bvs91002qnjjlspy1ptf2	192 GB	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k44003uaap1q70w2lzq	cmu2p7k3d003eaap1g3pu2qg3	cmu1dxweo001zdx76bzhzqfdz	PCIe 5.0	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k44003vaap1220y6mrk	cmu2p7k3d003eaap1g3pu2qg3	cmu1dxwep0021dx76dut3p69s	Hyper-Threading, Turbo Boost, Unlocked Multiplier, DDR5 Support, DDR4 Support, PCIe 5.0 Support, E-cores, P-cores, Intel XMP	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k44003waap15ie5syxn	cmu2p7k3d003eaap1g3pu2qg3	cmu1dxwer0023dx76kkptl016	true	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k44003xaap18yq6aoqu	cmu2p7k3d003eaap1g3pu2qg3	cmu1dxwes0025dx762mlo5bct	false	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k44003yaap1poo2tf32	cmu2p7k3d003eaap1g3pu2qg3	cmu1dxwev0027dx76a3oheqbe	3 Years	2026-09-15 13:19:15.604	2026-09-15 13:19:15.604
cmu2p7k5x0043aap1i7ec5cgt	cmu2p7k4u0041aap1z5iwkuq2	cmr9bvs970032njjll06wzb1c	Ryzen 7	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x0044aap1j605mly5	cmu2p7k4u0041aap1z5iwkuq2	cmr9bvs97003anjjly8pgyejf	Ryzen 7 7800X3D	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x0045aap1ui08wzdx	cmu2p7k4u0041aap1z5iwkuq2	cmr9bvs97002unjjlkze12d8e	8 Core	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x0046aap1mbqlv49v	cmu2p7k4u0041aap1z5iwkuq2	cmr9bvs97003cnjjlsdpfrbzc	16 Threads	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x0047aap1swh9dwat	cmu2p7k4u0041aap1z5iwkuq2	cmr9bvs97002xnjjlbgm11wr2	4.2	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x0048aap18hveaz7l	cmu2p7k4u0041aap1z5iwkuq2	cmr9bvs970038njjlxvru0024	5.0	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x0049aap1iyolkt7c	cmu2p7k4u0041aap1z5iwkuq2	cmr9bvs97002vnjjluf76j46i	AM5	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x004aaap12an3rmvp	cmu2p7k4u0041aap1z5iwkuq2	cmr9bvs970039njjl7x3qpa9y	Ryzen 7000 Series	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x004baap1rizhuhep	cmu2p7k4u0041aap1z5iwkuq2	cmr9bvs99003injjlawntuhv3	96 MB	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x004caap19vsw8jzd	cmu2p7k4u0041aap1z5iwkuq2	cmr9bvs970031njjlxjwmui6s	120W	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x004daap115930io5	cmu2p7k4u0041aap1z5iwkuq2	cmr9bvs98003fnjjl9qgz7y19	None (Discrete GPU Required)	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x004eaap1ql3q76oz	cmu2p7k4u0041aap1z5iwkuq2	cmr9bvs970034njjlup59w81g	DDR5	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x004faap1gez9v5j1	cmu2p7k4u0041aap1z5iwkuq2	cmr9bvs970035njjlw0stdb9f	DDR5-5200	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x004gaap1okp96sq0	cmu2p7k4u0041aap1z5iwkuq2	cmr9bvs98003gnjjlh7t4qtax	128 GB	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x004haap16c58gla7	cmu2p7k4u0041aap1z5iwkuq2	cmu1dxwfl0033dx762vno6blw	PCIe 5.0	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x004iaap1hfniwd4u	cmu2p7k4u0041aap1z5iwkuq2	cmu1dxwfn0035dx76k4xttha6	Unlocked Multiplier, DDR5 Support, PCIe 5.0 Support, 3D V-Cache, Precision Boost 2, AMD EXPO	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x004jaap1c9xhzdot	cmu2p7k4u0041aap1z5iwkuq2	cmu1dxwfp0037dx7615jcy1s4	true	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x004kaap15nhlmu6w	cmu2p7k4u0041aap1z5iwkuq2	cmu1dxwfr0039dx76nb1azc3d	false	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k5x004laap1pt2ulned	cmu2p7k4u0041aap1z5iwkuq2	cmu1dxwfs003bdx76iddxs55y	3 Years	2026-09-15 13:19:15.67	2026-09-15 13:19:15.67
cmu2p7k80004qaap1m5sdss0f	cmu2p7k73004oaap136n88e7i	cmr9bvs6u002mnjjl4mw9r2r4	Intel Core Ultra 7	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmrdcb3f20010gb3ws5v6xw93	cmrdc2oe5000ggb3wsfqedq5d	cmrdbq1200007ohnkrwpf8pbc	Support Intel Core 14th/ 13th/ 12th Gen Processors,\nIntel Pentium Gold and Celeron Processors\nLGA 1700	2026-07-09 10:04:26.511	2026-07-09 10:04:26.511
cmrdcb3f20011gb3w0dcoknw0	cmrdc2oe5000ggb3wsfqedq5d	cmrdbq1240009ohnke7w7x7qr	Intel H610 Chipset	2026-07-09 10:04:26.511	2026-07-09 10:04:26.511
cmrdcb3f20012gb3wkuho2nyv	cmrdc2oe5000ggb3wsfqedq5d	cmrdbq125000bohnkdjs3ioav	64GB	2026-07-09 10:04:26.511	2026-07-09 10:04:26.511
cmrdcb3f20013gb3wwemjz22f	cmrdc2oe5000ggb3wsfqedq5d	cmrdbq126000dohnkyh4cc6y4	DDR4	2026-07-09 10:04:26.511	2026-07-09 10:04:26.511
cmrdcb3f20014gb3ws768jgis	cmrdc2oe5000ggb3wsfqedq5d	cmrdbq128000fohnkysdr9lw3	2	2026-07-09 10:04:26.511	2026-07-09 10:04:26.511
cmrdcb3f20015gb3wdr9wiedo	cmrdc2oe5000ggb3wsfqedq5d	cmrdbq12a000hohnkquglg65g	1x HDMI	2026-07-09 10:04:26.511	2026-07-09 10:04:26.511
cmrdcb3f20016gb3wm4dzbc1g	cmrdc2oe5000ggb3wsfqedq5d	cmrdbq12b000johnkv89j042x	Realtek ALC897 Codec	2026-07-09 10:04:26.511	2026-07-09 10:04:26.511
cmrdcb3f20017gb3w1kgw16gn	cmrdc2oe5000ggb3wsfqedq5d	cmrdbq12c000lohnkwib3vwr0	HDMI - 1x HDMI\nUSB (s)\n2(Gen 1,Type A) - Front\n2(Gen 1,Type A) - Rear\n\nLAN Port (s) - Gigabit LAN\n\nWireless Communication module\nWi-Fi 5,Bluetooth 4.2\n\nSupported Storage - 1x M.2\nAudio - Audio Connectors\nTPM (Trusted Platform Module )\n1x TPM pin header(Support TPM 2.0)	2026-07-09 10:04:26.511	2026-07-09 10:04:26.511
cmrdcb3f20018gb3wkar9vd5q	cmrdc2oe5000ggb3wsfqedq5d	cmrdbq12d000nohnkureeaott	4x EZ Debug LED	2026-07-09 10:04:26.511	2026-07-09 10:04:26.511
cmrdcb3f20019gb3wa4zkvpu7	cmrdc2oe5000ggb3wsfqedq5d	cmrdbq12e000pohnkz08yh08x	mATX	2026-07-09 10:04:26.511	2026-07-09 10:04:26.511
cmrdcb3f3001agb3wdwg3eiuq	cmrdc2oe5000ggb3wsfqedq5d	cmrdbq12f000rohnk2hwsyl63	PCI\n1x PCI-E x16 slot\n1x PCI-E x1 slot\n\nM.2 Socket\n1 x m.2	2026-07-09 10:04:26.511	2026-07-09 10:04:26.511
cmrdcb3f3001bgb3wu10mna3p	cmrdc2oe5000ggb3wsfqedq5d	cmrdbq12g000tohnk1fyotn25	3-Years	2026-07-09 10:04:26.511	2026-07-09 10:04:26.511
cmrj08qkc0004ykww0cnjn60u	cmrj08qjc0002ykwwkebscxas	cmr9bvs9k003znjjlfy2zoou4	DDR5	2026-07-13 09:13:18.205	2026-07-13 09:13:18.205
cmrj08qkc0005ykwwhpfbux0g	cmrj08qjc0002ykwwkebscxas	cmr9bvs9k003ynjjlu0sjqf2r	6000 MHz	2026-07-13 09:13:18.205	2026-07-13 09:13:18.205
cmrj08qkc0006ykwwmoiouzdc	cmrj08qjc0002ykwwkebscxas	cmrethhjo000kvdfbi88phfex	36-36-36-76	2026-07-13 09:13:18.205	2026-07-13 09:13:18.205
cmrj08qkc0007ykww9bafapwy	cmrj08qjc0002ykwwkebscxas	cmr9bvs9k0040njjlyqse70bu	16GB	2026-07-13 09:13:18.205	2026-07-13 09:13:18.205
cmrj08qkc0008ykwwlr92o9ee	cmrj08qjc0002ykwwkebscxas	cmrethhjs000ovdfbyj3h2oyc	1.20V	2026-07-13 09:13:18.205	2026-07-13 09:13:18.205
cmrj08qkc0009ykww6l71euil	cmrj08qjc0002ykwwkebscxas	cmrethhju000svdfbr55ouxmj	White	2026-07-13 09:13:18.205	2026-07-13 09:13:18.205
cmrj08qkc000aykwwio9cn8qq	cmrj08qjc0002ykwwkebscxas	cmrethhjv000uvdfbaxlp9ie1	RGB RAM	2026-07-13 09:13:18.205	2026-07-13 09:13:18.205
cmrj08qkc000bykwwzsx3pr34	cmrj08qjc0002ykwwkebscxas	cmrethhjw000wvdfbinufn45g	Lifetime	2026-07-13 09:13:18.205	2026-07-13 09:13:18.205
cmtn590c50005jq5xlkhwtuun	cmtn590bg0003jq5xqmmmsw7w	cmr9bvs9c003mnjjl66ggue09	4 GB	2026-09-04 16:03:58.325	2026-09-04 16:03:58.325
cmtn590c50006jq5x0ghab6of	cmtn590bg0003jq5xqmmmsw7w	cmr9bvs9c003nnjjldprfoq71	GDDR3	2026-09-04 16:03:58.325	2026-09-04 16:03:58.325
cmtn590c50009jq5xrzdfhm3m	cmtn590bg0003jq5xqmmmsw7w	cmr9fdu2p0009znc81h27hava	64 bit	2026-09-04 16:03:58.325	2026-09-04 16:03:58.325
cmtn590c5000ajq5xg1btv68g	cmtn590bg0003jq5xqmmmsw7w	cmr9bvs9c003onjjl73rcf6jj	GeForce GT 730	2026-09-04 16:03:58.325	2026-09-04 16:03:58.325
cmtn590c5000bjq5xzzkjxnbu	cmtn590bg0003jq5xqmmmsw7w	cmtn513np000h13qz5byviy69	GT 700	2026-09-04 16:03:58.325	2026-09-04 16:03:58.325
cmtn590c5000cjq5xdv32ulcd	cmtn590bg0003jq5xqmmmsw7w	cmr9fdu2v000hznc8hqkuplm8	192	2026-09-04 16:03:58.325	2026-09-04 16:03:58.325
cmtn590c5000djq5xmvzu4arc	cmtn590bg0003jq5xqmmmsw7w	cmr9fdu2x000jznc8fy1302of	PCI-E 3.0	2026-09-04 16:03:58.325	2026-09-04 16:03:58.325
cmtn590c5000ejq5xvyin0gfx	cmtn590bg0003jq5xqmmmsw7w	cmr9fdu31000pznc8qjtoyzrk	300W	2026-09-04 16:03:58.325	2026-09-04 16:03:58.325
cmtn590c5000fjq5x4w8qo7ki	cmtn590bg0003jq5xqmmmsw7w	cmtn513o3000x13qzmvkta77z	HDMI, DVI, VGA (D-Sub)	2026-09-04 16:03:58.325	2026-09-04 16:03:58.325
cmtn590c5000gjq5x4bwfvzd3	cmtn590bg0003jq5xqmmmsw7w	cmtn513o5000z13qznagqa6eu	3 Ports	2026-09-04 16:03:58.325	2026-09-04 16:03:58.325
cmtn590c5000hjq5x98luobdm	cmtn590bg0003jq5xqmmmsw7w	cmr9fdu35000vznc86eleam5x	1x HDMI	2026-09-04 16:03:58.325	2026-09-04 16:03:58.325
cmtn590c5000ijq5xulahacf8	cmtn590bg0003jq5xqmmmsw7w	cmr9fdu33000rznc8knkdzgst	DVI Yes, VGA (D-Sub)	2026-09-04 16:03:58.325	2026-09-04 16:03:58.325
cmtn590c5000jjq5x2z1h8n01	cmtn590bg0003jq5xqmmmsw7w	cmr9fdu37000xznc84up87zd7	146 x 69 x 23mm	2026-09-04 16:03:58.325	2026-09-04 16:03:58.325
cmtn590c5000kjq5xxt9b2jed	cmtn590bg0003jq5xqmmmsw7w	cmr9fdu38000zznc8rwpfa7k5	2 Years	2026-09-04 16:03:58.325	2026-09-04 16:03:58.325
cmtn590c5000ljq5x2zxtbbxg	cmtn590bg0003jq5xqmmmsw7w	cmr9fdu2s000dznc862mxbzdr	3	2026-09-04 16:03:58.325	2026-09-04 16:03:58.325
cmtn590c50007jq5xvb9o2ue3	cmtn590bg0003jq5xqmmmsw7w	cmr9fdu2m0007znc8kc698wgu	902 MHz (Frequency 1300 MHz)	2026-09-04 16:03:58.325	2026-09-04 16:04:12.975
cmtn5e30h0005udp6gptf0yfa	cmtn5e2zr0003udp6yvyg5ila	cmr9bvs9c003mnjjl66ggue09	8 GB	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h0006udp6s8gh6qap	cmtn5e2zr0003udp6yvyg5ila	cmr9bvs9c003nnjjldprfoq71	GDDR6	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h0007udp6n7pxmhsj	cmtn5e2zr0003udp6yvyg5ila	cmr9fdu2m0007znc8kc698wgu	16 Gbps Effective	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h0008udp6ibav0xw9	cmtn5e2zr0003udp6yvyg5ila	cmr9fdu2p0009znc81h27hava	128 bit	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h0009udp6bs3lsunb	cmtn5e2zr0003udp6yvyg5ila	cmr9fdu2q000bznc8nqnk6n3y	7680x4320	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h000audp6l3iag926	cmtn5e2zr0003udp6yvyg5ila	cmr9bvs9c003onjjl73rcf6jj	Radeon RX 6600 XT	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h000budp65v09zdi7	cmtn5e2zr0003udp6yvyg5ila	cmtn513np000h13qz5byviy69	RX 6000	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h000cudp6bkv70fkc	cmtn5e2zr0003udp6yvyg5ila	cmr9fdu2v000hznc8hqkuplm8	2048	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h000dudp6pdijwinr	cmtn5e2zr0003udp6yvyg5ila	cmr9fdu2x000jznc8fy1302of	PCI-E 4.0	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h000eudp693alrhwv	cmtn5e2zr0003udp6yvyg5ila	cmr9fdu2z000lznc8a23p949m	DirectX 12 Ultimate	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h000fudp6y4p0xjhp	cmtn5e2zr0003udp6yvyg5ila	cmtn513nz000r13qznt10k65u	Dual Fan	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h000gudp6ffsmcn9q	cmtn5e2zr0003udp6yvyg5ila	cmr9fdu31000pznc8qjtoyzrk	500W	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h000hudp6hp03aa3e	cmtn5e2zr0003udp6yvyg5ila	cmr9fdu34000tznc8rgc4pj4c	8-pin	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h000iudp6l935ooen	cmtn5e2zr0003udp6yvyg5ila	cmtn513o3000x13qzmvkta77z	HDMI, DisplayPort	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h000judp6m2khurig	cmtn5e2zr0003udp6yvyg5ila	cmtn513o5000z13qznagqa6eu	4 Ports	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h000kudp6zpnrjlab	cmtn5e2zr0003udp6yvyg5ila	cmr9fdu35000vznc86eleam5x	1 x HDMI	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h000ludp6w0mxnwn3	cmtn5e2zr0003udp6yvyg5ila	cmr9fdu33000rznc8knkdzgst	3 x DisplayPort 1.4a	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h000mudp6ab0rrw1x	cmtn5e2zr0003udp6yvyg5ila	cmr9fdu2s000dznc862mxbzdr	4	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h000nudp6stg5iq1z	cmtn5e2zr0003udp6yvyg5ila	cmr9fdu37000xznc84up87zd7	240 x 119.85 x 44.75 mm (2.2 slot)	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5e30h000oudp6r1m5giel	cmtn5e2zr0003udp6yvyg5ila	cmr9fdu38000zznc8rwpfa7k5	2 Years	2026-09-04 16:07:55.073	2026-09-04 16:07:55.073
cmtn5tr48000mdjde6n0u37sa	cmtn5tr3t000kdjded7l6qx1m	cmtn5tr270001djde0lojpsv0	DDR4	2026-09-04 16:20:06.152	2026-09-04 16:20:06.152
cmtn5tr48000ndjdeutipk9iz	cmtn5tr3t000kdjded7l6qx1m	cmtn5tr2a0003djdebwoggpvz	3200 MHz	2026-09-04 16:20:06.152	2026-09-04 16:20:06.152
cmtn5tr48000odjdeok5wlrk9	cmtn5tr3t000kdjded7l6qx1m	cmtn5tr2c0005djdemxjn1u9g	CL22-22-22-52	2026-09-04 16:20:06.152	2026-09-04 16:20:06.152
cmtn5tr48000pdjdejrty5gbm	cmtn5tr3t000kdjded7l6qx1m	cmtn5tr2d0007djdevbhwldu7	8GB	2026-09-04 16:20:06.152	2026-09-04 16:20:06.152
cmtn5tr48000qdjde33lghy4q	cmtn5tr3t000kdjded7l6qx1m	cmtn5tr2e0009djdeckbk6d7j	1.2V	2026-09-04 16:20:06.152	2026-09-04 16:20:06.152
cmtn5tr48000rdjdes1drrh41	cmtn5tr3t000kdjded7l6qx1m	cmtn5tr2g000bdjde7nlk4nza	260-Pin DDR4 SO-DIMM\nMPN: TED48G3200C22-S01\nModel: TEAM ELITE 8G	2026-09-04 16:20:06.152	2026-09-04 16:20:06.152
cmtn5tr48000sdjdei94s66xi	cmtn5tr3t000kdjded7l6qx1m	cmtn5tr2h000ddjde65624yx6	Black	2026-09-04 16:20:06.152	2026-09-04 16:20:06.152
cmtn5tr48000tdjde2pml3y8w	cmtn5tr3t000kdjded7l6qx1m	cmtn5tr2j000hdjdeke3majo3	Lifetime	2026-09-04 16:20:06.152	2026-09-04 16:20:06.152
cmu2p7k80004raap1jcid8txw	cmu2p7k73004oaap136n88e7i	cmr9bvs69002enjjlzzee8gs4	Ultra 7 265K	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k80004saap1i2r40idz	cmu2p7k73004oaap136n88e7i	cmr9bvs3z0028njjl78cbu80i	20 Core	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k80004taap1myyqllgo	cmu2p7k73004oaap136n88e7i	cmr9bvs3y0027njjlmnphc78d	20 Threads	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k80004uaap1km2addb2	cmu2p7k73004oaap136n88e7i	cmr9bvs3y0026njjlozqqv8z0	3.9	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k80004vaap1zkmrfmiw	cmu2p7k73004oaap136n88e7i	cmr9bvs3y0024njjl9e3ah51v	5.5	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k80004waap1wif5g5m8	cmu2p7k73004oaap136n88e7i	cmr9bvs3y0023njjljhlzuud0	LGA 1851	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k80004xaap1m7ffoxqo	cmu2p7k73004oaap136n88e7i	cmr9bvs6f002hnjjl1x3olffk	Ultra Series 2	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k80004yaap1um7exblu	cmu2p7k73004oaap136n88e7i	cmr9bvs6g002injjlwouuh804	30 MB	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k80004zaap1fy3v2qqb	cmu2p7k73004oaap136n88e7i	cmr9bvs5i002anjjlcuk2lj5u	125W	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k800050aap11zddf52z	cmu2p7k73004oaap136n88e7i	cmr9bvs64002cnjjl2ip49dn5	Intel Arc Graphics	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k800051aap1jauu0kj2	cmu2p7k73004oaap136n88e7i	cmr9bvs6x002onjjln15z5srx	DDR5	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k800052aap1gq3ar7m7	cmu2p7k73004oaap136n88e7i	cmr9bvs6i002knjjlemi601rt	DDR5-6400	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k800053aap1u7u7fxov	cmu2p7k73004oaap136n88e7i	cmr9bvs91002qnjjlspy1ptf2	192 GB	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k800054aap1yovwps0z	cmu2p7k73004oaap136n88e7i	cmu1dxweo001zdx76bzhzqfdz	PCIe 5.0	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k800055aap18njrughx	cmu2p7k73004oaap136n88e7i	cmu1dxwep0021dx76dut3p69s	Turbo Boost, Unlocked Multiplier, DDR5 Support, PCIe 5.0 Support, AI Acceleration, E-cores, P-cores, Intel XMP, Intel Arc Graphics	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k800056aap1d08zg8wb	cmu2p7k73004oaap136n88e7i	cmu1dxwer0023dx76kkptl016	true	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k800057aap1ydq796yg	cmu2p7k73004oaap136n88e7i	cmu1dxwes0025dx762mlo5bct	false	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k800058aap1w0hb84p8	cmu2p7k73004oaap136n88e7i	cmu1dxwev0027dx76a3oheqbe	3 Years	2026-09-15 13:19:15.744	2026-09-15 13:19:15.744
cmu2p7k9e005daap129aym92y	cmu2p7k8p005baap13y3b5gko	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005eaap1wmtsea5y	cmu2p7k8p005baap13y3b5gko	cmr9bvs97003anjjly8pgyejf	Ryzen 5 7600	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005faap1hw80enh1	cmu2p7k8p005baap13y3b5gko	cmr9bvs97002unjjlkze12d8e	6 Core	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005gaap1s8byflkz	cmu2p7k8p005baap13y3b5gko	cmr9bvs97003cnjjlsdpfrbzc	12 Threads	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005haap1xhomhvx6	cmu2p7k8p005baap13y3b5gko	cmr9bvs97002xnjjlbgm11wr2	3.8	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005iaap1kvw1eqjv	cmu2p7k8p005baap13y3b5gko	cmr9bvs970038njjlxvru0024	5.1	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005jaap1zx9kexzy	cmu2p7k8p005baap13y3b5gko	cmr9bvs97002vnjjluf76j46i	AM5	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005kaap1d1zq2e2i	cmu2p7k8p005baap13y3b5gko	cmr9bvs970039njjl7x3qpa9y	Ryzen 7000 Series	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu1dykhf0001suotfoyjan8a	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-14 15:16:34.228	2026-09-14 15:16:34.228
cmu1dykhf0002suottcu1t0d4	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs97003anjjly8pgyejf	5600X	2026-09-14 15:16:34.228	2026-09-14 15:16:34.228
cmu1dykhf0003suoteut49dtg	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs97002unjjlkze12d8e	6 Core	2026-09-14 15:16:34.228	2026-09-14 15:16:34.228
cmu1dykhf0004suotlkawxnid	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs97003cnjjlsdpfrbzc	12 Threads	2026-09-14 15:16:34.228	2026-09-14 15:16:34.228
cmu1dykhf0005suotfryppqh9	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs97002xnjjlbgm11wr2	3.7	2026-09-14 15:16:34.228	2026-09-14 15:16:34.228
cmu1dykhf0006suot3cbl9n5q	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs970038njjlxvru0024	4.6	2026-09-14 15:16:34.228	2026-09-14 15:16:34.228
cmu1dykhf0007suot6w96tfx6	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs97002vnjjluf76j46i	AM4	2026-09-14 15:16:34.228	2026-09-14 15:16:34.228
cmu1dykhf0008suots13d5b5a	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs970039njjl7x3qpa9y	Zen 3	2026-09-14 15:16:34.228	2026-09-14 15:16:34.228
cmu1dykhf0009suoth6u9akth	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs99003injjlawntuhv3	32 MB	2026-09-14 15:16:34.228	2026-09-14 15:16:34.228
cmu1dykhf000asuot40tyzigu	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs970031njjlxjwmui6s	65W	2026-09-14 15:16:34.228	2026-09-14 15:16:34.228
cmu1dykhf000bsuot2p3hqqlf	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs98003fnjjl9qgz7y19	No	2026-09-14 15:16:34.228	2026-09-14 15:16:34.228
cmu1dykhf000csuot6ovr9ezb	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs970034njjlup59w81g	DDR4	2026-09-14 15:16:34.228	2026-09-14 15:16:34.228
cmu1dykhf000dsuotyjr7q4cd	cmr9bvsa7004jnjjlzqzyt643	cmu1dxwfs003bdx76iddxs55y	3 Years	2026-09-14 15:16:34.228	2026-09-14 15:16:34.228
cmu1h8s020002bpnxold1az0w	cmrcbkzit001a5menuqtjvxca	cmr9bvs6u002mnjjl4mw9r2r4	Intel Core i5	2026-09-14 16:48:29.378	2026-09-14 16:48:29.378
cmu1h8s020003bpnxzkojifrf	cmrcbkzit001a5menuqtjvxca	cmr9bvs69002enjjlzzee8gs4	Intel Core i5 14400F	2026-09-14 16:48:29.378	2026-09-14 16:48:29.378
cmu1h8s020004bpnx065ys3fb	cmrcbkzit001a5menuqtjvxca	cmr9bvs3z0028njjl78cbu80i	10 Core	2026-09-14 16:48:29.378	2026-09-14 16:48:29.378
cmu1h8s020005bpnxltp47rcy	cmrcbkzit001a5menuqtjvxca	cmr9bvs3y0027njjlmnphc78d	16 Threads	2026-09-14 16:48:29.378	2026-09-14 16:48:29.378
cmu1h8s020006bpnxrl3axtds	cmrcbkzit001a5menuqtjvxca	cmr9bvs3y0026njjlozqqv8z0	3.5	2026-09-14 16:48:29.378	2026-09-14 16:48:29.378
cmu1h8s020007bpnxp6km7boj	cmrcbkzit001a5menuqtjvxca	cmr9bvs3y0024njjl9e3ah51v	4.7	2026-09-14 16:48:29.378	2026-09-14 16:48:29.378
cmu1h8s020008bpnx3n3a165n	cmrcbkzit001a5menuqtjvxca	cmr9bvs3y0023njjljhlzuud0	LGA 1700	2026-09-14 16:48:29.378	2026-09-14 16:48:29.378
cmu1h8s020009bpnxma80lq4h	cmrcbkzit001a5menuqtjvxca	cmr9bvs6f002hnjjl1x3olffk	14th Gen (Raptor Lake Refresh)	2026-09-14 16:48:29.378	2026-09-14 16:48:29.378
cmu1h8s02000abpnxpqmrf0h5	cmrcbkzit001a5menuqtjvxca	cmr9bvs6g002injjlwouuh804	18 MB	2026-09-14 16:48:29.378	2026-09-14 16:48:29.378
cmu1h8s02000bbpnx708zicch	cmrcbkzit001a5menuqtjvxca	cmr9bvs5i002anjjlcuk2lj5u	150W	2026-09-14 16:48:29.378	2026-09-14 16:48:29.378
cmu1h8s02000cbpnxth7b2zxi	cmrcbkzit001a5menuqtjvxca	cmr9bvs64002cnjjl2ip49dn5	Intel UHD Graphics 770	2026-09-14 16:48:29.378	2026-09-14 16:48:29.378
cmu1h8s02000dbpnxj7wb3dhp	cmrcbkzit001a5menuqtjvxca	cmr9bvs6x002onjjln15z5srx	DDR4 + DDR5	2026-09-14 16:48:29.378	2026-09-14 16:48:29.378
cmu1h8s02000ebpnxxnt8hw5c	cmrcbkzit001a5menuqtjvxca	cmr9bvs6i002knjjlemi601rt	DDR5-7200	2026-09-14 16:48:29.378	2026-09-14 16:48:29.378
cmu1h8s02000fbpnxpcc1me41	cmrcbkzit001a5menuqtjvxca	cmr9bvs91002qnjjlspy1ptf2	192 GB	2026-09-14 16:48:29.378	2026-09-14 16:48:29.378
cmu1h8s02000gbpnxll1kt7l2	cmrcbkzit001a5menuqtjvxca	cmu1dxwev0027dx76a3oheqbe	3	2026-09-14 16:48:29.378	2026-09-14 16:48:29.378
cmu2p7k9e005laap1skwsohi9	cmu2p7k8p005baap13y3b5gko	cmr9bvs99003injjlawntuhv3	32 MB	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005maap1qngbtm5c	cmu2p7k8p005baap13y3b5gko	cmr9bvs970031njjlxjwmui6s	65W	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu1hwfmb0002yid2b0htf637	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs3y0023njjljhlzuud0	LGA 1700	2026-09-14 17:06:53.075	2026-09-14 17:06:53.075
cmu1hwfmb0003yid2xjd30see	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs3z0028njjl78cbu80i	6 Core	2026-09-14 17:06:53.075	2026-09-14 17:06:53.075
cmu1hwfmb0004yid20135t2ut	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs3y0027njjlmnphc78d	12 Threads	2026-09-14 17:06:53.075	2026-09-14 17:06:53.075
cmu1hwfmb0005yid2id9zr8to	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs3y0026njjlozqqv8z0	2.5	2026-09-14 17:06:53.075	2026-09-14 17:06:53.075
cmu1hwfmb0006yid2jxfuzy5a	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs3y0024njjl9e3ah51v	4.4	2026-09-14 17:06:53.075	2026-09-14 17:06:53.075
cmu1hwfmb0007yid2vjptgvbw	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs6g002injjlwouuh804	18 MB	2026-09-14 17:06:53.075	2026-09-14 17:06:53.075
cmu1hwfmb0008yid2f4azifjs	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs5i002anjjlcuk2lj5u	65W	2026-09-14 17:06:53.075	2026-09-14 17:06:53.075
cmu1hwfmb0009yid2j8gvt5ga	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs6u002mnjjl4mw9r2r4	Intel Core i5	2026-09-14 17:06:53.075	2026-09-14 17:06:53.075
cmu1hwfmb000ayid243amb61f	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs69002enjjlzzee8gs4	Core i5-12400F	2026-09-14 17:06:53.075	2026-09-14 17:06:53.075
cmu1hwfmb000byid2d4kxanw6	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs6f002hnjjl1x3olffk	12th Gen (Alder Lake)	2026-09-14 17:06:53.075	2026-09-14 17:06:53.075
cmu1hwfmb000cyid2jwtgnf86	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs6x002onjjln15z5srx	DDR5	2026-09-14 17:06:53.075	2026-09-14 17:06:53.075
cmu1hwfmb000dyid25tkpwx1n	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs6i002knjjlemi601rt	DDR5-4800	2026-09-14 17:06:53.075	2026-09-14 17:06:53.075
cmu1hwfmb000eyid2n6ndljn3	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs91002qnjjlspy1ptf2	128 GB	2026-09-14 17:06:53.075	2026-09-14 17:06:53.075
cmu1hwfmb000fyid2juk5omx2	cmr9bvs9s0042njjlfqeg1cdv	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-14 17:06:53.075	2026-09-14 17:06:53.075
cmu2p7k9e005naap1xf0wtrw1	cmu2p7k8p005baap13y3b5gko	cmr9bvs98003fnjjl9qgz7y19	AMD Radeon Graphics	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005oaap17dcodal7	cmu2p7k8p005baap13y3b5gko	cmr9bvs970034njjlup59w81g	DDR5	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005paap1mi9ciuor	cmu2p7k8p005baap13y3b5gko	cmr9bvs970035njjlw0stdb9f	DDR5-5200	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005qaap1m3g2lpdf	cmu2p7k8p005baap13y3b5gko	cmr9bvs98003gnjjlh7t4qtax	128 GB	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005raap1mgtk54gh	cmu2p7k8p005baap13y3b5gko	cmu1dxwfl0033dx762vno6blw	PCIe 5.0	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005saap1e60twmo9	cmu2p7k8p005baap13y3b5gko	cmu1dxwfn0035dx76k4xttha6	Unlocked Multiplier, DDR5 Support, PCIe 5.0 Support, Precision Boost 2, AMD EXPO, AMD Radeon Graphics	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005taap1tvz3o5nt	cmu2p7k8p005baap13y3b5gko	cmu1dxwfp0037dx7615jcy1s4	true	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005uaap15cfneil2	cmu2p7k8p005baap13y3b5gko	cmu1dxwfr0039dx76nb1azc3d	true	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7k9e005vaap1gdaw5pyj	cmu2p7k8p005baap13y3b5gko	cmu1dxwfs003bdx76iddxs55y	3 Years	2026-09-15 13:19:15.795	2026-09-15 13:19:15.795
cmu2p7kai0060aap13njvjlgw	cmu2p7k9z005yaap11hik0ma8	cmr9bvs6u002mnjjl4mw9r2r4	Intel Core i7	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai0061aap1wx605mv8	cmu2p7k9z005yaap11hik0ma8	cmr9bvs69002enjjlzzee8gs4	i7-14700K	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai0062aap1nccyimq4	cmu2p7k9z005yaap11hik0ma8	cmr9bvs3z0028njjl78cbu80i	20 Core	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai0063aap1k5n52ykw	cmu2p7k9z005yaap11hik0ma8	cmr9bvs3y0027njjlmnphc78d	28 Threads	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai0064aap1v1pbjd5v	cmu2p7k9z005yaap11hik0ma8	cmr9bvs3y0026njjlozqqv8z0	3.4	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai0065aap1iuk4qfym	cmu2p7k9z005yaap11hik0ma8	cmr9bvs3y0024njjl9e3ah51v	5.6	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai0066aap1h3r5ieul	cmu2p7k9z005yaap11hik0ma8	cmr9bvs3y0023njjljhlzuud0	LGA 1700	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai0067aap1s7d8p2cm	cmu2p7k9z005yaap11hik0ma8	cmr9bvs6f002hnjjl1x3olffk	14th Gen (Raptor Lake Refresh)	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai0068aap1nz60uayj	cmu2p7k9z005yaap11hik0ma8	cmr9bvs6g002injjlwouuh804	33 MB	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai0069aap1pu1n4a1s	cmu2p7k9z005yaap11hik0ma8	cmr9bvs5i002anjjlcuk2lj5u	125W	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai006aaap18e1ehd7f	cmu2p7k9z005yaap11hik0ma8	cmr9bvs64002cnjjl2ip49dn5	Intel UHD Graphics 770	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai006baap14ks85zzl	cmu2p7k9z005yaap11hik0ma8	cmr9bvs6x002onjjln15z5srx	DDR4 + DDR5	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai006caap18pew4bq4	cmu2p7k9z005yaap11hik0ma8	cmr9bvs6i002knjjlemi601rt	DDR5-5600	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai006daap1bnh17f7u	cmu2p7k9z005yaap11hik0ma8	cmr9bvs91002qnjjlspy1ptf2	192 GB	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai006eaap16u4xecdz	cmu2p7k9z005yaap11hik0ma8	cmu1dxweo001zdx76bzhzqfdz	PCIe 5.0	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai006faap1l3v6ujvq	cmu2p7k9z005yaap11hik0ma8	cmu1dxwep0021dx76dut3p69s	Hyper-Threading, Turbo Boost, Unlocked Multiplier, DDR5 Support, DDR4 Support, PCIe 5.0 Support, E-cores, P-cores, Intel XMP	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai006gaap1tljqauni	cmu2p7k9z005yaap11hik0ma8	cmu1dxwer0023dx76kkptl016	true	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai006haap19sem8exi	cmu2p7k9z005yaap11hik0ma8	cmu1dxwes0025dx762mlo5bct	false	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kai006iaap1izodx5y0	cmu2p7k9z005yaap11hik0ma8	cmu1dxwev0027dx76a3oheqbe	3 Years	2026-09-15 13:19:15.834	2026-09-15 13:19:15.834
cmu2p7kbl006naap1hzl0f43n	cmu2p7kb3006laap1k0e6z4b3	cmr9bvs970032njjll06wzb1c	Ryzen 9	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl006oaap1bx29ftq2	cmu2p7kb3006laap1k0e6z4b3	cmr9bvs97003anjjly8pgyejf	Ryzen 9 7950X	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl006paap1hhe0qw9h	cmu2p7kb3006laap1k0e6z4b3	cmr9bvs97002unjjlkze12d8e	16 Core	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl006qaap1fdhiwn1d	cmu2p7kb3006laap1k0e6z4b3	cmr9bvs97003cnjjlsdpfrbzc	32 Threads	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl006raap15xoyjipm	cmu2p7kb3006laap1k0e6z4b3	cmr9bvs97002xnjjlbgm11wr2	4.5	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl006saap14vermls9	cmu2p7kb3006laap1k0e6z4b3	cmr9bvs970038njjlxvru0024	5.7	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl006taap1mxw54xqq	cmu2p7kb3006laap1k0e6z4b3	cmr9bvs97002vnjjluf76j46i	AM5	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl006uaap115rdp4sx	cmu2p7kb3006laap1k0e6z4b3	cmr9bvs970039njjl7x3qpa9y	Ryzen 7000 Series	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl006vaap1dtl8flj0	cmu2p7kb3006laap1k0e6z4b3	cmr9bvs99003injjlawntuhv3	64 MB	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl006waap1e7bkeq2x	cmu2p7kb3006laap1k0e6z4b3	cmr9bvs970031njjlxjwmui6s	170W	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl006xaap1t3ej7l59	cmu2p7kb3006laap1k0e6z4b3	cmr9bvs98003fnjjl9qgz7y19	None (Discrete GPU Required)	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl006yaap1uh977di4	cmu2p7kb3006laap1k0e6z4b3	cmr9bvs970034njjlup59w81g	DDR5	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl006zaap13rvfurht	cmu2p7kb3006laap1k0e6z4b3	cmr9bvs970035njjlw0stdb9f	DDR5-5200	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl0070aap1tocm57ox	cmu2p7kb3006laap1k0e6z4b3	cmr9bvs98003gnjjlh7t4qtax	128 GB	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl0071aap1jd66m0tw	cmu2p7kb3006laap1k0e6z4b3	cmu1dxwfl0033dx762vno6blw	PCIe 5.0	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl0072aap1cka3lqz7	cmu2p7kb3006laap1k0e6z4b3	cmu1dxwfn0035dx76k4xttha6	Unlocked Multiplier, DDR5 Support, PCIe 5.0 Support, Precision Boost 2, Precision Boost Overdrive, AMD EXPO	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl0073aap13057y153	cmu2p7kb3006laap1k0e6z4b3	cmu1dxwfp0037dx7615jcy1s4	true	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl0074aap1bv0xnhdi	cmu2p7kb3006laap1k0e6z4b3	cmu1dxwfr0039dx76nb1azc3d	false	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kbl0075aap1zuowv8h9	cmu2p7kb3006laap1k0e6z4b3	cmu1dxwfs003bdx76iddxs55y	3 Years	2026-09-15 13:19:15.873	2026-09-15 13:19:15.873
cmu2p7kcq007aaap1nuk2v1nb	cmu2p7kc80078aap1yam8femo	cmr9bvs6u002mnjjl4mw9r2r4	Intel Core i3	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007baap1eq6u2why	cmu2p7kc80078aap1yam8femo	cmr9bvs69002enjjlzzee8gs4	i3-14100	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007caap144ayl1eu	cmu2p7kc80078aap1yam8femo	cmr9bvs3z0028njjl78cbu80i	4 Core	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007daap1kqlg7t6j	cmu2p7kc80078aap1yam8femo	cmr9bvs3y0027njjlmnphc78d	8 Threads	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007eaap101w55tq4	cmu2p7kc80078aap1yam8femo	cmr9bvs3y0026njjlozqqv8z0	3.5	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007faap1jmy3ho8d	cmu2p7kc80078aap1yam8femo	cmr9bvs3y0024njjl9e3ah51v	4.7	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007gaap1i0u4fwki	cmu2p7kc80078aap1yam8femo	cmr9bvs3y0023njjljhlzuud0	LGA 1700	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007haap1o89f8ud2	cmu2p7kc80078aap1yam8femo	cmr9bvs6f002hnjjl1x3olffk	14th Gen (Raptor Lake Refresh)	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007iaap12xqpgfmc	cmu2p7kc80078aap1yam8femo	cmr9bvs6g002injjlwouuh804	12 MB	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007jaap16qcwsq11	cmu2p7kc80078aap1yam8femo	cmr9bvs5i002anjjlcuk2lj5u	60W	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007kaap1r75zskwb	cmu2p7kc80078aap1yam8femo	cmr9bvs64002cnjjl2ip49dn5	Intel UHD Graphics 730	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007laap15trd6vx0	cmu2p7kc80078aap1yam8femo	cmr9bvs6x002onjjln15z5srx	DDR4 + DDR5	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007maap1wdowi86v	cmu2p7kc80078aap1yam8femo	cmr9bvs6i002knjjlemi601rt	DDR5-4800	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007naap1i7s0c85j	cmu2p7kc80078aap1yam8femo	cmr9bvs91002qnjjlspy1ptf2	192 GB	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007oaap1syrxd28b	cmu2p7kc80078aap1yam8femo	cmu1dxweo001zdx76bzhzqfdz	PCIe 5.0	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007paap10wg3uda1	cmu2p7kc80078aap1yam8femo	cmu1dxwep0021dx76dut3p69s	Hyper-Threading, Turbo Boost, DDR5 Support, DDR4 Support, PCIe 5.0 Support, Intel XMP	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007qaap1s79e2mss	cmu2p7kc80078aap1yam8femo	cmu1dxwer0023dx76kkptl016	false	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007raap1do8714ul	cmu2p7kc80078aap1yam8femo	cmu1dxwes0025dx762mlo5bct	true	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu2p7kcq007saap1wol8jueq	cmu2p7kc80078aap1yam8femo	cmu1dxwev0027dx76a3oheqbe	3 Years	2026-09-15 13:19:15.914	2026-09-15 13:19:15.914
cmu3w20mo000ouyr55o5zsnxc	cmu2p7kdf007vaap1w8ihfmcu	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mo000puyr55paj4gjx	cmu2p7kdf007vaap1w8ihfmcu	cmr9bvs97003anjjly8pgyejf	Ryzen 5 5600	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mo000quyr5dbzsmztx	cmu2p7kdf007vaap1w8ihfmcu	cmr9bvs97002unjjlkze12d8e	6 Core	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mo000ruyr5uazyerrc	cmu2p7kdf007vaap1w8ihfmcu	cmr9bvs97003cnjjlsdpfrbzc	12 Threads	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mo000suyr5gy5zznsh	cmu2p7kdf007vaap1w8ihfmcu	cmr9bvs97002xnjjlbgm11wr2	3.5	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mo000tuyr56e42k7gf	cmu2p7kdf007vaap1w8ihfmcu	cmr9bvs970038njjlxvru0024	4.4	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mo000uuyr5i79ncnmp	cmu2p7kdf007vaap1w8ihfmcu	cmr9bvs97002vnjjluf76j46i	AM4	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mo000vuyr5qa38atoq	cmu2p7kdf007vaap1w8ihfmcu	cmr9bvs970039njjl7x3qpa9y	Ryzen 5000 Series	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mo000wuyr5u77l2mkx	cmu2p7kdf007vaap1w8ihfmcu	cmr9bvs99003injjlawntuhv3	32 MB	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mp000xuyr5v5tm028n	cmu2p7kdf007vaap1w8ihfmcu	cmr9bvs970031njjlxjwmui6s	65W	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mp000yuyr5ju5ouy64	cmu2p7kdf007vaap1w8ihfmcu	cmr9bvs98003fnjjl9qgz7y19	None (Discrete GPU Required)	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mp000zuyr5qfn6fnac	cmu2p7kdf007vaap1w8ihfmcu	cmr9bvs970034njjlup59w81g	DDR4	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mp0010uyr5do5nkih2	cmu2p7kdf007vaap1w8ihfmcu	cmr9bvs970035njjlw0stdb9f	DDR4-3200	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mp0011uyr5y02ff9kp	cmu2p7kdf007vaap1w8ihfmcu	cmr9bvs98003gnjjlh7t4qtax	128 GB	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mp0012uyr59woq8p70	cmu2p7kdf007vaap1w8ihfmcu	cmu1dxwfl0033dx762vno6blw	PCIe 4.0	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mp0013uyr5sk10nur6	cmu2p7kdf007vaap1w8ihfmcu	cmu1dxwfn0035dx76k4xttha6	Unlocked Multiplier, DDR4 Support, PCIe 4.0 Support, Precision Boost 2	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mp0014uyr5u85fghs1	cmu2p7kdf007vaap1w8ihfmcu	cmu1dxwfp0037dx7615jcy1s4	true	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mp0015uyr5c4196n0l	cmu2p7kdf007vaap1w8ihfmcu	cmu1dxwfr0039dx76nb1azc3d	true	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu3w20mp0016uyr5ycteagkk	cmu2p7kdf007vaap1w8ihfmcu	cmu1dxwfs003bdx76iddxs55y	3 Years	2026-09-16 09:18:40.561	2026-09-16 09:18:40.561
cmu6pynig002414lfgo3n2xkq	cmu6pynhp002214lfh21ky430	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)	2026-09-18 08:51:24.424	2026-09-18 08:51:24.424
cmu6pynig002514lfaaixiki7	cmu6pynhp002214lfh21ky430	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-18 08:51:24.424	2026-09-18 08:51:24.424
cmu6pynig002614lf8uzgpr1k	cmu6pynhp002214lfh21ky430	cmu6pynfo000t14lfqadrp9c6	64GB	2026-09-18 08:51:24.424	2026-09-18 08:51:24.424
cmu6pynig002714lfd58fudrw	cmu6pynhp002214lfh21ky430	cmu6pynfo000v14lfk2twms3r	DDR4	2026-09-18 08:51:24.424	2026-09-18 08:51:24.424
cmu6pynig002814lfkerf34db	cmu6pynhp002214lfh21ky430	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.424	2026-09-18 08:51:24.424
cmu6pynig002914lfqzdxc6j6	cmu6pynhp002214lfh21ky430	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x DisplayPort, 1x VGA	2026-09-18 08:51:24.424	2026-09-18 08:51:24.424
cmu6pynig002a14lfcd9du2y1	cmu6pynhp002214lfh21ky430	cmu6pynfs001114lflya0h3wr	Realtek ALC897 7.1 HD Audio	2026-09-18 08:51:24.424	2026-09-18 08:51:24.424
cmu6pynig002b14lf0y8yzjhf	cmu6pynhp002214lfh21ky430	cmu6pynfu001314lft9yu4wju	Rear: HDMI, DP, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE LAN, audio | Internal: USB / front panel / TPM headers	2026-09-18 08:51:24.424	2026-09-18 08:51:24.424
cmu6pynig002c14lfyki3ot80	cmu6pynhp002214lfh21ky430	cmu6pynfv001514lfpv41pubh	Multi-display outputs, Steel Armor PCIe slot	2026-09-18 08:51:24.424	2026-09-18 08:51:24.424
cmu6pynig002d14lf09va2wf0	cmu6pynhp002214lfh21ky430	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:24.424	2026-09-18 08:51:24.424
cmu6pynig002e14lfdcrmvod8	cmu6pynhp002214lfh21ky430	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0 x16 | 1x PCIe 3.0 x1 | 1x M.2 Key-M	2026-09-18 08:51:24.424	2026-09-18 08:51:24.424
cmu6pynig002f14lfd0q9168t	cmu6pynhp002214lfh21ky430	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:24.424	2026-09-18 08:51:24.424
cmu6pynji002o14lfaai4vsqm	cmu6pynj8002m14lfy6mvvgq9	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)	2026-09-18 08:51:24.462	2026-09-18 08:51:24.462
cmu6pynji002p14lfxffber3d	cmu6pynj8002m14lfy6mvvgq9	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-18 08:51:24.462	2026-09-18 08:51:24.462
cmu6pynji002q14lfctnxlfqy	cmu6pynj8002m14lfy6mvvgq9	cmu6pynfo000t14lfqadrp9c6	96GB	2026-09-18 08:51:24.462	2026-09-18 08:51:24.462
cmu6pynji002r14lfn50tfiq3	cmu6pynj8002m14lfy6mvvgq9	cmu6pynfo000v14lfk2twms3r	DDR5	2026-09-18 08:51:24.462	2026-09-18 08:51:24.462
cmu6pynji002s14lfmlylu62z	cmu6pynj8002m14lfy6mvvgq9	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.462	2026-09-18 08:51:24.462
cmu6pynji002t14lfdo8ix83j	cmu6pynj8002m14lfy6mvvgq9	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x DisplayPort, 1x VGA	2026-09-18 08:51:24.462	2026-09-18 08:51:24.462
cmu6pynji002u14lfgjxn3dew	cmu6pynj8002m14lfy6mvvgq9	cmu6pynfs001114lflya0h3wr	Realtek ALC897 7.1 HD Audio	2026-09-18 08:51:24.462	2026-09-18 08:51:24.462
cmu6pynji002v14lfkco2u7bc	cmu6pynj8002m14lfy6mvvgq9	cmu6pynfu001314lft9yu4wju	Rear: HDMI, DP, VGA, USB 3.2 Gen1, USB 2.0, 1GbE LAN, audio jacks | Internal: standard front-panel and USB headers	2026-09-18 08:51:24.462	2026-09-18 08:51:24.462
cmu6pynji002w14lflqu4rnbb	cmu6pynj8002m14lfy6mvvgq9	cmu6pynfv001514lfpv41pubh	DDR5 dual-channel support, EZ Debug LED	2026-09-18 08:51:24.462	2026-09-18 08:51:24.462
cmu6pynji002x14lf16fs3ref	cmu6pynj8002m14lfy6mvvgq9	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:24.462	2026-09-18 08:51:24.462
cmu6pynji002y14lflvlqe6ps	cmu6pynj8002m14lfy6mvvgq9	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0 x16 | 1x PCIe 3.0 x1 | 1x M.2 Key-M	2026-09-18 08:51:24.462	2026-09-18 08:51:24.462
cmu6pynji002z14lf1ip7nl80	cmu6pynj8002m14lfy6mvvgq9	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:24.462	2026-09-18 08:51:24.462
cmu6pynkk003814lfltksfgr8	cmu6pynk5003614lfs7alffu6	cmu6pynfy001d14lfnomvc0tn	AMD Ryzen 9000/8000/7000 Series (Socket AM5)	2026-09-18 08:51:24.5	2026-09-18 08:51:24.5
cmu6pynkk003914lf8yngzq6l	cmu6pynk5003614lfs7alffu6	cmu6pynfz001f14lfzkgheosn	AMD A620	2026-09-18 08:51:24.5	2026-09-18 08:51:24.5
cmu6pynkk003a14lfndcohgm7	cmu6pynk5003614lfs7alffu6	cmu6pyng0001h14lfrol6ss30	128GB	2026-09-18 08:51:24.5	2026-09-18 08:51:24.5
cmu6pynkk003b14lfyjroqmry	cmu6pynk5003614lfs7alffu6	cmu6pyng1001j14lf8l7bw4pz	DDR5	2026-09-18 08:51:24.5	2026-09-18 08:51:24.5
cmu6pynkk003c14lf1im0d8xq	cmu6pynk5003614lfs7alffu6	cmu6pyng2001l14lfig07ezdq	1x M.2 Gen4 + 4x SATA 6Gb/s	2026-09-18 08:51:24.5	2026-09-18 08:51:24.5
cmu6pynkk003d14lfub83m7f3	cmu6pynk5003614lfs7alffu6	cmu6pyng3001n14lfqkp15mqn	1x HDMI, 1x VGA	2026-09-18 08:51:24.5	2026-09-18 08:51:24.5
cmu6pynkk003e14lfkrqhlyue	cmu6pynk5003614lfs7alffu6	cmu6pyng4001p14lf6t13ws6b	Realtek ALC897 7.1 HD Audio	2026-09-18 08:51:24.5	2026-09-18 08:51:24.5
cmu6pynkk003f14lf0bkk4ptf	cmu6pynk5003614lfs7alffu6	cmu6pyng5001r14lfb5ia1r3a	Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek RTL8111H 1GbE, audio | Internal: USB headers, TPM header	2026-09-18 08:51:24.5	2026-09-18 08:51:24.5
cmu6pynkk003g14lfdbsdaq10	cmu6pynk5003614lfs7alffu6	cmu6pyng5001t14lfiirn2uls	AMD EXPO, Lightning Gen4 M.2, Steel Armor	2026-09-18 08:51:24.5	2026-09-18 08:51:24.5
cmu6pynkk003h14lf000fhlfa	cmu6pynk5003614lfs7alffu6	cmu6pyng6001v14lfejclbnlw	Micro ATX	2026-09-18 08:51:24.5	2026-09-18 08:51:24.5
cmu6pynkk003i14lfkpgcdy2w	cmu6pynk5003614lfs7alffu6	cmu6pyng7001x14lfs2q5z4kc	1x PCIe 4.0 x16 | 1x PCIe 3.0 x1 | 1x M.2 PCIe 4.0 x4	2026-09-18 08:51:24.5	2026-09-18 08:51:24.5
cmu6pynkk003j14lf0hnonjd6	cmu6pynk5003614lfs7alffu6	cmu6pyng8001z14lfrky9kl8k	3 Years	2026-09-18 08:51:24.5	2026-09-18 08:51:24.5
cmu6pynlk003s14lf1f1jq5zo	cmu6pynl9003q14lfiwe0pdd4	cmu6pynfy001d14lfnomvc0tn	AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)	2026-09-18 08:51:24.537	2026-09-18 08:51:24.537
cmu6pynlk003t14lf2z10zibu	cmu6pynl9003q14lfiwe0pdd4	cmu6pynfz001f14lfzkgheosn	AMD A520	2026-09-18 08:51:24.537	2026-09-18 08:51:24.537
cmu6pynlk003u14lfztw0n81n	cmu6pynl9003q14lfiwe0pdd4	cmu6pyng0001h14lfrol6ss30	64GB	2026-09-18 08:51:24.537	2026-09-18 08:51:24.537
cmu6pynlk003v14lf0p6hit0v	cmu6pynl9003q14lfiwe0pdd4	cmu6pyng1001j14lf8l7bw4pz	DDR4	2026-09-18 08:51:24.537	2026-09-18 08:51:24.537
cmu6pynlk003w14lfs7z1lmgx	cmu6pynl9003q14lfiwe0pdd4	cmu6pyng2001l14lfig07ezdq	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.537	2026-09-18 08:51:24.537
cmu6pynlk003x14lf3ujab159	cmu6pynl9003q14lfiwe0pdd4	cmu6pyng3001n14lfqkp15mqn	1x HDMI, 1x DVI-D, 1x VGA	2026-09-18 08:51:24.537	2026-09-18 08:51:24.537
cmu6pynlk003y14lf69dpp47m	cmu6pynl9003q14lfiwe0pdd4	cmu6pyng4001p14lf6t13ws6b	Realtek ALC887/897 HD Audio	2026-09-18 08:51:24.537	2026-09-18 08:51:24.537
cmu6pynlk003z14lfknr4kafj	cmu6pynl9003q14lfiwe0pdd4	cmu6pyng5001r14lfb5ia1r3a	Rear: HDMI, DVI-D, VGA, USB 3.2 Gen1, USB 2.0, Realtek LAN, audio | Internal: USB and front-panel headers	2026-09-18 08:51:24.537	2026-09-18 08:51:24.537
cmu6pynlk004014lfrsdr4cju	cmu6pynl9003q14lfiwe0pdd4	cmu6pyng5001t14lfiirn2uls	Core Boost, Audio Boost	2026-09-18 08:51:24.537	2026-09-18 08:51:24.537
cmu6pynlk004114lfudayz8g6	cmu6pynl9003q14lfiwe0pdd4	cmu6pyng6001v14lfejclbnlw	Micro ATX	2026-09-18 08:51:24.537	2026-09-18 08:51:24.537
cmu6pynlk004214lf6a02mud1	cmu6pynl9003q14lfiwe0pdd4	cmu6pyng7001x14lfs2q5z4kc	1x PCIe 3.0 x16 | 1x PCIe 3.0 x1 | 1x M.2 Key-M	2026-09-18 08:51:24.537	2026-09-18 08:51:24.537
cmu6pynlk004314lfweibhv4g	cmu6pynl9003q14lfiwe0pdd4	cmu6pyng8001z14lfrky9kl8k	3 Years	2026-09-18 08:51:24.537	2026-09-18 08:51:24.537
cmu6pynmr004c14lf2e2ysip6	cmu6pynm6004a14lfbyp1ggq0	cmu6pynfy001d14lfnomvc0tn	AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)	2026-09-18 08:51:24.579	2026-09-18 08:51:24.579
cmu6pynmr004d14lf3ut7x7uh	cmu6pynm6004a14lfbyp1ggq0	cmu6pynfz001f14lfzkgheosn	AMD B550	2026-09-18 08:51:24.579	2026-09-18 08:51:24.579
cmu6pynmr004e14lfv955bplw	cmu6pynm6004a14lfbyp1ggq0	cmu6pyng0001h14lfrol6ss30	128GB	2026-09-18 08:51:24.579	2026-09-18 08:51:24.579
cmu6pynmr004f14lfp0d2l7r3	cmu6pynm6004a14lfbyp1ggq0	cmu6pyng1001j14lf8l7bw4pz	DDR4	2026-09-18 08:51:24.579	2026-09-18 08:51:24.579
cmu6pynmr004g14lfy6tzxurz	cmu6pynm6004a14lfbyp1ggq0	cmu6pyng2001l14lfig07ezdq	2x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.579	2026-09-18 08:51:24.579
cmu6pynmr004h14lf49p8wt08	cmu6pynm6004a14lfbyp1ggq0	cmu6pyng3001n14lfqkp15mqn	1x HDMI, 1x DisplayPort	2026-09-18 08:51:24.579	2026-09-18 08:51:24.579
cmu6pynmr004i14lf4tjnbxu7	cmu6pynm6004a14lfbyp1ggq0	cmu6pyng4001p14lf6t13ws6b	Realtek ALC897 7.1 HD Audio	2026-09-18 08:51:24.579	2026-09-18 08:51:24.579
cmu6pynmr004j14lfzu31075s	cmu6pynm6004a14lfbyp1ggq0	cmu6pyng5001r14lfb5ia1r3a	Rear: HDMI, DP, USB 3.2 Gen1/Gen2, USB 2.0, Realtek 1GbE, audio | Internal: USB Type-C header (model dependent), RGB/fan headers	2026-09-18 08:51:24.579	2026-09-18 08:51:24.579
cmu6pynmr004k14lfil09zkrv	cmu6pynm6004a14lfbyp1ggq0	cmu6pyng5001t14lfiirn2uls	PCIe 4.0 ready, dual M.2, Lightning Gen4	2026-09-18 08:51:24.579	2026-09-18 08:51:24.579
cmu6pynmr004l14lfshtl8m3n	cmu6pynm6004a14lfbyp1ggq0	cmu6pyng6001v14lfejclbnlw	Micro ATX	2026-09-18 08:51:24.579	2026-09-18 08:51:24.579
cmu6pynmr004m14lffrxi101f	cmu6pynm6004a14lfbyp1ggq0	cmu6pyng7001x14lfs2q5z4kc	1x PCIe 4.0 x16 | 2x PCIe 3.0 x1 | 2x M.2 (1x Gen4 from CPU)	2026-09-18 08:51:24.579	2026-09-18 08:51:24.579
cmu6pynmr004n14lf2p1c2t6z	cmu6pynm6004a14lfbyp1ggq0	cmu6pyng8001z14lfrky9kl8k	3 Years	2026-09-18 08:51:24.579	2026-09-18 08:51:24.579
cmu6pynnf004w14lfounq7ep6	cmu6pynn6004u14lf1upst9p2	cmu6pynfy001d14lfnomvc0tn	AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)	2026-09-18 08:51:24.603	2026-09-18 08:51:24.603
cmu6pynnf004x14lfspest5yw	cmu6pynn6004u14lf1upst9p2	cmu6pynfz001f14lfzkgheosn	AMD A520	2026-09-18 08:51:24.603	2026-09-18 08:51:24.603
cmu6pynnf004y14lfdwc8ty6a	cmu6pynn6004u14lf1upst9p2	cmu6pyng0001h14lfrol6ss30	64GB	2026-09-18 08:51:24.603	2026-09-18 08:51:24.603
cmu6pynnf004z14lfnrqamyon	cmu6pynn6004u14lf1upst9p2	cmu6pyng1001j14lf8l7bw4pz	DDR4	2026-09-18 08:51:24.603	2026-09-18 08:51:24.603
cmu6pynnf005014lfjom0ilom	cmu6pynn6004u14lf1upst9p2	cmu6pyng2001l14lfig07ezdq	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.603	2026-09-18 08:51:24.603
cmu6pynnf005114lffw8n7wsf	cmu6pynn6004u14lf1upst9p2	cmu6pyng3001n14lfqkp15mqn	1x HDMI, 1x VGA	2026-09-18 08:51:24.603	2026-09-18 08:51:24.603
cmu6pynnf005214lf446uugbw	cmu6pynn6004u14lf1upst9p2	cmu6pyng4001p14lf6t13ws6b	Realtek ALC887 HD Audio	2026-09-18 08:51:24.603	2026-09-18 08:51:24.603
cmu6pynnf005314lftzuis6tv	cmu6pynn6004u14lf1upst9p2	cmu6pyng5001r14lfb5ia1r3a	Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio, PS/2 | Internal: USB 2.0/3.2 headers, COM, TPM	2026-09-18 08:51:24.603	2026-09-18 08:51:24.603
cmu6pynnf005414lf2u6rm3gi	cmu6pynn6004u14lf1upst9p2	cmu6pyng5001t14lfiirn2uls	ASUS 5X Protection III, Fan Xpert	2026-09-18 08:51:24.603	2026-09-18 08:51:24.603
cmu6pynnf005514lfzpni8nt7	cmu6pynn6004u14lf1upst9p2	cmu6pyng6001v14lfejclbnlw	Micro ATX	2026-09-18 08:51:24.603	2026-09-18 08:51:24.603
cmu6pynnf005614lfdigjopzl	cmu6pynn6004u14lf1upst9p2	cmu6pyng7001x14lfs2q5z4kc	1x PCIe 3.0 x16 | 1x PCIe 3.0 x1 | 1x M.2 Key-M	2026-09-18 08:51:24.603	2026-09-18 08:51:24.603
cmu6pynnf005714lfw1h5xl0l	cmu6pynn6004u14lf1upst9p2	cmu6pyng8001z14lfrky9kl8k	3 Years	2026-09-18 08:51:24.603	2026-09-18 08:51:24.603
cmu6pyno2005g14lfvy1qvbtf	cmu6pynnt005e14lf46rlo8dw	cmu6pynfy001d14lfnomvc0tn	AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)	2026-09-18 08:51:24.627	2026-09-18 08:51:24.627
cmu6pyno2005h14lfx51jyu6f	cmu6pynnt005e14lf46rlo8dw	cmu6pynfz001f14lfzkgheosn	AMD A520	2026-09-18 08:51:24.627	2026-09-18 08:51:24.627
cmu6pyno2005i14lfw28znrkl	cmu6pynnt005e14lf46rlo8dw	cmu6pyng0001h14lfrol6ss30	64GB	2026-09-18 08:51:24.627	2026-09-18 08:51:24.627
cmu6pyno2005j14lf46s320m9	cmu6pynnt005e14lf46rlo8dw	cmu6pyng1001j14lf8l7bw4pz	DDR4	2026-09-18 08:51:24.627	2026-09-18 08:51:24.627
cmu6pyno2005k14lf3tvqlb5u	cmu6pynnt005e14lf46rlo8dw	cmu6pyng2001l14lfig07ezdq	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.627	2026-09-18 08:51:24.627
cmu6pyno2005l14lfwk36aglm	cmu6pynnt005e14lf46rlo8dw	cmu6pyng3001n14lfqkp15mqn	1x HDMI, 1x DVI-D, 1x VGA	2026-09-18 08:51:24.627	2026-09-18 08:51:24.627
cmu6pyno2005m14lfia20znou	cmu6pynnt005e14lf46rlo8dw	cmu6pyng4001p14lf6t13ws6b	Realtek ALC887 HD Audio	2026-09-18 08:51:24.627	2026-09-18 08:51:24.627
cmu6pyno2005n14lfb19lgstx	cmu6pynnt005e14lf46rlo8dw	cmu6pyng5001r14lfb5ia1r3a	Rear: HDMI, DVI-D, VGA, USB 3.2 Gen1, USB 2.0, Realtek LAN, audio, PS/2 | Internal: USB headers, COM, TPM	2026-09-18 08:51:24.627	2026-09-18 08:51:24.627
cmu6pyno2005o14lfb9a17e50	cmu6pynnt005e14lf46rlo8dw	cmu6pyng5001t14lfiirn2uls	ASUS 5X Protection III, Digi+ VRM	2026-09-18 08:51:24.627	2026-09-18 08:51:24.627
cmu6pyno2005p14lfb15n7crg	cmu6pynnt005e14lf46rlo8dw	cmu6pyng6001v14lfejclbnlw	Micro ATX	2026-09-18 08:51:24.627	2026-09-18 08:51:24.627
cmu6pyno2005q14lfz06wcy61	cmu6pynnt005e14lf46rlo8dw	cmu6pyng7001x14lfs2q5z4kc	1x PCIe 3.0 x16 | 2x PCIe 3.0 x1 | 1x M.2 Key-M	2026-09-18 08:51:24.627	2026-09-18 08:51:24.627
cmu6pyno2005r14lfk8r3hkjx	cmu6pynnt005e14lf46rlo8dw	cmu6pyng8001z14lfrky9kl8k	3 Years	2026-09-18 08:51:24.627	2026-09-18 08:51:24.627
cmu6pynr8008c14lfcuidir3m	cmu6pynr0008614lf9j7jqodq	cmu6pyng2001l14lfig07ezdq	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.741	2026-09-18 08:51:24.741
cmu6pynop006014lf0r9mdoea	cmu6pynog005y14lf22i6m8d1	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)	2026-09-18 08:51:24.649	2026-09-18 08:51:24.649
cmu6pynop006114lf7rtjb5ng	cmu6pynog005y14lf22i6m8d1	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-18 08:51:24.649	2026-09-18 08:51:24.649
cmu6pynop006214lfed6u32ls	cmu6pynog005y14lf22i6m8d1	cmu6pynfo000t14lfqadrp9c6	64GB	2026-09-18 08:51:24.649	2026-09-18 08:51:24.649
cmu6pynop006314lffviod1jw	cmu6pynog005y14lf22i6m8d1	cmu6pynfo000v14lfk2twms3r	DDR4	2026-09-18 08:51:24.649	2026-09-18 08:51:24.649
cmu6pynop006414lfzx7nzd1g	cmu6pynog005y14lf22i6m8d1	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 2x SATA 6Gb/s	2026-09-18 08:51:24.649	2026-09-18 08:51:24.649
cmu6pynop006514lftgjo6ue2	cmu6pynog005y14lf22i6m8d1	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x VGA	2026-09-18 08:51:24.649	2026-09-18 08:51:24.649
cmu6pynop006614lfnha0zlzs	cmu6pynog005y14lf22i6m8d1	cmu6pynfs001114lflya0h3wr	Realtek ALC897 HD Audio	2026-09-18 08:51:24.649	2026-09-18 08:51:24.649
cmu6pynop006714lfqtii54e3	cmu6pynog005y14lf22i6m8d1	cmu6pynfu001314lft9yu4wju	Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio | Internal: USB headers, front panel	2026-09-18 08:51:24.649	2026-09-18 08:51:24.649
cmu6pynop006814lf71n9ew7k	cmu6pynog005y14lf22i6m8d1	cmu6pynfv001514lfpv41pubh	ASUS 5X Protection III, Fan Xpert	2026-09-18 08:51:24.649	2026-09-18 08:51:24.649
cmu6pynop006914lfg9kb2n0x	cmu6pynog005y14lf22i6m8d1	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:24.649	2026-09-18 08:51:24.649
cmu6pynop006a14lfnop7173p	cmu6pynog005y14lf22i6m8d1	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0 x16 | 1x PCIe 3.0 x1 | 1x M.2 PCIe 3.0 x4	2026-09-18 08:51:24.649	2026-09-18 08:51:24.649
cmu6pynop006b14lfyec2dge8	cmu6pynog005y14lf22i6m8d1	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:24.649	2026-09-18 08:51:24.649
cmu6pynpd006k14lft5uoe720	cmu6pynp3006i14lfiw3ej7xk	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)	2026-09-18 08:51:24.674	2026-09-18 08:51:24.674
cmu6pynpd006l14lf2v2p2hia	cmu6pynp3006i14lfiw3ej7xk	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-18 08:51:24.674	2026-09-18 08:51:24.674
cmu6pynpd006m14lfv2py166u	cmu6pynp3006i14lfiw3ej7xk	cmu6pynfo000t14lfqadrp9c6	64GB	2026-09-18 08:51:24.674	2026-09-18 08:51:24.674
cmu6pynpd006n14lfqfk7dhel	cmu6pynp3006i14lfiw3ej7xk	cmu6pynfo000v14lfk2twms3r	DDR4	2026-09-18 08:51:24.674	2026-09-18 08:51:24.674
cmu6pynpd006o14lfd2qb3b7a	cmu6pynp3006i14lfiw3ej7xk	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.674	2026-09-18 08:51:24.674
cmu6pynpd006p14lf0kwvxpoz	cmu6pynp3006i14lfiw3ej7xk	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x DVI-D, 1x VGA	2026-09-18 08:51:24.674	2026-09-18 08:51:24.674
cmu6pynpd006q14lfdg6zk23y	cmu6pynp3006i14lfiw3ej7xk	cmu6pynfs001114lflya0h3wr	Realtek ALC897 HD Audio	2026-09-18 08:51:24.674	2026-09-18 08:51:24.674
cmu6pynpd006r14lfpr5zlmov	cmu6pynp3006i14lfiw3ej7xk	cmu6pynfu001314lft9yu4wju	Rear: HDMI, DVI-D, VGA, 2x USB 3.2 Gen1, 2x USB 2.0, Realtek 1GbE, 3x audio, PS/2 KB/Mouse | Internal: USB 3.2/2.0 headers, COM, LPT, TPM	2026-09-18 08:51:24.674	2026-09-18 08:51:24.674
cmu6pynpd006s14lfeqtmxy2p	cmu6pynp3006i14lfiw3ej7xk	cmu6pynfv001514lfpv41pubh	ASUS 5X Protection III, Fan Xpert, Digi+ VRM	2026-09-18 08:51:24.674	2026-09-18 08:51:24.674
cmu6pynpd006t14lf9tud38ga	cmu6pynp3006i14lfiw3ej7xk	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:24.674	2026-09-18 08:51:24.674
cmu6pynpd006u14lf23kv8513	cmu6pynp3006i14lfiw3ej7xk	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0 x16 | 1x PCIe 3.0 x1 | 1x M.2 Key-M PCIe 3.0 x4	2026-09-18 08:51:24.674	2026-09-18 08:51:24.674
cmu6pynpd006v14lf7loupto3	cmu6pynp3006i14lfiw3ej7xk	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:24.674	2026-09-18 08:51:24.674
cmu6pynpz007414lfdoq0cqw0	cmu6pynpq007214lfxnazof8b	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)	2026-09-18 08:51:24.696	2026-09-18 08:51:24.696
cmu6pynpz007514lfhtj7kuj7	cmu6pynpq007214lfxnazof8b	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-18 08:51:24.696	2026-09-18 08:51:24.696
cmu6pynpz007614lfeqx8cj74	cmu6pynpq007214lfxnazof8b	cmu6pynfo000t14lfqadrp9c6	96GB	2026-09-18 08:51:24.696	2026-09-18 08:51:24.696
cmu6pynpz007714lf4vq0m6q6	cmu6pynpq007214lfxnazof8b	cmu6pynfo000v14lfk2twms3r	DDR5	2026-09-18 08:51:24.696	2026-09-18 08:51:24.696
cmu6pynpz007814lfl3z1v7u9	cmu6pynpq007214lfxnazof8b	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.696	2026-09-18 08:51:24.696
cmu6pynpz007914lfkk5gzesz	cmu6pynpq007214lfxnazof8b	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x DVI-D, 1x VGA	2026-09-18 08:51:24.696	2026-09-18 08:51:24.696
cmu6pynpz007a14lfsiniugi4	cmu6pynpq007214lfxnazof8b	cmu6pynfs001114lflya0h3wr	Realtek ALC897 HD Audio	2026-09-18 08:51:24.696	2026-09-18 08:51:24.696
cmu6pynpz007b14lfvs25huk6	cmu6pynpq007214lfxnazof8b	cmu6pynfu001314lft9yu4wju	Rear: HDMI, DVI-D, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio, PS/2 | Internal: USB headers, COM, TPM	2026-09-18 08:51:24.696	2026-09-18 08:51:24.696
cmu6pynpz007c14lfp8dwlz6h	cmu6pynpq007214lfxnazof8b	cmu6pynfv001514lfpv41pubh	DDR5 support, ASUS 5X Protection III	2026-09-18 08:51:24.696	2026-09-18 08:51:24.696
cmu6pynpz007d14lfxdcz81s5	cmu6pynpq007214lfxnazof8b	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:24.696	2026-09-18 08:51:24.696
cmu6pynpz007e14lfmtms4924	cmu6pynpq007214lfxnazof8b	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0 x16 | 1x PCIe 3.0 x1 | 1x M.2 Key-M	2026-09-18 08:51:24.696	2026-09-18 08:51:24.696
cmu6pynpz007f14lfbtvnfv3y	cmu6pynpq007214lfxnazof8b	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:24.696	2026-09-18 08:51:24.696
cmu6pynql007o14lfjm0g9l01	cmu6pynqc007m14lfu9ra7yvv	cmu6pynfy001d14lfnomvc0tn	AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)	2026-09-18 08:51:24.717	2026-09-18 08:51:24.717
cmu6pynql007p14lfs9k8j5lt	cmu6pynqc007m14lfu9ra7yvv	cmu6pynfz001f14lfzkgheosn	AMD A520	2026-09-18 08:51:24.717	2026-09-18 08:51:24.717
cmu6pynql007q14lfvby9eqwi	cmu6pynqc007m14lfu9ra7yvv	cmu6pyng0001h14lfrol6ss30	128GB	2026-09-18 08:51:24.717	2026-09-18 08:51:24.717
cmu6pynql007r14lfak9ihba6	cmu6pynqc007m14lfu9ra7yvv	cmu6pyng1001j14lf8l7bw4pz	DDR4	2026-09-18 08:51:24.717	2026-09-18 08:51:24.717
cmu6pynql007s14lf21fg6loc	cmu6pynqc007m14lfu9ra7yvv	cmu6pyng2001l14lfig07ezdq	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.717	2026-09-18 08:51:24.717
cmu6pynql007t14lf5eg1qixa	cmu6pynqc007m14lfu9ra7yvv	cmu6pyng3001n14lfqkp15mqn	1x HDMI, 1x DVI-D, 1x VGA	2026-09-18 08:51:24.717	2026-09-18 08:51:24.717
cmu6pynql007u14lfhdhf1g86	cmu6pynqc007m14lfu9ra7yvv	cmu6pyng4001p14lf6t13ws6b	Realtek ALC887 HD Audio	2026-09-18 08:51:24.717	2026-09-18 08:51:24.717
cmu6pynql007v14lf8887xgjl	cmu6pynqc007m14lfu9ra7yvv	cmu6pyng5001r14lfb5ia1r3a	Rear: HDMI, DVI-D, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio | Internal: Aura RGB header, USB headers	2026-09-18 08:51:24.717	2026-09-18 08:51:24.717
cmu6pynql007w14lflngqdwaj	cmu6pynqc007m14lfu9ra7yvv	cmu6pyng5001t14lfiirn2uls	ASUS Aura Sync header, 5X Protection III	2026-09-18 08:51:24.717	2026-09-18 08:51:24.717
cmu6pynql007x14lfl6yoeewq	cmu6pynqc007m14lfu9ra7yvv	cmu6pyng6001v14lfejclbnlw	Micro ATX	2026-09-18 08:51:24.717	2026-09-18 08:51:24.717
cmu6pynql007y14lfd7m2wung	cmu6pynqc007m14lfu9ra7yvv	cmu6pyng7001x14lfs2q5z4kc	1x PCIe 3.0 x16 | 2x PCIe 3.0 x1 | 1x M.2 Key-M	2026-09-18 08:51:24.717	2026-09-18 08:51:24.717
cmu6pynql007z14lfnail29bf	cmu6pynqc007m14lfu9ra7yvv	cmu6pyng8001z14lfrky9kl8k	3 Years	2026-09-18 08:51:24.717	2026-09-18 08:51:24.717
cmu6pynr8008814lfp4vyapp9	cmu6pynr0008614lf9j7jqodq	cmu6pynfy001d14lfnomvc0tn	AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)	2026-09-18 08:51:24.741	2026-09-18 08:51:24.741
cmu6pynr8008914lfd85yy9am	cmu6pynr0008614lf9j7jqodq	cmu6pynfz001f14lfzkgheosn	AMD A520	2026-09-18 08:51:24.741	2026-09-18 08:51:24.741
cmu6pynr8008a14lf1niztynr	cmu6pynr0008614lf9j7jqodq	cmu6pyng0001h14lfrol6ss30	64GB	2026-09-18 08:51:24.741	2026-09-18 08:51:24.741
cmu6pynr8008b14lfohj3u6qa	cmu6pynr0008614lf9j7jqodq	cmu6pyng1001j14lf8l7bw4pz	DDR4	2026-09-18 08:51:24.741	2026-09-18 08:51:24.741
cmu6pynr8008d14lfx0ho1ik9	cmu6pynr0008614lf9j7jqodq	cmu6pyng3001n14lfqkp15mqn	1x HDMI, 1x DVI-D	2026-09-18 08:51:24.741	2026-09-18 08:51:24.741
cmu6pynr8008e14lfg5bfkmi8	cmu6pynr0008614lf9j7jqodq	cmu6pyng4001p14lf6t13ws6b	Realtek Audio CODEC HD Audio	2026-09-18 08:51:24.741	2026-09-18 08:51:24.741
cmu6pynr8008f14lfy48r3yta	cmu6pynr0008614lf9j7jqodq	cmu6pyng5001r14lfb5ia1r3a	Rear: HDMI, DVI-D, USB 3.2 Gen1, USB 2.0, Realtek GbE LAN, audio | Internal: USB headers, front panel	2026-09-18 08:51:24.741	2026-09-18 08:51:24.741
cmu6pynr8008g14lfak6l22cy	cmu6pynr0008614lf9j7jqodq	cmu6pyng5001t14lfiirn2uls	Smart Fan 6, Anti-Sulfur Resistors	2026-09-18 08:51:24.741	2026-09-18 08:51:24.741
cmu6pynr8008h14lf2qwkjq1i	cmu6pynr0008614lf9j7jqodq	cmu6pyng6001v14lfejclbnlw	Micro ATX	2026-09-18 08:51:24.741	2026-09-18 08:51:24.741
cmu6pynr8008i14lfhl2cvbue	cmu6pynr0008614lf9j7jqodq	cmu6pyng7001x14lfs2q5z4kc	1x PCIe x16 | 1x PCIe x1 | 1x M.2	2026-09-18 08:51:24.741	2026-09-18 08:51:24.741
cmu6pynr8008j14lf8wwj03u9	cmu6pynr0008614lf9j7jqodq	cmu6pyng8001z14lfrky9kl8k	3 Years	2026-09-18 08:51:24.741	2026-09-18 08:51:24.741
cmu6pynru008s14lf8mrnl8gy	cmu6pynrl008q14lf6340ni1v	cmu6pynfy001d14lfnomvc0tn	AMD Ryzen 5000/3000/2000 Series (AM4, BIOS dependent)	2026-09-18 08:51:24.762	2026-09-18 08:51:24.762
cmu6pynru008t14lfmfvch2ua	cmu6pynrl008q14lf6340ni1v	cmu6pynfz001f14lfzkgheosn	AMD B450	2026-09-18 08:51:24.762	2026-09-18 08:51:24.762
cmu6pynru008u14lf2c1o7bmq	cmu6pynrl008q14lf6340ni1v	cmu6pyng0001h14lfrol6ss30	64GB	2026-09-18 08:51:24.762	2026-09-18 08:51:24.762
cmu6pynru008v14lfoyyms3kc	cmu6pynrl008q14lf6340ni1v	cmu6pyng1001j14lf8l7bw4pz	DDR4	2026-09-18 08:51:24.762	2026-09-18 08:51:24.762
cmu6pynru008w14lfyq7difxi	cmu6pynrl008q14lf6340ni1v	cmu6pyng2001l14lfig07ezdq	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.762	2026-09-18 08:51:24.762
cmu6pynru008x14lf2tmpomnu	cmu6pynrl008q14lf6340ni1v	cmu6pyng3001n14lfqkp15mqn	1x HDMI, 1x DVI-D	2026-09-18 08:51:24.762	2026-09-18 08:51:24.762
cmu6pynru008y14lf5klukawa	cmu6pynrl008q14lf6340ni1v	cmu6pyng4001p14lf6t13ws6b	Realtek Audio CODEC HD Audio	2026-09-18 08:51:24.762	2026-09-18 08:51:24.762
cmu6pynru008z14lf8qsyb4kh	cmu6pynrl008q14lf6340ni1v	cmu6pyng5001r14lfb5ia1r3a	Rear: HDMI, DVI-D, USB 3.1/3.0, USB 2.0, Realtek LAN, audio | Internal: USB headers, RGB header (model dependent)	2026-09-18 08:51:24.762	2026-09-18 08:51:24.762
cmu6pynru009014lfcupjhsh5	cmu6pynrl008q14lf6340ni1v	cmu6pyng5001t14lfiirn2uls	Smart Fan 5, Ultra Durable	2026-09-18 08:51:24.762	2026-09-18 08:51:24.762
cmu6pynru009114lf9js4nk0y	cmu6pynrl008q14lf6340ni1v	cmu6pyng6001v14lfejclbnlw	Micro ATX	2026-09-18 08:51:24.762	2026-09-18 08:51:24.762
cmu6pynru009214lfjakn2byg	cmu6pynrl008q14lf6340ni1v	cmu6pyng7001x14lfs2q5z4kc	1x PCIe x16 | 1x PCIe x1 | 1x M.2	2026-09-18 08:51:24.762	2026-09-18 08:51:24.762
cmu6pynru009314lfd05iu6nn	cmu6pynrl008q14lf6340ni1v	cmu6pyng8001z14lfrky9kl8k	3 Years	2026-09-18 08:51:24.762	2026-09-18 08:51:24.762
cmu6pynsi009c14lfvg6zrcla	cmu6pyns9009a14lfmpt8ulet	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen (LGA1700)	2026-09-18 08:51:24.787	2026-09-18 08:51:24.787
cmu6pynsi009d14lf9rf3hexq	cmu6pyns9009a14lfmpt8ulet	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-18 08:51:24.787	2026-09-18 08:51:24.787
cmu6pynsi009e14lf81zsvjo2	cmu6pyns9009a14lfmpt8ulet	cmu6pynfo000t14lfqadrp9c6	64GB	2026-09-18 08:51:24.787	2026-09-18 08:51:24.787
cmu6pynsi009f14lfp03cpyct	cmu6pyns9009a14lfmpt8ulet	cmu6pynfo000v14lfk2twms3r	DDR4	2026-09-18 08:51:24.787	2026-09-18 08:51:24.787
cmu6pynsi009g14lfkjulxj9l	cmu6pyns9009a14lfmpt8ulet	cmu6pynfp000x14lfgbwb97o2	1x M.2 PCIe 3.0 x4 + 4x SATA 6Gb/s	2026-09-18 08:51:24.787	2026-09-18 08:51:24.787
cmu6pynsi009h14lf5jk03ral	cmu6pyns9009a14lfmpt8ulet	cmu6pynfr000z14lf0rzzeznh	1x HDMI	2026-09-18 08:51:24.787	2026-09-18 08:51:24.787
cmu6pynsi009i14lfiev71y6c	cmu6pyns9009a14lfmpt8ulet	cmu6pynfs001114lflya0h3wr	Realtek Audio CODEC HD Audio	2026-09-18 08:51:24.787	2026-09-18 08:51:24.787
cmu6pynsi009j14lfjj3ug0f5	cmu6pyns9009a14lfmpt8ulet	cmu6pynfu001314lft9yu4wju	Rear: HDMI, USB 3.2 Gen1, USB 2.0, Realtek GbE LAN, audio | Internal: USB headers, Smart Fan headers	2026-09-18 08:51:24.787	2026-09-18 08:51:24.787
cmu6pynsi009k14lf61p0o37i	cmu6pyns9009a14lfmpt8ulet	cmu6pynfv001514lfpv41pubh	Smart Fan 6, Anti-Sulfur Resistors, NVMe M.2	2026-09-18 08:51:24.787	2026-09-18 08:51:24.787
cmu6pynsi009l14lfgougtd6k	cmu6pyns9009a14lfmpt8ulet	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:24.787	2026-09-18 08:51:24.787
cmu6pynsi009m14lf466dqopb	cmu6pyns9009a14lfmpt8ulet	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0 x16 | 1x PCIe x1 | 1x M.2 NVMe	2026-09-18 08:51:24.787	2026-09-18 08:51:24.787
cmu6pynsi009n14lf5m008qs0	cmu6pyns9009a14lfmpt8ulet	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:24.787	2026-09-18 08:51:24.787
cmu6pynt6009w14lftk8vgnxy	cmu6pynsx009u14lflgy1fc53	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen (LGA1700)	2026-09-18 08:51:24.811	2026-09-18 08:51:24.811
cmu6pynt6009x14lf7rztx66o	cmu6pynsx009u14lflgy1fc53	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-18 08:51:24.811	2026-09-18 08:51:24.811
cmu6pynt6009y14lfe03ati6e	cmu6pynsx009u14lflgy1fc53	cmu6pynfo000t14lfqadrp9c6	64GB	2026-09-18 08:51:24.811	2026-09-18 08:51:24.811
cmu6pynt6009z14lftg53j5jt	cmu6pynsx009u14lflgy1fc53	cmu6pynfo000v14lfk2twms3r	DDR4	2026-09-18 08:51:24.811	2026-09-18 08:51:24.811
cmu6pynt600a014lfqeyt1xb3	cmu6pynsx009u14lflgy1fc53	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.811	2026-09-18 08:51:24.811
cmu6pynt600a114lfu5mpd7oc	cmu6pynsx009u14lflgy1fc53	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x VGA	2026-09-18 08:51:24.811	2026-09-18 08:51:24.811
cmu6pynt600a214lf4lcd44ak	cmu6pynsx009u14lflgy1fc53	cmu6pynfs001114lflya0h3wr	Realtek Audio CODEC HD Audio	2026-09-18 08:51:24.811	2026-09-18 08:51:24.811
cmu6pynt600a314lftnpaynw2	cmu6pynsx009u14lflgy1fc53	cmu6pynfu001314lft9yu4wju	Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek GbE, audio | Internal: USB / front panel headers	2026-09-18 08:51:24.811	2026-09-18 08:51:24.811
cmu6pynt600a414lf8tu4iiaa	cmu6pynsx009u14lflgy1fc53	cmu6pynfv001514lfpv41pubh	Smart Fan 6, Anti-Sulfur design	2026-09-18 08:51:24.811	2026-09-18 08:51:24.811
cmu6pynt600a514lf6mx17rb2	cmu6pynsx009u14lflgy1fc53	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:24.811	2026-09-18 08:51:24.811
cmu6pynt600a614lfpltcqg4t	cmu6pynsx009u14lflgy1fc53	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0 x16 | 1x PCIe x1 | 1x M.2	2026-09-18 08:51:24.811	2026-09-18 08:51:24.811
cmu6pynt600a714lf5if1n49i	cmu6pynsx009u14lflgy1fc53	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:24.811	2026-09-18 08:51:24.811
cmu6pynts00ag14lf33gy6k4u	cmu6pyntk00ae14lfm0qqeg8e	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen (LGA1700)	2026-09-18 08:51:24.833	2026-09-18 08:51:24.833
cmu6pynts00ah14lf92y37y14	cmu6pyntk00ae14lfm0qqeg8e	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-18 08:51:24.833	2026-09-18 08:51:24.833
cmu6pynts00ai14lfja5084wk	cmu6pyntk00ae14lfm0qqeg8e	cmu6pynfo000t14lfqadrp9c6	96GB	2026-09-18 08:51:24.833	2026-09-18 08:51:24.833
cmu6pynts00aj14lfi98bc1hj	cmu6pyntk00ae14lfm0qqeg8e	cmu6pynfo000v14lfk2twms3r	DDR5	2026-09-18 08:51:24.833	2026-09-18 08:51:24.833
cmu6pynts00ak14lf3mpanod5	cmu6pyntk00ae14lfm0qqeg8e	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.833	2026-09-18 08:51:24.833
cmu6pynts00al14lfyzhqtc4v	cmu6pyntk00ae14lfm0qqeg8e	cmu6pynfr000z14lf0rzzeznh	1x HDMI	2026-09-18 08:51:24.833	2026-09-18 08:51:24.833
cmu6pynts00am14lfno9xa0os	cmu6pyntk00ae14lfm0qqeg8e	cmu6pynfs001114lflya0h3wr	Realtek Audio CODEC HD Audio	2026-09-18 08:51:24.833	2026-09-18 08:51:24.833
cmu6pynts00an14lf7gmwatoy	cmu6pyntk00ae14lfm0qqeg8e	cmu6pynfu001314lft9yu4wju	Rear: HDMI, USB 3.2 Gen1, USB 2.0, Realtek GbE, audio | Internal: USB headers, Smart Fan headers	2026-09-18 08:51:24.833	2026-09-18 08:51:24.833
cmu6pynts00ao14lfar811a6z	cmu6pyntk00ae14lfm0qqeg8e	cmu6pynfv001514lfpv41pubh	DDR5 dual-channel, Smart Fan 6	2026-09-18 08:51:24.833	2026-09-18 08:51:24.833
cmu6pynts00ap14lfgtryredg	cmu6pyntk00ae14lfm0qqeg8e	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:24.833	2026-09-18 08:51:24.833
cmu6pynts00aq14lf6ui346ia	cmu6pyntk00ae14lfm0qqeg8e	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0 x16 | 1x PCIe x1 | 1x M.2	2026-09-18 08:51:24.833	2026-09-18 08:51:24.833
cmu6pynts00ar14lf6dnytgry	cmu6pyntk00ae14lfm0qqeg8e	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:24.833	2026-09-18 08:51:24.833
cmu6pynuh00b014lfch7wt1ee	cmu6pynu700ay14lf9u2x0psh	cmu6pynfy001d14lfnomvc0tn	AMD Ryzen 9000/8000/7000 Series (AM5)	2026-09-18 08:51:24.858	2026-09-18 08:51:24.858
cmu6pynuh00b114lf88dxarui	cmu6pynu700ay14lf9u2x0psh	cmu6pynfz001f14lfzkgheosn	AMD A620	2026-09-18 08:51:24.858	2026-09-18 08:51:24.858
cmu6pynuh00b214lfpay2pylz	cmu6pynu700ay14lf9u2x0psh	cmu6pyng0001h14lfrol6ss30	128GB	2026-09-18 08:51:24.858	2026-09-18 08:51:24.858
cmu6pynuh00b314lfhb2a230t	cmu6pynu700ay14lf9u2x0psh	cmu6pyng1001j14lf8l7bw4pz	DDR5	2026-09-18 08:51:24.858	2026-09-18 08:51:24.858
cmu6pynuh00b414lfkwcus5sd	cmu6pynu700ay14lf9u2x0psh	cmu6pyng2001l14lfig07ezdq	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.858	2026-09-18 08:51:24.858
cmu6pynuh00b514lf8ckdc3gl	cmu6pynu700ay14lf9u2x0psh	cmu6pyng3001n14lfqkp15mqn	1x HDMI, 1x DisplayPort	2026-09-18 08:51:24.858	2026-09-18 08:51:24.858
cmu6pynuh00b614lf190vmjm5	cmu6pynu700ay14lf9u2x0psh	cmu6pyng4001p14lf6t13ws6b	Realtek Audio CODEC HD Audio	2026-09-18 08:51:24.858	2026-09-18 08:51:24.858
cmu6pynuh00b714lffj3btr2t	cmu6pynu700ay14lf9u2x0psh	cmu6pyng5001r14lfb5ia1r3a	Rear: HDMI, DP, USB 3.2 Gen1, USB 2.0, Realtek GbE, audio | Internal: USB headers, fan headers	2026-09-18 08:51:24.858	2026-09-18 08:51:24.858
cmu6pynuh00b814lfmtmi43c8	cmu6pynu700ay14lf9u2x0psh	cmu6pyng5001t14lfiirn2uls	AMD EXPO ready, Smart Fan 6	2026-09-18 08:51:24.858	2026-09-18 08:51:24.858
cmu6pynuh00b914lfomwag2ux	cmu6pynu700ay14lf9u2x0psh	cmu6pyng6001v14lfejclbnlw	Micro ATX	2026-09-18 08:51:24.858	2026-09-18 08:51:24.858
cmu6pynuh00ba14lf210ptc2d	cmu6pynu700ay14lf9u2x0psh	cmu6pyng7001x14lfs2q5z4kc	1x PCIe 4.0 x16 | 1x PCIe x1 | 1x M.2	2026-09-18 08:51:24.858	2026-09-18 08:51:24.858
cmu6pynuh00bb14lfmar15unu	cmu6pynu700ay14lf9u2x0psh	cmu6pyng8001z14lfrky9kl8k	3 Years	2026-09-18 08:51:24.858	2026-09-18 08:51:24.858
cmu6pynv500bk14lfqht6msd0	cmu6pynux00bi14lfx6crv5wy	cmu6pynfy001d14lfnomvc0tn	AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)	2026-09-18 08:51:24.881	2026-09-18 08:51:24.881
cmu6pynv500bl14lfk9spenpf	cmu6pynux00bi14lfx6crv5wy	cmu6pynfz001f14lfzkgheosn	AMD A520	2026-09-18 08:51:24.881	2026-09-18 08:51:24.881
cmu6pynv500bm14lfcus7jb37	cmu6pynux00bi14lfx6crv5wy	cmu6pyng0001h14lfrol6ss30	64GB	2026-09-18 08:51:24.881	2026-09-18 08:51:24.881
cmu6pynv500bn14lf4s9sgulk	cmu6pynux00bi14lfx6crv5wy	cmu6pyng1001j14lf8l7bw4pz	DDR4	2026-09-18 08:51:24.881	2026-09-18 08:51:24.881
cmu6pynv500bo14lfn24r3vui	cmu6pynux00bi14lfx6crv5wy	cmu6pyng2001l14lfig07ezdq	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.881	2026-09-18 08:51:24.881
cmu6pynv500bp14lfxrtnzb4n	cmu6pynux00bi14lfx6crv5wy	cmu6pyng3001n14lfqkp15mqn	1x HDMI, 1x VGA	2026-09-18 08:51:24.881	2026-09-18 08:51:24.881
cmu6pynv500bq14lfby1qnr2m	cmu6pynux00bi14lfx6crv5wy	cmu6pyng4001p14lf6t13ws6b	Realtek ALC887 HD Audio	2026-09-18 08:51:24.881	2026-09-18 08:51:24.881
cmu6pynv500br14lfp75mpiv8	cmu6pynux00bi14lfx6crv5wy	cmu6pyng5001r14lfb5ia1r3a	Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek LAN, audio, PS/2 | Internal: USB headers, COM	2026-09-18 08:51:24.881	2026-09-18 08:51:24.881
cmu6pynv500bs14lfw5k5ps3s	cmu6pynux00bi14lfx6crv5wy	cmu6pyng5001t14lfiirn2uls	ASRock Full Spike Protection	2026-09-18 08:51:24.881	2026-09-18 08:51:24.881
cmu6pynv500bt14lfz0apq0l2	cmu6pynux00bi14lfx6crv5wy	cmu6pyng6001v14lfejclbnlw	Micro ATX	2026-09-18 08:51:24.881	2026-09-18 08:51:24.881
cmu6pynv500bu14lf31dsta27	cmu6pynux00bi14lfx6crv5wy	cmu6pyng7001x14lfs2q5z4kc	1x PCIe 3.0 x16 | 1x PCIe 3.0 x1 | 1x M.2 Key-M	2026-09-18 08:51:24.881	2026-09-18 08:51:24.881
cmu6pynv500bv14lf9qmod1i2	cmu6pynux00bi14lfx6crv5wy	cmu6pyng8001z14lfrky9kl8k	3 Years	2026-09-18 08:51:24.881	2026-09-18 08:51:24.881
cmu6pynvr00c414lfq92k2gfi	cmu6pynvi00c214lfh2lvojue	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen (LGA1700)	2026-09-18 08:51:24.903	2026-09-18 08:51:24.903
cmu6pynvr00c514lfssclh5l0	cmu6pynvi00c214lfh2lvojue	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-18 08:51:24.903	2026-09-18 08:51:24.903
cmu6pynvr00c614lf5hrmlb0u	cmu6pynvi00c214lfh2lvojue	cmu6pynfo000t14lfqadrp9c6	96GB	2026-09-18 08:51:24.903	2026-09-18 08:51:24.903
cmu6pynvr00c714lf4v9cwf3g	cmu6pynvi00c214lfh2lvojue	cmu6pynfo000v14lfk2twms3r	DDR5	2026-09-18 08:51:24.903	2026-09-18 08:51:24.903
cmu6pynvr00c814lfgvox31e3	cmu6pynvi00c214lfh2lvojue	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.903	2026-09-18 08:51:24.903
cmu6pynvr00c914lfj3jsipgd	cmu6pynvi00c214lfh2lvojue	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x VGA	2026-09-18 08:51:24.903	2026-09-18 08:51:24.903
cmu6pynvr00ca14lfr7h1owcp	cmu6pynvi00c214lfh2lvojue	cmu6pynfs001114lflya0h3wr	Realtek ALC897 HD Audio	2026-09-18 08:51:24.903	2026-09-18 08:51:24.903
cmu6pynvr00cb14lfj7hcsaql	cmu6pynvi00c214lfh2lvojue	cmu6pynfu001314lft9yu4wju	Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio | Internal: USB headers, front panel	2026-09-18 08:51:24.903	2026-09-18 08:51:24.903
cmu6pynvr00cc14lf1yu3gw32	cmu6pynvi00c214lfh2lvojue	cmu6pynfv001514lfpv41pubh	M.2 slot highlighted, Full Spike Protection	2026-09-18 08:51:24.903	2026-09-18 08:51:24.903
cmu6pynvr00cd14lfoil5xtvw	cmu6pynvi00c214lfh2lvojue	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:24.903	2026-09-18 08:51:24.903
cmu6pynvr00ce14lfmfu2mlf1	cmu6pynvi00c214lfh2lvojue	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0 x16 | 1x PCIe 3.0 x1 | 1x M.2 Key-M	2026-09-18 08:51:24.903	2026-09-18 08:51:24.903
cmu6pynvr00cf14lfhqpj5l9w	cmu6pynvi00c214lfh2lvojue	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:24.903	2026-09-18 08:51:24.903
cmu6pynwc00co14lfgvctnf1p	cmu6pynw400cm14lf0ve7ekcp	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen (LGA1700)	2026-09-18 08:51:24.925	2026-09-18 08:51:24.925
cmu6pynwc00cp14lfuafr1zrx	cmu6pynw400cm14lf0ve7ekcp	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-18 08:51:24.925	2026-09-18 08:51:24.925
cmu6pynwc00cq14lf9bssp4x2	cmu6pynw400cm14lf0ve7ekcp	cmu6pynfo000t14lfqadrp9c6	64GB	2026-09-18 08:51:24.925	2026-09-18 08:51:24.925
cmu6pynwc00cr14lf4skctopl	cmu6pynw400cm14lf0ve7ekcp	cmu6pynfo000v14lfk2twms3r	DDR4	2026-09-18 08:51:24.925	2026-09-18 08:51:24.925
cmu6pynwc00cs14lfx9vps2t9	cmu6pynw400cm14lf0ve7ekcp	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.925	2026-09-18 08:51:24.925
cmu6pynwc00ct14lfp4cye3na	cmu6pynw400cm14lf0ve7ekcp	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x VGA	2026-09-18 08:51:24.925	2026-09-18 08:51:24.925
cmu6pynwc00cu14lfa5tztund	cmu6pynw400cm14lf0ve7ekcp	cmu6pynfs001114lflya0h3wr	Realtek HD Audio Codec	2026-09-18 08:51:24.925	2026-09-18 08:51:24.925
cmu6pynwc00cv14lfvzlss6tq	cmu6pynw400cm14lf0ve7ekcp	cmu6pynfu001314lft9yu4wju	Rear: HDMI, VGA, USB 3.2, USB 2.0, 1GbE LAN, Wi-Fi antennas, audio | Internal: USB headers	2026-09-18 08:51:24.925	2026-09-18 08:51:24.925
cmu6pynwc00cw14lfrlfio0o0	cmu6pynw400cm14lf0ve7ekcp	cmu6pynfv001514lfpv41pubh	Wi-Fi (onboard), Battle-AX series cooling design	2026-09-18 08:51:24.925	2026-09-18 08:51:24.925
cmu6pynwc00cx14lf0da8454h	cmu6pynw400cm14lf0ve7ekcp	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:24.925	2026-09-18 08:51:24.925
cmu6pynwc00cy14lf2p4lk3ev	cmu6pynw400cm14lf0ve7ekcp	cmu6pynfx001914lferyrkkxr	1x PCIe x16 | 1x PCIe x1 | 1x M.2	2026-09-18 08:51:24.925	2026-09-18 08:51:24.925
cmu6pynwc00cz14lfftwmibob	cmu6pynw400cm14lf0ve7ekcp	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:24.925	2026-09-18 08:51:24.925
cmu6pynwy00d814lfq4mkjx4j	cmu6pynwq00d614lfwblmos3x	cmu6pynfy001d14lfnomvc0tn	AMD Ryzen 5000/4000 G-Series/3000 Series (AM4)	2026-09-18 08:51:24.947	2026-09-18 08:51:24.947
cmu6pynwy00d914lfjop1bdwj	cmu6pynwq00d614lfwblmos3x	cmu6pynfz001f14lfzkgheosn	AMD A520	2026-09-18 08:51:24.947	2026-09-18 08:51:24.947
cmu6pynwy00da14lffwuyvxp1	cmu6pynwq00d614lfwblmos3x	cmu6pyng0001h14lfrol6ss30	128GB	2026-09-18 08:51:24.947	2026-09-18 08:51:24.947
cmu6pynwy00db14lfr7znm9mg	cmu6pynwq00d614lfwblmos3x	cmu6pyng1001j14lf8l7bw4pz	DDR4	2026-09-18 08:51:24.947	2026-09-18 08:51:24.947
cmu6pynwy00dc14lfya0cacnw	cmu6pynwq00d614lfwblmos3x	cmu6pyng2001l14lfig07ezdq	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.947	2026-09-18 08:51:24.947
cmu6pynwy00dd14lfx7rkgess	cmu6pynwq00d614lfwblmos3x	cmu6pyng3001n14lfqkp15mqn	1x HDMI, 1x DVI-D, 1x VGA	2026-09-18 08:51:24.947	2026-09-18 08:51:24.947
cmu6pynwy00de14lf7kf9c69e	cmu6pynwq00d614lfwblmos3x	cmu6pyng4001p14lf6t13ws6b	Realtek Audio CODEC HD Audio	2026-09-18 08:51:24.947	2026-09-18 08:51:24.947
cmu6pynwy00df14lfwnd8n98h	cmu6pynwq00d614lfwblmos3x	cmu6pyng5001r14lfb5ia1r3a	Rear: HDMI, DVI-D, VGA, USB 3.2 Gen1, USB 2.0, Realtek GbE, audio | Internal: RGB header, USB headers	2026-09-18 08:51:24.947	2026-09-18 08:51:24.947
cmu6pynwy00dg14lf6q4qzfbi	cmu6pynwq00d614lfwblmos3x	cmu6pyng5001t14lfiirn2uls	Ultra Durable, Smart Fan 5, RGB Fusion header	2026-09-18 08:51:24.947	2026-09-18 08:51:24.947
cmu6pynwy00dh14lfs5165rw5	cmu6pynwq00d614lfwblmos3x	cmu6pyng6001v14lfejclbnlw	Micro ATX	2026-09-18 08:51:24.947	2026-09-18 08:51:24.947
cmu6pynwy00di14lfg8aan3nc	cmu6pynwq00d614lfwblmos3x	cmu6pyng7001x14lfs2q5z4kc	1x PCIe x16 | 2x PCIe x1 | 1x M.2	2026-09-18 08:51:24.947	2026-09-18 08:51:24.947
cmu6pynwy00dj14lfheets6lc	cmu6pynwq00d614lfwblmos3x	cmu6pyng8001z14lfrky9kl8k	3 Years	2026-09-18 08:51:24.947	2026-09-18 08:51:24.947
cmu6pynxl00ds14lfjkuu2fg9	cmu6pynxc00dq14lf3fb6dcu6	cmu6pynfy001d14lfnomvc0tn	AMD Ryzen 5000/3000/2000 Series (AM4, BIOS dependent)	2026-09-18 08:51:24.97	2026-09-18 08:51:24.97
cmu6pynxl00dt14lfv11tgk9r	cmu6pynxc00dq14lf3fb6dcu6	cmu6pynfz001f14lfzkgheosn	AMD B450	2026-09-18 08:51:24.97	2026-09-18 08:51:24.97
cmu6pynxl00du14lf1ebungls	cmu6pynxc00dq14lf3fb6dcu6	cmu6pyng0001h14lfrol6ss30	128GB	2026-09-18 08:51:24.97	2026-09-18 08:51:24.97
cmu6pynxl00dv14lf0tn7g0wv	cmu6pynxc00dq14lf3fb6dcu6	cmu6pyng1001j14lf8l7bw4pz	DDR4	2026-09-18 08:51:24.97	2026-09-18 08:51:24.97
cmu6pynxl00dw14lf6u2zl1pl	cmu6pynxc00dq14lf3fb6dcu6	cmu6pyng2001l14lfig07ezdq	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.97	2026-09-18 08:51:24.97
cmu6pynxl00dx14lfthbq80f8	cmu6pynxc00dq14lf3fb6dcu6	cmu6pyng3001n14lfqkp15mqn	1x HDMI, 1x DVI-D, 1x VGA	2026-09-18 08:51:24.97	2026-09-18 08:51:24.97
cmu6pynxl00dy14lfwpp0mqxj	cmu6pynxc00dq14lf3fb6dcu6	cmu6pyng4001p14lf6t13ws6b	Realtek Audio CODEC HD Audio	2026-09-18 08:51:24.97	2026-09-18 08:51:24.97
cmu6pynxl00dz14lfgl524zl5	cmu6pynxc00dq14lf3fb6dcu6	cmu6pyng5001r14lfb5ia1r3a	Rear: HDMI, DVI-D, VGA, USB 3.1 Gen1, USB 2.0, Realtek LAN, audio | Internal: RGB header, USB headers	2026-09-18 08:51:24.97	2026-09-18 08:51:24.97
cmu6pynxl00e014lfxe3ud81i	cmu6pynxc00dq14lf3fb6dcu6	cmu6pyng5001t14lfiirn2uls	Ultra Durable, Smart Fan 5, RGB Fusion	2026-09-18 08:51:24.97	2026-09-18 08:51:24.97
cmu6pynxl00e114lfvby8tv2b	cmu6pynxc00dq14lf3fb6dcu6	cmu6pyng6001v14lfejclbnlw	Micro ATX	2026-09-18 08:51:24.97	2026-09-18 08:51:24.97
cmu6pynxl00e214lf4ueb8nao	cmu6pynxc00dq14lf3fb6dcu6	cmu6pyng7001x14lfs2q5z4kc	1x PCIe x16 | 1x PCIe x4 | 1x PCIe x1 | 1x M.2	2026-09-18 08:51:24.97	2026-09-18 08:51:24.97
cmu6pynxl00e314lfd5t3a5f9	cmu6pynxc00dq14lf3fb6dcu6	cmu6pyng8001z14lfrky9kl8k	3 Years	2026-09-18 08:51:24.97	2026-09-18 08:51:24.97
cmu6pynyc00ec14lfx8o8x8sv	cmu6pyny000ea14lfi7waffpz	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)	2026-09-18 08:51:24.996	2026-09-18 08:51:24.996
cmu6pynyc00ed14lfenyrgq6k	cmu6pyny000ea14lfi7waffpz	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-18 08:51:24.996	2026-09-18 08:51:24.996
cmu6pynyc00ee14lfll3a1u9y	cmu6pyny000ea14lfi7waffpz	cmu6pynfo000t14lfqadrp9c6	64GB	2026-09-18 08:51:24.996	2026-09-18 08:51:24.996
cmu6pynyc00ef14lfw4pre5mg	cmu6pyny000ea14lfi7waffpz	cmu6pynfo000v14lfk2twms3r	DDR4	2026-09-18 08:51:24.996	2026-09-18 08:51:24.996
cmu6pynyc00eg14lf1apx47qv	cmu6pyny000ea14lfi7waffpz	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:24.996	2026-09-18 08:51:24.996
cmu6pynyc00eh14lfnjl4hd07	cmu6pyny000ea14lfi7waffpz	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x VGA	2026-09-18 08:51:24.996	2026-09-18 08:51:24.996
cmu6pynyc00ei14lfyv0954c8	cmu6pyny000ea14lfi7waffpz	cmu6pynfs001114lflya0h3wr	Realtek ALC897 7.1 HD Audio	2026-09-18 08:51:24.996	2026-09-18 08:51:24.996
cmu6pynyc00ej14lfar6nkggt	cmu6pyny000ea14lfi7waffpz	cmu6pynfu001314lft9yu4wju	Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio | Internal: USB headers, TPM	2026-09-18 08:51:24.996	2026-09-18 08:51:24.996
cmu6pynyc00ek14lfsscc7ryw	cmu6pyny000ea14lfi7waffpz	cmu6pynfv001514lfpv41pubh	PRO Series stability focus, EZ Debug LED	2026-09-18 08:51:24.996	2026-09-18 08:51:24.996
cmu6pynyc00el14lf3j0oyq4g	cmu6pyny000ea14lfi7waffpz	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:24.996	2026-09-18 08:51:24.996
cmu6pynyc00em14lf6himxb56	cmu6pyny000ea14lfi7waffpz	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0 x16 | 1x PCIe 3.0 x1 | 1x M.2 Key-M	2026-09-18 08:51:24.996	2026-09-18 08:51:24.996
cmu6pynyc00en14lfp6a7har8	cmu6pyny000ea14lfi7waffpz	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:24.996	2026-09-18 08:51:24.996
cmu6pynz100ew14lf12ue3e9x	cmu6pynyt00eu14lf8kemzt70	cmu6pynfl000p14lf8747ua51	Intel Core 11th/10th Gen, Pentium Gold, Celeron (LGA1200)	2026-09-18 08:51:25.022	2026-09-18 08:51:25.022
cmu6pynz100ex14lfuk5l9pj6	cmu6pynyt00eu14lf8kemzt70	cmu6pynfm000r14lfudlmnzu2	Intel H510	2026-09-18 08:51:25.022	2026-09-18 08:51:25.022
cmu6pynz100ey14lfkyqspwtd	cmu6pynyt00eu14lf8kemzt70	cmu6pynfo000t14lfqadrp9c6	64GB	2026-09-18 08:51:25.022	2026-09-18 08:51:25.022
cmu6pynz100ez14lfhqsisoog	cmu6pynyt00eu14lf8kemzt70	cmu6pynfo000v14lfk2twms3r	DDR4	2026-09-18 08:51:25.022	2026-09-18 08:51:25.022
cmu6pynz100f014lfkki1fbpu	cmu6pynyt00eu14lf8kemzt70	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:25.022	2026-09-18 08:51:25.022
cmu6pynz100f114lfc31iwn71	cmu6pynyt00eu14lf8kemzt70	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x VGA	2026-09-18 08:51:25.022	2026-09-18 08:51:25.022
cmu6pynz100f214lfbidrognx	cmu6pynyt00eu14lf8kemzt70	cmu6pynfs001114lflya0h3wr	Realtek ALC887 HD Audio	2026-09-18 08:51:25.022	2026-09-18 08:51:25.022
cmu6pynz100f314lfmw533mzc	cmu6pynyt00eu14lf8kemzt70	cmu6pynfu001314lft9yu4wju	Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio, PS/2 | Internal: USB headers, COM, TPM	2026-09-18 08:51:25.022	2026-09-18 08:51:25.022
cmu6pynz100f414lfl8vp0fu5	cmu6pynyt00eu14lf8kemzt70	cmu6pynfv001514lfpv41pubh	ASUS 5X Protection III, Fan Xpert	2026-09-18 08:51:25.022	2026-09-18 08:51:25.022
cmu6pynz100f514lfvyxpgd5n	cmu6pynyt00eu14lf8kemzt70	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:25.022	2026-09-18 08:51:25.022
cmu6pynz100f614lfowh5g5t4	cmu6pynyt00eu14lf8kemzt70	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0/3.0 x16 | 2x PCIe 3.0 x1 | 1x M.2 Key-M	2026-09-18 08:51:25.022	2026-09-18 08:51:25.022
cmu6pynz100f714lfz1kab8sv	cmu6pynyt00eu14lf8kemzt70	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:25.022	2026-09-18 08:51:25.022
cmu6pynzn00fg14lf5b21szsu	cmu6pynze00fe14lfh5xauu7g	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen (LGA1700)	2026-09-18 08:51:25.044	2026-09-18 08:51:25.044
cmu6pynzn00fh14lfemex68e7	cmu6pynze00fe14lfh5xauu7g	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-18 08:51:25.044	2026-09-18 08:51:25.044
cmu6pynzn00fi14lf24ube8j9	cmu6pynze00fe14lfh5xauu7g	cmu6pynfo000t14lfqadrp9c6	64GB	2026-09-18 08:51:25.044	2026-09-18 08:51:25.044
cmu6pynzn00fj14lf180rom9u	cmu6pynze00fe14lfh5xauu7g	cmu6pynfo000v14lfk2twms3r	DDR4	2026-09-18 08:51:25.044	2026-09-18 08:51:25.044
cmu6pynzn00fk14lfen3cdy2t	cmu6pynze00fe14lfh5xauu7g	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:25.044	2026-09-18 08:51:25.044
cmu6pynzn00fl14lf1dauanyt	cmu6pynze00fe14lfh5xauu7g	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x VGA	2026-09-18 08:51:25.044	2026-09-18 08:51:25.044
cmu6pynzn00fm14lfy02ptniu	cmu6pynze00fe14lfh5xauu7g	cmu6pynfs001114lflya0h3wr	Realtek Audio CODEC HD Audio	2026-09-18 08:51:25.044	2026-09-18 08:51:25.044
cmu6pynzn00fn14lfarn0jct1	cmu6pynze00fe14lfh5xauu7g	cmu6pynfu001314lft9yu4wju	Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek GbE, audio | Internal: USB headers, Smart Fan headers	2026-09-18 08:51:25.044	2026-09-18 08:51:25.044
cmu6pynzn00fo14lfk53tfdh0	cmu6pynze00fe14lfh5xauu7g	cmu6pynfv001514lfpv41pubh	Smart Fan 6, V3 revision updates	2026-09-18 08:51:25.044	2026-09-18 08:51:25.044
cmu6pynzn00fp14lf2x7k35xm	cmu6pynze00fe14lfh5xauu7g	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:25.044	2026-09-18 08:51:25.044
cmu6pynzn00fq14lf3m5k230i	cmu6pynze00fe14lfh5xauu7g	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0 x16 | 1x PCIe x1 | 1x M.2	2026-09-18 08:51:25.044	2026-09-18 08:51:25.044
cmu6pynzn00fr14lfdou0rgum	cmu6pynze00fe14lfh5xauu7g	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:25.044	2026-09-18 08:51:25.044
cmu6pyo0c00g014lfx94gm8qi	cmu6pyo0200fy14lfkvcj93kc	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen (LGA1700)	2026-09-18 08:51:25.069	2026-09-18 08:51:25.069
cmu6pyo0c00g114lf9o4goy87	cmu6pyo0200fy14lfkvcj93kc	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-18 08:51:25.069	2026-09-18 08:51:25.069
cmu6pyo0c00g214lf02smza0h	cmu6pyo0200fy14lfkvcj93kc	cmu6pynfo000t14lfqadrp9c6	96GB	2026-09-18 08:51:25.069	2026-09-18 08:51:25.069
cmu6pyo0c00g314lfyw3ogfeu	cmu6pyo0200fy14lfkvcj93kc	cmu6pynfo000v14lfk2twms3r	DDR5	2026-09-18 08:51:25.069	2026-09-18 08:51:25.069
cmu6pyo0c00g414lf1632cta8	cmu6pyo0200fy14lfkvcj93kc	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:25.069	2026-09-18 08:51:25.069
cmu6pyo0c00g514lfuq0ynqj6	cmu6pyo0200fy14lfkvcj93kc	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x VGA	2026-09-18 08:51:25.069	2026-09-18 08:51:25.069
cmu6pyo0c00g614lfbilq5at3	cmu6pyo0200fy14lfkvcj93kc	cmu6pynfs001114lflya0h3wr	Realtek Audio CODEC HD Audio	2026-09-18 08:51:25.069	2026-09-18 08:51:25.069
cmu6pyo0c00g714lfb4nxcd5f	cmu6pyo0200fy14lfkvcj93kc	cmu6pynfu001314lft9yu4wju	Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek GbE, audio | Internal: USB headers, fan headers	2026-09-18 08:51:25.069	2026-09-18 08:51:25.069
cmu6pyo0c00g814lffh4adwut	cmu6pyo0200fy14lfkvcj93kc	cmu6pynfv001514lfpv41pubh	DDR5 support, Smart Fan 6	2026-09-18 08:51:25.069	2026-09-18 08:51:25.069
cmu6pyo0c00g914lfxiv8vdp8	cmu6pyo0200fy14lfkvcj93kc	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:25.069	2026-09-18 08:51:25.069
cmu6pyo0c00ga14lf63k0iz47	cmu6pyo0200fy14lfkvcj93kc	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0 x16 | 1x PCIe x1 | 1x M.2	2026-09-18 08:51:25.069	2026-09-18 08:51:25.069
cmu6pyo0c00gb14lflokm3uwl	cmu6pyo0200fy14lfkvcj93kc	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:25.069	2026-09-18 08:51:25.069
cmu6pyo1100gk14lfpdp9dsmx	cmu6pyo0s00gi14lfjfngwo9u	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)	2026-09-18 08:51:25.093	2026-09-18 08:51:25.093
cmu6pyo1100gl14lfeponcbg7	cmu6pyo0s00gi14lfjfngwo9u	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-18 08:51:25.093	2026-09-18 08:51:25.093
cmu6pyo1100gm14lfhtmgc297	cmu6pyo0s00gi14lfjfngwo9u	cmu6pynfo000t14lfqadrp9c6	64GB	2026-09-18 08:51:25.093	2026-09-18 08:51:25.093
cmu6pyo1100gn14lfdzonzh23	cmu6pyo0s00gi14lfjfngwo9u	cmu6pynfo000v14lfk2twms3r	DDR4	2026-09-18 08:51:25.093	2026-09-18 08:51:25.093
cmu6pyo1100go14lfopqpjrt4	cmu6pyo0s00gi14lfjfngwo9u	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:25.093	2026-09-18 08:51:25.093
cmu6pyo1100gp14lf4wib0toh	cmu6pyo0s00gi14lfjfngwo9u	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x VGA	2026-09-18 08:51:25.093	2026-09-18 08:51:25.093
cmu6pyo1100gq14lfl06dpvuw	cmu6pyo0s00gi14lfjfngwo9u	cmu6pynfs001114lflya0h3wr	Realtek ALC897 7.1 HD Audio	2026-09-18 08:51:25.093	2026-09-18 08:51:25.093
cmu6pyo1100gr14lfeia3sees	cmu6pyo0s00gi14lfjfngwo9u	cmu6pynfu001314lft9yu4wju	Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio | Internal: USB headers, TPM	2026-09-18 08:51:25.093	2026-09-18 08:51:25.093
cmu6pyo1100gs14lf7kcxp7ph	cmu6pyo0s00gi14lfjfngwo9u	cmu6pynfv001514lfpv41pubh	PRO Series, EZ Debug LED	2026-09-18 08:51:25.093	2026-09-18 08:51:25.093
cmu6pyo1100gt14lfuqiihaht	cmu6pyo0s00gi14lfjfngwo9u	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:25.093	2026-09-18 08:51:25.093
cmu6pyo1100gu14lfl7rrvrvk	cmu6pyo0s00gi14lfjfngwo9u	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0 x16 | 1x PCIe 3.0 x1 | 1x M.2 Key-M	2026-09-18 08:51:25.093	2026-09-18 08:51:25.093
cmu6pyo1100gv14lft6d20873	cmu6pyo0s00gi14lfjfngwo9u	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:25.093	2026-09-18 08:51:25.093
cmu6pyo1n00h414lf0jrbnrnc	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)	2026-09-18 08:51:25.115	2026-09-18 08:51:25.115
cmu6pyo1n00h514lfq7a3k4yu	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-18 08:51:25.115	2026-09-18 08:51:25.115
cmu6pyo1n00h614lfkvkz161z	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfo000t14lfqadrp9c6	96GB	2026-09-18 08:51:25.115	2026-09-18 08:51:25.115
cmu6pyo1n00h714lffkjooyir	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfo000v14lfk2twms3r	DDR5	2026-09-18 08:51:25.115	2026-09-18 08:51:25.115
cmu6pyo1n00h814lf48d9xeqr	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:25.115	2026-09-18 08:51:25.115
cmu6pyo1n00h914lfxcxukfbe	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x VGA	2026-09-18 08:51:25.115	2026-09-18 08:51:25.115
cmu6pyo1n00ha14lfm6iw1y39	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfs001114lflya0h3wr	Realtek ALC897 7.1 HD Audio	2026-09-18 08:51:25.115	2026-09-18 08:51:25.115
cmu6pyo1n00hb14lfzbvf510y	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfu001314lft9yu4wju	Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio | Internal: USB headers, TPM	2026-09-18 08:51:25.115	2026-09-18 08:51:25.115
cmu6pyo1n00hc14lfozw168jh	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfv001514lfpv41pubh	DDR5 dual-channel, Steel Armor, EZ Debug LED	2026-09-18 08:51:25.115	2026-09-18 08:51:25.115
cmu6pyo1n00hd14lf18pxhty8	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:25.115	2026-09-18 08:51:25.115
cmu6pyo1n00he14lfy36hb95z	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0 x16 | 1x PCIe 3.0 x1 | 1x M.2 Key-M	2026-09-18 08:51:25.115	2026-09-18 08:51:25.115
cmu6pyo1n00hf14lfe9yf9l30	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:25.115	2026-09-18 08:51:25.115
cmu6pyo2800ho14lfov2nolpm	cmu6pyo1z00hm14lf8ln55j0p	cmu6pynfl000p14lf8747ua51	Intel Core 10th Gen, Pentium Gold, Celeron (LGA1200)	2026-09-18 08:51:25.136	2026-09-18 08:51:25.136
cmu6pyo2800hp14lf43nqxqfl	cmu6pyo1z00hm14lf8ln55j0p	cmu6pynfm000r14lfudlmnzu2	Intel H410	2026-09-18 08:51:25.136	2026-09-18 08:51:25.136
cmu6pyo2800hq14lfpgcpf732	cmu6pyo1z00hm14lf8ln55j0p	cmu6pynfo000t14lfqadrp9c6	64GB	2026-09-18 08:51:25.136	2026-09-18 08:51:25.136
cmu6pyo2800hr14lfrekrkrel	cmu6pyo1z00hm14lf8ln55j0p	cmu6pynfo000v14lfk2twms3r	DDR4	2026-09-18 08:51:25.136	2026-09-18 08:51:25.136
cmu6pyo2800hs14lfhnn19t8i	cmu6pyo1z00hm14lf8ln55j0p	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:25.136	2026-09-18 08:51:25.136
cmu6pyo2800ht14lf1ssldson	cmu6pyo1z00hm14lf8ln55j0p	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x VGA	2026-09-18 08:51:25.136	2026-09-18 08:51:25.136
cmu6pyo2800hu14lf2ydnveeu	cmu6pyo1z00hm14lf8ln55j0p	cmu6pynfs001114lflya0h3wr	Realtek Audio CODEC HD Audio	2026-09-18 08:51:25.136	2026-09-18 08:51:25.136
cmu6pyo2800hv14lfzqlopi31	cmu6pyo1z00hm14lf8ln55j0p	cmu6pynfu001314lft9yu4wju	Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek LAN, audio | Internal: USB headers, front panel	2026-09-18 08:51:25.136	2026-09-18 08:51:25.136
cmu6pyo2800hw14lfdtpi4qjw	cmu6pyo1z00hm14lf8ln55j0p	cmu6pynfv001514lfpv41pubh	Ultra Durable, Smart Fan 5	2026-09-18 08:51:25.136	2026-09-18 08:51:25.136
cmu6pyo2800hx14lfevldkssm	cmu6pyo1z00hm14lf8ln55j0p	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-18 08:51:25.136	2026-09-18 08:51:25.136
cmu6pyo2800hy14lf3yfym1za	cmu6pyo1z00hm14lf8ln55j0p	cmu6pynfx001914lferyrkkxr	1x PCIe 3.0 x16 | 1x PCIe 3.0 x1 | 1x M.2	2026-09-18 08:51:25.136	2026-09-18 08:51:25.136
cmu6pyo2800hz14lfvxfixo0g	cmu6pyo1z00hm14lf8ln55j0p	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-18 08:51:25.136	2026-09-18 08:51:25.136
cmu6pzb2t000pmcmibt13l01m	cmrdav7iw0002gb3wq5ky2u80	cmu6pzb290002mcmisr7bwk77	Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)	2026-09-18 08:51:54.966	2026-09-18 08:51:54.966
cmu6pzb2t000qmcmi50wkgtnm	cmrdav7iw0002gb3wq5ky2u80	cmu6pzb2c0004mcmiwpg3p2e5	Intel H610	2026-09-18 08:51:54.966	2026-09-18 08:51:54.966
cmu6pzb2t000rmcmi8hegh20n	cmrdav7iw0002gb3wq5ky2u80	cmu6pzb2e0006mcmi4hsab6e1	64GB	2026-09-18 08:51:54.966	2026-09-18 08:51:54.966
cmu6pzb2t000smcmiujovls6w	cmrdav7iw0002gb3wq5ky2u80	cmu6pzb2f0008mcmionf5yjlx	DDR4	2026-09-18 08:51:54.966	2026-09-18 08:51:54.966
cmu6pzb2t000tmcmia3iilpra	cmrdav7iw0002gb3wq5ky2u80	cmu6pzb2h000amcmizigjsfe5	1x M.2 + 4x SATA 6Gb/s	2026-09-18 08:51:54.966	2026-09-18 08:51:54.966
cmu6pzb2t000umcmixu0ekjqy	cmrdav7iw0002gb3wq5ky2u80	cmu6pzb2i000cmcmimyy4t9f9	1x HDMI, 1x VGA	2026-09-18 08:51:54.966	2026-09-18 08:51:54.966
cmu6pzb2t000vmcmiq6yx3rub	cmrdav7iw0002gb3wq5ky2u80	cmu6pzb2m000emcmik32fd1dn	Realtek ALC897 7.1 HD Audio	2026-09-18 08:51:54.966	2026-09-18 08:51:54.966
cmu6pzb2t000wmcmibwyav5sl	cmrdav7iw0002gb3wq5ky2u80	cmu6pzb2n000gmcmikeftzbzu	Rear: HDMI, VGA, 2x USB 3.2 Gen1, 4x USB 2.0, Realtek 1GbE LAN, audio jacks, PS/2 | Internal: USB headers, TPM header	2026-09-18 08:51:54.966	2026-09-18 08:51:54.966
cmu6pzb2t000xmcmikauaf6ay	cmrdav7iw0002gb3wq5ky2u80	cmu6pzb2o000imcmisdeb41va	PCIe Steel Armor, EZ Debug LED, Core Boost	2026-09-18 08:51:54.966	2026-09-18 08:51:54.966
cmu6pzb2t000ymcmiuoie06om	cmrdav7iw0002gb3wq5ky2u80	cmu6pzb2q000kmcmi9ygle20m	Micro ATX	2026-09-18 08:51:54.966	2026-09-18 08:51:54.966
cmu6pzb2t000zmcmi7qhhzgs1	cmrdav7iw0002gb3wq5ky2u80	cmu6pzb2r000mmcmipp7cj7ek	1x PCIe 4.0 x16 | 1x PCIe 3.0 x1 | 1x M.2 Key-M (PCIe 3.0 x4)	2026-09-18 08:51:54.966	2026-09-18 08:51:54.966
cmu6pzb2t0010mcmi1wwdya6u	cmrdav7iw0002gb3wq5ky2u80	cmu6pzb2t000omcmizkw9j2pw	3 Years	2026-09-18 08:51:54.966	2026-09-18 08:51:54.966
cmu6r4g6v0014eqewlgnl5gds	cmu6r4g6a0012eqewtktu2yyy	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.487	2026-09-18 09:23:54.487
cmu6r4g6v0015eqewbhakvlmq	cmu6r4g6a0012eqewtktu2yyy	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.487	2026-09-18 09:23:54.487
cmu6r4g6v0016eqew5ast8u8j	cmu6r4g6a0012eqewtktu2yyy	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.487	2026-09-18 09:23:54.487
cmu6r4g6v0017eqewo10aix7a	cmu6r4g6a0012eqewtktu2yyy	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.487	2026-09-18 09:23:54.487
cmu6r4g7h001feqewzmcz5auy	cmu6r4g7c001deqew5xd51myk	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.509	2026-09-18 09:23:54.509
cmu6r4g7h001geqewjf8565cn	cmu6r4g7c001deqew5xd51myk	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.509	2026-09-18 09:23:54.509
cmu6r4g7h001heqew5l6d17o5	cmu6r4g7c001deqew5xd51myk	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.509	2026-09-18 09:23:54.509
cmu6r4g7h001ieqewzsxuay8a	cmu6r4g7c001deqew5xd51myk	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.509	2026-09-18 09:23:54.509
cmu6r4g7y001qeqewwwpi7c2a	cmu6r4g7s001oeqew5evuclei	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.526	2026-09-18 09:23:54.526
cmu6r4g7y001reqewtgc9l2or	cmu6r4g7s001oeqew5evuclei	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.526	2026-09-18 09:23:54.526
cmu6r4g7y001seqewkq7u3lyv	cmu6r4g7s001oeqew5evuclei	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.526	2026-09-18 09:23:54.526
cmu6r4g7y001teqewakclwvnd	cmu6r4g7s001oeqew5evuclei	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.526	2026-09-18 09:23:54.526
cmu6r4g8f0021eqewaml0bptd	cmu6r4g8a001zeqew4kx9ss79	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.543	2026-09-18 09:23:54.543
cmu6r4g8f0022eqewalq3p40s	cmu6r4g8a001zeqew4kx9ss79	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.543	2026-09-18 09:23:54.543
cmu6r4g8f0023eqewar4yd3jv	cmu6r4g8a001zeqew4kx9ss79	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.543	2026-09-18 09:23:54.543
cmu6r4g8f0024eqewt6n4p309	cmu6r4g8a001zeqew4kx9ss79	cmu6r4g4i000deqew2gui9h6q	Red	2026-09-18 09:23:54.543	2026-09-18 09:23:54.543
cmu6r4g8f0025eqewkgfr4a2a	cmu6r4g8a001zeqew4kx9ss79	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.543	2026-09-18 09:23:54.543
cmu6r4g8v002deqewc9vogxwe	cmu6r4g8q002beqew38zed8wq	cmu6r4g410001eqewobjuwk25	DDR5	2026-09-18 09:23:54.559	2026-09-18 09:23:54.559
cmu6r4g8v002eeqewj8cmhyab	cmu6r4g8q002beqew38zed8wq	cmu6r4g4c0003eqewsbry4t1r	5600 MHz	2026-09-18 09:23:54.559	2026-09-18 09:23:54.559
cmu6r4g8v002feqewwvbswi48	cmu6r4g8q002beqew38zed8wq	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.559	2026-09-18 09:23:54.559
cmu6r4g8v002geqew80odi42q	cmu6r4g8q002beqew38zed8wq	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.559	2026-09-18 09:23:54.559
cmu6r4g9a002oeqewyf0ahpkf	cmu6r4g95002meqewhxmnbb1h	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.574	2026-09-18 09:23:54.574
cmu6r4g9a002peqew95h6ikzy	cmu6r4g95002meqewhxmnbb1h	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.574	2026-09-18 09:23:54.574
cmu6r4g9a002qeqew9z4fwrpz	cmu6r4g95002meqewhxmnbb1h	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.574	2026-09-18 09:23:54.574
cmu6r4g9a002reqewohxf1q3c	cmu6r4g95002meqewhxmnbb1h	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.574	2026-09-18 09:23:54.574
cmu6r4g9o002zeqew0jy31f1i	cmu6r4g9j002xeqew48h4fl84	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.588	2026-09-18 09:23:54.588
cmu6r4g9o0030eqewyfyuyayq	cmu6r4g9j002xeqew48h4fl84	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.588	2026-09-18 09:23:54.588
cmu6r4g9o0031eqewpd0wi7j2	cmu6r4g9j002xeqew48h4fl84	cmu6r4g4f0007eqew2h0936qd	16GB	2026-09-18 09:23:54.588	2026-09-18 09:23:54.588
cmu6r4g9o0032eqew84287jh3	cmu6r4g9j002xeqew48h4fl84	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.588	2026-09-18 09:23:54.588
cmu6r4ga4003aeqewg2x9z9pq	cmu6r4g9z0038eqewbcb6z2np	cmu6r4g410001eqewobjuwk25	DDR5	2026-09-18 09:23:54.604	2026-09-18 09:23:54.604
cmu6r4ga4003beqew2wnncv29	cmu6r4g9z0038eqewbcb6z2np	cmu6r4g4c0003eqewsbry4t1r	6000 MHz	2026-09-18 09:23:54.604	2026-09-18 09:23:54.604
cmu6r4ga4003ceqewjui5unqb	cmu6r4g9z0038eqewbcb6z2np	cmu6r4g4f0007eqew2h0936qd	16GB	2026-09-18 09:23:54.604	2026-09-18 09:23:54.604
cmu6r4ga4003deqewti45220q	cmu6r4g9z0038eqewbcb6z2np	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.604	2026-09-18 09:23:54.604
cmu6r4gal003leqewq7031cli	cmu6r4gag003jeqewog4h5uso	cmu6r4g410001eqewobjuwk25	DDR3	2026-09-18 09:23:54.621	2026-09-18 09:23:54.621
cmu6r4gal003meqew6b65jmbr	cmu6r4gag003jeqewog4h5uso	cmu6r4g4c0003eqewsbry4t1r	1600 MHz	2026-09-18 09:23:54.621	2026-09-18 09:23:54.621
cmu6r4gal003neqew7k7bbl94	cmu6r4gag003jeqewog4h5uso	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.621	2026-09-18 09:23:54.621
cmu6r4gal003oeqewq61g34r9	cmu6r4gag003jeqewog4h5uso	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.621	2026-09-18 09:23:54.621
cmu6r4gb2003weqew4k3tahx5	cmu6r4gaw003ueqewgaku1jo7	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.639	2026-09-18 09:23:54.639
cmu6r4gb2003xeqew8cpqylg7	cmu6r4gaw003ueqewgaku1jo7	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.639	2026-09-18 09:23:54.639
cmu6r4gb2003yeqewv9graxeh	cmu6r4gaw003ueqewgaku1jo7	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.639	2026-09-18 09:23:54.639
cmu6r4gb2003zeqewa45cgd93	cmu6r4gaw003ueqewgaku1jo7	cmu6r4g4j000feqewh0pudlok	RGB RAM	2026-09-18 09:23:54.639	2026-09-18 09:23:54.639
cmu6r4gb20040eqewa2di63cf	cmu6r4gaw003ueqewgaku1jo7	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.639	2026-09-18 09:23:54.639
cmu6r4gbk0049eqeww6gngdi6	cmu6r4gbd0047eqewx63iixqf	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.656	2026-09-18 09:23:54.656
cmu6r4gbk004aeqewg9grjfym	cmu6r4gbd0047eqewx63iixqf	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.656	2026-09-18 09:23:54.656
cmu6r4gbk004beqew84mi1z5x	cmu6r4gbd0047eqewx63iixqf	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.656	2026-09-18 09:23:54.656
cmu6r4gbk004ceqewxjwmdawx	cmu6r4gbd0047eqewx63iixqf	cmu6r4g4i000deqew2gui9h6q	Black	2026-09-18 09:23:54.656	2026-09-18 09:23:54.656
cmu6r4gbk004deqewtj2ndi3s	cmu6r4gbd0047eqewx63iixqf	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.656	2026-09-18 09:23:54.656
cmu6r4gc1004leqewxhcq4w1k	cmu6r4gbu004jeqewdasszspy	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.673	2026-09-18 09:23:54.673
cmu6r4gc1004meqew71xe7dq7	cmu6r4gbu004jeqewdasszspy	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.673	2026-09-18 09:23:54.673
cmu6r4gc1004neqewonhq7hgu	cmu6r4gbu004jeqewdasszspy	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.673	2026-09-18 09:23:54.673
cmu6r4gc1004oeqewltnzhe2g	cmu6r4gbu004jeqewdasszspy	cmu6r4g4i000deqew2gui9h6q	White	2026-09-18 09:23:54.673	2026-09-18 09:23:54.673
cmu6r4gc1004peqewlskg2ntq	cmu6r4gbu004jeqewdasszspy	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.673	2026-09-18 09:23:54.673
cmu6r4gci004xeqewqkj6e77j	cmu6r4gcb004veqew06h8boj6	cmu6r4g410001eqewobjuwk25	DDR5	2026-09-18 09:23:54.69	2026-09-18 09:23:54.69
cmu6r4gci004yeqew7metm7xr	cmu6r4gcb004veqew06h8boj6	cmu6r4g4c0003eqewsbry4t1r	6000 MHz	2026-09-18 09:23:54.69	2026-09-18 09:23:54.69
cmu6r4gci004zeqewgdsp5mup	cmu6r4gcb004veqew06h8boj6	cmu6r4g4f0007eqew2h0936qd	16GB	2026-09-18 09:23:54.69	2026-09-18 09:23:54.69
cmu6r4gci0050eqewv3hsvf7t	cmu6r4gcb004veqew06h8boj6	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.69	2026-09-18 09:23:54.69
cmu6r4gd00058eqew7cqv17hi	cmu6r4gct0056eqewl1d14foq	cmu6r4g410001eqewobjuwk25	DDR5	2026-09-18 09:23:54.708	2026-09-18 09:23:54.708
cmu6r4gd00059eqewhd16mawq	cmu6r4gct0056eqewl1d14foq	cmu6r4g4c0003eqewsbry4t1r	6000 MHz	2026-09-18 09:23:54.708	2026-09-18 09:23:54.708
cmu6r4gd0005aeqewczg661d6	cmu6r4gct0056eqewl1d14foq	cmu6r4g4f0007eqew2h0936qd	16GB	2026-09-18 09:23:54.708	2026-09-18 09:23:54.708
cmu6r4gd0005beqewc4gtkzwp	cmu6r4gct0056eqewl1d14foq	cmu6r4g4j000feqewh0pudlok	RGB RAM	2026-09-18 09:23:54.708	2026-09-18 09:23:54.708
cmu6r4gd0005ceqewno2msz7f	cmu6r4gct0056eqewl1d14foq	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.708	2026-09-18 09:23:54.708
cmu6r4gdg005leqewdmhj6pf9	cmu6r4gdb005jeqewi00quivx	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.724	2026-09-18 09:23:54.724
cmu6r4gdg005meqew1jfadi7h	cmu6r4gdb005jeqewi00quivx	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.724	2026-09-18 09:23:54.724
cmu6r4gdg005neqewj8q0wnpd	cmu6r4gdb005jeqewi00quivx	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.724	2026-09-18 09:23:54.724
cmu6r4gdg005oeqewamdlko5y	cmu6r4gdb005jeqewi00quivx	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.724	2026-09-18 09:23:54.724
cmu6r4gdw005weqewb5aspxiz	cmu6r4gdo005ueqewevlonqz0	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.741	2026-09-18 09:23:54.741
cmu6r4gdw005xeqew8y639bbp	cmu6r4gdo005ueqewevlonqz0	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.741	2026-09-18 09:23:54.741
cmu6r4gdw005yeqew2awyp4qz	cmu6r4gdo005ueqewevlonqz0	cmu6r4g4f0007eqew2h0936qd	16GB	2026-09-18 09:23:54.741	2026-09-18 09:23:54.741
cmu6r4gdw005zeqewv3z6tmnc	cmu6r4gdo005ueqewevlonqz0	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.741	2026-09-18 09:23:54.741
cmu6r4ged0067eqew1j4o4y8s	cmu6r4ge60065eqewddtcjcqs	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.757	2026-09-18 09:23:54.757
cmu6r4ged0068eqew6jtfkx0m	cmu6r4ge60065eqewddtcjcqs	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.757	2026-09-18 09:23:54.757
cmu6r4ged0069eqewkj8tt2c3	cmu6r4ge60065eqewddtcjcqs	cmu6r4g4f0007eqew2h0936qd	16GB	2026-09-18 09:23:54.757	2026-09-18 09:23:54.757
cmu6r4ged006aeqew05yuhe4d	cmu6r4ge60065eqewddtcjcqs	cmu6r4g4i000deqew2gui9h6q	White	2026-09-18 09:23:54.757	2026-09-18 09:23:54.757
cmu6r4ged006beqew47dnltuk	cmu6r4ge60065eqewddtcjcqs	cmu6r4g4j000feqewh0pudlok	RGB RAM	2026-09-18 09:23:54.757	2026-09-18 09:23:54.757
cmu6r4ged006ceqewhl9pgtu3	cmu6r4ge60065eqewddtcjcqs	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.757	2026-09-18 09:23:54.757
cmu6r4get006leqewi2i1mt5c	cmu6r4geo006jeqew6cc81d02	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.774	2026-09-18 09:23:54.774
cmu6r4get006meqew23acztwr	cmu6r4geo006jeqew6cc81d02	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.774	2026-09-18 09:23:54.774
cmu6r4get006neqewxwhytilg	cmu6r4geo006jeqew6cc81d02	cmu6r4g4f0007eqew2h0936qd	16GB	2026-09-18 09:23:54.774	2026-09-18 09:23:54.774
cmu6r4get006oeqewkvpup0eg	cmu6r4geo006jeqew6cc81d02	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.774	2026-09-18 09:23:54.774
cmu6r4gf8006weqewd7bf01ro	cmu6r4gf2006ueqewbz1ejqzu	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.788	2026-09-18 09:23:54.788
cmu6r4gf8006xeqew8hohgc7m	cmu6r4gf2006ueqewbz1ejqzu	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.788	2026-09-18 09:23:54.788
cmu6r4gf8006yeqewpsp0vh1o	cmu6r4gf2006ueqewbz1ejqzu	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.788	2026-09-18 09:23:54.788
cmu6r4gf8006zeqewobh0vv2x	cmu6r4gf2006ueqewbz1ejqzu	cmu6r4g4j000feqewh0pudlok	RGB RAM	2026-09-18 09:23:54.788	2026-09-18 09:23:54.788
cmu6r4gf80070eqew7bq3yj9j	cmu6r4gf2006ueqewbz1ejqzu	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.788	2026-09-18 09:23:54.788
cmu6r4gfp0079eqewcrqvkkaz	cmu6r4gfi0077eqewdbl8c9xu	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.805	2026-09-18 09:23:54.805
cmu6r4gfp007aeqewlajvvwzd	cmu6r4gfi0077eqewdbl8c9xu	cmu6r4g4c0003eqewsbry4t1r	2666 MHz	2026-09-18 09:23:54.805	2026-09-18 09:23:54.805
cmu6r4gfp007beqew6ayvodo1	cmu6r4gfi0077eqewdbl8c9xu	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.805	2026-09-18 09:23:54.805
cmu6r4gfp007ceqewf7um8cle	cmu6r4gfi0077eqewdbl8c9xu	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.805	2026-09-18 09:23:54.805
cmu6r4gg4007keqewd3sdwaoh	cmu6r4gfz007ieqewbuc34a6w	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.821	2026-09-18 09:23:54.821
cmu6r4gg4007leqewad0ev3ht	cmu6r4gfz007ieqewbuc34a6w	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.821	2026-09-18 09:23:54.821
cmu6r4gg4007meqewpi2vxg3s	cmu6r4gfz007ieqewbuc34a6w	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.821	2026-09-18 09:23:54.821
cmu6r4gg4007neqew7ordn6y5	cmu6r4gfz007ieqewbuc34a6w	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.821	2026-09-18 09:23:54.821
cmu6r4ggj007veqewf0s195n8	cmu6r4ggd007teqewzvz4a4qp	cmu6r4g410001eqewobjuwk25	DDR5	2026-09-18 09:23:54.835	2026-09-18 09:23:54.835
cmu6r4ggj007weqewtct406s4	cmu6r4ggd007teqewzvz4a4qp	cmu6r4g4c0003eqewsbry4t1r	6000 MHz	2026-09-18 09:23:54.835	2026-09-18 09:23:54.835
cmu6r4ggj007xeqewoklobe7a	cmu6r4ggd007teqewzvz4a4qp	cmu6r4g4f0007eqew2h0936qd	16GB	2026-09-18 09:23:54.835	2026-09-18 09:23:54.835
cmu6r4ggj007yeqew2mcudo0z	cmu6r4ggd007teqewzvz4a4qp	cmu6r4g4j000feqewh0pudlok	RGB RAM	2026-09-18 09:23:54.835	2026-09-18 09:23:54.835
cmu6r4ggj007zeqewjubsiq8e	cmu6r4ggd007teqewzvz4a4qp	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.835	2026-09-18 09:23:54.835
cmu6r4ggy0088eqewe5aw2djp	cmu6r4ggu0086eqewkiv8jjjh	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.851	2026-09-18 09:23:54.851
cmu6r4ggy0089eqew7p9te8ts	cmu6r4ggu0086eqewkiv8jjjh	cmu6r4g4c0003eqewsbry4t1r	2400 MHz	2026-09-18 09:23:54.851	2026-09-18 09:23:54.851
cmu6r4ggy008aeqew3mxn7iax	cmu6r4ggu0086eqewkiv8jjjh	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.851	2026-09-18 09:23:54.851
cmu6r4ggy008beqew2eajxnes	cmu6r4ggu0086eqewkiv8jjjh	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.851	2026-09-18 09:23:54.851
cmu6r4ghh008jeqewtackb03j	cmu6r4gha008heqewo62vh99s	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.869	2026-09-18 09:23:54.869
cmu6r4ghh008keqewakcldo7o	cmu6r4gha008heqewo62vh99s	cmu6r4g4c0003eqewsbry4t1r	2666 MHz	2026-09-18 09:23:54.869	2026-09-18 09:23:54.869
cmu6r4ghh008leqewrrkvij6j	cmu6r4gha008heqewo62vh99s	cmu6r4g4f0007eqew2h0936qd	4GB	2026-09-18 09:23:54.869	2026-09-18 09:23:54.869
cmu6r4ghh008meqewxu3sfzkw	cmu6r4gha008heqewo62vh99s	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.869	2026-09-18 09:23:54.869
cmu6r4ghx008ueqewk9at0tiw	cmu6r4ghr008seqew1uadyrx8	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.885	2026-09-18 09:23:54.885
cmu6r4ghx008veqewoehfmalh	cmu6r4ghr008seqew1uadyrx8	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.885	2026-09-18 09:23:54.885
cmu6r4ghx008weqewkj5ech07	cmu6r4ghr008seqew1uadyrx8	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.885	2026-09-18 09:23:54.885
cmu6r4ghx008xeqewolyx2c48	cmu6r4ghr008seqew1uadyrx8	cmu6r4g4i000deqew2gui9h6q	White	2026-09-18 09:23:54.885	2026-09-18 09:23:54.885
cmu6r4ghx008yeqewwni4gzsd	cmu6r4ghr008seqew1uadyrx8	cmu6r4g4j000feqewh0pudlok	RGB RAM	2026-09-18 09:23:54.885	2026-09-18 09:23:54.885
cmu6r4ghx008zeqewqcd5uo3c	cmu6r4ghr008seqew1uadyrx8	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.885	2026-09-18 09:23:54.885
cmu6r4gij0098eqew0awj10d3	cmu6r4gia0096eqew48z4sl8h	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.908	2026-09-18 09:23:54.908
cmu6r4gij0099eqew5mx2utul	cmu6r4gia0096eqew48z4sl8h	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.908	2026-09-18 09:23:54.908
cmu6r4gij009aeqewfl1lkaej	cmu6r4gia0096eqew48z4sl8h	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.908	2026-09-18 09:23:54.908
cmu6r4gij009beqewbz923t4g	cmu6r4gia0096eqew48z4sl8h	cmu6r4g4j000feqewh0pudlok	RGB RAM	2026-09-18 09:23:54.908	2026-09-18 09:23:54.908
cmu6r4gij009ceqewxqg0lg4b	cmu6r4gia0096eqew48z4sl8h	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.908	2026-09-18 09:23:54.908
cmu6r4gj3009leqewhmo4lskc	cmu6r4giv009jeqewwv6hvpgl	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.927	2026-09-18 09:23:54.927
cmu6r4gj3009meqew6qkjqet6	cmu6r4giv009jeqewwv6hvpgl	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.927	2026-09-18 09:23:54.927
cmu6r4gj3009neqew5khizvnm	cmu6r4giv009jeqewwv6hvpgl	cmu6r4g4f0007eqew2h0936qd	16GB	2026-09-18 09:23:54.927	2026-09-18 09:23:54.927
cmu6r4gj3009oeqew5dgy4k3i	cmu6r4giv009jeqewwv6hvpgl	cmu6r4g4i000deqew2gui9h6q	White	2026-09-18 09:23:54.927	2026-09-18 09:23:54.927
cmu6r4gj3009peqewxy8t4n54	cmu6r4giv009jeqewwv6hvpgl	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.927	2026-09-18 09:23:54.927
cmu6r4gjj009xeqew9evw9l62	cmu6r4gje009veqewqm14yift	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.944	2026-09-18 09:23:54.944
cmu6r4gjj009yeqewquwdy5br	cmu6r4gje009veqewqm14yift	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.944	2026-09-18 09:23:54.944
cmu6r4gjj009zeqewcnzt4f99	cmu6r4gje009veqewqm14yift	cmu6r4g4f0007eqew2h0936qd	8GB	2026-09-18 09:23:54.944	2026-09-18 09:23:54.944
cmu6r4gjj00a0eqew09u18ox6	cmu6r4gje009veqewqm14yift	cmu6r4g4j000feqewh0pudlok	RGB RAM	2026-09-18 09:23:54.944	2026-09-18 09:23:54.944
cmu6r4gjj00a1eqew7ij2nun0	cmu6r4gje009veqewqm14yift	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.944	2026-09-18 09:23:54.944
cmu6r4gk000aaeqewl248yc3j	cmu6r4gjv00a8eqewlxe2djxh	cmu6r4g410001eqewobjuwk25	DDR5	2026-09-18 09:23:54.96	2026-09-18 09:23:54.96
cmu6r4gk000abeqewexcvfqdr	cmu6r4gjv00a8eqewlxe2djxh	cmu6r4g4c0003eqewsbry4t1r	5200 MHz	2026-09-18 09:23:54.96	2026-09-18 09:23:54.96
cmu6r4gk000aceqeweiud117k	cmu6r4gjv00a8eqewlxe2djxh	cmu6r4g4f0007eqew2h0936qd	32GB	2026-09-18 09:23:54.96	2026-09-18 09:23:54.96
cmu6r4gk000adeqewgnhg1csy	cmu6r4gjv00a8eqewlxe2djxh	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.96	2026-09-18 09:23:54.96
cmu6r4gkd00aleqewcxrnwf4q	cmu6r4gk800ajeqewqntcnzam	cmu6r4g410001eqewobjuwk25	DDR4	2026-09-18 09:23:54.974	2026-09-18 09:23:54.974
cmu6r4gkd00ameqewux6denno	cmu6r4gk800ajeqewqntcnzam	cmu6r4g4c0003eqewsbry4t1r	3200 MHz	2026-09-18 09:23:54.974	2026-09-18 09:23:54.974
cmu6r4gkd00aneqew2ajxcam2	cmu6r4gk800ajeqewqntcnzam	cmu6r4g4f0007eqew2h0936qd	16GB	2026-09-18 09:23:54.974	2026-09-18 09:23:54.974
cmu6r4gkd00aoeqew11r8h569	cmu6r4gk800ajeqewqntcnzam	cmu6r4g4l000heqewcqtt9kzx	Lifetime	2026-09-18 09:23:54.974	2026-09-18 09:23:54.974
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, slug, sku, description, "shortDescription", price, "compareAtPrice", "costPrice", "stockStatus", "stockQuantity", "lowStockAlert", "categoryId", "brandId", "metaTitle", "metaDescription", "metaKeywords", "isFeatured", "isActive", "createdAt", "updatedAt", "publishedAt") FROM stdin;
cmr9esnv10002t1wvup6a0f8w	Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card	gigabyte-geforce-rtx-5060-aero-oc-8g-gddr7-graphics-card	GIGABYTE-GEFORCE-RTX	Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card\nThe Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card is a stylish mid-range dynamo that fuses aerodynamic elegance with blistering speed, making the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card a dream upgrade for gamers, video editors, and AI enthusiasts who want immersive visuals and whisper-quiet operation in a compact powerhouse. Powered by NVIDIA's Ada Lovelace architecture with 3840 CUDA cores overclocked for that extra punch, this card harnesses 8GB of cutting-edge GDDR7 memory at 28 Gbps on a 128-bit bus to conquer 7680x4320 8K resolutions and multi-monitor setups up to four displays with ease, perfect for the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card's role in elevating 1440p gaming to 120+ FPS in titles like Forza Horizon 5 with ray tracing enabled or accelerating 4K renders in DaVinci Resolve by 35% via AV1 encoding. Whether you're dominating competitive arenas in Apex Legends with NVIDIA Reflex for sub-5ms latency or upscaling frames 3x via DLSS 3.5 for buttery-smooth 4K at 60 FPS in The Last of Us Part II, the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card shines with DirectX 12 Ultimate and OpenGL 4.6 support for seamless compatibility across Windows, Linux, and creative tools like Maya or Unity. Its AERO OC cooling system—boasting triple fans with alternate spinning, a massive vapor chamber, and composite copper pipes—keeps temps under 68°C and noise below 42dB during marathon sessions, while the 0dB idle mode ensures total silence for office builds, and the premium metal backplate with thermal pads adds structural fortitude for enduring builds. The slim ATX form factor (dimensions: 281mm length x 117mm width x 40mm height in a premium black finish) slots into any mid-tower case effortlessly, powered by a single 8-pin connector and 550W PSU recommendation for efficient surges, with PCIe 5.0 interface future-proofing against bandwidth chokepoints. Connectivity is premium with three DisplayPort 2.1b ports for 8K@60Hz multi-streaming and one HDMI 2.1b for 4K@144Hz with VRR, enabling the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card to drive VR headsets or ultrawide panoramas that expand your creative canvas. For digital artists, the 8GB VRAM tames high-res textures in Substance Painter or 3D sculpting in ZBrush without stuttering, while gamers love the revolutionary Frame Generation for 1440p at 100 FPS in demanding shooters. As a value champion under $500, the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card isn't just a card—it's a aerodynamic revolution in mid-range graphics, backed by a 3-year warranty and Gigabyte's rigorous validation, empowering you to soar through pixels with precision and poise in 2025's high-stakes digital realm, whether battling in Battlefield or modeling in Modo.\n\n\n\nWhy Buy the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card from Tech Land BD?\nTech Land BD is your top choice for the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card, with genuine 3-year warranty, free Bangladesh-wide delivery, and 0% interest EMI to suit your budget. Our pros offer free compatibility checks, secure packaging, and 24/7 support for flawless setup. With thousands of thrilled gamers, we ensure authenticity—seize yours now at Tech Land BD for exclusive deals and seamless upgrades!\n\n\n\nFrequently Asked Questions (FAQs) for Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card\n\n1. What PSU is required for the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card?\nThe Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card recommends a 550W PSU with one 8-pin connector for stable operation. Opt for an 80+ Bronze or Gold certified unit to manage overclocks and avoid instability during gaming or rendering sessions.\n\n2. Does the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card support 4K gaming?\nYes, the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card handles 4K gaming brilliantly with DLSS 3.5, achieving 60+ FPS in AAA titles like Elden Ring on high settings. Its 8GB GDDR7 VRAM and 3840 CUDA cores support ray tracing and textures for smooth, immersive 4K play.\n\n3. How quiet is the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card under load?\nThe Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card's AERO OC cooling operates below 42dB during intense use, with triple fans and 0dB idle mode for complete silence. Temperatures stay under 68°C, ideal for quiet gaming or content creation in shared spaces.	Memory Clock: 28 Gbps Memory Size: 8 GB Memory Type: GDDR7 Card Bus: PCI-E 5.0	56000.00	58000.00	2000.00	IN_STOCK	10	5	cmr9bvs3p001qnjjlnzrmtdrs	cmr9bvs2f000wnjjlhveyideo				f	t	2026-07-06 16:03:00.683	2026-07-06 18:09:28.845	2026-07-06 16:03:00.679
cmrdc2oe5000ggb3wsfqedq5d	MSI PRO H610M-E DDR4 mATX Motherboard	msi-pro-h610m-g-wifi-ddr4-lga1700-motherboard	MSI-PRO-H610M-FGHHGFG	MSI PRO H610M-E DDR4 mATX Motherboard\nThe MSI PRO H610M-E DDR4 12th Gen, 13th Gen & 14th Gen mATX Motherboard is a high-performance motherboard for the LGA 1700 socket that supports 12th/13th Gen Intel Core, Pentium Gold, and Celeron CPUs. This motherboard includes DDR4 memory compatibility, which can run at up to 3200(MAX) MHz. It also has Core Boost technology, a premium layout, and a digital power architecture, which improves performance and enables additional cores. Memory Boost technology, which produces pure data signals, ensures the highest performance, stability, and compatibility with the MSI PRO H610M-E DDR4 12th Gen & 13th Gen mATX Motherboard. It has PCIe 4.0, which allows for extremely rapid data transfers. Audio Boost technology provides studio-level sound quality to your ears, making it a perfect motherboard for gamers and music aficionados. The MSI PRO H610M-E DDR4 12th Gen & 13th Gen mATX Motherboard also has Steel Armor, which protects VGA cards from bending and EMI while improving performance, stability, and robustness. This motherboard is a good choice for individuals looking for a high-performance motherboard that can handle demanding programs and games, thanks to its sophisticated features and superb design.\n\nBuy MSI PRO H610M-E DDR4 mATX Motherboard best Motherboard Shop in BD\nIn Bangladesh, you can get the original MSI PRO H610M-E DDR4 mATX Motherboard From Star Tech. We have a large collection of the latest MSI Motherboard to purchase for your Desktop PC. Order Online Or Visit your Nearest Star Tech Shop to get yours at lowest price. The MSI PRO H610M-E DDR4 Motherboard comes with 3 years warranty.	Supported CPU: 14th/13th/12th Gen Intel Processors (LGA1700) Supported RAM: 2x DDR4, Max 64GB Graphics Output: 1x HDMI, 1x VGA Features: 1x M.2 slot, Realtek RTL8111H Gigabit LAN	12800.00	13000.00	500.00	IN_STOCK	0	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvpu001g11pzvc3or0hz				f	t	2026-07-09 09:57:53.789	2026-07-09 10:04:26.486	2026-07-09 09:57:53.788
cmrj08qjc0002ykwwkebscxas	G.Skill Trident Z5 16GB DDR5 5600MHz CL36 Desktop RAM Silver	g-skill-trident-z5-16gb-ddr5-5600mhz-cl36-desktop-ram-silver	G-SKILL-TRIDENT-Z5-1	G.Skill Trident Z5 16GB DDR5 5600MHz CL36 Desktop RAM Silver\nThe Trident TZ5S RAM brings unparalleled data transfer speeds. This new Trident TZ5S series comes with DDR5 and 5600MHz Speed. This DDR5 RAM Featuring a sleeker and streamlined aluminum heat spreader design, available in metallic silver or matte black, the Trident Z5 series DDR5 memory is the ideal choice for gamers, overclockers, content creators, and enthusiasts to build a high-performance system. This new G.Skill Trident DDR5 RAM develops ever-faster extreme overclocking memory on each new Intel platform generation. Developed and optimized on the latest 12th Gen Intel Core processors and Z690 chipset platform. Here, Engineered to the highest performance and quality standards, each Trident Z5 memory module is featured with high-quality, hand-screened DDR5 ICs to achieve extreme memory performance on next-gen DDR5 platforms. This new Trident Z5 series DDR5 RAM hypercar elements into the iconic Trident heat spreader design, creating a sleek and futuristic exterior. This RAM is designed to fully utilize the faster frequency speed and boost data transfer rate, each DDR5 IC is implemented with twice the amount of banks and bank groups, as well as a doubled burst length, at 32 banks across 8 banks with a burst length of 16. Combined with a module layout. All the Trident Z5 RAM is tested under G.SKILLâ€™s rigorous validation process to ensure the best-in-class reliability and compatibility across the widest range of motherboards. Here, used the latest Intel XMP 3.0 profiles, the only thing between you and extreme performance is a simple setting. The latest G.SKILL flagship RAMs are designed for ultra-high extreme performance on next-gen DDR5 platforms Trident Z5 taps into the speed potential of DDR5 to bring a whole new level of performance to worldwide gamers, overclockers, and enthusiasts. Each latest DDR5 memory module is built with an on-board PMIC (power management integrated circuit) chip, allowing better granular power control and more reliable power delivery to improve signal integrity at high-frequency speeds. Ultimately, The new G.Skill Trident TZ5S ensures the highest level of system stability for gaming. Additionally, XMP 3.0 enables two customizable user-defined profiles to be saved in the memory module via BIOS on supported motherboards. The Trident Z5 is ideal for any PC build theme. The Latest G.Skill Trident TZ5S DDR5 Desktop RAM has a lifetime warranty.	Model: Trident Z5 Capacity: 16GB, Memory Type: DDR5 Tested Latency: 36-36-36-76 Tested Speed: 5600MHz Tested Voltage: 1.20V	30000.00	32000.00	200.00	IN_STOCK	10	8	cmrethhiz0003vdfb4lfktnqj	cmrethhjc0007vdfbun9quctm	\N	\N	\N	f	t	2026-07-13 09:13:18.166	2026-07-13 09:13:18.166	2026-07-13 09:13:18.163
cmr9bvs9s0042njjlfqeg1cdv	Intel Core i5-12400F 6 Core 12 Thread 12th Gen Processor	intel-core-i5-12400f	PROC-INTEL-12400F	The Intel Core i5-12400F Desktop Processor comes with 6 cores and 12 threads. It has an 18MB Intel Smart Cache and the total L2 Cache is 7.5MB. This processor comes with a maximum turbo frequency of 4.40 GHz, and the processor base frequency is 2.50 GHz. It supports up to DDR5 4800 MT/s and DDR4 3200 MT/s memory types with a maximum memory size of 128 GB.	6 Cores, 12 Threads, up to 4.4 GHz, LGA1700 Socket	24100.00	27390.00	\N	IN_STOCK	50	5	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i5-12400F Processor Price in Bangladesh	Buy Intel Core i5-12400F 6 Core 12 Thread 12th Gen Processor at best price in Bangladesh. In stock and ready to ship.	\N	t	t	2026-07-06 14:41:27.52	2026-09-14 17:06:53.046	2026-07-06 14:41:27.518
cmu2p7k9z005yaap11hik0ma8	Intel Core i7-14700K Desktop Processor	intel-core-i7-14700k	CPU-I7-14700K	14th Gen unlocked desktop processor. Fill your own long description before publish.	14th Gen Intel Core i7-14700K unlocked desktop CPU with 20 cores.	48500.00	52000.00	\N	IN_STOCK	0	5	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Buy Intel Core i7-14700K in Bangladesh | LogicBay BD	Intel Core i7-14700K desktop processor. Check price and warranty at LogicBay BD.	processor intel i7 14700k	f	t	2026-09-15 13:19:15.815	2026-09-15 13:19:15.815	2026-09-15 13:19:15.814
cmu2p7k8p005baap13y3b5gko	AMD Ryzen 5 7600 Desktop Processor	amd-ryzen-5-7600	CPU-R5-7600	Ryzen 7000 series mainstream desktop processor. Fill your own long description before publish.	AMD Ryzen 5 7600 6-core AM5 desktop CPU for mainstream gaming PCs.	24500.00	26500.00	\N	IN_STOCK	0	5	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	Buy AMD Ryzen 5 7600 in Bangladesh | LogicBay BD	AMD Ryzen 5 7600 desktop processor. Check price and warranty at LogicBay BD.	processor amd ryzen 5 7600	f	t	2026-09-15 13:19:15.769	2026-09-15 13:19:15.769	2026-09-15 13:19:15.768
cmr9bvsa7004jnjjlzqzyt643	AMD Ryzen 5 5600X 6 Core 12 Thread Desktop Processor	amd-ryzen-5-5600x	PROC-AMD-5600X	AMD Ryzen 5 5600X Desktop Processor comes with 6 cores and 12 threads. This 5th Generation processor has a base clock speed of 3.7 GHz and a maximum boost clock of up to 4.6 GHz. It features 35MB of combined cache and supports DDR4 memory.	6 Cores, 12 Threads, up to 4.6 GHz, AM4 Socket	22500.00	25000.00	\N	IN_STOCK	30	5	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 5600X Processor Price in Bangladesh	Buy AMD Ryzen 5 5600X 6 Core 12 Thread Processor at best price in Bangladesh.		t	t	2026-07-06 14:41:27.536	2026-09-14 15:16:34.204	2026-07-06 14:41:27.534
cmu2p7kb3006laap1k0e6z4b3	AMD Ryzen 9 7950X Desktop Processor	amd-ryzen-9-7950x	CPU-R9-7950X	Ryzen 7000 series high-end desktop processor. Fill your own long description before publish.	AMD Ryzen 9 7950X 16-core high-end AM5 desktop processor.	65000.00	70000.00	\N	IN_STOCK	0	5	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	Buy AMD Ryzen 9 7950X in Bangladesh | LogicBay BD	AMD Ryzen 9 7950X desktop processor. Check price and warranty at LogicBay BD.	processor amd ryzen 9 7950x	f	t	2026-09-15 13:19:15.855	2026-09-15 13:19:15.855	2026-09-15 13:19:15.854
cmu2p7kc80078aap1yam8femo	Intel Core i3-14100 Desktop Processor	intel-core-i3-14100	CPU-I3-14100	14th Gen entry-level desktop processor. Fill your own long description before publish.	14th Gen Intel Core i3-14100 entry-level desktop CPU for office and study PCs.	15500.00	17000.00	\N	IN_STOCK	0	5	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Buy Intel Core i3-14100 in Bangladesh | LogicBay BD	Intel Core i3-14100 desktop processor. Check price and warranty at LogicBay BD.	processor intel i3 14100	f	t	2026-09-15 13:19:15.897	2026-09-15 13:19:15.897	2026-09-15 13:19:15.895
cmtn590bg0003jq5xqmmmsw7w	PELADN GeForce KaiTian GT 730 4GB GDDR3 Graphics Card	peladn-geforce-kaitian-gt-730-4gb-gddr3-graphics-card	PELADN-GT730-4GD3	PELADN GeForce KaiTian GT 730 4GB GDDR3 Graphics Card\n\nThe PELADN GeForce KaiTian GT 730 4GB GDDR3 is an entry-level graphics card for light multimedia, office use, and basic graphical workloads in compact desktops.\n\nKey Features:\n- Model: GeForce KaiTian GT 730\n- Video Memory: 4GB GDDR3\n- CUDA Cores: 192\n- Memory Clock: 902 MHz\n- Memory Frequency: 1300 MHz\n- BUS Type: 64-bit\n- Outputs: HDMI, DVI, VGA (D-Sub)\n- Power Consumption: 25W\n- Recommended PSU: 300W\n- Passive heatsink cooling (quiet operation)\n- Compact size: 146 x 69 x 23mm\n- Weight: 655g\n- Warranty: 2 Years Manufacturer Warranty\n\nIdeal for HTPC builds, small-form-factor cases, and quiet office PCs.	Model: GeForce KaiTian GT 730 | Video Memory: 4GB GDDR3 | CUDA Cores: 192 | Memory Clock: 902 MHz | Memory Frequency: 1300 MHz	5999.00	6500.00	\N	IN_STOCK	10	2	cmr9bvs3q001snjjl5bz9ep3j	cmtn590a70000jq5x2w1gp882	PELADN GT 730 4GB GDDR3 Price in Bangladesh	Buy PELADN GeForce KaiTian GT 730 4GB GDDR3 Graphics Card at best price in Bangladesh. In stock with 2 years warranty.	\N	f	t	2026-09-04 16:03:58.3	2026-09-04 16:03:58.3	2026-09-04 16:03:58.297
cmtn5e2zr0003udp6yvyg5ila	Sapphire Pulse AMD Radeon RX 6600 XT Gaming OC 8GB GDDR6 Graphics Card	sapphire-pulse-amd-radeon-rx-6600-xt-gaming-oc-8gb-gddr6-graphics-card	SAPPHIRE-RX6600XT-PULSE-8G	Sapphire Pulse AMD Radeon RX 6600 XT Gaming OC 8GB GDDR6 Graphics Card\n\nThe Sapphire PULSE AMD Radeon RX 6600 XT Gaming OC 8GB GDDR6 Graphics Card is powered by the AMD RDNA 2 architecture with 32 compute units and 32MB of AMD Infinity Cache. Built for 1080p high-refresh gaming with Dual-X cooling, a metal backplate, and efficient power use.\n\nKey Features:\n- Model: RX 6600 XT\n- Boost Clock: Up to 2593 MHz\n- Game Clock: Up to 2359 MHz\n- Memory: 8GB GDDR6 (16 Gbps Effective)\n- Stream Processors: 2048\n- Architecture: AMD RDNA 2\n- BUS: 128-bit\n- Interface: PCI-Express 4.0 x8\n- Outputs: 1x HDMI, 3x DisplayPort\n- Dual-X Cooling Technology (Dual Fan)\n- Metal Backplate\n- Recommended PSU: 500W\n- Board Power: 160W\n- Connector: 1 x 8-pin\n- Dimensions: 240 x 119.85 x 44.75 mm (2.2 slot)\n- Warranty: 2 Years Manufacturing Warranty\n\nSupports Ray Tracing, AMD FidelityFX, AMD FreeSync, and DirectX 12 Ultimate.	Model: RX 6600 XT | Boost: up to 2593 MHz | Game Clock: up to 2359 MHz | 8GB GDDR6 | Stream Processors: 2048	66900.00	68500.00	\N	IN_STOCK	8	2	cmr9bvs3r001unjjlz6a3qh23	cmtn5e2yh0000udp65aqs32hi	Sapphire Pulse RX 6600 XT 8GB Price in Bangladesh	Buy Sapphire Pulse AMD Radeon RX 6600 XT Gaming OC 8GB GDDR6 Graphics Card at best price in Bangladesh. In stock with 2 years warranty.	\N	f	t	2026-09-04 16:07:55.047	2026-09-04 16:07:55.047	2026-09-04 16:07:55.044
cmtn5tr3t000kdjded7l6qx1m	TEAM ELITE 8GB 3200MHz Laptop RAM	team-elite-8gb-3200mhz-laptop-ram	TEAM-ELITE-8GB-3200-SODIMM	TEAM ELITE 8GB 3200MHz Laptop RAM\n\nTEAM ELITE series is an all-new DDR4 SO-DIMM product that is compliant with the international JEDEC standards. Designed for laptop users who need quality, performance, stability, and compatibility.\n\nKey Features:\n- MPN: TED48G3200C22-S01\n- Model: TEAM ELITE 8G\n- Type: 260-Pin DDR4 SO-DIMM\n- Capacity: 8GB\n- Frequency: 3200 MHz\n- Operating Voltage: 1.2V (saves ~20% power vs previous generation)\n- Latency: CL22-22-22-52\n- 100% compatibility with Intel X99 & Skylake chipsets\n- Reduced heat generation for stable laptop temperatures\n- Warranty: Lifetime\n\nIdeal for upgrading laptop memory for smoother multitasking and everyday performance.	MPN: TED48G3200C22-S01 | Model: TEAM ELITE 8G | Type: DDR4 3200MHz | Voltage: 1.2V | Latency: CL22-22-22-52	9800.00	10780.00	\N	IN_STOCK	15	3	cmrethhj40005vdfbnhhoj6ap	cmr9bvs1e0008njjldd9yn8gy	TEAM ELITE 8GB 3200MHz Laptop RAM Price in Bangladesh	Buy TEAM ELITE 8GB DDR4 3200MHz SODIMM Laptop RAM at best price in Bangladesh. Lifetime warranty. In stock.	\N	f	t	2026-09-04 16:20:06.137	2026-09-04 16:20:06.137	2026-09-04 16:20:06.134
cmrcbkzit001a5menuqtjvxca	Intel Core i5 14400F 14th Gen Raptor Lake Processor	intel-core-i5-14400f-14th-gen-raptor-lake-processor	INTEL-CORE-I5-14400F	Intel Core i5 14400F 14th Gen Raptor Lake Processor\nThe Intel Core i5-14400F 2.5 GHz 10-Core LGA 1700 Processor boosts your work, gaming, and multimedia production capabilities. This 14th-generation desktop CPU, built on the Intel 7 technology, offers increased power efficiency while fitting the LGA 1700 socket. The Core i5-14400F has an improved Hybrid Core Architecture, with six 2.5 GHz Performance-cores driving programs and games and four low-voltage Efficient-cores handling background chores for smooth multitasking. The built-in Intel Thread Director guarantees that the two function in tandem by dynamically and intelligently distributing tasks to the correct core at the right time. With 20MB of cache and a Turbo Boost frequency of 5 GHz, this CPU is designed to handle a wide range of applications. The Core i5-14400F also supports PCI Express 5.0 and up to 192GB of dual-channel DDR5 memory at 4800 MHz.\n\nHybrid Core Design\nThe Intel Core i5 14400F Processor gives you the speed to handle high-end games and demanding programs, while the processor's efficient cores manage low-priority and background operations such as streaming video, playing music, and transcoding media.\n\nIntel Thread Director\nThe Intel Thread Director is incorporated into the CPU cores and works with the operating system to guarantee that each of the 16 threads is allocated to the correct core at the proper time.\n\nPCIe 4.0 and 5.0\nThis Intel Core i5 14400F 14th Gen Processor provides up to four PCIe 4.0 and sixteen PCIe 5.0 lanes, for a total of 20 lanes for excellent data throughput with compatible devices.\n\nGaussian and Neural Accelerator 3.0\nThe Intel Core i5 14400F 14th Gen Raptor Lake Processor features Gaussian and Neural Accelerator 3.0 (GNA) technology, which aid in noise reduction while also improving backdrop blurring during video conferencing.\n\nBuy Intel Core i5 14400F 14th Gen Processor from the best Processor Shop in Bangladesh\nIn Bangladesh, you can get the original Intel Core i5 14400F 14th Gen Raptor Lake Processor From Star Tech. We have a large collection of the latest Intel Processor to purchase for your Desktop PC. Order Online Or Visit your Nearest Star Tech Shop to get yours at the lowest price. The Intel Core i5 14400F 14th Gen Processor comes with a 3-year warranty (No Warranty for Fan or Cooler).	Model: Core i5 14400F (Tray Box) Clock Speed: 3.5 GHz up to 4.7 GHz Cache: 20 MB Intel Smart Cache CPU Cores: 10, CPU Threads: 16 Socket: LGA1700	21000.00	23000.00	2000.00	IN_STOCK	11	2	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt				f	t	2026-07-08 16:56:22.229	2026-09-14 16:48:29.349	2026-07-08 16:56:22.226
cmu2p7k3d003eaap1g3pu2qg3	Intel Core i5-14600K Desktop Processor	intel-core-i5-14600k	CPU-I5-14600K	14th Gen (Raptor Lake Refresh) unlocked desktop processor. Fill your own long description before publish.	14th Gen Intel Core i5 unlocked desktop CPU with 14 cores for gaming and productivity.	35500.00	38000.00	\N	IN_STOCK	0	5	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Buy Intel Core i5-14600K in Bangladesh | LogicBay BD	Intel Core i5-14600K desktop processor. Check price and warranty at LogicBay BD.	processor intel i5 14600k	f	t	2026-09-15 13:19:15.577	2026-09-15 13:19:15.577	2026-09-15 13:19:15.575
cmu2p7k4u0041aap1z5iwkuq2	AMD Ryzen 7 7800X3D Desktop Processor	amd-ryzen-7-7800x3d	CPU-R7-7800X3D	Ryzen 7000 series gaming-focused desktop processor. Fill your own long description before publish.	AMD Ryzen 7 7800X3D 8-core gaming CPU with 3D V-Cache for AM5 builds.	48500.00	52000.00	\N	IN_STOCK	0	5	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	Buy AMD Ryzen 7 7800X3D in Bangladesh | LogicBay BD	AMD Ryzen 7 7800X3D desktop processor. Check price and warranty at LogicBay BD.	processor amd ryzen 7800x3d	f	t	2026-09-15 13:19:15.63	2026-09-15 13:19:15.63	2026-09-15 13:19:15.629
cmu2p7k73004oaap136n88e7i	Intel Core Ultra 7 265K Desktop Processor	intel-core-ultra-7-265k	CPU-U7-265K	Ultra Series 2 unlocked desktop processor. Fill your own long description before publish.	Intel Core Ultra 7 265K Arrow Lake unlocked desktop CPU for LGA 1851.	52000.00	56000.00	\N	IN_STOCK	0	5	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Buy Intel Core Ultra 7 265K in Bangladesh | LogicBay BD	Intel Core Ultra 7 265K desktop processor. Check price and warranty at LogicBay BD.	processor intel ultra 7 265k	f	t	2026-09-15 13:19:15.711	2026-09-15 13:19:15.711	2026-09-15 13:19:15.71
cmu2p7kdf007vaap1w8ihfmcu	AMD Ryzen 5 5600 Desktop Processor	amd-ryzen-5-5600	CPU-R5-5600	Ryzen 5000 series value desktop processor. Fill your own long description before publish.	AMD Ryzen 5 5600 6-core AM4 desktop CPU for value gaming builds.	12500.00	14000.00	\N	IN_STOCK	0	5	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	Buy AMD Ryzen 5 5600 in Bangladesh | LogicBay BD	AMD Ryzen 5 5600 desktop processor. Check price and warranty at LogicBay BD.	processor amd ryzen 5 5600	f	t	2026-09-15 13:19:15.939	2026-09-16 09:18:40.526	2026-09-15 13:19:15.938
cmu6r4gcb004veqew06h8boj6	Colorful Battle-AX 16GB DDR5 6000MHz CL40 Desktop RAM	colorful-battle-ax-16gb-ddr5-6000mhz-cl40-desktop-ram	RAM-COLORFUL-BATTLE-AX-16GB-DDR5-6000MHZ-CL4	\N	Colorful Battle-AX 16GB DDR5 6000MHz CL40 Desktop RAM - fill your own short pitch before publish.	29500.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs24000onjjll00hq9a9	Buy Colorful Battle-AX 16GB DDR5 6000MHz CL40 Desktop RAM in Bangladesh | LogicBay BD	Colorful Battle-AX 16GB DDR5 6000MHz CL40 Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, colorful, ddr5, 16gb, 6000 mhz	f	t	2026-09-18 09:23:54.684	2026-09-18 09:23:54.684	2026-09-18 09:23:54.682
cmu6pynj8002m14lfy6mvvgq9	MSI PRO H610M-G DDR5 mATX Motherboard	msi-pro-h610m-g-ddr5-matx-motherboard	MB-MSI-PRO-H610M-G-2	MSI PRO H610M-G DDR5 pairs Intel H610 with DDR5 DIMMs for newer memory kits on 12th–14th Gen CPUs. Micro-ATX layout, M.2 SSD slot, multi-display outputs, and Realtek audio/LAN for everyday builds.	LGA1700 H610 Micro-ATX board with dual-channel DDR5 memory.	10800.00	11000.00	11800.00	IN_STOCK	8	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvpu001g11pzvc3or0hz	Buy MSI PRO H610M-G DDR5 mATX Motherboard in Bangladesh | LogicBay BD	MSI PRO H610M-G DDR5 mATX Motherboard — Intel H610, DDR5, Micro ATX. Price ৳13800. Warranty 3 Years.	motherboard, msi-intel, Intel H610, DDR5, LogicBay BD	f	t	2026-09-18 08:51:24.452	2026-09-18 09:44:30.888	2026-09-18 08:51:24.45
cmu6pynk5003614lfs7alffu6	MSI PRO A620M-E AMD AM5 mATX Motherboard	msi-pro-a620m-e-amd-am5-matx-motherboard	MB-MSI-PRO-A620M-E-AM5	MSI PRO A620M-E supports Ryzen 7000/8000/9000 on AM5 with AMD A620 chipset. Two DDR5 DIMMs (up to 128GB per MSI current spec), PCIe 4.0 x16, Gen4 M.2, and Micro-ATX form factor for budget Ryzen systems.	Affordable AM5 A620 board with DDR5 and Gen4 M.2.	10000.00	11500.00	12800.00	IN_STOCK	10	5	cmrdawgox0005t4sx9zy0pfy3	cmrdanvq6001h11pz8gu6h96b	Buy MSI PRO A620M-E AMD AM5 mATX Motherboard in Bangladesh | LogicBay BD	MSI PRO A620M-E AMD AM5 mATX Motherboard — AMD A620, DDR5, Micro ATX. Price ৳14900. Warranty 3 Years.	motherboard, msi-amd, AMD A620, DDR5, LogicBay BD	f	t	2026-09-18 08:51:24.485	2026-09-18 09:44:30.899	2026-09-18 08:51:24.483
cmu6pynl9003q14lfiwe0pdd4	MSI A520M-A Pro AM4 AMD Micro-ATX Motherboard	msi-a520m-a-pro-am4-amd-micro-atx-motherboard	MB-MSI-A520M-A-PRO-AM4	MSI A520M-A PRO is an entry AM4 board for Ryzen 3000/5000 class CPUs. AMD A520 chipset, dual-channel DDR4, M.2 slot, and triple display outputs for budget AMD desktops.	Value AM4 A520 Micro-ATX motherboard with DDR4.	7200.00	8300.00	8400.00	IN_STOCK	14	5	cmrdawgox0005t4sx9zy0pfy3	cmrdanvq6001h11pz8gu6h96b	Buy MSI A520M-A Pro AM4 AMD Micro-ATX Motherboard in Bangladesh | LogicBay BD	MSI A520M-A Pro AM4 AMD Micro-ATX Motherboard — AMD A520, DDR4, Micro ATX. Price ৳9800. Warranty 3 Years.	motherboard, msi-amd, AMD A520, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.525	2026-09-18 09:44:30.911	2026-09-18 08:51:24.523
cmu6pynm6004a14lfbyp1ggq0	MSI B550M-A PRO DDR4 AMD AM4 Micro ATX Motherboard	msi-b550m-a-pro-ddr4-amd-am4-micro-atx-motherboard	MB-MSI-B550M-A-PRO-AM4	MSI B550M-A PRO brings AMD B550 features to a compact board: PCIe 4.0 graphics lane, dual M.2 storage, DDR4 dual-channel memory, and HDMI/DP outputs for productive Ryzen AM4 builds.	B550 Micro-ATX with PCIe 4.0 and dual M.2 for AM4 Ryzen.	10500.00	10800.00	12400.00	IN_STOCK	9	5	cmrdawgox0005t4sx9zy0pfy3	cmrdanvq6001h11pz8gu6h96b	Buy MSI B550M-A PRO DDR4 AMD AM4 Micro ATX Motherboard in Bangladesh | LogicBay BD	MSI B550M-A PRO DDR4 AMD AM4 Micro ATX Motherboard — AMD B550, DDR4, Micro ATX. Price ৳14500. Warranty 3 Years.	motherboard, msi-amd, AMD B550, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.558	2026-09-18 09:44:30.954	2026-09-18 08:51:24.556
cmu6pynn6004u14lf1upst9p2	Asus PRIME A520M-R AM4 micro ATX Motherboard	asus-prime-a520m-r-am4-micro-atx-motherboard	MB-ASUS-PRIME-A520M-R-AM4	ASUS PRIME A520M-R uses AMD A520 for Ryzen AM4 CPUs. Dual DDR4 DIMMs, M.2 NVMe support, HDMI/VGA video, and ASUS reliability features for home and office PCs.	ASUS PRIME A520M-R entry AM4 board with DDR4.	8700.00	\N	7900.00	IN_STOCK	11	5	cmrdawgox0005t4sx9zy0pfy3	cmrdanvqa001l11pzanfwwru5	Buy Asus PRIME A520M-R AM4 micro ATX Motherboard in Bangladesh | LogicBay BD	Asus PRIME A520M-R AM4 micro ATX Motherboard — AMD A520, DDR4, Micro ATX. Price ৳9200. Warranty 3 Years.	motherboard, asus-amd, AMD A520, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.594	2026-09-18 09:44:30.969	2026-09-18 08:51:24.592
cmu6pynnt005e14lf46rlo8dw	Asus Prime A520M-K AM4 Micro-ATX AMD Motherboard	asus-prime-a520m-k-am4-micro-atx-amd-motherboard	MB-ASUS-PRIME-A520M-K-AM4	ASUS PRIME A520M-K is a Micro-ATX AMD A520 motherboard supporting Ryzen AM4 processors, dual-channel DDR4, M.2 storage, and HDMI/DVI/VGA for older monitors.	PRIME A520M-K with triple display outputs for AM4.	9000.00	9900.00	8100.00	IN_STOCK	12	5	cmrdawgox0005t4sx9zy0pfy3	cmrdanvqa001l11pzanfwwru5	Buy Asus Prime A520M-K AM4 Micro-ATX AMD Motherboard in Bangladesh | LogicBay BD	Asus Prime A520M-K AM4 Micro-ATX AMD Motherboard — AMD A520, DDR4, Micro ATX. Price ৳9500. Warranty 3 Years.	motherboard, asus-amd, AMD A520, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.617	2026-09-18 09:44:30.99	2026-09-18 08:51:24.615
cmu6pynp3006i14lfiw3ej7xk	ASUS PRIME H610M-R D4 DDR4 LGA1700 mATX Motherboard	asus-prime-h610m-r-d4-ddr4-lga1700-matx-motherboard	MB-ASUS-PRIME-H610M-R-D4-LGA1700	ASUS PRIME H610M-R D4 (official ASUS specs) supports LGA1700 Intel 12th–14th Gen CPUs, dual DDR4 up to 64GB, one M.2, four SATA ports, and HDMI/DVI-D/VGA rear video for versatile office PCs.	PRIME H610M-R D4 with triple video and four SATA ports.	10400.00	10500.00	10100.00	IN_STOCK	11	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvq9001k11pz2gprvud2	Buy ASUS PRIME H610M-R D4 DDR4 LGA1700 mATX Motherboard in Bangladesh | LogicBay BD	ASUS PRIME H610M-R D4 DDR4 LGA1700 mATX Motherboard — Intel H610, DDR4, Micro ATX. Price ৳11800. Warranty 3 Years.	motherboard, asus-intel, Intel H610, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.664	2026-09-18 09:44:31.053	2026-09-18 08:51:24.662
cmu6r4gct0056eqewl1d14foq	OSCOO R500 RGB 16GB DDR5 6000MHz CL46 Desktop RAM	oscoo-r500-rgb-16gb-ddr5-6000mhz-cl46-desktop-ram	RAM-OSCOO-R500-RGB-16GB-DDR5-6000MHZ-CL46	\N	OSCOO R500 RGB 16GB DDR5 6000MHz CL46 Desktop RAM - fill your own short pitch before publish.	27500.00	31000.00	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs1k000bnjjl4cavdy9l	Buy OSCOO R500 RGB 16GB DDR5 6000MHz CL46 Desktop RAM in Bangladesh | LogicBay BD	OSCOO R500 RGB 16GB DDR5 6000MHz CL46 Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, oscoo, ddr5, 16gb, 6000 mhz	f	t	2026-09-18 09:23:54.701	2026-09-18 09:23:54.701	2026-09-18 09:23:54.7
cmu6pynqc007m14lfu9ra7yvv	Asus PRIME A520M-A II AM4 micro ATX Motherboard	asus-prime-a520m-a-ii-am4-micro-atx-motherboard	MB-ASUS-PRIME-A520M-A-II-AM4	ASUS PRIME A520M-A II is an AM4 A520 Micro-ATX board with dual-channel DDR4, M.2 NVMe, triple display outputs, and an Aura RGB header for custom builds.	PRIME A520M-A II with RGB header and dual-channel DDR4.	11100.00	11300.00	9000.00	IN_STOCK	9	5	cmrdawgox0005t4sx9zy0pfy3	cmrdanvqa001l11pzanfwwru5	Buy Asus PRIME A520M-A II AM4 micro ATX Motherboard in Bangladesh | LogicBay BD	Asus PRIME A520M-A II AM4 micro ATX Motherboard — AMD A520, DDR4, Micro ATX. Price ৳10500. Warranty 3 Years.	motherboard, asus-amd, AMD A520, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.709	2026-09-18 09:44:31.066	2026-09-18 08:51:24.707
cmu6pynr0008614lf9j7jqodq	GIGABYTE A520M K V2 AM4 Micro ATX Motherboard	gigabyte-a520m-k-v2-am4-micro-atx-motherboard	MB-GIGABYTE-A520M-K-V2-AM4	GIGABYTE A520M K V2 uses AMD A520 for Ryzen AM4 CPUs with dual DDR4 DIMMs, M.2 NVMe, HDMI/DVI video, Realtek LAN, and Smart Fan 6 cooling controls.	GIGABYTE A520M K V2 value AM4 motherboard.	8500.00	\N	7600.00	IN_STOCK	13	5	cmrdawgox0005t4sx9zy0pfy3	cmrdanvqb001n11pzcboyvwqr	Buy GIGABYTE A520M K V2 AM4 Micro ATX Motherboard in Bangladesh | LogicBay BD	GIGABYTE A520M K V2 AM4 Micro ATX Motherboard — AMD A520, DDR4, Micro ATX. Price ৳8900. Warranty 3 Years.	motherboard, gigabyte-amd, AMD A520, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.732	2026-09-18 09:44:31.07	2026-09-18 08:51:24.73
cmu6pynrl008q14lf6340ni1v	GIGABYTE B450M K AMD AM4 Micro ATX Motherboard	gigabyte-b450m-k-amd-am4-micro-atx-motherboard	MB-GIGABYTE-B450M-K-AM4	GIGABYTE B450M K is a budget B450 Micro-ATX board for AM4 Ryzen processors with DDR4 dual-channel memory, M.2 storage, and HDMI/DVI display outputs.	GIGABYTE B450M K Micro-ATX for AM4 Ryzen upgrades.	8800.00	\N	8200.00	IN_STOCK	10	5	cmrdawgox0005t4sx9zy0pfy3	cmrdanvqb001n11pzcboyvwqr	Buy GIGABYTE B450M K AMD AM4 Micro ATX Motherboard in Bangladesh | LogicBay BD	GIGABYTE B450M K AMD AM4 Micro ATX Motherboard — AMD B450, DDR4, Micro ATX. Price ৳9500. Warranty 3 Years.	motherboard, gigabyte-amd, AMD B450, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.754	2026-09-18 09:44:31.072	2026-09-18 08:51:24.751
cmu6pyns9009a14lfmpt8ulet	GIGABYTE H610M K DDR4 Micro ATX Motherboard	gigabyte-h610m-k-ddr4-micro-atx-motherboard	MB-GIGABYTE-H610M-K	Per GIGABYTE specs, H610M K DDR4 supports Intel 12th–14th Gen LGA1700 CPUs, dual-channel DDR4 up to 64GB, PCIe 4.0 x16, Gen3 x4 M.2, Realtek GbE, and Smart Fan 6.	GIGABYTE H610M K DDR4 with NVMe M.2 and Smart Fan 6.	10500.00	\N	9200.00	IN_STOCK	12	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvqa001m11pzgzu1n54x	Buy GIGABYTE H610M K DDR4 Micro ATX Motherboard in Bangladesh | LogicBay BD	GIGABYTE H610M K DDR4 Micro ATX Motherboard — Intel H610, DDR4, Micro ATX. Price ৳10800. Warranty 3 Years.	motherboard, gigabyte-intel, Intel H610, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.778	2026-09-18 09:44:31.076	2026-09-18 08:51:24.776
cmu6pynsx009u14lflgy1fc53	GIGABYTE H610M H DDR4 Micro ATX Motherboard	gigabyte-h610m-h-ddr4-micro-atx-motherboard	MB-GIGABYTE-H610M-H	GIGABYTE H610M H DDR4 is an H610 Micro-ATX board for LGA1700 Intel CPUs with dual DDR4 DIMMs, M.2 NVMe, HDMI and VGA outputs, and Realtek networking/audio.	H610M H DDR4 with HDMI + VGA for office PCs.	10600.00	\N	9500.00	IN_STOCK	11	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvqa001m11pzgzu1n54x	Buy GIGABYTE H610M H DDR4 Micro ATX Motherboard in Bangladesh | LogicBay BD	GIGABYTE H610M H DDR4 Micro ATX Motherboard — Intel H610, DDR4, Micro ATX. Price ৳11200. Warranty 3 Years.	motherboard, gigabyte-intel, Intel H610, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.802	2026-09-18 09:44:31.081	2026-09-18 08:51:24.8
cmu6pyntk00ae14lfm0qqeg8e	GIGABYTE H610M K DDR5 Micro ATX Motherboard	gigabyte-h610m-k-ddr5-micro-atx-motherboard	MB-GIGABYTE-H610M-K-2	GIGABYTE H610M K DDR5 supports Intel 12th–14th Gen CPUs with dual-channel DDR5 memory, M.2 storage, PCIe 4.0 graphics slot, and Smart Fan 6 thermal control.	GIGABYTE H610M K DDR5 Micro-ATX motherboard.	10700.00	10900.00	11000.00	IN_STOCK	8	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvqa001m11pzgzu1n54x	Buy GIGABYTE H610M K DDR5 Micro ATX Motherboard in Bangladesh | LogicBay BD	GIGABYTE H610M K DDR5 Micro ATX Motherboard — Intel H610, DDR5, Micro ATX. Price ৳12800. Warranty 3 Years.	motherboard, gigabyte-intel, Intel H610, DDR5, LogicBay BD	f	t	2026-09-18 08:51:24.825	2026-09-18 09:44:31.084	2026-09-18 08:51:24.823
cmu6pynu700ay14lf9u2x0psh	GIGABYTE A620M H AM5 Micro-ATX Motherboard	gigabyte-a620m-h-am5-micro-atx-motherboard	MB-GIGABYTE-A620M-H-AM5	GIGABYTE A620M H is an entry AM5 motherboard with AMD A620 chipset, dual-channel DDR5, M.2 NVMe, HDMI/DisplayPort outputs, and Micro-ATX sizing for Ryzen 7000-class systems.	GIGABYTE A620M H AM5 board with DDR5 and HDMI/DP.	11400.00	11500.00	12200.00	IN_STOCK	9	5	cmrdawgox0005t4sx9zy0pfy3	cmrdanvqb001n11pzcboyvwqr	Buy GIGABYTE A620M H AM5 Micro-ATX Motherboard in Bangladesh | LogicBay BD	GIGABYTE A620M H AM5 Micro-ATX Motherboard — AMD A620, DDR5, Micro ATX. Price ৳14200. Warranty 3 Years.	motherboard, gigabyte-amd, AMD A620, DDR5, LogicBay BD	f	t	2026-09-18 08:51:24.847	2026-09-18 09:44:31.087	2026-09-18 08:51:24.845
cmu6pynux00bi14lfx6crv5wy	ASRock A520M-HVS AMD AM4 Micro ATX Motherboard	asrock-a520m-hvs-amd-am4-micro-atx-motherboard	MB-ASROCK-A520M-HVS-AM4	ASRock A520M-HVS pairs AMD A520 with Ryzen AM4 CPUs, dual DDR4 DIMMs, M.2 SSD support, and HDMI/VGA outputs for low-cost desktops.	ASRock A520M-HVS budget AM4 Micro-ATX board.	6800.00	7500.00	7400.00	IN_STOCK	12	5	cmrdawgox0005t4sx9zy0pfy3	cmrdanvq8001j11pzm8ggkaua	Buy ASRock A520M-HVS AMD AM4 Micro ATX Motherboard in Bangladesh | LogicBay BD	ASRock A520M-HVS AMD AM4 Micro ATX Motherboard — AMD A520, DDR4, Micro ATX. Price ৳8600. Warranty 3 Years.	motherboard, asrock-amd, AMD A520, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.873	2026-09-18 09:44:31.089	2026-09-18 08:51:24.871
cmu6r4gdb005jeqewi00quivx	KingBank KJXB 8GB DDR4 3200MHz Desktop RAM	kingbank-kjxb-8gb-ddr4-3200mhz-desktop-ram	RAM-KINGBANK-KJXB-8GB-DDR4-3200MHZ	\N	KingBank KJXB 8GB DDR4 3200MHz Desktop RAM - fill your own short pitch before publish.	6900.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs38001fnjjly085bwns	Buy KingBank KJXB 8GB DDR4 3200MHz Desktop RAM in Bangladesh | LogicBay BD	KingBank KJXB 8GB DDR4 3200MHz Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, kingbank, ddr4, 8gb, 3200 mhz	f	t	2026-09-18 09:23:54.719	2026-09-18 09:23:54.719	2026-09-18 09:23:54.717
cmu6pynwq00d614lfwblmos3x	Gigabyte A520M DS3H V2 Micro-ATX DDR4 AMD AM4 Motherboard	gigabyte-a520m-ds3h-v2-micro-atx-ddr4-amd-am4-motherboard	MB-GIGABYTE-A520M-DS3H-V2-AM4	GIGABYTE A520M DS3H V2 offers AMD A520 on AM4 with up to four DDR4 DIMMs (high capacity), M.2 NVMe, triple display outputs, and Ultra Durable components for mainstream desktops.	A520M DS3H V2 with four DIMM slots and RGB header.	10000.00	10300.00	9600.00	IN_STOCK	9	5	cmrdawgox0005t4sx9zy0pfy3	cmrdanvqb001n11pzcboyvwqr	Buy Gigabyte A520M DS3H V2 Micro-ATX DDR4 AMD AM4 Motherboard in Bangladesh | LogicBay BD	Gigabyte A520M DS3H V2 Micro-ATX DDR4 AMD AM4 Motherboard — AMD A520, DDR4, Micro ATX. Price ৳11200. Warranty 3 Years.	motherboard, gigabyte-amd, AMD A520, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.939	2026-09-18 09:44:31.101	2026-09-18 08:51:24.937
cmu6pynxc00dq14lf3fb6dcu6	Gigabyte B450M DS3H V3 AMD AM4 Micro ATX Motherboard	gigabyte-b450m-ds3h-v3-amd-am4-micro-atx-motherboard	MB-GIGABYTE-B450M-DS3H-V3-AM4	GIGABYTE B450M DS3H V3 is a proven B450 Micro-ATX platform for Ryzen AM4 with dual-channel DDR4 (4 DIMMs), M.2 storage, and multi-display rear I/O.	B450M DS3H V3 Micro-ATX with four DIMMs for AM4.	10000.00	10500.00	10100.00	IN_STOCK	8	5	cmrdawgox0005t4sx9zy0pfy3	cmrdanvqb001n11pzcboyvwqr	Buy Gigabyte B450M DS3H V3 AMD AM4 Micro ATX Motherboard in Bangladesh | LogicBay BD	Gigabyte B450M DS3H V3 AMD AM4 Micro ATX Motherboard — AMD B450, DDR4, Micro ATX. Price ৳11800. Warranty 3 Years.	motherboard, gigabyte-amd, AMD B450, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.96	2026-09-18 09:44:31.106	2026-09-18 08:51:24.958
cmu6pyny000ea14lfi7waffpz	MSI PRO H610M-S DDR4 II mATX Motherboard	msi-pro-h610m-s-ddr4-ii-matx-motherboard	MB-MSI-PRO-H610M-S-II	MSI PRO H610M-S DDR4 II supports Intel LGA1700 12th–14th Gen CPUs with H610 chipset, dual DDR4 DIMMs up to 64GB, M.2 SSD, and HDMI/VGA outputs for business PCs.	MSI PRO H610M-S DDR4 II compact office motherboard.	10200.00	\N	9300.00	IN_STOCK	10	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvpu001g11pzvc3or0hz	Buy MSI PRO H610M-S DDR4 II mATX Motherboard in Bangladesh | LogicBay BD	MSI PRO H610M-S DDR4 II mATX Motherboard — Intel H610, DDR4, Micro ATX. Price ৳10900. Warranty 3 Years.	motherboard, msi-intel, Intel H610, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.985	2026-09-18 09:44:31.116	2026-09-18 08:51:24.983
cmu6pynze00fe14lfh5xauu7g	GIGABYTE H610M H V3 DDR4 Micro ATX Motherboard	gigabyte-h610m-h-v3-ddr4-micro-atx-motherboard	MB-GIGABYTE-H610M-H-V3	GIGABYTE H610M H V3 DDR4 updates the H610M H line for Intel 12th–14th Gen CPUs with dual DDR4 DIMMs, M.2 NVMe, HDMI/VGA, and Smart Fan 6.	GIGABYTE H610M H V3 DDR4 refreshed H610 board.	10200.00	11000.00	9700.00	IN_STOCK	10	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvqa001m11pzgzu1n54x	Buy GIGABYTE H610M H V3 DDR4 Micro ATX Motherboard in Bangladesh | LogicBay BD	GIGABYTE H610M H V3 DDR4 Micro ATX Motherboard — Intel H610, DDR4, Micro ATX. Price ৳11400. Warranty 3 Years.	motherboard, gigabyte-intel, Intel H610, DDR4, LogicBay BD	f	t	2026-09-18 08:51:25.035	2026-09-18 09:44:31.152	2026-09-18 08:51:25.033
cmu6pyo0200fy14lfkvcj93kc	GIGABYTE H610M H DDR5 mATX Motherboard	gigabyte-h610m-h-ddr5-matx-motherboard	MB-GIGABYTE-H610M-H-2	GIGABYTE H610M H DDR5 supports LGA1700 Intel 12th–14th Gen processors with dual-channel DDR5, M.2 storage, and HDMI/VGA for mixed display setups.	GIGABYTE H610M H DDR5 with HDMI and VGA outputs.	10900.00	11000.00	11200.00	IN_STOCK	7	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvqa001m11pzgzu1n54x	Buy GIGABYTE H610M H DDR5 mATX Motherboard in Bangladesh | LogicBay BD	GIGABYTE H610M H DDR5 mATX Motherboard — Intel H610, DDR5, Micro ATX. Price ৳13000. Warranty 3 Years.	motherboard, gigabyte-intel, Intel H610, DDR5, LogicBay BD	f	t	2026-09-18 08:51:25.058	2026-09-18 09:44:31.16	2026-09-18 08:51:25.056
cmu6pyo0s00gi14lfjfngwo9u	MSI PRO H610M-S DDR4 m-ATX Motherboard	msi-pro-h610m-s-ddr4-m-atx-motherboard	MB-MSI-PRO-H610M-S	MSI PRO H610M-S DDR4 is an H610 Micro-ATX motherboard for Intel 12th–14th Gen CPUs with dual DDR4 memory slots, M.2 SSD, HDMI/VGA, and Realtek audio/LAN.	MSI PRO H610M-S DDR4 Micro-ATX for LGA1700.	9700.00	10200.00	9100.00	IN_STOCK	11	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvpu001g11pzvc3or0hz	Buy MSI PRO H610M-S DDR4 m-ATX Motherboard in Bangladesh | LogicBay BD	MSI PRO H610M-S DDR4 m-ATX Motherboard — Intel H610, DDR4, Micro ATX. Price ৳10700. Warranty 3 Years.	motherboard, msi-intel, Intel H610, DDR4, LogicBay BD	f	t	2026-09-18 08:51:25.084	2026-09-18 09:44:31.168	2026-09-18 08:51:25.082
cmu6pyo1e00h214lfy6uwilf9	MSI PRO H610M-E mATX Motherboard	msi-pro-h610m-e-matx-motherboard	MB-MSI-PRO-H610M-E-2	MSI PRO H610M-E (DDR5 SKU) supports Intel LGA1700 12th–14th Gen CPUs with H610 chipset, dual-channel DDR5, M.2 storage, HDMI/VGA, and PRO-series reliability features.	MSI PRO H610M-E (DDR5) Micro-ATX for LGA1700.	10500.00	10800.00	11700.00	IN_STOCK	8	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvpu001g11pzvc3or0hz	Buy MSI PRO H610M-E mATX Motherboard in Bangladesh | LogicBay BD	MSI PRO H610M-E mATX Motherboard — Intel H610, DDR5, Micro ATX. Price ৳13600. Warranty 3 Years.	motherboard, msi-intel, Intel H610, DDR5, LogicBay BD	f	t	2026-09-18 08:51:25.107	2026-09-18 09:44:31.177	2026-09-18 08:51:25.105
cmu6pyo1z00hm14lf8ln55j0p	Gigabyte H410M H 10th Gen Micro ATX Motherboard	gigabyte-h410m-h-10th-gen-micro-atx-motherboard	MB-GIGABYTE-H410M-H-10TH-GEN	GIGABYTE H410M H is an H410 Micro-ATX board for Intel 10th Gen LGA1200 CPUs with dual DDR4 DIMMs, M.2 storage, and HDMI/VGA outputs for legacy upgrades.	GIGABYTE H410M H for 10th Gen LGA1200 systems.	9200.00	\N	7000.00	IN_STOCK	10	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvqa001m11pzgzu1n54x	Buy Gigabyte H410M H 10th Gen Micro ATX Motherboard in Bangladesh | LogicBay BD	Gigabyte H410M H 10th Gen Micro ATX Motherboard — Intel H410, DDR4, Micro ATX. Price ৳8200. Warranty 3 Years.	motherboard, gigabyte-intel, Intel H410, DDR4, LogicBay BD	f	t	2026-09-18 08:51:25.128	2026-09-18 09:44:31.183	2026-09-18 08:51:25.126
cmu6r4g6a0012eqewtktu2yyy	Kingston FURY Beast 8GB 3200MHz DDR4 Desktop RAM	kingston-fury-beast-8gb-3200mhz-ddr4-desktop-ram	RAM-KINGSTON-FURY-BEAST-8GB-3200MHZ-DDR4	\N	Kingston FURY Beast 8GB 3200MHz DDR4 Desktop RAM - fill your own short pitch before publish.	8300.00	8400.00	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs1c0007njjliydjdegy	Buy Kingston FURY Beast 8GB 3200MHz DDR4 Desktop RAM in Bangladesh | LogicBay BD	Kingston FURY Beast 8GB 3200MHz DDR4 Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, kingston, ddr4, 8gb, 3200 mhz	f	t	2026-09-18 09:23:54.466	2026-09-18 09:23:54.466	2026-09-18 09:23:54.462
cmu6r4g7c001deqew5xd51myk	Corsair Vengeance LPX 8GB 3200MHz DDR4 Desktop RAM	corsair-vengeance-lpx-8gb-3200mhz-ddr4-desktop-ram	RAM-CORSAIR-VENGEANCE-LPX-8GB-3200MHZ-DDR4	\N	Corsair Vengeance LPX 8GB 3200MHz DDR4 Desktop RAM - fill your own short pitch before publish.	8500.00	8999.00	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs190006njjl0etcmten	Buy Corsair Vengeance LPX 8GB 3200MHz DDR4 Desktop RAM in Bangladesh | LogicBay BD	Corsair Vengeance LPX 8GB 3200MHz DDR4 Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, corsair, ddr4, 8gb, 3200 mhz	f	t	2026-09-18 09:23:54.504	2026-09-18 09:23:54.504	2026-09-18 09:23:54.503
cmu6r4g7s001oeqew5evuclei	G.SKILL Aegis 8GB DDR4 3200Mhz Desktop RAM	g-skill-aegis-8gb-ddr4-3200mhz-desktop-ram	RAM-GSKILL-G-SKILL-AEGIS-8GB-DDR4-3200MHZ	\N	G.SKILL Aegis 8GB DDR4 3200Mhz Desktop RAM - fill your own short pitch before publish.	8000.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmrethhjc0007vdfbun9quctm	Buy G.SKILL Aegis 8GB DDR4 3200Mhz Desktop RAM in Bangladesh | LogicBay BD	G.SKILL Aegis 8GB DDR4 3200Mhz Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, g-skill, ddr4, 8gb, 3200 mhz	f	t	2026-09-18 09:23:54.521	2026-09-18 09:23:54.521	2026-09-18 09:23:54.519
cmu6r4g8a001zeqew4kx9ss79	Team T-Force VULCAN Z Red 8GB DDR4 3200MHz Desktop Gaming RAM	team-t-force-vulcan-z-red-8gb-ddr4-3200mhz-desktop-gaming-ram	RAM-TEAM-T-FORCE-VULCAN-Z-RED-8GB-DDR4-3200M	\N	Team T-Force VULCAN Z Red 8GB DDR4 3200MHz Desktop Gaming RAM - fill your own short pitch before publish.	8500.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs1e0008njjldd9yn8gy	Buy Team T-Force VULCAN Z Red 8GB DDR4 3200MHz Desktop Gaming RAM in Bangladesh | LogicBay BD	Team T-Force VULCAN Z Red 8GB DDR4 3200MHz Desktop Gaming RAM. Check price and warranty at LogicBay BD.	desktop ram, team, ddr4, 8gb, 3200 mhz	f	t	2026-09-18 09:23:54.538	2026-09-18 09:23:54.538	2026-09-18 09:23:54.536
cmu6r4g8q002beqew38zed8wq	Adata 8GB DDR5 5600MHz CL46 U-DIMM Desktop RAM	adata-8gb-ddr5-5600mhz-cl46-u-dimm-desktop-ram	RAM-ADATA-8GB-DDR5-5600MHZ-CL46-U-DIMM	\N	Adata 8GB DDR5 5600MHz CL46 U-DIMM Desktop RAM - fill your own short pitch before publish.	17200.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs1s000gnjjlrepfjl63	Buy Adata 8GB DDR5 5600MHz CL46 U-DIMM Desktop RAM in Bangladesh | LogicBay BD	Adata 8GB DDR5 5600MHz CL46 U-DIMM Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, adata, ddr5, 8gb, 5600 mhz	f	t	2026-09-18 09:23:54.555	2026-09-18 09:23:54.555	2026-09-18 09:23:54.553
cmu6r4g95002meqewhxmnbb1h	Lexar THOR 8GB DDR4 3200Mhz UDIMM Desktop RAM	lexar-thor-8gb-ddr4-3200mhz-udimm-desktop-ram	RAM-LEXAR-THOR-8GB-DDR4-3200MHZ-UDIMM	\N	Lexar THOR 8GB DDR4 3200Mhz UDIMM Desktop RAM - fill your own short pitch before publish.	11500.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs1l000cnjjlf6abi45d	Buy Lexar THOR 8GB DDR4 3200Mhz UDIMM Desktop RAM in Bangladesh | LogicBay BD	Lexar THOR 8GB DDR4 3200Mhz UDIMM Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, lexar, ddr4, 8gb, 3200 mhz	f	t	2026-09-18 09:23:54.57	2026-09-18 09:23:54.57	2026-09-18 09:23:54.568
cmu6r4g9j002xeqew48h4fl84	PNY XLR8 16GB DDR4 3200MHz Desktop Gaming RAM	pny-xlr8-16gb-ddr4-3200mhz-desktop-gaming-ram	RAM-PNY-XLR8-16GB-DDR4-3200MHZ-GAMING	\N	PNY XLR8 16GB DDR4 3200MHz Desktop Gaming RAM - fill your own short pitch before publish.	16000.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs27000rnjjlpj0622kg	Buy PNY XLR8 16GB DDR4 3200MHz Desktop Gaming RAM in Bangladesh | LogicBay BD	PNY XLR8 16GB DDR4 3200MHz Desktop Gaming RAM. Check price and warranty at LogicBay BD.	desktop ram, pny, ddr4, 16gb, 3200 mhz	f	t	2026-09-18 09:23:54.583	2026-09-18 09:23:54.583	2026-09-18 09:23:54.582
cmu6r4g9z0038eqewbcb6z2np	TwinMOS VOLTX 16GB DDR5 6000MHz Desktop RAM	twinmos-voltx-16gb-ddr5-6000mhz-desktop-ram	RAM-TWINMOS-VOLTX-16GB-DDR5-6000MHZ	\N	TwinMOS VOLTX 16GB DDR5 6000MHz Desktop RAM - fill your own short pitch before publish.	10000.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs29000snjjlcu8q19no	Buy TwinMOS VOLTX 16GB DDR5 6000MHz Desktop RAM in Bangladesh | LogicBay BD	TwinMOS VOLTX 16GB DDR5 6000MHz Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, twinmos, ddr5, 16gb, 6000 mhz	f	t	2026-09-18 09:23:54.599	2026-09-18 09:23:54.599	2026-09-18 09:23:54.597
cmu6r4gag003jeqewog4h5uso	Netac Basic DDR3 8GB 1600MHZ Desktop RAM	netac-basic-ddr3-8gb-1600mhz-desktop-ram	RAM-NETAC-BASIC-DDR3-8GB-1600MHZ	\N	Netac Basic DDR3 8GB 1600MHZ Desktop RAM - fill your own short pitch before publish.	2800.00	3900.00	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs26000qnjjlhrbbplxh	Buy Netac Basic DDR3 8GB 1600MHZ Desktop RAM in Bangladesh | LogicBay BD	Netac Basic DDR3 8GB 1600MHZ Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, netac, ddr3, 8gb, 1600 mhz	f	t	2026-09-18 09:23:54.616	2026-09-18 09:23:54.616	2026-09-18 09:23:54.614
cmu6r4gaw003ueqewgaku1jo7	OCPC X3 RGB DDR4 3200MHz 8GB Desktop RAM	ocpc-x3-rgb-ddr4-3200mhz-8gb-desktop-ram	RAM-OCPC-X3-RGB-DDR4-3200MHZ-8GB	\N	OCPC X3 RGB DDR4 3200MHz 8GB Desktop RAM - fill your own short pitch before publish.	7900.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs1t000hnjjllhkj3m9h	Buy OCPC X3 RGB DDR4 3200MHz 8GB Desktop RAM in Bangladesh | LogicBay BD	OCPC X3 RGB DDR4 3200MHz 8GB Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, ocpc, ddr4, 8gb, 3200 mhz	f	t	2026-09-18 09:23:54.632	2026-09-18 09:23:54.632	2026-09-18 09:23:54.63
cmu6r4gbd0047eqewx63iixqf	AITC Kingsman Innovator 8GB DDR4 3200MHz Desktop RAM Black	aitc-kingsman-innovator-8gb-ddr4-3200mhz-desktop-ram-black	RAM-AITC-KINGSMAN-INNOVATOR-8GB-DDR4-3200MHZ	\N	AITC Kingsman Innovator 8GB DDR4 3200MHz Desktop RAM Black - fill your own short pitch before publish.	7500.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs1w000jnjjl4karmtf7	Buy AITC Kingsman Innovator 8GB DDR4 3200MHz Desktop RAM Black in Bangladesh | LogicBay BD	AITC Kingsman Innovator 8GB DDR4 3200MHz Desktop RAM Black. Check price and warranty at LogicBay BD.	desktop ram, aitc, ddr4, 8gb, 3200 mhz	f	t	2026-09-18 09:23:54.65	2026-09-18 09:23:54.65	2026-09-18 09:23:54.648
cmu6r4gbu004jeqewdasszspy	Kimtigo WOLFRINE 8GB 3200MHz DDR4 UDIMM Desktop RAM White	kimtigo-wolfrine-8gb-3200mhz-ddr4-udimm-desktop-ram-white	RAM-KIMTIGO-WOLFRINE-8GB-3200MHZ-DDR4-UDIMM-	\N	Kimtigo WOLFRINE 8GB 3200MHz DDR4 UDIMM Desktop RAM White - fill your own short pitch before publish.	6000.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs2w0017njjlb0niwu01	Buy Kimtigo WOLFRINE 8GB 3200MHz DDR4 UDIMM Desktop RAM White in Bangladesh | LogicBay BD	Kimtigo WOLFRINE 8GB 3200MHz DDR4 UDIMM Desktop RAM White. Check price and warranty at LogicBay BD.	desktop ram, kimtigo, ddr4, 8gb, 3200 mhz	f	t	2026-09-18 09:23:54.666	2026-09-18 09:23:54.666	2026-09-18 09:23:54.665
cmu6r4gdo005ueqewevlonqz0	Lexar 16GB DDR4 3200Mhz Desktop RAM	lexar-16gb-ddr4-3200mhz-desktop-ram	RAM-LEXAR-16GB-DDR4-3200MHZ	\N	Lexar 16GB DDR4 3200Mhz Desktop RAM - fill your own short pitch before publish.	18800.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs1l000cnjjlf6abi45d	Buy Lexar 16GB DDR4 3200Mhz Desktop RAM in Bangladesh | LogicBay BD	Lexar 16GB DDR4 3200Mhz Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, lexar, ddr4, 16gb, 3200 mhz	f	t	2026-09-18 09:23:54.733	2026-09-18 09:23:54.733	2026-09-18 09:23:54.731
cmu6r4ge60065eqewddtcjcqs	PNY XLR8 RGB 16GB DDR4 3200MHz Desktop RAM White	pny-xlr8-rgb-16gb-ddr4-3200mhz-desktop-ram-white	RAM-PNY-XLR8-RGB-16GB-DDR4-3200MHZ-WHITE	\N	PNY XLR8 RGB 16GB DDR4 3200MHz Desktop RAM White - fill your own short pitch before publish.	16500.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs27000rnjjlpj0622kg	Buy PNY XLR8 RGB 16GB DDR4 3200MHz Desktop RAM White in Bangladesh | LogicBay BD	PNY XLR8 RGB 16GB DDR4 3200MHz Desktop RAM White. Check price and warranty at LogicBay BD.	desktop ram, pny, ddr4, 16gb, 3200 mhz	f	t	2026-09-18 09:23:54.751	2026-09-18 09:23:54.751	2026-09-18 09:23:54.749
cmu6r4geo006jeqew6cc81d02	Kingston FURY Beast 16GB 3200MHz DDR4 Desktop RAM	kingston-fury-beast-16gb-3200mhz-ddr4-desktop-ram	RAM-KINGSTON-FURY-BEAST-16GB-3200MHZ-DDR4	\N	Kingston FURY Beast 16GB 3200MHz DDR4 Desktop RAM - fill your own short pitch before publish.	16500.00	18300.00	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs1c0007njjliydjdegy	Buy Kingston FURY Beast 16GB 3200MHz DDR4 Desktop RAM in Bangladesh | LogicBay BD	Kingston FURY Beast 16GB 3200MHz DDR4 Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, kingston, ddr4, 16gb, 3200 mhz	f	t	2026-09-18 09:23:54.768	2026-09-18 09:23:54.768	2026-09-18 09:23:54.767
cmu6r4gf2006ueqewbz1ejqzu	CORSAIR Vengeance RGB PRO SL 8GB DDR4 3200MHz Desktop RAM	corsair-vengeance-rgb-pro-sl-8gb-ddr4-3200mhz-desktop-ram	RAM-CORSAIR-VENGEANCE-RGB-PRO-SL-8GB-DDR4-32	\N	CORSAIR Vengeance RGB PRO SL 8GB DDR4 3200MHz Desktop RAM - fill your own short pitch before publish.	9900.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs190006njjl0etcmten	Buy CORSAIR Vengeance RGB PRO SL 8GB DDR4 3200MHz Desktop RAM in Bangladesh | LogicBay BD	CORSAIR Vengeance RGB PRO SL 8GB DDR4 3200MHz Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, corsair, ddr4, 8gb, 3200 mhz	f	t	2026-09-18 09:23:54.783	2026-09-18 09:23:54.783	2026-09-18 09:23:54.781
cmu6r4gfi0077eqewdbl8c9xu	G.SKILL Value 8GB DDR4 2666Mhz Desktop RAM	g-skill-value-8gb-ddr4-2666mhz-desktop-ram	RAM-GSKILL-G-SKILL-VALUE-8GB-DDR4-2666MHZ	\N	G.SKILL Value 8GB DDR4 2666Mhz Desktop RAM - fill your own short pitch before publish.	7000.00	7500.00	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmrethhjc0007vdfbun9quctm	Buy G.SKILL Value 8GB DDR4 2666Mhz Desktop RAM in Bangladesh | LogicBay BD	G.SKILL Value 8GB DDR4 2666Mhz Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, g-skill, ddr4, 8gb, 2666 mhz	f	t	2026-09-18 09:23:54.799	2026-09-18 09:23:54.799	2026-09-18 09:23:54.797
cmu6r4gfz007ieqewbuc34a6w	Team T-CREATE EXPERT 8GB DDR4 3200MHz Desktop RAM	team-t-create-expert-8gb-ddr4-3200mhz-desktop-ram	RAM-TEAM-T-CREATE-EXPERT-8GB-DDR4-3200MHZ	\N	Team T-CREATE EXPERT 8GB DDR4 3200MHz Desktop RAM - fill your own short pitch before publish.	8800.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs1e0008njjldd9yn8gy	Buy Team T-CREATE EXPERT 8GB DDR4 3200MHz Desktop RAM in Bangladesh | LogicBay BD	Team T-CREATE EXPERT 8GB DDR4 3200MHz Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, team, ddr4, 8gb, 3200 mhz	f	t	2026-09-18 09:23:54.815	2026-09-18 09:23:54.815	2026-09-18 09:23:54.813
cmu6r4ggd007teqewzvz4a4qp	PNY XLR8 Gaming RGB 16GB DDR5 6000MHz CL36 Desktop RAM	pny-xlr8-gaming-rgb-16gb-ddr5-6000mhz-cl36-desktop-ram	RAM-PNY-XLR8-GAMING-RGB-16GB-DDR5-6000MHZ-CL	\N	PNY XLR8 Gaming RGB 16GB DDR5 6000MHz CL36 Desktop RAM - fill your own short pitch before publish.	28000.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs27000rnjjlpj0622kg	Buy PNY XLR8 Gaming RGB 16GB DDR5 6000MHz CL36 Desktop RAM in Bangladesh | LogicBay BD	PNY XLR8 Gaming RGB 16GB DDR5 6000MHz CL36 Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, pny, ddr5, 16gb, 6000 mhz	f	t	2026-09-18 09:23:54.83	2026-09-18 09:23:54.83	2026-09-18 09:23:54.828
cmu6r4ggu0086eqewkiv8jjjh	Twinmos 8GB DDR4 2400MHz Desktop RAM	twinmos-8gb-ddr4-2400mhz-desktop-ram	RAM-TWINMOS-8GB-DDR4-2400MHZ	\N	Twinmos 8GB DDR4 2400MHz Desktop RAM - fill your own short pitch before publish.	3000.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs29000snjjlcu8q19no	Buy Twinmos 8GB DDR4 2400MHz Desktop RAM in Bangladesh | LogicBay BD	Twinmos 8GB DDR4 2400MHz Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, twinmos, ddr4, 8gb, 2400 mhz	f	t	2026-09-18 09:23:54.846	2026-09-18 09:23:54.846	2026-09-18 09:23:54.844
cmu6r4gha008heqewo62vh99s	Netac Basic 4GB DDR4 2666MHZ Desktop RAM	netac-basic-4gb-ddr4-2666mhz-desktop-ram	RAM-NETAC-BASIC-4GB-DDR4-2666MHZ	\N	Netac Basic 4GB DDR4 2666MHZ Desktop RAM - fill your own short pitch before publish.	3900.00	3950.00	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs26000qnjjlhrbbplxh	Buy Netac Basic 4GB DDR4 2666MHZ Desktop RAM in Bangladesh | LogicBay BD	Netac Basic 4GB DDR4 2666MHZ Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, netac, ddr4, 4gb, 2666 mhz	f	t	2026-09-18 09:23:54.862	2026-09-18 09:23:54.862	2026-09-18 09:23:54.86
cmu6r4ghr008seqew1uadyrx8	OCPC X3 RGB DDR4 3200MHz 8GB Desktop RAM White	ocpc-x3-rgb-ddr4-3200mhz-8gb-desktop-ram-white	RAM-OCPC-X3-RGB-DDR4-3200MHZ-8GB-WHITE	\N	OCPC X3 RGB DDR4 3200MHz 8GB Desktop RAM White - fill your own short pitch before publish.	7900.00	8200.00	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs1t000hnjjllhkj3m9h	Buy OCPC X3 RGB DDR4 3200MHz 8GB Desktop RAM White in Bangladesh | LogicBay BD	OCPC X3 RGB DDR4 3200MHz 8GB Desktop RAM White. Check price and warranty at LogicBay BD.	desktop ram, ocpc, ddr4, 8gb, 3200 mhz	f	t	2026-09-18 09:23:54.88	2026-09-18 09:23:54.88	2026-09-18 09:23:54.878
cmu6r4gia0096eqew48z4sl8h	AITC Kingsman RGB 8GB DDR4 3200MHz Gaming Desktop RAM	aitc-kingsman-rgb-8gb-ddr4-3200mhz-gaming-desktop-ram	RAM-AITC-KINGSMAN-RGB-8GB-DDR4-3200MHZ-GAMIN	\N	AITC Kingsman RGB 8GB DDR4 3200MHz Gaming Desktop RAM - fill your own short pitch before publish.	8800.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs1w000jnjjl4karmtf7	Buy AITC Kingsman RGB 8GB DDR4 3200MHz Gaming Desktop RAM in Bangladesh | LogicBay BD	AITC Kingsman RGB 8GB DDR4 3200MHz Gaming Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, aitc, ddr4, 8gb, 3200 mhz	f	t	2026-09-18 09:23:54.898	2026-09-18 09:23:54.898	2026-09-18 09:23:54.897
cmu6r4giv009jeqewwv6hvpgl	Kimtigo WOLFRINE 16GB 3200MHz DDR4 UDIMM Desktop RAM White	kimtigo-wolfrine-16gb-3200mhz-ddr4-udimm-desktop-ram-white	RAM-KIMTIGO-WOLFRINE-16GB-3200MHZ-DDR4-UDIMM	\N	Kimtigo WOLFRINE 16GB 3200MHz DDR4 UDIMM Desktop RAM White - fill your own short pitch before publish.	12500.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs2w0017njjlb0niwu01	Buy Kimtigo WOLFRINE 16GB 3200MHz DDR4 UDIMM Desktop RAM White in Bangladesh | LogicBay BD	Kimtigo WOLFRINE 16GB 3200MHz DDR4 UDIMM Desktop RAM White. Check price and warranty at LogicBay BD.	desktop ram, kimtigo, ddr4, 16gb, 3200 mhz	f	t	2026-09-18 09:23:54.919	2026-09-18 09:23:54.919	2026-09-18 09:23:54.917
cmu6r4gje009veqewqm14yift	Colorful CVN Guardian 8GB DDR4 3200MHz RGB Desktop RAM	colorful-cvn-guardian-8gb-ddr4-3200mhz-rgb-desktop-ram	RAM-COLORFUL-CVN-GUARDIAN-8GB-DDR4-3200MHZ-R	\N	Colorful CVN Guardian 8GB DDR4 3200MHz RGB Desktop RAM - fill your own short pitch before publish.	3000.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs24000onjjll00hq9a9	Buy Colorful CVN Guardian 8GB DDR4 3200MHz RGB Desktop RAM in Bangladesh | LogicBay BD	Colorful CVN Guardian 8GB DDR4 3200MHz RGB Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, colorful, ddr4, 8gb, 3200 mhz	f	t	2026-09-18 09:23:54.939	2026-09-18 09:23:54.939	2026-09-18 09:23:54.937
cmu6r4gjv00a8eqewlxe2djxh	OSCOO Warrior E500 32GB DDR5 5200MHz CL36 Desktop RAM	oscoo-warrior-e500-32gb-ddr5-5200mhz-cl36-desktop-ram	RAM-OSCOO-WARRIOR-E500-32GB-DDR5-5200MHZ-CL3	\N	OSCOO Warrior E500 32GB DDR5 5200MHz CL36 Desktop RAM - fill your own short pitch before publish.	53000.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs1k000bnjjl4cavdy9l	Buy OSCOO Warrior E500 32GB DDR5 5200MHz CL36 Desktop RAM in Bangladesh | LogicBay BD	OSCOO Warrior E500 32GB DDR5 5200MHz CL36 Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, oscoo, ddr5, 32gb, 5200 mhz	f	t	2026-09-18 09:23:54.955	2026-09-18 09:23:54.955	2026-09-18 09:23:54.954
cmu6r4gk800ajeqewqntcnzam	KingBank KJXB 16GB DDR4 3200MHz Desktop RAM	kingbank-kjxb-16gb-ddr4-3200mhz-desktop-ram	RAM-KINGBANK-KJXB-16GB-DDR4-3200MHZ	\N	KingBank KJXB 16GB DDR4 3200MHz Desktop RAM - fill your own short pitch before publish.	12700.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs38001fnjjly085bwns	Buy KingBank KJXB 16GB DDR4 3200MHz Desktop RAM in Bangladesh | LogicBay BD	KingBank KJXB 16GB DDR4 3200MHz Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, kingbank, ddr4, 16gb, 3200 mhz	f	t	2026-09-18 09:23:54.969	2026-09-18 09:23:54.969	2026-09-18 09:23:54.967
cmrdav7iw0002gb3wq5ky2u80	MSI PRO H610M-E DDR4 mATX Motherboard	msi-pro-h610m-e-ddr4-matx-motherboard	MSI-PRO-H610M-E-DDR4	MSI PRO H610M-E DDR4 is a Micro-ATX motherboard for Intel 12th–14th Gen LGA1700 CPUs. It uses the Intel H610 chipset, two DDR4 DIMMs up to 64GB, one M.2 slot, HDMI + VGA display outputs, and Realtek ALC897 audio. Suited for office and budget builds.	Entry mATX H610 board for LGA1700 with DDR4 dual-channel memory.	9900.00	10000.00	9800.00	IN_STOCK	12	5	cmr9bvs3f001hnjjl01z95nzo	cmrdanvpu001g11pzvc3or0hz	Buy MSI PRO H610M-E DDR4 mATX Motherboard in Bangladesh | LogicBay BD	MSI PRO H610M-E DDR4 mATX Motherboard — Intel H610, DDR4, Micro ATX. Price ৳11500. Warranty 3 Years.	motherboard, msi-intel, Intel H610, DDR4, LogicBay BD	f	t	2026-07-09 09:24:05.72	2026-09-18 09:44:30.83	2026-07-09 09:24:05.716
cmu6pynhp002214lfh21ky430	MSI PRO H610M-G DDR4 Micro-ATX Motherboard	msi-pro-h610m-g-ddr4-micro-atx-motherboard	MB-MSI-PRO-H610M-G	MSI PRO H610M-G DDR4 supports Intel LGA1700 processors with H610 chipset and dual-channel DDR4 (up to 64GB). Extra rear video ports make it useful for multi-monitor office PCs. Includes M.2 storage and Realtek gigabit LAN.	H610 mATX with HDMI, DisplayPort and VGA for flexible displays.	10600.00	10900.00	10400.00	IN_STOCK	10	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvpu001g11pzvc3or0hz	Buy MSI PRO H610M-G DDR4 Micro-ATX Motherboard in Bangladesh | LogicBay BD	MSI PRO H610M-G DDR4 Micro-ATX Motherboard — Intel H610, DDR4, Micro ATX. Price ৳12200. Warranty 3 Years.	motherboard, msi-intel, Intel H610, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.397	2026-09-18 09:44:30.856	2026-09-18 08:51:24.393
cmu6pynog005y14lf22i6m8d1	ASUS PRIME H610M-F D4 R2.0 DDR4 LGA1700 mATX Motherboard	asus-prime-h610m-f-d4-r2-0-ddr4-lga1700-matx-motherboard	MB-ASUS-PRIME-H610M-F-D4-R2-0-LGA1700	ASUS PRIME H610M-F D4 R2.0 is a compact H610 motherboard for 12th–14th Gen Intel CPUs with DDR4 memory, M.2 SSD, and HDMI/VGA outputs for everyday LogicBay systems.	ASUS PRIME H610M-F D4 R2.0 for LGA1700 DDR4 builds.	10300.00	10500.00	9600.00	IN_STOCK	10	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvq9001k11pz2gprvud2	Buy ASUS PRIME H610M-F D4 R2.0 DDR4 LGA1700 mATX Motherboard in Bangladesh | LogicBay BD	ASUS PRIME H610M-F D4 R2.0 DDR4 LGA1700 mATX Motherboard — Intel H610, DDR4, Micro ATX. Price ৳11200. Warranty 3 Years.	motherboard, asus-intel, Intel H610, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.641	2026-09-18 09:44:31.012	2026-09-18 08:51:24.639
cmu6pynpq007214lfxnazof8b	ASUS PRIME H610M-R DDR5 LGA1700 mATX Motherboard	asus-prime-h610m-r-ddr5-lga1700-matx-motherboard	MB-ASUS-PRIME-H610M-R-LGA1700	ASUS PRIME H610M-R DDR5 brings dual-channel DDR5 to the H610 platform for Intel 12th–14th Gen CPUs, with M.2 storage and multi-display rear I/O in a Micro-ATX footprint.	ASUS PRIME H610M-R DDR5 Micro-ATX for LGA1700.	11450.00	\N	11600.00	IN_STOCK	7	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvq9001k11pz2gprvud2	Buy ASUS PRIME H610M-R DDR5 LGA1700 mATX Motherboard in Bangladesh | LogicBay BD	ASUS PRIME H610M-R DDR5 LGA1700 mATX Motherboard — Intel H610, DDR5, Micro ATX. Price ৳13500. Warranty 3 Years.	motherboard, asus-intel, Intel H610, DDR5, LogicBay BD	f	t	2026-09-18 08:51:24.686	2026-09-18 09:44:31.059	2026-09-18 08:51:24.684
cmu6pynvi00c214lfh2lvojue	ASROCK H610M-H2/M.2 14th, 13th and 12th Gen mATX DDR5 Motherboard	asrock-h610m-h2-m-2-14th-13th-and-12th-gen-matx-ddr5-motherboard	MB-ASROCK-H610M-H2-M-2-14TH-13TH-AND-12TH-GEN	ASRock H610M-H2/M.2 is an H610 Micro-ATX board with DDR5 memory support for Intel 12th–14th Gen LGA1700 CPUs, dedicated M.2 storage, and HDMI/VGA display outputs.	ASRock H610M-H2/M.2 DDR5 for 12th–14th Gen Intel.	9100.00	\N	11300.00	IN_STOCK	8	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvq8001i11pzh84wiqng	Buy ASROCK H610M-H2/M.2 14th, 13th and 12th Gen mATX DDR5 Motherboard in Bangladesh | LogicBay BD	ASROCK H610M-H2/M.2 14th, 13th and 12th Gen mATX DDR5 Motherboard — Intel H610, DDR5, Micro ATX. Price ৳13200. Warranty 3 Years.	motherboard, asrock-intel, Intel H610, DDR5, LogicBay BD	f	t	2026-09-18 08:51:24.894	2026-09-18 09:44:31.093	2026-09-18 08:51:24.892
cmu6pynw400cm14lf0ve7ekcp	Colorful BATTLE-AX H610M-E WIFI V20 mATX Motherboard	colorful-battle-ax-h610m-e-wifi-v20-matx-motherboard	MB-COLORFUL-BATTLE-AX-H610M-E-V20	Colorful BATTLE-AX H610M-E WIFI V20 is an H610 Micro-ATX motherboard for LGA1700 Intel CPUs with DDR4 memory, M.2 storage, HDMI/VGA, and onboard Wi-Fi for cable-free office setups.	Colorful BATTLE-AX H610M-E WIFI with wireless networking.	10200.00	\N	12400.00	IN_STOCK	6	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvqc001o11pzgpmnlomv	Buy Colorful BATTLE-AX H610M-E WIFI V20 mATX Motherboard in Bangladesh | LogicBay BD	Colorful BATTLE-AX H610M-E WIFI V20 mATX Motherboard — Intel H610, DDR4, Micro ATX. Price ৳14500. Warranty 3 Years.	motherboard, colorful-intel, Intel H610, DDR4, LogicBay BD	f	t	2026-09-18 08:51:24.916	2026-09-18 09:44:31.097	2026-09-18 08:51:24.914
cmu6pynyt00eu14lf8kemzt70	ASUS PRIME H510M-K R2.0 10th and 11th Gen Micro-ATX Motherboard	asus-prime-h510m-k-r2-0-10th-and-11th-gen-micro-atx-motherboard	MB-ASUS-PRIME-H510M-K-R2-0-10TH-AND-11TH-GEN	ASUS PRIME H510M-K R2.0 is an H510 Micro-ATX board for Intel 10th and 11th Gen LGA1200 processors with DDR4 dual-channel memory, M.2 storage, and HDMI/VGA video.	PRIME H510M-K R2.0 for 10th/11th Gen LGA1200 CPUs.	10700.00	\N	8800.00	IN_STOCK	9	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvq9001k11pz2gprvud2	Buy ASUS PRIME H510M-K R2.0 10th and 11th Gen Micro-ATX Motherboard in Bangladesh | LogicBay BD	ASUS PRIME H510M-K R2.0 10th and 11th Gen Micro-ATX Motherboard — Intel H510, DDR4, Micro ATX. Price ৳10200. Warranty 3 Years.	motherboard, asus-intel, Intel H510, DDR4, LogicBay BD	f	t	2026-09-18 08:51:25.013	2026-09-18 09:44:31.121	2026-09-18 08:51:25.011
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: specification_definitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.specification_definitions (id, "categoryId", name, key, "dataType", unit, "isFilterable", "isRequired", "order", "createdAt", "updatedAt") FROM stdin;
cmr9fdu2p0009znc81h27hava	cmr9bvs3p001qnjjlnzrmtdrs	Memory Bus (Bit)	memory_bus	SELECT	\N	f	f	5	2026-07-06 16:19:28.513	2026-09-04 15:57:49.373
cmr9fdu2q000bznc8nqnk6n3y	cmr9bvs3p001qnjjlnzrmtdrs	Max Resolution	resolution	TEXT	\N	t	f	6	2026-07-06 16:19:28.515	2026-09-04 15:57:49.375
cmr9fdu2s000dznc862mxbzdr	cmr9bvs3p001qnjjlnzrmtdrs	Multi Display	multi_display	NUMBER	\N	f	f	7	2026-07-06 16:19:28.516	2026-09-04 15:57:49.378
cmr9fdu2x000jznc8fy1302of	cmr9bvs3p001qnjjlnzrmtdrs	Interface (PCI Express)	pci_express	SELECT	\N	f	f	11	2026-07-06 16:19:28.521	2026-09-04 15:57:49.385
cmr9fdu2z000lznc8a23p949m	cmr9bvs3p001qnjjlnzrmtdrs	DirectX	directx	SELECT	\N	f	f	12	2026-07-06 16:19:28.523	2026-09-04 15:57:49.388
cmr9fdu31000pznc8qjtoyzrk	cmr9bvs3p001qnjjlnzrmtdrs	Recommended Power	recommended_psu	TEXT	\N	f	f	15	2026-07-06 16:19:28.526	2026-09-04 15:57:49.393
cmr9fdu33000rznc8knkdzgst	cmr9bvs3p001qnjjlnzrmtdrs	DisplayPort Detail	display_port	TEXT	\N	f	f	19	2026-07-06 16:19:28.527	2026-09-04 15:57:49.399
cmr9fdu35000vznc86eleam5x	cmr9bvs3p001qnjjlnzrmtdrs	HDMI Detail	hdmi	TEXT	\N	f	f	20	2026-07-06 16:19:28.53	2026-09-04 15:57:49.401
cmr9fdu38000zznc8rwpfa7k5	cmr9bvs3p001qnjjlnzrmtdrs	Warranty	warranty	TEXT	\N	f	f	22	2026-07-06 16:19:28.532	2026-09-04 15:57:49.403
cmr9bvs9f003tnjjl91abqfrv	cmr9bvs3u001wnjjl81hph6nx	Capacity	capacity	SELECT	GB	t	t	1	2026-07-06 14:41:27.508	2026-09-04 16:36:47.821
cmr9bvs9f003unjjlakeb3cd1	cmr9bvs3u001wnjjl81hph6nx	Interface	interface	SELECT	\N	t	t	2	2026-07-06 14:41:27.508	2026-09-04 16:36:47.825
cmr9bvs9f003snjjldgshk08i	cmr9bvs3u001wnjjl81hph6nx	Read Speed	read_speed	SELECT	MB/s	t	f	7	2026-07-06 14:41:27.508	2026-09-04 16:36:47.839
cmr9bvs69002enjjlzzee8gs4	cmr9bvs3l001mnjjlqu2ps65y	Model Number	model_number	TEXT	\N	f	t	2	2026-07-06 14:41:27.311	2026-09-15 13:19:15.492
cmr9bvs3z0028njjl78cbu80i	cmr9bvs3l001mnjjlqu2ps65y	Number of Cores	number_of_cores	SELECT	\N	f	t	3	2026-07-06 14:41:27.31	2026-09-15 13:19:15.493
cmr9bvs3y0027njjlmnphc78d	cmr9bvs3l001mnjjlqu2ps65y	Number of Threads	number_of_threads	SELECT	\N	f	t	4	2026-07-06 14:41:27.31	2026-09-15 13:19:15.494
cmr9bvs3y0026njjlozqqv8z0	cmr9bvs3l001mnjjlqu2ps65y	Base Clock Speed	base_clock	NUMBER	GHz	f	t	5	2026-07-06 14:41:27.31	2026-09-15 13:19:15.494
cmr9bvs3y0024njjl9e3ah51v	cmr9bvs3l001mnjjlqu2ps65y	Boost/Turbo Clock Speed	boost_clock	NUMBER	GHz	f	t	6	2026-07-06 14:41:27.31	2026-09-15 13:19:15.495
cmr9bvs3y0023njjljhlzuud0	cmr9bvs3l001mnjjlqu2ps65y	Socket Type	socket_type	SELECT	\N	f	t	7	2026-07-06 14:41:27.31	2026-09-15 13:19:15.496
cmr9bvs6f002hnjjl1x3olffk	cmr9bvs3l001mnjjlqu2ps65y	Generation/Series	generation	SELECT	\N	f	t	8	2026-07-06 14:41:27.311	2026-09-15 13:19:15.498
cmr9bvs6g002injjlwouuh804	cmr9bvs3l001mnjjlqu2ps65y	Total Cache (L3)	cache_size	SELECT	\N	f	f	9	2026-07-06 14:41:27.311	2026-09-15 13:19:15.499
cmr9bvs5i002anjjlcuk2lj5u	cmr9bvs3l001mnjjlqu2ps65y	TDP (Thermal Design Power)	tdp	SELECT	\N	f	t	11	2026-07-06 14:41:27.311	2026-09-15 13:19:15.501
cmr9bvs64002cnjjl2ip49dn5	cmr9bvs3l001mnjjlqu2ps65y	Integrated Graphics	integrated_graphics	SELECT	\N	f	f	12	2026-07-06 14:41:27.311	2026-09-15 13:19:15.502
cmr9bvs6x002onjjln15z5srx	cmr9bvs3l001mnjjlqu2ps65y	Memory Type Support	memory_type	SELECT	\N	f	f	13	2026-07-06 14:41:27.311	2026-09-15 13:19:15.502
cmr9bvs6i002knjjlemi601rt	cmr9bvs3l001mnjjlqu2ps65y	Max Memory Speed	max_memory_speed	SELECT	\N	f	f	14	2026-07-06 14:41:27.311	2026-09-15 13:19:15.503
cmr9bvs91002qnjjlspy1ptf2	cmr9bvs3l001mnjjlqu2ps65y	Max Memory Size	max_memory_size	TEXT	\N	f	f	15	2026-07-06 14:41:27.311	2026-09-15 13:19:15.504
cmr9bvs970032njjll06wzb1c	cmr9bvs3n001onjjl46q890qi	Processor Model/Series	processor_model	SELECT	\N	f	t	1	2026-07-06 14:41:27.499	2026-09-15 13:19:15.513
cmr9bvs97003anjjly8pgyejf	cmr9bvs3n001onjjl46q890qi	Model Number	model_number	TEXT	\N	f	t	2	2026-07-06 14:41:27.499	2026-09-15 13:19:15.514
cmr9bvs97002unjjlkze12d8e	cmr9bvs3n001onjjl46q890qi	Number of Cores	number_of_cores	SELECT	\N	f	t	3	2026-07-06 14:41:27.499	2026-09-15 13:19:15.515
cmr9bvs97003cnjjlsdpfrbzc	cmr9bvs3n001onjjl46q890qi	Number of Threads	number_of_threads	SELECT	\N	f	t	4	2026-07-06 14:41:27.499	2026-09-15 13:19:15.517
cmr9bvs97002xnjjlbgm11wr2	cmr9bvs3n001onjjl46q890qi	Base Clock Speed	base_clock	NUMBER	GHz	f	t	5	2026-07-06 14:41:27.499	2026-09-15 13:19:15.518
cmr9bvs970038njjlxvru0024	cmr9bvs3n001onjjl46q890qi	Boost/Turbo Clock Speed	boost_clock	NUMBER	GHz	f	t	6	2026-07-06 14:41:27.499	2026-09-15 13:19:15.52
cmr9bvs97002vnjjluf76j46i	cmr9bvs3n001onjjl46q890qi	Socket Type	socket_type	SELECT	\N	f	t	7	2026-07-06 14:41:27.499	2026-09-15 13:19:15.521
cmr9bvs970039njjl7x3qpa9y	cmr9bvs3n001onjjl46q890qi	Generation/Series	generation	SELECT	\N	f	t	8	2026-07-06 14:41:27.499	2026-09-15 13:19:15.522
cmr9bvs970031njjlxjwmui6s	cmr9bvs3n001onjjl46q890qi	TDP (Thermal Design Power)	tdp	SELECT	\N	f	t	11	2026-07-06 14:41:27.499	2026-09-15 13:19:15.524
cmr9bvs98003fnjjl9qgz7y19	cmr9bvs3n001onjjl46q890qi	Integrated Graphics	integrated_graphics	SELECT	\N	f	f	12	2026-07-06 14:41:27.5	2026-09-15 13:19:15.525
cmr9bvs970034njjlup59w81g	cmr9bvs3n001onjjl46q890qi	Memory Type Support	memory_type	SELECT	\N	f	f	13	2026-07-06 14:41:27.499	2026-09-15 13:19:15.526
cmr9bvs970035njjlw0stdb9f	cmr9bvs3n001onjjl46q890qi	Max Memory Speed	max_memory_speed	SELECT	\N	f	f	14	2026-07-06 14:41:27.499	2026-09-15 13:19:15.528
cmr9bvs98003gnjjlh7t4qtax	cmr9bvs3n001onjjl46q890qi	Max Memory Size	max_memory_size	TEXT	\N	f	f	15	2026-07-06 14:41:27.5	2026-09-15 13:19:15.529
cmr9bvs6u002mnjjl4mw9r2r4	cmr9bvs3l001mnjjlqu2ps65y	Processor Model/Series	processor_model	SELECT	\N	f	t	1	2026-07-06 14:41:27.311	2026-09-15 13:19:15.491
cmrdbq1240009ohnke7w7x7qr	cmrdawgoj0001t4sx2iu7z3q7	Chipset	chipset	TEXT	\N	t	t	2	2026-07-09 09:48:03.676	2026-09-18 08:51:24.309
cmrdbq125000bohnkdjs3ioav	cmrdawgoj0001t4sx2iu7z3q7	Memory Size	memory_size	TEXT	\N	t	f	3	2026-07-09 09:48:03.677	2026-09-18 08:51:24.311
cmrdbq126000dohnkyh4cc6y4	cmrdawgoj0001t4sx2iu7z3q7	Memory Type	memory_type	TEXT	\N	t	f	4	2026-07-09 09:48:03.678	2026-09-18 08:51:24.313
cmrdbq128000fohnkysdr9lw3	cmrdawgoj0001t4sx2iu7z3q7	Storage Slots	storage_slots	TEXT	\N	f	f	5	2026-07-09 09:48:03.68	2026-09-18 08:51:24.314
cmrdbq12a000hohnkquglg65g	cmrdawgoj0001t4sx2iu7z3q7	Graphics	graphics	TEXT	\N	f	f	6	2026-07-09 09:48:03.682	2026-09-18 08:51:24.315
cmrdbq12b000johnkv89j042x	cmrdawgoj0001t4sx2iu7z3q7	Audio	audio	TEXT	\N	f	f	7	2026-07-09 09:48:03.683	2026-09-18 08:51:24.316
cmrdbq12d000nohnkureeaott	cmrdawgoj0001t4sx2iu7z3q7	Special Features	special_features	TEXT	\N	f	f	9	2026-07-09 09:48:03.685	2026-09-18 08:51:24.318
cmrdbq12e000pohnkz08yh08x	cmrdawgoj0001t4sx2iu7z3q7	Form Factor	form_factor	TEXT	\N	t	f	10	2026-07-09 09:48:03.686	2026-09-18 08:51:24.318
cmrdbq12f000rohnk2hwsyl63	cmrdawgoj0001t4sx2iu7z3q7	Expansion Slots	expansion_slots	TEXT	\N	f	f	11	2026-07-09 09:48:03.687	2026-09-18 08:51:24.319
cmrdbq12g000tohnk1fyotn25	cmrdawgoj0001t4sx2iu7z3q7	Warranty	warranty	TEXT	\N	f	f	12	2026-07-09 09:48:03.688	2026-09-18 08:51:24.32
cmr9bvs9k003znjjlfy2zoou4	cmr9bvs3w001ynjjlz6a42lgs	Memory Type	memory_type	SELECT	\N	t	t	1	2026-07-06 14:41:27.512	2026-09-18 09:23:54.406
cmr9bvs9k003ynjjlu0sjqf2r	cmr9bvs3w001ynjjlz6a42lgs	Bus Speed	speed	SELECT	MHz	t	t	2	2026-07-06 14:41:27.512	2026-09-18 09:23:54.407
cmrethhjo000kvdfbi88phfex	cmr9bvs3w001ynjjlz6a42lgs	Latency	latency	TEXT	\N	f	f	3	2026-07-10 10:53:04.405	2026-09-18 09:23:54.408
cmr9bvs9k0040njjlyqse70bu	cmr9bvs3w001ynjjlz6a42lgs	Capacity	capacity	SELECT	GB	t	t	4	2026-07-06 14:41:27.512	2026-09-18 09:23:54.409
cmrethhjs000ovdfbyj3h2oyc	cmr9bvs3w001ynjjlz6a42lgs	Voltage	voltage	TEXT	\N	f	f	5	2026-07-10 10:53:04.409	2026-09-18 09:23:54.409
cmr9bvs9c003mnjjl66ggue09	cmr9bvs3p001qnjjlnzrmtdrs	Memory Size	memory_size	SELECT	GB	t	t	1	2026-07-06 14:41:27.505	2026-09-04 15:57:49.359
cmr9fdu2i0003znc8m0i2htvy	cmr9bvs3p001qnjjlnzrmtdrs	Bus Type	bus_type	TEXT	\N	f	f	2	2026-07-06 16:19:28.506	2026-09-04 15:57:49.366
cmr9bvs9c003nnjjldprfoq71	cmr9bvs3p001qnjjlnzrmtdrs	Memory Type	memory_type	SELECT	\N	t	t	3	2026-07-06 14:41:27.505	2026-09-04 15:57:49.369
cmr9fdu2m0007znc8kc698wgu	cmr9bvs3p001qnjjlnzrmtdrs	Memory Clock	memory_clock	TEXT	MHz	f	f	4	2026-07-06 16:19:28.511	2026-09-04 15:57:49.371
cmr9bvs9c003onjjl73rcf6jj	cmr9bvs3p001qnjjlnzrmtdrs	GPU Chipset	gpu_chipset	TEXT	\N	t	t	8	2026-07-06 14:41:27.505	2026-09-04 15:57:49.38
cmtn513np000h13qz5byviy69	cmr9bvs3p001qnjjlnzrmtdrs	Chipset Series	chipset_series	SELECT	\N	t	t	9	2026-09-04 15:57:49.381	2026-09-04 15:57:49.381
cmr9fdu2v000hznc8hqkuplm8	cmr9bvs3p001qnjjlnzrmtdrs	CUDA Cores (Nvidia)	cuda_cores	NUMBER	\N	f	f	10	2026-07-06 16:19:28.52	2026-09-04 15:57:49.384
cmr9fdu30000nznc8r71v4upj	cmr9bvs3p001qnjjlnzrmtdrs	OpenGL	opengl	SELECT	\N	f	f	13	2026-07-06 16:19:28.524	2026-09-04 15:57:49.39
cmtn513nz000r13qznt10k65u	cmr9bvs3p001qnjjlnzrmtdrs	No. of Fans	cooling_type	SELECT	\N	t	f	14	2026-09-04 15:57:49.391	2026-09-04 15:57:49.391
cmr9fdu34000tznc8rgc4pj4c	cmr9bvs3p001qnjjlnzrmtdrs	Power Connector	power_connector	SELECT	\N	f	f	16	2026-07-06 16:19:28.528	2026-09-04 15:57:49.394
cmtn513o3000x13qzmvkta77z	cmr9bvs3p001qnjjlnzrmtdrs	Types Of Ports	port_types	TEXT	\N	t	f	17	2026-09-04 15:57:49.396	2026-09-04 15:57:49.396
cmtn513o5000z13qznagqa6eu	cmr9bvs3p001qnjjlnzrmtdrs	No. of Ports	port_count	SELECT	\N	t	f	18	2026-09-04 15:57:49.398	2026-09-04 15:57:49.398
cmr9fdu37000xznc84up87zd7	cmr9bvs3p001qnjjlnzrmtdrs	Dimension	dimension	TEXT	\N	f	f	21	2026-07-06 16:19:28.531	2026-09-04 15:57:49.402
cmtn5tr270001djde0lojpsv0	cmrethhj40005vdfbnhhoj6ap	Memory Type	memory_type	SELECT	\N	t	t	1	2026-09-04 16:20:06.079	2026-09-04 16:20:06.079
cmtn5tr2a0003djdebwoggpvz	cmrethhj40005vdfbnhhoj6ap	Bus Speed	speed	SELECT	\N	t	t	2	2026-09-04 16:20:06.082	2026-09-04 16:20:06.082
cmtn5tr2c0005djdemxjn1u9g	cmrethhj40005vdfbnhhoj6ap	Latency	latency	TEXT	\N	f	f	3	2026-09-04 16:20:06.084	2026-09-04 16:20:06.084
cmtn5tr2d0007djdevbhwldu7	cmrethhj40005vdfbnhhoj6ap	Capacity	capacity	SELECT	\N	t	t	4	2026-09-04 16:20:06.086	2026-09-04 16:20:06.086
cmtn5tr2e0009djdeckbk6d7j	cmrethhj40005vdfbnhhoj6ap	Voltage	voltage	TEXT	\N	f	f	5	2026-09-04 16:20:06.087	2026-09-04 16:20:06.087
cmtn5tr2g000bdjde7nlk4nza	cmrethhj40005vdfbnhhoj6ap	Other Features	other_features	TEXT	\N	f	f	6	2026-09-04 16:20:06.088	2026-09-04 16:20:06.088
cmtn5tr2h000ddjde65624yx6	cmrethhj40005vdfbnhhoj6ap	Color	color	TEXT	\N	f	f	7	2026-09-04 16:20:06.089	2026-09-04 16:20:06.089
cmtn5tr2i000fdjdeuslz4bg0	cmrethhj40005vdfbnhhoj6ap	RAM Features	ram_features	SELECT	\N	t	f	8	2026-09-04 16:20:06.09	2026-09-04 16:20:06.09
cmtn5tr2j000hdjdeke3majo3	cmrethhj40005vdfbnhhoj6ap	Warranty	warranty	TEXT	\N	f	f	9	2026-09-04 16:20:06.091	2026-09-04 16:20:06.091
cmtn64tfp0003atz677eiroj1	cmtn64tfl0001atz6goiay309	Wattage	wattage	SELECT	\N	t	t	1	2026-09-04 16:28:42.373	2026-09-04 16:28:42.373
cmtn64tfs0005atz6yliou67j	cmtn64tfl0001atz6goiay309	Efficiency Rating	efficiency	SELECT	\N	t	t	2	2026-09-04 16:28:42.376	2026-09-04 16:28:42.376
cmtn64tfu0007atz6bppxzaak	cmtn64tfl0001atz6goiay309	Modular Type	modular_type	SELECT	\N	t	t	3	2026-09-04 16:28:42.378	2026-09-04 16:28:42.378
cmtn64tfw0009atz6v5a08kms	cmtn64tfl0001atz6goiay309	Form Factor	form_factor	SELECT	\N	t	t	4	2026-09-04 16:28:42.381	2026-09-04 16:28:42.381
cmtn64tfy000batz6yj2qj0ph	cmtn64tfl0001atz6goiay309	Connectors	connectors	TEXT	\N	f	f	5	2026-09-04 16:28:42.382	2026-09-04 16:28:42.382
cmtn64tg0000datz6l22ejo4s	cmtn64tfl0001atz6goiay309	Fan Size	fan_size	TEXT	\N	f	f	6	2026-09-04 16:28:42.384	2026-09-04 16:28:42.384
cmtn64tg1000fatz66e1ft9fk	cmtn64tfl0001atz6goiay309	Dimension	dimension	TEXT	\N	f	f	7	2026-09-04 16:28:42.386	2026-09-04 16:28:42.386
cmtn64tg4000hatz6lbsrftnu	cmtn64tfl0001atz6goiay309	Warranty	warranty	TEXT	\N	f	f	8	2026-09-04 16:28:42.388	2026-09-04 16:28:42.388
cmtn6f80i0005iyfrzsbne0od	cmr9bvs3u001wnjjl81hph6nx	Form Factor	form_factor	SELECT	\N	t	t	3	2026-09-04 16:36:47.827	2026-09-04 16:36:47.827
cmtn6f80l0007iyfrzz8i08r5	cmr9bvs3u001wnjjl81hph6nx	PCI-Express Generation	pcie_gen	SELECT	\N	t	f	4	2026-09-04 16:36:47.83	2026-09-04 16:36:47.83
cmtn6f80p0009iyfrv81zkasj	cmr9bvs3u001wnjjl81hph6nx	DRAM	dram	SELECT	\N	t	f	5	2026-09-04 16:36:47.833	2026-09-04 16:36:47.833
cmtn6f80r000biyfrjazwaafy	cmr9bvs3u001wnjjl81hph6nx	Technology	technology	SELECT	\N	t	f	6	2026-09-04 16:36:47.836	2026-09-04 16:36:47.836
cmtn6f80y000fiyfr9772d3uj	cmr9bvs3u001wnjjl81hph6nx	Write Speed	write_speed	SELECT	\N	t	f	8	2026-09-04 16:36:47.842	2026-09-04 16:36:47.842
cmtn6f810000hiyfr6ebjwour	cmr9bvs3u001wnjjl81hph6nx	Sequential Read Detail	sequential_read	TEXT	\N	f	f	9	2026-09-04 16:36:47.845	2026-09-04 16:36:47.845
cmtn6f812000jiyfrbrt2qv1f	cmr9bvs3u001wnjjl81hph6nx	Sequential Write Detail	sequential_write	TEXT	\N	f	f	10	2026-09-04 16:36:47.846	2026-09-04 16:36:47.846
cmtn6f813000liyfrjqq101qt	cmr9bvs3u001wnjjl81hph6nx	Warranty	warranty	TEXT	\N	f	f	11	2026-09-04 16:36:47.848	2026-09-04 16:36:47.848
cmtn6rmk80003s5vebv4as5gd	cmtn6rmk30001s5veqp939d88	Color	color	SELECT	\N	t	t	1	2026-09-04 16:46:26.552	2026-09-04 16:46:26.552
cmtn6rmkb0005s5vegf5twryl	cmtn6rmk30001s5veqp939d88	Type	case_type	SELECT	\N	t	t	2	2026-09-04 16:46:26.555	2026-09-04 16:46:26.555
cmtn6rmkd0007s5vesdoydggn	cmtn6rmk30001s5veqp939d88	Motherboard Type	motherboard_type	TEXT	\N	t	t	3	2026-09-04 16:46:26.557	2026-09-04 16:46:26.557
cmtn6rmke0009s5vea5kkq8a6	cmtn6rmk30001s5veqp939d88	Side Panel	side_panel	TEXT	\N	t	f	4	2026-09-04 16:46:26.559	2026-09-04 16:46:26.559
cmtn6rmkg000bs5vezy3j96nt	cmtn6rmk30001s5veqp939d88	Power Supply Included	psu_included	SELECT	\N	t	f	5	2026-09-04 16:46:26.56	2026-09-04 16:46:26.56
cmtn6rmki000ds5ve20lyb1fz	cmtn6rmk30001s5veqp939d88	Special Feature	special_features	TEXT	\N	t	f	6	2026-09-04 16:46:26.562	2026-09-04 16:46:26.562
cmtn6rmkk000fs5vetez8rjfm	cmtn6rmk30001s5veqp939d88	Dimension	dimension	TEXT	\N	f	f	7	2026-09-04 16:46:26.565	2026-09-04 16:46:26.565
cmtn6rmkm000hs5vei4znuse3	cmtn6rmk30001s5veqp939d88	Warranty	warranty	TEXT	\N	f	f	8	2026-09-04 16:46:26.566	2026-09-04 16:46:26.566
cmtn72kq30003gqqv9p7s8p83	cmtn72kpw0001gqqvt6fvuyzo	Processor Type	processor_type	TEXT	\N	t	t	1	2026-09-04 16:54:57.387	2026-09-04 16:54:57.387
cmtn72kq70005gqqvsp6fuw3h	cmtn72kpw0001gqqvt6fvuyzo	Sockets	socket	TEXT	\N	t	t	2	2026-09-04 16:54:57.391	2026-09-04 16:54:57.391
cmtn72kq90007gqqvr6qakno9	cmtn72kpw0001gqqvt6fvuyzo	Cooler Type	cooler_type	SELECT	\N	t	t	3	2026-09-04 16:54:57.393	2026-09-04 16:54:57.393
cmtn72kqc0009gqqvxqfcin39	cmtn72kpw0001gqqvt6fvuyzo	Fan Size	fan_size	TEXT	\N	t	f	4	2026-09-04 16:54:57.396	2026-09-04 16:54:57.396
cmtn72kqf000bgqqvucde0cy6	cmtn72kpw0001gqqvt6fvuyzo	Fan Speed	fan_speed	SELECT	\N	t	f	5	2026-09-04 16:54:57.4	2026-09-04 16:54:57.4
cmtn72kqi000dgqqvnk3jvsv6	cmtn72kpw0001gqqvt6fvuyzo	Special Features	special_features	TEXT	\N	t	f	6	2026-09-04 16:54:57.402	2026-09-04 16:54:57.402
cmtn72kqk000fgqqvshlpvefr	cmtn72kpw0001gqqvt6fvuyzo	Airflow	airflow	TEXT	\N	f	f	7	2026-09-04 16:54:57.405	2026-09-04 16:54:57.405
cmrethhju000svdfbr55ouxmj	cmr9bvs3w001ynjjlz6a42lgs	Color	color	TEXT	\N	f	f	7	2026-07-10 10:53:04.41	2026-09-18 09:23:54.411
cmrethhjv000uvdfbaxlp9ie1	cmr9bvs3w001ynjjlz6a42lgs	RAM Features	ram_features	SELECT	\N	t	f	8	2026-07-10 10:53:04.411	2026-09-18 09:23:54.412
cmrethhjw000wvdfbinufn45g	cmr9bvs3w001ynjjlz6a42lgs	Warranty	warranty	TEXT	\N	f	f	9	2026-07-10 10:53:04.412	2026-09-18 09:23:54.413
cmtn72kqo000hgqqvi5xh2qfv	cmtn72kpw0001gqqvt6fvuyzo	Noise Level	noise_level	TEXT	\N	f	f	8	2026-09-04 16:54:57.408	2026-09-04 16:54:57.408
cmtn72kqr000jgqqvwf8i0pn8	cmtn72kpw0001gqqvt6fvuyzo	Fan Speed Detail	fan_speed_detail	TEXT	\N	f	f	9	2026-09-04 16:54:57.411	2026-09-04 16:54:57.411
cmtn72kqt000lgqqvhejh1e6r	cmtn72kpw0001gqqvt6fvuyzo	Warranty	warranty	TEXT	\N	f	f	10	2026-09-04 16:54:57.413	2026-09-04 16:54:57.413
cmu1dxwcv0001dx76v4aehkby	cmr9bvs3i001knjjlqcd26aib	Processor Model/Series	processor_model	SELECT	\N	f	t	1	2026-09-14 15:16:02.959	2026-09-15 13:19:15.461
cmu1dxwcz0003dx76vdhp11ia	cmr9bvs3i001knjjlqcd26aib	Model Number	model_number	TEXT	\N	f	t	2	2026-09-14 15:16:02.964	2026-09-15 13:19:15.468
cmu1dxwd10005dx76dimdkbeb	cmr9bvs3i001knjjlqcd26aib	Number of Cores	number_of_cores	SELECT	\N	f	t	3	2026-09-14 15:16:02.966	2026-09-15 13:19:15.469
cmu1dxwd30007dx76jkwsvqqj	cmr9bvs3i001knjjlqcd26aib	Number of Threads	number_of_threads	SELECT	\N	f	t	4	2026-09-14 15:16:02.967	2026-09-15 13:19:15.47
cmu1dxwd50009dx76ij00dxti	cmr9bvs3i001knjjlqcd26aib	Base Clock Speed	base_clock	NUMBER	GHz	f	t	5	2026-09-14 15:16:02.969	2026-09-15 13:19:15.471
cmu1dxwd7000bdx76e9xrgrpz	cmr9bvs3i001knjjlqcd26aib	Boost/Turbo Clock Speed	boost_clock	NUMBER	GHz	f	t	6	2026-09-14 15:16:02.972	2026-09-15 13:19:15.473
cmu1dxwd9000ddx762blnhzls	cmr9bvs3i001knjjlqcd26aib	Socket Type	socket_type	SELECT	\N	f	t	7	2026-09-14 15:16:02.973	2026-09-15 13:19:15.474
cmu1dxwdb000fdx76gi3csy4k	cmr9bvs3i001knjjlqcd26aib	Generation/Series	generation	SELECT	\N	f	t	8	2026-09-14 15:16:02.975	2026-09-15 13:19:15.475
cmu1dxwdc000hdx76tuzbvj64	cmr9bvs3i001knjjlqcd26aib	Total Cache (L3)	cache_size	SELECT	\N	f	f	9	2026-09-14 15:16:02.977	2026-09-15 13:19:15.476
cmu1dxwdd000jdx76ootme15m	cmr9bvs3i001knjjlqcd26aib	L2 Cache	l2_cache	TEXT	\N	f	f	10	2026-09-14 15:16:02.978	2026-09-15 13:19:15.478
cmu1dxwdf000ldx76sfckvntq	cmr9bvs3i001knjjlqcd26aib	TDP (Thermal Design Power)	tdp	SELECT	\N	f	t	11	2026-09-14 15:16:02.98	2026-09-15 13:19:15.479
cmu1dxwdh000ndx7670yhrk65	cmr9bvs3i001knjjlqcd26aib	Integrated Graphics	integrated_graphics	SELECT	\N	f	f	12	2026-09-14 15:16:02.982	2026-09-15 13:19:15.48
cmu1dxwdj000pdx76in5rbcq5	cmr9bvs3i001knjjlqcd26aib	Memory Type Support	memory_type	SELECT	\N	f	f	13	2026-09-14 15:16:02.983	2026-09-15 13:19:15.481
cmu1dxwdk000rdx76bhpfrb24	cmr9bvs3i001knjjlqcd26aib	Max Memory Speed	max_memory_speed	SELECT	\N	f	f	14	2026-09-14 15:16:02.984	2026-09-15 13:19:15.482
cmu1dxwdl000tdx762nwcxpoi	cmr9bvs3i001knjjlqcd26aib	Max Memory Size	max_memory_size	TEXT	\N	f	f	15	2026-09-14 15:16:02.986	2026-09-15 13:19:15.483
cmu1dxwdn000vdx76xobrnm0k	cmr9bvs3i001knjjlqcd26aib	PCIe Version	pcie_version	SELECT	\N	f	f	16	2026-09-14 15:16:02.987	2026-09-15 13:19:15.484
cmu1dxwdo000xdx76qmpspca0	cmr9bvs3i001knjjlqcd26aib	Processor Features	processor_features	SELECT	\N	f	f	17	2026-09-14 15:16:02.988	2026-09-15 13:19:15.485
cmu1dxwdq000zdx76mpuvtb79	cmr9bvs3i001knjjlqcd26aib	Unlocked for Overclocking	unlocked	BOOLEAN	\N	f	f	18	2026-09-14 15:16:02.99	2026-09-15 13:19:15.486
cmu1dxwds0011dx763zyezfzu	cmr9bvs3i001knjjlqcd26aib	Cooler Included	cooler_included	BOOLEAN	\N	f	f	19	2026-09-14 15:16:02.992	2026-09-15 13:19:15.487
cmu1dxwdt0013dx76nkh7s9xd	cmr9bvs3i001knjjlqcd26aib	Warranty	warranty	TEXT	\N	f	t	20	2026-09-14 15:16:02.993	2026-09-15 13:19:15.489
cmu1dxwee001ndx769xazw1f3	cmr9bvs3l001mnjjlqu2ps65y	L2 Cache	l2_cache	TEXT	\N	f	f	10	2026-09-14 15:16:03.015	2026-09-15 13:19:15.5
cmu1dxweo001zdx76bzhzqfdz	cmr9bvs3l001mnjjlqu2ps65y	PCIe Version	pcie_version	SELECT	\N	f	f	16	2026-09-14 15:16:03.024	2026-09-15 13:19:15.505
cmu1dxwep0021dx76dut3p69s	cmr9bvs3l001mnjjlqu2ps65y	Processor Features	processor_features	SELECT	\N	f	f	17	2026-09-14 15:16:03.026	2026-09-15 13:19:15.506
cmu1dxwer0023dx76kkptl016	cmr9bvs3l001mnjjlqu2ps65y	Unlocked for Overclocking	unlocked	BOOLEAN	\N	f	f	18	2026-09-14 15:16:03.027	2026-09-15 13:19:15.507
cmu1dxwes0025dx762mlo5bct	cmr9bvs3l001mnjjlqu2ps65y	Cooler Included	cooler_included	BOOLEAN	\N	f	f	19	2026-09-14 15:16:03.029	2026-09-15 13:19:15.509
cmu1dxwev0027dx76a3oheqbe	cmr9bvs3l001mnjjlqu2ps65y	Warranty	warranty	TEXT	\N	f	t	20	2026-09-14 15:16:03.031	2026-09-15 13:19:15.51
cmr9bvs99003injjlawntuhv3	cmr9bvs3n001onjjl46q890qi	Total Cache (L3)	cache_size	SELECT	\N	f	f	9	2026-07-06 14:41:27.499	2026-09-15 13:19:15.522
cmu1dxwfb002rdx7664s337bd	cmr9bvs3n001onjjl46q890qi	L2 Cache	l2_cache	TEXT	\N	f	f	10	2026-09-14 15:16:03.048	2026-09-15 13:19:15.523
cmu1dxwfl0033dx762vno6blw	cmr9bvs3n001onjjl46q890qi	PCIe Version	pcie_version	SELECT	\N	f	f	16	2026-09-14 15:16:03.057	2026-09-15 13:19:15.53
cmu1dxwfn0035dx76k4xttha6	cmr9bvs3n001onjjl46q890qi	Processor Features	processor_features	SELECT	\N	f	f	17	2026-09-14 15:16:03.059	2026-09-15 13:19:15.531
cmu1dxwfp0037dx7615jcy1s4	cmr9bvs3n001onjjl46q890qi	Unlocked for Overclocking	unlocked	BOOLEAN	\N	f	f	18	2026-09-14 15:16:03.062	2026-09-15 13:19:15.532
cmu1dxwfr0039dx76nb1azc3d	cmr9bvs3n001onjjl46q890qi	Cooler Included	cooler_included	BOOLEAN	\N	f	f	19	2026-09-14 15:16:03.063	2026-09-15 13:19:15.532
cmu1dxwfs003bdx76iddxs55y	cmr9bvs3n001onjjl46q890qi	Warranty	warranty	TEXT	\N	f	t	20	2026-09-14 15:16:03.065	2026-09-15 13:19:15.533
cmrdbq1200007ohnkrwpf8pbc	cmrdawgoj0001t4sx2iu7z3q7	Supported CPU	supported_cpu	TEXT	\N	f	t	1	2026-07-09 09:48:03.673	2026-09-18 08:51:24.291
cmrdbq12c000lohnkwib3vwr0	cmrdawgoj0001t4sx2iu7z3q7	Ports & Connectors	ports_connectors	TEXT	\N	f	f	8	2026-07-09 09:48:03.685	2026-09-18 08:51:24.317
cmu6pynfl000p14lf8747ua51	cmrdawgow0003t4sxu1aulbfu	Supported CPU	supported_cpu	TEXT	\N	f	t	1	2026-09-18 08:51:24.321	2026-09-18 08:51:24.321
cmu6pynfm000r14lfudlmnzu2	cmrdawgow0003t4sxu1aulbfu	Chipset	chipset	TEXT	\N	t	t	2	2026-09-18 08:51:24.323	2026-09-18 08:51:24.323
cmu6pynfo000t14lfqadrp9c6	cmrdawgow0003t4sxu1aulbfu	Memory Size	memory_size	TEXT	\N	t	f	3	2026-09-18 08:51:24.324	2026-09-18 08:51:24.324
cmu6pynfo000v14lfk2twms3r	cmrdawgow0003t4sxu1aulbfu	Memory Type	memory_type	TEXT	\N	t	f	4	2026-09-18 08:51:24.325	2026-09-18 08:51:24.325
cmu6pynfp000x14lfgbwb97o2	cmrdawgow0003t4sxu1aulbfu	Storage Slots	storage_slots	TEXT	\N	f	f	5	2026-09-18 08:51:24.326	2026-09-18 08:51:24.326
cmu6pynfr000z14lf0rzzeznh	cmrdawgow0003t4sxu1aulbfu	Graphics	graphics	TEXT	\N	f	f	6	2026-09-18 08:51:24.327	2026-09-18 08:51:24.327
cmu6pynfs001114lflya0h3wr	cmrdawgow0003t4sxu1aulbfu	Audio	audio	TEXT	\N	f	f	7	2026-09-18 08:51:24.329	2026-09-18 08:51:24.329
cmu6pynfu001314lft9yu4wju	cmrdawgow0003t4sxu1aulbfu	Ports & Connectors	ports_connectors	TEXT	\N	f	f	8	2026-09-18 08:51:24.33	2026-09-18 08:51:24.33
cmu6pynfv001514lfpv41pubh	cmrdawgow0003t4sxu1aulbfu	Special Features	special_features	TEXT	\N	f	f	9	2026-09-18 08:51:24.332	2026-09-18 08:51:24.332
cmu6pynfw001714lftjqb52qs	cmrdawgow0003t4sxu1aulbfu	Form Factor	form_factor	TEXT	\N	t	f	10	2026-09-18 08:51:24.332	2026-09-18 08:51:24.332
cmu6pynfx001914lferyrkkxr	cmrdawgow0003t4sxu1aulbfu	Expansion Slots	expansion_slots	TEXT	\N	f	f	11	2026-09-18 08:51:24.333	2026-09-18 08:51:24.333
cmu6pynfx001b14lfbzlcqptg	cmrdawgow0003t4sxu1aulbfu	Warranty	warranty	TEXT	\N	f	f	12	2026-09-18 08:51:24.334	2026-09-18 08:51:24.334
cmu6pynfy001d14lfnomvc0tn	cmrdawgox0005t4sx9zy0pfy3	Supported CPU	supported_cpu	TEXT	\N	f	t	1	2026-09-18 08:51:24.335	2026-09-18 08:51:24.335
cmu6pynfz001f14lfzkgheosn	cmrdawgox0005t4sx9zy0pfy3	Chipset	chipset	TEXT	\N	t	t	2	2026-09-18 08:51:24.336	2026-09-18 08:51:24.336
cmu6pyng0001h14lfrol6ss30	cmrdawgox0005t4sx9zy0pfy3	Memory Size	memory_size	TEXT	\N	t	f	3	2026-09-18 08:51:24.337	2026-09-18 08:51:24.337
cmu6pyng1001j14lf8l7bw4pz	cmrdawgox0005t4sx9zy0pfy3	Memory Type	memory_type	TEXT	\N	t	f	4	2026-09-18 08:51:24.338	2026-09-18 08:51:24.338
cmu6pyng2001l14lfig07ezdq	cmrdawgox0005t4sx9zy0pfy3	Storage Slots	storage_slots	TEXT	\N	f	f	5	2026-09-18 08:51:24.339	2026-09-18 08:51:24.339
cmu6pyng3001n14lfqkp15mqn	cmrdawgox0005t4sx9zy0pfy3	Graphics	graphics	TEXT	\N	f	f	6	2026-09-18 08:51:24.339	2026-09-18 08:51:24.339
cmu6pyng4001p14lf6t13ws6b	cmrdawgox0005t4sx9zy0pfy3	Audio	audio	TEXT	\N	f	f	7	2026-09-18 08:51:24.34	2026-09-18 08:51:24.34
cmu6pyng5001r14lfb5ia1r3a	cmrdawgox0005t4sx9zy0pfy3	Ports & Connectors	ports_connectors	TEXT	\N	f	f	8	2026-09-18 08:51:24.341	2026-09-18 08:51:24.341
cmu6pyng5001t14lfiirn2uls	cmrdawgox0005t4sx9zy0pfy3	Special Features	special_features	TEXT	\N	f	f	9	2026-09-18 08:51:24.342	2026-09-18 08:51:24.342
cmu6pyng6001v14lfejclbnlw	cmrdawgox0005t4sx9zy0pfy3	Form Factor	form_factor	TEXT	\N	t	f	10	2026-09-18 08:51:24.343	2026-09-18 08:51:24.343
cmu6pyng7001x14lfs2q5z4kc	cmrdawgox0005t4sx9zy0pfy3	Expansion Slots	expansion_slots	TEXT	\N	f	f	11	2026-09-18 08:51:24.343	2026-09-18 08:51:24.343
cmu6pyng8001z14lfrky9kl8k	cmrdawgox0005t4sx9zy0pfy3	Warranty	warranty	TEXT	\N	f	f	12	2026-09-18 08:51:24.344	2026-09-18 08:51:24.344
cmu6pzb290002mcmisr7bwk77	cmr9bvs3f001hnjjl01z95nzo	Supported Cpu	supported_cpu	TEXT	\N	f	f	500	2026-09-18 08:51:54.946	2026-09-18 08:51:54.946
cmu6pzb2c0004mcmiwpg3p2e5	cmr9bvs3f001hnjjl01z95nzo	Chipset	chipset	TEXT	\N	f	f	500	2026-09-18 08:51:54.948	2026-09-18 08:51:54.948
cmu6pzb2e0006mcmi4hsab6e1	cmr9bvs3f001hnjjl01z95nzo	Memory Size	memory_size	TEXT	\N	f	f	500	2026-09-18 08:51:54.95	2026-09-18 08:51:54.95
cmu6pzb2f0008mcmionf5yjlx	cmr9bvs3f001hnjjl01z95nzo	Memory Type	memory_type	TEXT	\N	f	f	500	2026-09-18 08:51:54.952	2026-09-18 08:51:54.952
cmu6pzb2h000amcmizigjsfe5	cmr9bvs3f001hnjjl01z95nzo	Storage Slots	storage_slots	TEXT	\N	f	f	500	2026-09-18 08:51:54.953	2026-09-18 08:51:54.953
cmu6pzb2i000cmcmimyy4t9f9	cmr9bvs3f001hnjjl01z95nzo	Graphics	graphics	TEXT	\N	f	f	500	2026-09-18 08:51:54.955	2026-09-18 08:51:54.955
cmu6pzb2m000emcmik32fd1dn	cmr9bvs3f001hnjjl01z95nzo	Audio	audio	TEXT	\N	f	f	500	2026-09-18 08:51:54.958	2026-09-18 08:51:54.958
cmu6pzb2n000gmcmikeftzbzu	cmr9bvs3f001hnjjl01z95nzo	Ports Connectors	ports_connectors	TEXT	\N	f	f	500	2026-09-18 08:51:54.96	2026-09-18 08:51:54.96
cmu6pzb2o000imcmisdeb41va	cmr9bvs3f001hnjjl01z95nzo	Special Features	special_features	TEXT	\N	f	f	500	2026-09-18 08:51:54.961	2026-09-18 08:51:54.961
cmu6pzb2q000kmcmi9ygle20m	cmr9bvs3f001hnjjl01z95nzo	Form Factor	form_factor	TEXT	\N	f	f	500	2026-09-18 08:51:54.962	2026-09-18 08:51:54.962
cmu6pzb2r000mmcmipp7cj7ek	cmr9bvs3f001hnjjl01z95nzo	Expansion Slots	expansion_slots	TEXT	\N	f	f	500	2026-09-18 08:51:54.963	2026-09-18 08:51:54.963
cmu6pzb2t000omcmizkw9j2pw	cmr9bvs3f001hnjjl01z95nzo	Warranty	warranty	TEXT	\N	f	t	900	2026-09-18 08:51:54.965	2026-09-18 08:51:54.965
cmu6r4g410001eqewobjuwk25	cmrethhiz0003vdfb4lfktnqj	Memory Type	memory_type	SELECT	\N	t	t	1	2026-09-18 09:23:54.383	2026-09-18 09:23:54.383
cmu6r4g4c0003eqewsbry4t1r	cmrethhiz0003vdfb4lfktnqj	Bus Speed	speed	SELECT	\N	t	t	2	2026-09-18 09:23:54.397	2026-09-18 09:23:54.397
cmu6r4g4e0005eqewv5z9mi37	cmrethhiz0003vdfb4lfktnqj	Latency	latency	TEXT	\N	f	f	3	2026-09-18 09:23:54.398	2026-09-18 09:23:54.398
cmu6r4g4f0007eqew2h0936qd	cmrethhiz0003vdfb4lfktnqj	Capacity	capacity	SELECT	\N	t	t	4	2026-09-18 09:23:54.399	2026-09-18 09:23:54.399
cmu6r4g4g0009eqewn5mpxr15	cmrethhiz0003vdfb4lfktnqj	Voltage	voltage	TEXT	\N	f	f	5	2026-09-18 09:23:54.4	2026-09-18 09:23:54.4
cmu6r4g4h000beqewz2rm55gn	cmrethhiz0003vdfb4lfktnqj	Other Features	other_features	TEXT	\N	f	f	6	2026-09-18 09:23:54.401	2026-09-18 09:23:54.401
cmu6r4g4i000deqew2gui9h6q	cmrethhiz0003vdfb4lfktnqj	Color	color	TEXT	\N	f	f	7	2026-09-18 09:23:54.402	2026-09-18 09:23:54.402
cmu6r4g4j000feqewh0pudlok	cmrethhiz0003vdfb4lfktnqj	RAM Features	ram_features	SELECT	\N	t	f	8	2026-09-18 09:23:54.404	2026-09-18 09:23:54.404
cmu6r4g4l000heqewcqtt9kzx	cmrethhiz0003vdfb4lfktnqj	Warranty	warranty	TEXT	\N	f	f	9	2026-09-18 09:23:54.405	2026-09-18 09:23:54.405
cmrethhjt000qvdfbbgxkzkdk	cmr9bvs3w001ynjjlz6a42lgs	Other Features	other_features	TEXT	\N	f	f	6	2026-07-10 10:53:04.409	2026-09-18 09:23:54.41
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, name, password, role, "emailVerified", image, "createdAt", "updatedAt") FROM stdin;
cmr9bvrye0000njjljech7ze8	admin@wscomputercity.com	Admin User	$2a$10$BMIpna/66rzjyCtaFRyjwOA8ObMyQOKQdhDuEUMKs46U9ToBmOph6	ADMIN	2026-07-06 14:41:27.105	\N	2026-07-06 14:41:27.109	2026-07-06 14:41:27.109
\.


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: filterable_specifications filterable_specifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.filterable_specifications
    ADD CONSTRAINT filterable_specifications_pkey PRIMARY KEY (id);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: product_specifications product_specifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_specifications
    ADD CONSTRAINT product_specifications_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: specification_definitions specification_definitions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specification_definitions
    ADD CONSTRAINT specification_definitions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: accounts_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON public.accounts USING btree (provider, "providerAccountId");


--
-- Name: brands_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX brands_name_key ON public.brands USING btree (name);


--
-- Name: brands_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX brands_slug_idx ON public.brands USING btree (slug);


--
-- Name: brands_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX brands_slug_key ON public.brands USING btree (slug);


--
-- Name: categories_parentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "categories_parentId_idx" ON public.categories USING btree ("parentId");


--
-- Name: categories_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_slug_idx ON public.categories USING btree (slug);


--
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- Name: filterable_specifications_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "filterable_specifications_categoryId_idx" ON public.filterable_specifications USING btree ("categoryId");


--
-- Name: filterable_specifications_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX filterable_specifications_key_idx ON public.filterable_specifications USING btree (key);


--
-- Name: filterable_specifications_key_value_categoryId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "filterable_specifications_key_value_categoryId_key" ON public.filterable_specifications USING btree (key, value, "categoryId");


--
-- Name: menu_items_isVisible_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "menu_items_isVisible_idx" ON public.menu_items USING btree ("isVisible");


--
-- Name: menu_items_level_sortOrder_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "menu_items_level_sortOrder_idx" ON public.menu_items USING btree (level, "sortOrder");


--
-- Name: menu_items_parentId_sortOrder_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "menu_items_parentId_sortOrder_idx" ON public.menu_items USING btree ("parentId", "sortOrder");


--
-- Name: menu_items_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX menu_items_slug_idx ON public.menu_items USING btree (slug);


--
-- Name: product_images_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_images_productId_idx" ON public.product_images USING btree ("productId");


--
-- Name: product_specifications_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_specifications_productId_idx" ON public.product_specifications USING btree ("productId");


--
-- Name: product_specifications_productId_specificationDefinitionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "product_specifications_productId_specificationDefinitionId_key" ON public.product_specifications USING btree ("productId", "specificationDefinitionId");


--
-- Name: product_specifications_specificationDefinitionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "product_specifications_specificationDefinitionId_idx" ON public.product_specifications USING btree ("specificationDefinitionId");


--
-- Name: products_brandId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "products_brandId_idx" ON public.products USING btree ("brandId");


--
-- Name: products_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "products_categoryId_idx" ON public.products USING btree ("categoryId");


--
-- Name: products_price_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_price_idx ON public.products USING btree (price);


--
-- Name: products_sku_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_sku_idx ON public.products USING btree (sku);


--
-- Name: products_sku_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX products_sku_key ON public.products USING btree (sku);


--
-- Name: products_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_slug_idx ON public.products USING btree (slug);


--
-- Name: products_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX products_slug_key ON public.products USING btree (slug);


--
-- Name: products_stockStatus_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "products_stockStatus_idx" ON public.products USING btree ("stockStatus");


--
-- Name: sessions_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sessions_sessionToken_key" ON public.sessions USING btree ("sessionToken");


--
-- Name: specification_definitions_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "specification_definitions_categoryId_idx" ON public.specification_definitions USING btree ("categoryId");


--
-- Name: specification_definitions_categoryId_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "specification_definitions_categoryId_key_key" ON public.specification_definitions USING btree ("categoryId", key);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: accounts accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: categories categories_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: menu_items menu_items_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT "menu_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: menu_items menu_items_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT "menu_items_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.menu_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_images product_images_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_specifications product_specifications_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_specifications
    ADD CONSTRAINT "product_specifications_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_specifications product_specifications_specificationDefinitionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_specifications
    ADD CONSTRAINT "product_specifications_specificationDefinitionId_fkey" FOREIGN KEY ("specificationDefinitionId") REFERENCES public.specification_definitions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: products products_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public.brands(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: products products_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: specification_definitions specification_definitions_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specification_definitions
    ADD CONSTRAINT "specification_definitions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 8o0UYcQcvetCfOP91a4M1peUwADWW0fxug7U1Qggs7Yw2ITkjBhPuvHA3l7J1mx

