--
-- PostgreSQL database dump
--

\restrict nmsIv9x4X8G8inbpbzsihfEFPXY4fPjUlVfgzC0lfjSWGjNRqchEtWd1f7JsT4F

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

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
cmr9bvs190006njjl0etcmten	Corsair	corsair	\N	Gaming peripherals and components	t	2026-07-06 14:41:27.214	2026-07-06 14:41:27.214
cmr9bvs1c0007njjliydjdegy	Kingston	kingston	\N	Memory and storage products	t	2026-07-06 14:41:27.216	2026-07-06 14:41:27.216
cmr9bvs1e0008njjldd9yn8gy	Team	team	\N	Memory and storage solutions	t	2026-07-06 14:41:27.219	2026-07-06 14:41:27.219
cmr9bvs1g0009njjlxlcnxd7x	XOC	xoc	\N	Storage solutions	t	2026-07-06 14:41:27.221	2026-07-06 14:41:27.221
cmr9bvs1i000anjjlofuysxcv	MiPhi	miphi	\N	Storage products	t	2026-07-06 14:41:27.223	2026-07-06 14:41:27.223
cmr9bvs1k000bnjjl4cavdy9l	OSCOO	oscoo	\N	SSD manufacturer	t	2026-07-06 14:41:27.224	2026-07-06 14:41:27.224
cmr9bvs1l000cnjjlf6abi45d	Lexar	lexar	\N	Memory and storage products	t	2026-07-06 14:41:27.225	2026-07-06 14:41:27.225
cmr9bvs1n000dnjjlcwqqzlt2	MSI	msi	\N	Gaming hardware manufacturer	t	2026-07-06 14:41:27.227	2026-07-06 14:41:27.227
cmr9bvs1p000enjjltzj0jtog	SanDisk	sandisk	\N	Flash storage solutions	t	2026-07-06 14:41:27.229	2026-07-06 14:41:27.229
cmr9bvs1r000fnjjlexhh71q3	Seagate	seagate	\N	Data storage solutions	t	2026-07-06 14:41:27.231	2026-07-06 14:41:27.231
cmr9bvs1s000gnjjlrepfjl63	Adata	adata	\N	Memory and storage manufacturer	t	2026-07-06 14:41:27.232	2026-07-06 14:41:27.232
cmr9bvs1t000hnjjllhkj3m9h	Ocpc	ocpc	\N	Gaming hardware	t	2026-07-06 14:41:27.234	2026-07-06 14:41:27.234
cmr9bvs1u000injjlydlokmi4	Western Digital	western-digital	\N	Storage solutions	t	2026-07-06 14:41:27.235	2026-07-06 14:41:27.235
cmr9bvs1w000jnjjl4karmtf7	Aitc	aitc	\N	Storage products	t	2026-07-06 14:41:27.236	2026-07-06 14:41:27.236
cmr9bvs1y000knjjlah0rj635	Acer	acer	\N	Computer hardware	t	2026-07-06 14:41:27.239	2026-07-06 14:41:27.239
cmr9bvs20000lnjjljsh2985w	Transcend	transcend	\N	Memory and storage	t	2026-07-06 14:41:27.24	2026-07-06 14:41:27.24
cmr9bvs21000mnjjlfy16ibyn	Crucial	crucial	\N	Memory and storage by Micron	t	2026-07-06 14:41:27.242	2026-07-06 14:41:27.242
cmr9bvs22000nnjjltuvxe04m	Apacer	apacer	\N	Digital storage solutions	t	2026-07-06 14:41:27.243	2026-07-06 14:41:27.243
cmr9bvs24000onjjll00hq9a9	Colorful	colorful	\N	Graphics cards and storage	t	2026-07-06 14:41:27.244	2026-07-06 14:41:27.244
cmr9bvs25000pnjjlv8x188gl	KingSpec	kingspec	\N	SSD manufacturer	t	2026-07-06 14:41:27.245	2026-07-06 14:41:27.245
cmr9bvs26000qnjjlhrbbplxh	Netac	netac	\N	Flash memory products	t	2026-07-06 14:41:27.247	2026-07-06 14:41:27.247
cmr9bvs27000rnjjlpj0622kg	PNY	pny	\N	Memory and storage products	t	2026-07-06 14:41:27.248	2026-07-06 14:41:27.248
cmr9bvs29000snjjlcu8q19no	Twinmos	twinmos	\N	Memory solutions	t	2026-07-06 14:41:27.249	2026-07-06 14:41:27.249
cmr9bvs2a000tnjjlgf4ozydd	Pc Power	pc-power	\N	Computer components	t	2026-07-06 14:41:27.251	2026-07-06 14:41:27.251
cmr9bvs2b000unjjlcpum54gp	Biwintech	biwintech	\N	Storage solutions	t	2026-07-06 14:41:27.252	2026-07-06 14:41:27.252
cmr9bvs2d000vnjjl4w4taofp	Kingbox	kingbox	\N	Storage products	t	2026-07-06 14:41:27.254	2026-07-06 14:41:27.254
cmr9bvs2f000wnjjlhveyideo	GIGABYTE	gigabyte	\N	Computer hardware manufacturer	t	2026-07-06 14:41:27.255	2026-07-06 14:41:27.255
cmr9bvs2g000xnjjlq6cg2c0l	NCX	ncx	\N	Storage products	t	2026-07-06 14:41:27.256	2026-07-06 14:41:27.256
cmr9bvs2h000ynjjlow55tox4	Orico	orico	\N	Digital accessories	t	2026-07-06 14:41:27.258	2026-07-06 14:41:27.258
cmr9bvs2j000znjjliyv1sc4m	HP	hp	\N	Computing and printing solutions	t	2026-07-06 14:41:27.259	2026-07-06 14:41:27.259
cmr9bvs2k0010njjlu958m2rd	King Super	king-super	\N	Storage products	t	2026-07-06 14:41:27.261	2026-07-06 14:41:27.261
cmr9bvs2m0011njjlho8s259o	Addlink	addlink	\N	Memory and storage	t	2026-07-06 14:41:27.262	2026-07-06 14:41:27.262
cmr9bvs2n0012njjldwoed7p1	NEO FORZA	neo-forza	\N	Memory and storage	t	2026-07-06 14:41:27.264	2026-07-06 14:41:27.264
cmr9bvs2p0013njjllkbpbnva	Hikvision	hikvision	\N	Security and storage	t	2026-07-06 14:41:27.266	2026-07-06 14:41:27.266
cmr9bvs2r0014njjlz6pepre3	Patriot	patriot	\N	Memory and storage	t	2026-07-06 14:41:27.268	2026-07-06 14:41:27.268
cmr9bvs2t0015njjlg51gja4h	Ramsta	ramsta	\N	Storage solutions	t	2026-07-06 14:41:27.269	2026-07-06 14:41:27.269
cmr9bvs2u0016njjlss5t7fwy	Redragon	redragon	\N	Gaming peripherals	t	2026-07-06 14:41:27.271	2026-07-06 14:41:27.271
cmr9bvs2w0017njjlb0niwu01	Kimtigo	kimtigo	\N	Memory products	t	2026-07-06 14:41:27.272	2026-07-06 14:41:27.272
cmr9bvs2x0018njjlgob85pwv	AGI	agi	\N	Storage solutions	t	2026-07-06 14:41:27.273	2026-07-06 14:41:27.273
cmr9bvs2y0019njjllkoa9c2z	Revenger	revenger	\N	Gaming storage	t	2026-07-06 14:41:27.275	2026-07-06 14:41:27.275
cmr9bvs30001anjjllga9jbta	Dahua	dahua	\N	Security and storage	t	2026-07-06 14:41:27.276	2026-07-06 14:41:27.276
cmr9bvs32001bnjjlwdt9w53v	LENOVO	lenovo	\N	Computing solutions	t	2026-07-06 14:41:27.278	2026-07-06 14:41:27.278
cmr9bvs34001cnjjlx7v4l8qw	Smart	smart	\N	Storage products	t	2026-07-06 14:41:27.28	2026-07-06 14:41:27.28
cmr9bvs35001dnjjlv2qqi2o9	Walton	walton	\N	Electronics manufacturer	t	2026-07-06 14:41:27.281	2026-07-06 14:41:27.281
cmr9bvs37001enjjlk5ngzmtq	Suneest	suneest	\N	Storage products	t	2026-07-06 14:41:27.283	2026-07-06 14:41:27.283
cmr9bvs38001fnjjly085bwns	Kingbank	kingbank	\N	Memory products	t	2026-07-06 14:41:27.284	2026-07-06 14:41:27.284
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
cmr9bvs3w001ynjjlz6a42lgs	RAM	ram	Memory modules	\N	cmr9bvs3f001hnjjl01z95nzo	1	4	t	2026-07-06 14:41:27.308	2026-07-06 14:41:27.308
\.


--
-- Data for Name: filterable_specifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.filterable_specifications (id, key, value, count, "categoryId") FROM stdin;
cmr9esnvo0007t1wvo5jzadfn	gpu_chipset	NVIDIA's GB206 GPU chipset	1	cmr9bvs3p001qnjjlnzrmtdrs
cmr9esnvx0008t1wvo9hhvhe2	memory_size	8	1	cmr9bvs3p001qnjjlnzrmtdrs
cmr9j8yle000ht1wvd4gh5k3r	memory_size	8 GB	3	cmr9bvs3p001qnjjlnzrmtdrs
cmr9esnvz0009t1wvb7e0sqgl	memory_type	GDDR7	2	cmr9bvs3p001qnjjlnzrmtdrs
cmr9jbay60017t1wvonke3pnw	gpu_chipset	GeForce RTX 5060 Ti	1	cmr9bvs3p001qnjjlnzrmtdrs
cmrca989t000f5men92el2rqk	socket_type	AM4	1	cmr9bvs3n001onjjl46q890qi
cmrca989y000g5menmjmeep3z	number_of_cores	6 Core	1	cmr9bvs3n001onjjl46q890qi
cmrca98a0000h5menx2q651ee	number_of_threads	12 Threads	1	cmr9bvs3n001onjjl46q890qi
cmrca98a3000i5men2krvcuqi	cache_size	32 MB	1	cmr9bvs3n001onjjl46q890qi
cmrca98a5000j5mencezcn2ok	processor_model	Ryzen 5	1	cmr9bvs3n001onjjl46q890qi
cmrca98a7000k5menr85dgdnx	generation	Ryzen 5000 Series	1	cmr9bvs3n001onjjl46q890qi
cmrca98a9000l5mend1tl34fc	memory_type	DDR4	1	cmr9bvs3n001onjjl46q890qi
cmrcaa5mm00125men8dyylj70	number_of_cores	6 Core	1	cmr9bvs3l001mnjjlqu2ps65y
cmrcaa5mo00135men2lq4savj	number_of_threads	12 Threads	1	cmr9bvs3l001mnjjlqu2ps65y
cmrcaa5mv00165menfivd4n6l	generation	12th Gen (Alder Lake)	1	cmr9bvs3l001mnjjlqu2ps65y
cmrcaa5mx00175menr2ghqfp4	memory_type	DDR5	1	cmr9bvs3l001mnjjlqu2ps65y
cmrcaa5mt00155menh4zljn58	processor_model	Intel Core i5	2	cmr9bvs3l001mnjjlqu2ps65y
cmrcbkzjo001r5men9i73ykpq	number_of_cores	10 Core	1	cmr9bvs3l001mnjjlqu2ps65y
cmrcbkzjq001s5menz5made1c	number_of_threads	16 Threads	1	cmr9bvs3l001mnjjlqu2ps65y
cmrcaa5mj00115men2q2yowoa	socket_type	LGA 1700	2	cmr9bvs3l001mnjjlqu2ps65y
cmrcbkzju001u5menefjgrrli	generation	14th Gen (Raptor Lake Refresh)	1	cmr9bvs3l001mnjjlqu2ps65y
cmrcaa5mr00145menp1wya44u	cache_size	18 MB	2	cmr9bvs3l001mnjjlqu2ps65y
cmrcbkzjz001w5menar8vfr5n	integrated_graphics	Intel UHD Graphics 770	1	cmr9bvs3l001mnjjlqu2ps65y
cmrcbkzk0001x5menr01ciwmo	memory_type	DDR4 + DDR5	1	cmr9bvs3l001mnjjlqu2ps65y
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, "productId", url, alt, "order", "isPrimary", "createdAt") FROM stdin;
cmr9jbaxd000nt1wvndp217jt	cmr9esnv10002t1wvup6a0f8w	https://www.techlandbd.com/cache/images/uploads/products/P0322511005/gigabyte-graphics-card-geforce-rtx-5060-aero-oc-8g-cover.webp	Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card	0	t	2026-07-06 18:09:28.85
cmrca989900015men1sceadf9	cmr9bvsa7004jnjjlzqzyt643	https://www.startech.com.bd/image/cache/catalog/processor/amd/5600x/5600x-001-500x500.jpg	AMD Ryzen 5 5600X	0	t	2026-07-08 16:19:14.062
cmrcaa5m3000n5men03seo5g5	cmr9bvs9s0042njjlfqeg1cdv	https://www.startech.com.bd/image/cache/catalog/processor/intel/i5-12400/i5-12400-001-500x500.jpg	Intel Core i5-12400F	0	t	2026-07-08 16:19:57.291
cmrcbkziz001b5menuna9ez05	cmrcbkzit001a5menuqtjvxca	https://www.startech.com.bd/image/cache/catalog/processor/intel/i5-14400/i5-14400-01-500x500.webp	Intel Core i5 14400F 14th Gen Raptor Lake Processor	0	t	2026-07-08 16:56:22.235
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
cmrca989q00025men6423cdky	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs97002vnjjluf76j46i	AM4	2026-07-08 16:19:14.078	2026-07-08 16:19:14.078
cmrca989q00035men57dyh0y3	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs97002unjjlkze12d8e	6 Core	2026-07-08 16:19:14.078	2026-07-08 16:19:14.078
cmrca989q00045menu6pidh3u	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs97003cnjjlsdpfrbzc	12 Threads	2026-07-08 16:19:14.078	2026-07-08 16:19:14.078
cmrca989q00055mene1stio9q	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs97002xnjjlbgm11wr2	3.7	2026-07-08 16:19:14.078	2026-07-08 16:19:14.078
cmrca989q00065menjmvl4nqc	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs970038njjlxvru0024	4.6	2026-07-08 16:19:14.078	2026-07-08 16:19:14.078
cmrca989q00075menw0a1jzbr	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs99003injjlawntuhv3	32 MB	2026-07-08 16:19:14.078	2026-07-08 16:19:14.078
cmrca989q00085menepnx4oxn	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs970031njjlxjwmui6s	65W	2026-07-08 16:19:14.078	2026-07-08 16:19:14.078
cmrca989q00095menbr6ev4z2	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-07-08 16:19:14.078	2026-07-08 16:19:14.078
cmrca989q000a5men5ccis1op	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs97003anjjly8pgyejf	Ryzen 5 5600X	2026-07-08 16:19:14.078	2026-07-08 16:19:14.078
cmrca989q000b5menue43zp4x	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs970039njjl7x3qpa9y	Ryzen 5000 Series	2026-07-08 16:19:14.078	2026-07-08 16:19:14.078
cmrca989q000c5menc16jav5p	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs970034njjlup59w81g	DDR4	2026-07-08 16:19:14.078	2026-07-08 16:19:14.078
cmrca989q000d5men9dyeh7lg	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs970035njjlw0stdb9f	DDR4-3200	2026-07-08 16:19:14.078	2026-07-08 16:19:14.078
cmrca989q000e5menqkyvkk7n	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs98003gnjjlh7t4qtax	128 GB	2026-07-08 16:19:14.078	2026-07-08 16:19:14.078
cmrcaa5mh000o5menvmc1kyx9	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs3y0023njjljhlzuud0	LGA 1700	2026-07-08 16:19:57.305	2026-07-08 16:19:57.305
cmrcaa5mh000p5men0b8xxvxp	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs3z0028njjl78cbu80i	6 Core	2026-07-08 16:19:57.305	2026-07-08 16:19:57.305
cmrcaa5mh000q5menxajjj91h	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs3y0027njjlmnphc78d	12 Threads	2026-07-08 16:19:57.305	2026-07-08 16:19:57.305
cmrcaa5mh000r5men5i1hyvfp	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs3y0026njjlozqqv8z0	2.5	2026-07-08 16:19:57.305	2026-07-08 16:19:57.305
cmrcaa5mh000s5menqaqz8gz6	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs3y0024njjl9e3ah51v	4.4	2026-07-08 16:19:57.305	2026-07-08 16:19:57.305
cmrcaa5mh000t5men6d478by5	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs6g002injjlwouuh804	18 MB	2026-07-08 16:19:57.305	2026-07-08 16:19:57.305
cmrcaa5mh000u5men7omswf2n	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs5i002anjjlcuk2lj5u	65W	2026-07-08 16:19:57.305	2026-07-08 16:19:57.305
cmrcaa5mh000v5men1fgjse4i	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs6u002mnjjl4mw9r2r4	Intel Core i5	2026-07-08 16:19:57.305	2026-07-08 16:19:57.305
cmrcaa5mh000w5menb3jr6b3o	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs69002enjjlzzee8gs4	Core i5-12400F	2026-07-08 16:19:57.305	2026-07-08 16:19:57.305
cmrcaa5mh000x5men8ulfiup4	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs6f002hnjjl1x3olffk	12th Gen (Alder Lake)	2026-07-08 16:19:57.305	2026-07-08 16:19:57.305
cmrcaa5mh000y5mennyur8r88	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs6x002onjjln15z5srx	DDR5	2026-07-08 16:19:57.305	2026-07-08 16:19:57.305
cmrcaa5mh000z5menswnxxopu	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs6i002knjjlemi601rt	DDR5-4800	2026-07-08 16:19:57.305	2026-07-08 16:19:57.305
cmrcaa5mh00105menmz1gl4hu	cmr9bvs9s0042njjlfqeg1cdv	cmr9bvs91002qnjjlspy1ptf2	128 GB	2026-07-08 16:19:57.305	2026-07-08 16:19:57.305
cmrcbkzjg001c5men91l84ox3	cmrcbkzit001a5menuqtjvxca	cmr9bvs6u002mnjjl4mw9r2r4	Intel Core i5	2026-07-08 16:56:22.253	2026-07-08 16:56:22.253
cmrcbkzjg001d5men4yzsp2us	cmrcbkzit001a5menuqtjvxca	cmr9bvs69002enjjlzzee8gs4	Intel Core i5 14400F	2026-07-08 16:56:22.253	2026-07-08 16:56:22.253
cmrcbkzjg001e5mengdkh32vj	cmrcbkzit001a5menuqtjvxca	cmr9bvs3z0028njjl78cbu80i	10 Core	2026-07-08 16:56:22.253	2026-07-08 16:56:22.253
cmrcbkzjg001f5menjc81id2h	cmrcbkzit001a5menuqtjvxca	cmr9bvs3y0027njjlmnphc78d	16 Threads	2026-07-08 16:56:22.253	2026-07-08 16:56:22.253
cmrcbkzjg001g5meneiv2hvuk	cmrcbkzit001a5menuqtjvxca	cmr9bvs3y0026njjlozqqv8z0	3.5	2026-07-08 16:56:22.253	2026-07-08 16:56:22.253
cmrcbkzjg001h5menyasixrvo	cmrcbkzit001a5menuqtjvxca	cmr9bvs3y0024njjl9e3ah51v	4.7	2026-07-08 16:56:22.253	2026-07-08 16:56:22.253
cmrcbkzjg001i5meneqf99bi3	cmrcbkzit001a5menuqtjvxca	cmr9bvs3y0023njjljhlzuud0	LGA 1700	2026-07-08 16:56:22.253	2026-07-08 16:56:22.253
cmrcbkzjg001j5men97y98iue	cmrcbkzit001a5menuqtjvxca	cmr9bvs6f002hnjjl1x3olffk	14th Gen (Raptor Lake Refresh)	2026-07-08 16:56:22.253	2026-07-08 16:56:22.253
cmrcbkzjg001k5men17x5jv4q	cmrcbkzit001a5menuqtjvxca	cmr9bvs6g002injjlwouuh804	18 MB	2026-07-08 16:56:22.253	2026-07-08 16:56:22.253
cmrcbkzjg001l5mens5yhy02e	cmrcbkzit001a5menuqtjvxca	cmr9bvs5i002anjjlcuk2lj5u	150W	2026-07-08 16:56:22.253	2026-07-08 16:56:22.253
cmrcbkzjg001m5menxo7a1bhk	cmrcbkzit001a5menuqtjvxca	cmr9bvs64002cnjjl2ip49dn5	Intel UHD Graphics 770	2026-07-08 16:56:22.253	2026-07-08 16:56:22.253
cmrcbkzjg001n5men5zxaflzc	cmrcbkzit001a5menuqtjvxca	cmr9bvs6x002onjjln15z5srx	DDR4 + DDR5	2026-07-08 16:56:22.253	2026-07-08 16:56:22.253
cmrcbkzjg001o5men3n2je8be	cmrcbkzit001a5menuqtjvxca	cmr9bvs6i002knjjlemi601rt	DDR5-7200	2026-07-08 16:56:22.253	2026-07-08 16:56:22.253
cmrcbkzjg001p5menr7x32d0x	cmrcbkzit001a5menuqtjvxca	cmr9bvs91002qnjjlspy1ptf2	192 GB	2026-07-08 16:56:22.253	2026-07-08 16:56:22.253
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, slug, sku, description, "shortDescription", price, "compareAtPrice", "costPrice", "stockStatus", "stockQuantity", "lowStockAlert", "categoryId", "brandId", "metaTitle", "metaDescription", "metaKeywords", "isFeatured", "isActive", "createdAt", "updatedAt", "publishedAt") FROM stdin;
cmr9esnv10002t1wvup6a0f8w	Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card	gigabyte-geforce-rtx-5060-aero-oc-8g-gddr7-graphics-card	GIGABYTE-GEFORCE-RTX	Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card\nThe Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card is a stylish mid-range dynamo that fuses aerodynamic elegance with blistering speed, making the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card a dream upgrade for gamers, video editors, and AI enthusiasts who want immersive visuals and whisper-quiet operation in a compact powerhouse. Powered by NVIDIA's Ada Lovelace architecture with 3840 CUDA cores overclocked for that extra punch, this card harnesses 8GB of cutting-edge GDDR7 memory at 28 Gbps on a 128-bit bus to conquer 7680x4320 8K resolutions and multi-monitor setups up to four displays with ease, perfect for the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card's role in elevating 1440p gaming to 120+ FPS in titles like Forza Horizon 5 with ray tracing enabled or accelerating 4K renders in DaVinci Resolve by 35% via AV1 encoding. Whether you're dominating competitive arenas in Apex Legends with NVIDIA Reflex for sub-5ms latency or upscaling frames 3x via DLSS 3.5 for buttery-smooth 4K at 60 FPS in The Last of Us Part II, the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card shines with DirectX 12 Ultimate and OpenGL 4.6 support for seamless compatibility across Windows, Linux, and creative tools like Maya or Unity. Its AERO OC cooling system—boasting triple fans with alternate spinning, a massive vapor chamber, and composite copper pipes—keeps temps under 68°C and noise below 42dB during marathon sessions, while the 0dB idle mode ensures total silence for office builds, and the premium metal backplate with thermal pads adds structural fortitude for enduring builds. The slim ATX form factor (dimensions: 281mm length x 117mm width x 40mm height in a premium black finish) slots into any mid-tower case effortlessly, powered by a single 8-pin connector and 550W PSU recommendation for efficient surges, with PCIe 5.0 interface future-proofing against bandwidth chokepoints. Connectivity is premium with three DisplayPort 2.1b ports for 8K@60Hz multi-streaming and one HDMI 2.1b for 4K@144Hz with VRR, enabling the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card to drive VR headsets or ultrawide panoramas that expand your creative canvas. For digital artists, the 8GB VRAM tames high-res textures in Substance Painter or 3D sculpting in ZBrush without stuttering, while gamers love the revolutionary Frame Generation for 1440p at 100 FPS in demanding shooters. As a value champion under $500, the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card isn't just a card—it's a aerodynamic revolution in mid-range graphics, backed by a 3-year warranty and Gigabyte's rigorous validation, empowering you to soar through pixels with precision and poise in 2025's high-stakes digital realm, whether battling in Battlefield or modeling in Modo.\n\n\n\nWhy Buy the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card from Tech Land BD?\nTech Land BD is your top choice for the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card, with genuine 3-year warranty, free Bangladesh-wide delivery, and 0% interest EMI to suit your budget. Our pros offer free compatibility checks, secure packaging, and 24/7 support for flawless setup. With thousands of thrilled gamers, we ensure authenticity—seize yours now at Tech Land BD for exclusive deals and seamless upgrades!\n\n\n\nFrequently Asked Questions (FAQs) for Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card\n\n1. What PSU is required for the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card?\nThe Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card recommends a 550W PSU with one 8-pin connector for stable operation. Opt for an 80+ Bronze or Gold certified unit to manage overclocks and avoid instability during gaming or rendering sessions.\n\n2. Does the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card support 4K gaming?\nYes, the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card handles 4K gaming brilliantly with DLSS 3.5, achieving 60+ FPS in AAA titles like Elden Ring on high settings. Its 8GB GDDR7 VRAM and 3840 CUDA cores support ray tracing and textures for smooth, immersive 4K play.\n\n3. How quiet is the Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card under load?\nThe Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card's AERO OC cooling operates below 42dB during intense use, with triple fans and 0dB idle mode for complete silence. Temperatures stay under 68°C, ideal for quiet gaming or content creation in shared spaces.	Memory Clock: 28 Gbps Memory Size: 8 GB Memory Type: GDDR7 Card Bus: PCI-E 5.0	56000.00	58000.00	2000.00	IN_STOCK	10	5	cmr9bvs3p001qnjjlnzrmtdrs	cmr9bvs2f000wnjjlhveyideo				f	t	2026-07-06 16:03:00.683	2026-07-06 18:09:28.845	2026-07-06 16:03:00.679
cmr9bvsa7004jnjjlzqzyt643	AMD Ryzen 5 5600X 6 Core 12 Thread Desktop Processor	amd-ryzen-5-5600x	PROC-AMD-5600X	AMD Ryzen 5 5600X Desktop Processor comes with 6 cores and 12 threads. This 5th Generation processor has a base clock speed of 3.7 GHz and a maximum boost clock of up to 4.6 GHz. It features 35MB of combined cache and supports DDR4 memory.	6 Cores, 12 Threads, up to 4.6 GHz, AM4 Socket	22500.00	25000.00	\N	IN_STOCK	30	5	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 5600X Processor Price in Bangladesh	Buy AMD Ryzen 5 5600X 6 Core 12 Thread Processor at best price in Bangladesh.		t	t	2026-07-06 14:41:27.536	2026-07-08 16:19:14.052	2026-07-06 14:41:27.534
cmr9bvs9s0042njjlfqeg1cdv	Intel Core i5-12400F 6 Core 12 Thread 12th Gen Processor	intel-core-i5-12400f	PROC-INTEL-12400F	The Intel Core i5-12400F Desktop Processor comes with 6 cores and 12 threads. It has an 18MB Intel Smart Cache and the total L2 Cache is 7.5MB. This processor comes with a maximum turbo frequency of 4.40 GHz, and the processor base frequency is 2.50 GHz. It supports up to DDR5 4800 MT/s and DDR4 3200 MT/s memory types with a maximum memory size of 128 GB.	6 Cores, 12 Threads, up to 4.4 GHz, LGA1700 Socket	24100.00	27390.00	\N	IN_STOCK	50	5	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i5-12400F Processor Price in Bangladesh	Buy Intel Core i5-12400F 6 Core 12 Thread 12th Gen Processor at best price in Bangladesh. In stock and ready to ship.		t	t	2026-07-06 14:41:27.52	2026-07-08 16:19:57.288	2026-07-06 14:41:27.518
cmrcbkzit001a5menuqtjvxca	Intel Core i5 14400F 14th Gen Raptor Lake Processor	intel-core-i5-14400f-14th-gen-raptor-lake-processor	INTEL-CORE-I5-14400F	Intel Core i5 14400F 14th Gen Raptor Lake Processor\nThe Intel Core i5-14400F 2.5 GHz 10-Core LGA 1700 Processor boosts your work, gaming, and multimedia production capabilities. This 14th-generation desktop CPU, built on the Intel 7 technology, offers increased power efficiency while fitting the LGA 1700 socket. The Core i5-14400F has an improved Hybrid Core Architecture, with six 2.5 GHz Performance-cores driving programs and games and four low-voltage Efficient-cores handling background chores for smooth multitasking. The built-in Intel Thread Director guarantees that the two function in tandem by dynamically and intelligently distributing tasks to the correct core at the right time. With 20MB of cache and a Turbo Boost frequency of 5 GHz, this CPU is designed to handle a wide range of applications. The Core i5-14400F also supports PCI Express 5.0 and up to 192GB of dual-channel DDR5 memory at 4800 MHz.\n\nHybrid Core Design\nThe Intel Core i5 14400F Processor gives you the speed to handle high-end games and demanding programs, while the processor's efficient cores manage low-priority and background operations such as streaming video, playing music, and transcoding media.\n\nIntel Thread Director\nThe Intel Thread Director is incorporated into the CPU cores and works with the operating system to guarantee that each of the 16 threads is allocated to the correct core at the proper time.\n\nPCIe 4.0 and 5.0\nThis Intel Core i5 14400F 14th Gen Processor provides up to four PCIe 4.0 and sixteen PCIe 5.0 lanes, for a total of 20 lanes for excellent data throughput with compatible devices.\n\nGaussian and Neural Accelerator 3.0\nThe Intel Core i5 14400F 14th Gen Raptor Lake Processor features Gaussian and Neural Accelerator 3.0 (GNA) technology, which aid in noise reduction while also improving backdrop blurring during video conferencing.\n\nBuy Intel Core i5 14400F 14th Gen Processor from the best Processor Shop in Bangladesh\nIn Bangladesh, you can get the original Intel Core i5 14400F 14th Gen Raptor Lake Processor From Star Tech. We have a large collection of the latest Intel Processor to purchase for your Desktop PC. Order Online Or Visit your Nearest Star Tech Shop to get yours at the lowest price. The Intel Core i5 14400F 14th Gen Processor comes with a 3-year warranty (No Warranty for Fan or Cooler).	Model: Core i5 14400F (Tray Box) Clock Speed: 3.5 GHz up to 4.7 GHz Cache: 20 MB Intel Smart Cache CPU Cores: 10, CPU Threads: 16 Socket: LGA1700	21000.00	23000.00	2000.00	IN_STOCK	11	2	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	\N	\N	\N	f	t	2026-07-08 16:56:22.229	2026-07-08 16:56:22.229	2026-07-08 16:56:22.226
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
cmr9bvs3y0027njjlmnphc78d	cmr9bvs3l001mnjjlqu2ps65y	Number Of Threads	number_of_threads	TEXT	\N	t	t	3	2026-07-06 14:41:27.31	2026-07-06 14:41:27.31
cmr9bvs3z0028njjl78cbu80i	cmr9bvs3l001mnjjlqu2ps65y	Number Of Cores	number_of_cores	TEXT	\N	t	t	2	2026-07-06 14:41:27.31	2026-07-06 14:41:27.31
cmr9bvs3y0026njjlozqqv8z0	cmr9bvs3l001mnjjlqu2ps65y	Base Frequency	base_clock	NUMBER	GHz	f	t	4	2026-07-06 14:41:27.31	2026-07-06 14:41:27.31
cmr9bvs3y0023njjljhlzuud0	cmr9bvs3l001mnjjlqu2ps65y	CPU Socket	socket_type	TEXT	\N	t	t	1	2026-07-06 14:41:27.31	2026-07-06 14:41:27.31
cmr9bvs3y0024njjl9e3ah51v	cmr9bvs3l001mnjjlqu2ps65y	Maximum Turbo Frequency	boost_clock	NUMBER	GHz	f	f	5	2026-07-06 14:41:27.31	2026-07-06 14:41:27.31
cmr9bvs5i002anjjlcuk2lj5u	cmr9bvs3l001mnjjlqu2ps65y	TDP (Thermal Design Power)	tdp	TEXT	\N	f	t	7	2026-07-06 14:41:27.311	2026-07-06 14:41:27.311
cmr9bvs64002cnjjl2ip49dn5	cmr9bvs3l001mnjjlqu2ps65y	Processor Graphics	integrated_graphics	TEXT	\N	t	f	14	2026-07-06 14:41:27.311	2026-07-06 14:41:27.311
cmr9bvs69002enjjlzzee8gs4	cmr9bvs3l001mnjjlqu2ps65y	Processor Model	model_number	TEXT	\N	f	t	9	2026-07-06 14:41:27.311	2026-07-06 14:41:27.311
cmr9bvs6f002hnjjl1x3olffk	cmr9bvs3l001mnjjlqu2ps65y	Processor Series	generation	TEXT	\N	t	t	10	2026-07-06 14:41:27.311	2026-07-06 14:41:27.311
cmr9bvs6g002injjlwouuh804	cmr9bvs3l001mnjjlqu2ps65y	Cache	cache_size	TEXT	\N	t	t	6	2026-07-06 14:41:27.311	2026-07-06 14:41:27.311
cmr9bvs6i002knjjlemi601rt	cmr9bvs3l001mnjjlqu2ps65y	Max Memory Speed	max_memory_speed	TEXT	\N	f	f	12	2026-07-06 14:41:27.311	2026-07-06 14:41:27.311
cmr9bvs6u002mnjjl4mw9r2r4	cmr9bvs3l001mnjjlqu2ps65y	Processor Brand	processor_model	TEXT	\N	t	t	8	2026-07-06 14:41:27.311	2026-07-06 14:41:27.311
cmr9bvs6x002onjjln15z5srx	cmr9bvs3l001mnjjlqu2ps65y	Memory Type	memory_type	TEXT	\N	t	f	11	2026-07-06 14:41:27.311	2026-07-06 14:41:27.311
cmr9bvs91002qnjjlspy1ptf2	cmr9bvs3l001mnjjlqu2ps65y	Max. Memory Size	max_memory_size	TEXT	\N	f	f	13	2026-07-06 14:41:27.311	2026-07-06 14:41:27.311
cmr9bvs970039njjl7x3qpa9y	cmr9bvs3n001onjjl46q890qi	Processor Series	generation	TEXT	\N	t	t	10	2026-07-06 14:41:27.499	2026-07-06 14:41:27.499
cmr9bvs97002unjjlkze12d8e	cmr9bvs3n001onjjl46q890qi	Number Of Cores	number_of_cores	TEXT	\N	t	t	2	2026-07-06 14:41:27.499	2026-07-06 14:41:27.499
cmr9bvs970032njjll06wzb1c	cmr9bvs3n001onjjl46q890qi	Processor Brand	processor_model	TEXT	\N	t	t	8	2026-07-06 14:41:27.499	2026-07-06 14:41:27.499
cmr9bvs97002vnjjluf76j46i	cmr9bvs3n001onjjl46q890qi	CPU Socket	socket_type	TEXT	\N	t	t	1	2026-07-06 14:41:27.499	2026-07-06 14:41:27.499
cmr9bvs970034njjlup59w81g	cmr9bvs3n001onjjl46q890qi	Memory Type	memory_type	TEXT	\N	t	f	11	2026-07-06 14:41:27.499	2026-07-06 14:41:27.499
cmr9bvs97003anjjly8pgyejf	cmr9bvs3n001onjjl46q890qi	Processor Model	model_number	TEXT	\N	f	t	9	2026-07-06 14:41:27.499	2026-07-06 14:41:27.499
cmr9bvs97002xnjjlbgm11wr2	cmr9bvs3n001onjjl46q890qi	Base Frequency	base_clock	NUMBER	GHz	f	t	4	2026-07-06 14:41:27.499	2026-07-06 14:41:27.499
cmr9bvs970035njjlw0stdb9f	cmr9bvs3n001onjjl46q890qi	Max Memory Speed	max_memory_speed	TEXT	\N	f	f	12	2026-07-06 14:41:27.499	2026-07-06 14:41:27.499
cmr9bvs970031njjlxjwmui6s	cmr9bvs3n001onjjl46q890qi	TDP (Thermal Design Power)	tdp	TEXT	\N	f	t	7	2026-07-06 14:41:27.499	2026-07-06 14:41:27.499
cmr9bvs970038njjlxvru0024	cmr9bvs3n001onjjl46q890qi	Maximum Turbo Frequency	boost_clock	NUMBER	GHz	f	f	5	2026-07-06 14:41:27.499	2026-07-06 14:41:27.499
cmr9bvs98003gnjjlh7t4qtax	cmr9bvs3n001onjjl46q890qi	Max. Memory Size	max_memory_size	TEXT	\N	f	f	13	2026-07-06 14:41:27.5	2026-07-06 14:41:27.5
cmr9bvs98003fnjjl9qgz7y19	cmr9bvs3n001onjjl46q890qi	Processor Graphics	integrated_graphics	TEXT	\N	t	f	14	2026-07-06 14:41:27.5	2026-07-06 14:41:27.5
cmr9bvs99003injjlawntuhv3	cmr9bvs3n001onjjl46q890qi	Cache	cache_size	TEXT	\N	t	t	6	2026-07-06 14:41:27.499	2026-07-06 14:41:27.499
cmr9bvs97003cnjjlsdpfrbzc	cmr9bvs3n001onjjl46q890qi	Number Of Threads	number_of_threads	TEXT	\N	t	t	3	2026-07-06 14:41:27.499	2026-07-06 14:41:27.499
cmr9bvs9f003unjjlakeb3cd1	cmr9bvs3u001wnjjl81hph6nx	Interface	interface	TEXT	\N	t	t	2	2026-07-06 14:41:27.508	2026-07-06 14:41:27.508
cmr9bvs9f003tnjjl91abqfrv	cmr9bvs3u001wnjjl81hph6nx	Capacity	capacity	NUMBER	GB	t	t	1	2026-07-06 14:41:27.508	2026-07-06 14:41:27.508
cmr9bvs9f003snjjldgshk08i	cmr9bvs3u001wnjjl81hph6nx	Read Speed	read_speed	NUMBER	MB/s	f	f	3	2026-07-06 14:41:27.508	2026-07-06 14:41:27.508
cmr9bvs9k003ynjjlu0sjqf2r	cmr9bvs3w001ynjjlz6a42lgs	Speed	speed	NUMBER	MHz	t	t	3	2026-07-06 14:41:27.512	2026-07-06 14:41:27.512
cmr9bvs9k003znjjlfy2zoou4	cmr9bvs3w001ynjjlz6a42lgs	Memory Type	memory_type	TEXT	\N	t	t	2	2026-07-06 14:41:27.512	2026-07-06 14:41:27.512
cmr9bvs9k0040njjlyqse70bu	cmr9bvs3w001ynjjlz6a42lgs	Capacity	capacity	NUMBER	GB	t	t	1	2026-07-06 14:41:27.512	2026-07-06 14:41:27.512
cmr9bvs9c003mnjjl66ggue09	cmr9bvs3p001qnjjlnzrmtdrs	Memory Size	memory_size	TEXT	GB	t	t	1	2026-07-06 14:41:27.505	2026-07-06 16:19:28.502
cmr9fdu2i0003znc8m0i2htvy	cmr9bvs3p001qnjjlnzrmtdrs	Bus Type	bus_type	TEXT	\N	f	f	2	2026-07-06 16:19:28.506	2026-07-06 16:19:28.506
cmr9bvs9c003nnjjldprfoq71	cmr9bvs3p001qnjjlnzrmtdrs	Memory Type	memory_type	TEXT	\N	t	t	3	2026-07-06 14:41:27.505	2026-07-06 16:19:28.509
cmr9fdu2m0007znc8kc698wgu	cmr9bvs3p001qnjjlnzrmtdrs	Memory Clock	memory_clock	TEXT	MHz	f	f	4	2026-07-06 16:19:28.511	2026-07-06 16:19:28.511
cmr9fdu2p0009znc81h27hava	cmr9bvs3p001qnjjlnzrmtdrs	Memory Bus (Bit)	memory_bus	TEXT	\N	f	f	5	2026-07-06 16:19:28.513	2026-07-06 16:19:28.513
cmr9fdu2q000bznc8nqnk6n3y	cmr9bvs3p001qnjjlnzrmtdrs	Resolution	resolution	TEXT	\N	f	f	6	2026-07-06 16:19:28.515	2026-07-06 16:19:28.515
cmr9fdu2s000dznc862mxbzdr	cmr9bvs3p001qnjjlnzrmtdrs	Multi Display	multi_display	NUMBER	\N	f	f	7	2026-07-06 16:19:28.516	2026-07-06 16:19:28.516
cmr9bvs9c003onjjl73rcf6jj	cmr9bvs3p001qnjjlnzrmtdrs	GPU Chipset	gpu_chipset	TEXT	\N	t	t	8	2026-07-06 14:41:27.505	2026-07-06 16:19:28.518
cmr9fdu2v000hznc8hqkuplm8	cmr9bvs3p001qnjjlnzrmtdrs	CUDA Cores (Nvidia)	cuda_cores	NUMBER	\N	f	f	9	2026-07-06 16:19:28.52	2026-07-06 16:19:28.52
cmr9fdu2x000jznc8fy1302of	cmr9bvs3p001qnjjlnzrmtdrs	Interface (PCI Express)	pci_express	TEXT	\N	f	f	10	2026-07-06 16:19:28.521	2026-07-06 16:19:28.521
cmr9fdu2z000lznc8a23p949m	cmr9bvs3p001qnjjlnzrmtdrs	DirectX	directx	TEXT	\N	f	f	11	2026-07-06 16:19:28.523	2026-07-06 16:19:28.523
cmr9fdu30000nznc8r71v4upj	cmr9bvs3p001qnjjlnzrmtdrs	OpenGL	opengl	TEXT	\N	f	f	12	2026-07-06 16:19:28.524	2026-07-06 16:19:28.524
cmr9fdu31000pznc8qjtoyzrk	cmr9bvs3p001qnjjlnzrmtdrs	Recommended Power	recommended_psu	TEXT	\N	f	f	13	2026-07-06 16:19:28.526	2026-07-06 16:19:28.526
cmr9fdu33000rznc8knkdzgst	cmr9bvs3p001qnjjlnzrmtdrs	DisplayPort	display_port	TEXT	\N	f	f	14	2026-07-06 16:19:28.527	2026-07-06 16:19:28.527
cmr9fdu34000tznc8rgc4pj4c	cmr9bvs3p001qnjjlnzrmtdrs	Power Connector	power_connector	TEXT	\N	f	f	15	2026-07-06 16:19:28.528	2026-07-06 16:19:28.528
cmr9fdu35000vznc86eleam5x	cmr9bvs3p001qnjjlnzrmtdrs	HDMI	hdmi	TEXT	\N	f	f	16	2026-07-06 16:19:28.53	2026-07-06 16:19:28.53
cmr9fdu37000xznc84up87zd7	cmr9bvs3p001qnjjlnzrmtdrs	Dimension	dimension	TEXT	\N	f	f	17	2026-07-06 16:19:28.531	2026-07-06 16:19:28.531
cmr9fdu38000zznc8rwpfa7k5	cmr9bvs3p001qnjjlnzrmtdrs	Warranty	warranty	TEXT	\N	f	f	18	2026-07-06 16:19:28.532	2026-07-06 16:19:28.532
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

\unrestrict nmsIv9x4X8G8inbpbzsihfEFPXY4fPjUlVfgzC0lfjSWGjNRqchEtWd1f7JsT4F

