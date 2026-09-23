--
-- PostgreSQL database dump
--

\restrict q17cAbu4biJf5W14xR9ytPjYvQlDm1YUKHvHSzZek4jCscO8TbUJDcuHSDXEx9Y

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
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS "order_items_productId_fkey";
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS "order_items_orderId_fkey";
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
DROP INDEX IF EXISTS public.orders_status_idx;
DROP INDEX IF EXISTS public."orders_orderNumber_key";
DROP INDEX IF EXISTS public.orders_mobile_idx;
DROP INDEX IF EXISTS public."orders_createdAt_idx";
DROP INDEX IF EXISTS public."order_items_productId_idx";
DROP INDEX IF EXISTS public."order_items_orderId_idx";
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
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
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
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.order_items;
DROP TABLE IF EXISTS public.menu_items;
DROP TABLE IF EXISTS public.filterable_specifications;
DROP TABLE IF EXISTS public.categories;
DROP TABLE IF EXISTS public.brands;
DROP TABLE IF EXISTS public.accounts;
DROP TYPE IF EXISTS public."UserRole";
DROP TYPE IF EXISTS public."StockStatus";
DROP TYPE IF EXISTS public."PaymentMethod";
DROP TYPE IF EXISTS public."OrderStatus";
DROP TYPE IF EXISTS public."DeliveryMethod";
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
-- Name: DeliveryMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DeliveryMethod" AS ENUM (
    'HOME_DELIVERY',
    'STORE_PICKUP',
    'EXPRESS'
);


ALTER TYPE public."DeliveryMethod" OWNER TO postgres;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CASH_ON_DELIVERY'
);


ALTER TYPE public."PaymentMethod" OWNER TO postgres;

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
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text,
    "productName" text NOT NULL,
    "productSlug" text,
    "productSku" text,
    "imageUrl" text,
    "variantLabel" text,
    "unitPrice" numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    "lineTotal" numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text,
    address text NOT NULL,
    upazila text,
    district text NOT NULL,
    mobile text NOT NULL,
    email text,
    comment text,
    "paymentMethod" public."PaymentMethod" DEFAULT 'CASH_ON_DELIVERY'::public."PaymentMethod" NOT NULL,
    "deliveryMethod" public."DeliveryMethod" DEFAULT 'HOME_DELIVERY'::public."DeliveryMethod" NOT NULL,
    "deliveryFee" numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

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
cmudsty2t007d12erj1wdtwkj	AFOX	afox	\N	\N	t	2026-09-23 07:46:06.917	2026-09-23 07:46:06.917
cmudsty55008712erkwczrpk4	ARKTEK	arktek	\N	\N	t	2026-09-23 07:46:07.002	2026-09-23 07:46:07.002
cmudsty7z009w12ercqys44k0	GUNNIR	gunnir	\N	\N	t	2026-09-23 07:46:07.104	2026-09-23 07:46:07.104
cmudstyd500cp12er2y8o1ib9	Unika	unika	\N	\N	t	2026-09-23 07:46:07.29	2026-09-23 07:46:07.29
cmudstyly00if12er7qn7ekjz	Manli	manli	\N	\N	t	2026-09-23 07:46:07.606	2026-09-23 07:46:07.606
cmudstypz00lx12erbs68awur	ZOTAC	zotac	\N	\N	t	2026-09-23 07:46:07.751	2026-09-23 07:46:07.751
cmudstyqt00mn12ery4avore3	PowerColor	powercolor	\N	\N	t	2026-09-23 07:46:07.781	2026-09-23 07:46:07.781
cmudstysw00oo12ert0lrel91	INNO3D	inno3d	\N	\N	t	2026-09-23 07:46:07.857	2026-09-23 07:46:07.857
cmudsuqkh00019a62e1q94zff	ABIT	abit	\N	\N	t	2026-09-23 07:46:43.841	2026-09-23 07:46:43.841
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
cmu6pynmt004o14lfe3lhljsq	chipset	AMD B550	1	cmrdawgox0005t4sx9zy0pfy3
cmu6pynit002h14lfmwxakxdx	memory_size	64GB	11	cmrdawgow0003t4sxu1aulbfu
cmu6pyniv002i14lf4h1oxeuh	memory_type	DDR4	11	cmrdawgow0003t4sxu1aulbfu
cmu6pynrx009414lfamxpfbxf	chipset	AMD B450	2	cmrdawgox0005t4sx9zy0pfy3
cmu6pynks003m14lfkb2xgtqq	memory_type	DDR5	2	cmrdawgox0005t4sx9zy0pfy3
cmu6r4g6y0018eqewvhm1bbvl	memory_type	DDR4	23	cmrethhiz0003vdfb4lfktnqj
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
cmu6pynin002g14lfe3vbtffn	chipset	Intel H610	17	cmrdawgow0003t4sxu1aulbfu
cmu6pynjl003114lf3rvc7u0j	memory_size	96GB	8	cmrdawgow0003t4sxu1aulbfu
cmu6pynjm003214lfni8ba87n	memory_type	DDR5	8	cmrdawgow0003t4sxu1aulbfu
cmu6pyniy002j14lftimo91q7	form_factor	Micro ATX	19	cmrdawgow0003t4sxu1aulbfu
cmudstxyn004612er6ama5ah1	memory_size	1GB	1	cmr9bvs3q001snjjl5bz9ep3j
cmudsty02005412er9flaoxjx	memory_type	GDDR5	7	cmr9bvs3q001snjjl5bz9ep3j
cmudstxyu004812erntgd65ra	resolution	2560 x 1600	2	cmr9bvs3q001snjjl5bz9ep3j
cmudsty76009e12er97vi9d76	port_types	128‑bit	1	cmr9bvs3r001unjjlz6a3qh23
cmudstxzf004o12erx0vrkv44	memory_size	2GB	5	cmr9bvs3q001snjjl5bz9ep3j
cmtn5e30p000qudp6be957kxd	memory_type	GDDR6	11	cmr9bvs3p001qnjjlnzrmtdrs
cmudsty7p009s12ervdw82zox	resolution	4K@60Hz, CUDA Cores: 384	1	cmr9bvs3q001snjjl5bz9ep3j
cmudstymo00j512erj6kfhupp	memory_size	30508GB	1	cmr9bvs3q001snjjl5bz9ep3j
cmudsty7t009v12er2gr9in27	port_types	1 x DVI, 1 x HDMI	1	cmr9bvs3q001snjjl5bz9ep3j
cmudsty8800a612ersr6uanzk	memory_size	4GB	1	cmr9bvs3p001qnjjlnzrmtdrs
cmudsty12005z12erlmlrr2sb	memory_size	7102GB	1	cmr9bvs3q001snjjl5bz9ep3j
cmudsty72009a12er4xjtqd6c	memory_size	4GB	4	cmr9bvs3r001unjjlz6a3qh23
cmudsty8a00a812erhkmj9k0c	gpu_chipset	Intel Arc	10	cmr9bvs3p001qnjjlnzrmtdrs
cmudsty8y00an12ergdop3ro6	resolution	7680x4320	1	cmr9bvs3r001unjjlz6a3qh23
cmudstyey00df12er8kmh7opt	memory_size	5808GB	1	cmr9bvs3r001unjjlz6a3qh23
cmudsty0l005l12ermoyad8tb	resolution	2048 x1536	2	cmr9bvs3q001snjjl5bz9ep3j
cmudsty9n00b412erym2futv2	resolution	3840 x 2160(1.4 HDR)	1	cmr9bvs3r001unjjlz6a3qh23
cmudstxyw004a12er3chzmj7h	port_types	1 x DVI, 1 x HDMI, 1 x D-Sub	4	cmr9bvs3q001snjjl5bz9ep3j
cmudstyr100mz12er4faqi2x6	memory_size	90508GB	1	cmr9bvs3r001unjjlz6a3qh23
cmudsty9r00b712eruoycnckp	port_types	DVI, DisplayPort, HDMI	1	cmr9bvs3r001unjjlz6a3qh23
cmudsty33007p12er8duzv8i5	memory_size	2GB	1	cmr9bvs3r001unjjlz6a3qh23
cmudsty35007r12erm3wp0n4j	resolution	2560 x 1600	1	cmr9bvs3r001unjjlz6a3qh23
cmudsty4h008312erccpgwc03	memory_size	7302GB	2	cmr9bvs3q001snjjl5bz9ep3j
cmudstyg300e212er740w5akd	memory_type	GDDR4	1	cmr9bvs3q001snjjl5bz9ep3j
cmudsty5w008j12erovawkfhk	memory_size	5504GB	1	cmr9bvs3r001unjjlz6a3qh23
cmudstyh500ev12erctkfjwqr	memory_type	GDDR6	29	cmr9bvs3r001unjjlz6a3qh23
cmudsty7s009u12ern7lvvriz	chipset_series	GT 1000	2	cmr9bvs3q001snjjl5bz9ep3j
cmudsty36007s12er7sl6ti3z	gpu_chipset	AMD Radeon	40	cmr9bvs3r001unjjlz6a3qh23
cmudsty1j006d12erl025p7tg	memory_size	7304GB	2	cmr9bvs3q001snjjl5bz9ep3j
cmudstxys004712erop7i0ctw	memory_type	GDDR3	7	cmr9bvs3q001snjjl5bz9ep3j
cmudstyin00g012eri4dix1kw	chipset_series	RX 6000	2	cmr9bvs3r001unjjlz6a3qh23
cmudstygm00ej12erblgicstj	resolution	3840 x 2160@120Hz	1	cmr9bvs3r001unjjlz6a3qh23
cmudstyj900gf12er08d82f5r	chipset_series	GTX 1600	4	cmr9bvs3q001snjjl5bz9ep3j
cmudstygp00em12erhs4cxu0n	port_types	3 x DP, 1 x HDMI	1	cmr9bvs3r001unjjlz6a3qh23
cmudstxzl004s12ergms06dgm	chipset_series	GT 700	10	cmr9bvs3q001snjjl5bz9ep3j
cmudstybb00bw12eraohchihy	memory_size	5508GB	1	cmr9bvs3r001unjjlz6a3qh23
cmudstyj300gc12eryumdwj10	memory_size	6GB	10	cmr9bvs3q001snjjl5bz9ep3j
cmudstypl00lu12erj22yvcub	memory_size	8GB	39	cmr9bvs3q001snjjl5bz9ep3j
cmudstyxg00su12erjcihpyur	memory_type	GDDR7	66	cmr9bvs3q001snjjl5bz9ep3j
cmudstyn700jk12erfjo7va8x	memory_size	68GB	1	cmr9bvs3q001snjjl5bz9ep3j
cmudstyru00nr12er47fkekjv	memory_size	76008GB	1	cmr9bvs3r001unjjlz6a3qh23
cmudstyct00co12erhfm691l5	port_types	1 x DVI, 1 x HDMI, 1x DisplayPort	4	cmr9bvs3q001snjjl5bz9ep3j
cmudstykt00hk12ereaylid0n	port_types	192-Bits; Bandwidth: 336.0 GB/s	1	cmr9bvs3q001snjjl5bz9ep3j
cmudsty9j00b212err1nwmrvn	memory_size	8GB	5	cmr9bvs3r001unjjlz6a3qh23
cmudsty21006u12erqqkqrdz2	memory_size	4GB	4	cmr9bvs3q001snjjl5bz9ep3j
cmudstxyv004912ermt5go3lm	gpu_chipset	NVIDIA GeForce	112	cmr9bvs3q001snjjl5bz9ep3j
cmudstyoi00kt12er2w326wza	port_types	HDMI 2.0, DisplayPort 2.0	1	cmr9bvs3p001qnjjlnzrmtdrs
cmudsty34007q12erp62lvcyq	memory_type	GDDR5	9	cmr9bvs3r001unjjlz6a3qh23
cmudsty8b00a912er8p0k2bwa	chipset_series	Arc A	5	cmr9bvs3p001qnjjlnzrmtdrs
cmudstypa00lj12erpbtqhasa	port_types	1 x HDMI 2.0, 3 x DisplayPort 2.0	1	cmr9bvs3p001qnjjlnzrmtdrs
cmudstyj500gd12ermcbbc4jj	memory_type	GDDR6	30	cmr9bvs3q001snjjl5bz9ep3j
cmudstyss00on12erz5d9ploq	port_types	PCI Express Gen 4	1	cmr9bvs3q001snjjl5bz9ep3j
cmudstyrx00nu12erxdofxrzp	chipset_series	RX 7000	3	cmr9bvs3r001unjjlz6a3qh23
cmudstylu00ie12erk5wmqukr	chipset_series	RTX 3000	14	cmr9bvs3q001snjjl5bz9ep3j
cmudstywn00s212erewk6dxd1	memory_size	50508GB	1	cmr9bvs3q001snjjl5bz9ep3j
cmudsty1n006h12erq79jybmt	port_types	128-bit	2	cmr9bvs3q001snjjl5bz9ep3j
cmudstyr400n212erf3vxq0ar	chipset_series	RX 9000	21	cmr9bvs3r001unjjlz6a3qh23
cmudstyr500n312ere83q4dg9	port_types	128-bit	4	cmr9bvs3r001unjjlz6a3qh23
cmudsty37007t12erk358me3t	chipset_series	RX 500	13	cmr9bvs3r001unjjlz6a3qh23
cmudstzxa01pb12era0yclqdx	memory_size	509032GB	1	cmr9bvs3q001snjjl5bz9ep3j
cmudstzxe01pf12ermhjziasv	port_types	5126-bit	1	cmr9bvs3q001snjjl5bz9ep3j
cmudstzxp01pr12erbtd4wpqf	memory_size	32GB	1	cmr9bvs3q001snjjl5bz9ep3j
cmudstzxt01pv12er6dslhseu	port_types	512-bit	1	cmr9bvs3q001snjjl5bz9ep3j
cmudstyya00tl12erqcemdtep	memory_size	50608GB	2	cmr9bvs3q001snjjl5bz9ep3j
cmudstz88012j12er2k7neqc9	memory_size	16GB	17	cmr9bvs3r001unjjlz6a3qh23
cmudstzbr015v12er0cf5tnp1	port_types	256-bit	6	cmr9bvs3r001unjjlz6a3qh23
cmudstz1t00wn12er28v5xpxh	memory_size	12GB	12	cmr9bvs3q001snjjl5bz9ep3j
cmudstzpp01ic12erbeddjfme	port_types	192-bit	1	cmr9bvs3q001snjjl5bz9ep3j
cmudstzqd01iy12er96ha7597	memory_size	507012GB	1	cmr9bvs3q001snjjl5bz9ep3j
cmudstzqu01jc12er98ouyvgd	memory_type	GDDR6X	1	cmr9bvs3q001snjjl5bz9ep3j
cmudstzqx01je12eri2lyaa6o	chipset_series	RTX 4000	1	cmr9bvs3q001snjjl5bz9ep3j
cmudsu02401ts12erumaebnrb	memory_size	508016GB	1	cmr9bvs3q001snjjl5bz9ep3j
cmudstzau015112ergc4fbyis	port_types	192-bit	2	cmr9bvs3r001unjjlz6a3qh23
cmudstzrd01ju12ereid5p3nl	port_types	Native DP 2.1b x3, Native HDMI 2.1b x1	1	cmr9bvs3q001snjjl5bz9ep3j
cmudstzap014x12erdl9vp6v6	memory_size	12GB	3	cmr9bvs3r001unjjlz6a3qh23
cmudstze5018412eru3pqen4q	memory_size	24GB	2	cmr9bvs3p001qnjjlnzrmtdrs
cmudsu02a01tw12ermrg5wrjz	port_types	256-bit	1	cmr9bvs3q001snjjl5bz9ep3j
cmudstzff019612er5xvzuirw	memory_size	16GB	25	cmr9bvs3q001snjjl5bz9ep3j
cmudstyt900p212erl874p34m	chipset_series	RTX 5000	77	cmr9bvs3q001snjjl5bz9ep3j
cmudstydv00d512erwu81r2ny	port_types	2x DisplayPort, 1x HDMI	2	cmr9bvs3r001unjjlz6a3qh23
cmudsurp0004ox413xaz9nu29	port_types	1x DisplayPort, 1x HDMI	1	cmr9bvs3r001unjjlz6a3qh23
cmudstzh501aq12er9m7hmsyl	memory_size	907016GB	1	cmr9bvs3r001unjjlz6a3qh23
cmudstzsh01kv12ervqwvtozw	memory_size	32GB	2	cmr9bvs3p001qnjjlnzrmtdrs
cmudstzwf01oj12erxio84x4f	memory_size	970032GB	1	cmr9bvs3r001unjjlz6a3qh23
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
cmucrif0m0001sx006gb2ue1c	Accessories	accessories	\N	0	2	\N	\N	t	f	2026-09-22 14:21:23.207	2026-09-22 14:21:23.207
cmucrif0r0003sx0064byf4yl	Watch	watch	cmucrif0m0001sx006gb2ue1c	1	0	/products?category=accessories&sub=watch	\N	t	f	2026-09-22 14:21:23.211	2026-09-22 14:33:50.174
cmucrif0u0005sx00x99ms0xc	Keyboard	keyboard	cmucrif0m0001sx006gb2ue1c	1	1	/products?category=accessories&sub=keyboard	\N	t	f	2026-09-22 14:21:23.214	2026-09-22 14:33:50.18
cmucrif0w0007sx00idv43j3m	Mouse	mouse	cmucrif0m0001sx006gb2ue1c	1	2	/products?category=accessories&sub=mouse	\N	t	f	2026-09-22 14:21:23.217	2026-09-22 14:33:50.183
cmucrif0y0009sx00b61ve2bd	Headphone	headphone	cmucrif0m0001sx006gb2ue1c	1	3	/products?category=accessories&sub=headphone	\N	t	f	2026-09-22 14:21:23.219	2026-09-22 14:33:50.185
cmucrif10000bsx00edsl63e3	Bluetooth Headphone	bluetooth-headphone	cmucrif0m0001sx006gb2ue1c	1	4	/products?category=accessories&sub=bluetooth-headphone	\N	t	t	2026-09-22 14:21:23.221	2026-09-22 14:33:50.189
cmucrif13000dsx00f5e3sd7a	Mouse Pad	mouse-pad	cmucrif0m0001sx006gb2ue1c	1	5	/products?category=accessories&sub=mouse-pad	\N	t	f	2026-09-22 14:21:23.224	2026-09-22 14:33:50.191
cmucrif15000fsx0082hnocbo	Wrist Rest	wrist-rest	cmucrif0m0001sx006gb2ue1c	1	6	/products?category=accessories&sub=wrist-rest	\N	t	t	2026-09-22 14:21:23.226	2026-09-22 14:33:50.193
cmucrif17000hsx00al998mx7	Headphone Stand	headphone-stand	cmucrif0m0001sx006gb2ue1c	1	7	/products?category=accessories&sub=headphone-stand	\N	t	t	2026-09-22 14:21:23.228	2026-09-22 14:33:50.195
cmucrif19000jsx00k9ok7a1r	Speaker & Home Theater	speaker-home-theater	cmucrif0m0001sx006gb2ue1c	1	8	/products?category=accessories&sub=speaker-home-theater	\N	t	t	2026-09-22 14:21:23.229	2026-09-22 14:33:50.197
cmucrif1a000lsx0066eo51bi	Bluetooth Speakers	bluetooth-speakers	cmucrif0m0001sx006gb2ue1c	1	9	/products?category=accessories&sub=bluetooth-speakers	\N	t	f	2026-09-22 14:21:23.23	2026-09-22 14:33:50.199
cmucrif1b000nsx00640n8tu2	Soundbar	soundbar	cmucrif0m0001sx006gb2ue1c	1	10	/products?category=accessories&sub=soundbar	\N	t	t	2026-09-22 14:21:23.231	2026-09-22 14:33:50.201
cmucrif1d000psx008xb2dsya	Webcam	webcam	cmucrif0m0001sx006gb2ue1c	1	11	/products?category=accessories&sub=webcam	\N	t	t	2026-09-22 14:21:23.234	2026-09-22 14:33:50.202
cmucrif1f000rsx00pr1pefzg	Cable	cable	cmucrif0m0001sx006gb2ue1c	1	12	/products?category=accessories&sub=cable	\N	t	t	2026-09-22 14:21:23.235	2026-09-22 14:33:50.204
cmucrif1g000tsx00gwxddgnt	Converter	converter	cmucrif0m0001sx006gb2ue1c	1	13	/products?category=accessories&sub=converter	\N	t	t	2026-09-22 14:21:23.237	2026-09-22 14:33:50.207
cmucrif1h000vsx006ypchgo3	Card Reader	card-reader	cmucrif0m0001sx006gb2ue1c	1	14	/products?category=accessories&sub=card-reader	\N	t	t	2026-09-22 14:21:23.238	2026-09-22 14:33:50.209
cmucrif1j000xsx00vsbarkux	Hubs & Docks	hubs-docks	cmucrif0m0001sx006gb2ue1c	1	15	/products?category=accessories&sub=hubs-docks	\N	t	t	2026-09-22 14:21:23.239	2026-09-22 14:33:50.21
cmucrif1k000zsx008huaeub9	Microphone	microphone	cmucrif0m0001sx006gb2ue1c	1	16	/products?category=accessories&sub=microphone	\N	t	t	2026-09-22 14:21:23.241	2026-09-22 14:33:50.211
cmucrif1m0011sx00twyw61k4	Digital Voice Recorder	digital-voice-recorder	cmucrif0m0001sx006gb2ue1c	1	17	/products?category=accessories&sub=digital-voice-recorder	\N	t	t	2026-09-22 14:21:23.242	2026-09-22 14:33:50.213
cmucrif1o0013sx00o4daac95	Presenter	presenter	cmucrif0m0001sx006gb2ue1c	1	18	/products?category=accessories&sub=presenter	\N	t	t	2026-09-22 14:21:23.244	2026-09-22 14:33:50.214
cmucrif1q0015sx009qmil6zy	Memory Card	memory-card	cmucrif0m0001sx006gb2ue1c	1	19	/products?category=accessories&sub=memory-card	\N	t	f	2026-09-22 14:21:23.246	2026-09-22 14:33:50.216
cmucrif1r0017sx00przu2st6	Capture Card	capture-card	cmucrif0m0001sx006gb2ue1c	1	20	/products?category=accessories&sub=capture-card	\N	t	t	2026-09-22 14:21:23.247	2026-09-22 14:33:50.219
cmucrif1s0019sx00qyx9n9m5	Pen Drive	pen-drive	cmucrif0m0001sx006gb2ue1c	1	21	/products?category=accessories&sub=pen-drive	\N	t	f	2026-09-22 14:21:23.249	2026-09-22 14:33:50.221
cmucrif1t001bsx008aep9kd1	Thermal Paste	thermal-paste	cmucrif0m0001sx006gb2ue1c	1	22	/products?category=accessories&sub=thermal-paste	\N	t	t	2026-09-22 14:21:23.25	2026-09-22 14:33:50.222
cmucrif1v001dsx00bsdi9u01	Show All Accessories	accessories-all	cmucrif0m0001sx006gb2ue1c	1	23	/products?category=accessories	\N	t	t	2026-09-22 14:21:23.251	2026-09-22 14:33:50.224
cmucrygne000110zng1icnrua	Amazfit	amazfit	cmucrif0r0003sx0064byf4yl	2	0	/products?category=accessories&sub=watch&brand=amazfit	\N	t	f	2026-09-22 14:33:51.818	2026-09-22 14:33:51.818
cmucrygnh000310zn5vxh5rf3	Apple	apple	cmucrif0r0003sx0064byf4yl	2	1	/products?category=accessories&sub=watch&brand=apple	\N	t	f	2026-09-22 14:33:51.821	2026-09-22 14:33:51.821
cmucrygni000510znqxtjo3ea	Black Shark	black-shark	cmucrif0r0003sx0064byf4yl	2	2	/products?category=accessories&sub=watch&brand=black-shark	\N	t	f	2026-09-22 14:33:51.822	2026-09-22 14:33:51.822
cmucrygnj000710znily8bic0	boAt	boat	cmucrif0r0003sx0064byf4yl	2	3	/products?category=accessories&sub=watch&brand=boat	\N	t	f	2026-09-22 14:33:51.823	2026-09-22 14:33:51.823
cmucrygnk000910znrmnlmv20	COLMI	colmi	cmucrif0r0003sx0064byf4yl	2	4	/products?category=accessories&sub=watch&brand=colmi	\N	t	f	2026-09-22 14:33:51.824	2026-09-22 14:33:51.824
cmucrygnl000b10zn2m7zhrrk	DIZO	dizo	cmucrif0r0003sx0064byf4yl	2	5	/products?category=accessories&sub=watch&brand=dizo	\N	t	f	2026-09-22 14:33:51.825	2026-09-22 14:33:51.825
cmucrygnn000d10zn4225m5nh	Fastrack	fastrack	cmucrif0r0003sx0064byf4yl	2	6	/products?category=accessories&sub=watch&brand=fastrack	\N	t	f	2026-09-22 14:33:51.827	2026-09-22 14:33:51.827
cmucrygno000f10zn3ktwdef0	Fire-Boltt	fire-boltt	cmucrif0r0003sx0064byf4yl	2	7	/products?category=accessories&sub=watch&brand=fire-boltt	\N	t	f	2026-09-22 14:33:51.828	2026-09-22 14:33:51.828
cmucrygnp000h10znn3qfct3e	Google	google	cmucrif0r0003sx0064byf4yl	2	8	/products?category=accessories&sub=watch&brand=google	\N	t	f	2026-09-22 14:33:51.83	2026-09-22 14:33:51.83
cmucrygnq000j10zn5x2lwvvk	Havit	havit	cmucrif0r0003sx0064byf4yl	2	9	/products?category=accessories&sub=watch&brand=havit	\N	t	f	2026-09-22 14:33:51.831	2026-09-22 14:33:51.831
cmucrygnr000l10znfr70eaq3	Haylou	haylou	cmucrif0r0003sx0064byf4yl	2	10	/products?category=accessories&sub=watch&brand=haylou	\N	t	f	2026-09-22 14:33:51.832	2026-09-22 14:33:51.832
cmucrygns000n10znzmrxisdu	HiFuture	hifuture	cmucrif0r0003sx0064byf4yl	2	11	/products?category=accessories&sub=watch&brand=hifuture	\N	t	f	2026-09-22 14:33:51.833	2026-09-22 14:33:51.833
cmucrygnt000p10znneetidv6	IMILAB	imilab	cmucrif0r0003sx0064byf4yl	2	12	/products?category=accessories&sub=watch&brand=imilab	\N	t	f	2026-09-22 14:33:51.833	2026-09-22 14:33:51.833
cmucrygnu000r10znat4cjwc0	HUAWEI	huawei	cmucrif0r0003sx0064byf4yl	2	13	/products?category=accessories&sub=watch&brand=huawei	\N	t	f	2026-09-22 14:33:51.834	2026-09-22 14:33:51.834
cmucrygnu000t10znr5x1695e	Kieslect	kieslect	cmucrif0r0003sx0064byf4yl	2	14	/products?category=accessories&sub=watch&brand=kieslect	\N	t	f	2026-09-22 14:33:51.835	2026-09-22 14:33:51.835
cmucrygnv000v10znnw6tjoij	Weofly	weofly	cmucrif0r0003sx0064byf4yl	2	15	/products?category=accessories&sub=watch&brand=weofly	\N	t	f	2026-09-22 14:33:51.836	2026-09-22 14:33:51.836
cmucrygny000x10zngmwu4rnu	KOSPET	kospet	cmucrif0r0003sx0064byf4yl	2	16	/products?category=accessories&sub=watch&brand=kospet	\N	t	f	2026-09-22 14:33:51.838	2026-09-22 14:33:51.838
cmucrygo0000z10znn18ztkto	OnePlus	oneplus	cmucrif0r0003sx0064byf4yl	2	17	/products?category=accessories&sub=watch&brand=oneplus	\N	t	f	2026-09-22 14:33:51.84	2026-09-22 14:33:51.84
cmucrygo0001110zn6d4jw5yh	Oraimo	oraimo	cmucrif0r0003sx0064byf4yl	2	18	/products?category=accessories&sub=watch&brand=oraimo	\N	t	f	2026-09-22 14:33:51.841	2026-09-22 14:33:51.841
cmucrygo1001310zndlm9zcmd	QCY	qcy	cmucrif0r0003sx0064byf4yl	2	19	/products?category=accessories&sub=watch&brand=qcy	\N	t	f	2026-09-22 14:33:51.841	2026-09-22 14:33:51.841
cmucrygo2001510znvk5c27q4	Realme	realme	cmucrif0r0003sx0064byf4yl	2	20	/products?category=accessories&sub=watch&brand=realme	\N	t	f	2026-09-22 14:33:51.842	2026-09-22 14:33:51.842
cmucrygo2001710zniwuosspw	RIVER SONG	river-song	cmucrif0r0003sx0064byf4yl	2	21	/products?category=accessories&sub=watch&brand=river-song	\N	t	f	2026-09-22 14:33:51.843	2026-09-22 14:33:51.843
cmucrygo3001910znzz2xnmpn	Samsung	samsung	cmucrif0r0003sx0064byf4yl	2	22	/products?category=accessories&sub=watch&brand=samsung	\N	t	f	2026-09-22 14:33:51.843	2026-09-22 14:33:51.843
cmucrygo4001b10zn8j8pwir5	Titan	titan	cmucrif0r0003sx0064byf4yl	2	23	/products?category=accessories&sub=watch&brand=titan	\N	t	f	2026-09-22 14:33:51.844	2026-09-22 14:33:51.844
cmucrygo4001d10znx34mi0p0	WiWU	wiwu	cmucrif0r0003sx0064byf4yl	2	24	/products?category=accessories&sub=watch&brand=wiwu	\N	t	f	2026-09-22 14:33:51.845	2026-09-22 14:33:51.845
cmucrygo5001f10zn0k6rq7pf	Xiaomi	xiaomi	cmucrif0r0003sx0064byf4yl	2	25	/products?category=accessories&sub=watch&brand=xiaomi	\N	t	f	2026-09-22 14:33:51.845	2026-09-22 14:33:51.845
cmucrygo7001h10znfs71bqjz	XTRA	xtra	cmucrif0r0003sx0064byf4yl	2	26	/products?category=accessories&sub=watch&brand=xtra	\N	t	f	2026-09-22 14:33:51.847	2026-09-22 14:33:51.847
cmucrygo8001j10znl4hc1x7l	Yison	yison	cmucrif0r0003sx0064byf4yl	2	27	/products?category=accessories&sub=watch&brand=yison	\N	t	f	2026-09-22 14:33:51.848	2026-09-22 14:33:51.848
cmucrygo9001l10zn83sb08dt	Zeblaze	zeblaze	cmucrif0r0003sx0064byf4yl	2	28	/products?category=accessories&sub=watch&brand=zeblaze	\N	t	f	2026-09-22 14:33:51.849	2026-09-22 14:33:51.849
cmucrygoa001n10zn6pig2xbp	Remax	remax	cmucrif0r0003sx0064byf4yl	2	29	/products?category=accessories&sub=watch&brand=remax	\N	t	f	2026-09-22 14:33:51.85	2026-09-22 14:33:51.85
cmucrygob001p10znxwm0pe7k	Joyroom	joyroom	cmucrif0r0003sx0064byf4yl	2	30	/products?category=accessories&sub=watch&brand=joyroom	\N	t	f	2026-09-22 14:33:51.851	2026-09-22 14:33:51.851
cmucrygob001r10zn26bw2kcv	Awei	awei	cmucrif0r0003sx0064byf4yl	2	31	/products?category=accessories&sub=watch&brand=awei	\N	t	f	2026-09-22 14:33:51.852	2026-09-22 14:33:51.852
cmucrygoc001t10znednpvmax	MOVR	movr	cmucrif0r0003sx0064byf4yl	2	32	/products?category=accessories&sub=watch&brand=movr	\N	t	f	2026-09-22 14:33:51.853	2026-09-22 14:33:51.853
cmucrygod001v10zn28oy3af2	Tecno	tecno	cmucrif0r0003sx0064byf4yl	2	33	/products?category=accessories&sub=watch&brand=tecno	\N	t	f	2026-09-22 14:33:51.853	2026-09-22 14:33:51.853
cmucrygoe001x10znz0bzyf94	BWOO	bwoo	cmucrif0r0003sx0064byf4yl	2	34	/products?category=accessories&sub=watch&brand=bwoo	\N	t	f	2026-09-22 14:33:51.854	2026-09-22 14:33:51.854
cmucrygoe001z10znqjjkrov3	CHARG	charg	cmucrif0r0003sx0064byf4yl	2	35	/products?category=accessories&sub=watch&brand=charg	\N	t	f	2026-09-22 14:33:51.855	2026-09-22 14:33:51.855
cmucrygof002110znbrtsfon1	Unikyy	unikyy	cmucrif0r0003sx0064byf4yl	2	36	/products?category=accessories&sub=watch&brand=unikyy	\N	t	f	2026-09-22 14:33:51.855	2026-09-22 14:33:51.855
cmucrygog002310znuebjy3t6	XO	xo	cmucrif0r0003sx0064byf4yl	2	37	/products?category=accessories&sub=watch&brand=xo	\N	t	f	2026-09-22 14:33:51.856	2026-09-22 14:33:51.856
cmucrygoj002510zn6jv6fwvx	Logitech	logitech	cmucrif0u0005sx00x99ms0xc	2	0	/products?category=accessories&sub=keyboard&brand=logitech	\N	t	f	2026-09-22 14:33:51.859	2026-09-22 14:33:51.859
cmucrygok002710zn39mmndoo	Xtrike Me	xtrike-me	cmucrif0u0005sx00x99ms0xc	2	1	/products?category=accessories&sub=keyboard&brand=xtrike-me	\N	t	f	2026-09-22 14:33:51.86	2026-09-22 14:33:51.86
cmucrygok002910zns9mnsa7w	GAMDIAS	gamdias	cmucrif0u0005sx00x99ms0xc	2	2	/products?category=accessories&sub=keyboard&brand=gamdias	\N	t	f	2026-09-22 14:33:51.861	2026-09-22 14:33:51.861
cmucrygol002b10znba0czxgt	Fantech	fantech	cmucrif0u0005sx00x99ms0xc	2	3	/products?category=accessories&sub=keyboard&brand=fantech	\N	t	f	2026-09-22 14:33:51.862	2026-09-22 14:33:51.862
cmucrygom002d10zntvvjpwdt	Asus	asus	cmucrif0u0005sx00x99ms0xc	2	4	/products?category=accessories&sub=keyboard&brand=asus	\N	t	f	2026-09-22 14:33:51.862	2026-09-22 14:33:51.862
cmucrygon002f10znqoe5s4rb	Corsair	corsair	cmucrif0u0005sx00x99ms0xc	2	5	/products?category=accessories&sub=keyboard&brand=corsair	\N	t	f	2026-09-22 14:33:51.863	2026-09-22 14:33:51.863
cmucrygon002h10znf6jedfax	A4Tech	a4tech	cmucrif0u0005sx00x99ms0xc	2	6	/products?category=accessories&sub=keyboard&brand=a4tech	\N	t	f	2026-09-22 14:33:51.864	2026-09-22 14:33:51.864
cmucrygoo002j10zn7p3objuo	SteelSeries	steelseries	cmucrif0u0005sx00x99ms0xc	2	7	/products?category=accessories&sub=keyboard&brand=steelseries	\N	t	f	2026-09-22 14:33:51.864	2026-09-22 14:33:51.864
cmucrygop002l10zn5wtin1yz	Durgod	durgod	cmucrif0u0005sx00x99ms0xc	2	8	/products?category=accessories&sub=keyboard&brand=durgod	\N	t	f	2026-09-22 14:33:51.865	2026-09-22 14:33:51.865
cmucrygoq002n10znqbev0vpy	Havit	havit	cmucrif0u0005sx00x99ms0xc	2	9	/products?category=accessories&sub=keyboard&brand=havit	\N	t	f	2026-09-22 14:33:51.866	2026-09-22 14:33:51.866
cmucrygor002p10zndguh2jji	Rapoo	rapoo	cmucrif0u0005sx00x99ms0xc	2	10	/products?category=accessories&sub=keyboard&brand=rapoo	\N	t	f	2026-09-22 14:33:51.867	2026-09-22 14:33:51.867
cmucrygos002r10zn85ke5rt6	T-WOLF	t-wolf	cmucrif0u0005sx00x99ms0xc	2	11	/products?category=accessories&sub=keyboard&brand=t-wolf	\N	t	f	2026-09-22 14:33:51.868	2026-09-22 14:33:51.868
cmucrygos002t10znv6gktkdt	Onikuma	onikuma	cmucrif0u0005sx00x99ms0xc	2	12	/products?category=accessories&sub=keyboard&brand=onikuma	\N	t	f	2026-09-22 14:33:51.869	2026-09-22 14:33:51.869
cmucrygot002v10znk9345ayo	AULA	aula	cmucrif0u0005sx00x99ms0xc	2	13	/products?category=accessories&sub=keyboard&brand=aula	\N	t	f	2026-09-22 14:33:51.87	2026-09-22 14:33:51.87
cmucrygou002x10znxfid6y23	iMICE	imice	cmucrif0u0005sx00x99ms0xc	2	14	/products?category=accessories&sub=keyboard&brand=imice	\N	t	f	2026-09-22 14:33:51.87	2026-09-22 14:33:51.87
cmucrygov002z10zn4l3crsel	ROYAL KLUDGE	royal-kludge	cmucrif0u0005sx00x99ms0xc	2	15	/products?category=accessories&sub=keyboard&brand=royal-kludge	\N	t	f	2026-09-22 14:33:51.871	2026-09-22 14:33:51.871
cmucrygov003110znyazdc3cz	AJAZZ	ajazz	cmucrif0u0005sx00x99ms0xc	2	16	/products?category=accessories&sub=keyboard&brand=ajazz	\N	t	f	2026-09-22 14:33:51.872	2026-09-22 14:33:51.872
cmucrygow003310znldnbt442	Keychron	keychron	cmucrif0u0005sx00x99ms0xc	2	17	/products?category=accessories&sub=keyboard&brand=keychron	\N	t	f	2026-09-22 14:33:51.872	2026-09-22 14:33:51.872
cmucrygow003510znrh77a7cf	Dareu	dareu	cmucrif0u0005sx00x99ms0xc	2	18	/products?category=accessories&sub=keyboard&brand=dareu	\N	t	f	2026-09-22 14:33:51.873	2026-09-22 14:33:51.873
cmucrygox003710znc9hzcrgf	Redragon	redragon	cmucrif0u0005sx00x99ms0xc	2	19	/products?category=accessories&sub=keyboard&brand=redragon	\N	t	f	2026-09-22 14:33:51.873	2026-09-22 14:33:51.873
cmucrygoy003910zn90pjehav	Microsoft	microsoft	cmucrif0u0005sx00x99ms0xc	2	20	/products?category=accessories&sub=keyboard&brand=microsoft	\N	t	f	2026-09-22 14:33:51.874	2026-09-22 14:33:51.874
cmucrygoy003b10znmo7irt9s	NZXT	nzxt	cmucrif0u0005sx00x99ms0xc	2	21	/products?category=accessories&sub=keyboard&brand=nzxt	\N	t	f	2026-09-22 14:33:51.875	2026-09-22 14:33:51.875
cmucrygoz003d10zn0epz6x2s	PC Power	pc-power	cmucrif0u0005sx00x99ms0xc	2	22	/products?category=accessories&sub=keyboard&brand=pc-power	\N	t	f	2026-09-22 14:33:51.875	2026-09-22 14:33:51.875
cmucrygp1003f10znd4tsc9tm	Jedel	jedel	cmucrif0u0005sx00x99ms0xc	2	23	/products?category=accessories&sub=keyboard&brand=jedel	\N	t	f	2026-09-22 14:33:51.878	2026-09-22 14:33:51.878
cmucrygp3003h10znb754vpci	MCHOSE	mchose	cmucrif0u0005sx00x99ms0xc	2	24	/products?category=accessories&sub=keyboard&brand=mchose	\N	t	f	2026-09-22 14:33:51.879	2026-09-22 14:33:51.879
cmucrygp4003j10znub0p7y2x	Furycube	furycube	cmucrif0u0005sx00x99ms0xc	2	25	/products?category=accessories&sub=keyboard&brand=furycube	\N	t	f	2026-09-22 14:33:51.88	2026-09-22 14:33:51.88
cmucrygp5003l10znplzo7au3	Magegee	magegee	cmucrif0u0005sx00x99ms0xc	2	26	/products?category=accessories&sub=keyboard&brand=magegee	\N	t	f	2026-09-22 14:33:51.881	2026-09-22 14:33:51.881
cmucrygp5003n10zn7l1x0afc	XO	xo	cmucrif0u0005sx00x99ms0xc	2	27	/products?category=accessories&sub=keyboard&brand=xo	\N	t	f	2026-09-22 14:33:51.882	2026-09-22 14:33:51.882
cmucrygp7003p10znz975x8zk	Logitech	logitech	cmucrif0w0007sx00idv43j3m	2	0	/products?category=accessories&sub=mouse&brand=logitech	\N	t	f	2026-09-22 14:33:51.883	2026-09-22 14:33:51.883
cmucrygp8003r10znwb0rhak6	Xtrike Me	xtrike-me	cmucrif0w0007sx00idv43j3m	2	1	/products?category=accessories&sub=mouse&brand=xtrike-me	\N	t	f	2026-09-22 14:33:51.884	2026-09-22 14:33:51.884
cmucrygp8003t10znm5n3s9jg	Asus	asus	cmucrif0w0007sx00idv43j3m	2	2	/products?category=accessories&sub=mouse&brand=asus	\N	t	f	2026-09-22 14:33:51.885	2026-09-22 14:33:51.885
cmucrygp9003v10zn51eechqa	Corsair	corsair	cmucrif0w0007sx00idv43j3m	2	3	/products?category=accessories&sub=mouse&brand=corsair	\N	t	f	2026-09-22 14:33:51.885	2026-09-22 14:33:51.885
cmucrygpa003x10zn3suzaogg	A4Tech	a4tech	cmucrif0w0007sx00idv43j3m	2	4	/products?category=accessories&sub=mouse&brand=a4tech	\N	t	f	2026-09-22 14:33:51.887	2026-09-22 14:33:51.887
cmucrygpc003z10znb7kjlgq3	SteelSeries	steelseries	cmucrif0w0007sx00idv43j3m	2	5	/products?category=accessories&sub=mouse&brand=steelseries	\N	t	f	2026-09-22 14:33:51.888	2026-09-22 14:33:51.888
cmucrygpc004110znj0yt414g	Fantech	fantech	cmucrif0w0007sx00idv43j3m	2	6	/products?category=accessories&sub=mouse&brand=fantech	\N	t	f	2026-09-22 14:33:51.889	2026-09-22 14:33:51.889
cmucrygpd004310znlsulzr2d	Havit	havit	cmucrif0w0007sx00idv43j3m	2	7	/products?category=accessories&sub=mouse&brand=havit	\N	t	f	2026-09-22 14:33:51.89	2026-09-22 14:33:51.89
cmucrygpe004510znmmb2ury0	iMICE	imice	cmucrif0w0007sx00idv43j3m	2	8	/products?category=accessories&sub=mouse&brand=imice	\N	t	f	2026-09-22 14:33:51.89	2026-09-22 14:33:51.89
cmucrygpf004710zna9q5jtpi	Rapoo	rapoo	cmucrif0w0007sx00idv43j3m	2	9	/products?category=accessories&sub=mouse&brand=rapoo	\N	t	f	2026-09-22 14:33:51.891	2026-09-22 14:33:51.891
cmucrygpg004910znltc8jtuo	Durgod	durgod	cmucrif0w0007sx00idv43j3m	2	10	/products?category=accessories&sub=mouse&brand=durgod	\N	t	f	2026-09-22 14:33:51.892	2026-09-22 14:33:51.892
cmucrygpg004b10znjui1honw	T-WOLF	t-wolf	cmucrif0w0007sx00idv43j3m	2	11	/products?category=accessories&sub=mouse&brand=t-wolf	\N	t	f	2026-09-22 14:33:51.893	2026-09-22 14:33:51.893
cmucrygph004d10znruquwt0o	Onikuma	onikuma	cmucrif0w0007sx00idv43j3m	2	12	/products?category=accessories&sub=mouse&brand=onikuma	\N	t	f	2026-09-22 14:33:51.894	2026-09-22 14:33:51.894
cmucrygpi004f10znje933mpj	AULA	aula	cmucrif0w0007sx00idv43j3m	2	13	/products?category=accessories&sub=mouse&brand=aula	\N	t	f	2026-09-22 14:33:51.894	2026-09-22 14:33:51.894
cmucrygpi004h10znoeflmgth	ThunderRobot	thunderrobot	cmucrif0w0007sx00idv43j3m	2	14	/products?category=accessories&sub=mouse&brand=thunderrobot	\N	t	f	2026-09-22 14:33:51.895	2026-09-22 14:33:51.895
cmucrygpj004j10znwx0kntit	GAMDIAS	gamdias	cmucrif0w0007sx00idv43j3m	2	15	/products?category=accessories&sub=mouse&brand=gamdias	\N	t	f	2026-09-22 14:33:51.896	2026-09-22 14:33:51.896
cmucrygpl004l10znvba6kfc5	Apple	apple	cmucrif0w0007sx00idv43j3m	2	16	/products?category=accessories&sub=mouse&brand=apple	\N	t	f	2026-09-22 14:33:51.897	2026-09-22 14:33:51.897
cmucrygpl004n10zn8gk0qgho	Redragon	redragon	cmucrif0w0007sx00idv43j3m	2	17	/products?category=accessories&sub=mouse&brand=redragon	\N	t	f	2026-09-22 14:33:51.898	2026-09-22 14:33:51.898
cmucrygpm004p10zn1u9h3sa0	MSI	msi	cmucrif0w0007sx00idv43j3m	2	18	/products?category=accessories&sub=mouse&brand=msi	\N	t	f	2026-09-22 14:33:51.899	2026-09-22 14:33:51.899
cmucrygpn004r10znez37w8m6	AJAZZ	ajazz	cmucrif0w0007sx00idv43j3m	2	19	/products?category=accessories&sub=mouse&brand=ajazz	\N	t	f	2026-09-22 14:33:51.899	2026-09-22 14:33:51.899
cmucrygpn004t10zno2a9bmo2	PC Power	pc-power	cmucrif0w0007sx00idv43j3m	2	20	/products?category=accessories&sub=mouse&brand=pc-power	\N	t	f	2026-09-22 14:33:51.9	2026-09-22 14:33:51.9
cmucrygpo004v10znxovsxldw	Hoco	hoco	cmucrif0w0007sx00idv43j3m	2	21	/products?category=accessories&sub=mouse&brand=hoco	\N	t	f	2026-09-22 14:33:51.901	2026-09-22 14:33:51.901
cmucrygpp004x10znwjq37iua	MCHOSE	mchose	cmucrif0w0007sx00idv43j3m	2	22	/products?category=accessories&sub=mouse&brand=mchose	\N	t	f	2026-09-22 14:33:51.901	2026-09-22 14:33:51.901
cmucrygpq004z10znnimij4mg	Furycube	furycube	cmucrif0w0007sx00idv43j3m	2	23	/products?category=accessories&sub=mouse&brand=furycube	\N	t	f	2026-09-22 14:33:51.902	2026-09-22 14:33:51.902
cmucrygpq005110znssy9skxp	Inphic	inphic	cmucrif0w0007sx00idv43j3m	2	24	/products?category=accessories&sub=mouse&brand=inphic	\N	t	f	2026-09-22 14:33:51.903	2026-09-22 14:33:51.903
cmucrygpr005310znme6kwk0o	XO	xo	cmucrif0w0007sx00idv43j3m	2	25	/products?category=accessories&sub=mouse&brand=xo	\N	t	f	2026-09-22 14:33:51.903	2026-09-22 14:33:51.903
cmucrygps005510zn15adwpfz	Logitech	logitech	cmucrif0y0009sx00b61ve2bd	2	0	/products?category=accessories&sub=headphone&brand=logitech	\N	t	f	2026-09-22 14:33:51.905	2026-09-22 14:33:51.905
cmucrygpu005710zn8gkkzbt6	Xtrike Me	xtrike-me	cmucrif0y0009sx00b61ve2bd	2	1	/products?category=accessories&sub=headphone&brand=xtrike-me	\N	t	f	2026-09-22 14:33:51.907	2026-09-22 14:33:51.907
cmucrygpx005910znz6ihgumg	Sony	sony	cmucrif0y0009sx00b61ve2bd	2	2	/products?category=accessories&sub=headphone&brand=sony	\N	t	f	2026-09-22 14:33:51.909	2026-09-22 14:33:51.909
cmucrygpz005b10zn8s58tg19	Asus	asus	cmucrif0y0009sx00b61ve2bd	2	3	/products?category=accessories&sub=headphone&brand=asus	\N	t	f	2026-09-22 14:33:51.911	2026-09-22 14:33:51.911
cmucrygq1005d10znky4nt1e8	Corsair	corsair	cmucrif0y0009sx00b61ve2bd	2	4	/products?category=accessories&sub=headphone&brand=corsair	\N	t	f	2026-09-22 14:33:51.913	2026-09-22 14:33:51.913
cmucrygq2005f10zn8pa6tqpw	A4Tech	a4tech	cmucrif0y0009sx00b61ve2bd	2	5	/products?category=accessories&sub=headphone&brand=a4tech	\N	t	f	2026-09-22 14:33:51.914	2026-09-22 14:33:51.914
cmucrygq3005h10znaelhqmz0	SteelSeries	steelseries	cmucrif0y0009sx00b61ve2bd	2	6	/products?category=accessories&sub=headphone&brand=steelseries	\N	t	f	2026-09-22 14:33:51.915	2026-09-22 14:33:51.915
cmucrygq3005j10znq8yav4hc	Fantech	fantech	cmucrif0y0009sx00b61ve2bd	2	7	/products?category=accessories&sub=headphone&brand=fantech	\N	t	f	2026-09-22 14:33:51.916	2026-09-22 14:33:51.916
cmucrygq5005l10znz8s3f2hp	Havit	havit	cmucrif0y0009sx00b61ve2bd	2	8	/products?category=accessories&sub=headphone&brand=havit	\N	t	f	2026-09-22 14:33:51.918	2026-09-22 14:33:51.918
cmucrygq6005n10znp0du2wzd	Edifier	edifier	cmucrif0y0009sx00b61ve2bd	2	9	/products?category=accessories&sub=headphone&brand=edifier	\N	t	f	2026-09-22 14:33:51.919	2026-09-22 14:33:51.919
cmucrygq7005p10zns50esi3v	Rapoo	rapoo	cmucrif0y0009sx00b61ve2bd	2	10	/products?category=accessories&sub=headphone&brand=rapoo	\N	t	f	2026-09-22 14:33:51.92	2026-09-22 14:33:51.92
cmucrygq8005r10znz6926r2j	iMICE	imice	cmucrif0y0009sx00b61ve2bd	2	11	/products?category=accessories&sub=headphone&brand=imice	\N	t	f	2026-09-22 14:33:51.92	2026-09-22 14:33:51.92
cmucrygq8005t10zn0tgp1dyq	Onikuma	onikuma	cmucrif0y0009sx00b61ve2bd	2	12	/products?category=accessories&sub=headphone&brand=onikuma	\N	t	f	2026-09-22 14:33:51.921	2026-09-22 14:33:51.921
cmucrygq9005v10znrwqxr885	Inbertec	inbertec	cmucrif0y0009sx00b61ve2bd	2	13	/products?category=accessories&sub=headphone&brand=inbertec	\N	t	f	2026-09-22 14:33:51.921	2026-09-22 14:33:51.921
cmucrygqa005x10znu83k0b7f	JBL	jbl	cmucrif0y0009sx00b61ve2bd	2	14	/products?category=accessories&sub=headphone&brand=jbl	\N	t	f	2026-09-22 14:33:51.922	2026-09-22 14:33:51.922
cmucrygqb005z10zneeyal99m	MSI	msi	cmucrif0y0009sx00b61ve2bd	2	15	/products?category=accessories&sub=headphone&brand=msi	\N	t	f	2026-09-22 14:33:51.924	2026-09-22 14:33:51.924
cmucrygqd006110znwnt3hct1	EKSA	eksa	cmucrif0y0009sx00b61ve2bd	2	16	/products?category=accessories&sub=headphone&brand=eksa	\N	t	f	2026-09-22 14:33:51.925	2026-09-22 14:33:51.925
cmucrygqe006310znnvqoyjy6	Apple	apple	cmucrif0y0009sx00b61ve2bd	2	17	/products?category=accessories&sub=headphone&brand=apple	\N	t	f	2026-09-22 14:33:51.927	2026-09-22 14:33:51.927
cmucrygqf006510zn8w03vr59	Jabra	jabra	cmucrif0y0009sx00b61ve2bd	2	18	/products?category=accessories&sub=headphone&brand=jabra	\N	t	f	2026-09-22 14:33:51.928	2026-09-22 14:33:51.928
cmucrygqh006710znqg13w5x7	RODE	rode	cmucrif0y0009sx00b61ve2bd	2	19	/products?category=accessories&sub=headphone&brand=rode	\N	t	f	2026-09-22 14:33:51.929	2026-09-22 14:33:51.929
cmucrygqi006910zn8ras7uou	MeeTion	meetion	cmucrif0y0009sx00b61ve2bd	2	20	/products?category=accessories&sub=headphone&brand=meetion	\N	t	f	2026-09-22 14:33:51.93	2026-09-22 14:33:51.93
cmucrygqi006b10zn73k95x18	Redragon	redragon	cmucrif0y0009sx00b61ve2bd	2	21	/products?category=accessories&sub=headphone&brand=redragon	\N	t	f	2026-09-22 14:33:51.931	2026-09-22 14:33:51.931
cmucrygqj006d10znrub1ml52	Microlab	microlab	cmucrif0y0009sx00b61ve2bd	2	22	/products?category=accessories&sub=headphone&brand=microlab	\N	t	f	2026-09-22 14:33:51.931	2026-09-22 14:33:51.931
cmucrygqk006f10znrcpf2hra	Anker	anker	cmucrif0y0009sx00b61ve2bd	2	23	/products?category=accessories&sub=headphone&brand=anker	\N	t	f	2026-09-22 14:33:51.932	2026-09-22 14:33:51.932
cmucrygqk006h10zn2bwbbxq2	Audio Technica	audio-technica	cmucrif0y0009sx00b61ve2bd	2	24	/products?category=accessories&sub=headphone&brand=audio-technica	\N	t	f	2026-09-22 14:33:51.933	2026-09-22 14:33:51.933
cmucrygql006j10zn4sk9lmy1	Beyerdynamic	beyerdynamic	cmucrif0y0009sx00b61ve2bd	2	25	/products?category=accessories&sub=headphone&brand=beyerdynamic	\N	t	f	2026-09-22 14:33:51.933	2026-09-22 14:33:51.933
cmucrygqm006l10znb0cyt36e	UGREEN	ugreen	cmucrif0y0009sx00b61ve2bd	2	26	/products?category=accessories&sub=headphone&brand=ugreen	\N	t	f	2026-09-22 14:33:51.934	2026-09-22 14:33:51.934
cmucrygqm006n10znl6obfy2u	AKG	akg	cmucrif0y0009sx00b61ve2bd	2	27	/products?category=accessories&sub=headphone&brand=akg	\N	t	f	2026-09-22 14:33:51.935	2026-09-22 14:33:51.935
cmucrygqn006p10zn0n2ku51i	Awei	awei	cmucrif0y0009sx00b61ve2bd	2	28	/products?category=accessories&sub=headphone&brand=awei	\N	t	f	2026-09-22 14:33:51.935	2026-09-22 14:33:51.935
cmucrygqq006r10zn2t23w3ig	Tribit	tribit	cmucrif0y0009sx00b61ve2bd	2	29	/products?category=accessories&sub=headphone&brand=tribit	\N	t	f	2026-09-22 14:33:51.938	2026-09-22 14:33:51.938
cmucrygqr006t10zn3t1pp9df	Hoco	hoco	cmucrif0y0009sx00b61ve2bd	2	30	/products?category=accessories&sub=headphone&brand=hoco	\N	t	f	2026-09-22 14:33:51.94	2026-09-22 14:33:51.94
cmucrygqs006v10znzr6j1njm	Fastrack	fastrack	cmucrif0y0009sx00b61ve2bd	2	31	/products?category=accessories&sub=headphone&brand=fastrack	\N	t	f	2026-09-22 14:33:51.941	2026-09-22 14:33:51.941
cmucrygqt006x10zn1is6chj8	PC Power	pc-power	cmucrif0y0009sx00b61ve2bd	2	32	/products?category=accessories&sub=headphone&brand=pc-power	\N	t	f	2026-09-22 14:33:51.941	2026-09-22 14:33:51.941
cmucrygqu006z10znbucgqt8c	OneOdio	oneodio	cmucrif0y0009sx00b61ve2bd	2	33	/products?category=accessories&sub=headphone&brand=oneodio	\N	t	f	2026-09-22 14:33:51.942	2026-09-22 14:33:51.942
cmucrygqu007110znyhta818v	Acefast	acefast	cmucrif0y0009sx00b61ve2bd	2	34	/products?category=accessories&sub=headphone&brand=acefast	\N	t	f	2026-09-22 14:33:51.943	2026-09-22 14:33:51.943
cmucrygqv007310zn9oqyguft	Weofly	weofly	cmucrif0y0009sx00b61ve2bd	2	35	/products?category=accessories&sub=headphone&brand=weofly	\N	t	f	2026-09-22 14:33:51.943	2026-09-22 14:33:51.943
cmucrygqw007510zno7hil89r	AJAZZ	ajazz	cmucrif0y0009sx00b61ve2bd	2	36	/products?category=accessories&sub=headphone&brand=ajazz	\N	t	f	2026-09-22 14:33:51.944	2026-09-22 14:33:51.944
cmucrygqy007710znonpkgng8	RAZER	razer	cmucrif13000dsx00f5e3sd7a	2	0	/products?category=accessories&sub=mouse-pad&brand=razer	\N	t	f	2026-09-22 14:33:51.946	2026-09-22 14:33:51.946
cmucrygqz007910znbb71ilqf	Xtrike Me	xtrike-me	cmucrif13000dsx00f5e3sd7a	2	1	/products?category=accessories&sub=mouse-pad&brand=xtrike-me	\N	t	f	2026-09-22 14:33:51.948	2026-09-22 14:33:51.948
cmucrygr0007b10zno79vp1ek	Asus	asus	cmucrif13000dsx00f5e3sd7a	2	2	/products?category=accessories&sub=mouse-pad&brand=asus	\N	t	f	2026-09-22 14:33:51.949	2026-09-22 14:33:51.949
cmucrygr1007d10znp2d3utwh	Fantech	fantech	cmucrif13000dsx00f5e3sd7a	2	3	/products?category=accessories&sub=mouse-pad&brand=fantech	\N	t	f	2026-09-22 14:33:51.95	2026-09-22 14:33:51.95
cmucrygr2007f10znrj4pl6el	Havit	havit	cmucrif13000dsx00f5e3sd7a	2	4	/products?category=accessories&sub=mouse-pad&brand=havit	\N	t	f	2026-09-22 14:33:51.951	2026-09-22 14:33:51.951
cmucrygr3007h10zni7fzvjyq	Logitech	logitech	cmucrif13000dsx00f5e3sd7a	2	5	/products?category=accessories&sub=mouse-pad&brand=logitech	\N	t	f	2026-09-22 14:33:51.951	2026-09-22 14:33:51.951
cmucrygr3007j10znq7xexfjt	SteelSeries	steelseries	cmucrif13000dsx00f5e3sd7a	2	6	/products?category=accessories&sub=mouse-pad&brand=steelseries	\N	t	f	2026-09-22 14:33:51.952	2026-09-22 14:33:51.952
cmucrygr4007l10znw2v36rs2	MSI	msi	cmucrif13000dsx00f5e3sd7a	2	7	/products?category=accessories&sub=mouse-pad&brand=msi	\N	t	f	2026-09-22 14:33:51.953	2026-09-22 14:33:51.953
cmucrygr5007n10znkjsn8s2a	MeeTion	meetion	cmucrif13000dsx00f5e3sd7a	2	8	/products?category=accessories&sub=mouse-pad&brand=meetion	\N	t	f	2026-09-22 14:33:51.953	2026-09-22 14:33:51.953
cmucrygr5007p10zn5xwbwzfz	X-Raypad	x-raypad	cmucrif13000dsx00f5e3sd7a	2	9	/products?category=accessories&sub=mouse-pad&brand=x-raypad	\N	t	f	2026-09-22 14:33:51.954	2026-09-22 14:33:51.954
cmucrygr6007r10zn705ycjzi	Elgato	elgato	cmucrif13000dsx00f5e3sd7a	2	10	/products?category=accessories&sub=mouse-pad&brand=elgato	\N	t	f	2026-09-22 14:33:51.955	2026-09-22 14:33:51.955
cmucrygr7007t10znpuyfljsu	Onikuma	onikuma	cmucrif13000dsx00f5e3sd7a	2	11	/products?category=accessories&sub=mouse-pad&brand=onikuma	\N	t	f	2026-09-22 14:33:51.955	2026-09-22 14:33:51.955
cmucrygr8007v10znowvx4spu	A4Tech	a4tech	cmucrif13000dsx00f5e3sd7a	2	12	/products?category=accessories&sub=mouse-pad&brand=a4tech	\N	t	f	2026-09-22 14:33:51.956	2026-09-22 14:33:51.956
cmucrygr9007x10znur3hqpug	Inphic	inphic	cmucrif13000dsx00f5e3sd7a	2	13	/products?category=accessories&sub=mouse-pad&brand=inphic	\N	t	f	2026-09-22 14:33:51.957	2026-09-22 14:33:51.957
cmucrygr9007z10zn3xdh05if	AJAZZ	ajazz	cmucrif13000dsx00f5e3sd7a	2	14	/products?category=accessories&sub=mouse-pad&brand=ajazz	\N	t	f	2026-09-22 14:33:51.958	2026-09-22 14:33:51.958
cmucrygra008110zn6mhb0862	ThundeRobot	thunderobot	cmucrif13000dsx00f5e3sd7a	2	15	/products?category=accessories&sub=mouse-pad&brand=thunderobot	\N	t	f	2026-09-22 14:33:51.958	2026-09-22 14:33:51.958
cmucrygrc008310zniqyrzbwu	Awei	awei	cmucrif1a000lsx0066eo51bi	2	0	/products?category=accessories&sub=bluetooth-speakers&brand=awei	\N	t	f	2026-09-22 14:33:51.96	2026-09-22 14:33:51.96
cmucrygrd008510znedh2vmog	Baseus	baseus	cmucrif1a000lsx0066eo51bi	2	1	/products?category=accessories&sub=bluetooth-speakers&brand=baseus	\N	t	f	2026-09-22 14:33:51.961	2026-09-22 14:33:51.961
cmucrygrd008710zntj1kxxaw	EarFun	earfun	cmucrif1a000lsx0066eo51bi	2	2	/products?category=accessories&sub=bluetooth-speakers&brand=earfun	\N	t	f	2026-09-22 14:33:51.962	2026-09-22 14:33:51.962
cmucrygre008910znjvjqdx1d	Fantech	fantech	cmucrif1a000lsx0066eo51bi	2	3	/products?category=accessories&sub=bluetooth-speakers&brand=fantech	\N	t	f	2026-09-22 14:33:51.962	2026-09-22 14:33:51.962
cmucrygrf008b10zn32bi74ik	Oraimo	oraimo	cmucrif1a000lsx0066eo51bi	2	4	/products?category=accessories&sub=bluetooth-speakers&brand=oraimo	\N	t	f	2026-09-22 14:33:51.963	2026-09-22 14:33:51.963
cmucrygrf008d10znbqylbd5w	HiFuture	hifuture	cmucrif1a000lsx0066eo51bi	2	5	/products?category=accessories&sub=bluetooth-speakers&brand=hifuture	\N	t	f	2026-09-22 14:33:51.964	2026-09-22 14:33:51.964
cmucrygrg008f10znep6pvq3h	Hoco	hoco	cmucrif1a000lsx0066eo51bi	2	6	/products?category=accessories&sub=bluetooth-speakers&brand=hoco	\N	t	f	2026-09-22 14:33:51.964	2026-09-22 14:33:51.964
cmucrygrh008h10znlnehm94a	JBL	jbl	cmucrif1a000lsx0066eo51bi	2	7	/products?category=accessories&sub=bluetooth-speakers&brand=jbl	\N	t	f	2026-09-22 14:33:51.965	2026-09-22 14:33:51.965
cmucrygri008j10zn56vh8x65	Havit	havit	cmucrif1a000lsx0066eo51bi	2	8	/products?category=accessories&sub=bluetooth-speakers&brand=havit	\N	t	f	2026-09-22 14:33:51.966	2026-09-22 14:33:51.966
cmucrygrj008l10znjucl80hn	JOYROOM	joyroom	cmucrif1a000lsx0066eo51bi	2	9	/products?category=accessories&sub=bluetooth-speakers&brand=joyroom	\N	t	f	2026-09-22 14:33:51.967	2026-09-22 14:33:51.967
cmucrygrk008n10znrpg4cljc	Marshall	marshall	cmucrif1a000lsx0066eo51bi	2	10	/products?category=accessories&sub=bluetooth-speakers&brand=marshall	\N	t	f	2026-09-22 14:33:51.969	2026-09-22 14:33:51.969
cmucrygrl008p10znbgsgdggk	Thunderobot	thunderobot	cmucrif1a000lsx0066eo51bi	2	11	/products?category=accessories&sub=bluetooth-speakers&brand=thunderobot	\N	t	f	2026-09-22 14:33:51.97	2026-09-22 14:33:51.97
cmucrygrm008r10zncdsbqp64	Logitech	logitech	cmucrif1a000lsx0066eo51bi	2	12	/products?category=accessories&sub=bluetooth-speakers&brand=logitech	\N	t	f	2026-09-22 14:33:51.971	2026-09-22 14:33:51.971
cmucrygro008t10znyqtt3osq	Edifier	edifier	cmucrif1a000lsx0066eo51bi	2	13	/products?category=accessories&sub=bluetooth-speakers&brand=edifier	\N	t	f	2026-09-22 14:33:51.972	2026-09-22 14:33:51.972
cmucrygrp008v10zn1pbdgg7s	F&D	fandd	cmucrif1a000lsx0066eo51bi	2	14	/products?category=accessories&sub=bluetooth-speakers&brand=fandd	\N	t	f	2026-09-22 14:33:51.973	2026-09-22 14:33:51.973
cmucrygrq008x10zneqztauy2	HONOR	honor	cmucrif1a000lsx0066eo51bi	2	15	/products?category=accessories&sub=bluetooth-speakers&brand=honor	\N	t	f	2026-09-22 14:33:51.974	2026-09-22 14:33:51.974
cmucrygrq008z10zncslqxt7h	RECCI	recci	cmucrif1a000lsx0066eo51bi	2	16	/products?category=accessories&sub=bluetooth-speakers&brand=recci	\N	t	f	2026-09-22 14:33:51.975	2026-09-22 14:33:51.975
cmucrygrs009110znp4k3q2sl	Sony	sony	cmucrif1a000lsx0066eo51bi	2	17	/products?category=accessories&sub=bluetooth-speakers&brand=sony	\N	t	f	2026-09-22 14:33:51.977	2026-09-22 14:33:51.977
cmucrygru009310znhjfga7sc	Tribit	tribit	cmucrif1a000lsx0066eo51bi	2	18	/products?category=accessories&sub=bluetooth-speakers&brand=tribit	\N	t	f	2026-09-22 14:33:51.978	2026-09-22 14:33:51.978
cmucrygru009510znogxo1b0m	LDNIO	ldnio	cmucrif1a000lsx0066eo51bi	2	19	/products?category=accessories&sub=bluetooth-speakers&brand=ldnio	\N	t	f	2026-09-22 14:33:51.979	2026-09-22 14:33:51.979
cmucrygrv009710znn335gzfh	Yison	yison	cmucrif1a000lsx0066eo51bi	2	20	/products?category=accessories&sub=bluetooth-speakers&brand=yison	\N	t	f	2026-09-22 14:33:51.98	2026-09-22 14:33:51.98
cmucrygrw009910znglibr0ax	Ikarao	ikarao	cmucrif1a000lsx0066eo51bi	2	21	/products?category=accessories&sub=bluetooth-speakers&brand=ikarao	\N	t	f	2026-09-22 14:33:51.98	2026-09-22 14:33:51.98
cmucrygrw009b10zn1nmrotp9	SteelSeries	steelseries	cmucrif1a000lsx0066eo51bi	2	22	/products?category=accessories&sub=bluetooth-speakers&brand=steelseries	\N	t	f	2026-09-22 14:33:51.981	2026-09-22 14:33:51.981
cmucrygrx009d10znclrglf2i	Thonet & Vander	thonet-and-vander	cmucrif1a000lsx0066eo51bi	2	23	/products?category=accessories&sub=bluetooth-speakers&brand=thonet-and-vander	\N	t	f	2026-09-22 14:33:51.982	2026-09-22 14:33:51.982
cmucrygry009f10znmwyj7b6i	QCY	qcy	cmucrif1a000lsx0066eo51bi	2	24	/products?category=accessories&sub=bluetooth-speakers&brand=qcy	\N	t	f	2026-09-22 14:33:51.983	2026-09-22 14:33:51.983
cmucrygrz009h10znrpjv5zyy	Onikuma	onikuma	cmucrif1a000lsx0066eo51bi	2	25	/products?category=accessories&sub=bluetooth-speakers&brand=onikuma	\N	t	f	2026-09-22 14:33:51.983	2026-09-22 14:33:51.983
cmucrygrz009j10zncscyug4d	BWOO	bwoo	cmucrif1a000lsx0066eo51bi	2	26	/products?category=accessories&sub=bluetooth-speakers&brand=bwoo	\N	t	f	2026-09-22 14:33:51.984	2026-09-22 14:33:51.984
cmucrygs0009l10zn67vx5nzk	TOZO	tozo	cmucrif1a000lsx0066eo51bi	2	27	/products?category=accessories&sub=bluetooth-speakers&brand=tozo	\N	t	f	2026-09-22 14:33:51.985	2026-09-22 14:33:51.985
cmucrygs1009n10znh1kakx74	Monster	monster	cmucrif1a000lsx0066eo51bi	2	28	/products?category=accessories&sub=bluetooth-speakers&brand=monster	\N	t	f	2026-09-22 14:33:51.985	2026-09-22 14:33:51.985
cmucrygs2009p10znkpsujtni	Weofly	weofly	cmucrif1a000lsx0066eo51bi	2	29	/products?category=accessories&sub=bluetooth-speakers&brand=weofly	\N	t	f	2026-09-22 14:33:51.987	2026-09-22 14:33:51.987
cmucrygs4009r10znmjg4snrz	Jiayou	jiayou	cmucrif1a000lsx0066eo51bi	2	30	/products?category=accessories&sub=bluetooth-speakers&brand=jiayou	\N	t	f	2026-09-22 14:33:51.988	2026-09-22 14:33:51.988
cmucrygs5009t10zn19bisup8	Unikyy	unikyy	cmucrif1a000lsx0066eo51bi	2	31	/products?category=accessories&sub=bluetooth-speakers&brand=unikyy	\N	t	f	2026-09-22 14:33:51.989	2026-09-22 14:33:51.989
cmucrygs6009v10znikrr3myo	TEAM	team	cmucrif1s0019sx00qyx9n9m5	2	0	/products?category=accessories&sub=pen-drive&brand=team	\N	t	f	2026-09-22 14:33:51.991	2026-09-22 14:33:51.991
cmucrygs7009x10zn3t18x00z	Transcend	transcend	cmucrif1s0019sx00qyx9n9m5	2	1	/products?category=accessories&sub=pen-drive&brand=transcend	\N	t	f	2026-09-22 14:33:51.991	2026-09-22 14:33:51.991
cmucrygs8009z10znd7qce7f5	TWINMOS	twinmos	cmucrif1s0019sx00qyx9n9m5	2	2	/products?category=accessories&sub=pen-drive&brand=twinmos	\N	t	f	2026-09-22 14:33:51.992	2026-09-22 14:33:51.992
cmucrygs800a110zn1r37unrv	ADATA	adata	cmucrif1s0019sx00qyx9n9m5	2	3	/products?category=accessories&sub=pen-drive&brand=adata	\N	t	f	2026-09-22 14:33:51.993	2026-09-22 14:33:51.993
cmucrygs900a310znqg4sd1ut	SanDisk	sandisk	cmucrif1s0019sx00qyx9n9m5	2	4	/products?category=accessories&sub=pen-drive&brand=sandisk	\N	t	f	2026-09-22 14:33:51.993	2026-09-22 14:33:51.993
cmucrygsa00a510znatmh81yh	Kingston	kingston	cmucrif1s0019sx00qyx9n9m5	2	5	/products?category=accessories&sub=pen-drive&brand=kingston	\N	t	f	2026-09-22 14:33:51.994	2026-09-22 14:33:51.994
cmucrygsa00a710znu5n8xz1v	Apacer	apacer	cmucrif1s0019sx00qyx9n9m5	2	6	/products?category=accessories&sub=pen-drive&brand=apacer	\N	t	f	2026-09-22 14:33:51.995	2026-09-22 14:33:51.995
cmucrygsb00a910zn5c1i4gqf	Lexar	lexar	cmucrif1s0019sx00qyx9n9m5	2	7	/products?category=accessories&sub=pen-drive&brand=lexar	\N	t	f	2026-09-22 14:33:51.995	2026-09-22 14:33:51.995
cmucrygsc00ab10znpvux3xf7	Dahua	dahua	cmucrif1s0019sx00qyx9n9m5	2	8	/products?category=accessories&sub=pen-drive&brand=dahua	\N	t	f	2026-09-22 14:33:51.996	2026-09-22 14:33:51.996
cmucrygsd00ad10zn7fwiyo9d	Netac	netac	cmucrif1s0019sx00qyx9n9m5	2	9	/products?category=accessories&sub=pen-drive&brand=netac	\N	t	f	2026-09-22 14:33:51.997	2026-09-22 14:33:51.997
cmucrygse00af10znweg54keg	Smart	smart	cmucrif1s0019sx00qyx9n9m5	2	10	/products?category=accessories&sub=pen-drive&brand=smart	\N	t	f	2026-09-22 14:33:51.998	2026-09-22 14:33:51.998
cmucrygse00ah10zn5xqsnchf	Hiksemi	hiksemi	cmucrif1s0019sx00qyx9n9m5	2	11	/products?category=accessories&sub=pen-drive&brand=hiksemi	\N	t	f	2026-09-22 14:33:51.999	2026-09-22 14:33:51.999
cmucrygsf00aj10znk3rlhx66	Eaget	eaget	cmucrif1s0019sx00qyx9n9m5	2	12	/products?category=accessories&sub=pen-drive&brand=eaget	\N	t	f	2026-09-22 14:33:51.999	2026-09-22 14:33:51.999
cmucrygsg00al10znuoxbch7d	OSCOO	oscoo	cmucrif1s0019sx00qyx9n9m5	2	13	/products?category=accessories&sub=pen-drive&brand=oscoo	\N	t	f	2026-09-22 14:33:52	2026-09-22 14:33:52
cmucrygsi00an10znvaoet7qt	TEAM	team	cmucrif1q0015sx009qmil6zy	2	0	/products?category=accessories&sub=memory-card&brand=team	\N	t	f	2026-09-22 14:33:52.002	2026-09-22 14:33:52.002
cmucrygsj00ap10znharokj2d	PNY	pny	cmucrif1q0015sx009qmil6zy	2	1	/products?category=accessories&sub=memory-card&brand=pny	\N	t	f	2026-09-22 14:33:52.003	2026-09-22 14:33:52.003
cmucrygsk00ar10znh8hzgqgc	SanDisk	sandisk	cmucrif1q0015sx009qmil6zy	2	2	/products?category=accessories&sub=memory-card&brand=sandisk	\N	t	f	2026-09-22 14:33:52.004	2026-09-22 14:33:52.004
cmucrygsk00at10zn3s85o1y8	Transcend	transcend	cmucrif1q0015sx009qmil6zy	2	3	/products?category=accessories&sub=memory-card&brand=transcend	\N	t	f	2026-09-22 14:33:52.005	2026-09-22 14:33:52.005
cmucrygsl00av10zn0p2edcxr	Apacer	apacer	cmucrif1q0015sx009qmil6zy	2	4	/products?category=accessories&sub=memory-card&brand=apacer	\N	t	f	2026-09-22 14:33:52.005	2026-09-22 14:33:52.005
cmucrygsq00ax10zn7a8r0e5x	Lexar	lexar	cmucrif1q0015sx009qmil6zy	2	5	/products?category=accessories&sub=memory-card&brand=lexar	\N	t	f	2026-09-22 14:33:52.01	2026-09-22 14:33:52.01
cmucrygsr00az10zn7sr7r2i0	Adata	adata	cmucrif1q0015sx009qmil6zy	2	6	/products?category=accessories&sub=memory-card&brand=adata	\N	t	f	2026-09-22 14:33:52.011	2026-09-22 14:33:52.011
cmucrygss00b110znb6lf218h	Sony	sony	cmucrif1q0015sx009qmil6zy	2	7	/products?category=accessories&sub=memory-card&brand=sony	\N	t	f	2026-09-22 14:33:52.012	2026-09-22 14:33:52.012
cmucrygss00b310zn18n17dcw	TwinMOS	twinmos	cmucrif1q0015sx009qmil6zy	2	8	/products?category=accessories&sub=memory-card&brand=twinmos	\N	t	f	2026-09-22 14:33:52.013	2026-09-22 14:33:52.013
cmucrygst00b510zn31ltz0ih	Samsung	samsung	cmucrif1q0015sx009qmil6zy	2	9	/products?category=accessories&sub=memory-card&brand=samsung	\N	t	f	2026-09-22 14:33:52.013	2026-09-22 14:33:52.013
cmucrygsu00b710zni034way5	Nikon	nikon	cmucrif1q0015sx009qmil6zy	2	10	/products?category=accessories&sub=memory-card&brand=nikon	\N	t	f	2026-09-22 14:33:52.014	2026-09-22 14:33:52.014
cmucrygsu00b910zn8s7rqmi0	Dahua	dahua	cmucrif1q0015sx009qmil6zy	2	11	/products?category=accessories&sub=memory-card&brand=dahua	\N	t	f	2026-09-22 14:33:52.015	2026-09-22 14:33:52.015
cmucrygsv00bb10znyyf7ktu7	Smart	smart	cmucrif1q0015sx009qmil6zy	2	12	/products?category=accessories&sub=memory-card&brand=smart	\N	t	f	2026-09-22 14:33:52.015	2026-09-22 14:33:52.015
cmucrygsw00bd10zndt82sjpa	Hiksemi	hiksemi	cmucrif1q0015sx009qmil6zy	2	13	/products?category=accessories&sub=memory-card&brand=hiksemi	\N	t	f	2026-09-22 14:33:52.017	2026-09-22 14:33:52.017
cmucrygsy00bf10znomcldsra	Jovision	jovision	cmucrif1q0015sx009qmil6zy	2	14	/products?category=accessories&sub=memory-card&brand=jovision	\N	t	f	2026-09-22 14:33:52.018	2026-09-22 14:33:52.018
cmucrygsy00bh10znmn36zine	Kingston	kingston	cmucrif1q0015sx009qmil6zy	2	15	/products?category=accessories&sub=memory-card&brand=kingston	\N	t	f	2026-09-22 14:33:52.019	2026-09-22 14:33:52.019
cmucrygsz00bj10znice0em9k	OCPC	ocpc	cmucrif1q0015sx009qmil6zy	2	16	/products?category=accessories&sub=memory-card&brand=ocpc	\N	t	f	2026-09-22 14:33:52.02	2026-09-22 14:33:52.02
cmucrygt000bl10zn02fze5c0	EZVIZ	ezviz	cmucrif1q0015sx009qmil6zy	2	17	/products?category=accessories&sub=memory-card&brand=ezviz	\N	t	f	2026-09-22 14:33:52.02	2026-09-22 14:33:52.02
cmucrygt100bn10znp7yhjrvs	HP	hp	cmucrif1q0015sx009qmil6zy	2	18	/products?category=accessories&sub=memory-card&brand=hp	\N	t	f	2026-09-22 14:33:52.021	2026-09-22 14:33:52.021
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, "orderId", "productId", "productName", "productSlug", "productSku", "imageUrl", "variantLabel", "unitPrice", quantity, "lineTotal", "createdAt") FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, "orderNumber", status, "firstName", "lastName", address, upazila, district, mobile, email, comment, "paymentMethod", "deliveryMethod", "deliveryFee", subtotal, total, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, "productId", url, alt, "order", "isPrimary", "createdAt") FROM stdin;
cmr9jbaxd000nt1wvndp217jt	cmr9esnv10002t1wvup6a0f8w	https://www.techlandbd.com/cache/images/uploads/products/P0322511005/gigabyte-graphics-card-geforce-rtx-5060-aero-oc-8g-cover.webp	Gigabyte GeForce RTX 5060 AERO OC 8G GDDR7 Graphics Card	0	t	2026-07-06 18:09:28.85
cmrdav7j10003gb3wnb3kzs63	cmrdav7iw0002gb3wq5ky2u80	https://www.startech.com.bd/image/cache/catalog/motherboard/msi/pro-h610m-e-ddr4/pro-h610m-e-ddr4-01-500x500.webp	MSI PRO H610M-E DDR4 mATX Motherboard	0	t	2026-07-09 09:24:05.725
cmrdav7j10004gb3wq2iaqr8q	cmrdav7iw0002gb3wq5ky2u80	https://www.startech.com.bd/image/cache/catalog/motherboard/msi/pro-h610m-e-ddr4/pro-h610m-e-ddr4-03-500x500.webp	MSI PRO H610M-E DDR4 mATX Motherboard	1	f	2026-07-09 09:24:05.725
cmtn5e2zv0004udp6drfbdw1m	cmtn5e2zr0003udp6yvyg5ila	https://placehold.co/800x800/111111/e11d48/png?text=Sapphire+RX+6600+XT	Sapphire Pulse AMD Radeon RX 6600 XT Gaming OC 8GB GDDR6 Graphics Card	0	t	2026-09-04 16:07:55.052
cmtn5tr3w000ldjdeknjlfgls	cmtn5tr3t000kdjded7l6qx1m	https://placehold.co/800x800/111111/ffffff/png?text=TEAM+ELITE+8GB+Laptop+RAM	TEAM ELITE 8GB 3200MHz Laptop RAM	0	t	2026-09-04 16:20:06.141
cmu1dbkyw000p2hq4lxfrp9g0	cmr9bvsa7004jnjjlzqzyt643	https://www.startech.com.bd/image/cache/catalog/processor/amd/5600x/5600x-001-500x500.jpg	AMD Ryzen 5 5600X	0	t	2026-09-14 14:58:41.768
cmu1hwflo0001yid2ltot1uox	cmr9bvs9s0042njjlfqeg1cdv	https://www.startech.com.bd/image/cache/catalog/processor/intel/i5-12400/i5-12400-001-500x500.jpg	Intel Core i5-12400F	0	t	2026-09-14 17:06:53.053
cmu2p7k3j003faap1oqmnu98c	cmu2p7k3d003eaap1g3pu2qg3	/uploads/processors/i5-14600k.jpg	Intel Core i5-14600K	0	t	2026-09-15 13:19:15.583
cmu2p7ka0005zaap1paywarex	cmu2p7k9z005yaap11hik0ma8	/uploads/processors/i7-14700k.jpg	Intel Core i7-14700K	0	t	2026-09-15 13:19:15.817
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
cmu3w20lv000muyr5rknpaw2s	cmu2p7kdf007vaap1w8ihfmcu	/uploads/processors/amd-ryzen-5-5600.jpg	AMD Ryzen 5 5600 Processor	0	t	2026-09-16 09:18:40.531
cmu2p7k8r005caap1u0r7z5k8	cmu2p7k8p005baap13y3b5gko	/uploads/processors/amd-ryzen-5-7600.webp	AMD Ryzen 5 7600 Gaming Processor	0	t	2026-09-15 13:19:15.772
cmu1h8rzd0001bpnxr51w1ip9	cmrcbkzit001a5menuqtjvxca	/uploads/processors/intel-core-i5-14400f-14th-gen-raptor-lake-processor.webp	Intel Core i5 14400F 14th Gen Raptor Lake Processor	0	t	2026-09-14 16:48:29.354
cmu2p7k75004paap1b13msdll	cmu2p7k73004oaap136n88e7i	/uploads/processors/intel-core-ultra-7-265k.webp	Intel Core Ultra 7 265K Arrow Lake Processor	0	t	2026-09-15 13:19:15.713
cmu2p7k4v0042aap1voy6ij0x	cmu2p7k4u0041aap1z5iwkuq2	/uploads/processors/amd-ryzen-7-7800x3d.webp	AMD Ryzen 7 7800X3D Processor	0	t	2026-09-15 13:19:15.632
cmu2p7kb4006maap1brnfj7kp	cmu2p7kb3006laap1k0e6z4b3	/uploads/processors/amd-ryzen-9-7950x.webp	AMD Ryzen 9 7950X Processor	0	t	2026-09-15 13:19:15.857
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
cmu6pyny100eb14lfj3gxfoho	cmu6pyny000ea14lfi7waffpz	/uploads/motherboards/msi-pro-h610m-s-ddr4-ii-matx-motherboard.webp	MSI PRO H610M-S DDR4 II mATX Motherboard	0	t	2026-09-18 08:51:24.986
cmu6pyo0t00gj14lfxjm14gqu	cmu6pyo0s00gi14lfjfngwo9u	/uploads/motherboards/msi-pro-h610m-s-ddr4-m-atx-motherboard.webp	MSI PRO H610M-S DDR4 m-ATX Motherboard	0	t	2026-09-18 08:51:25.085
cmu6r4g8r002ceqeww0m68b3t	cmu6r4g8q002beqew38zed8wq	/uploads/ram/adata-8gb-ddr5-5600mhz-cl46-u-dimm-desktop-ram.webp	Adata 8GB DDR5 5600MHz CL46 U-DIMM Desktop RAM	0	t	2026-09-18 09:23:54.556
cmu6r4gjf009weqewzqzo8wpt	cmu6r4gje009veqewqm14yift	/uploads/ram/colorful-cvn-guardian-8gb-ddr4-3200mhz-rgb-desktop-ram.webp	Colorful CVN Guardian 8GB DDR4 3200MHz RGB Desktop RAM	0	t	2026-09-18 09:23:54.94
cmu6r4giw009keqewg28pwieu	cmu6r4giv009jeqewwv6hvpgl	/uploads/ram/kimtigo-wolfrine-16gb-3200mhz-ddr4-udimm-desktop-ram-white.webp	Kimtigo WOLFRINE 16GB 3200MHz DDR4 UDIMM Desktop RAM White	0	t	2026-09-18 09:23:54.92
cmu6r4gka00akeqew9xdlvtnr	cmu6r4gk800ajeqewqntcnzam	/uploads/ram/kingbank-kjxb-16gb-ddr4-3200mhz-desktop-ram.webp	KingBank KJXB 16GB DDR4 3200MHz Desktop RAM	0	t	2026-09-18 09:23:54.97
cmu6r4gjw00a9eqew23w079xo	cmu6r4gjv00a8eqewlxe2djxh	/uploads/ram/oscoo-warrior-e500-32gb-ddr5-5200mhz-cl36-desktop-ram.webp	OSCOO Warrior E500 32GB DDR5 5200MHz CL36 Desktop RAM	0	t	2026-09-18 09:23:54.956
cmrj08qjt0003ykwwqgf03v5s	cmrj08qjc0002ykwwkebscxas	/uploads/ram/g-skill-trident-z5-16gb-ddr5-5600mhz-cl36-desktop-ram-silver.jpg	G.Skill Trident Z5 16GB DDR5 5600MHz CL36 Desktop RAM Silver	0	t	2026-07-13 09:13:18.185
cmu6pynvi00c314lfwry8j92h	cmu6pynvi00c214lfh2lvojue	/uploads/motherboards/asrock-h610m-h2-m-2-14th-13th-and-12th-gen-matx-ddr5-motherboard.webp	ASROCK H610M-H2/M.2 14th, 13th and 12th Gen mATX DDR5 Motherboard	0	t	2026-09-18 08:51:24.895
cmucy83qt000k5jvpfwy3l7e9	cmu6pyo1e00h214lfy6uwilf9	/uploads/motherboards/msi-pro-h610m-e-matx-motherboard.webp	MSI PRO H610M-E mATX Motherboard	0	t	2026-09-22 17:29:19.35
cmuczczt90009mhtfzig2wxdd	cmuczczt50008mhtf6fate690	/uploads/processors/amd-athlon-pro-300ge-processor.jpg	AMD Athlon PRO 300GE AM4 Socket Desktop Processor with Radeon Vega 3 Graphics (Rebox)	0	t	2026-09-22 18:01:07.149
cmuczd0f9000emhtfr95vzssw	cmuczd0f8000dmhtfghy44gvu	/uploads/processors/amd-ryzen-5-2400g-processor.webp	AMD Ryzen 5 2400G Desktop Processor with Radeon RX Vega 11 Graphics	0	t	2026-09-22 18:01:07.941
cmuczd1bh000jmhtfn96z1vbe	cmuczd1bg000imhtf8v98k9y1	/uploads/processors/amd-ryzen-5-pro-2400ge-processor.webp	AMD Ryzen 5 Pro 2400GE Desktop Processor with Radeon RX Vega 11 Graphics	0	t	2026-09-22 18:01:09.101
cmuczd1tj000omhtf8tep3wlj	cmuczd1ti000nmhtfcoruymig	/uploads/processors/intel-pentium-gold-g6400-processor.jpg	Intel Pentium Gold G6400 10th gen Coffee Lake Processor	0	t	2026-09-22 18:01:09.751
cmuczd2xt000tmhtf65o6lacx	cmuczd2xs000smhtf2rbeam9u	/uploads/processors/amd-ryzen-3-3200g.jpg	AMD Ryzen 3 3200G Processor with Radeon RX Vega 8 Graphics	0	t	2026-09-22 18:01:11.202
cmuczd3jr000ymhtf4dbbcj74	cmuczd3jq000xmhtfrbdmek7x	/uploads/processors/amd-ryzen-5-3400g-processor.jpg	AMD Ryzen 5 3400G Processor with Radeon RX Vega 11 Graphics	0	t	2026-09-22 18:01:11.991
cmu2p7kca0079aap1rmur3aib	cmu2p7kc80078aap1yam8femo	/uploads/processors/intel-core-i3-14100.jpg	AMD Ryzen 3 4100 Processor	0	t	2026-09-15 13:19:15.898
cmuczd4zp0013mhtf5g68er6z	cmuczd4zo0012mhtfb4mlwwb5	/uploads/processors/intel-core-i3-10100-processor.jpg	Intel 10th Gen Core i3 10100 Processor	0	t	2026-09-22 18:01:13.861
cmuczd5s10018mhtfygkylzy7	cmuczd5s00017mhtfw7vsvpio	/uploads/processors/amd-ryzen-5-5500-processor.jpg	AMD Ryzen 5 5500 Processor	0	t	2026-09-22 18:01:14.881
cmuczd6dz001dmhtfw1cmo917	cmuczd6dy001cmhtf6qwvxe2s	/uploads/processors/intel-core-i3-10105-10th-gen-processor.jpg	Intel Core i3 10105 10th Gen Comet Lake Processor	0	t	2026-09-22 18:01:15.671
cmuczd6zx001imhtf6lp1vgfp	cmuczd6zw001hmhtfr8l6jg6q	/uploads/processors/intel-core-i5-10500t-processor.webp	Intel Core i5-10500T 10th Gen Processor	0	t	2026-09-22 18:01:16.461
cmuczd7j3001nmhtf0oxevxm5	cmuczd7j2001mmhtfi4dhg601	/uploads/processors/amd-ryzen-5-8400f-processor.webp	AMD Ryzen 5 8400F Processor	0	t	2026-09-22 18:01:17.151
cmuczd8q5001smhtfnnkdg4va	cmuczd8q4001rmhtfh9rootv6	/uploads/processors/intel-core-i5-10500-processor.jpg	Intel 10th Gen Core i5-10500 Processor	0	t	2026-09-22 18:01:18.701
cmuczd99k001xmhtff6s75bz5	cmuczd99j001wmhtfsi9gp0fc	/uploads/processors/intel-core-i5-10505-processor.webp	Intel 10th Gen Core i5-10505 Processor	0	t	2026-09-22 18:01:19.401
cmuczda9p0022mhtfyacdj6rq	cmuczda9o0021mhtfo1gveq7b	/uploads/processors/intel-core-i5-11500t-11th-gen-processor.jpg	Intel Core i5-11500T 11th Gen Processor	0	t	2026-09-22 18:01:20.701
cmuczdbc10027mhtf0aoyfspg	cmuczdbc00026mhtfleor0tbj	/uploads/processors/intel-core-i5-10400-processor.jpg	Intel 10th Gen Core i5-10400 Processor	0	t	2026-09-22 18:01:22.081
cmuczdbu3002cmhtfr0ay9rpb	cmuczdbu2002bmhtfqe8psv3t	/uploads/processors/intel-core-i3-12100t-12th-gen-processor.jpg	Intel Core i3 12100T 12th Gen Alder Lake Processor	0	t	2026-09-22 18:01:22.731
cmuczdced002hmhtfsizrmm9q	cmuczdcec002gmhtf06cq2ial	/uploads/processors/intel-core-i3-12100-12th-gen-alder-lake-processor.jpg	Intel Core i3-12100 12th Gen Alder Lake Processor	0	t	2026-09-22 18:01:23.461
cmuczdcw5002mmhtfe62nfk43	cmuczdcw4002lmhtf1md8icgs	/uploads/processors/intel-core-i5-11500-11th-gen-processor.jpg	Intel 11th Gen Core i5-11500 Rocket Lake Processor	0	t	2026-09-22 18:01:24.101
cmuczddeb002rmhtfzp9boggb	cmuczddea002qmhtfyywq7t5k	/uploads/processors/amd-ryzen-5-7500f-processor.webp	AMD Ryzen 5 7500F Processor	0	t	2026-09-22 18:01:24.755
cmuczde54002wmhtfa6wp5pey	cmuczde53002vmhtfwkvc4d8o	/uploads/processors/amd-ryzen-5-pro-5650ge-processor.webp	AMD Ryzen 5 PRO 5650GE Processor with Radeon Graphics	0	t	2026-09-22 18:01:25.721
cmuczdepo0031mhtfahqmkxp7	cmuczdepn0030mhtfnhev3nnb	/uploads/processors/intel-core-i5-11400-11th-gen-processor.jpg	Intel 11th Gen Core i5-11400 Rocket Lake Processor	0	t	2026-09-22 18:01:26.461
cmuczdf8u0036mhtfxtjn8kwu	cmuczdf8t0035mhtfijl5ofja	/uploads/processors/amd-ryzen-5-8500g-processor.webp	AMD Ryzen 5 8500G Processor with Radeon Graphics	0	t	2026-09-22 18:01:27.151
cmuczdfte003bmhtfkywsu1fa	cmuczdfte003amhtfwwdfz5ss	/uploads/processors/amd-ryzen-5-pro-5650g-processor.webp	AMD Ryzen 5 PRO 5650G Processor with Radeon Graphics	0	t	2026-09-22 18:01:27.891
cmuczdgba003gmhtfg02ala5s	cmuczdgb8003fmhtfvn0q997d	/uploads/processors/intel-core-i3-14100-14th-gen-processor.webp	Intel Core i3 14100 14th Gen Raptor Lake Processor	0	t	2026-09-22 18:01:28.534
cmuczdh46003lmhtfohr9r09m	cmuczdh45003kmhtfv73a0hxt	/uploads/processors/amd-ryzen-5-5500gt-processor.webp	AMD Ryzen 5 5500GT AM4 Processor with Radeon Graphics	0	t	2026-09-22 18:01:29.575
cmuczdhto003qmhtfh5fgyaot	cmuczdhtm003pmhtfyik2s4fj	/uploads/processors/amd-ryzen-5-5600gt-processor.webp	AMD Ryzen 5 5600GT AM4 Processor with Radeon Graphics	0	t	2026-09-22 18:01:30.492
cmuczdio9003vmhtf2rk2glnl	cmuczdio8003umhtfm3ui4b98	/uploads/processors/intel-12th-gen-core-i5-12400f-alder-lake-processor.jpg	Intel 12th Gen Core i5-12400F Alder Lake Processor	0	t	2026-09-22 18:01:31.593
cmuczdjmg0040mhtf1gbjttkg	cmuczdjme003zmhtfflp7qp3w	/uploads/processors/amd-ryzen-7-5700x-processor.jpg	AMD Ryzen 7 5700X Processor	0	t	2026-09-22 18:01:32.824
cmuczdl4u0045mhtfd40z3uo3	cmuczdl4t0044mhtfttb91bwf	/uploads/processors/amd-ryzen-5-7600x-processor.webp	AMD Ryzen 5 7600X Processor	0	t	2026-09-22 18:01:34.783
cmuczdm4h004amhtf4pzqykdq	cmuczdm4g0049mhtf5ryhrfa6	/uploads/processors/amd-ryzen-7-pro-5755g-processor.webp	AMD Ryzen 7 PRO 5755G Processor with Radeon Graphics	0	t	2026-09-22 18:01:36.066
cmuczdnlf004fmhtfj97ld46i	cmuczdnle004emhtfkbo8yhvm	/uploads/processors/amd-ryzen-7-5700g-processor.webp	AMD Ryzen 7 5700G Processor with Radeon Graphics	0	t	2026-09-22 18:01:37.971
cmuczdoky004kmhtf7jhjfivc	cmuczdokx004jmhtfj9vasi94	/uploads/processors/intel-core-ultra-5-225-processor.webp	Intel Core Ultra 5 225 Arrow Lake Processor	0	t	2026-09-22 18:01:39.251
cmuczdpy4004pmhtf0ecfjubr	cmuczdpy3004omhtfpo5snty4	/uploads/processors/intel-12th-gen-core-i5-12400-alder-lake-processor.webp	Intel 12th Gen Core i5-12400 Alder Lake Processor	0	t	2026-09-22 18:01:41.021
cmuczdr4d004umhtfp8jtvwfd	cmuczdr4c004tmhtfa2xz0pnc	/uploads/processors/amd-ryzen-5-8600g-processor.webp	AMD Ryzen 5 8600G Processor with Radeon Graphics	0	t	2026-09-22 18:01:42.541
cmuczds3w004zmhtfssa45fzs	cmuczds3v004ymhtf4ewemk50	/uploads/processors/intel-core-i5-14400-14th-gen-processor.webp	Intel Core i5 14400 14th Gen Raptor Lake Processor	0	t	2026-09-22 18:01:43.821
cmuczdsle0054mhtf7h6z6cg7	cmuczdsld0053mhtfcewx4wa0	/uploads/processors/intel-12th-gen-core-i5-12500-alder-lake-processor.jpg	Intel 12th Gen Core i5-12500 Alder Lake Processor	0	t	2026-09-22 18:01:44.451
cmuczdtdr0059mhtfx4uiaoy7	cmuczdtdq0058mhtf493du620	/uploads/processors/amd-ryzen-5-9600x-gaming-processor.webp	AMD Ryzen 5 9600X AM5 Desktop Gaming Processor	0	t	2026-09-22 18:01:45.471
cmuczdtzy005emhtfxns69i46	cmuczdtzx005dmhtfn2qf3lee	/uploads/processors/amd-ryzen-7-7700-processor.webp	AMD Ryzen 7 7700 Gaming Processor	0	t	2026-09-22 18:01:46.271
cmuczdumg005jmhtf7spbwqsm	cmuczdumf005imhtf7jvtj6vw	/uploads/processors/intel-core-i7-10700-processor.jpg	Intel 10th Gen Core i7-10700 Processor	0	t	2026-09-22 18:01:47.081
cmuczdv5m005omhtfjhlernz9	cmuczdv5l005nmhtf8y5os0bj	/uploads/processors/amd-ryzen-7-7700x-processor.webp	AMD Ryzen 7 7700X Processor	0	t	2026-09-22 18:01:47.771
cmuczdvuc005tmhtfmzl5gxkt	cmuczdvuc005smhtfcj5hq3j9	/uploads/processors/intel-core-i5-14500-14th-gen-processor.webp	Intel Core i5 14500 14th Gen Raptor Lake Processor	0	t	2026-09-22 18:01:48.661
cmuczdwlu005ymhtf4au394x5	cmuczdwlt005xmhtfpxnirudz	/uploads/processors/intel-13th-gen-core-i5-13400-processor.webp	Intel 13th Gen Core i5 13400 Raptor Lake Processor	0	t	2026-09-22 18:01:49.651
cmuczdxfb0063mhtfta2jqbju	cmuczdxfa0062mhtflzltg3az	/uploads/processors/intel-core-ultra-5-250k-plus-processor.webp	Intel Core Ultra 5 250K Plus Arrow Lake Processor	0	t	2026-09-22 18:01:50.711
cmuczdy7m0068mhtf970odpzc	cmuczdy7l0067mhtfmmcw4qnj	/uploads/processors/intel-core-ultra-5-245k-processor.webp	Intel Core Ultra 5 245K Arrow Lake Processor	0	t	2026-09-22 18:01:51.731
cmuczdyze006dmhtfac5668jq	cmuczdyzd006cmhtf8vx62wvc	/uploads/processors/amd-ryzen-7-8700g-processor.webp	AMD Ryzen 7 8700G Processor with Radeon Graphics	0	t	2026-09-22 18:01:52.73
cmuczdzt4006imhtfkmsx2m0s	cmuczdzt3006hmhtfmmgtmd2j	/uploads/processors/intel-14th-gen-core-i5-14600k-processor.webp	Intel Core i5 14600K 14th Gen Raptor Lake Processor	0	t	2026-09-22 18:01:53.801
cmucze14m006nmhtf1bz8yzf8	cmucze14l006mmhtfvuxtualh	/uploads/processors/amd-ryzen-7-9700x-gaming-processor.webp	AMD Ryzen 7 9700X AM5 Desktop Gaming Processor	0	t	2026-09-22 18:01:55.51
cmucze2m8006smhtftmbyp8xf	cmucze2m7006rmhtfnj6cqzuo	/uploads/processors/amd-ryzen-9-5900x-processor.jpg	AMD Ryzen 9 5900X Processor	0	t	2026-09-22 18:01:57.44
cmucze3yk006xmhtfgyh9vbw0	cmucze3yj006wmhtfqayp3cp7	/uploads/processors/intel-12th-gen-core-i7-12700-alder-lake-processor.jpg	Intel 12th Gen Core i7-12700 Alder Lake Processor	0	t	2026-09-22 18:01:59.181
cmucze4jy0072mhtf82rfs4px	cmucze4jx0071mhtf0dcgiqc1	/uploads/processors/intel-13th-gen-core-i7-13700kf-processor.webp	Intel 13th Gen Core i7 13700KF Raptor Lake Processor	0	t	2026-09-22 18:01:59.951
cmucze5cv0077mhtf8t9ax35e	cmucze5cu0076mhtfisxkijo2	/uploads/processors/amd-ryzen-9-7900x-processor.webp	AMD Ryzen 9 7900X Processor	0	t	2026-09-22 18:02:00.991
cmucze6v0007cmhtf87dnc1di	cmucze6uz007bmhtfu3awyvz2	/uploads/processors/intel-12th-gen-core-i7-12700k-alder-lake-processor.jpg	Intel 12th Gen Core i7-12700K Alder Lake Processor	0	t	2026-09-22 18:02:02.941
cmucze7ul007hmhtf2anlk8bd	cmucze7uk007gmhtfo4zk5719	/uploads/processors/intel-core-ultra-7-270k-plus-processor.webp	Intel Core Ultra 7 270K Plus Arrow Lake Processor	0	t	2026-09-22 18:02:04.221
cmucze9a8007mmhtf9y4i2q1s	cmucze9a7007lmhtf7c1gjyoc	/uploads/processors/intel-13th-gen-core-i7-13700-processor.webp	Intel 13th Gen Core i7 13700 Raptor Lake Processor	0	t	2026-09-22 18:02:06.081
cmuczea2w007rmhtf7xrwsnp1	cmuczea2u007qmhtf364bvmd6	/uploads/processors/intel-14th-gen-core-i7-14700kf-processor.webp	Intel Core i7 14700KF 14th Gen Raptor Lake Processor	0	t	2026-09-22 18:02:07.112
cmuczeb5q007wmhtfksqajz8z	cmuczeb5p007vmhtfos5w9mv5	/uploads/processors/amd-ryzen-9-9900x-gaming-processor.webp	AMD Ryzen 9 9900X Gaming Processor	0	t	2026-09-22 18:02:08.511
cmuczecdw0081mhtfwe9cwqar	cmuczecdv0080mhtfxcyg7pg6	/uploads/processors/intel-13th-gen-core-i7-13700k-processor.webp	Intel 13th Gen Core i7 13700K Raptor Lake Processor	0	t	2026-09-22 18:02:10.101
cmuczecyq0086mhtfpfyp8e5y	cmuczecyp0085mhtfsob7rhh3	/uploads/processors/amd-ryzen-9-5950x-processor.jpg	AMD Ryzen 9 5950X Processor	0	t	2026-09-22 18:02:10.851
cmuczedwn008bmhtfn9nernk5	cmuczedwm008amhtfqj5kwr8l	/uploads/processors/intel-core-i7-14700-14th-gen-processor.webp	Intel Core i7 14700 14th Gen Raptor Lake Processor	0	t	2026-09-22 18:02:12.071
cmuczeenu008gmhtf2mw50pxk	cmuczeent008fmhtfvk0ci4tq	/uploads/processors/intel-14th-gen-core-i7-14700k-processor.webp	Intel Core i7 14700K 14th Gen Raptor Lake Processor	0	t	2026-09-22 18:02:13.05
cmuczefcu008lmhtfl2gr5jr4	cmuczefct008kmhtfpqzrd1i9	/uploads/processors/amd-ryzen-9-7950x3d-processor.webp	AMD Ryzen 9 7950X3D Gaming Processor	0	t	2026-09-22 18:02:13.95
cmuczegdi008qmhtfdwgtrjvz	cmuczegdh008pmhtfbp88x09g	/uploads/processors/amd-ryzen-9-9950x-gaming-processor.webp	AMD Ryzen 9 9950X Gaming Processor	0	t	2026-09-22 18:02:15.27
cmuczehvf008vmhtfqoybhj0r	cmuczehvd008umhtfve9dygqd	/uploads/processors/intel-14th-gen-core-i9-14900kf-processor.webp	Intel Core i9 14900KF 14th Gen Raptor Lake Processor	0	t	2026-09-22 18:02:17.211
cmuczeji00090mhtflf1cvh4l	cmuczejhz008zmhtf833x4kqa	/uploads/processors/intel-14th-gen-core-i9-14900k-processor.webp	Intel Core i9 14900K 14th Gen Raptor Lake Processor	0	t	2026-09-22 18:02:19.32
cmuczek020095mhtfeyhjnkaa	cmuczek020094mhtf8gxu25yp	/uploads/processors/amd-ryzen-7-9800x3d-processor.webp	AMD Ryzen 7 9800X3D Gaming Processor	0	t	2026-09-22 18:02:19.971
cmuczeku2009amhtfb8pfq0jp	cmuczeku10099mhtf7n8yk5gv	/uploads/processors/amd-ryzen-7-9850x3d-processor.webp	AMD RYZEN 7 9850X3D Gaming Processor	0	t	2026-09-22 18:02:21.051
cmuczelga009fmhtfs5t773aa	cmuczelg9009emhtf5gg79ukw	/uploads/processors/intel-core-ultra-9-285k-processor.webp	Intel Core Ultra 9 285K Arrow Lake Processor	0	t	2026-09-22 18:02:21.851
cmuczemeg009kmhtf18srpg65	cmuczemef009jmhtf8f8nhdh8	/uploads/processors/amd-ryzen-9-9900x3d-processor.webp	AMD Ryzen 9 9900X3D Gaming Processor	0	t	2026-09-22 18:02:23.08
cmuczen8g009pmhtfhu6qet2h	cmuczen8f009omhtfeyrd47re	/uploads/processors/amd-ryzen-9-9950x3d-processor.webp	AMD Ryzen 9 9950X3D Gaming Processor	0	t	2026-09-22 18:02:24.161
cmuczfepv0003dmdm9eqk12wg	cmuczfepr0002dmdmxlb8v8or	/uploads/processors/amd-ryzen-3-4100-processor.jpg	AMD Ryzen 3 4100 Processor	0	t	2026-09-22 18:02:59.78
cmudstxz6004e12erquseaiak	cmudstxz5004d12erhocnn1kr	/uploads/gpus/afox-nvidia-geforce-gt-610-2gb-gddr3-graphics-card.webp	AFOX NVIDIA GeForce GT 610 2GB GDDR3 Graphics Card	0	t	2026-09-23 07:46:06.786
cmudsty0a005a12erpg3qywip	cmudsty09005912er0r0xr2l1	/uploads/gpus/afox-nvidia-geforce-gt-710-2gb-gddr3-graphics-card.webp	AFOX NVIDIA GeForce GT 710 2GB GDDR3 Graphics Card	0	t	2026-09-23 07:46:06.827
cmudstxzu004x12erlrl6fkot	cmudstxzt004w12ernmf0xv62	/uploads/gpus/colorful-geforce-gt710-2gd3-v-2gb-graphics-card.jpg	Colorful GeForce GT710-2GD3-V 2GB Graphics Card	0	t	2026-09-23 07:46:06.811
cmudstyl000ho12erxtjxbx61	cmudstykz00hn12erff1aqxl5	/uploads/gpus/afox-geforce-gtx-1660ti-6gb-gddr6-atx-dual-fan-graphics-card.webp	AFOX Geforce GTX 1660Ti 6GB GDDR6 ATX Dual Fan Graphics Card	0	t	2026-09-23 07:46:07.573
cmudstymy00jc12er9zsmxnfs	cmudstymw00jb12erik8n3liu	/uploads/gpus/afox-geforce-rtx-3050-8gb-gddr6-dual-fan-graphics-card.webp	AFOX Geforce RTX 3050 8GB GDDR6 Dual Fan Graphics Card	0	t	2026-09-23 07:46:07.642
cmudsty7d009i12erau6m97kw	cmudsty7c009h12eruf2x7bdd	/uploads/gpus/afox-nvidia-geforce-gt-1030-2gb-gddr5-graphics-card.webp	AFOX NVIDIA GeForce GT 1030 2GB GDDR5 Graphics Card	0	t	2026-09-23 07:46:07.081
cmudsty1t006l12erwkv7mjgh	cmudsty1s006k12erzk1msmf5	/uploads/gpus/afox-nvidia-geforce-gt-710-4gb-gddr3-graphics-card.webp	AFOX NVIDIA GeForce GT 710 4GB GDDR3 Graphics Card	0	t	2026-09-23 07:46:06.882
cmudstyhg00f112ers24hqgxp	cmudstyhf00f012erp6g3d73f	/uploads/gpus/afox-nvidia-geforce-gtx-1050-ti-4gb-gddr5-graphics-card.webp	AFOX NVIDIA GeForce GTX 1050 Ti 4GB GDDR5 Graphics Card	0	t	2026-09-23 07:46:07.444
cmudstycb00ce12eru7a2l77e	cmudstyca00cd12erfwj2dch9	/uploads/gpus/afox-nvidia-geforce-gtx-750-ti-4gb-gddr5-graphics-card.webp	AFOX NVIDIA GeForce GTX 750 Ti 4GB GDDR5 Graphics Card	0	t	2026-09-23 07:46:07.259
cmudsty2w007h12erc4vwl751	cmudsty2v007g12erze7grqbk	/uploads/gpus/afox-radeon-r7-350-2gb-gddr5-single-fan-graphics-card.webp	AFOX Radeon R7 350 2GB GDDR5 Single Fan Graphics Card	0	t	2026-09-23 07:46:06.92
cmudsty8m00ad12ersn0cyvno	cmudsty8j00ac12er2ib55kvk	/uploads/gpus/afox-radeon-rx-550-4gb-gddr5-dual-fan-graphics-card.jpg	AFOX Radeon RX 550 4GB GDDR5 Dual Fan Graphics Card	0	t	2026-09-23 07:46:07.127
cmudsty58008b12er6tgwmtvu	cmudsty57008a12er76xhq3lo	/uploads/gpus/arktek-amd-radeon-rx-550-4gb-gddr5-graphics-card.webp	ARKTEK AMD Radeon RX 550 4GB GDDR5 Graphics Card	0	t	2026-09-23 07:46:07.004
cmudstyax00bo12erqrnehvkw	cmudstyav00bn12erlcbwisvg	/uploads/gpus/arktek-amd-radeon-rx-550-8gb-gddr5-graphics-card.webp	ARKTEK AMD Radeon RX 550 8GB GDDR5 Graphics Card	0	t	2026-09-23 07:46:07.209
cmudstyjf00gj12errpd0owbh	cmudstyjf00gi12erc71ye5ib	/uploads/gpus/arktek-geforce-gtx-1660-ti-6gb-gddr6-graphics-card.webp	ARKTEK GeForce GTX 1660 Ti 6GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.516
cmudstymh00ix12ermtnzj5t7	cmudstymh00iw12ertn6q7xqd	/uploads/gpus/arktek-geforce-rtx-3050-8gb-gddr6-graphics-card.webp	ARKTEK GeForce RTX 3050 8GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.626
cmudstyiu00g412erbcjr8nqn	cmudstyit00g312erboagu5q8	/uploads/gpus/arktek-gtx-1660-super-6gb-gddr6-graphics-card.webp	ARKTEK GTX 1660 Super 6GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.495
cmudstygc00e812ergu33yfu8	cmudstygb00e712ervhilh295	/uploads/gpus/arktek-rx-580-8gb-256bit-gddr5-graphics-card.webp	ARKTEK RX 580 8GB 256bit GDDR5 Graphics Card	0	t	2026-09-23 07:46:07.404
cmudstyid00fq12erxcfgh26c	cmudstyic00fp12eraisuhrax	/uploads/gpus/asus-dual-radeon-rx-6500-xt-v2-oc-edition-4gb-gddr6-graphics-card.webp	ASUS Dual Radeon RX 6500 XT V2 OC Edition 4GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.477
cmudsty0v005s12ertwett8bk	cmudsty0u005r12er7fotxvp3	/uploads/gpus/asus-geforce-gt-710-2gb-gddr5-evo-low-profile-graphics-card.webp	ASUS GeForce GT 710 2GB GDDR5 EVO Low-profile Graphics Card	0	t	2026-09-23 07:46:06.848
cmudsty3u007x12erdbilz5fz	cmudsty3q007w12ernj5jmvfr	/uploads/gpus/asus-geforce-gt-730-2gb-gddr5-graphics-card.jpg	Asus Geforce Gt 730 2GB GDDR5 Graphics Card	0	t	2026-09-23 07:46:06.955
cmudstya300bb12er69uarrgr	cmudsty9z00ba12ersqftgf46	/uploads/gpus/asus-geforce-gt-730-2gb-gddr5-graphics-card-with-4-hdmi-ports.webp	Asus Geforce GT 730 2GB GDDR5 Graphics Card with 4 HDMI Ports	0	t	2026-09-23 07:46:07.18
cmudstylj00i412erv92hgf3w	cmudstyli00i312eru6zx0w43	/uploads/gpus/colorful-geforce-rtx-3050-6gb-v4-v-gddr6-graphics-card.webp	Colorful GeForce RTX 3050 6GB V4-V GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.591
cmudstybs00c312er8awljkz3	cmudstybq00c212erzrrkok1y	/uploads/gpus/gigabyte-intel-arc-a310-windforce-4g-gddr6-graphics-card.webp	GIGABYTE Intel Arc A310 WINDFORCE 4G GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.241
cmudstyhy00ff12erphnq7jfu	cmudstyhx00fe12er5x14xat3	/uploads/gpus/gigabyte-intel-arc-a380-gaming-oc-6g-gddr6-graphics-card.webp	GIGABYTE Intel Arc A380 GAMING OC 6G GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.462
cmudsty8100a012erui3hdvhz	cmudsty80009z12erh29741nz	/uploads/gpus/gunnir-intel-arc-a310-index-4gb-gddr6-graphics-card.webp	Gunnir Intel ARC A310 Index 4GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.106
cmudstym000ij12er6ihld1ag	cmudstylz00ii12ert49h9nit	/uploads/gpus/manli-geforce-rtx-3050-6gb-nebula-twin-v2-gddr6-graphics-card.webp	Manli GeForce RTX 3050 6GB Nebula Twin V2 GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.609
cmudstyfw00dv12erclg71xi6	cmudstyfv00du12er9xcxfmto	/uploads/gpus/msi-geforce-gt-1030-aero-itx-oc-4gb-gddr4-graphic-card.webp	MSI GeForce GT 1030 AERO ITX OC 4GB GDDR4 Graphic Card	0	t	2026-09-23 07:46:07.389
cmudsty6c008q12er4kqjzpf4	cmudsty69008p12eric4djq2u	/uploads/gpus/msi-geforce-gt-730-4gb-ddr3-graphics-card.webp	MSI GeForce GT 730 4GB DDR3 Graphics Card	0	t	2026-09-23 07:46:07.044
cmudsty2f007312erlxc9tl0k	cmudsty2e007212er8n199i2h	/uploads/gpus/msi-gt-710-2gd3h-lp-2gb-ddr3-gaming-graphic-card.jpg	MSI GT 710 2GD3H LP 2GB DDR3 Gaming Graphic Card	0	t	2026-09-23 07:46:06.903
cmudsty1c006612erkt9zeybf	cmudsty1b006512erxddomgkp	/uploads/gpus/ocpc-geforce-gt-730-4gb-ddr3-graphics-card.webp	OCPC GeForce GT 730 4GB DDR3 Graphics Card	0	t	2026-09-23 07:46:06.864
cmudstykh00h912erxzykrvvg	cmudstykg00h812ertr1jpxpi	/uploads/gpus/ocpc-geforce-gtx-1660-ti-xm-6gb-gddr6-graphics-card.webp	OCPC GeForce GTX 1660 Ti XM 6GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.554
cmudsty6u009312erm7lshgeb	cmudsty6t009212erp9ouukyl	/uploads/gpus/ocpc-rx-550-xr-4gb-gddr5-graphics-card.webp	OCPC RX 550 XR 4GB GDDR5 Graphics Card	0	t	2026-09-23 07:46:07.062
cmudstyeg00d912erut6ej2s1	cmudstyee00d812er2ojfr1rx	/uploads/gpus/ocpc-rx-580-8gb-ddr5-xx-black-graphics-card.webp	OCPC RX 580 8GB DDR5 XX BLACK Graphics Card	0	t	2026-09-23 07:46:07.336
cmudstygw00eq12erzhxfp0rg	cmudstygv00ep12erojl4bh63	/uploads/gpus/peladn-rx-5500-8g-gddr6-dual-fan-gaming-graphics-card.webp	PELADN RX 5500 8G GDDR6 Dual Fan Gaming Graphics Card	0	t	2026-09-23 07:46:07.425
cmudstyjy00gy12erbd1xr6od	cmudstyjx00gx12eruyrgituu	/uploads/gpus/peladn-rx-5500-xt-8g-gddr6-dual-fan-black-gaming-graphics-card.webp	PELADN RX 5500 XT 8G GDDR6 Dual Fan Black Gaming Graphics Card	0	t	2026-09-23 07:46:07.534
cmudstyfe00dl12ero2heedbj	cmudstyfd00dk12erznevxzpf	/uploads/gpus/peladn-rx-580-8g-256bit-dual-fans-gaming-graphics-card.webp	PELADN RX 580 8G 256Bit Dual Fans Gaming Graphics Card	0	t	2026-09-23 07:46:07.37
cmudstydb00ct12erg7qkez6l	cmudstyd900cs12err78udcs9	/uploads/gpus/unika-radeon-rx-580-blizzards-8gd5-v2-8gb-gddr5-graphics-card.webp	Unika Radeon RX 580 BLIZZARDS 8GD5 V2 8GB GDDR5 Graphics Card	0	t	2026-09-23 07:46:07.296
cmudstyon00kx12ernj6hlbfe	cmudstyon00kw12ermfnga1j8	/uploads/gpus/asus-dual-geforce-rtx-3050-oc-edition-6gb-gddr6-graphics-card.webp	ASUS Dual GeForce RTX 3050 OC Edition 6GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.704
cmudstywh00rv12erg41mkwu5	cmudstywg00ru12erhsad21nw	/uploads/gpus/asus-dual-geforce-rtx-5050-8gb-gddr6-oc-edition-graphics-card.webp	ASUS Dual GeForce RTX 5050 8GB GDDR6 OC Edition Graphics Card	0	t	2026-09-23 07:46:07.985
cmudstyy400te12eri84ue1mk	cmudstyy300td12erh4ozp6ad	/uploads/gpus/asus-dual-geforce-rtx-5060-8gb-gddr7-graphics-card.webp	ASUS Dual GeForce RTX 5060 8GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.045
cmudstz1500w212erg6yqec7i	cmudstz1400w112erm4s5durz	/uploads/gpus/asus-dual-geforce-rtx-5060-white-oc-edition-8gb-gddr7-graphics-card.webp	ASUS Dual GeForce RTX 5060 White OC Edition 8GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.154
cmudstys200ny12erbztopnlc	cmudstys200nx12erlmc05dyx	/uploads/gpus/colorful-geforce-rtx-3050-nb-duo-v2-v-8gb-gddr6-graphics-card.webp	Colorful GeForce RTX 3050 NB DUO V2-V 8GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.827
cmudstywv00s912erdvoconvp	cmudstywv00s812ergov70jvx	/uploads/gpus/colorful-igame-geforce-rtx-5050-ultra-w-duo-oc-8gb-v-gddr6-graphics-card.webp	Colorful iGame GeForce RTX 5050 Ultra W DUO OC 8GB-V GDDR6 Graphics Card	0	t	2026-09-23 07:46:08
cmudstz2200wu12erimkchujy	cmudstz2100wt12er8x4e02y6	/uploads/gpus/colorful-igame-geforce-rtx-5060-ultra-w-duo-oc-8gb-v-gddr7-graphics-card.webp	Colorful iGame GeForce RTX 5060 Ultra W DUO OC 8GB-V GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.186
cmudstynw00k612erqf9xtg4u	cmudstynv00k512er09zo19dc	/uploads/gpus/gigabyte-geforce-rtx-3050-windforce-oc-v2-6gb-gddr6-graphics-card.webp	GIGABYTE GeForce RTX 3050 WINDFORCE OC V2 6GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.676
cmudstz1n00wg12erixb45te7	cmudstz1m00wf12ericuaoao4	/uploads/gpus/gigabyte-geforce-rtx-3060-windforce-oc-12gb-gddr6-graphics-card.webp	GIGABYTE GeForce RTX 3060 WINDFORCE OC 12GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.172
cmudstyoa00kk12erjhpyedfg	cmudstyoa00kj12er6tcxtl6o	/uploads/gpus/gunnir-intel-arc-a770-photon-8g-oc-gddr6-graphics-card.webp	GUNNIR Intel Arc A770 Photon 8G OC GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.691
cmudstyp100la12erc4uwmvtr	cmudstyp000l912erbijbj9cv	/uploads/gpus/gunnir-intel-arc-a770-photon-8g-oc-w-gddr6-graphics-card.webp	GUNNIR Intel Arc A770 Photon 8G OC W GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.717
cmudstyvj00r412ermyl9e220	cmudstyvj00r312er5jccc8g9	/uploads/gpus/inno3d-geforce-rtx-5050-twin-x2-8gb-gddr6-graphics-card.webp	INNO3D GeForce RTX 5050 TWIN X2 8GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.952
cmudstysy00os12erqwi71mvh	cmudstysx00or12er6svixl2h	/uploads/gpus/inno3d-geforce-rtx-5050-twin-x2-oc-8gb-gddr6-graphics-card.webp	INNO3D GeForce RTX 5050 TWIN X2 OC 8GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.859
cmudstyyj00ts12erc3sss4jw	cmudstyyj00tr12ergdnoavz3	/uploads/gpus/inno3d-geforce-rtx-5060-twin-x2-oc-v2-8gb-gddr7-graphics-card.webp	INNO3D GeForce RTX 5060 TWIN X2 OC V2 8GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.06
cmudstyv500qq12erovpudfdd	cmudstyv400qp12erspiq0wyb	/uploads/gpus/manli-nebula-geforce-rtx-5050-8gb-gddr6-graphics-card.webp	Manli Nebula GeForce RTX 5050 8GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.938
cmudstyz000u612ervrwc027o	cmudstyyz00u512er31y0ofdm	/uploads/gpus/manli-nebula-geforce-rtx-5060-8gb-gddr7-graphics-card.webp	Manli Nebula GeForce RTX 5060 8GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.077
cmudstyqi00mf12er9ky4yj0h	cmudstyqh00me12er07ht4x7a	/uploads/gpus/msi-geforce-rtx-3050-ventus-2x-e-6g-oc-gddr6-graphics-card.webp	MSI GeForce RTX 3050 VENTUS 2X E 6G OC GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.77
cmudstysh00oc12er4iofhjen	cmudstysg00ob12ertcimwrsh	/uploads/gpus/msi-geforce-rtx-3050-ventus-2x-xs-8gb-oc-gddr6-graphics-card.webp	MSI GeForce RTX 3050 VENTUS 2X XS 8GB OC GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.841
cmudstyw000ri12er1sk36zbw	cmudstyvz00rh12erbvfqi8mh	/uploads/gpus/msi-geforce-rtx-5050-8g-gaming-oc-8gb-gddr6-graphics-card.webp	MSI GeForce RTX 5050 8G Gaming OC 8GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.969
cmudstyuq00qd12erxpcdk3le	cmudstyup00qc12erksr40bke	/uploads/gpus/msi-geforce-rtx-5050-8g-shadow-2x-oc-8gb-gddr6-graphics-card.webp	MSI GeForce RTX 5050 8G SHADOW 2X OC 8GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.923
cmudstytt00pl12err5yn9na1	cmudstyts00pk12eroiqe7l8m	/uploads/gpus/msi-geforce-rtx-5050-8g-ventus-2x-oc-8gb-gddr6-graphics-card.webp	MSI GeForce RTX 5050 8G VENTUS 2X OC 8GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.889
cmudstz0f00vc12er01hor3xb	cmudstz0f00vb12er8zw60u9y	/uploads/gpus/msi-geforce-rtx-5060-8g-ventus-2x-oc-8gb-gddr7-graphics-card.webp	MSI GeForce RTX 5060 8G VENTUS 2X OC 8GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.128
cmudstz0s00vp12erqsgezi6i	cmudstz0r00vo12ero5m3kmdh	/uploads/gpus/msi-geforce-rtx-5060-8g-ventus-2x-oc-v1-gddr7-graphics-card.webp	MSI GeForce RTX 5060 8G VENTUS 2X OC V1 GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.141
cmudstyx900sm12ergruazrbc	cmudstyx900sl12erckjjgnkq	/uploads/gpus/pny-geforce-rtx-5060-8gb-dual-fan-gddr7-graphics-card.webp	PNY GeForce RTX 5060 8GB Dual Fan GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.014
cmudstyzm00uk12erhl6rxpt8	cmudstyzl00uj12err8y6n94u	/uploads/gpus/pny-geforce-rtx-5060-8gb-oc-dual-fan-gddr7-graphics-card.webp	PNY GeForce RTX 5060 8GB OC Dual Fan GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.098
cmudstyro00nk12er8s0st3ri	cmudstyrn00nj12erq62zv1ea	/uploads/gpus/powercolor-fighter-amd-radeon-rx-7600-8gb-f-v2-gddr6-graphics-card.webp	PowerColor Fighter AMD Radeon RX 7600 8GB F/V2 GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.813
cmudstyqv00mr12ersx65u29x	cmudstyqu00mq12er9lwuu1py	/uploads/gpus/powercolor-reaper-amd-radeon-rx-9050-8gb-gddr6-graphics-card.webp	PowerColor Reaper AMD Radeon RX 9050 8GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.783
cmudstyq000m112erjdwfjdte	cmudstyq000m012erdbczhb09	/uploads/gpus/zotac-gaming-geforce-rtx-3050-twin-edge-oc-6gb-gddr6-graphics-card.webp	Zotac GAMING GeForce RTX 3050 Twin Edge OC 6GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.753
cmudstyte00p612erw0rdf03s	cmudstytd00p512er1k2kiz1n	/uploads/gpus/zotac-gaming-geforce-rtx-5050-twin-edge-8gb-gddr6-graphics-card.webp	ZOTAC GAMING GeForce RTX 5050 Twin Edge 8GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.874
cmudstyu700py12ernwm9195l	cmudstyu600px12erl09ruej5	/uploads/gpus/zotac-gaming-geforce-rtx-5050-twin-edge-oc-8gb-gddr6-graphics-card.webp	ZOTAC GAMING GeForce RTX 5050 Twin Edge OC 8GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.903
cmudstz0100uy12erryf1yvbw	cmudstz0100ux12erhh6ccp95	/uploads/gpus/zotac-geforce-rtx-5060-amp-8gb-gddr7-graphics-card.webp	ZOTAC GeForce RTX 5060 AMP 8GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.114
cmudstyxp00t012erx7e52uk1	cmudstyxo00sz12erbufg1pgd	/uploads/gpus/zotac-geforce-rtx-5060-twin-edge-8gb-gddr7-graphics-card.webp	ZOTAC GeForce RTX 5060 Twin Edge 8GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.029
cmudstzay015512erxbuoowh9	cmudstzay015412erjazbb612	/uploads/gpus/asus-dual-radeon-rx-9060-xt-16gb-gddr6-graphics-card.webp	ASUS Dual Radeon RX 9060 XT 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.507
cmudstz8i012r12erb0hnxkjo	cmudstz8h012q12ertqdjdmdb	/uploads/gpus/asus-prime-geforce-rtx-5060-ti-8gb-gddr7-oc-edition-graphics-card.webp	ASUS PRIME GeForce RTX 5060 Ti 8GB GDDR7 OC Edition Graphics Card	0	t	2026-09-23 07:46:08.419
cmudstzbw015z12ergsrvgtgu	cmudstzbw015y12er6x4ouhl2	/uploads/gpus/asus-prime-radeon-rx-9060-xt-16gb-gddr6-oc-edition-graphics-card.webp	ASUS Prime Radeon RX 9060 XT 16GB GDDR6 OC Edition Graphics Card	0	t	2026-09-23 07:46:08.541
cmudstz4f00yy12erfyoq0wgz	cmudstz4e00yx12ere42j7onb	/uploads/gpus/colorful-geforce-rtx-5060-ti-battle-ax-duo-8gb-v-gddr7-graphics-card.webp	Colorful GeForce RTX 5060 Ti Battle AX DUO 8GB-V GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.271
cmudstz60010g12erxa6af9n7	cmudstz5z010f12ergiyggfch	/uploads/gpus/colorful-geforce-rtx-5060-ti-gaming-duo-8gb-v-gddr7-graphics-card.webp	Colorful GeForce RTX 5060 Ti Gaming DUO 8GB-V GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.329
cmudstz5800zq12er47mlrslt	cmudstz5700zp12ereevxx7xi	/uploads/gpus/colorful-igame-geforce-rtx-5060-ti-ultra-w-duo-oc-8gb-v-gddr7-graphics-card.webp	Colorful iGame GeForce RTX 5060 Ti Ultra W DUO OC 8GB-V GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.3
cmudstz2h00x712eripwdjyd2	cmudstz2h00x612er1iqsd6fg	/uploads/gpus/gigabyte-geforce-rtx-5060-eagle-max-oc-8gb-gddr7-graphics-card.webp	GIGABYTE GeForce RTX 5060 EAGLE MAX OC 8GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.202
cmudstz3q00yc12er06uwyj8l	cmudstz3p00yb12er85j9fcv1	/uploads/gpus/gunnir-intel-arc-pro-b50-16g-low-profile-gddr6-workstation-graphics-card.webp	GUNNIR Intel Arc Pro B50 16G Low Profile GDDR6 Workstation Graphics Card	0	t	2026-09-23 07:46:08.246
cmudstzed018a12er3dmgmku7	cmudstzec018912er97ygzvar	/uploads/gpus/gunnir-intel-arc-pro-b60-bs-24gb-gddr6-workstation-graphics-card.webp	GUNNIR Intel Arc Pro B60 BS 24GB GDDR6 Workstation Graphics Card	0	t	2026-09-23 07:46:08.63
cmudstze0017z12ereubiw92a	cmudstze0017y12ernuvc8hwd	/uploads/gpus/gunnir-intel-arc-pro-b60-tf-24gb-gddr6-workstation-graphics-card.webp	GUNNIR Intel Arc Pro B60 TF 24GB GDDR6 Workstation Graphics Card	0	t	2026-09-23 07:46:08.617
cmudstz4t00zc12ergrd2n5er	cmudstz4s00zb12erq67te5zo	/uploads/gpus/inno3d-geforce-rtx-5060-ti-8gb-twin-x2-oc-graphics-card.webp	INNO3D GeForce RTX 5060 Ti 8GB TWIN X2 OC Graphics Card	0	t	2026-09-23 07:46:08.285
cmudstz77011k12er5d6c4m47	cmudstz76011j12er8mljcbhz	/uploads/gpus/inno3d-geforce-rtx-5060-ti-8gb-x3-oc-gddr7-graphics-card.webp	INNO3D GeForce RTX 5060 Ti 8GB X3 OC GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.371
cmudstz2x00xl12erfu4mxtu4	cmudstz2w00xk12er6u4i3fh1	/uploads/gpus/msi-geforce-rtx-3060-ventus-2x-oc-12gb-graphics-card.jpg	MSI GeForce RTX 3060 VENTUS 2X OC 12GB Graphics Card	0	t	2026-09-23 07:46:08.217
cmudstz4100yl12ermo1mc8of	cmudstz4000yk12eriapgu48r	/uploads/gpus/msi-geforce-rtx-5060-ti-8g-shadow-2x-oc-plus-8gb-gddr7-graphics-card.webp	MSI GeForce RTX 5060 Ti 8G SHADOW 2X OC PLUS 8GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.257
cmudstz6f010u12ertxbnyibd	cmudstz6f010t12eri098tx5v	/uploads/gpus/msi-geforce-rtx-5060-ti-8g-ventus-2x-oc-plus-8gb-gddr7-graphics-card.webp	MSI GeForce RTX 5060 Ti 8G VENTUS 2X OC PLUS 8GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.344
cmudstz6t011712erltws0ek7	cmudstz6s011612erv8om45uj	/uploads/gpus/msi-geforce-rtx-5060-ti-8g-ventus-2x-oc-white-plus-8gb-gddr7-graphics-card.webp	MSI GeForce RTX 5060 Ti 8G VENTUS 2X OC WHITE PLUS 8GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.357
cmudstz5n010312eroygh96tl	cmudstz5m010212erc5xl4ajb	/uploads/gpus/msi-geforce-rtx-5060-ti-8g-ventus-2x-plus-8gb-gddr7-graphics-card.webp	MSI GeForce RTX 5060 Ti 8G VENTUS 2X PLUS 8GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.315
cmudstz7n011y12erq080mv5j	cmudstz7m011x12erwri0fu4q	/uploads/gpus/msi-geforce-rtx-5060-ti-8g-ventus-3x-oc-8gb-gddr7-graphics-card.webp	MSI GeForce RTX 5060 Ti 8G VENTUS 3X OC 8GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.388
cmudstzf8018y12erfy0azodn	cmudstzf7018x12erpk4p5qmb	/uploads/gpus/pny-geforce-rtx-5060-ti-16gb-dual-fan-gddr7-graphics-card.webp	PNY GeForce RTX 5060 Ti 16GB Dual Fan GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.661
cmudstzbg015j12erhxfyep7w	cmudstzbf015i12er79zcig1c	/uploads/gpus/powercolor-amd-radeon-rx-7800-xt-16gb-gddr6-graphics-card.webp	PowerColor AMD Radeon RX 7800 XT 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.524
cmudstzaj014p12er299p56ys	cmudstzaj014o12erav9d93gf	/uploads/gpus/powercolor-fighter-amd-radeon-rx-7700-xt-12gb-gddr6-graphics-card.webp	PowerColor Fighter AMD Radeon RX 7700 XT 12GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.492
cmudstz9r013w12er7bdsgrcp	cmudstz9q013v12er7zg4v9o5	/uploads/gpus/powercolor-hellhound-amd-radeon-rx-9060-xt-16gb-gddr6-graphics-card.webp	PowerColor Hellhound AMD Radeon RX 9060 XT 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.463
cmudstz80012b12eraw0z9pn9	cmudstz80012a12er7s3ik2s1	/uploads/gpus/powercolor-reaper-amd-radeon-rx-9060-xt-16gb-gddr6-graphics-card.webp	PowerColor Reaper AMD Radeon RX 9060 XT 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.401
cmudstzca016d12er4f3y3yxm	cmudstzc9016c12ermdsxgxr6	/uploads/gpus/powercolor-reaper-amd-radeon-rx-9070-gre-12gb-gddr6-graphics-card.webp	PowerColor Reaper AMD Radeon RX 9070 GRE 12GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.555
cmudstzd8017812erlr93g7lu	cmudstzd7017712ers8312ffa	/uploads/gpus/sapphire-nitro-amd-radeon-rx-9060-xt-gaming-oc-16gb-gddr6-graphics-card.webp	Sapphire NITRO+ AMD Radeon RX 9060 XT Gaming OC 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.588
cmudstz8x013512ersa5twdiz	cmudstz8w013412erodesa63h	/uploads/gpus/sapphire-pulse-amd-radeon-rx-9060-xt-gaming-oc-16gb-gddr6-graphics-card.webp	Sapphire Pulse AMD Radeon RX 9060 XT GAMING OC 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.434
cmudstz3a00xy12ercdmu25xh	cmudstz3900xx12er3h8v63o1	/uploads/gpus/sapphire-pulse-amd-radeon-rx-9060-xt-gaming-oc-8gb-gddr6-graphics-card.webp	Sapphire Pulse AMD Radeon RX 9060 XT Gaming OC 8GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.23
cmudstzes018l12eryo1jjklv	cmudstzes018k12erx3bms20o	/uploads/gpus/sapphire-pulse-amd-radeon-rx-9070-gaming-16gb-gddr6-graphics-card.webp	Sapphire PULSE AMD Radeon RX 9070 Gaming 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.645
cmudstzdm017m12erxv4x904c	cmudstzdl017l12ernvl5q9rp	/uploads/gpus/sapphire-pulse-amd-radeon-rx-9070-gre-oc-12gb-gddr6-graphics-card.webp	Sapphire PULSE AMD Radeon RX 9070 GRE OC 12GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.602
cmudstza6014c12erbho45ihp	cmudstza6014b12erl2br5p6h	/uploads/gpus/sapphire-pure-amd-radeon-rx-9060-xt-gaming-oc-16gb-gddr6-graphics-card.webp	Sapphire Pure AMD Radeon RX 9060 XT GAMING OC 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.479
cmudstzq801is12erpe7h8ef7	cmudstzq701ir12erp50lts1d	/uploads/gpus/asus-dual-geforce-rtx-5070-12gb-gddr7-oc-edition-graphics-card.webp	ASUS Dual GeForce RTX 5070 12GB GDDR7 OC Edition Graphics Card	0	t	2026-09-23 07:46:09.056
cmudstzr201ji12er4x8h50g8	cmudstzr101jh12er86uz6aws	/uploads/gpus/asus-prime-geforce-rtx-5070-ti-16gb-gddr7-oc-edition-graphics-card.webp	ASUS PRIME GeForce RTX 5070 Ti 16GB GDDR7 OC Edition Graphics Card	0	t	2026-09-23 07:46:09.086
cmudstzqm01j512er62bgujlw	cmudstzql01j412er75wrt7og	/uploads/gpus/asus-tuf-gaming-geforce-rtx-4070-ti-super-btf-white-oc-edition-16gb-gddr6x-graphics-card.webp	ASUS TUF Gaming GeForce RTX 4070 Ti SUPER BTF White OC Edition 16GB GDDR6X Graphics Card	0	t	2026-09-23 07:46:09.071
cmudstzg4019r12ern4strkmh	cmudstzg3019q12erataxvytx	/uploads/gpus/colorful-geforce-rtx-5060-ti-battle-ax-nb-duo-16gb-v-gddr7-graphics-card.webp	Colorful GeForce RTX 5060 Ti Battle AX NB DUO 16GB-V GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.692
cmudstzhw01bc12ersyc007cg	cmudstzhv01bb12er9i96blt7	/uploads/gpus/colorful-igame-geforce-rtx-5060-ti-ultra-w-duo-oc-16gb-v-gddr7-graphics-card.webp	Colorful iGame GeForce RTX 5060 Ti Ultra W DUO OC 16GB-V GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.756
cmudstzp001hm12er0tvzp552	cmudstzoz01hl12eroy275st3	/uploads/gpus/colorful-igame-geforce-rtx-5070-ultra-w-oc-12gb-v-gddr7-graphics-card.webp	Colorful iGame GeForce RTX 5070 Ultra W OC 12GB-V GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.012
cmudstzso01l112ergr6ffov8	cmudstzsn01l012erraic6411	/uploads/gpus/gunnir-intel-arc-pro-b70-bd-32gb-gddr6-workstation-graphics-card.webp	GUNNIR Intel Arc Pro B70 BD 32GB GDDR6 Workstation Graphics Card	0	t	2026-09-23 07:46:09.144
cmudstzsc01kq12er3wbx6e7h	cmudstzsb01kp12erobt9aza6	/uploads/gpus/gunnir-intel-arc-pro-b70-tf-32gb-gddr6-workstation-graphics-card.webp	GUNNIR Intel Arc Pro B70 TF 32GB GDDR6 Workstation Graphics Card	0	t	2026-09-23 07:46:09.132
cmudstzk001d912erkih688qk	cmudstzk001d812erzzl2l6h9	/uploads/gpus/inno3d-geforce-rtx-5060-ti-16gb-x3-oc-gddr7-graphics-card.webp	INNO3D GeForce RTX 5060 Ti 16GB X3 OC GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.833
cmudstzib01bp12ertdxq0elf	cmudstzia01bo12ereabm993p	/uploads/gpus/manli-black-stellar-geforce-rtx-5060-ti-oc-16gb-gddr7-graphics-card.webp	Manli Black Stellar GeForce RTX 5060 Ti OC 16GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.771
cmudstzj701ch12er76kf7nyt	cmudstzj601cg12ercrpsikef	/uploads/gpus/manli-nebula-geforce-rtx-5070-12gb-gddr7-graphics-card.webp	Manli Nebula GeForce RTX 5070 12GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.803
cmudstzhe01ay12errsqh52p7	cmudstzhe01ax12ere1960uiw	/uploads/gpus/manli-nebula-v2-geforce-rtx-5060-ti-16gb-gddr7-graphics-card.webp	Manli Nebula V2 GeForce RTX 5060 Ti 16GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.739
cmudstzjl01cv12erq4rffx8g	cmudstzjl01cu12eruag88lcs	/uploads/gpus/manli-polar-fox-geforce-rtx-5060-ti-oc-16gb-gddr7-graphics-card.webp	Manli Polar Fox GeForce RTX 5060 Ti OC 16GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.818
cmudstzn001g112erhe94stqt	cmudstzmz01g012erery6dxfo	/uploads/gpus/manli-polar-fox-v2-geforce-rtx-5070-oc-12gb-gddr7-graphics-card.webp	Manli Polar Fox V2 GeForce RTX 5070 OC 12GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.94
cmudstzky01e312er46mb4aia	cmudstzkx01e212er7m0brwga	/uploads/gpus/msi-geforce-rtx-5060-ti-16g-shadow-2x-oc-plus-16gb-gddr7-graphics-card.webp	MSI GeForce RTX 5060 Ti 16G SHADOW 2X OC PLUS 16GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.866
cmudstzpv01ig12erk0q42r19	cmudstzpu01if12eroji3dv7a	/uploads/gpus/msi-geforce-rtx-5070-12g-inspire-3x-oc-gddr7-graphics-card.webp	MSI GeForce RTX 5070 12G INSPIRE 3X OC GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.044
cmudstzne01gf12erjuqd3cyk	cmudstznd01ge12er1kclmirs	/uploads/gpus/msi-geforce-rtx-5070-12g-shadow-2x-oc-12gb-gddr7-graphics-card.webp	MSI GeForce RTX 5070 12G SHADOW 2X OC 12GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.954
cmudstznx01gt12erq7iz0pjd	cmudstznw01gs12errl0d3y40	/uploads/gpus/msi-geforce-rtx-5070-12g-ventus-2x-oc-12gb-gddr7-graphics-card.webp	MSI GeForce RTX 5070 12G VENTUS 2X OC 12GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.974
cmudstzt201lc12erlzi69b9x	cmudstzt101lb12eroaxmkvgp	/uploads/gpus/msi-geforce-rtx-5070-ti-16g-shadow-3x-oc-16gb-gddr7-graphics-card.webp	MSI GeForce RTX 5070 Ti 16G SHADOW 3X OC 16GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.158
cmudstzir01c312er4w5cnp74	cmudstzir01c212erq9mokixe	/uploads/gpus/pny-geforce-rtx-5060-ti-16gb-oc-dual-fan-gddr7-graphics-card.webp	PNY GeForce RTX 5060 Ti 16GB OC Dual Fan GDDR7 Graphics Card	0	t	2026-09-23 07:46:08.788
cmudstzrx01kc12ervvz5xqf8	cmudstzrw01kb12err5pb40z9	/uploads/gpus/pny-geforce-rtx-5070-ti-argb-epic-x-rgb-triple-fan-16gb-gddr7-graphics-card.webp	PNY GeForce RTX 5070 Ti ARGB EPIC-X RGB Triple Fan 16GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.117
cmudstzri01jy12ercwaa38e1	cmudstzrh01jx12erzg8f4cq3	/uploads/gpus/pny-geforce-rtx-5070-ti-oc-triple-fan-16gb-gddr7-graphic-card.webp	PNY GeForce RTX 5070 Ti OC Triple Fan 16GB GDDR7 Graphic Card	0	t	2026-09-23 07:46:09.103
cmudstzmj01fl12ergptx9d04	cmudstzmi01fk12erm3v2fgda	/uploads/gpus/powercolor-hellhound-amd-radeon-rx-9070-xt-16gb-gddr6-graphics-card.webp	PowerColor Hellhound AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.923
cmudstzgz01ai12erj998scr8	cmudstzgy01ah12eriipzmrn6	/uploads/gpus/powercolor-reaper-amd-radeon-rx-9070-16gb-gddr6-graphics-card.webp	PowerColor Reaper AMD Radeon RX 9070 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.723
cmudstzkg01dn12ernzl4ui0u	cmudstzkf01dm12erkk556u7h	/uploads/gpus/powercolor-reaper-amd-radeon-rx-9070-xt-16gb-gddr6-graphics-card.webp	PowerColor Reaper AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.848
cmudstzgj01a512erhpryat6i	cmudstzgj01a412er9tfgr32t	/uploads/gpus/sapphire-nitro-amd-radeon-rx-9070-gaming-oc-16gb-gddr6-graphics-card.webp	Sapphire NITRO+ AMD Radeon RX 9070 Gaming OC 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.708
cmudstzlc01eg12erllwz7ns4	cmudstzlb01ef12erxgf3pcsm	/uploads/gpus/sapphire-pulse-amd-radeon-rx-9070-xt-gaming-16gb-gddr6-graphics-card.webp	Sapphire Pulse AMD Radeon RX 9070 XT Gaming 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.88
cmudstzfp019e12erl9x10kdi	cmudstzfo019d12erchqdrufn	/uploads/gpus/sapphire-pure-amd-radeon-rx-9070-gaming-oc-16gb-gddr6-graphics-card.webp	Sapphire PURE AMD Radeon RX 9070 Gaming OC 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.677
cmudstzm501f812er1sbs4gnu	cmudstzm501f712erihhn7ome	/uploads/gpus/sapphire-pure-amd-radeon-rx-9070-xt-16gb-gddr6-graphics-card.webp	Sapphire PURE AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.91
cmudstzog01h712eregzxe9qh	cmudstzof01h612er2qhjwjzc	/uploads/gpus/zotac-gaming-geforce-rtx-5070-twin-edge-oc-12gb-gddr7-white-graphics-card.webp	ZOTAC GAMING GeForce RTX 5070 Twin Edge OC 12GB GDDR7 White Graphics Card	0	t	2026-09-23 07:46:08.993
cmudsurnu003xx4131hbul6v6	cmudsurnm003wx413ca0ytn3r	/uploads/gpus/abit-radeon-rx-580-8gb-gddr5-graphics-card.webp	Abit Radeon RX 580 8GB GDDR5 Graphics Card	0	t	2026-09-23 07:46:45.258
cmudsuroo004dx4135npo4nt6	cmudsuron004cx413gqz9do3r	/uploads/gpus/abit-radeon-rx-6500xt-4gb-gddr6-graphics-card.webp	Abit Radeon RX 6500XT 4GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:45.289
cmudsty9800at12er41w0imex	cmudsty9700as12erpzo0bf8w	/uploads/gpus/afox-amd-radeon-rx-580-8gb-gddr5-dual-fan-graphics-card.webp	AFOX AMD Radeon RX 580 8GB GDDR5 Dual Fan Graphics Card	0	t	2026-09-23 07:46:07.148
cmudstxy7003x12erti3nyjyh	cmudstxxt003w12er4mhgwqvu	/uploads/gpus/afox-nvidia-geforce-gt-240-1gb-gddr3-graphics-card.webp	AFOX NVIDIA GeForce GT 240 1GB GDDR3 Graphics Card	0	t	2026-09-23 07:46:06.751
cmudstypf00ln12ersa01u7a3	cmudstypf00lm12er8j0pr81w	/uploads/gpus/arktek-geforce-rtx-2070-super-8gb-gddr6-graphics-card.webp	ARKTEK GeForce RTX 2070 SUPER 8GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.732
cmudstzyr01qr12er0xwvcjgs	cmudstzyq01qq12erh9npspv8	/uploads/gpus/asus-dual-geforce-rtx-5060-8gb-gddr7-oc-edition-graphics-card.webp	ASUS Dual GeForce RTX 5060 8GB GDDR7 OC Edition Graphics Card	0	t	2026-09-23 07:46:09.363
cmudstzlr01eu12er738tmgbp	cmudstzlq01et12erk9q77njv	/uploads/gpus/asus-dual-geforce-rtx-5060-ti-16gb-gddr7-oc-edition-graphics-card.webp	ASUS Dual GeForce RTX 5060 Ti 16GB GDDR7 OC Edition Graphics Card	0	t	2026-09-23 07:46:08.895
cmudstz9c013i12ertd8hvba7	cmudstz9b013h12erqja3zsvd	/uploads/gpus/asus-dual-geforce-rtx-5060-ti-8gb-gddr7-oc-edition-graphics-card.webp	ASUS Dual GeForce RTX 5060 Ti 8GB GDDR7 OC Edition Graphics Card	0	t	2026-09-23 07:46:08.449
cmudstzxj01pj12erb9qoiv02	cmudstzxi01pi12erd0ul87b4	/uploads/gpus/asus-tuf-gaming-geforce-rtx-5090-32gb-gddr7-oc-edition-graphics-card.webp	ASUS TUF Gaming GeForce RTX 5090 32GB GDDR7 OC Edition Graphics Card	0	t	2026-09-23 07:46:09.319
cmudstyrb00n712er6f4e5neu	cmudstyra00n612er0m8nxkkc	/uploads/gpus/colorful-igame-geforce-rtx-3050-ultra-w-duo-oc-v2-v-8gb-gddr6-graphics-card.webp	Colorful iGame GeForce RTX 3050 Ultra W DUO OC V2-V 8GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.799
cmudstzwp01oq12erc139b6j8	cmudstzwo01op12er5dxbwwnl	/uploads/gpus/colorful-igame-geforce-rtx-5080-neptune-oc-16gb-v-gddr7-graphics-card.webp	Colorful iGame GeForce RTX 5080 Neptune OC 16GB-V GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.289
cmudstynh00js12erq3mp4opn	cmudstyng00jr12ervl676cgu	/uploads/gpus/gigabyte-geforce-rtx-3050-windforce-oc-6gb-gddr6-graphics-card.webp	GIGABYTE GeForce RTX 3050 WINDFORCE OC 6GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:07.662
cmudstztw01m312erfzcueypk	cmudstztv01m212ervmhfad1h	/uploads/gpus/manli-nebula-geforce-rtx-5080-16gb-gddr7-graphics-card.webp	Manli Nebula GeForce RTX 5080 16GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.188
cmudstzub01mh12er528pixo5	cmudstzua01mg12er0pl1nqop	/uploads/gpus/manli-polar-fox-v2-geforce-rtx-5080-oc-16gb-gddr7-graphics-card.webp	Manli Polar Fox V2 GeForce RTX 5080 OC 16GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.204
cmudstztf01lq12erqgn3fuf9	cmudstztf01lp12erd4lgovn1	/uploads/gpus/msi-geforce-rtx-5070-ti-16g-ventus-3x-oc-16gb-gddr7-graphics-card.webp	MSI GeForce RTX 5070 Ti 16G VENTUS 3X OC 16GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.172
cmudstzvh01nm12ercfbytehu	cmudstzvg01nl12eroeblmad2	/uploads/gpus/msi-geforce-rtx-5080-16g-inspire-3x-oc-16gb-gddr7-graphics-card.webp	MSI GeForce RTX 5080 16G INSPIRE 3X OC 16GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.245
cmudstzvv01nz12ermvk2pr5n	cmudstzvu01ny12erg8x8ci18	/uploads/gpus/msi-geforce-rtx-5080-16g-ventus-3x-oc-16gb-gddr7-graphics-card.webp	MSI GeForce RTX 5080 16G VENTUS 3X OC 16GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.26
cmtn590bl0004jq5x6ufzdxci	cmtn590bg0003jq5xqmmmsw7w	/uploads/gpus/peladn-geforce-kaitian-gt-730-4gb-gddr3-graphics-card.webp	PELADN GeForce KaiTian GT 730 4GB GDDR3 Graphics Card	0	t	2026-09-04 16:03:58.306
cmudstzxz01pz12eryt1gmsdi	cmudstzxy01py12er4nktmqdf	/uploads/gpus/pny-geforce-rtx-5050-8gb-dual-fan-gddr6-graphics-card.webp	PNY GeForce RTX 5050 8GB Dual Fan GDDR6 Graphics Card	0	t	2026-09-23 07:46:09.335
cmudstzz701r512erbeur14yr	cmudstzz601r412erqs95tl8n	/uploads/gpus/pny-geforce-rtx-5060-ti-8gb-epic-x-rgb-oc-triple-fan-gddr7-graphics-card.webp	PNY GeForce RTX 5060 Ti 8GB EPIC-X RGB OC Triple Fan GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.379
cmudsu01d01t712er7r9938za	cmudsu01c01t612ermq8g3da7	/uploads/gpus/pny-geforce-rtx-5070-ti-epic-x-rgb-overclocked-triple-fan-plus-16gb-gddr7-graphics-card.webp	PNY GeForce RTX 5070 Ti EPIC-X RGB Overclocked Triple Fan Plus 16GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.457
cmudsu00301ry12ereljtx813	cmudsu00301rx12er5fj14de0	/uploads/gpus/pny-geforce-rtx-5070-triple-fan-12gb-gddr7-graphic-card.webp	PNY GeForce RTX 5070 Triple Fan 12GB GDDR7 Graphic Card	0	t	2026-09-23 07:46:09.412
cmudsu01y01tl12erams2qml7	cmudsu01x01tk12eryqchua33	/uploads/gpus/pny-geforce-rtx-5080-16gb-gddr7-argb-epic-x-rgb-overclocked-triple-fan-graphics-card.webp	PNY GeForce RTX 5080 16GB GDDR7 ARGB EPIC-X RGB Overclocked Triple Fan Graphics Card	0	t	2026-09-23 07:46:09.478
cmudstzv401n912er035mf7xt	cmudstzv301n812er596pukvk	/uploads/gpus/pny-geforce-rtx-5080-oc-16gb-triple-fan-gddr7-graphics-card.webp	PNY GeForce RTX 5080 OC 16GB Triple Fan GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.232
cmudstzx401p412er0nl17115	cmudstzx301p312eralcuv53b	/uploads/gpus/pny-geforce-rtx-5090-32gb-gddr7-overclocked-triple-fan-graphics-card.webp	PNY GeForce RTX 5090 32GB GDDR7 Overclocked Triple Fan Graphics Card	0	t	2026-09-23 07:46:09.305
cmudstzw901oc12err1jdr5cn	cmudstzw801ob12er1t56gejd	/uploads/gpus/powercolor-radeon-ai-pro-r9700-32gb-gddr6-graphics-card.webp	PowerColor Radeon AI PRO R9700 32GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:09.274
cmudsu00h01sc12erbbkrmib8	cmudsu00h01sb12er19a9dtdu	/uploads/gpus/powercolor-red-devil-amd-radeon-rx-9070-xt-16gb-gddr6-graphics-card.webp	PowerColor Red Devil AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:09.426
cmudstzyc01qc12eru6to5wix	cmudstzyb01qb12ersb7tri9h	/uploads/gpus/zotac-gaming-geforce-rtx-5060-twin-edge-plus-8gb-gddr7-graphics-card.webp	ZOTAC GAMING GeForce RTX 5060 Twin Edge Plus 8GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.348
cmudsu00x01ss12eryjwzlvdo	cmudsu00w01sr12er515hcjur	/uploads/gpus/zotac-gaming-geforce-rtx-5070-twin-edge-12gb-gddr7-graphics-card.webp	ZOTAC GAMING GeForce RTX 5070 Twin Edge 12GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.442
cmudstzzm01rj12erj0541tun	cmudstzzl01ri12erdzjxpipj	/uploads/gpus/zotac-gaming-geforce-rtx-5070-twin-edge-oc-12gb-gddr7-graphics-card.webp	ZOTAC GAMING GeForce RTX 5070 Twin Edge OC 12GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.394
cmudsu02h01u012erqj841las	cmudsu02g01tz12er1kqdue92	/uploads/gpus/zotac-gaming-geforce-rtx-5080-amp-extreme-infinity-16gb-gddr7-graphics-card.webp	ZOTAC GAMING GeForce RTX 5080 AMP Extreme INFINITY 16GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.498
cmudstzpe01i012er92jmzs9m	cmudstzpe01hz12erbyr7pfgz	/uploads/gpus/pny-geforce-rtx-5070-argb-epic-x-rgb-oc-triple-fan-12gb-gddr7-graphics-card.webp	PNY GeForce RTX 5070 ARGB EPIC-X RGB OC Triple Fan 12GB GDDR7 Graphics Card	0	t	2026-09-23 07:46:09.027
cmudstzup01mv12erxbyon8q4	cmudstzup01mu12er0nhc0tkn	/uploads/gpus/pny-geforce-rtx-5070-ti-epic-x-argb-oc-triple-fan-16gb-gddr7-graphic-card.webp	PNY GeForce RTX 5070 Ti Epic-X ARGB OC Triple Fan 16GB GDDR7 Graphic Card	0	t	2026-09-23 07:46:09.218
cmudstzcs016t12er58m8tujf	cmudstzcr016s12er4nsy9atv	/uploads/gpus/powercolor-hellhound-spectral-white-amd-radeon-rx-9060-xt-16gb-gddr6-graphics-card.webp	PowerColor Hellhound Spectral White AMD Radeon RX 9060 XT 16GB GDDR6 Graphics Card	0	t	2026-09-23 07:46:08.572
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
cmuczfeq10004dmdmz33kxw07	cmuczfepr0002dmdmxlb8v8or	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:02:59.785	2026-09-22 18:02:59.785
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
cmucy83rf000l5jvpuonou22y	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfl000p14lf8747ua51	Intel Core 14th/13th/12th Gen, Pentium Gold, Celeron (LGA1700)	2026-09-22 17:29:19.371	2026-09-22 17:29:19.371
cmucy83rf000m5jvpje8iss2i	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfm000r14lfudlmnzu2	Intel H610	2026-09-22 17:29:19.371	2026-09-22 17:29:19.371
cmucy83rf000n5jvpch4p0ndi	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfo000t14lfqadrp9c6	96GB	2026-09-22 17:29:19.371	2026-09-22 17:29:19.371
cmucy83rf000o5jvpic8fmyym	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfo000v14lfk2twms3r	DDR5	2026-09-22 17:29:19.371	2026-09-22 17:29:19.371
cmucy83rf000p5jvpf9rc75c8	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfp000x14lfgbwb97o2	1x M.2 + 4x SATA 6Gb/s	2026-09-22 17:29:19.371	2026-09-22 17:29:19.371
cmucy83rf000q5jvpj7gs2bho	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfr000z14lf0rzzeznh	1x HDMI, 1x VGA	2026-09-22 17:29:19.371	2026-09-22 17:29:19.371
cmucy83rf000r5jvp096kvup4	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfs001114lflya0h3wr	Realtek ALC897 7.1 HD Audio	2026-09-22 17:29:19.371	2026-09-22 17:29:19.371
cmucy83rf000s5jvp0nic44me	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfu001314lft9yu4wju	Rear: HDMI, VGA, USB 3.2 Gen1, USB 2.0, Realtek 1GbE, audio | Internal: USB headers, TPM	2026-09-22 17:29:19.371	2026-09-22 17:29:19.371
cmucy83rf000t5jvpn9ar2jy2	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfv001514lfpv41pubh	DDR5 dual-channel, Steel Armor, EZ Debug LED	2026-09-22 17:29:19.371	2026-09-22 17:29:19.371
cmucy83rf000u5jvpkofe80vb	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfw001714lftjqb52qs	Micro ATX	2026-09-22 17:29:19.371	2026-09-22 17:29:19.371
cmucy83rf000v5jvpyxultujz	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfx001914lferyrkkxr	1x PCIe 4.0 x16 | 1x PCIe 3.0 x1 | 1x M.2 Key-M	2026-09-22 17:29:19.371	2026-09-22 17:29:19.371
cmucy83rf000w5jvppzx0gp7k	cmu6pyo1e00h214lfy6uwilf9	cmu6pynfx001b14lfbzlcqptg	3 Years	2026-09-22 17:29:19.371	2026-09-22 17:29:19.371
cmuczczte000amhtfzn5c4fbd	cmuczczt50008mhtf6fate690	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:07.155	2026-09-22 18:01:07.155
cmuczd0fc000fmhtfqoxdmmiy	cmuczd0f8000dmhtfghy44gvu	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:07.944	2026-09-22 18:01:07.944
cmuczd1bk000kmhtfrd36l41n	cmuczd1bg000imhtf8v98k9y1	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:09.104	2026-09-22 18:01:09.104
cmuczd1tm000pmhtf2jls7gic	cmuczd1ti000nmhtfcoruymig	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:09.755	2026-09-22 18:01:09.755
cmuczd2xw000umhtfoffity6s	cmuczd2xs000smhtf2rbeam9u	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:11.205	2026-09-22 18:01:11.205
cmuczd3ju000zmhtftitv7uuo	cmuczd3jq000xmhtfrbdmek7x	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:11.994	2026-09-22 18:01:11.994
cmuczd4zs0014mhtfl8fjtkou	cmuczd4zo0012mhtfb4mlwwb5	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:13.864	2026-09-22 18:01:13.864
cmuczd5s40019mhtfjh18yat9	cmuczd5s00017mhtfw7vsvpio	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:14.884	2026-09-22 18:01:14.884
cmuczd6e1001emhtfhxhkz2ad	cmuczd6dy001cmhtf6qwvxe2s	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:15.674	2026-09-22 18:01:15.674
cmuczd700001jmhtfvd6ztsyt	cmuczd6zw001hmhtfr8l6jg6q	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:16.464	2026-09-22 18:01:16.464
cmuczd7j6001omhtfiqk2nmtl	cmuczd7j2001mmhtfi4dhg601	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:17.154	2026-09-22 18:01:17.154
cmuczd8q8001tmhtfos57dfiz	cmuczd8q4001rmhtfh9rootv6	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:18.704	2026-09-22 18:01:18.704
cmuczd99n001ymhtf3z4i8tk1	cmuczd99j001wmhtfsi9gp0fc	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:19.404	2026-09-22 18:01:19.404
cmuczda9u0023mhtfo6yxx3fq	cmuczda9o0021mhtfo1gveq7b	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:20.707	2026-09-22 18:01:20.707
cmuczdbc40028mhtfs03w4n3f	cmuczdbc00026mhtfleor0tbj	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:22.085	2026-09-22 18:01:22.085
cmuczdbu6002dmhtfylyjpfq9	cmuczdbu2002bmhtfqe8psv3t	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:22.734	2026-09-22 18:01:22.734
cmuczdcef002imhtfr99tpo6c	cmuczdcec002gmhtf06cq2ial	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:23.464	2026-09-22 18:01:23.464
cmuczdcw7002nmhtfkf0ib7ua	cmuczdcw4002lmhtf1md8icgs	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:24.104	2026-09-22 18:01:24.104
cmuczddee002smhtf758tpcly	cmuczddea002qmhtfyywq7t5k	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:24.759	2026-09-22 18:01:24.759
cmuczde57002xmhtfkxgwzo7q	cmuczde53002vmhtfwkvc4d8o	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:25.723	2026-09-22 18:01:25.723
cmuczdepr0032mhtf4uiq3n9z	cmuczdepn0030mhtfnhev3nnb	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:26.463	2026-09-22 18:01:26.463
cmuczdf8x0037mhtfot4eqrye	cmuczdf8t0035mhtfijl5ofja	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:27.153	2026-09-22 18:01:27.153
cmuczdfth003cmhtfnryoh9ga	cmuczdfte003amhtfwwdfz5ss	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:27.894	2026-09-22 18:01:27.894
cmuczdgbg003hmhtfszrvhm7p	cmuczdgb8003fmhtfvn0q997d	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:28.54	2026-09-22 18:01:28.54
cmuczdh4b003mmhtfs3dsdi5k	cmuczdh45003kmhtfv73a0hxt	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:29.579	2026-09-22 18:01:29.579
cmuczdhts003rmhtfrz49o5ly	cmuczdhtm003pmhtfyik2s4fj	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:30.496	2026-09-22 18:01:30.496
cmuczdiog003wmhtf2m8i2rki	cmuczdio8003umhtfm3ui4b98	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:31.601	2026-09-22 18:01:31.601
cmuczdjmm0041mhtfk6nvcmmd	cmuczdjme003zmhtfflp7qp3w	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:32.83	2026-09-22 18:01:32.83
cmuczdl4x0046mhtfqzbqfsd6	cmuczdl4t0044mhtfttb91bwf	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:34.786	2026-09-22 18:01:34.786
cmuczdm4l004bmhtfcm55qf0f	cmuczdm4g0049mhtf5ryhrfa6	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:36.069	2026-09-22 18:01:36.069
cmuczdnlh004gmhtfijk81peb	cmuczdnle004emhtfkbo8yhvm	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:37.974	2026-09-22 18:01:37.974
cmuczdol1004lmhtfgk43lv1u	cmuczdokx004jmhtfj9vasi94	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:39.254	2026-09-22 18:01:39.254
cmuczdpy7004qmhtf631ptkz9	cmuczdpy3004omhtfpo5snty4	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:41.023	2026-09-22 18:01:41.023
cmuczdr4f004vmhtfuoxqo1f0	cmuczdr4c004tmhtfa2xz0pnc	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:42.544	2026-09-22 18:01:42.544
cmuczds3z0050mhtfx2lwcm6h	cmuczds3v004ymhtf4ewemk50	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:43.823	2026-09-22 18:01:43.823
cmuczdslh0055mhtfmemcklg1	cmuczdsld0053mhtfcewx4wa0	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:44.454	2026-09-22 18:01:44.454
cmuczdtdt005amhtf2vlx4ych	cmuczdtdq0058mhtf493du620	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:45.474	2026-09-22 18:01:45.474
cmuczdu01005fmhtfcw204dlo	cmuczdtzx005dmhtfn2qf3lee	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:46.273	2026-09-22 18:01:46.273
cmuczdumj005kmhtfr19i9gj8	cmuczdumf005imhtf7jvtj6vw	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:47.083	2026-09-22 18:01:47.083
cmuczdv5p005pmhtf8osvob0q	cmuczdv5l005nmhtf8y5os0bj	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:47.773	2026-09-22 18:01:47.773
cmuczdvuf005umhtfhfiwcglz	cmuczdvuc005smhtfcj5hq3j9	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:48.663	2026-09-22 18:01:48.663
cmuczdwlx005zmhtf2glswnax	cmuczdwlt005xmhtfpxnirudz	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:49.653	2026-09-22 18:01:49.653
cmuczdxfe0064mhtf40v73iyb	cmuczdxfa0062mhtflzltg3az	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:50.714	2026-09-22 18:01:50.714
cmuczdy7p0069mhtfijfxehro	cmuczdy7l0067mhtfmmcw4qnj	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:51.733	2026-09-22 18:01:51.733
cmuczdyzh006emhtfc3pww87k	cmuczdyzd006cmhtf8vx62wvc	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:52.733	2026-09-22 18:01:52.733
cmuczdzt7006jmhtfe4p1lftn	cmuczdzt3006hmhtfmmgtmd2j	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:53.804	2026-09-22 18:01:53.804
cmucze14o006omhtflsrbrkzw	cmucze14l006mmhtfvuxtualh	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:55.513	2026-09-22 18:01:55.513
cmucze2mb006tmhtfa3insdmg	cmucze2m7006rmhtfnj6cqzuo	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:01:57.443	2026-09-22 18:01:57.443
cmucze3yn006ymhtfn2pj8vx2	cmucze3yj006wmhtfqayp3cp7	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:59.183	2026-09-22 18:01:59.183
cmucze4k10073mhtfcdz4w892	cmucze4jx0071mhtf0dcgiqc1	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:01:59.953	2026-09-22 18:01:59.953
cmucze5cx0078mhtfqticy2c9	cmucze5cu0076mhtfisxkijo2	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:02:00.994	2026-09-22 18:02:00.994
cmucze6v3007dmhtfmcfr7w57	cmucze6uz007bmhtfu3awyvz2	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:02:02.944	2026-09-22 18:02:02.944
cmucze7up007imhtf5rnpa0es	cmucze7uk007gmhtfo4zk5719	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:02:04.225	2026-09-22 18:02:04.225
cmucze9ab007nmhtfwwuiaotl	cmucze9a7007lmhtf7c1gjyoc	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:02:06.084	2026-09-22 18:02:06.084
cmuczea2z007smhtfer81su9t	cmuczea2u007qmhtf364bvmd6	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:02:07.115	2026-09-22 18:02:07.115
cmuczeb5t007xmhtfuf9u3lem	cmuczeb5p007vmhtfos5w9mv5	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:02:08.513	2026-09-22 18:02:08.513
cmuczecdz0082mhtf9r3xlv8l	cmuczecdv0080mhtfxcyg7pg6	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:02:10.103	2026-09-22 18:02:10.103
cmuczecyt0087mhtfjyvgwjlp	cmuczecyp0085mhtfsob7rhh3	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:02:10.853	2026-09-22 18:02:10.853
cmuczedwp008cmhtfkyroweuz	cmuczedwm008amhtfqj5kwr8l	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:02:12.074	2026-09-22 18:02:12.074
cmuczeenw008hmhtfo1q83yny	cmuczeent008fmhtfvk0ci4tq	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:02:13.053	2026-09-22 18:02:13.053
cmuczefcx008mmhtfc63e4g6y	cmuczefct008kmhtfpqzrd1i9	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:02:13.953	2026-09-22 18:02:13.953
cmuczegdk008rmhtfylaolsvj	cmuczegdh008pmhtfbp88x09g	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:02:15.273	2026-09-22 18:02:15.273
cmuczehvi008wmhtf102pkiaq	cmuczehvd008umhtfve9dygqd	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:02:17.214	2026-09-22 18:02:17.214
cmuczeji30091mhtfsckjidwg	cmuczejhz008zmhtf833x4kqa	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:02:19.323	2026-09-22 18:02:19.323
cmuczek050096mhtfm9q815x3	cmuczek020094mhtf8gxu25yp	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:02:19.974	2026-09-22 18:02:19.974
cmuczeku5009bmhtfq5fz71i8	cmuczeku10099mhtf7n8yk5gv	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:02:21.053	2026-09-22 18:02:21.053
cmuczelgd009gmhtf0ip1ljb6	cmuczelg9009emhtf5gg79ukw	cmu1dxwev0027dx76a3oheqbe	03 Years	2026-09-22 18:02:21.853	2026-09-22 18:02:21.853
cmuczemei009lmhtfybfxzgbd	cmuczemef009jmhtf8f8nhdh8	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:02:23.083	2026-09-22 18:02:23.083
cmuczen8j009qmhtfckdq8ppa	cmuczen8f009omhtfeyrd47re	cmu1dxwfs003bdx76iddxs55y	03 Years	2026-09-22 18:02:24.163	2026-09-22 18:02:24.163
cmudsuro2003yx41324apbgx7	cmudsurnm003wx413ca0ytn3r	cmudstm34002lbeo3xl0fg6dd	8GB	2026-09-23 07:46:45.267	2026-09-23 07:46:45.267
cmudsuro2003zx413qf6eaq3s	cmudsurnm003wx413ca0ytn3r	cmudstm36002pbeo3k8re21zp	GDDR5	2026-09-23 07:46:45.267	2026-09-23 07:46:45.267
cmudsuro20040x4131kn7kro2	cmudsurnm003wx413ca0ytn3r	cmudstm37002tbeo3rwfz92f9	1750Mhz	2026-09-23 07:46:45.267	2026-09-23 07:46:45.267
cmudsuro20041x413tova4uxk	cmudsurnm003wx413ca0ytn3r	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:45.267	2026-09-23 07:46:45.267
cmudsuro20042x4131c37lwp8	cmudsurnm003wx413ca0ytn3r	cmudstm3b0033beo3pu4ethqx	RX 500	2026-09-23 07:46:45.267	2026-09-23 07:46:45.267
cmudsuro20043x413duaty5e1	cmudsurnm003wx413ca0ytn3r	cmudstm3h003jbeo3wzjjjwu9	2x DisplayPort, 1x HDMI	2026-09-23 07:46:45.267	2026-09-23 07:46:45.267
cmudsuro20044x4137tgq9cfm	cmudsurnm003wx413ca0ytn3r	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:45.267	2026-09-23 07:46:45.267
cmudstxyj003y12erojuzt5kg	cmudstxxt003w12er4mhgwqvu	cmudstm2d001bbeo3ads0c96h	1GB	2026-09-23 07:46:06.763	2026-09-23 07:46:06.763
cmudstxyj003z12eroi1klqsz	cmudstxxt003w12er4mhgwqvu	cmudstm2f001fbeo3dv8f5emy	GDDR3	2026-09-23 07:46:06.763	2026-09-23 07:46:06.763
cmudstxyj004012erm190uibh	cmudstxxt003w12er4mhgwqvu	cmudstm2g001hbeo3trkzbee8	550 MHz	2026-09-23 07:46:06.763	2026-09-23 07:46:06.763
cmudstxyj004112erwttuebh8	cmudstxxt003w12er4mhgwqvu	cmudstm2g001jbeo3hdbgmfpi	1400 MHz	2026-09-23 07:46:06.763	2026-09-23 07:46:06.763
cmudstxyj004212er9s3js6ju	cmudstxxt003w12er4mhgwqvu	cmudstm2i001nbeo3mp35l8b8	2560 x 1600	2026-09-23 07:46:06.763	2026-09-23 07:46:06.763
cmudstxyj004312ert605kiau	cmudstxxt003w12er4mhgwqvu	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:06.763	2026-09-23 07:46:06.763
cmudstxyj004412ert7m47q3j	cmudstxxt003w12er4mhgwqvu	cmudstm2z0029beo3kz24pu2r	1 x DVI, 1 x HDMI, 1 x D-Sub	2026-09-23 07:46:06.763	2026-09-23 07:46:06.763
cmudstxyj004512ergp1q50r6	cmudstxxt003w12er4mhgwqvu	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:06.763	2026-09-23 07:46:06.763
cmudstxzd004f12ernqhu32ge	cmudstxz5004d12erhocnn1kr	cmudstm2d001bbeo3ads0c96h	2GB	2026-09-23 07:46:06.793	2026-09-23 07:46:06.793
cmudstxzd004g12ervzbhymk9	cmudstxz5004d12erhocnn1kr	cmudstm2f001fbeo3dv8f5emy	GDDR3	2026-09-23 07:46:06.793	2026-09-23 07:46:06.793
cmudstxzd004h12erj7ztd4ht	cmudstxz5004d12erhocnn1kr	cmudstm2g001hbeo3trkzbee8	810 MHz	2026-09-23 07:46:06.793	2026-09-23 07:46:06.793
cmudstxzd004i12erduxct7f2	cmudstxz5004d12erhocnn1kr	cmudstm2g001jbeo3hdbgmfpi	1333 MHz	2026-09-23 07:46:06.793	2026-09-23 07:46:06.793
cmudstxzd004j12errcwpsclh	cmudstxz5004d12erhocnn1kr	cmudstm2i001nbeo3mp35l8b8	2560 x 1600	2026-09-23 07:46:06.793	2026-09-23 07:46:06.793
cmudstxzd004k12er7ca8qsz0	cmudstxz5004d12erhocnn1kr	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:06.793	2026-09-23 07:46:06.793
cmudstxzd004l12er9xd07s59	cmudstxz5004d12erhocnn1kr	cmudstm2k001tbeo3xb2hvl5l	GT 700	2026-09-23 07:46:06.793	2026-09-23 07:46:06.793
cmudstxzd004m12er70ofe8ic	cmudstxz5004d12erhocnn1kr	cmudstm2z0029beo3kz24pu2r	1 x DVI, 1 x HDMI, 1 x D-Sub	2026-09-23 07:46:06.793	2026-09-23 07:46:06.793
cmudstxzd004n12er8kvcde1i	cmudstxz5004d12erhocnn1kr	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:06.793	2026-09-23 07:46:06.793
cmudstxzz004y12erjqjahse4	cmudstxzt004w12ernmf0xv62	cmudstm2d001bbeo3ads0c96h	2GB	2026-09-23 07:46:06.815	2026-09-23 07:46:06.815
cmudstxzz004z12erm9c5oqyc	cmudstxzt004w12ernmf0xv62	cmudstm2f001fbeo3dv8f5emy	GDDR5	2026-09-23 07:46:06.815	2026-09-23 07:46:06.815
cmudstxzz005012ermd22nbj2	cmudstxzt004w12ernmf0xv62	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:06.815	2026-09-23 07:46:06.815
cmudstxzz005112erjjoxvruw	cmudstxzt004w12ernmf0xv62	cmudstm2k001tbeo3xb2hvl5l	GT 700	2026-09-23 07:46:06.815	2026-09-23 07:46:06.815
cmudstxzz005212er7ww9znqd	cmudstxzt004w12ernmf0xv62	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:06.815	2026-09-23 07:46:06.815
cmudsty0g005b12eree42fye8	cmudsty09005912er0r0xr2l1	cmudstm2d001bbeo3ads0c96h	2GB	2026-09-23 07:46:06.833	2026-09-23 07:46:06.833
cmudsty0g005c12erc0gkfyqz	cmudsty09005912er0r0xr2l1	cmudstm2f001fbeo3dv8f5emy	GDDR3	2026-09-23 07:46:06.833	2026-09-23 07:46:06.833
cmudsty0g005d12er35pca53t	cmudsty09005912er0r0xr2l1	cmudstm2g001jbeo3hdbgmfpi	1333 MHz	2026-09-23 07:46:06.833	2026-09-23 07:46:06.833
cmudsty0g005e12errd8rkeme	cmudsty09005912er0r0xr2l1	cmudstm2i001nbeo3mp35l8b8	2048 x1536	2026-09-23 07:46:06.833	2026-09-23 07:46:06.833
cmudsty0g005f12erp2b12qwi	cmudsty09005912er0r0xr2l1	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:06.833	2026-09-23 07:46:06.833
cmudsty0g005g12erqlhmx490	cmudsty09005912er0r0xr2l1	cmudstm2k001tbeo3xb2hvl5l	GT 700	2026-09-23 07:46:06.833	2026-09-23 07:46:06.833
cmudsty0g005h12er21apgcc0	cmudsty09005912er0r0xr2l1	cmudstm2z0029beo3kz24pu2r	1 x DVI, 1 x HDMI, 1 x D-Sub	2026-09-23 07:46:06.833	2026-09-23 07:46:06.833
cmudsty0g005i12era45xviu9	cmudsty09005912er0r0xr2l1	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:06.833	2026-09-23 07:46:06.833
cmudsty10005t12erw8e61356	cmudsty0u005r12er7fotxvp3	cmudstm2d001bbeo3ads0c96h	7102GB	2026-09-23 07:46:06.853	2026-09-23 07:46:06.853
cmudsty10005u12erzowvvyqk	cmudsty0u005r12er7fotxvp3	cmudstm2f001fbeo3dv8f5emy	GDDR5	2026-09-23 07:46:06.853	2026-09-23 07:46:06.853
cmudsty10005v12era197def3	cmudsty0u005r12er7fotxvp3	cmudstm2g001hbeo3trkzbee8	954 MHz	2026-09-23 07:46:06.853	2026-09-23 07:46:06.853
cmudsty10005w12ery98x65ot	cmudsty0u005r12er7fotxvp3	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:06.853	2026-09-23 07:46:06.853
cmudsty10005x12er8ymmt5rd	cmudsty0u005r12er7fotxvp3	cmudstm2k001tbeo3xb2hvl5l	GT 700	2026-09-23 07:46:06.853	2026-09-23 07:46:06.853
cmudsty10005y12erwrcdyzef	cmudsty0u005r12er7fotxvp3	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:06.853	2026-09-23 07:46:06.853
cmudsty1h006712ervms10404	cmudsty1b006512erxddomgkp	cmudstm2d001bbeo3ads0c96h	7304GB	2026-09-23 07:46:06.87	2026-09-23 07:46:06.87
cmudsty1h006812era65d1186	cmudsty1b006512erxddomgkp	cmudstm2f001fbeo3dv8f5emy	GDDR3	2026-09-23 07:46:06.87	2026-09-23 07:46:06.87
cmudsty1h006912er71hx0ylc	cmudsty1b006512erxddomgkp	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:06.87	2026-09-23 07:46:06.87
cmudsty1h006a12ereon25or9	cmudsty1b006512erxddomgkp	cmudstm2k001tbeo3xb2hvl5l	GT 700	2026-09-23 07:46:06.87	2026-09-23 07:46:06.87
cmudsty1h006b12eruhnqmaiu	cmudsty1b006512erxddomgkp	cmudstm2z0029beo3kz24pu2r	128-bit	2026-09-23 07:46:06.87	2026-09-23 07:46:06.87
cmudsty1h006c12erehb4h1ww	cmudsty1b006512erxddomgkp	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:06.87	2026-09-23 07:46:06.87
cmudsty1z006m12er7up0vumc	cmudsty1s006k12erzk1msmf5	cmudstm2d001bbeo3ads0c96h	4GB	2026-09-23 07:46:06.888	2026-09-23 07:46:06.888
cmudsty1z006n12erpggmnp8z	cmudsty1s006k12erzk1msmf5	cmudstm2f001fbeo3dv8f5emy	GDDR3	2026-09-23 07:46:06.888	2026-09-23 07:46:06.888
cmudsty1z006o12erc0ym8afe	cmudsty1s006k12erzk1msmf5	cmudstm2g001jbeo3hdbgmfpi	1600MHz	2026-09-23 07:46:06.888	2026-09-23 07:46:06.888
cmudsty1z006p12ere4z33s91	cmudsty1s006k12erzk1msmf5	cmudstm2i001nbeo3mp35l8b8	2048 x1536	2026-09-23 07:46:06.888	2026-09-23 07:46:06.888
cmudsty1z006q12ercaa88a3p	cmudsty1s006k12erzk1msmf5	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:06.888	2026-09-23 07:46:06.888
cmudsty1z006r12er23ixytep	cmudsty1s006k12erzk1msmf5	cmudstm2k001tbeo3xb2hvl5l	GT 700	2026-09-23 07:46:06.888	2026-09-23 07:46:06.888
cmudsty1z006s12erzcujvoje	cmudsty1s006k12erzk1msmf5	cmudstm2z0029beo3kz24pu2r	1 x DVI, 1 x HDMI, 1 x D-Sub	2026-09-23 07:46:06.888	2026-09-23 07:46:06.888
cmudsty1z006t12er9b34qjxw	cmudsty1s006k12erzk1msmf5	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:06.888	2026-09-23 07:46:06.888
cmudsty2j007412erccptk26o	cmudsty2e007212er8n199i2h	cmudstm2d001bbeo3ads0c96h	2GB	2026-09-23 07:46:06.908	2026-09-23 07:46:06.908
cmudsty2j007512ervndl2pzw	cmudsty2e007212er8n199i2h	cmudstm2f001fbeo3dv8f5emy	GDDR3	2026-09-23 07:46:06.908	2026-09-23 07:46:06.908
cmudsty2j007612eriatylqdm	cmudsty2e007212er8n199i2h	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:06.908	2026-09-23 07:46:06.908
cmudsty2j007712er13afm8dh	cmudsty2e007212er8n199i2h	cmudstm2k001tbeo3xb2hvl5l	GT 700	2026-09-23 07:46:06.908	2026-09-23 07:46:06.908
cmudsty2j007812erctpd3bg2	cmudsty2e007212er8n199i2h	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:06.908	2026-09-23 07:46:06.908
cmudsty31007i12erth6y2jjg	cmudsty2v007g12erze7grqbk	cmudstm34002lbeo3xl0fg6dd	2GB	2026-09-23 07:46:06.926	2026-09-23 07:46:06.926
cmudsty31007j12erfvamsq5y	cmudsty2v007g12erze7grqbk	cmudstm36002pbeo3k8re21zp	GDDR5	2026-09-23 07:46:06.926	2026-09-23 07:46:06.926
cmudsty31007k12eri2malud3	cmudsty2v007g12erze7grqbk	cmudstm36002rbeo3girfb892	800 MHz	2026-09-23 07:46:06.926	2026-09-23 07:46:06.926
cmudsty31007l12ery6l5kew3	cmudsty2v007g12erze7grqbk	cmudstm39002xbeo3wrm1av87	2560 x 1600	2026-09-23 07:46:06.926	2026-09-23 07:46:06.926
cmudsty31007m12eruomx9i0o	cmudsty2v007g12erze7grqbk	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:06.926	2026-09-23 07:46:06.926
cmudsty31007n12erz3e8rsyq	cmudsty2v007g12erze7grqbk	cmudstm3b0033beo3pu4ethqx	RX 500	2026-09-23 07:46:06.926	2026-09-23 07:46:06.926
cmudsty31007o12erne962peo	cmudsty2v007g12erze7grqbk	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:06.926	2026-09-23 07:46:06.926
cmudsty4a007y12eryjtzjied	cmudsty3q007w12ernj5jmvfr	cmudstm2d001bbeo3ads0c96h	7302GB	2026-09-23 07:46:06.971	2026-09-23 07:46:06.971
cmudsty4b007z12ery7nx651b	cmudsty3q007w12ernj5jmvfr	cmudstm2f001fbeo3dv8f5emy	GDDR5	2026-09-23 07:46:06.971	2026-09-23 07:46:06.971
cmudsty4b008012erjomkq7ol	cmudsty3q007w12ernj5jmvfr	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:06.971	2026-09-23 07:46:06.971
cmudsty4b008112erivpx6hv5	cmudsty3q007w12ernj5jmvfr	cmudstm2k001tbeo3xb2hvl5l	GT 700	2026-09-23 07:46:06.971	2026-09-23 07:46:06.971
cmudsty4b008212erv6csxvzv	cmudsty3q007w12ernj5jmvfr	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:06.971	2026-09-23 07:46:06.971
cmudsty5r008c12erljf9122f	cmudsty57008a12er76xhq3lo	cmudstm34002lbeo3xl0fg6dd	5504GB	2026-09-23 07:46:07.023	2026-09-23 07:46:07.023
cmudsty5r008d12er33sf3tg7	cmudsty57008a12er76xhq3lo	cmudstm36002pbeo3k8re21zp	GDDR5	2026-09-23 07:46:07.023	2026-09-23 07:46:07.023
cmudsty5r008e12erxzz7tjtk	cmudsty57008a12er76xhq3lo	cmudstm36002rbeo3girfb892	1287MHz	2026-09-23 07:46:07.023	2026-09-23 07:46:07.023
cmudsty5r008f12ersljvbbor	cmudsty57008a12er76xhq3lo	cmudstm37002tbeo3rwfz92f9	7000MHz	2026-09-23 07:46:07.023	2026-09-23 07:46:07.023
cmudsty5r008g12erug7pmlkz	cmudsty57008a12er76xhq3lo	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:07.023	2026-09-23 07:46:07.023
cmudsty5r008h12eran19tkv8	cmudsty57008a12er76xhq3lo	cmudstm3b0033beo3pu4ethqx	RX 500	2026-09-23 07:46:07.023	2026-09-23 07:46:07.023
cmudsty5r008i12erp8wonf2b	cmudsty57008a12er76xhq3lo	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:07.023	2026-09-23 07:46:07.023
cmudsty6h008r12eruq9mzo1f	cmudsty69008p12eric4djq2u	cmudstm2d001bbeo3ads0c96h	7304GB	2026-09-23 07:46:07.049	2026-09-23 07:46:07.049
cmudsty6h008s12ernlfb3835	cmudsty69008p12eric4djq2u	cmudstm2f001fbeo3dv8f5emy	GDDR3	2026-09-23 07:46:07.049	2026-09-23 07:46:07.049
cmudsty6h008t12er3idd3xpw	cmudsty69008p12eric4djq2u	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.049	2026-09-23 07:46:07.049
cmudsty6h008u12erq2pq079f	cmudsty69008p12eric4djq2u	cmudstm2k001tbeo3xb2hvl5l	GT 700	2026-09-23 07:46:07.049	2026-09-23 07:46:07.049
cmudsty6h008v12eressdabut	cmudsty69008p12eric4djq2u	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.049	2026-09-23 07:46:07.049
cmudsty70009412erfrqqz4n4	cmudsty6t009212erp9ouukyl	cmudstm34002lbeo3xl0fg6dd	4GB	2026-09-23 07:46:07.069	2026-09-23 07:46:07.069
cmudsty70009512erjhh9cacr	cmudsty6t009212erp9ouukyl	cmudstm36002pbeo3k8re21zp	GDDR5	2026-09-23 07:46:07.069	2026-09-23 07:46:07.069
cmudsty70009612erf9jc5soi	cmudsty6t009212erp9ouukyl	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:07.069	2026-09-23 07:46:07.069
cmudsty70009712er9cg6wgft	cmudsty6t009212erp9ouukyl	cmudstm3b0033beo3pu4ethqx	RX 500	2026-09-23 07:46:07.069	2026-09-23 07:46:07.069
cmudsty70009812er3ldvbeai	cmudsty6t009212erp9ouukyl	cmudstm3h003jbeo3wzjjjwu9	128‑bit	2026-09-23 07:46:07.069	2026-09-23 07:46:07.069
cmudsty70009912ert74u37vk	cmudsty6t009212erp9ouukyl	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:07.069	2026-09-23 07:46:07.069
cmudsty7j009j12ertyev9cx2	cmudsty7c009h12eruf2x7bdd	cmudstm2d001bbeo3ads0c96h	2GB	2026-09-23 07:46:07.087	2026-09-23 07:46:07.087
cmudsty7j009k12er6gu2urqk	cmudsty7c009h12eruf2x7bdd	cmudstm2f001fbeo3dv8f5emy	GDDR5	2026-09-23 07:46:07.087	2026-09-23 07:46:07.087
cmudsty7j009l12er48ow8cgq	cmudsty7c009h12eruf2x7bdd	cmudstm2i001nbeo3mp35l8b8	4K@60Hz, CUDA Cores: 384	2026-09-23 07:46:07.087	2026-09-23 07:46:07.087
cmudsty7j009m12erj8wabjk6	cmudsty7c009h12eruf2x7bdd	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.087	2026-09-23 07:46:07.087
cmudsty7j009n12ered21p427	cmudsty7c009h12eruf2x7bdd	cmudstm2k001tbeo3xb2hvl5l	GT 1000	2026-09-23 07:46:07.087	2026-09-23 07:46:07.087
cmudsty7j009o12er5fk919ui	cmudsty7c009h12eruf2x7bdd	cmudstm2z0029beo3kz24pu2r	1 x DVI, 1 x HDMI	2026-09-23 07:46:07.087	2026-09-23 07:46:07.087
cmudsty7j009p12erps9qggh1	cmudsty7c009h12eruf2x7bdd	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.087	2026-09-23 07:46:07.087
cmudsty8700a112erdddw66gd	cmudsty80009z12erh29741nz	cmr9bvs9c003mnjjl66ggue09	4GB	2026-09-23 07:46:07.111	2026-09-23 07:46:07.111
cmudsty8700a212ervc82am6k	cmudsty80009z12erh29741nz	cmr9bvs9c003nnjjldprfoq71	GDDR6	2026-09-23 07:46:07.111	2026-09-23 07:46:07.111
cmudsty8700a312erw89yj8tq	cmudsty80009z12erh29741nz	cmr9bvs9c003onjjl73rcf6jj	Intel Arc	2026-09-23 07:46:07.111	2026-09-23 07:46:07.111
cmudsty8700a412er1cwrikow	cmudsty80009z12erh29741nz	cmtn513np000h13qz5byviy69	Arc A	2026-09-23 07:46:07.111	2026-09-23 07:46:07.111
cmudsty8700a512ermf1xwc6e	cmudsty80009z12erh29741nz	cmr9fdu38000zznc8rwpfa7k5	3 Years	2026-09-23 07:46:07.111	2026-09-23 07:46:07.111
cmudsty8s00ae12erqyg0nbsg	cmudsty8j00ac12er2ib55kvk	cmudstm34002lbeo3xl0fg6dd	4GB	2026-09-23 07:46:07.132	2026-09-23 07:46:07.132
cmudsty8s00af12eru0icoxij	cmudsty8j00ac12er2ib55kvk	cmudstm36002pbeo3k8re21zp	GDDR5	2026-09-23 07:46:07.132	2026-09-23 07:46:07.132
cmudsty8s00ag12er75nilpx7	cmudsty8j00ac12er2ib55kvk	cmudstm36002rbeo3girfb892	1183 MHz	2026-09-23 07:46:07.132	2026-09-23 07:46:07.132
cmudsty8s00ah12erc0rt2wlh	cmudsty8j00ac12er2ib55kvk	cmudstm39002xbeo3wrm1av87	7680x4320	2026-09-23 07:46:07.132	2026-09-23 07:46:07.132
cmudsty8s00ai12er5f5dn76r	cmudsty8j00ac12er2ib55kvk	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:07.132	2026-09-23 07:46:07.132
cmudsty8s00aj12er735yz9gk	cmudsty8j00ac12er2ib55kvk	cmudstm3b0033beo3pu4ethqx	RX 500	2026-09-23 07:46:07.132	2026-09-23 07:46:07.132
cmudsty8s00ak12er2yjtfj8w	cmudsty8j00ac12er2ib55kvk	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:07.132	2026-09-23 07:46:07.132
cmudsty9e00au12er9zz34ct7	cmudsty9700as12erpzo0bf8w	cmudstm34002lbeo3xl0fg6dd	8GB	2026-09-23 07:46:07.155	2026-09-23 07:46:07.155
cmudsty9e00av12er4mjyflag	cmudsty9700as12erpzo0bf8w	cmudstm36002pbeo3k8re21zp	GDDR5	2026-09-23 07:46:07.155	2026-09-23 07:46:07.155
cmudsty9e00aw12errpzno7gz	cmudsty9700as12erpzo0bf8w	cmudstm36002rbeo3girfb892	1284 MHz	2026-09-23 07:46:07.155	2026-09-23 07:46:07.155
cmudsty9e00ax12ercxwbnzoi	cmudsty9700as12erpzo0bf8w	cmudstm39002xbeo3wrm1av87	3840 x 2160(1.4 HDR)	2026-09-23 07:46:07.155	2026-09-23 07:46:07.155
cmudsty9e00ay12er0orwdutf	cmudsty9700as12erpzo0bf8w	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:07.155	2026-09-23 07:46:07.155
cmudsty9e00az12erwmgddzs9	cmudsty9700as12erpzo0bf8w	cmudstm3b0033beo3pu4ethqx	RX 500	2026-09-23 07:46:07.155	2026-09-23 07:46:07.155
cmudsty9f00b012eraxj1yna1	cmudsty9700as12erpzo0bf8w	cmudstm3h003jbeo3wzjjjwu9	DVI, DisplayPort, HDMI	2026-09-23 07:46:07.155	2026-09-23 07:46:07.155
cmudsty9f00b112erz4b2dobt	cmudsty9700as12erpzo0bf8w	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:07.155	2026-09-23 07:46:07.155
cmudstyad00bc12erh9sac7kf	cmudsty9z00ba12ersqftgf46	cmudstm2d001bbeo3ads0c96h	7302GB	2026-09-23 07:46:07.19	2026-09-23 07:46:07.19
cmudstyad00bd12erx44wnxm2	cmudsty9z00ba12ersqftgf46	cmudstm2f001fbeo3dv8f5emy	GDDR5	2026-09-23 07:46:07.19	2026-09-23 07:46:07.19
cmudstyad00be12ertpzhu8cy	cmudsty9z00ba12ersqftgf46	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.19	2026-09-23 07:46:07.19
cmudstyad00bf12ercf0jooo0	cmudsty9z00ba12ersqftgf46	cmudstm2k001tbeo3xb2hvl5l	GT 700	2026-09-23 07:46:07.19	2026-09-23 07:46:07.19
cmudstyad00bg12erbzksuwse	cmudsty9z00ba12ersqftgf46	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.19	2026-09-23 07:46:07.19
cmudstyb900bp12erc9fco07i	cmudstyav00bn12erlcbwisvg	cmudstm34002lbeo3xl0fg6dd	5508GB	2026-09-23 07:46:07.221	2026-09-23 07:46:07.221
cmudstyb900bq12er7dqb80zf	cmudstyav00bn12erlcbwisvg	cmudstm36002pbeo3k8re21zp	GDDR5	2026-09-23 07:46:07.221	2026-09-23 07:46:07.221
cmudstyb900br12er6rsu5yy7	cmudstyav00bn12erlcbwisvg	cmudstm36002rbeo3girfb892	1287MHz	2026-09-23 07:46:07.221	2026-09-23 07:46:07.221
cmudstyb900bs12ere6ziodx9	cmudstyav00bn12erlcbwisvg	cmudstm37002tbeo3rwfz92f9	7000MHz	2026-09-23 07:46:07.221	2026-09-23 07:46:07.221
cmudstyb900bt12er3d9x7ca0	cmudstyav00bn12erlcbwisvg	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:07.221	2026-09-23 07:46:07.221
cmudstyb900bu12erjkk0dtrs	cmudstyav00bn12erlcbwisvg	cmudstm3b0033beo3pu4ethqx	RX 500	2026-09-23 07:46:07.221	2026-09-23 07:46:07.221
cmudstyb900bv12erzfswiz9k	cmudstyav00bn12erlcbwisvg	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:07.221	2026-09-23 07:46:07.221
cmudstyby00c412er4gpzyr5g	cmudstybq00c212erzrrkok1y	cmr9bvs9c003nnjjldprfoq71	GDDR6	2026-09-23 07:46:07.246	2026-09-23 07:46:07.246
cmudstyby00c512erz1ssh36q	cmudstybq00c212erzrrkok1y	cmr9bvs9c003onjjl73rcf6jj	Intel Arc	2026-09-23 07:46:07.246	2026-09-23 07:46:07.246
cmudstyby00c612eryta4i3dw	cmudstybq00c212erzrrkok1y	cmtn513np000h13qz5byviy69	Arc A	2026-09-23 07:46:07.246	2026-09-23 07:46:07.246
cmudstyby00c712erp42xcj8e	cmudstybq00c212erzrrkok1y	cmr9fdu38000zznc8rwpfa7k5	3 Years	2026-09-23 07:46:07.246	2026-09-23 07:46:07.246
cmudstycg00cf12er2h8odnpm	cmudstyca00cd12erfwj2dch9	cmudstm2d001bbeo3ads0c96h	4GB	2026-09-23 07:46:07.265	2026-09-23 07:46:07.265
cmudstycg00cg12er0l7t5woe	cmudstyca00cd12erfwj2dch9	cmudstm2f001fbeo3dv8f5emy	GDDR5	2026-09-23 07:46:07.265	2026-09-23 07:46:07.265
cmudstycg00ch12er9473pjjg	cmudstyca00cd12erfwj2dch9	cmudstm2g001jbeo3hdbgmfpi	5400 MHz	2026-09-23 07:46:07.265	2026-09-23 07:46:07.265
cmudstycg00ci12erkkvf6gwz	cmudstyca00cd12erfwj2dch9	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.265	2026-09-23 07:46:07.265
cmudstycg00cj12ermb5azapr	cmudstyca00cd12erfwj2dch9	cmudstm2z0029beo3kz24pu2r	1 x DVI, 1 x HDMI, 1x DisplayPort	2026-09-23 07:46:07.265	2026-09-23 07:46:07.265
cmudstycg00ck12ertepd3s6b	cmudstyca00cd12erfwj2dch9	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.265	2026-09-23 07:46:07.265
cmudstydk00cu12erkii9jmxg	cmudstyd900cs12err78udcs9	cmudstm34002lbeo3xl0fg6dd	8GB	2026-09-23 07:46:07.305	2026-09-23 07:46:07.305
cmudstydk00cv12er6a40yk8n	cmudstyd900cs12err78udcs9	cmudstm36002pbeo3k8re21zp	GDDR5	2026-09-23 07:46:07.305	2026-09-23 07:46:07.305
cmudstydk00cw12erica4m51u	cmudstyd900cs12err78udcs9	cmudstm37002tbeo3rwfz92f9	7000MHz, Boost Clock: 1244MHz	2026-09-23 07:46:07.305	2026-09-23 07:46:07.305
cmudstydk00cx12er871qrg0x	cmudstyd900cs12err78udcs9	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:07.305	2026-09-23 07:46:07.305
cmudstydk00cy12erk8sgk7cz	cmudstyd900cs12err78udcs9	cmudstm3b0033beo3pu4ethqx	RX 500	2026-09-23 07:46:07.305	2026-09-23 07:46:07.305
cmudstydk00cz12er3l374y3l	cmudstyd900cs12err78udcs9	cmudstm3h003jbeo3wzjjjwu9	2x DisplayPort, 1x HDMI	2026-09-23 07:46:07.305	2026-09-23 07:46:07.305
cmudstydk00d012erfbsubzrm	cmudstyd900cs12err78udcs9	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:07.305	2026-09-23 07:46:07.305
cmudstyew00da12ere2ijynrm	cmudstyee00d812er2ojfr1rx	cmudstm34002lbeo3xl0fg6dd	5808GB	2026-09-23 07:46:07.352	2026-09-23 07:46:07.352
cmudstyew00db12erf8wwhavk	cmudstyee00d812er2ojfr1rx	cmudstm37002tbeo3rwfz92f9	1500 Mhz	2026-09-23 07:46:07.352	2026-09-23 07:46:07.352
cmudstyew00dc12erdpu592au	cmudstyee00d812er2ojfr1rx	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:07.352	2026-09-23 07:46:07.352
cmudstyew00dd12er0g15d8bc	cmudstyee00d812er2ojfr1rx	cmudstm3b0033beo3pu4ethqx	RX 500	2026-09-23 07:46:07.352	2026-09-23 07:46:07.352
cmudstyew00de12er7h8d4d8w	cmudstyee00d812er2ojfr1rx	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:07.352	2026-09-23 07:46:07.352
cmudstyfj00dm12errjfjjjp5	cmudstyfd00dk12erznevxzpf	cmudstm37002tbeo3rwfz92f9	Up to 1750 Mhz	2026-09-23 07:46:07.376	2026-09-23 07:46:07.376
cmudstyfj00dn12er93o9d1g4	cmudstyfd00dk12erznevxzpf	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:07.376	2026-09-23 07:46:07.376
cmudstyfj00do12ersi93rtei	cmudstyfd00dk12erznevxzpf	cmudstm3b0033beo3pu4ethqx	RX 500	2026-09-23 07:46:07.376	2026-09-23 07:46:07.376
cmudstyfj00dp12erv7xim82k	cmudstyfd00dk12erznevxzpf	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:07.376	2026-09-23 07:46:07.376
cmudstyg100dw12erdrd5n40z	cmudstyfv00du12er9xcxfmto	cmudstm2d001bbeo3ads0c96h	4GB	2026-09-23 07:46:07.393	2026-09-23 07:46:07.393
cmudstyg100dx12erl6wf8l8d	cmudstyfv00du12er9xcxfmto	cmudstm2f001fbeo3dv8f5emy	GDDR4	2026-09-23 07:46:07.393	2026-09-23 07:46:07.393
cmudstyg100dy12errv0pwche	cmudstyfv00du12er9xcxfmto	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.393	2026-09-23 07:46:07.393
cmudstyg100dz12er4qtv3ndw	cmudstyfv00du12er9xcxfmto	cmudstm2k001tbeo3xb2hvl5l	GT 1000	2026-09-23 07:46:07.393	2026-09-23 07:46:07.393
cmudstyg100e012erl5uxw96p	cmudstyfv00du12er9xcxfmto	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.393	2026-09-23 07:46:07.393
cmudstygh00e912erkcd41nu5	cmudstygb00e712ervhilh295	cmudstm34002lbeo3xl0fg6dd	8GB	2026-09-23 07:46:07.41	2026-09-23 07:46:07.41
cmudstygh00ea12erb5j0nuoi	cmudstygb00e712ervhilh295	cmudstm36002pbeo3k8re21zp	GDDR5	2026-09-23 07:46:07.41	2026-09-23 07:46:07.41
cmudstygh00eb12erwdk6vcfn	cmudstygb00e712ervhilh295	cmudstm36002rbeo3girfb892	1257~1340 MHz True Clock	2026-09-23 07:46:07.41	2026-09-23 07:46:07.41
cmudstygh00ec12er5jpmu58y	cmudstygb00e712ervhilh295	cmudstm39002xbeo3wrm1av87	3840 x 2160@120Hz	2026-09-23 07:46:07.41	2026-09-23 07:46:07.41
cmudstygh00ed12er30h0g0qi	cmudstygb00e712ervhilh295	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:07.41	2026-09-23 07:46:07.41
cmudstygh00ee12er0c09pz2p	cmudstygb00e712ervhilh295	cmudstm3b0033beo3pu4ethqx	RX 500	2026-09-23 07:46:07.41	2026-09-23 07:46:07.41
cmudstygh00ef12eryt7boqth	cmudstygb00e712ervhilh295	cmudstm3h003jbeo3wzjjjwu9	3 x DP, 1 x HDMI	2026-09-23 07:46:07.41	2026-09-23 07:46:07.41
cmudstygh00eg12er8e4gubzn	cmudstygb00e712ervhilh295	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:07.41	2026-09-23 07:46:07.41
cmudstyh300er12eruqwz9o9c	cmudstygv00ep12erojl4bh63	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:07.431	2026-09-23 07:46:07.431
cmudstyh300es12er13n3radx	cmudstygv00ep12erojl4bh63	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:07.431	2026-09-23 07:46:07.431
cmudstyh300et12ero024va0q	cmudstygv00ep12erojl4bh63	cmudstm3b0033beo3pu4ethqx	RX 500	2026-09-23 07:46:07.431	2026-09-23 07:46:07.431
cmudstyh300eu12erfzfnfjl3	cmudstygv00ep12erojl4bh63	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:07.431	2026-09-23 07:46:07.431
cmudstyhl00f212ernbfgtxgm	cmudstyhf00f012erp6g3d73f	cmudstm2d001bbeo3ads0c96h	4GB	2026-09-23 07:46:07.449	2026-09-23 07:46:07.449
cmudstyhl00f312erv9hz7l0a	cmudstyhf00f012erp6g3d73f	cmudstm2f001fbeo3dv8f5emy	GDDR5	2026-09-23 07:46:07.449	2026-09-23 07:46:07.449
cmudstyhl00f412erff1tcu0d	cmudstyhf00f012erp6g3d73f	cmudstm2g001jbeo3hdbgmfpi	7Gbps, Bus Standard: PCI Express 3.0	2026-09-23 07:46:07.449	2026-09-23 07:46:07.449
cmudstyhl00f512erzklnebpb	cmudstyhf00f012erp6g3d73f	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.449	2026-09-23 07:46:07.449
cmudstyhl00f612erfiujbe7r	cmudstyhf00f012erp6g3d73f	cmudstm2z0029beo3kz24pu2r	1 x DVI, 1 x HDMI, 1x DisplayPort	2026-09-23 07:46:07.449	2026-09-23 07:46:07.449
cmudstyhl00f712erjmtcxpoq	cmudstyhf00f012erp6g3d73f	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.449	2026-09-23 07:46:07.449
cmudstyi200fg12er5oxtgjy5	cmudstyhx00fe12er5x14xat3	cmr9bvs9c003nnjjldprfoq71	GDDR6	2026-09-23 07:46:07.466	2026-09-23 07:46:07.466
cmudstyi200fh12errlak1zcl	cmudstyhx00fe12er5x14xat3	cmr9bvs9c003onjjl73rcf6jj	Intel Arc	2026-09-23 07:46:07.466	2026-09-23 07:46:07.466
cmudstyi200fi12ertc64zmql	cmudstyhx00fe12er5x14xat3	cmtn513np000h13qz5byviy69	Arc A	2026-09-23 07:46:07.466	2026-09-23 07:46:07.466
cmudstyi200fj12er7yxt2mqo	cmudstyhx00fe12er5x14xat3	cmr9fdu38000zznc8rwpfa7k5	3 Years	2026-09-23 07:46:07.466	2026-09-23 07:46:07.466
cmudstyii00fr12erf9nm9akk	cmudstyic00fp12eraisuhrax	cmudstm34002lbeo3xl0fg6dd	4GB	2026-09-23 07:46:07.482	2026-09-23 07:46:07.482
cmudstyii00fs12er33k60zzh	cmudstyic00fp12eraisuhrax	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:07.482	2026-09-23 07:46:07.482
cmudstywl00rw12erm7aerl9m	cmudstywg00ru12erhsad21nw	cmudstm2d001bbeo3ads0c96h	50508GB	2026-09-23 07:46:07.989	2026-09-23 07:46:07.989
cmudstyii00ft12erkd2gq9kh	cmudstyic00fp12eraisuhrax	cmudstm36002rbeo3girfb892	Max. 2820 MHz (Boost Clock)	2026-09-23 07:46:07.482	2026-09-23 07:46:07.482
cmudstyii00fu12erqyywu6at	cmudstyic00fp12eraisuhrax	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:07.482	2026-09-23 07:46:07.482
cmudstyii00fv12ersblakmis	cmudstyic00fp12eraisuhrax	cmudstm3b0033beo3pu4ethqx	RX 6000	2026-09-23 07:46:07.482	2026-09-23 07:46:07.482
cmudstyii00fw12er1eyp0g74	cmudstyic00fp12eraisuhrax	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:07.482	2026-09-23 07:46:07.482
cmudstyj100g512er493emova	cmudstyit00g312erboagu5q8	cmudstm2d001bbeo3ads0c96h	6GB	2026-09-23 07:46:07.502	2026-09-23 07:46:07.502
cmudstyj100g612eruqsale0q	cmudstyit00g312erboagu5q8	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.502	2026-09-23 07:46:07.502
cmudstyj100g712eruhveevom	cmudstyit00g312erboagu5q8	cmudstm2g001hbeo3trkzbee8	1530~1785MHz	2026-09-23 07:46:07.502	2026-09-23 07:46:07.502
cmudstyj100g812erqnk4htap	cmudstyit00g312erboagu5q8	cmudstm2g001jbeo3hdbgmfpi	14Gbps	2026-09-23 07:46:07.502	2026-09-23 07:46:07.502
cmudstyj100g912eriszvuvcv	cmudstyit00g312erboagu5q8	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.502	2026-09-23 07:46:07.502
cmudstyj100ga12erjo4suzp2	cmudstyit00g312erboagu5q8	cmudstm2k001tbeo3xb2hvl5l	GTX 1600	2026-09-23 07:46:07.502	2026-09-23 07:46:07.502
cmudstyj100gb12errkfu2wde	cmudstyit00g312erboagu5q8	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.502	2026-09-23 07:46:07.502
cmudstyjm00gk12er1ugrhivi	cmudstyjf00gi12erc71ye5ib	cmudstm2d001bbeo3ads0c96h	6GB	2026-09-23 07:46:07.522	2026-09-23 07:46:07.522
cmudstyjm00gl12erckqkjf9r	cmudstyjf00gi12erc71ye5ib	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.522	2026-09-23 07:46:07.522
cmudstyjm00gm12er1omcv2o6	cmudstyjf00gi12erc71ye5ib	cmudstm2g001hbeo3trkzbee8	1500 ~ 1770 MHz	2026-09-23 07:46:07.522	2026-09-23 07:46:07.522
cmudstyjm00gn12ergkyr0i61	cmudstyjf00gi12erc71ye5ib	cmudstm2g001jbeo3hdbgmfpi	12Gbps	2026-09-23 07:46:07.522	2026-09-23 07:46:07.522
cmudstyjm00go12erxz1e1xa1	cmudstyjf00gi12erc71ye5ib	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.522	2026-09-23 07:46:07.522
cmudstyjm00gp12erj3twcrml	cmudstyjf00gi12erc71ye5ib	cmudstm2k001tbeo3xb2hvl5l	GTX 1600	2026-09-23 07:46:07.522	2026-09-23 07:46:07.522
cmudstyjm00gq12er5q2t9j9g	cmudstyjf00gi12erc71ye5ib	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.522	2026-09-23 07:46:07.522
cmudstyk200gz12er90rmpav2	cmudstyjx00gx12eruyrgituu	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:07.539	2026-09-23 07:46:07.539
cmudstyk200h012erkax6jeeq	cmudstyjx00gx12eruyrgituu	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:07.539	2026-09-23 07:46:07.539
cmudstyk200h112erfxj9p0ub	cmudstyjx00gx12eruyrgituu	cmudstm3b0033beo3pu4ethqx	RX 500	2026-09-23 07:46:07.539	2026-09-23 07:46:07.539
cmudstyk200h212ertan6h5eu	cmudstyjx00gx12eruyrgituu	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:07.539	2026-09-23 07:46:07.539
cmudstykn00ha12erj0eg75r5	cmudstykg00h812ertr1jpxpi	cmudstm2d001bbeo3ads0c96h	6GB	2026-09-23 07:46:07.559	2026-09-23 07:46:07.559
cmudstykn00hb12er93itw4g6	cmudstykg00h812ertr1jpxpi	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.559	2026-09-23 07:46:07.559
cmudstykn00hc12er77gv1yqi	cmudstykg00h812ertr1jpxpi	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.559	2026-09-23 07:46:07.559
cmudstykn00hd12er4yxd464i	cmudstykg00h812ertr1jpxpi	cmudstm2k001tbeo3xb2hvl5l	GTX 1600	2026-09-23 07:46:07.559	2026-09-23 07:46:07.559
cmudstykn00he12er3p7gdbyq	cmudstykg00h812ertr1jpxpi	cmudstm2z0029beo3kz24pu2r	192-Bits; Bandwidth: 336.0 GB/s	2026-09-23 07:46:07.559	2026-09-23 07:46:07.559
cmudstykn00hf12er22sviaki	cmudstykg00h812ertr1jpxpi	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.559	2026-09-23 07:46:07.559
cmudstyl600hp12erf7l50m9p	cmudstykz00hn12erff1aqxl5	cmudstm2d001bbeo3ads0c96h	6GB	2026-09-23 07:46:07.578	2026-09-23 07:46:07.578
cmudstyl600hq12er08a3qy8a	cmudstykz00hn12erff1aqxl5	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.578	2026-09-23 07:46:07.578
cmudstyl600hr12erc10mu67w	cmudstykz00hn12erff1aqxl5	cmudstm2g001jbeo3hdbgmfpi	12Gbps, Bus Standard: PCI Express 3.0	2026-09-23 07:46:07.578	2026-09-23 07:46:07.578
cmudstyl600hs12err69zvuer	cmudstykz00hn12erff1aqxl5	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.578	2026-09-23 07:46:07.578
cmudstyl600ht12er5mq1gqyc	cmudstykz00hn12erff1aqxl5	cmudstm2k001tbeo3xb2hvl5l	GTX 1600	2026-09-23 07:46:07.578	2026-09-23 07:46:07.578
cmudstyl600hu12er842s5kla	cmudstykz00hn12erff1aqxl5	cmudstm2z0029beo3kz24pu2r	1 x DVI, 1 x HDMI, 1x DisplayPort	2026-09-23 07:46:07.578	2026-09-23 07:46:07.578
cmudstyl600hv12erov60cnw4	cmudstykz00hn12erff1aqxl5	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.578	2026-09-23 07:46:07.578
cmudstylo00i512er4flpplxb	cmudstyli00i312eru6zx0w43	cmudstm2d001bbeo3ads0c96h	6GB	2026-09-23 07:46:07.596	2026-09-23 07:46:07.596
cmudstylo00i612erab6nrtsr	cmudstyli00i312eru6zx0w43	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.596	2026-09-23 07:46:07.596
cmudstylo00i712eru4vdt6ox	cmudstyli00i312eru6zx0w43	cmudstm2g001jbeo3hdbgmfpi	14 Gbps	2026-09-23 07:46:07.596	2026-09-23 07:46:07.596
cmudstylo00i812ermsqkmwwe	cmudstyli00i312eru6zx0w43	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.596	2026-09-23 07:46:07.596
cmudstylo00i912erafsgu8jl	cmudstyli00i312eru6zx0w43	cmudstm2k001tbeo3xb2hvl5l	RTX 3000	2026-09-23 07:46:07.596	2026-09-23 07:46:07.596
cmudstylo00ia12erpu88o7la	cmudstyli00i312eru6zx0w43	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.596	2026-09-23 07:46:07.596
cmudstym500ik12ercpxrzmwm	cmudstylz00ii12ert49h9nit	cmudstm2d001bbeo3ads0c96h	6GB	2026-09-23 07:46:07.613	2026-09-23 07:46:07.613
cmudstym500il12er918fync2	cmudstylz00ii12ert49h9nit	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.613	2026-09-23 07:46:07.613
cmudstym500im12erw4cjphvz	cmudstylz00ii12ert49h9nit	cmudstm2g001jbeo3hdbgmfpi	14 Gbps	2026-09-23 07:46:07.613	2026-09-23 07:46:07.613
cmudstym500in12er160364qa	cmudstylz00ii12ert49h9nit	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.613	2026-09-23 07:46:07.613
cmudstym500io12ere2a0nj72	cmudstylz00ii12ert49h9nit	cmudstm2k001tbeo3xb2hvl5l	RTX 3000	2026-09-23 07:46:07.613	2026-09-23 07:46:07.613
cmudstym500ip12errzuozvac	cmudstylz00ii12ert49h9nit	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.613	2026-09-23 07:46:07.613
cmudstymm00iy12erjpt39qls	cmudstymh00iw12ertn6q7xqd	cmudstm2d001bbeo3ads0c96h	30508GB	2026-09-23 07:46:07.631	2026-09-23 07:46:07.631
cmudstymm00iz12erpe7xq2k9	cmudstymh00iw12ertn6q7xqd	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.631	2026-09-23 07:46:07.631
cmudstymm00j012er4nef3ya1	cmudstymh00iw12ertn6q7xqd	cmudstm2g001hbeo3trkzbee8	1552 ~ 1777 MHz	2026-09-23 07:46:07.631	2026-09-23 07:46:07.631
cmudstymm00j112eros0zoksj	cmudstymh00iw12ertn6q7xqd	cmudstm2g001jbeo3hdbgmfpi	14Gbps	2026-09-23 07:46:07.631	2026-09-23 07:46:07.631
cmudstymm00j212erhmiumt92	cmudstymh00iw12ertn6q7xqd	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.631	2026-09-23 07:46:07.631
cmudstymm00j312ernorfy5hm	cmudstymh00iw12ertn6q7xqd	cmudstm2k001tbeo3xb2hvl5l	RTX 3000	2026-09-23 07:46:07.631	2026-09-23 07:46:07.631
cmudstymn00j412er62tdsv94	cmudstymh00iw12ertn6q7xqd	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.631	2026-09-23 07:46:07.631
cmudstyn400jd12erkpdc970f	cmudstymw00jb12erik8n3liu	cmudstm2d001bbeo3ads0c96h	68GB	2026-09-23 07:46:07.648	2026-09-23 07:46:07.648
cmudstyn400je12er5kvx4n1q	cmudstymw00jb12erik8n3liu	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.648	2026-09-23 07:46:07.648
cmudstyn400jf12er7yqfevms	cmudstymw00jb12erik8n3liu	cmudstm2g001jbeo3hdbgmfpi	14Gbps, Bus Standard: PCI Express 4.0	2026-09-23 07:46:07.648	2026-09-23 07:46:07.648
cmudstyn400jg12erbs90fyoj	cmudstymw00jb12erik8n3liu	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.648	2026-09-23 07:46:07.648
cmudstyn400jh12er4b5f1po2	cmudstymw00jb12erik8n3liu	cmudstm2k001tbeo3xb2hvl5l	RTX 3000	2026-09-23 07:46:07.648	2026-09-23 07:46:07.648
cmudstyw500rn12erly9b4mxe	cmudstyvz00rh12erbvfqi8mh	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.974	2026-09-23 07:46:07.974
cmudstyn400ji12erlecs3diz	cmudstymw00jb12erik8n3liu	cmudstm2z0029beo3kz24pu2r	1 x DVI, 1 x HDMI, 1x DisplayPort	2026-09-23 07:46:07.648	2026-09-23 07:46:07.648
cmudstyn400jj12er27314n1o	cmudstymw00jb12erik8n3liu	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.648	2026-09-23 07:46:07.648
cmudstynm00jt12eridjkp1si	cmudstyng00jr12ervl676cgu	cmudstm2d001bbeo3ads0c96h	6GB	2026-09-23 07:46:07.666	2026-09-23 07:46:07.666
cmudstynm00ju12erjaj1hhwe	cmudstyng00jr12ervl676cgu	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.666	2026-09-23 07:46:07.666
cmudstynm00jv12erlgzi7s82	cmudstyng00jr12ervl676cgu	cmudstm2g001jbeo3hdbgmfpi	14000 MHz	2026-09-23 07:46:07.666	2026-09-23 07:46:07.666
cmudstynm00jw12erx4r7ri32	cmudstyng00jr12ervl676cgu	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.666	2026-09-23 07:46:07.666
cmudstynm00jx12erx16y35ex	cmudstyng00jr12ervl676cgu	cmudstm2k001tbeo3xb2hvl5l	RTX 3000	2026-09-23 07:46:07.666	2026-09-23 07:46:07.666
cmudstynm00jy12eriecs3yeh	cmudstyng00jr12ervl676cgu	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.666	2026-09-23 07:46:07.666
cmudstyo100k712errice6e3q	cmudstynv00k512er09zo19dc	cmudstm2d001bbeo3ads0c96h	6GB	2026-09-23 07:46:07.681	2026-09-23 07:46:07.681
cmudstyo100k812erzt211ya0	cmudstynv00k512er09zo19dc	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.681	2026-09-23 07:46:07.681
cmudstyo100k912erix3fow9l	cmudstynv00k512er09zo19dc	cmudstm2g001jbeo3hdbgmfpi	14000 MHz	2026-09-23 07:46:07.681	2026-09-23 07:46:07.681
cmudstyo100ka12errp2zuqyh	cmudstynv00k512er09zo19dc	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.681	2026-09-23 07:46:07.681
cmudstyo100kb12er7zxfa5fp	cmudstynv00k512er09zo19dc	cmudstm2k001tbeo3xb2hvl5l	RTX 3000	2026-09-23 07:46:07.681	2026-09-23 07:46:07.681
cmudstyo100kc12erkanv9wzl	cmudstynv00k512er09zo19dc	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.681	2026-09-23 07:46:07.681
cmudstyoe00kl12erl8jublue	cmudstyoa00kj12er6tcxtl6o	cmr9bvs9c003nnjjldprfoq71	GDDR6	2026-09-23 07:46:07.694	2026-09-23 07:46:07.694
cmudstyoe00km12erftm674j7	cmudstyoa00kj12er6tcxtl6o	cmr9bvs9c003onjjl73rcf6jj	Intel Arc	2026-09-23 07:46:07.694	2026-09-23 07:46:07.694
cmudstyoe00kn12er1goe9bc6	cmudstyoa00kj12er6tcxtl6o	cmtn513np000h13qz5byviy69	Arc A	2026-09-23 07:46:07.694	2026-09-23 07:46:07.694
cmudstyoe00ko12er6p45wag7	cmudstyoa00kj12er6tcxtl6o	cmtn513o3000x13qzmvkta77z	HDMI 2.0, DisplayPort 2.0	2026-09-23 07:46:07.694	2026-09-23 07:46:07.694
cmudstyoe00kp12ern20wex31	cmudstyoa00kj12er6tcxtl6o	cmr9fdu38000zznc8rwpfa7k5	3 Years	2026-09-23 07:46:07.694	2026-09-23 07:46:07.694
cmudstyor00ky12erwp2lijfa	cmudstyon00kw12ermfnga1j8	cmudstm2d001bbeo3ads0c96h	6GB	2026-09-23 07:46:07.707	2026-09-23 07:46:07.707
cmudstyor00kz12erlqzcjrqu	cmudstyon00kw12ermfnga1j8	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.707	2026-09-23 07:46:07.707
cmudstyor00l012erwmtcflhj	cmudstyon00kw12ermfnga1j8	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.707	2026-09-23 07:46:07.707
cmudstyor00l112erzaqxn4dq	cmudstyon00kw12ermfnga1j8	cmudstm2k001tbeo3xb2hvl5l	RTX 3000	2026-09-23 07:46:07.707	2026-09-23 07:46:07.707
cmudstyor00l212erxaix3dlo	cmudstyon00kw12ermfnga1j8	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.707	2026-09-23 07:46:07.707
cmudstyp400lb12er5qfwi267	cmudstyp000l912erbijbj9cv	cmr9bvs9c003nnjjldprfoq71	GDDR6	2026-09-23 07:46:07.721	2026-09-23 07:46:07.721
cmudstyp400lc12er6mrk0x4f	cmudstyp000l912erbijbj9cv	cmr9bvs9c003onjjl73rcf6jj	Intel Arc	2026-09-23 07:46:07.721	2026-09-23 07:46:07.721
cmudstyp400ld12eridlnz3pf	cmudstyp000l912erbijbj9cv	cmtn513np000h13qz5byviy69	Arc A	2026-09-23 07:46:07.721	2026-09-23 07:46:07.721
cmudstyp400le12erjdevbzq2	cmudstyp000l912erbijbj9cv	cmtn513o3000x13qzmvkta77z	1 x HDMI 2.0, 3 x DisplayPort 2.0	2026-09-23 07:46:07.721	2026-09-23 07:46:07.721
cmudstyp400lf12erw88o5wg4	cmudstyp000l912erbijbj9cv	cmr9fdu38000zznc8rwpfa7k5	3 Years	2026-09-23 07:46:07.721	2026-09-23 07:46:07.721
cmudstypj00lo12er74eqgmvy	cmudstypf00lm12er8j0pr81w	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:07.736	2026-09-23 07:46:07.736
cmudstypj00lp12erhi51l4kj	cmudstypf00lm12er8j0pr81w	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.736	2026-09-23 07:46:07.736
cmudstypk00lq12erzp4wx87z	cmudstypf00lm12er8j0pr81w	cmudstm2g001hbeo3trkzbee8	1605 ~ 1770 MHz	2026-09-23 07:46:07.736	2026-09-23 07:46:07.736
cmudstypk00lr12err7cg1q9b	cmudstypf00lm12er8j0pr81w	cmudstm2g001jbeo3hdbgmfpi	14Gbps	2026-09-23 07:46:07.736	2026-09-23 07:46:07.736
cmudstypk00ls12erbxkmmeej	cmudstypf00lm12er8j0pr81w	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.736	2026-09-23 07:46:07.736
cmudstypk00lt12er8b4lhp5b	cmudstypf00lm12er8j0pr81w	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.736	2026-09-23 07:46:07.736
cmudstyq600m212ernjkzrj2q	cmudstyq000m012erdbczhb09	cmudstm2d001bbeo3ads0c96h	6GB	2026-09-23 07:46:07.758	2026-09-23 07:46:07.758
cmudstyq600m312er0gbnb76s	cmudstyq000m012erdbczhb09	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.758	2026-09-23 07:46:07.758
cmudstyq600m412ertz1gw88y	cmudstyq000m012erdbczhb09	cmudstm2g001jbeo3hdbgmfpi	14 Gbps	2026-09-23 07:46:07.758	2026-09-23 07:46:07.758
cmudstyq600m512ertgo8qxg7	cmudstyq000m012erdbczhb09	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.758	2026-09-23 07:46:07.758
cmudstyq600m612ersqsxsmql	cmudstyq000m012erdbczhb09	cmudstm2k001tbeo3xb2hvl5l	RTX 3000	2026-09-23 07:46:07.758	2026-09-23 07:46:07.758
cmudstyq600m712erre8lxy9v	cmudstyq000m012erdbczhb09	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.758	2026-09-23 07:46:07.758
cmudstyql00mg12erfkoymqbc	cmudstyqh00me12er07ht4x7a	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.774	2026-09-23 07:46:07.774
cmudstyqm00mh12erbti4enql	cmudstyqh00me12er07ht4x7a	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.774	2026-09-23 07:46:07.774
cmudstyqm00mi12ero0moo3op	cmudstyqh00me12er07ht4x7a	cmudstm2k001tbeo3xb2hvl5l	RTX 3000	2026-09-23 07:46:07.774	2026-09-23 07:46:07.774
cmudstyqm00mj12erv9kl9ye7	cmudstyqh00me12er07ht4x7a	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.774	2026-09-23 07:46:07.774
cmudstyr000ms12erd0xzntp2	cmudstyqu00mq12er9lwuu1py	cmudstm34002lbeo3xl0fg6dd	90508GB	2026-09-23 07:46:07.788	2026-09-23 07:46:07.788
cmudstyr000mt12erac0k80an	cmudstyqu00mq12er9lwuu1py	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:07.788	2026-09-23 07:46:07.788
cmudstyr000mu12ertb12okhm	cmudstyqu00mq12er9lwuu1py	cmudstm36002rbeo3girfb892	Up to 1920MHz (Game) / 2600MHz (Boost)	2026-09-23 07:46:07.788	2026-09-23 07:46:07.788
cmudstyr000mv12er0yityju1	cmudstyqu00mq12er9lwuu1py	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:07.788	2026-09-23 07:46:07.788
cmudstyr000mw12erias1rl7y	cmudstyqu00mq12er9lwuu1py	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:07.788	2026-09-23 07:46:07.788
cmudstyr000mx12ervmsnzzpa	cmudstyqu00mq12er9lwuu1py	cmudstm3h003jbeo3wzjjjwu9	128-bit	2026-09-23 07:46:07.788	2026-09-23 07:46:07.788
cmudstyr000my12er08f0dqqj	cmudstyqu00mq12er9lwuu1py	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:07.788	2026-09-23 07:46:07.788
cmudstyrf00n812erccbc8zfa	cmudstyra00n612er0m8nxkkc	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:07.804	2026-09-23 07:46:07.804
cmudstyrf00n912erq99riwv1	cmudstyra00n612er0m8nxkkc	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.804	2026-09-23 07:46:07.804
cmudstyrf00na12er2zuwqn6q	cmudstyra00n612er0m8nxkkc	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.804	2026-09-23 07:46:07.804
cmudstyrf00nb12erxudjp9y0	cmudstyra00n612er0m8nxkkc	cmudstm2k001tbeo3xb2hvl5l	RTX 3000	2026-09-23 07:46:07.804	2026-09-23 07:46:07.804
cmudstyrf00nc12erbbrevngi	cmudstyra00n612er0m8nxkkc	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.804	2026-09-23 07:46:07.804
cmudstyrt00nl12eru9w3neuf	cmudstyrn00nj12erq62zv1ea	cmudstm34002lbeo3xl0fg6dd	76008GB	2026-09-23 07:46:07.817	2026-09-23 07:46:07.817
cmudstyrt00nm12ersxp1tryr	cmudstyrn00nj12erq62zv1ea	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:07.817	2026-09-23 07:46:07.817
cmudstyrt00nn12ero24qpdvx	cmudstyrn00nj12erq62zv1ea	cmudstm36002rbeo3girfb892	2250MHz (Game)	2026-09-23 07:46:07.817	2026-09-23 07:46:07.817
cmudstyrt00no12errjtq8hys	cmudstyrn00nj12erq62zv1ea	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:07.817	2026-09-23 07:46:07.817
cmudstyrt00np12errdufdnbu	cmudstyrn00nj12erq62zv1ea	cmudstm3b0033beo3pu4ethqx	RX 7000	2026-09-23 07:46:07.817	2026-09-23 07:46:07.817
cmudstyrt00nq12ervgsbm5i0	cmudstyrn00nj12erq62zv1ea	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:07.817	2026-09-23 07:46:07.817
cmudstys700nz12erkwreh44o	cmudstys200nx12erlmc05dyx	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:07.831	2026-09-23 07:46:07.831
cmudstys700o012erp5l49fk6	cmudstys200nx12erlmc05dyx	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.831	2026-09-23 07:46:07.831
cmudstys700o112erli3f2e3w	cmudstys200nx12erlmc05dyx	cmudstm2g001jbeo3hdbgmfpi	14Gbps	2026-09-23 07:46:07.831	2026-09-23 07:46:07.831
cmudstys700o212eryw0bakvk	cmudstys200nx12erlmc05dyx	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.831	2026-09-23 07:46:07.831
cmudstys700o312erye9l9cxy	cmudstys200nx12erlmc05dyx	cmudstm2k001tbeo3xb2hvl5l	RTX 3000	2026-09-23 07:46:07.831	2026-09-23 07:46:07.831
cmudstys700o412er315922p6	cmudstys200nx12erlmc05dyx	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.831	2026-09-23 07:46:07.831
cmudstysl00od12er3oabxjw5	cmudstysg00ob12ertcimwrsh	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:07.846	2026-09-23 07:46:07.846
cmudstysl00oe12erplidu4rg	cmudstysg00ob12ertcimwrsh	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.846	2026-09-23 07:46:07.846
cmudstysl00of12errlhw9gmt	cmudstysg00ob12ertcimwrsh	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.846	2026-09-23 07:46:07.846
cmudstysl00og12er0pqg74hu	cmudstysg00ob12ertcimwrsh	cmudstm2k001tbeo3xb2hvl5l	RTX 3000	2026-09-23 07:46:07.846	2026-09-23 07:46:07.846
cmudstysl00oh12ervg5cogg7	cmudstysg00ob12ertcimwrsh	cmudstm2z0029beo3kz24pu2r	PCI Express Gen 4	2026-09-23 07:46:07.846	2026-09-23 07:46:07.846
cmudstysl00oi12eruvlz0yn3	cmudstysg00ob12ertcimwrsh	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.846	2026-09-23 07:46:07.846
cmudstyt300ot12erwuay0k0x	cmudstysx00or12er6svixl2h	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:07.864	2026-09-23 07:46:07.864
cmudstyt300ou12erop4a14pa	cmudstysx00or12er6svixl2h	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.864	2026-09-23 07:46:07.864
cmudstyt300ov12er52hp6ac6	cmudstysx00or12er6svixl2h	cmudstm2g001jbeo3hdbgmfpi	20 Gbps	2026-09-23 07:46:07.864	2026-09-23 07:46:07.864
cmudstyt300ow12eroeobjs18	cmudstysx00or12er6svixl2h	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.864	2026-09-23 07:46:07.864
cmudstyt300ox12er75tel7bl	cmudstysx00or12er6svixl2h	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:07.864	2026-09-23 07:46:07.864
cmudstyt300oy12er48n04o59	cmudstysx00or12er6svixl2h	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.864	2026-09-23 07:46:07.864
cmudstytj00p712er9o5zgk9m	cmudstytd00p512er1k2kiz1n	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:07.879	2026-09-23 07:46:07.879
cmudstytj00p812er6yrbg3w4	cmudstytd00p512er1k2kiz1n	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.879	2026-09-23 07:46:07.879
cmudstytj00p912ereap47nip	cmudstytd00p512er1k2kiz1n	cmudstm2g001hbeo3trkzbee8	2572 MHz	2026-09-23 07:46:07.879	2026-09-23 07:46:07.879
cmudstytj00pa12erl30blrmi	cmudstytd00p512er1k2kiz1n	cmudstm2g001jbeo3hdbgmfpi	20 Gbps	2026-09-23 07:46:07.879	2026-09-23 07:46:07.879
cmudstytj00pb12erb6h83y5i	cmudstytd00p512er1k2kiz1n	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.879	2026-09-23 07:46:07.879
cmudstytj00pc12erh1fpd2ip	cmudstytd00p512er1k2kiz1n	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:07.879	2026-09-23 07:46:07.879
cmudstytj00pd12erqxa045e3	cmudstytd00p512er1k2kiz1n	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.879	2026-09-23 07:46:07.879
cmudstytx00pm12eror36jvyt	cmudstyts00pk12eroiqe7l8m	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:07.893	2026-09-23 07:46:07.893
cmudstytx00pn12erqijfbbpe	cmudstyts00pk12eroiqe7l8m	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.893	2026-09-23 07:46:07.893
cmudstytx00po12eri028lmq1	cmudstyts00pk12eroiqe7l8m	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.893	2026-09-23 07:46:07.893
cmudstytx00pp12erlhybkd0p	cmudstyts00pk12eroiqe7l8m	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:07.893	2026-09-23 07:46:07.893
cmudstytx00pq12erh682pwg2	cmudstyts00pk12eroiqe7l8m	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.893	2026-09-23 07:46:07.893
cmudstyub00pz12er28qeqkwr	cmudstyu600px12erl09ruej5	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:07.908	2026-09-23 07:46:07.908
cmudstyub00q012erdx7t4gan	cmudstyu600px12erl09ruej5	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.908	2026-09-23 07:46:07.908
cmudstyub00q112ero5c5kq0g	cmudstyu600px12erl09ruej5	cmudstm2g001hbeo3trkzbee8	2602 MHz	2026-09-23 07:46:07.908	2026-09-23 07:46:07.908
cmudstyub00q212era0nlyhsh	cmudstyu600px12erl09ruej5	cmudstm2g001jbeo3hdbgmfpi	20 Gbps	2026-09-23 07:46:07.908	2026-09-23 07:46:07.908
cmudstyub00q312er5ybzv2eq	cmudstyu600px12erl09ruej5	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.908	2026-09-23 07:46:07.908
cmudstyub00q412eribplel4b	cmudstyu600px12erl09ruej5	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:07.908	2026-09-23 07:46:07.908
cmudstyub00q512era7sc94xj	cmudstyu600px12erl09ruej5	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.908	2026-09-23 07:46:07.908
cmudstyuu00qe12erhvm3c61w	cmudstyup00qc12erksr40bke	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:07.927	2026-09-23 07:46:07.927
cmudstyuu00qf12erwmno82mz	cmudstyup00qc12erksr40bke	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.927	2026-09-23 07:46:07.927
cmudstyuu00qg12erhkuh8mu3	cmudstyup00qc12erksr40bke	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.927	2026-09-23 07:46:07.927
cmudstyuu00qh12ere0z5c2qe	cmudstyup00qc12erksr40bke	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:07.927	2026-09-23 07:46:07.927
cmudstyuu00qi12er4c0ucaaf	cmudstyup00qc12erksr40bke	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.927	2026-09-23 07:46:07.927
cmudstyv900qr12er47nerjfm	cmudstyv400qp12erspiq0wyb	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:07.942	2026-09-23 07:46:07.942
cmudstyv900qs12eruo9qsuv2	cmudstyv400qp12erspiq0wyb	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.942	2026-09-23 07:46:07.942
cmudstyv900qt12er7w9tekt7	cmudstyv400qp12erspiq0wyb	cmudstm2g001jbeo3hdbgmfpi	20 Gbps	2026-09-23 07:46:07.942	2026-09-23 07:46:07.942
cmudstyv900qu12erlsns0php	cmudstyv400qp12erspiq0wyb	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.942	2026-09-23 07:46:07.942
cmudstyv900qv12er0y3zkd5v	cmudstyv400qp12erspiq0wyb	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:07.942	2026-09-23 07:46:07.942
cmudstyv900qw12er4n07jvx4	cmudstyv400qp12erspiq0wyb	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.942	2026-09-23 07:46:07.942
cmudstyvo00r512ery7nk5xfi	cmudstyvj00r312er5jccc8g9	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:07.956	2026-09-23 07:46:07.956
cmudstyvo00r612erkcr932el	cmudstyvj00r312er5jccc8g9	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.956	2026-09-23 07:46:07.956
cmudstyvo00r712er97876th7	cmudstyvj00r312er5jccc8g9	cmudstm2g001jbeo3hdbgmfpi	20 Gbps	2026-09-23 07:46:07.956	2026-09-23 07:46:07.956
cmudstyvo00r812er1tze9p43	cmudstyvj00r312er5jccc8g9	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.956	2026-09-23 07:46:07.956
cmudstyvo00r912erqcgpjkk9	cmudstyvj00r312er5jccc8g9	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:07.956	2026-09-23 07:46:07.956
cmudstyvo00ra12ert59h8aln	cmudstyvj00r312er5jccc8g9	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.956	2026-09-23 07:46:07.956
cmudstyw500rj12er99egcbao	cmudstyvz00rh12erbvfqi8mh	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:07.974	2026-09-23 07:46:07.974
cmudstyw500rk12ervc8axdom	cmudstyvz00rh12erbvfqi8mh	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.974	2026-09-23 07:46:07.974
cmudstyw500rl12ers2075ksm	cmudstyvz00rh12erbvfqi8mh	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.974	2026-09-23 07:46:07.974
cmudstyw500rm12erzoxgdh4l	cmudstyvz00rh12erbvfqi8mh	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:07.974	2026-09-23 07:46:07.974
cmudstywl00rx12ersxg1ci3k	cmudstywg00ru12erhsad21nw	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:07.989	2026-09-23 07:46:07.989
cmudstywl00ry12erf98te8ir	cmudstywg00ru12erhsad21nw	cmudstm2g001hbeo3trkzbee8	2647 MHz (Boost Clock)	2026-09-23 07:46:07.989	2026-09-23 07:46:07.989
cmudstywl00rz12erw31l96zk	cmudstywg00ru12erhsad21nw	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:07.989	2026-09-23 07:46:07.989
cmudstywl00s012erixibd4fw	cmudstywg00ru12erhsad21nw	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:07.989	2026-09-23 07:46:07.989
cmudstywl00s112er0p8t0j0q	cmudstywg00ru12erhsad21nw	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:07.989	2026-09-23 07:46:07.989
cmudstywz00sa12er5x8lndte	cmudstywv00s812ergov70jvx	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.004	2026-09-23 07:46:08.004
cmudstywz00sb12er7tfp248f	cmudstywv00s812ergov70jvx	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:08.004	2026-09-23 07:46:08.004
cmudstywz00sc12erycm3554i	cmudstywv00s812ergov70jvx	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.004	2026-09-23 07:46:08.004
cmudstywz00sd12ere3ygvzcs	cmudstywv00s812ergov70jvx	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.004	2026-09-23 07:46:08.004
cmudstywz00se12er6xoeq0yt	cmudstywv00s812ergov70jvx	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.004	2026-09-23 07:46:08.004
cmudstyxe00sn12erdehsejji	cmudstyx900sl12erckjjgnkq	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.018	2026-09-23 07:46:08.018
cmudstyxe00so12er65x4bhzj	cmudstyx900sl12erckjjgnkq	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.018	2026-09-23 07:46:08.018
cmudstyxe00sp12erplxixvph	cmudstyx900sl12erckjjgnkq	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:08.018	2026-09-23 07:46:08.018
cmudstyxe00sq12erhjpkezl2	cmudstyx900sl12erckjjgnkq	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.018	2026-09-23 07:46:08.018
cmudstyxe00sr12er9q72f97u	cmudstyx900sl12erckjjgnkq	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.018	2026-09-23 07:46:08.018
cmudstyxe00ss12erbk0jk8h6	cmudstyx900sl12erckjjgnkq	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.018	2026-09-23 07:46:08.018
cmudstyxt00t112er8s42ke2l	cmudstyxo00sz12erbufg1pgd	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.034	2026-09-23 07:46:08.034
cmudstyxt00t212err99djjoj	cmudstyxo00sz12erbufg1pgd	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.034	2026-09-23 07:46:08.034
cmudstyxt00t312ercjkdlugp	cmudstyxo00sz12erbufg1pgd	cmudstm2g001hbeo3trkzbee8	2497 MHz	2026-09-23 07:46:08.034	2026-09-23 07:46:08.034
cmudstyxt00t412er5ur6zdgr	cmudstyxo00sz12erbufg1pgd	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.034	2026-09-23 07:46:08.034
cmudstyxt00t512erp4zy5ari	cmudstyxo00sz12erbufg1pgd	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.034	2026-09-23 07:46:08.034
cmudstyxt00t612er9dmsyxha	cmudstyxo00sz12erbufg1pgd	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.034	2026-09-23 07:46:08.034
cmudstyy900tf12er3kgc90w1	cmudstyy300td12erh4ozp6ad	cmudstm2d001bbeo3ads0c96h	50608GB	2026-09-23 07:46:08.049	2026-09-23 07:46:08.049
cmudstyy900tg12erp120y8yz	cmudstyy300td12erh4ozp6ad	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.049	2026-09-23 07:46:08.049
cmudstyy900th12erhsmh6bdl	cmudstyy300td12erh4ozp6ad	cmudstm2g001hbeo3trkzbee8	2497 MHz (Boost Clock)	2026-09-23 07:46:08.049	2026-09-23 07:46:08.049
cmudstyy900ti12erkj7mknr6	cmudstyy300td12erh4ozp6ad	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.049	2026-09-23 07:46:08.049
cmudstyy900tj12er2e9bzgh4	cmudstyy300td12erh4ozp6ad	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.049	2026-09-23 07:46:08.049
cmudstyy900tk12erkvlyd0v9	cmudstyy300td12erh4ozp6ad	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.049	2026-09-23 07:46:08.049
cmudstyyo00tt12erof9j4e9r	cmudstyyj00tr12ergdnoavz3	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.064	2026-09-23 07:46:08.064
cmudstyyo00tu12erctoebcdj	cmudstyyj00tr12ergdnoavz3	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.064	2026-09-23 07:46:08.064
cmudstyyo00tv12erg73g1iac	cmudstyyj00tr12ergdnoavz3	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:08.064	2026-09-23 07:46:08.064
cmudstyyo00tw12er6vicb25s	cmudstyyj00tr12ergdnoavz3	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.064	2026-09-23 07:46:08.064
cmudstyyo00tx12er64cleqbk	cmudstyyj00tr12ergdnoavz3	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.064	2026-09-23 07:46:08.064
cmudstyyo00ty12erkqp62h1e	cmudstyyj00tr12ergdnoavz3	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.064	2026-09-23 07:46:08.064
cmudstyz600u712er3ko20d2e	cmudstyyz00u512er31y0ofdm	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.082	2026-09-23 07:46:08.082
cmudstyz600u812erf86ok110	cmudstyyz00u512er31y0ofdm	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.082	2026-09-23 07:46:08.082
cmudstyz600u912er42ub08wa	cmudstyyz00u512er31y0ofdm	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:08.082	2026-09-23 07:46:08.082
cmudstyz600ua12eruk5cs0fv	cmudstyyz00u512er31y0ofdm	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.082	2026-09-23 07:46:08.082
cmudstyz600ub12erhvkq6ra2	cmudstyyz00u512er31y0ofdm	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.082	2026-09-23 07:46:08.082
cmudstyz600uc12er0a18cy0o	cmudstyyz00u512er31y0ofdm	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.082	2026-09-23 07:46:08.082
cmudstyzr00ul12er5nu4l0nk	cmudstyzl00uj12err8y6n94u	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.103	2026-09-23 07:46:08.103
cmudstyzr00um12erhscnpsr0	cmudstyzl00uj12err8y6n94u	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.103	2026-09-23 07:46:08.103
cmudstyzr00un12erqa21obxg	cmudstyzl00uj12err8y6n94u	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:08.103	2026-09-23 07:46:08.103
cmudstyzr00uo12ernthdj5o7	cmudstyzl00uj12err8y6n94u	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.103	2026-09-23 07:46:08.103
cmudstyzr00up12er002cgyiy	cmudstyzl00uj12err8y6n94u	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.103	2026-09-23 07:46:08.103
cmudstyzr00uq12er4di8zcgh	cmudstyzl00uj12err8y6n94u	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.103	2026-09-23 07:46:08.103
cmudstz0500uz12er5ha4pxx1	cmudstz0100ux12erhh6ccp95	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.118	2026-09-23 07:46:08.118
cmudstz0500v012er2f0mgxm5	cmudstz0100ux12erhh6ccp95	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.118	2026-09-23 07:46:08.118
cmudstz0500v112errfzhoqx6	cmudstz0100ux12erhh6ccp95	cmudstm2g001hbeo3trkzbee8	2550 MHz	2026-09-23 07:46:08.118	2026-09-23 07:46:08.118
cmudstz0500v212ertcexdfut	cmudstz0100ux12erhh6ccp95	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.118	2026-09-23 07:46:08.118
cmudstz0500v312erzv3lumv4	cmudstz0100ux12erhh6ccp95	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.118	2026-09-23 07:46:08.118
cmudstz0500v412er12gmftdw	cmudstz0100ux12erhh6ccp95	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.118	2026-09-23 07:46:08.118
cmudstz0j00vd12ernik7hjxs	cmudstz0f00vb12er8zw60u9y	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.132	2026-09-23 07:46:08.132
cmudstz0j00ve12er2sv18l9k	cmudstz0f00vb12er8zw60u9y	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.132	2026-09-23 07:46:08.132
cmudstz0j00vf12ery6ncgs1q	cmudstz0f00vb12er8zw60u9y	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.132	2026-09-23 07:46:08.132
cmudstz0j00vg12ern6qikz3z	cmudstz0f00vb12er8zw60u9y	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.132	2026-09-23 07:46:08.132
cmudstz0j00vh12ery00iuas0	cmudstz0f00vb12er8zw60u9y	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.132	2026-09-23 07:46:08.132
cmudstz0w00vq12erxl7zmuqt	cmudstz0r00vo12ero5m3kmdh	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.144	2026-09-23 07:46:08.144
cmudstz0w00vr12er1zlxxwo9	cmudstz0r00vo12ero5m3kmdh	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.144	2026-09-23 07:46:08.144
cmudstz0w00vs12er5x2c16gx	cmudstz0r00vo12ero5m3kmdh	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.144	2026-09-23 07:46:08.144
cmudstz0w00vt12er0bu9sh05	cmudstz0r00vo12ero5m3kmdh	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.144	2026-09-23 07:46:08.144
cmudstz0w00vu12ermrpsa81c	cmudstz0r00vo12ero5m3kmdh	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.144	2026-09-23 07:46:08.144
cmudstz1d00w312erybapkklx	cmudstz1400w112erm4s5durz	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.161	2026-09-23 07:46:08.161
cmudstz1d00w412er77dgmal3	cmudstz1400w112erm4s5durz	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.161	2026-09-23 07:46:08.161
cmudstz1d00w512ertgobrie5	cmudstz1400w112erm4s5durz	cmudstm2g001hbeo3trkzbee8	2565MHz (OC)	2026-09-23 07:46:08.161	2026-09-23 07:46:08.161
cmudstz1d00w612er4vnxwp0e	cmudstz1400w112erm4s5durz	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.161	2026-09-23 07:46:08.161
cmudstz1d00w712erb45gfqxb	cmudstz1400w112erm4s5durz	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.161	2026-09-23 07:46:08.161
cmudstz1d00w812erd5iuyt5e	cmudstz1400w112erm4s5durz	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.161	2026-09-23 07:46:08.161
cmudstz1s00wh12erwt3ylnu0	cmudstz1m00wf12ericuaoao4	cmudstm2d001bbeo3ads0c96h	12GB	2026-09-23 07:46:08.177	2026-09-23 07:46:08.177
cmudstz1s00wi12ert73o4cnn	cmudstz1m00wf12ericuaoao4	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:08.177	2026-09-23 07:46:08.177
cmudstz1s00wj12erik2jaoir	cmudstz1m00wf12ericuaoao4	cmudstm2g001jbeo3hdbgmfpi	15000 MHz	2026-09-23 07:46:08.177	2026-09-23 07:46:08.177
cmudstz1s00wk12ervlnv67yh	cmudstz1m00wf12ericuaoao4	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.177	2026-09-23 07:46:08.177
cmudstz1s00wl12er6l137pxb	cmudstz1m00wf12ericuaoao4	cmudstm2k001tbeo3xb2hvl5l	RTX 3000	2026-09-23 07:46:08.177	2026-09-23 07:46:08.177
cmudstz1s00wm12erfq8cillu	cmudstz1m00wf12ericuaoao4	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.177	2026-09-23 07:46:08.177
cmudstz2700wv12er5cwhxi8y	cmudstz2100wt12er8x4e02y6	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.192	2026-09-23 07:46:08.192
cmudstz2700ww12erv990iu6s	cmudstz2100wt12er8x4e02y6	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.192	2026-09-23 07:46:08.192
cmudstz2700wx12ern3ulgx57	cmudstz2100wt12er8x4e02y6	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.192	2026-09-23 07:46:08.192
cmudstz2700wy12eryvulahx0	cmudstz2100wt12er8x4e02y6	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.192	2026-09-23 07:46:08.192
cmudstz2700wz12ereso1rtrc	cmudstz2100wt12er8x4e02y6	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.192	2026-09-23 07:46:08.192
cmudstz2n00x812er1tjkwjvu	cmudstz2h00x612er1iqsd6fg	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.207	2026-09-23 07:46:08.207
cmudstz2n00x912er23sycj2d	cmudstz2h00x612er1iqsd6fg	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.207	2026-09-23 07:46:08.207
cmudstz2n00xa12erjioblcnh	cmudstz2h00x612er1iqsd6fg	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:08.207	2026-09-23 07:46:08.207
cmudstz2n00xb12erkwyrk4u5	cmudstz2h00x612er1iqsd6fg	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.207	2026-09-23 07:46:08.207
cmudstz2n00xc12ernhrq0wky	cmudstz2h00x612er1iqsd6fg	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.207	2026-09-23 07:46:08.207
cmudstz2n00xd12erybwc1tiy	cmudstz2h00x612er1iqsd6fg	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.207	2026-09-23 07:46:08.207
cmudstz3100xm12erlmv3cd4s	cmudstz2w00xk12er6u4i3fh1	cmudstm2d001bbeo3ads0c96h	12GB	2026-09-23 07:46:08.221	2026-09-23 07:46:08.221
cmudstz3100xn12er87y4tmo6	cmudstz2w00xk12er6u4i3fh1	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:08.221	2026-09-23 07:46:08.221
cmudstz3100xo12erbfgawgzy	cmudstz2w00xk12er6u4i3fh1	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.221	2026-09-23 07:46:08.221
cmudstz3100xp12ereglk4jp1	cmudstz2w00xk12er6u4i3fh1	cmudstm2k001tbeo3xb2hvl5l	RTX 3000	2026-09-23 07:46:08.221	2026-09-23 07:46:08.221
cmudstz3100xq12erd8izn3am	cmudstz2w00xk12er6u4i3fh1	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.221	2026-09-23 07:46:08.221
cmudstz3f00xz12erz4vuwm46	cmudstz3900xx12er3h8v63o1	cmudstm34002lbeo3xl0fg6dd	8GB	2026-09-23 07:46:08.236	2026-09-23 07:46:08.236
cmudstz3f00y012erlcvjgvlw	cmudstz3900xx12er3h8v63o1	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.236	2026-09-23 07:46:08.236
cmudstz3f00y112er72fejytg	cmudstz3900xx12er3h8v63o1	cmudstm37002tbeo3rwfz92f9	20 Gbps Effective	2026-09-23 07:46:08.236	2026-09-23 07:46:08.236
cmudstz3f00y212er58zerswg	cmudstz3900xx12er3h8v63o1	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.236	2026-09-23 07:46:08.236
cmudstz3f00y312erte2gndyb	cmudstz3900xx12er3h8v63o1	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.236	2026-09-23 07:46:08.236
cmudstz3f00y412eru6obhcua	cmudstz3900xx12er3h8v63o1	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.236	2026-09-23 07:46:08.236
cmudstz3t00yd12ert3tra5hj	cmudstz3p00yb12er85j9fcv1	cmr9bvs9c003nnjjldprfoq71	GDDR6	2026-09-23 07:46:08.249	2026-09-23 07:46:08.249
cmudstz3t00ye12er37j8dj7v	cmudstz3p00yb12er85j9fcv1	cmr9bvs9c003onjjl73rcf6jj	Intel Arc	2026-09-23 07:46:08.249	2026-09-23 07:46:08.249
cmudstz3t00yf12ervthkpv6c	cmudstz3p00yb12er85j9fcv1	cmr9fdu38000zznc8rwpfa7k5	3 Years	2026-09-23 07:46:08.249	2026-09-23 07:46:08.249
cmudstz4500ym12erdtmtj3ky	cmudstz4000yk12eriapgu48r	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.261	2026-09-23 07:46:08.261
cmudstz4500yn12er0522pwk2	cmudstz4000yk12eriapgu48r	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.261	2026-09-23 07:46:08.261
cmudstz4500yo12eri272q9f4	cmudstz4000yk12eriapgu48r	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.261	2026-09-23 07:46:08.261
cmudstz4500yp12erpzsb6y7m	cmudstz4000yk12eriapgu48r	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.261	2026-09-23 07:46:08.261
cmudstz4500yq12err3roxbhv	cmudstz4000yk12eriapgu48r	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.261	2026-09-23 07:46:08.261
cmudstz4j00yz12er9fswugql	cmudstz4e00yx12ere42j7onb	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.276	2026-09-23 07:46:08.276
cmudstz4j00z012er70rw7ygn	cmudstz4e00yx12ere42j7onb	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.276	2026-09-23 07:46:08.276
cmudstz4j00z112erk0lm0e2x	cmudstz4e00yx12ere42j7onb	cmudstm2g001jbeo3hdbgmfpi	28Gbps	2026-09-23 07:46:08.276	2026-09-23 07:46:08.276
cmudstz4j00z212ero3csu1rx	cmudstz4e00yx12ere42j7onb	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.276	2026-09-23 07:46:08.276
cmudstz4j00z312erwyc6kcvx	cmudstz4e00yx12ere42j7onb	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.276	2026-09-23 07:46:08.276
cmudstz4j00z412erufbir70w	cmudstz4e00yx12ere42j7onb	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.276	2026-09-23 07:46:08.276
cmudstz4x00zd12er0i07ho6e	cmudstz4s00zb12erq67te5zo	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.289	2026-09-23 07:46:08.289
cmudstz4x00ze12er7a3kr64o	cmudstz4s00zb12erq67te5zo	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.289	2026-09-23 07:46:08.289
cmudstz4x00zf12erqdtu0xjx	cmudstz4s00zb12erq67te5zo	cmudstm2g001jbeo3hdbgmfpi	28Gbps	2026-09-23 07:46:08.289	2026-09-23 07:46:08.289
cmudstz4x00zg12er4ylbr8pu	cmudstz4s00zb12erq67te5zo	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.289	2026-09-23 07:46:08.289
cmudstz4x00zh12er71m8mdut	cmudstz4s00zb12erq67te5zo	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.289	2026-09-23 07:46:08.289
cmudstz4x00zi12er0qmmnhw0	cmudstz4s00zb12erq67te5zo	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.289	2026-09-23 07:46:08.289
cmudstz5d00zr12erhggovanl	cmudstz5700zp12ereevxx7xi	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.305	2026-09-23 07:46:08.305
cmudstz5d00zs12er3mt9jh1w	cmudstz5700zp12ereevxx7xi	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.305	2026-09-23 07:46:08.305
cmudstz5d00zt12erszuw27sa	cmudstz5700zp12ereevxx7xi	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.305	2026-09-23 07:46:08.305
cmudstz5d00zu12er5vvc6poy	cmudstz5700zp12ereevxx7xi	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.305	2026-09-23 07:46:08.305
cmudstz5d00zv12erbv2no41n	cmudstz5700zp12ereevxx7xi	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.305	2026-09-23 07:46:08.305
cmudstz5r010412erbcygnil8	cmudstz5m010212erc5xl4ajb	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.32	2026-09-23 07:46:08.32
cmudstz5r010512erprwrsp6j	cmudstz5m010212erc5xl4ajb	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.32	2026-09-23 07:46:08.32
cmudstz5r010612er9xg8cs9d	cmudstz5m010212erc5xl4ajb	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.32	2026-09-23 07:46:08.32
cmudstz5r010712erphj33ywr	cmudstz5m010212erc5xl4ajb	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.32	2026-09-23 07:46:08.32
cmudstz5r010812erbrftyqqn	cmudstz5m010212erc5xl4ajb	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.32	2026-09-23 07:46:08.32
cmudstz64010h12erk2x3v8wf	cmudstz5z010f12ergiyggfch	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.333	2026-09-23 07:46:08.333
cmudstz64010i12er1ad2opcb	cmudstz5z010f12ergiyggfch	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.333	2026-09-23 07:46:08.333
cmudstz64010j12era4487wd8	cmudstz5z010f12ergiyggfch	cmudstm2g001jbeo3hdbgmfpi	28 Gbps, Memory Bus Width: 128 bit	2026-09-23 07:46:08.333	2026-09-23 07:46:08.333
cmudstz64010k12eryuhcq6wq	cmudstz5z010f12ergiyggfch	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.333	2026-09-23 07:46:08.333
cmudstz64010l12er6crm0092	cmudstz5z010f12ergiyggfch	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.333	2026-09-23 07:46:08.333
cmudstz64010m12erqw199sxm	cmudstz5z010f12ergiyggfch	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.333	2026-09-23 07:46:08.333
cmudstz6k010v12erxpqmzwl7	cmudstz6f010t12eri098tx5v	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.348	2026-09-23 07:46:08.348
cmudstz6k010w12erv3c81x4h	cmudstz6f010t12eri098tx5v	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.348	2026-09-23 07:46:08.348
cmudstz6k010x12erwyeydcly	cmudstz6f010t12eri098tx5v	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.348	2026-09-23 07:46:08.348
cmudstz6k010y12er2oh5i8bs	cmudstz6f010t12eri098tx5v	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.348	2026-09-23 07:46:08.348
cmudstz6k010z12erogtouumq	cmudstz6f010t12eri098tx5v	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.348	2026-09-23 07:46:08.348
cmudstz6x011812erkk0a3kfq	cmudstz6s011612erv8om45uj	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.361	2026-09-23 07:46:08.361
cmudstz6x011912er2g24uk3a	cmudstz6s011612erv8om45uj	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.361	2026-09-23 07:46:08.361
cmudstz6x011a12ertq6358an	cmudstz6s011612erv8om45uj	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.361	2026-09-23 07:46:08.361
cmudstz6x011b12erc82mjqp1	cmudstz6s011612erv8om45uj	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.361	2026-09-23 07:46:08.361
cmudstz6x011c12er7noqlalw	cmudstz6s011612erv8om45uj	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.361	2026-09-23 07:46:08.361
cmudstz7c011l12erfeedp6jg	cmudstz76011j12er8mljcbhz	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.377	2026-09-23 07:46:08.377
cmudstz7c011m12eryr7668t4	cmudstz76011j12er8mljcbhz	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.377	2026-09-23 07:46:08.377
cmudstz7c011n12erc3gvyu2j	cmudstz76011j12er8mljcbhz	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:08.377	2026-09-23 07:46:08.377
cmudstz7c011o12er4rzy9ylz	cmudstz76011j12er8mljcbhz	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.377	2026-09-23 07:46:08.377
cmudstz7c011p12ergl82wut6	cmudstz76011j12er8mljcbhz	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.377	2026-09-23 07:46:08.377
cmudstz7c011q12ergeapv70d	cmudstz76011j12er8mljcbhz	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.377	2026-09-23 07:46:08.377
cmudstz7r011z12ers669q4oq	cmudstz7m011x12erwri0fu4q	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.392	2026-09-23 07:46:08.392
cmudstz7r012012er840x01jj	cmudstz7m011x12erwri0fu4q	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.392	2026-09-23 07:46:08.392
cmudstz7r012112er153v4anx	cmudstz7m011x12erwri0fu4q	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.392	2026-09-23 07:46:08.392
cmudstz7r012212er0ty7zewc	cmudstz7m011x12erwri0fu4q	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.392	2026-09-23 07:46:08.392
cmudstz7r012312erxmc24efr	cmudstz7m011x12erwri0fu4q	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.392	2026-09-23 07:46:08.392
cmudstz86012c12er3pzhh1tm	cmudstz80012a12er7s3ik2s1	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.406	2026-09-23 07:46:08.406
cmudstz86012d12erpr17kvs2	cmudstz80012a12er7s3ik2s1	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.406	2026-09-23 07:46:08.406
cmudstz86012e12erq61gt7s3	cmudstz80012a12er7s3ik2s1	cmudstm36002rbeo3girfb892	Up to 2620 MHz (Game) / 3230 MHz (Boost)	2026-09-23 07:46:08.406	2026-09-23 07:46:08.406
cmudstz86012f12ers9fxdht8	cmudstz80012a12er7s3ik2s1	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.406	2026-09-23 07:46:08.406
cmudstz86012g12erzrn9f3kg	cmudstz80012a12er7s3ik2s1	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.406	2026-09-23 07:46:08.406
cmudstz86012h12er725d0ibi	cmudstz80012a12er7s3ik2s1	cmudstm3h003jbeo3wzjjjwu9	128-bit	2026-09-23 07:46:08.406	2026-09-23 07:46:08.406
cmudstz86012i12erpox5t62a	cmudstz80012a12er7s3ik2s1	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.406	2026-09-23 07:46:08.406
cmudstz8m012s12eray0hew7l	cmudstz8h012q12ertqdjdmdb	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.423	2026-09-23 07:46:08.423
cmudstz8m012t12erx3cxsjq5	cmudstz8h012q12ertqdjdmdb	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.423	2026-09-23 07:46:08.423
cmudstz8m012u12er3948axt0	cmudstz8h012q12ertqdjdmdb	cmudstm2g001hbeo3trkzbee8	2617MHz (Boost Clock)	2026-09-23 07:46:08.423	2026-09-23 07:46:08.423
cmudstz8m012v12erugfr4upb	cmudstz8h012q12ertqdjdmdb	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.423	2026-09-23 07:46:08.423
cmudstz8m012w12err84e9ga0	cmudstz8h012q12ertqdjdmdb	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.423	2026-09-23 07:46:08.423
cmudstz8m012x12erm6e83sak	cmudstz8h012q12ertqdjdmdb	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.423	2026-09-23 07:46:08.423
cmudstz92013612erlrzzf4wp	cmudstz8w013412erodesa63h	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.439	2026-09-23 07:46:08.439
cmudstz92013712er3b787a6c	cmudstz8w013412erodesa63h	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.439	2026-09-23 07:46:08.439
cmudstz92013812eriq7hmi6m	cmudstz8w013412erodesa63h	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.439	2026-09-23 07:46:08.439
cmudstz92013912erjq2tb24m	cmudstz8w013412erodesa63h	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.439	2026-09-23 07:46:08.439
cmudstz92013a12erre2mbaf2	cmudstz8w013412erodesa63h	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.439	2026-09-23 07:46:08.439
cmudstz9h013j12er7wrz7fh9	cmudstz9b013h12erqja3zsvd	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:08.454	2026-09-23 07:46:08.454
cmudstz9h013k12er0q3mjdep	cmudstz9b013h12erqja3zsvd	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.454	2026-09-23 07:46:08.454
cmudstz9h013l12er6owx1xg8	cmudstz9b013h12erqja3zsvd	cmudstm2g001hbeo3trkzbee8	2602 MHz (Boost Clock)	2026-09-23 07:46:08.454	2026-09-23 07:46:08.454
cmudstz9h013m12eruozfizax	cmudstz9b013h12erqja3zsvd	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.454	2026-09-23 07:46:08.454
cmudstz9h013n12er0ai5m481	cmudstz9b013h12erqja3zsvd	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.454	2026-09-23 07:46:08.454
cmudstz9h013o12erc44unpi3	cmudstz9b013h12erqja3zsvd	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.454	2026-09-23 07:46:08.454
cmudstz9w013x12erg251x6lj	cmudstz9q013v12er7zg4v9o5	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.468	2026-09-23 07:46:08.468
cmudstz9w013y12er0uhcsihz	cmudstz9q013v12er7zg4v9o5	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.468	2026-09-23 07:46:08.468
cmudstz9w013z12erztxnfhm1	cmudstz9q013v12er7zg4v9o5	cmudstm36002rbeo3girfb892	Up to 2740 MHz (Game) / 3310 MHz (Boost)	2026-09-23 07:46:08.468	2026-09-23 07:46:08.468
cmudstz9w014012erfqm4fe2a	cmudstz9q013v12er7zg4v9o5	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.468	2026-09-23 07:46:08.468
cmudstz9w014112ervo0jfwl5	cmudstz9q013v12er7zg4v9o5	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.468	2026-09-23 07:46:08.468
cmudstz9w014212er5mqxbd4h	cmudstz9q013v12er7zg4v9o5	cmudstm3h003jbeo3wzjjjwu9	128-bit	2026-09-23 07:46:08.468	2026-09-23 07:46:08.468
cmudstz9w014312er38d9zsir	cmudstz9q013v12er7zg4v9o5	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.468	2026-09-23 07:46:08.468
cmudstzaa014d12erq6p2lpgm	cmudstza6014b12erl2br5p6h	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.483	2026-09-23 07:46:08.483
cmudstzaa014e12erp2kuu4ik	cmudstza6014b12erl2br5p6h	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.483	2026-09-23 07:46:08.483
cmudstzaa014f12erjwppobdq	cmudstza6014b12erl2br5p6h	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.483	2026-09-23 07:46:08.483
cmudstzaa014g12erj0v064nx	cmudstza6014b12erl2br5p6h	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.483	2026-09-23 07:46:08.483
cmudstzaa014h12eruhvy525e	cmudstza6014b12erl2br5p6h	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.483	2026-09-23 07:46:08.483
cmudstzao014q12ere9kja4vc	cmudstzaj014o12erav9d93gf	cmudstm34002lbeo3xl0fg6dd	12GB	2026-09-23 07:46:08.496	2026-09-23 07:46:08.496
cmudstzao014r12erllhfu8di	cmudstzaj014o12erav9d93gf	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.496	2026-09-23 07:46:08.496
cmudstzao014s12err1xjz1ju	cmudstzaj014o12erav9d93gf	cmudstm36002rbeo3girfb892	Up to 2226 MHz (Game) / 2584 MHz (Boost)	2026-09-23 07:46:08.496	2026-09-23 07:46:08.496
cmudstzao014t12er8i54s7c8	cmudstzaj014o12erav9d93gf	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.496	2026-09-23 07:46:08.496
cmudstzao014u12erqh14sczp	cmudstzaj014o12erav9d93gf	cmudstm3b0033beo3pu4ethqx	RX 7000	2026-09-23 07:46:08.496	2026-09-23 07:46:08.496
cmudstzao014v12erm5wzm959	cmudstzaj014o12erav9d93gf	cmudstm3h003jbeo3wzjjjwu9	192-bit	2026-09-23 07:46:08.496	2026-09-23 07:46:08.496
cmudstzao014w12erkvzmozev	cmudstzaj014o12erav9d93gf	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.496	2026-09-23 07:46:08.496
cmudstzb3015612erhfhyobu7	cmudstzay015412erjazbb612	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.511	2026-09-23 07:46:08.511
cmudstzb3015712eryvjvak3t	cmudstzay015412erjazbb612	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.511	2026-09-23 07:46:08.511
cmudstzb3015812er8i2c5rxq	cmudstzay015412erjazbb612	cmudstm37002tbeo3rwfz92f9	20 Gbps Effective	2026-09-23 07:46:08.511	2026-09-23 07:46:08.511
cmudstzb3015912erplp7y3eq	cmudstzay015412erjazbb612	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.511	2026-09-23 07:46:08.511
cmudstzb3015a12erb4dws52p	cmudstzay015412erjazbb612	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.511	2026-09-23 07:46:08.511
cmudstzb3015b12er9a5vdjz0	cmudstzay015412erjazbb612	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.511	2026-09-23 07:46:08.511
cmudstzbl015k12erxv9vgras	cmudstzbf015i12er79zcig1c	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.53	2026-09-23 07:46:08.53
cmudstzbl015l12erfh5t78av	cmudstzbf015i12er79zcig1c	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.53	2026-09-23 07:46:08.53
cmudstzbl015m12er25uda0ym	cmudstzbf015i12er79zcig1c	cmudstm36002rbeo3girfb892	Up to 2124MHz (Game)/ 2430MHz (Boost)	2026-09-23 07:46:08.53	2026-09-23 07:46:08.53
cmudstzbl015n12erdiidjjbr	cmudstzbf015i12er79zcig1c	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.53	2026-09-23 07:46:08.53
cmudstzbl015o12erkham7v5s	cmudstzbf015i12er79zcig1c	cmudstm3b0033beo3pu4ethqx	RX 7000	2026-09-23 07:46:08.53	2026-09-23 07:46:08.53
cmudstzbl015p12ernz0ib1kb	cmudstzbf015i12er79zcig1c	cmudstm3h003jbeo3wzjjjwu9	256-bit	2026-09-23 07:46:08.53	2026-09-23 07:46:08.53
cmudstzbl015q12erqrwver6y	cmudstzbf015i12er79zcig1c	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.53	2026-09-23 07:46:08.53
cmudstzc1016012er52ofez3d	cmudstzbw015y12er6x4ouhl2	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.545	2026-09-23 07:46:08.545
cmudstzc1016112ertbstmods	cmudstzbw015y12er6x4ouhl2	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.545	2026-09-23 07:46:08.545
cmudstzc1016212errqqkxxxo	cmudstzbw015y12er6x4ouhl2	cmudstm36002rbeo3girfb892	Max. 3330 MHz (OC)	2026-09-23 07:46:08.545	2026-09-23 07:46:08.545
cmudstzc1016312ercunuqsyg	cmudstzbw015y12er6x4ouhl2	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.545	2026-09-23 07:46:08.545
cmudstzc1016412er8d32zxk3	cmudstzbw015y12er6x4ouhl2	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.545	2026-09-23 07:46:08.545
cmudstzc1016512erfro03r16	cmudstzbw015y12er6x4ouhl2	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.545	2026-09-23 07:46:08.545
cmudstzcg016e12er1iuwc6q0	cmudstzc9016c12ermdsxgxr6	cmudstm34002lbeo3xl0fg6dd	12GB	2026-09-23 07:46:08.56	2026-09-23 07:46:08.56
cmudstzcg016f12erf3t4lwhn	cmudstzc9016c12ermdsxgxr6	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.56	2026-09-23 07:46:08.56
cmudstzcg016g12ertpfggbro	cmudstzc9016c12ermdsxgxr6	cmudstm36002rbeo3girfb892	Up to 2220MHz(Game)/ 2790MHz(Boost)	2026-09-23 07:46:08.56	2026-09-23 07:46:08.56
cmudstzcg016h12erpiyqtvqx	cmudstzc9016c12ermdsxgxr6	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.56	2026-09-23 07:46:08.56
cmudstzcg016i12er5d5i83ok	cmudstzc9016c12ermdsxgxr6	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.56	2026-09-23 07:46:08.56
cmudstzcg016j12er1tdpja0i	cmudstzc9016c12ermdsxgxr6	cmudstm3h003jbeo3wzjjjwu9	192-bit	2026-09-23 07:46:08.56	2026-09-23 07:46:08.56
cmudstzcg016k12errygixspb	cmudstzc9016c12ermdsxgxr6	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.56	2026-09-23 07:46:08.56
cmudstzcx016u12erve7d2mcn	cmudstzcr016s12er4nsy9atv	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.578	2026-09-23 07:46:08.578
cmudstzcx016v12erdz0yxiaf	cmudstzcr016s12er4nsy9atv	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.578	2026-09-23 07:46:08.578
cmudstzcx016w12er7rrsig6w	cmudstzcr016s12er4nsy9atv	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.578	2026-09-23 07:46:08.578
cmudstzcx016x12ergcrwnpnu	cmudstzcr016s12er4nsy9atv	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.578	2026-09-23 07:46:08.578
cmudstzcx016y12erumctbrau	cmudstzcr016s12er4nsy9atv	cmudstm3h003jbeo3wzjjjwu9	128-bit	2026-09-23 07:46:08.578	2026-09-23 07:46:08.578
cmudstzcx016z12era3vg4oss	cmudstzcr016s12er4nsy9atv	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.578	2026-09-23 07:46:08.578
cmudstzdc017912ermlyzd04d	cmudstzd7017712ers8312ffa	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.593	2026-09-23 07:46:08.593
cmudstzdc017a12er34zl1jdm	cmudstzd7017712ers8312ffa	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.593	2026-09-23 07:46:08.593
cmudstzdc017b12erg2mxq05b	cmudstzd7017712ers8312ffa	cmudstm37002tbeo3rwfz92f9	20 Gbps Effective	2026-09-23 07:46:08.593	2026-09-23 07:46:08.593
cmudstzdc017c12erltflovln	cmudstzd7017712ers8312ffa	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.593	2026-09-23 07:46:08.593
cmudstzdc017d12eru9gw06t1	cmudstzd7017712ers8312ffa	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.593	2026-09-23 07:46:08.593
cmudstzdc017e12er628stqd7	cmudstzd7017712ers8312ffa	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.593	2026-09-23 07:46:08.593
cmudstzdq017n12erw2b4rd89	cmudstzdl017l12ernvl5q9rp	cmudstm34002lbeo3xl0fg6dd	12GB	2026-09-23 07:46:08.607	2026-09-23 07:46:08.607
cmudstzdq017o12ere6z9jymp	cmudstzdl017l12ernvl5q9rp	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.607	2026-09-23 07:46:08.607
cmudstzdq017p12er40z9hv4f	cmudstzdl017l12ernvl5q9rp	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.607	2026-09-23 07:46:08.607
cmudstzdq017q12erm0dys2tf	cmudstzdl017l12ernvl5q9rp	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.607	2026-09-23 07:46:08.607
cmudstzdq017r12errpuvw6r2	cmudstzdl017l12ernvl5q9rp	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.607	2026-09-23 07:46:08.607
cmudstze3018012er3givnob0	cmudstze0017y12ernuvc8hwd	cmr9bvs9c003mnjjl66ggue09	24GB	2026-09-23 07:46:08.62	2026-09-23 07:46:08.62
cmudstze3018112eru1crtadf	cmudstze0017y12ernuvc8hwd	cmr9bvs9c003nnjjldprfoq71	GDDR6	2026-09-23 07:46:08.62	2026-09-23 07:46:08.62
cmudstze4018212ermlsjly49	cmudstze0017y12ernuvc8hwd	cmr9bvs9c003onjjl73rcf6jj	Intel Arc	2026-09-23 07:46:08.62	2026-09-23 07:46:08.62
cmudstze4018312erc78a6sos	cmudstze0017y12ernuvc8hwd	cmr9fdu38000zznc8rwpfa7k5	3 Years	2026-09-23 07:46:08.62	2026-09-23 07:46:08.62
cmudstzeh018b12er2sa6daue	cmudstzec018912er97ygzvar	cmr9bvs9c003mnjjl66ggue09	24GB	2026-09-23 07:46:08.634	2026-09-23 07:46:08.634
cmudstzeh018c12er06nt11kc	cmudstzec018912er97ygzvar	cmr9bvs9c003nnjjldprfoq71	GDDR6	2026-09-23 07:46:08.634	2026-09-23 07:46:08.634
cmudstzeh018d12er7nw1n4i7	cmudstzec018912er97ygzvar	cmr9bvs9c003onjjl73rcf6jj	Intel Arc	2026-09-23 07:46:08.634	2026-09-23 07:46:08.634
cmudstzeh018e12era5w6ddyq	cmudstzec018912er97ygzvar	cmr9fdu38000zznc8rwpfa7k5	3 Years	2026-09-23 07:46:08.634	2026-09-23 07:46:08.634
cmudstzex018m12erixgy2uvp	cmudstzes018k12erx3bms20o	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.649	2026-09-23 07:46:08.649
cmudstzex018n12ervcqdwj55	cmudstzes018k12erx3bms20o	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.649	2026-09-23 07:46:08.649
cmudstzex018o12er1medqada	cmudstzes018k12erx3bms20o	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.649	2026-09-23 07:46:08.649
cmudstzex018p12erg74v257h	cmudstzes018k12erx3bms20o	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.649	2026-09-23 07:46:08.649
cmudstzex018q12ers5vagsbw	cmudstzes018k12erx3bms20o	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.649	2026-09-23 07:46:08.649
cmudstzfd018z12err2ggxft7	cmudstzf7018x12erpk4p5qmb	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:08.666	2026-09-23 07:46:08.666
cmudstzfd019012er82t5zfpt	cmudstzf7018x12erpk4p5qmb	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.666	2026-09-23 07:46:08.666
cmudstzfd019112erl7rt5l2s	cmudstzf7018x12erpk4p5qmb	cmudstm2g001jbeo3hdbgmfpi	28 Gbps, Memory Interface: 128-bit	2026-09-23 07:46:08.666	2026-09-23 07:46:08.666
cmudstzfd019212erjn3egpfs	cmudstzf7018x12erpk4p5qmb	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.666	2026-09-23 07:46:08.666
cmudstzfd019312er64zlq9i8	cmudstzf7018x12erpk4p5qmb	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.666	2026-09-23 07:46:08.666
cmudstzfd019412er5lfjs3gg	cmudstzf7018x12erpk4p5qmb	cmudstm2z0029beo3kz24pu2r	128-bit	2026-09-23 07:46:08.666	2026-09-23 07:46:08.666
cmudstzfd019512er8a6s8vwy	cmudstzf7018x12erpk4p5qmb	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.666	2026-09-23 07:46:08.666
cmudstzft019f12ernnblkauy	cmudstzfo019d12erchqdrufn	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.681	2026-09-23 07:46:08.681
cmudstzft019g12erj5cs7yk7	cmudstzfo019d12erchqdrufn	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.681	2026-09-23 07:46:08.681
cmudstzft019h12erlbh4qq11	cmudstzfo019d12erchqdrufn	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.681	2026-09-23 07:46:08.681
cmudstzft019i12erciboym2d	cmudstzfo019d12erchqdrufn	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.681	2026-09-23 07:46:08.681
cmudstzft019j12erlabtvoyw	cmudstzfo019d12erchqdrufn	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.681	2026-09-23 07:46:08.681
cmudstzg9019s12erlb7yed25	cmudstzg3019q12erataxvytx	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:08.697	2026-09-23 07:46:08.697
cmudstzg9019t12er7vfmtgfd	cmudstzg3019q12erataxvytx	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.697	2026-09-23 07:46:08.697
cmudstzg9019u12erncxxpe22	cmudstzg3019q12erataxvytx	cmudstm2g001jbeo3hdbgmfpi	28Gbps	2026-09-23 07:46:08.697	2026-09-23 07:46:08.697
cmudstzg9019v12ers9zqhwfh	cmudstzg3019q12erataxvytx	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.697	2026-09-23 07:46:08.697
cmudstzg9019w12ersjyhd47e	cmudstzg3019q12erataxvytx	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.697	2026-09-23 07:46:08.697
cmudstzg9019x12er6is6ft4i	cmudstzg3019q12erataxvytx	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.697	2026-09-23 07:46:08.697
cmudstzgo01a612er3p6642a8	cmudstzgj01a412er9tfgr32t	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.712	2026-09-23 07:46:08.712
cmudstzgo01a712erhl0a2i3h	cmudstzgj01a412er9tfgr32t	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.712	2026-09-23 07:46:08.712
cmudstzgo01a812erehb4bjca	cmudstzgj01a412er9tfgr32t	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.712	2026-09-23 07:46:08.712
cmudstzgo01a912ervmz6d13x	cmudstzgj01a412er9tfgr32t	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.712	2026-09-23 07:46:08.712
cmudstzgo01aa12er4byn8ikf	cmudstzgj01a412er9tfgr32t	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.712	2026-09-23 07:46:08.712
cmudstzh401aj12er9wiyzec0	cmudstzgy01ah12eriipzmrn6	cmudstm34002lbeo3xl0fg6dd	907016GB	2026-09-23 07:46:08.728	2026-09-23 07:46:08.728
cmudstzh401ak12er149a0p8b	cmudstzgy01ah12eriipzmrn6	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.728	2026-09-23 07:46:08.728
cmudstzh401al12er9q0da8o4	cmudstzgy01ah12eriipzmrn6	cmudstm36002rbeo3girfb892	Up to 2070MHz(Game)/ 2520MHz(Boost)	2026-09-23 07:46:08.728	2026-09-23 07:46:08.728
cmudstzh401am12er1dok3j7t	cmudstzgy01ah12eriipzmrn6	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.728	2026-09-23 07:46:08.728
cmudstzh401an12er3lcojy82	cmudstzgy01ah12eriipzmrn6	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.728	2026-09-23 07:46:08.728
cmudstzh401ao12er1ie6jk34	cmudstzgy01ah12eriipzmrn6	cmudstm3h003jbeo3wzjjjwu9	256-bit	2026-09-23 07:46:08.728	2026-09-23 07:46:08.728
cmudstzh401ap12erhad7ok2s	cmudstzgy01ah12eriipzmrn6	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.728	2026-09-23 07:46:08.728
cmudstzhk01az12erv9mhnmve	cmudstzhe01ax12ere1960uiw	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:08.745	2026-09-23 07:46:08.745
cmudstzhk01b012er4w8te627	cmudstzhe01ax12ere1960uiw	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.745	2026-09-23 07:46:08.745
cmudstzhk01b112eratlewiic	cmudstzhe01ax12ere1960uiw	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:08.745	2026-09-23 07:46:08.745
cmudstzhk01b212er4x673keh	cmudstzhe01ax12ere1960uiw	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.745	2026-09-23 07:46:08.745
cmudstzhk01b312er1efoubxm	cmudstzhe01ax12ere1960uiw	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.745	2026-09-23 07:46:08.745
cmudstzhk01b412er0n4uhkrj	cmudstzhe01ax12ere1960uiw	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.745	2026-09-23 07:46:08.745
cmudstzi001bd12ersfehstzt	cmudstzhv01bb12er9i96blt7	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:08.761	2026-09-23 07:46:08.761
cmudstzi001be12erwlps06kw	cmudstzhv01bb12er9i96blt7	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.761	2026-09-23 07:46:08.761
cmudstzi001bf12er0r9ezv0c	cmudstzhv01bb12er9i96blt7	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.761	2026-09-23 07:46:08.761
cmudstzi001bg12er2evnlfkg	cmudstzhv01bb12er9i96blt7	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.761	2026-09-23 07:46:08.761
cmudstzi001bh12errje9q1lv	cmudstzhv01bb12er9i96blt7	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.761	2026-09-23 07:46:08.761
cmudstzig01bq12ert5z1l0l8	cmudstzia01bo12ereabm993p	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:08.776	2026-09-23 07:46:08.776
cmudstzig01br12er7hwsybh7	cmudstzia01bo12ereabm993p	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.776	2026-09-23 07:46:08.776
cmudstzig01bs12erqek6lp7p	cmudstzia01bo12ereabm993p	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:08.776	2026-09-23 07:46:08.776
cmudstzig01bt12erwdh3xfsb	cmudstzia01bo12ereabm993p	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.776	2026-09-23 07:46:08.776
cmudstzig01bu12ered06xfvl	cmudstzia01bo12ereabm993p	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.776	2026-09-23 07:46:08.776
cmudstzig01bv12ercpuqpsn3	cmudstzia01bo12ereabm993p	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.776	2026-09-23 07:46:08.776
cmudstziw01c412ervjpbcg24	cmudstzir01c212erq9mokixe	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:08.792	2026-09-23 07:46:08.792
cmudstziw01c512erqdjne4qm	cmudstzir01c212erq9mokixe	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.792	2026-09-23 07:46:08.792
cmudstziw01c612ery9mtg3em	cmudstzir01c212erq9mokixe	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:08.792	2026-09-23 07:46:08.792
cmudstziw01c712er2zvbm6lt	cmudstzir01c212erq9mokixe	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.792	2026-09-23 07:46:08.792
cmudstziw01c812er87d9ud5o	cmudstzir01c212erq9mokixe	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.792	2026-09-23 07:46:08.792
cmudstziw01c912erfbxoplwg	cmudstzir01c212erq9mokixe	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.792	2026-09-23 07:46:08.792
cmudstzjb01ci12er2g40v9j8	cmudstzj601cg12ercrpsikef	cmudstm2d001bbeo3ads0c96h	12GB	2026-09-23 07:46:08.807	2026-09-23 07:46:08.807
cmudstzjb01cj12erz9yqsi4b	cmudstzj601cg12ercrpsikef	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.807	2026-09-23 07:46:08.807
cmudstzjb01ck12ermxaj6eff	cmudstzj601cg12ercrpsikef	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:08.807	2026-09-23 07:46:08.807
cmudstzjb01cl12erxb3jcbpx	cmudstzj601cg12ercrpsikef	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.807	2026-09-23 07:46:08.807
cmudstzjb01cm12er9auwfhik	cmudstzj601cg12ercrpsikef	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.807	2026-09-23 07:46:08.807
cmudstzjb01cn12er2cp3eimc	cmudstzj601cg12ercrpsikef	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.807	2026-09-23 07:46:08.807
cmudstzjq01cw12er3blx7rpg	cmudstzjl01cu12eruag88lcs	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:08.822	2026-09-23 07:46:08.822
cmudstzjq01cx12erlx7odejn	cmudstzjl01cu12eruag88lcs	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.822	2026-09-23 07:46:08.822
cmudstzjq01cy12erz8xbkl65	cmudstzjl01cu12eruag88lcs	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:08.822	2026-09-23 07:46:08.822
cmudstzjq01cz12erzz2tr3wk	cmudstzjl01cu12eruag88lcs	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.822	2026-09-23 07:46:08.822
cmudstzjq01d012er8sbagq6j	cmudstzjl01cu12eruag88lcs	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.822	2026-09-23 07:46:08.822
cmudstzjq01d112ervjy8hv4f	cmudstzjl01cu12eruag88lcs	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.822	2026-09-23 07:46:08.822
cmudstzk501da12erx2rhufs1	cmudstzk001d812erzzl2l6h9	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:08.837	2026-09-23 07:46:08.837
cmudstzk501db12ersi4dw68d	cmudstzk001d812erzzl2l6h9	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.837	2026-09-23 07:46:08.837
cmudstzk501dc12erkx99z57i	cmudstzk001d812erzzl2l6h9	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:08.837	2026-09-23 07:46:08.837
cmudstzk501dd12ergdg3nsem	cmudstzk001d812erzzl2l6h9	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.837	2026-09-23 07:46:08.837
cmudstzk501de12er8t1h3cha	cmudstzk001d812erzzl2l6h9	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.837	2026-09-23 07:46:08.837
cmudstzk501df12er0szj0qp6	cmudstzk001d812erzzl2l6h9	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.837	2026-09-23 07:46:08.837
cmudstzkl01do12erz0ie2l4x	cmudstzkf01dm12erkk556u7h	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.854	2026-09-23 07:46:08.854
cmudstzkl01dp12erhvq0nmik	cmudstzkf01dm12erkk556u7h	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.854	2026-09-23 07:46:08.854
cmudstzkl01dq12erjrj5keec	cmudstzkf01dm12erkk556u7h	cmudstm36002rbeo3girfb892	Up to 2400MHz(Game)/ 2970MHz(Boost)	2026-09-23 07:46:08.854	2026-09-23 07:46:08.854
cmudstzkl01dr12eruew4piw3	cmudstzkf01dm12erkk556u7h	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.854	2026-09-23 07:46:08.854
cmudstzkl01ds12ern6g8k6fc	cmudstzkf01dm12erkk556u7h	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.854	2026-09-23 07:46:08.854
cmudstzkl01dt12erv8ruc9km	cmudstzkf01dm12erkk556u7h	cmudstm3h003jbeo3wzjjjwu9	256-bit	2026-09-23 07:46:08.854	2026-09-23 07:46:08.854
cmudstzkl01du12erklxt4sow	cmudstzkf01dm12erkk556u7h	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.854	2026-09-23 07:46:08.854
cmudstzl201e412ermjc7q6pe	cmudstzkx01e212er7m0brwga	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:08.871	2026-09-23 07:46:08.871
cmudstzl201e512errqs4mx5e	cmudstzkx01e212er7m0brwga	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.871	2026-09-23 07:46:08.871
cmudstzl201e612erc43mrod1	cmudstzkx01e212er7m0brwga	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.871	2026-09-23 07:46:08.871
cmudstzl201e712er2xfsflq3	cmudstzkx01e212er7m0brwga	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.871	2026-09-23 07:46:08.871
cmudstzl201e812erzn35unwn	cmudstzkx01e212er7m0brwga	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.871	2026-09-23 07:46:08.871
cmudstzlg01eh12erj7tsxjre	cmudstzlb01ef12erxgf3pcsm	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.885	2026-09-23 07:46:08.885
cmudstzlg01ei12er2iz4l9vy	cmudstzlb01ef12erxgf3pcsm	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.885	2026-09-23 07:46:08.885
cmudstzlg01ej12er1s15klyz	cmudstzlb01ef12erxgf3pcsm	cmudstm37002tbeo3rwfz92f9	20 Gbps Effective	2026-09-23 07:46:08.885	2026-09-23 07:46:08.885
cmudstzlg01ek12ererwbo68t	cmudstzlb01ef12erxgf3pcsm	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.885	2026-09-23 07:46:08.885
cmudstzlg01el12er5jfgyqzm	cmudstzlb01ef12erxgf3pcsm	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.885	2026-09-23 07:46:08.885
cmudstzlg01em12er99gzpg49	cmudstzlb01ef12erxgf3pcsm	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.885	2026-09-23 07:46:08.885
cmudstzlw01ev12er7y450a2e	cmudstzlq01et12erk9q77njv	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:08.9	2026-09-23 07:46:08.9
cmudstzlw01ew12ersh4fhwhw	cmudstzlq01et12erk9q77njv	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.9	2026-09-23 07:46:08.9
cmudstzlw01ex12erydec6siw	cmudstzlq01et12erk9q77njv	cmudstm2g001hbeo3trkzbee8	2602 MHz (Boost Clock)	2026-09-23 07:46:08.9	2026-09-23 07:46:08.9
cmudstzlw01ey12erkkkyoj2v	cmudstzlq01et12erk9q77njv	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.9	2026-09-23 07:46:08.9
cmudstzlw01ez12erqxoca97t	cmudstzlq01et12erk9q77njv	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.9	2026-09-23 07:46:08.9
cmudstzlw01f012erp161iffp	cmudstzlq01et12erk9q77njv	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.9	2026-09-23 07:46:08.9
cmudstzm901f912erjw5dp0vt	cmudstzm501f712erihhn7ome	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.914	2026-09-23 07:46:08.914
cmudstzm901fa12erl3ztbx7r	cmudstzm501f712erihhn7ome	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.914	2026-09-23 07:46:08.914
cmudstzm901fb12er9xiorpz5	cmudstzm501f712erihhn7ome	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.914	2026-09-23 07:46:08.914
cmudstzm901fc12erunezu1mb	cmudstzm501f712erihhn7ome	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.914	2026-09-23 07:46:08.914
cmudstzm901fd12erh1aqo1p4	cmudstzm501f712erihhn7ome	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.914	2026-09-23 07:46:08.914
cmudstzmo01fm12er4obrtg9r	cmudstzmi01fk12erm3v2fgda	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:08.929	2026-09-23 07:46:08.929
cmudstzmo01fn12erci6jbric	cmudstzmi01fk12erm3v2fgda	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:08.929	2026-09-23 07:46:08.929
cmudstzmo01fo12erxmga8mi8	cmudstzmi01fk12erm3v2fgda	cmudstm36002rbeo3girfb892	Up to 2460MHz(Game)/ 3010MHz(Boost)	2026-09-23 07:46:08.929	2026-09-23 07:46:08.929
cmudstzmo01fp12er32mebgxf	cmudstzmi01fk12erm3v2fgda	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:08.929	2026-09-23 07:46:08.929
cmudstzmo01fq12ergqxzbuyo	cmudstzmi01fk12erm3v2fgda	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:08.929	2026-09-23 07:46:08.929
cmudstzmo01fr12erb5ae3zdd	cmudstzmi01fk12erm3v2fgda	cmudstm3h003jbeo3wzjjjwu9	256-bit	2026-09-23 07:46:08.929	2026-09-23 07:46:08.929
cmudstzmo01fs12eryx3jbb4u	cmudstzmi01fk12erm3v2fgda	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:08.929	2026-09-23 07:46:08.929
cmudstzn401g212erte6dy06p	cmudstzmz01g012erery6dxfo	cmudstm2d001bbeo3ads0c96h	12GB	2026-09-23 07:46:08.945	2026-09-23 07:46:08.945
cmudstzn401g312erm0ojq8ec	cmudstzmz01g012erery6dxfo	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.945	2026-09-23 07:46:08.945
cmudstzn401g412erbzemnn3k	cmudstzmz01g012erery6dxfo	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:08.945	2026-09-23 07:46:08.945
cmudstzn401g512ervkwpxqzg	cmudstzmz01g012erery6dxfo	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.945	2026-09-23 07:46:08.945
cmudstzn401g612eryvwzp835	cmudstzmz01g012erery6dxfo	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.945	2026-09-23 07:46:08.945
cmudstzn401g712erjjcbzpnl	cmudstzmz01g012erery6dxfo	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.945	2026-09-23 07:46:08.945
cmudstznk01gg12ercqxcky2y	cmudstznd01ge12er1kclmirs	cmudstm2d001bbeo3ads0c96h	12GB	2026-09-23 07:46:08.96	2026-09-23 07:46:08.96
cmudstznk01gh12erf702uyb2	cmudstznd01ge12er1kclmirs	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.96	2026-09-23 07:46:08.96
cmudstznk01gi12erye25ggbz	cmudstznd01ge12er1kclmirs	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:08.96	2026-09-23 07:46:08.96
cmudstznk01gj12er458vax6h	cmudstznd01ge12er1kclmirs	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.96	2026-09-23 07:46:08.96
cmudstznk01gk12ereznsrgk1	cmudstznd01ge12er1kclmirs	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.96	2026-09-23 07:46:08.96
cmudstznk01gl12ers84x7a7i	cmudstznd01ge12er1kclmirs	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.96	2026-09-23 07:46:08.96
cmudstzo301gu12er98zyrrzm	cmudstznw01gs12errl0d3y40	cmudstm2d001bbeo3ads0c96h	12GB	2026-09-23 07:46:08.979	2026-09-23 07:46:08.979
cmudstzo301gv12er977m6ets	cmudstznw01gs12errl0d3y40	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:08.979	2026-09-23 07:46:08.979
cmudstzo301gw12ergx3c39hp	cmudstznw01gs12errl0d3y40	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:08.979	2026-09-23 07:46:08.979
cmudstzo301gx12ery27vepnm	cmudstznw01gs12errl0d3y40	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:08.979	2026-09-23 07:46:08.979
cmudstzo301gy12erhqbm3rsq	cmudstznw01gs12errl0d3y40	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:08.979	2026-09-23 07:46:08.979
cmudstzo301gz12ered1r8jqi	cmudstznw01gs12errl0d3y40	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:08.979	2026-09-23 07:46:08.979
cmudstzon01h812erl85pa2ic	cmudstzof01h612er2qhjwjzc	cmudstm2d001bbeo3ads0c96h	12GB	2026-09-23 07:46:09	2026-09-23 07:46:09
cmudstzon01h912er0aquxsmk	cmudstzof01h612er2qhjwjzc	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09	2026-09-23 07:46:09
cmudstzoo01ha12er6y13k7wh	cmudstzof01h612er2qhjwjzc	cmudstm2g001hbeo3trkzbee8	2542 MHz	2026-09-23 07:46:09	2026-09-23 07:46:09
cmudstzoo01hb12ervmwg7ioz	cmudstzof01h612er2qhjwjzc	cmudstm2g001jbeo3hdbgmfpi	28 Gbps, Memory Bus: 192-bit	2026-09-23 07:46:09	2026-09-23 07:46:09
cmudstzoo01hc12erszgaplnd	cmudstzof01h612er2qhjwjzc	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09	2026-09-23 07:46:09
cmudstzoo01hd12er0lh9qohc	cmudstzof01h612er2qhjwjzc	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09	2026-09-23 07:46:09
cmudstzoo01he12erk66g8cmv	cmudstzof01h612er2qhjwjzc	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09	2026-09-23 07:46:09
cmudstzp401hn12ers9bv8j70	cmudstzoz01hl12eroy275st3	cmudstm2d001bbeo3ads0c96h	12GB	2026-09-23 07:46:09.017	2026-09-23 07:46:09.017
cmudstzp401ho12ermusfbqyc	cmudstzoz01hl12eroy275st3	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.017	2026-09-23 07:46:09.017
cmudstzp401hp12erf3y7yqdy	cmudstzoz01hl12eroy275st3	cmudstm2g001jbeo3hdbgmfpi	28Gbps, Memory Bus: 192bit	2026-09-23 07:46:09.017	2026-09-23 07:46:09.017
cmudstzp401hq12erpv6sm65b	cmudstzoz01hl12eroy275st3	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.017	2026-09-23 07:46:09.017
cmudstzp501hr12erah697fub	cmudstzoz01hl12eroy275st3	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.017	2026-09-23 07:46:09.017
cmudstzp501hs12erku6oxe0z	cmudstzoz01hl12eroy275st3	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.017	2026-09-23 07:46:09.017
cmudstzpj01i112er3h57zpkn	cmudstzpe01hz12erbyr7pfgz	cmudstm2d001bbeo3ads0c96h	12GB	2026-09-23 07:46:09.032	2026-09-23 07:46:09.032
cmudstzpk01i212erutarw2n6	cmudstzpe01hz12erbyr7pfgz	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.032	2026-09-23 07:46:09.032
cmudstzpk01i312ereppmmrwt	cmudstzpe01hz12erbyr7pfgz	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:09.032	2026-09-23 07:46:09.032
cmudstzpk01i412erdpyxtei4	cmudstzpe01hz12erbyr7pfgz	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.032	2026-09-23 07:46:09.032
cmudstzpk01i512erqub4rr77	cmudstzpe01hz12erbyr7pfgz	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.032	2026-09-23 07:46:09.032
cmudstzpk01i612erg5ivfal4	cmudstzpe01hz12erbyr7pfgz	cmudstm2z0029beo3kz24pu2r	192-bit	2026-09-23 07:46:09.032	2026-09-23 07:46:09.032
cmudstzpk01i712ern8d9pf3e	cmudstzpe01hz12erbyr7pfgz	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.032	2026-09-23 07:46:09.032
cmudstzpz01ih12er6mp84a2y	cmudstzpu01if12eroji3dv7a	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.047	2026-09-23 07:46:09.047
cmudstzpz01ii12ero6b2zmyx	cmudstzpu01if12eroji3dv7a	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:09.047	2026-09-23 07:46:09.047
cmudstzpz01ij12ereebnf6tq	cmudstzpu01if12eroji3dv7a	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.047	2026-09-23 07:46:09.047
cmudstzpz01ik12ersum8wldj	cmudstzpu01if12eroji3dv7a	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.047	2026-09-23 07:46:09.047
cmudstzpz01il12ern6weybkl	cmudstzpu01if12eroji3dv7a	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.047	2026-09-23 07:46:09.047
cmudstzqc01it12erdg0l6jlb	cmudstzq701ir12erp50lts1d	cmudstm2d001bbeo3ads0c96h	507012GB	2026-09-23 07:46:09.06	2026-09-23 07:46:09.06
cmudstzqc01iu12eri9na6dwe	cmudstzq701ir12erp50lts1d	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.06	2026-09-23 07:46:09.06
cmudstzqc01iv12erbzc258ak	cmudstzq701ir12erp50lts1d	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.06	2026-09-23 07:46:09.06
cmudstzqc01iw12eroxsmhbhs	cmudstzq701ir12erp50lts1d	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.06	2026-09-23 07:46:09.06
cmudstzqc01ix12erg93auy9t	cmudstzq701ir12erp50lts1d	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.06	2026-09-23 07:46:09.06
cmudstzqr01j612erbom5rb2w	cmudstzql01j412er75wrt7og	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:09.076	2026-09-23 07:46:09.076
cmudstzqr01j712er25kfr4lr	cmudstzql01j412er75wrt7og	cmudstm2f001fbeo3dv8f5emy	GDDR6X	2026-09-23 07:46:09.076	2026-09-23 07:46:09.076
cmudstzqr01j812er6s4dwzy8	cmudstzql01j412er75wrt7og	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.076	2026-09-23 07:46:09.076
cmudstzqr01j912erg7u5a16n	cmudstzql01j412er75wrt7og	cmudstm2k001tbeo3xb2hvl5l	RTX 4000	2026-09-23 07:46:09.076	2026-09-23 07:46:09.076
cmudstzqr01ja12er1qj76gva	cmudstzql01j412er75wrt7og	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.076	2026-09-23 07:46:09.076
cmudstzr701jj12erek6p8109	cmudstzr101jh12er86uz6aws	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:09.091	2026-09-23 07:46:09.091
cmudstzr701jk12eroz7nchep	cmudstzr101jh12er86uz6aws	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.091	2026-09-23 07:46:09.091
cmudstzr701jl12erivofxdz0	cmudstzr101jh12er86uz6aws	cmudstm2g001hbeo3trkzbee8	2527MHz (OC) ; Boost: 2497MHz	2026-09-23 07:46:09.091	2026-09-23 07:46:09.091
cmudstzr701jm12er6t1e2feu	cmudstzr101jh12er86uz6aws	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.091	2026-09-23 07:46:09.091
cmudstzr701jn12erqzvs10g1	cmudstzr101jh12er86uz6aws	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.091	2026-09-23 07:46:09.091
cmudstzr701jo12erhs0wst8q	cmudstzr101jh12er86uz6aws	cmudstm2z0029beo3kz24pu2r	Native DP 2.1b x3, Native HDMI 2.1b x1	2026-09-23 07:46:09.091	2026-09-23 07:46:09.091
cmudstzr701jp12erhd9gdci6	cmudstzr101jh12er86uz6aws	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.091	2026-09-23 07:46:09.091
cmudstzrm01jz12erjqxzyjph	cmudstzrh01jx12erzg8f4cq3	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:09.107	2026-09-23 07:46:09.107
cmudstzrm01k012eri945uijl	cmudstzrh01jx12erzg8f4cq3	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.107	2026-09-23 07:46:09.107
cmudstzrm01k112er2oue2yjq	cmudstzrh01jx12erzg8f4cq3	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:09.107	2026-09-23 07:46:09.107
cmudstzrm01k212er7t1v9goo	cmudstzrh01jx12erzg8f4cq3	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.107	2026-09-23 07:46:09.107
cmudstzrm01k312erzs8bkz42	cmudstzrh01jx12erzg8f4cq3	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.107	2026-09-23 07:46:09.107
cmudstzrm01k412er1n295peg	cmudstzrh01jx12erzg8f4cq3	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.107	2026-09-23 07:46:09.107
cmudstzs101kd12errc9civ1e	cmudstzrw01kb12err5pb40z9	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:09.122	2026-09-23 07:46:09.122
cmudstzs101ke12ers1uuar8y	cmudstzrw01kb12err5pb40z9	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.122	2026-09-23 07:46:09.122
cmudstzs101kf12erad1ainvk	cmudstzrw01kb12err5pb40z9	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:09.122	2026-09-23 07:46:09.122
cmudstzs101kg12ervyzadbz2	cmudstzrw01kb12err5pb40z9	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.122	2026-09-23 07:46:09.122
cmudstzs101kh12erfiep8ee8	cmudstzrw01kb12err5pb40z9	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.122	2026-09-23 07:46:09.122
cmudstzs101ki12eriaz4li75	cmudstzrw01kb12err5pb40z9	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.122	2026-09-23 07:46:09.122
cmudstzsf01kr12erxczq49lq	cmudstzsb01kp12erobt9aza6	cmr9bvs9c003mnjjl66ggue09	32GB	2026-09-23 07:46:09.136	2026-09-23 07:46:09.136
cmudstzsf01ks12ergumq76qz	cmudstzsb01kp12erobt9aza6	cmr9bvs9c003nnjjldprfoq71	GDDR6	2026-09-23 07:46:09.136	2026-09-23 07:46:09.136
cmudstzsf01kt12ercv6rn0hi	cmudstzsb01kp12erobt9aza6	cmr9bvs9c003onjjl73rcf6jj	Intel Arc	2026-09-23 07:46:09.136	2026-09-23 07:46:09.136
cmudstzsf01ku12eryvzxnup8	cmudstzsb01kp12erobt9aza6	cmr9fdu38000zznc8rwpfa7k5	3 Years	2026-09-23 07:46:09.136	2026-09-23 07:46:09.136
cmudstzss01l212erqqmcvj66	cmudstzsn01l012erraic6411	cmr9bvs9c003mnjjl66ggue09	32GB	2026-09-23 07:46:09.149	2026-09-23 07:46:09.149
cmudstzss01l312er5izjteqv	cmudstzsn01l012erraic6411	cmr9bvs9c003nnjjldprfoq71	GDDR6	2026-09-23 07:46:09.149	2026-09-23 07:46:09.149
cmudstzss01l412erq1j5ji75	cmudstzsn01l012erraic6411	cmr9bvs9c003onjjl73rcf6jj	Intel Arc	2026-09-23 07:46:09.149	2026-09-23 07:46:09.149
cmudstzss01l512ereohizjsx	cmudstzsn01l012erraic6411	cmr9fdu38000zznc8rwpfa7k5	3 Years	2026-09-23 07:46:09.149	2026-09-23 07:46:09.149
cmudstzt601ld12er9x8a3zvo	cmudstzt101lb12eroaxmkvgp	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:09.163	2026-09-23 07:46:09.163
cmudstzt601le12erd2mzsdy6	cmudstzt101lb12eroaxmkvgp	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.163	2026-09-23 07:46:09.163
cmudstzt601lf12er297liwiy	cmudstzt101lb12eroaxmkvgp	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:09.163	2026-09-23 07:46:09.163
cmudstzt601lg12erjgwgjwjy	cmudstzt101lb12eroaxmkvgp	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.163	2026-09-23 07:46:09.163
cmudstzt601lh12erh09g4oki	cmudstzt101lb12eroaxmkvgp	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.163	2026-09-23 07:46:09.163
cmudstzt601li12erq1ucx36m	cmudstzt101lb12eroaxmkvgp	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.163	2026-09-23 07:46:09.163
cmudstztj01lr12ervxqy74zr	cmudstztf01lp12erd4lgovn1	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:09.176	2026-09-23 07:46:09.176
cmudstztj01ls12eriszmk6s9	cmudstztf01lp12erd4lgovn1	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.176	2026-09-23 07:46:09.176
cmudstztj01lt12er37vzpfub	cmudstztf01lp12erd4lgovn1	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.176	2026-09-23 07:46:09.176
cmudstztj01lu12eryrskbp1u	cmudstztf01lp12erd4lgovn1	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.176	2026-09-23 07:46:09.176
cmudstztj01lv12erayyz0p8p	cmudstztf01lp12erd4lgovn1	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.176	2026-09-23 07:46:09.176
cmudstzu001m412eroyp6b7et	cmudstztv01m212ervmhfad1h	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:09.192	2026-09-23 07:46:09.192
cmudstzu001m512errookbh6h	cmudstztv01m212ervmhfad1h	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.192	2026-09-23 07:46:09.192
cmudstzu001m612erh1wjikbl	cmudstztv01m212ervmhfad1h	cmudstm2g001jbeo3hdbgmfpi	30 Gbps	2026-09-23 07:46:09.192	2026-09-23 07:46:09.192
cmudstzu001m712er5wn6z84h	cmudstztv01m212ervmhfad1h	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.192	2026-09-23 07:46:09.192
cmudstzu001m812erv14ixpw0	cmudstztv01m212ervmhfad1h	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.192	2026-09-23 07:46:09.192
cmudstzu001m912ertz1i1qkh	cmudstztv01m212ervmhfad1h	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.192	2026-09-23 07:46:09.192
cmudstzuf01mi12er5lul7zo8	cmudstzua01mg12er0pl1nqop	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:09.208	2026-09-23 07:46:09.208
cmudstzuf01mj12eryayrdrdl	cmudstzua01mg12er0pl1nqop	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.208	2026-09-23 07:46:09.208
cmudstzuf01mk12erakz793pw	cmudstzua01mg12er0pl1nqop	cmudstm2g001jbeo3hdbgmfpi	30 Gbps	2026-09-23 07:46:09.208	2026-09-23 07:46:09.208
cmudstzuf01ml12eroth2o7ki	cmudstzua01mg12er0pl1nqop	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.208	2026-09-23 07:46:09.208
cmudstzuf01mm12err8dlor8n	cmudstzua01mg12er0pl1nqop	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.208	2026-09-23 07:46:09.208
cmudstzuf01mn12eriv6yi1ml	cmudstzua01mg12er0pl1nqop	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.208	2026-09-23 07:46:09.208
cmudstzuu01mw12ersmvxcj68	cmudstzup01mu12er0nhc0tkn	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:09.222	2026-09-23 07:46:09.222
cmudstzuu01mx12eruf4j8ioz	cmudstzup01mu12er0nhc0tkn	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.222	2026-09-23 07:46:09.222
cmudstzuu01my12erm7jlsqct	cmudstzup01mu12er0nhc0tkn	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:09.222	2026-09-23 07:46:09.222
cmudstzuu01mz12ertm97yrs1	cmudstzup01mu12er0nhc0tkn	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.222	2026-09-23 07:46:09.222
cmudstzuu01n012eri4u2nn8i	cmudstzup01mu12er0nhc0tkn	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.222	2026-09-23 07:46:09.222
cmudstzuu01n112ersbw4grdl	cmudstzup01mu12er0nhc0tkn	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.222	2026-09-23 07:46:09.222
cmudstzv801na12er5bim6hmn	cmudstzv301n812er596pukvk	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:09.236	2026-09-23 07:46:09.236
cmudstzv801nb12era1vg2utx	cmudstzv301n812er596pukvk	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.236	2026-09-23 07:46:09.236
cmudstzv801nc12erfoi8y7mk	cmudstzv301n812er596pukvk	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.236	2026-09-23 07:46:09.236
cmudstzv801nd12ervufafa0r	cmudstzv301n812er596pukvk	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.236	2026-09-23 07:46:09.236
cmudstzv801ne12erjcz8d97i	cmudstzv301n812er596pukvk	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.236	2026-09-23 07:46:09.236
cmudstzvl01nn12er8v7zdbch	cmudstzvg01nl12eroeblmad2	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:09.249	2026-09-23 07:46:09.249
cmudstzvl01no12er6jgk1wrf	cmudstzvg01nl12eroeblmad2	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.249	2026-09-23 07:46:09.249
cmudstzvl01np12er91vdle6t	cmudstzvg01nl12eroeblmad2	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.249	2026-09-23 07:46:09.249
cmudstzvl01nq12ersd22vvqv	cmudstzvg01nl12eroeblmad2	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.249	2026-09-23 07:46:09.249
cmudstzvl01nr12er6t8abqw2	cmudstzvg01nl12eroeblmad2	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.249	2026-09-23 07:46:09.249
cmudstzvz01o012ereffo9ft1	cmudstzvu01ny12erg8x8ci18	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:09.264	2026-09-23 07:46:09.264
cmudstzvz01o112era5nr0kbh	cmudstzvu01ny12erg8x8ci18	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.264	2026-09-23 07:46:09.264
cmudstzvz01o212ervvrtc8jq	cmudstzvu01ny12erg8x8ci18	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.264	2026-09-23 07:46:09.264
cmudstzvz01o312er6s4w29ay	cmudstzvu01ny12erg8x8ci18	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.264	2026-09-23 07:46:09.264
cmudstzvz01o412erxdyhrzdy	cmudstzvu01ny12erg8x8ci18	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.264	2026-09-23 07:46:09.264
cmudstzwe01od12eruwog9c01	cmudstzw801ob12er1t56gejd	cmudstm34002lbeo3xl0fg6dd	970032GB	2026-09-23 07:46:09.278	2026-09-23 07:46:09.278
cmudstzwe01oe12er2f5er1zq	cmudstzw801ob12er1t56gejd	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:09.278	2026-09-23 07:46:09.278
cmudstzwe01of12er32utk44d	cmudstzw801ob12er1t56gejd	cmudstm36002rbeo3girfb892	Up to 2350MHz(Game) / 2920MHz(Boost)	2026-09-23 07:46:09.278	2026-09-23 07:46:09.278
cmudstzwe01og12er2l9s31bl	cmudstzw801ob12er1t56gejd	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:09.278	2026-09-23 07:46:09.278
cmudstzwe01oh12er59nu41ww	cmudstzw801ob12er1t56gejd	cmudstm3h003jbeo3wzjjjwu9	256-bit	2026-09-23 07:46:09.278	2026-09-23 07:46:09.278
cmudstzwe01oi12erh04t8yn2	cmudstzw801ob12er1t56gejd	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:09.278	2026-09-23 07:46:09.278
cmudstzwu01or12er90xvcdoh	cmudstzwo01op12er5dxbwwnl	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:09.294	2026-09-23 07:46:09.294
cmudstzwu01os12erlrvlyzdl	cmudstzwo01op12er5dxbwwnl	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.294	2026-09-23 07:46:09.294
cmudstzwu01ot12er1nsod9pn	cmudstzwo01op12er5dxbwwnl	cmudstm2g001jbeo3hdbgmfpi	30 Gbps, Memory Bus: 256 bit	2026-09-23 07:46:09.294	2026-09-23 07:46:09.294
cmudstzwu01ou12er03p8evpo	cmudstzwo01op12er5dxbwwnl	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.294	2026-09-23 07:46:09.294
cmudstzwu01ov12erkp1rjlzd	cmudstzwo01op12er5dxbwwnl	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.294	2026-09-23 07:46:09.294
cmudstzwu01ow12erw5u226rf	cmudstzwo01op12er5dxbwwnl	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.294	2026-09-23 07:46:09.294
cmudstzx801p512er8x8xg7q7	cmudstzx301p312eralcuv53b	cmudstm2d001bbeo3ads0c96h	509032GB	2026-09-23 07:46:09.309	2026-09-23 07:46:09.309
cmudstzx801p612er52f0zhz3	cmudstzx301p312eralcuv53b	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.309	2026-09-23 07:46:09.309
cmudstzx801p712erkrwpckg7	cmudstzx301p312eralcuv53b	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.309	2026-09-23 07:46:09.309
cmudstzx801p812erfrqhowxj	cmudstzx301p312eralcuv53b	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.309	2026-09-23 07:46:09.309
cmudstzx801p912erfhpknznb	cmudstzx301p312eralcuv53b	cmudstm2z0029beo3kz24pu2r	5126-bit	2026-09-23 07:46:09.309	2026-09-23 07:46:09.309
cmudstzx901pa12ery2rz9imz	cmudstzx301p312eralcuv53b	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.309	2026-09-23 07:46:09.309
cmudstzxn01pk12ersa8mdudt	cmudstzxi01pi12erd0ul87b4	cmudstm2d001bbeo3ads0c96h	32GB	2026-09-23 07:46:09.324	2026-09-23 07:46:09.324
cmudstzxn01pl12erq2al6m83	cmudstzxi01pi12erd0ul87b4	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.324	2026-09-23 07:46:09.324
cmudstzxn01pm12ero47bt6r1	cmudstzxi01pi12erd0ul87b4	cmudstm2g001hbeo3trkzbee8	2550 MHz(Boost clock)	2026-09-23 07:46:09.324	2026-09-23 07:46:09.324
cmudstzxn01pn12erwgdjq37z	cmudstzxi01pi12erd0ul87b4	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.324	2026-09-23 07:46:09.324
cmudstzxn01po12erk5wx0g0t	cmudstzxi01pi12erd0ul87b4	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.324	2026-09-23 07:46:09.324
cmudstzxo01pp12erkn0d3jzc	cmudstzxi01pi12erd0ul87b4	cmudstm2z0029beo3kz24pu2r	512-bit	2026-09-23 07:46:09.324	2026-09-23 07:46:09.324
cmudstzxo01pq12erag2nlsx7	cmudstzxi01pi12erd0ul87b4	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.324	2026-09-23 07:46:09.324
cmudstzy301q012erwe6fb1eg	cmudstzxy01py12er4nktmqdf	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:09.339	2026-09-23 07:46:09.339
cmudstzy301q112erprwtxsbv	cmudstzxy01py12er4nktmqdf	cmudstm2f001fbeo3dv8f5emy	GDDR6	2026-09-23 07:46:09.339	2026-09-23 07:46:09.339
cmudstzy301q212erdpficlj7	cmudstzxy01py12er4nktmqdf	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.339	2026-09-23 07:46:09.339
cmudstzy301q312erru8dx68l	cmudstzxy01py12er4nktmqdf	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.339	2026-09-23 07:46:09.339
cmudstzy301q412er6xa4l57e	cmudstzxy01py12er4nktmqdf	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.339	2026-09-23 07:46:09.339
cmudstzyh01qd12er8hgqjaxr	cmudstzyb01qb12ersb7tri9h	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:09.353	2026-09-23 07:46:09.353
cmudstzyh01qe12er8pbc53ey	cmudstzyb01qb12ersb7tri9h	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.353	2026-09-23 07:46:09.353
cmudstzyh01qf12erruto65u2	cmudstzyb01qb12ersb7tri9h	cmudstm2g001hbeo3trkzbee8	2497 MHz	2026-09-23 07:46:09.353	2026-09-23 07:46:09.353
cmudstzyh01qg12erj0h4l8g0	cmudstzyb01qb12ersb7tri9h	cmudstm2g001jbeo3hdbgmfpi	28 Gbps; Bus: 128-bit	2026-09-23 07:46:09.353	2026-09-23 07:46:09.353
cmudstzyh01qh12eruds0828j	cmudstzyb01qb12ersb7tri9h	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.353	2026-09-23 07:46:09.353
cmudstzyh01qi12er7jdqvzye	cmudstzyb01qb12ersb7tri9h	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.353	2026-09-23 07:46:09.353
cmudstzyh01qj12ergzsbm4pg	cmudstzyb01qb12ersb7tri9h	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.353	2026-09-23 07:46:09.353
cmudstzyw01qs12erh661spv5	cmudstzyq01qq12erh9npspv8	cmudstm2d001bbeo3ads0c96h	50608GB	2026-09-23 07:46:09.369	2026-09-23 07:46:09.369
cmudstzyw01qt12eri5er9hia	cmudstzyq01qq12erh9npspv8	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.369	2026-09-23 07:46:09.369
cmudstzyw01qu12erumkeh4ss	cmudstzyq01qq12erh9npspv8	cmudstm2g001hbeo3trkzbee8	2535 MHz (Boost Clock)	2026-09-23 07:46:09.369	2026-09-23 07:46:09.369
cmudstzyw01qv12erc4ym7l31	cmudstzyq01qq12erh9npspv8	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.369	2026-09-23 07:46:09.369
cmudstzyw01qw12ergb7f9fxm	cmudstzyq01qq12erh9npspv8	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.369	2026-09-23 07:46:09.369
cmudstzyw01qx12erjqnaeggx	cmudstzyq01qq12erh9npspv8	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.369	2026-09-23 07:46:09.369
cmudstzzb01r612erme7qxy4m	cmudstzz601r412erqs95tl8n	cmudstm2d001bbeo3ads0c96h	8GB	2026-09-23 07:46:09.384	2026-09-23 07:46:09.384
cmudstzzb01r712erqvmkby3c	cmudstzz601r412erqs95tl8n	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.384	2026-09-23 07:46:09.384
cmudstzzb01r812ermn15u2te	cmudstzz601r412erqs95tl8n	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:09.384	2026-09-23 07:46:09.384
cmudstzzb01r912er0f38mjhd	cmudstzz601r412erqs95tl8n	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.384	2026-09-23 07:46:09.384
cmudstzzb01ra12erznq9p59j	cmudstzz601r412erqs95tl8n	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.384	2026-09-23 07:46:09.384
cmudstzzb01rb12ereu7dz1w6	cmudstzz601r412erqs95tl8n	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.384	2026-09-23 07:46:09.384
cmudstzzs01rk12erttpwgn3w	cmudstzzl01ri12erdzjxpipj	cmudstm2d001bbeo3ads0c96h	12GB	2026-09-23 07:46:09.4	2026-09-23 07:46:09.4
cmudstzzs01rl12erny8tbt9e	cmudstzzl01ri12erdzjxpipj	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.4	2026-09-23 07:46:09.4
cmudstzzs01rm12er3z0udee2	cmudstzzl01ri12erdzjxpipj	cmudstm2g001hbeo3trkzbee8	2542 MHz	2026-09-23 07:46:09.4	2026-09-23 07:46:09.4
cmudstzzs01rn12er5lsur84z	cmudstzzl01ri12erdzjxpipj	cmudstm2g001jbeo3hdbgmfpi	28 Gbps, Memory Bus: 192-bit	2026-09-23 07:46:09.4	2026-09-23 07:46:09.4
cmudstzzs01ro12ermxg9e6dx	cmudstzzl01ri12erdzjxpipj	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.4	2026-09-23 07:46:09.4
cmudstzzs01rp12erixy2n8i9	cmudstzzl01ri12erdzjxpipj	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.4	2026-09-23 07:46:09.4
cmudstzzs01rq12erqmnnrif4	cmudstzzl01ri12erdzjxpipj	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.4	2026-09-23 07:46:09.4
cmudsu00801rz12erpovw81oy	cmudsu00301rx12er5fj14de0	cmudstm2d001bbeo3ads0c96h	12GB	2026-09-23 07:46:09.416	2026-09-23 07:46:09.416
cmudsu00801s012erlcqy1dxu	cmudsu00301rx12er5fj14de0	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.416	2026-09-23 07:46:09.416
cmudsu00801s112er69mrki7k	cmudsu00301rx12er5fj14de0	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:09.416	2026-09-23 07:46:09.416
cmudsu00801s212er3krxfbgd	cmudsu00301rx12er5fj14de0	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.416	2026-09-23 07:46:09.416
cmudsu00801s312er2s9ozovc	cmudsu00301rx12er5fj14de0	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.416	2026-09-23 07:46:09.416
cmudsu00801s412erobd0bvt7	cmudsu00301rx12er5fj14de0	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.416	2026-09-23 07:46:09.416
cmudsu00m01sd12erd156wm02	cmudsu00h01sb12er19a9dtdu	cmudstm34002lbeo3xl0fg6dd	16GB	2026-09-23 07:46:09.431	2026-09-23 07:46:09.431
cmudsu00m01se12ertlio9v6f	cmudsu00h01sb12er19a9dtdu	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:09.431	2026-09-23 07:46:09.431
cmudsu00m01sf12erje401lln	cmudsu00h01sb12er19a9dtdu	cmudstm36002rbeo3girfb892	Up to 2520MHz(Game)/ 3060MHz(Boost)	2026-09-23 07:46:09.431	2026-09-23 07:46:09.431
cmudsu00m01sg12er28t6sncw	cmudsu00h01sb12er19a9dtdu	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:09.431	2026-09-23 07:46:09.431
cmudsu00m01sh12erbqv24pdz	cmudsu00h01sb12er19a9dtdu	cmudstm3b0033beo3pu4ethqx	RX 9000	2026-09-23 07:46:09.431	2026-09-23 07:46:09.431
cmudsu00m01si12erxbqmqu21	cmudsu00h01sb12er19a9dtdu	cmudstm3h003jbeo3wzjjjwu9	256-bit	2026-09-23 07:46:09.431	2026-09-23 07:46:09.431
cmudsu00m01sj12eraqt7zfzo	cmudsu00h01sb12er19a9dtdu	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:09.431	2026-09-23 07:46:09.431
cmudsu01201st12erujt212xa	cmudsu00w01sr12er515hcjur	cmudstm2d001bbeo3ads0c96h	12GB	2026-09-23 07:46:09.447	2026-09-23 07:46:09.447
cmudsu01201su12erqyutjjjb	cmudsu00w01sr12er515hcjur	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.447	2026-09-23 07:46:09.447
cmudsu01201sv12erz8jdjppk	cmudsu00w01sr12er515hcjur	cmudstm2g001hbeo3trkzbee8	2512 MHz	2026-09-23 07:46:09.447	2026-09-23 07:46:09.447
cmudsu01201sw12er8oghgxo5	cmudsu00w01sr12er515hcjur	cmudstm2g001jbeo3hdbgmfpi	28 Gbps, Memory Bus: 192-bit	2026-09-23 07:46:09.447	2026-09-23 07:46:09.447
cmudsu01201sx12erwu36kcn7	cmudsu00w01sr12er515hcjur	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.447	2026-09-23 07:46:09.447
cmudsu01201sy12er5izp3sju	cmudsu00w01sr12er515hcjur	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.447	2026-09-23 07:46:09.447
cmudsu01201sz12eryzop2urr	cmudsu00w01sr12er515hcjur	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.447	2026-09-23 07:46:09.447
cmudsu01i01t812erqb2uoq33	cmudsu01c01t612ermq8g3da7	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:09.462	2026-09-23 07:46:09.462
cmudsu01i01t912erghwa8xoo	cmudsu01c01t612ermq8g3da7	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.462	2026-09-23 07:46:09.462
cmudsu01i01ta12er5acwxqio	cmudsu01c01t612ermq8g3da7	cmudstm2g001jbeo3hdbgmfpi	28 Gbps	2026-09-23 07:46:09.462	2026-09-23 07:46:09.462
cmudsu01i01tb12er48absg6d	cmudsu01c01t612ermq8g3da7	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.462	2026-09-23 07:46:09.462
cmudsu01i01tc12ersy2jyvzj	cmudsu01c01t612ermq8g3da7	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.462	2026-09-23 07:46:09.462
cmudsu01i01td12er9es8madh	cmudsu01c01t612ermq8g3da7	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.462	2026-09-23 07:46:09.462
cmudsu02301tm12erdgrswofm	cmudsu01x01tk12eryqchua33	cmudstm2d001bbeo3ads0c96h	508016GB	2026-09-23 07:46:09.483	2026-09-23 07:46:09.483
cmudsu02301tn12ergl0tsetn	cmudsu01x01tk12eryqchua33	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.483	2026-09-23 07:46:09.483
cmudsu02301to12erdp101xlh	cmudsu01x01tk12eryqchua33	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.483	2026-09-23 07:46:09.483
cmudsu02301tp12erudnsjny5	cmudsu01x01tk12eryqchua33	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.483	2026-09-23 07:46:09.483
cmudsu02301tq12eryeqipu57	cmudsu01x01tk12eryqchua33	cmudstm2z0029beo3kz24pu2r	256-bit	2026-09-23 07:46:09.483	2026-09-23 07:46:09.483
cmudsu02301tr12erz3mu3wgo	cmudsu01x01tk12eryqchua33	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.483	2026-09-23 07:46:09.483
cmudsu02n01u112erldtxf7fq	cmudsu02g01tz12er1kqdue92	cmudstm2d001bbeo3ads0c96h	16GB	2026-09-23 07:46:09.503	2026-09-23 07:46:09.503
cmudsu02n01u212erlhcrhfn3	cmudsu02g01tz12er1kqdue92	cmudstm2f001fbeo3dv8f5emy	GDDR7	2026-09-23 07:46:09.503	2026-09-23 07:46:09.503
cmudsu02n01u312erlmyewvay	cmudsu02g01tz12er1kqdue92	cmudstm2g001hbeo3trkzbee8	2670 MHz	2026-09-23 07:46:09.503	2026-09-23 07:46:09.503
cmudsu02n01u412erg7izf1no	cmudsu02g01tz12er1kqdue92	cmudstm2j001rbeo3t212xzp3	NVIDIA GeForce	2026-09-23 07:46:09.503	2026-09-23 07:46:09.503
cmudsu02n01u512erfefyu9zg	cmudsu02g01tz12er1kqdue92	cmudstm2k001tbeo3xb2hvl5l	RTX 5000	2026-09-23 07:46:09.503	2026-09-23 07:46:09.503
cmudsu02n01u612erldca6ifz	cmudsu02g01tz12er1kqdue92	cmudstm34002jbeo33np9liw5	3 Years	2026-09-23 07:46:09.503	2026-09-23 07:46:09.503
cmudsurou004ex413oq8hn207	cmudsuron004cx413gqz9do3r	cmudstm34002lbeo3xl0fg6dd	4GB	2026-09-23 07:46:45.295	2026-09-23 07:46:45.295
cmudsurou004fx4132yb0jfhm	cmudsuron004cx413gqz9do3r	cmudstm36002pbeo3k8re21zp	GDDR6	2026-09-23 07:46:45.295	2026-09-23 07:46:45.295
cmudsurou004gx413b4lhacbv	cmudsuron004cx413gqz9do3r	cmudstm3a0031beo31gy78y9t	AMD Radeon	2026-09-23 07:46:45.295	2026-09-23 07:46:45.295
cmudsurou004hx413wjrvfssi	cmudsuron004cx413gqz9do3r	cmudstm3b0033beo3pu4ethqx	RX 6000	2026-09-23 07:46:45.295	2026-09-23 07:46:45.295
cmudsurou004ix4137av03c2s	cmudsuron004cx413gqz9do3r	cmudstm3h003jbeo3wzjjjwu9	1x DisplayPort, 1x HDMI	2026-09-23 07:46:45.295	2026-09-23 07:46:45.295
cmudsurou004jx413v468fjxl	cmudsuron004cx413gqz9do3r	cmudstm3k003tbeo3rlwq8xyg	3 Years	2026-09-23 07:46:45.295	2026-09-23 07:46:45.295
cmudw1nhv00017t3nxz7o1sym	cmuczczt50008mhtf6fate690	cmr9bvs970039njjl7x3qpa9y	Ryzen 3000 Series	2026-09-23 09:16:05.298	2026-09-23 09:16:05.298
cmudw1nic00037t3n8qx91you	cmuczczt50008mhtf6fate690	cmr9bvs970032njjll06wzb1c	Athlon	2026-09-23 09:16:05.317	2026-09-23 09:16:05.317
cmudw1nif00057t3na6o325t8	cmuczd2xs000smhtf2rbeam9u	cmr9bvs970039njjl7x3qpa9y	Ryzen 3000 Series	2026-09-23 09:16:05.319	2026-09-23 09:16:05.319
cmudw1nih00077t3n60niarce	cmuczd2xs000smhtf2rbeam9u	cmr9bvs970032njjll06wzb1c	Ryzen 3	2026-09-23 09:16:05.321	2026-09-23 09:16:05.321
cmudw1nii00097t3ntqzcycdq	cmuczfepr0002dmdmxlb8v8or	cmr9bvs970039njjl7x3qpa9y	Ryzen 4000 Series	2026-09-23 09:16:05.323	2026-09-23 09:16:05.323
cmudw1nik000b7t3ndov5fizp	cmuczfepr0002dmdmxlb8v8or	cmr9bvs970032njjll06wzb1c	Ryzen 3	2026-09-23 09:16:05.324	2026-09-23 09:16:05.324
cmudw1nil000d7t3nkc98s48y	cmuczd0f8000dmhtfghy44gvu	cmr9bvs970039njjl7x3qpa9y	Ryzen 2000 Series	2026-09-23 09:16:05.326	2026-09-23 09:16:05.326
cmudw1nin000f7t3nzt16wi19	cmuczd0f8000dmhtfghy44gvu	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-23 09:16:05.327	2026-09-23 09:16:05.327
cmudw1nio000h7t3n2m6jg23a	cmuczd3jq000xmhtfrbdmek7x	cmr9bvs970039njjl7x3qpa9y	Ryzen 3000 Series	2026-09-23 09:16:05.328	2026-09-23 09:16:05.328
cmudw1nip000j7t3n83qlanox	cmuczd3jq000xmhtfrbdmek7x	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-23 09:16:05.329	2026-09-23 09:16:05.329
cmudw1niq000l7t3nab2dicy8	cmuczd5s00017mhtfw7vsvpio	cmr9bvs970039njjl7x3qpa9y	Ryzen 5000 Series	2026-09-23 09:16:05.331	2026-09-23 09:16:05.331
cmudw1nir000n7t3n4tkly7xf	cmuczd5s00017mhtfw7vsvpio	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-23 09:16:05.332	2026-09-23 09:16:05.332
cmudw1nit000p7t3nxdu55jk2	cmuczdh45003kmhtfv73a0hxt	cmr9bvs970039njjl7x3qpa9y	Ryzen 5000 Series	2026-09-23 09:16:05.333	2026-09-23 09:16:05.333
cmudw1niv000r7t3nh3lub38r	cmuczdh45003kmhtfv73a0hxt	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-23 09:16:05.336	2026-09-23 09:16:05.336
cmudw1nix000t7t3nz6iweyvp	cmuczdhtm003pmhtfyik2s4fj	cmr9bvs970039njjl7x3qpa9y	Ryzen 5000 Series	2026-09-23 09:16:05.337	2026-09-23 09:16:05.337
cmudw1niy000v7t3npl9r8vdz	cmuczdhtm003pmhtfyik2s4fj	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-23 09:16:05.338	2026-09-23 09:16:05.338
cmu1dykhf0008suots13d5b5a	cmr9bvsa7004jnjjlzqzyt643	cmr9bvs970039njjl7x3qpa9y	Ryzen 5000 Series	2026-09-14 15:16:34.228	2026-09-23 09:16:05.34
cmudw1nj2000z7t3n11rse4gv	cmuczddea002qmhtfyywq7t5k	cmr9bvs970039njjl7x3qpa9y	Ryzen 7000 Series	2026-09-23 09:16:05.342	2026-09-23 09:16:05.342
cmudw1nj300117t3n7w2x850a	cmuczddea002qmhtfyywq7t5k	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-23 09:16:05.343	2026-09-23 09:16:05.343
cmudw1nj400137t3nz2lp177g	cmuczdl4t0044mhtfttb91bwf	cmr9bvs970039njjl7x3qpa9y	Ryzen 7000 Series	2026-09-23 09:16:05.344	2026-09-23 09:16:05.344
cmudw1nj500157t3nx5x13fhq	cmuczdl4t0044mhtfttb91bwf	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-23 09:16:05.346	2026-09-23 09:16:05.346
cmudw1nj600177t3n7vj4xlhe	cmuczd7j2001mmhtfi4dhg601	cmr9bvs970039njjl7x3qpa9y	Ryzen 8000 Series	2026-09-23 09:16:05.347	2026-09-23 09:16:05.347
cmudw1nj800197t3nqnxcrzww	cmuczd7j2001mmhtfi4dhg601	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-23 09:16:05.348	2026-09-23 09:16:05.348
cmudw1nj9001b7t3n8wfybbbz	cmuczdf8t0035mhtfijl5ofja	cmr9bvs970039njjl7x3qpa9y	Ryzen 8000 Series	2026-09-23 09:16:05.35	2026-09-23 09:16:05.35
cmudw1nja001d7t3nnex6zz15	cmuczdf8t0035mhtfijl5ofja	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-23 09:16:05.351	2026-09-23 09:16:05.351
cmudw1njc001f7t3nbk5ktiv5	cmuczdr4c004tmhtfa2xz0pnc	cmr9bvs970039njjl7x3qpa9y	Ryzen 8000 Series	2026-09-23 09:16:05.352	2026-09-23 09:16:05.352
cmudw1njd001h7t3n0zpntjoe	cmuczdr4c004tmhtfa2xz0pnc	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-23 09:16:05.353	2026-09-23 09:16:05.353
cmudw1nje001j7t3n69g7dhv3	cmuczdtdq0058mhtf493du620	cmr9bvs970039njjl7x3qpa9y	Ryzen 9000 Series	2026-09-23 09:16:05.354	2026-09-23 09:16:05.354
cmudw1njf001l7t3no169d8ro	cmuczdtdq0058mhtf493du620	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-23 09:16:05.356	2026-09-23 09:16:05.356
cmudw1njg001n7t3nofyqjttc	cmuczd1bg000imhtf8v98k9y1	cmr9bvs970039njjl7x3qpa9y	Ryzen 2000 Series	2026-09-23 09:16:05.357	2026-09-23 09:16:05.357
cmudw1njh001p7t3nmokcjzax	cmuczd1bg000imhtf8v98k9y1	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-23 09:16:05.358	2026-09-23 09:16:05.358
cmudw1njj001r7t3n3f8j2syf	cmuczdfte003amhtfwwdfz5ss	cmr9bvs970039njjl7x3qpa9y	Ryzen 5000 Series	2026-09-23 09:16:05.359	2026-09-23 09:16:05.359
cmudw1njk001t7t3nwyco2ogl	cmuczdfte003amhtfwwdfz5ss	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-23 09:16:05.36	2026-09-23 09:16:05.36
cmudw1njl001v7t3nsgkvoyua	cmuczde53002vmhtfwkvc4d8o	cmr9bvs970039njjl7x3qpa9y	Ryzen 5000 Series	2026-09-23 09:16:05.361	2026-09-23 09:16:05.361
cmudw1njm001x7t3njv5jbhbu	cmuczde53002vmhtfwkvc4d8o	cmr9bvs970032njjll06wzb1c	Ryzen 5	2026-09-23 09:16:05.362	2026-09-23 09:16:05.362
cmudw1njn001z7t3nq5lkq1ob	cmuczdnle004emhtfkbo8yhvm	cmr9bvs970039njjl7x3qpa9y	Ryzen 5000 Series	2026-09-23 09:16:05.364	2026-09-23 09:16:05.364
cmudw1njo00217t3nhzkggn08	cmuczdnle004emhtfkbo8yhvm	cmr9bvs970032njjll06wzb1c	Ryzen 7	2026-09-23 09:16:05.365	2026-09-23 09:16:05.365
cmudw1njq00237t3n8l5zfznx	cmuczdjme003zmhtfflp7qp3w	cmr9bvs970039njjl7x3qpa9y	Ryzen 5000 Series	2026-09-23 09:16:05.366	2026-09-23 09:16:05.366
cmudw1njr00257t3nnj7phaw4	cmuczdjme003zmhtfflp7qp3w	cmr9bvs970032njjll06wzb1c	Ryzen 7	2026-09-23 09:16:05.367	2026-09-23 09:16:05.367
cmudw1njs00277t3nomdtl0nr	cmuczdtzx005dmhtfn2qf3lee	cmr9bvs970039njjl7x3qpa9y	Ryzen 7000 Series	2026-09-23 09:16:05.368	2026-09-23 09:16:05.368
cmudw1njt00297t3nitq9ch66	cmuczdtzx005dmhtfn2qf3lee	cmr9bvs970032njjll06wzb1c	Ryzen 7	2026-09-23 09:16:05.37	2026-09-23 09:16:05.37
cmudw1njv002b7t3npz8c05y2	cmuczdv5l005nmhtf8y5os0bj	cmr9bvs970039njjl7x3qpa9y	Ryzen 7000 Series	2026-09-23 09:16:05.371	2026-09-23 09:16:05.371
cmudw1njw002d7t3n0a4alzrb	cmuczdv5l005nmhtf8y5os0bj	cmr9bvs970032njjll06wzb1c	Ryzen 7	2026-09-23 09:16:05.372	2026-09-23 09:16:05.372
cmudw1njx002f7t3n8nkwiwdq	cmuczdyzd006cmhtf8vx62wvc	cmr9bvs970039njjl7x3qpa9y	Ryzen 8000 Series	2026-09-23 09:16:05.373	2026-09-23 09:16:05.373
cmudw1njy002h7t3nmtzp0up6	cmuczdyzd006cmhtf8vx62wvc	cmr9bvs970032njjll06wzb1c	Ryzen 7	2026-09-23 09:16:05.375	2026-09-23 09:16:05.375
cmudw1njz002j7t3nsp93pjfr	cmucze14l006mmhtfvuxtualh	cmr9bvs970039njjl7x3qpa9y	Ryzen 9000 Series	2026-09-23 09:16:05.376	2026-09-23 09:16:05.376
cmudw1nk0002l7t3nzrbmnqn2	cmucze14l006mmhtfvuxtualh	cmr9bvs970032njjll06wzb1c	Ryzen 7	2026-09-23 09:16:05.377	2026-09-23 09:16:05.377
cmudw1nk2002n7t3n81uo317r	cmuczek020094mhtf8gxu25yp	cmr9bvs970039njjl7x3qpa9y	Ryzen 9000 Series	2026-09-23 09:16:05.378	2026-09-23 09:16:05.378
cmudw1nk3002p7t3nzvj7t45m	cmuczek020094mhtf8gxu25yp	cmr9bvs970032njjll06wzb1c	Ryzen 7	2026-09-23 09:16:05.379	2026-09-23 09:16:05.379
cmudw1nk4002r7t3nxytu9czf	cmuczeku10099mhtf7n8yk5gv	cmr9bvs970039njjl7x3qpa9y	Ryzen 9000 Series	2026-09-23 09:16:05.381	2026-09-23 09:16:05.381
cmudw1nk5002t7t3nnpnfhtmb	cmuczeku10099mhtf7n8yk5gv	cmr9bvs970032njjll06wzb1c	Ryzen 7	2026-09-23 09:16:05.382	2026-09-23 09:16:05.382
cmudw1nk7002v7t3n5lmptt3b	cmuczdm4g0049mhtf5ryhrfa6	cmr9bvs970039njjl7x3qpa9y	Ryzen 5000 Series	2026-09-23 09:16:05.383	2026-09-23 09:16:05.383
cmudw1nk8002x7t3n4c2reh8x	cmuczdm4g0049mhtf5ryhrfa6	cmr9bvs970032njjll06wzb1c	Ryzen 7	2026-09-23 09:16:05.384	2026-09-23 09:16:05.384
cmudw1nk9002z7t3noppia6y3	cmucze2m7006rmhtfnj6cqzuo	cmr9bvs970039njjl7x3qpa9y	Ryzen 5000 Series	2026-09-23 09:16:05.385	2026-09-23 09:16:05.385
cmudw1nka00317t3nt065kr2b	cmucze2m7006rmhtfnj6cqzuo	cmr9bvs970032njjll06wzb1c	Ryzen 9	2026-09-23 09:16:05.386	2026-09-23 09:16:05.386
cmudw1nkb00337t3nfh4yoxyw	cmuczecyp0085mhtfsob7rhh3	cmr9bvs970039njjl7x3qpa9y	Ryzen 5000 Series	2026-09-23 09:16:05.387	2026-09-23 09:16:05.387
cmudw1nkc00357t3nxixffnd6	cmuczecyp0085mhtfsob7rhh3	cmr9bvs970032njjll06wzb1c	Ryzen 9	2026-09-23 09:16:05.389	2026-09-23 09:16:05.389
cmudw1nkd00377t3npx4pncs9	cmucze5cu0076mhtfisxkijo2	cmr9bvs970039njjl7x3qpa9y	Ryzen 7000 Series	2026-09-23 09:16:05.39	2026-09-23 09:16:05.39
cmudw1nkf00397t3n2rylk6p0	cmucze5cu0076mhtfisxkijo2	cmr9bvs970032njjll06wzb1c	Ryzen 9	2026-09-23 09:16:05.391	2026-09-23 09:16:05.391
cmudw1nkg003b7t3nwgv2m1nk	cmuczefct008kmhtfpqzrd1i9	cmr9bvs970039njjl7x3qpa9y	Ryzen 7000 Series	2026-09-23 09:16:05.392	2026-09-23 09:16:05.392
cmudw1nkh003d7t3n1ksuwctk	cmuczefct008kmhtfpqzrd1i9	cmr9bvs970032njjll06wzb1c	Ryzen 9	2026-09-23 09:16:05.394	2026-09-23 09:16:05.394
cmudw1nkk003f7t3nf6xfejk8	cmuczeb5p007vmhtfos5w9mv5	cmr9bvs970039njjl7x3qpa9y	Ryzen 9000 Series	2026-09-23 09:16:05.396	2026-09-23 09:16:05.396
cmudw1nkl003h7t3ngijtcmui	cmuczeb5p007vmhtfos5w9mv5	cmr9bvs970032njjll06wzb1c	Ryzen 9	2026-09-23 09:16:05.397	2026-09-23 09:16:05.397
cmudw1nkm003j7t3nr3mb4dx9	cmuczemef009jmhtf8f8nhdh8	cmr9bvs970039njjl7x3qpa9y	Ryzen 9000 Series	2026-09-23 09:16:05.398	2026-09-23 09:16:05.398
cmudw1nkn003l7t3nyw4zv2js	cmuczemef009jmhtf8f8nhdh8	cmr9bvs970032njjll06wzb1c	Ryzen 9	2026-09-23 09:16:05.399	2026-09-23 09:16:05.399
cmudw1nko003n7t3negn3qu5p	cmuczegdh008pmhtfbp88x09g	cmr9bvs970039njjl7x3qpa9y	Ryzen 9000 Series	2026-09-23 09:16:05.401	2026-09-23 09:16:05.401
cmudw1nkq003p7t3nmid2k6ke	cmuczegdh008pmhtfbp88x09g	cmr9bvs970032njjll06wzb1c	Ryzen 9	2026-09-23 09:16:05.402	2026-09-23 09:16:05.402
cmudw1nkr003r7t3n3vwkonhn	cmuczen8f009omhtfeyrd47re	cmr9bvs970039njjl7x3qpa9y	Ryzen 9000 Series	2026-09-23 09:16:05.403	2026-09-23 09:16:05.403
cmudw1nks003t7t3n4lt1slr4	cmuczen8f009omhtfeyrd47re	cmr9bvs970032njjll06wzb1c	Ryzen 9	2026-09-23 09:16:05.404	2026-09-23 09:16:05.404
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
cmr9bvsa7004jnjjlzqzyt643	AMD Ryzen 5 5600X 6 Core 12 Thread Desktop Processor	amd-ryzen-5-5600x	PROC-AMD-5600X	AMD Ryzen 5 5600X Desktop Processor comes with 6 cores and 12 threads. This 5th Generation processor has a base clock speed of 3.7 GHz and a maximum boost clock of up to 4.6 GHz. It features 35MB of combined cache and supports DDR4 memory.	6 Cores, 12 Threads, up to 4.6 GHz, AM4 Socket	22500.00	25000.00	\N	IN_STOCK	30	5	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 5600X Processor Price in Bangladesh	Buy AMD Ryzen 5 5600X 6 Core 12 Thread Processor at best price in Bangladesh.		t	t	2026-07-06 14:41:27.536	2026-09-14 15:16:34.204	2026-07-06 14:41:27.534
cmtn590bg0003jq5xqmmmsw7w	PELADN GeForce KaiTian GT 730 4GB GDDR3 Graphics Card	peladn-geforce-kaitian-gt-730-4gb-gddr3-graphics-card	PELADN-GT730-4GD3	PELADN GeForce KaiTian GT 730 4GB GDDR3 Graphics Card\n\nThe PELADN GeForce KaiTian GT 730 4GB GDDR3 is an entry-level graphics card for light multimedia, office use, and basic graphical workloads in compact desktops.\n\nKey Features:\n- Model: GeForce KaiTian GT 730\n- Video Memory: 4GB GDDR3\n- CUDA Cores: 192\n- Memory Clock: 902 MHz\n- Memory Frequency: 1300 MHz\n- BUS Type: 64-bit\n- Outputs: HDMI, DVI, VGA (D-Sub)\n- Power Consumption: 25W\n- Recommended PSU: 300W\n- Passive heatsink cooling (quiet operation)\n- Compact size: 146 x 69 x 23mm\n- Weight: 655g\n- Warranty: 2 Years Manufacturer Warranty\n\nIdeal for HTPC builds, small-form-factor cases, and quiet office PCs.	Model: GeForce KaiTian GT 730 | Video Memory: 4GB GDDR3 | CUDA Cores: 192 | Memory Clock: 902 MHz | Memory Frequency: 1300 MHz	5999.00	6500.00	\N	IN_STOCK	10	2	cmr9bvs3q001snjjl5bz9ep3j	cmtn590a70000jq5x2w1gp882	PELADN GT 730 4GB GDDR3 Price in Bangladesh	Buy PELADN GeForce KaiTian GT 730 4GB GDDR3 Graphics Card at best price in Bangladesh. In stock with 2 years warranty.	\N	f	t	2026-09-04 16:03:58.3	2026-09-04 16:03:58.3	2026-09-04 16:03:58.297
cmu2p7kc80078aap1yam8femo	Intel Core i3-14100 Desktop Processor	intel-core-i3-14100	CPU-I3-14100	14th Gen entry-level desktop processor. Fill your own long description before publish.	14th Gen Intel Core i3-14100 entry-level desktop CPU for office and study PCs.	13900.00	16500.00	\N	IN_STOCK	0	5	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Buy Intel Core i3-14100 in Bangladesh | LogicBay BD	Intel Core i3-14100 desktop processor. Check price and warranty at LogicBay BD.	processor intel i3 14100	f	t	2026-09-15 13:19:15.897	2026-09-22 18:02:59.627	2026-09-15 13:19:15.895
cmu2p7k8p005baap13y3b5gko	AMD Ryzen 5 7600 Desktop Processor	amd-ryzen-5-7600	CPU-R5-7600	Ryzen 7000 series mainstream desktop processor. Fill your own long description before publish.	Clock Speed: 3.8GHz Up to 5.1GHz\nCores: 6, Threads: 12\nL2 Cache: 6MB, L3 Cache: 32MB\nSocket: AM5	18000.00	20000.00	\N	IN_STOCK	0	5	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	Buy AMD Ryzen 5 7600 in Bangladesh | LogicBay BD	AMD Ryzen 5 7600 desktop processor. Check price and warranty at LogicBay BD.	processor amd ryzen 5 7600	f	t	2026-09-15 13:19:15.769	2026-09-22 18:07:52.619	2026-09-15 13:19:15.768
cmu2p7kb3006laap1k0e6z4b3	AMD Ryzen 9 7950X Desktop Processor	amd-ryzen-9-7950x	CPU-R9-7950X	Ryzen 7000 series high-end desktop processor. Fill your own long description before publish.	Clock Speed: 4.5GHz Up to 5.7GHz\nCores: 16, Threads: 32\nL2 Cache: 16MB, L3 Cache: 64MB\nSocket: AM5	45000.00	59000.00	\N	IN_STOCK	0	5	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	Buy AMD Ryzen 9 7950X in Bangladesh | LogicBay BD	AMD Ryzen 9 7950X desktop processor. Check price and warranty at LogicBay BD.	processor amd ryzen 9 7950x	f	t	2026-09-15 13:19:15.855	2026-09-22 18:07:52.66	2026-09-15 13:19:15.854
cmuczdio8003umhtfm3ui4b98	Intel 12th Gen Core i5-12400F Alder Lake Processor	intel-12th-gen-core-i5-12400f-alder-lake-processor	CPU-I-12THGENCOREI512400FALDERLAKE	\N	Base Clock Speed: 2.50 GHz Up to 4.40 GHz\nCache: 18 MB Intel Smart Cache\nCPU Cores: 6, CPU Threads: 12\nSupported Socket: LGA1700	15500.00	18000.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 12th Gen Core i5-12400F Alder Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel 12th Gen Core i5-12400F Alder Lake Processor at ৳15,500 from LogicBay BD.	\N	f	t	2026-09-22 18:01:31.592	2026-09-22 18:07:52.617	2026-09-22 18:01:31.592
cmtn5e2zr0003udp6yvyg5ila	Sapphire Pulse AMD Radeon RX 6600 XT Gaming OC 8GB GDDR6 Graphics Card	sapphire-pulse-amd-radeon-rx-6600-xt-gaming-oc-8gb-gddr6-graphics-card	SAPPHIRE-RX6600XT-PULSE-8G	Sapphire Pulse AMD Radeon RX 6600 XT Gaming OC 8GB GDDR6 Graphics Card\n\nThe Sapphire PULSE AMD Radeon RX 6600 XT Gaming OC 8GB GDDR6 Graphics Card is powered by the AMD RDNA 2 architecture with 32 compute units and 32MB of AMD Infinity Cache. Built for 1080p high-refresh gaming with Dual-X cooling, a metal backplate, and efficient power use.\n\nKey Features:\n- Model: RX 6600 XT\n- Boost Clock: Up to 2593 MHz\n- Game Clock: Up to 2359 MHz\n- Memory: 8GB GDDR6 (16 Gbps Effective)\n- Stream Processors: 2048\n- Architecture: AMD RDNA 2\n- BUS: 128-bit\n- Interface: PCI-Express 4.0 x8\n- Outputs: 1x HDMI, 3x DisplayPort\n- Dual-X Cooling Technology (Dual Fan)\n- Metal Backplate\n- Recommended PSU: 500W\n- Board Power: 160W\n- Connector: 1 x 8-pin\n- Dimensions: 240 x 119.85 x 44.75 mm (2.2 slot)\n- Warranty: 2 Years Manufacturing Warranty\n\nSupports Ray Tracing, AMD FidelityFX, AMD FreeSync, and DirectX 12 Ultimate.	Model: RX 6600 XT | Boost: up to 2593 MHz | Game Clock: up to 2359 MHz | 8GB GDDR6 | Stream Processors: 2048	66900.00	68500.00	\N	IN_STOCK	8	2	cmr9bvs3r001unjjlz6a3qh23	cmtn5e2yh0000udp65aqs32hi	Sapphire Pulse RX 6600 XT 8GB Price in Bangladesh	Buy Sapphire Pulse AMD Radeon RX 6600 XT Gaming OC 8GB GDDR6 Graphics Card at best price in Bangladesh. In stock with 2 years warranty.	\N	f	t	2026-09-04 16:07:55.047	2026-09-04 16:07:55.047	2026-09-04 16:07:55.044
cmtn5tr3t000kdjded7l6qx1m	TEAM ELITE 8GB 3200MHz Laptop RAM	team-elite-8gb-3200mhz-laptop-ram	TEAM-ELITE-8GB-3200-SODIMM	TEAM ELITE 8GB 3200MHz Laptop RAM\n\nTEAM ELITE series is an all-new DDR4 SO-DIMM product that is compliant with the international JEDEC standards. Designed for laptop users who need quality, performance, stability, and compatibility.\n\nKey Features:\n- MPN: TED48G3200C22-S01\n- Model: TEAM ELITE 8G\n- Type: 260-Pin DDR4 SO-DIMM\n- Capacity: 8GB\n- Frequency: 3200 MHz\n- Operating Voltage: 1.2V (saves ~20% power vs previous generation)\n- Latency: CL22-22-22-52\n- 100% compatibility with Intel X99 & Skylake chipsets\n- Reduced heat generation for stable laptop temperatures\n- Warranty: Lifetime\n\nIdeal for upgrading laptop memory for smoother multitasking and everyday performance.	MPN: TED48G3200C22-S01 | Model: TEAM ELITE 8G | Type: DDR4 3200MHz | Voltage: 1.2V | Latency: CL22-22-22-52	9800.00	10780.00	\N	IN_STOCK	15	3	cmrethhj40005vdfbnhhoj6ap	cmr9bvs1e0008njjldd9yn8gy	TEAM ELITE 8GB 3200MHz Laptop RAM Price in Bangladesh	Buy TEAM ELITE 8GB DDR4 3200MHz SODIMM Laptop RAM at best price in Bangladesh. Lifetime warranty. In stock.	\N	f	t	2026-09-04 16:20:06.137	2026-09-04 16:20:06.137	2026-09-04 16:20:06.134
cmu2p7k3d003eaap1g3pu2qg3	Intel Core i5-14600K Desktop Processor	intel-core-i5-14600k	CPU-I5-14600K	14th Gen (Raptor Lake Refresh) unlocked desktop processor. Fill your own long description before publish.	14th Gen Intel Core i5 unlocked desktop CPU with 14 cores for gaming and productivity.	35500.00	38000.00	\N	IN_STOCK	0	5	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Buy Intel Core i5-14600K in Bangladesh | LogicBay BD	Intel Core i5-14600K desktop processor. Check price and warranty at LogicBay BD.	processor intel i5 14600k	f	t	2026-09-15 13:19:15.577	2026-09-15 13:19:15.577	2026-09-15 13:19:15.575
cmu6r4gcb004veqew06h8boj6	Colorful Battle-AX 16GB DDR5 6000MHz CL40 Desktop RAM	colorful-battle-ax-16gb-ddr5-6000mhz-cl40-desktop-ram	RAM-COLORFUL-BATTLE-AX-16GB-DDR5-6000MHZ-CL4	\N	Colorful Battle-AX 16GB DDR5 6000MHz CL40 Desktop RAM - fill your own short pitch before publish.	29500.00	\N	\N	IN_STOCK	0	5	cmrethhiz0003vdfb4lfktnqj	cmr9bvs24000onjjll00hq9a9	Buy Colorful Battle-AX 16GB DDR5 6000MHz CL40 Desktop RAM in Bangladesh | LogicBay BD	Colorful Battle-AX 16GB DDR5 6000MHz CL40 Desktop RAM. Check price and warranty at LogicBay BD.	desktop ram, colorful, ddr5, 16gb, 6000 mhz	f	t	2026-09-18 09:23:54.684	2026-09-18 09:23:54.684	2026-09-18 09:23:54.682
cmuczdbu2002bmhtfqe8psv3t	Intel Core i3 12100T 12th Gen Alder Lake Processor	intel-core-i3-12100t-12th-gen-processor	CPU-I-COREI312100T12THGEN	\N	Clock Speed: 2.20 GHz Up to 4.10 GHz\nCache: 12MB, Socket: LGA 1700\nCPU Cores: 4, CPU Threads: 8\nGraphic: Intel UHD Graphics 730	15500.00	16000.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i3 12100T 12th Gen Alder Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core i3 12100T 12th Gen Alder Lake Processor at ৳15,500 from LogicBay BD.	\N	f	t	2026-09-22 18:01:22.73	2026-09-22 18:07:52.602	2026-09-22 18:01:22.73
cmuczdcec002gmhtf06cq2ial	Intel Core i3-12100 12th Gen Alder Lake Processor	intel-core-i3-12100-12th-gen-alder-lake-processor	CPU-I-COREI31210012THGENALDERLAKE	\N	Clock Speed: 3.30 GHz Up to 4.30 GHz\nCache: 12MB, Socket: LGA 1700\nCPU Cores: 4, CPU Threads: 8\nGraphic: Intel UHD Graphics 730	13900.00	16200.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i3-12100 12th Gen Alder Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core i3-12100 12th Gen Alder Lake Processor at ৳13,900 from LogicBay BD.	\N	f	t	2026-09-22 18:01:23.46	2026-09-22 18:07:52.603	2026-09-22 18:01:23.459
cmu2p7k73004oaap136n88e7i	Intel Core Ultra 7 265K Desktop Processor	intel-core-ultra-7-265k	CPU-U7-265K	Ultra Series 2 unlocked desktop processor. Fill your own long description before publish.	Clock Speed: 3.3GHz up to 5.5GHz\nCache: 30 MB, Socket: LGA1851\nCPU Cores: 20, CPU Threads: 20\nNPU: Intel AI Boost	33300.00	38000.00	\N	IN_STOCK	0	5	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Buy Intel Core Ultra 7 265K in Bangladesh | LogicBay BD	Intel Core Ultra 7 265K desktop processor. Check price and warranty at LogicBay BD.	processor intel ultra 7 265k	f	t	2026-09-15 13:19:15.711	2026-09-22 18:07:52.641	2026-09-15 13:19:15.71
cmu2p7k4u0041aap1z5iwkuq2	AMD Ryzen 7 7800X3D Desktop Processor	amd-ryzen-7-7800x3d	CPU-R7-7800X3D	Ryzen 7000 series gaming-focused desktop processor. Fill your own long description before publish.	Clock Speed: 4.2GHz Up to 5.0GHz\nCores: 8, Threads: 16\nL1 Cache: 512KB, L2 Cache: 8MB, L3 Cache: 96MB\nSocket: AM5	34000.00	44000.00	\N	IN_STOCK	0	5	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	Buy AMD Ryzen 7 7800X3D in Bangladesh | LogicBay BD	AMD Ryzen 7 7800X3D desktop processor. Check price and warranty at LogicBay BD.	processor amd ryzen 7800x3d	f	t	2026-09-15 13:19:15.63	2026-09-22 18:07:52.647	2026-09-15 13:19:15.629
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
cmu6pyo1e00h214lfy6uwilf9	MSI PRO H610M-E mATX Motherboard	msi-pro-h610m-e-matx-motherboard	MB-MSI-PRO-H610M-E-2	MSI PRO H610M-E (DDR5 SKU) supports Intel LGA1700 12th–14th Gen CPUs with H610 chipset, dual-channel DDR5, M.2 storage, HDMI/VGA, and PRO-series reliability features.	MSI PRO H610M-E (DDR5) Micro-ATX for LGA1700.	10500.00	10800.00	11700.00	IN_STOCK	8	5	cmrdawgow0003t4sxu1aulbfu	cmrdanvpu001g11pzvc3or0hz	Buy MSI PRO H610M-E mATX Motherboard in Bangladesh | LogicBay BD	MSI PRO H610M-E mATX Motherboard — Intel H610, DDR5, Micro ATX. Price ৳13600. Warranty 3 Years.	motherboard, msi-intel, Intel H610, DDR5, LogicBay BD	f	t	2026-09-18 08:51:25.107	2026-09-22 17:29:19.344	2026-09-18 08:51:25.105
cmuczd0f8000dmhtfghy44gvu	AMD Ryzen 5 2400G Desktop Processor with Radeon RX Vega 11 Graphics	amd-ryzen-5-2400g-processor	CPU-A-RYZEN52400G	\N	Speed: 3.6GHz Up To 3.9GHz\nCache: L1 384KB L2 2MB L3 4MB\nCores-4 & Threads-8\nPowerful Radeon Vega graphics	5900.00	7200.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 2400G Desktop Processor with Radeon RX Vega 11 Graphics Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 5 2400G Desktop Processor with Radeon RX Vega 11 Graphics at ৳5,900 from LogicBay BD.	\N	f	t	2026-09-22 18:01:07.94	2026-09-22 18:07:52.579	2026-09-22 18:01:07.939
cmuczd1ti000nmhtfcoruymig	Intel Pentium Gold G6400 10th gen Coffee Lake Processor	intel-pentium-gold-g6400-processor	CPU-I-PENTIUMGOLDG6400	\N	Socket Supported FCLGA1200\nSpeed 4.00 GHz\nCores- 2 & Threads- 4\n4M Intel Smart Cache	6200.00	7300.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Pentium Gold G6400 10th gen Coffee Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Pentium Gold G6400 10th gen Coffee Lake Processor at ৳6,200 from LogicBay BD.	\N	f	t	2026-09-22 18:01:09.75	2026-09-22 18:07:52.583	2026-09-22 18:01:09.749
cmuczd2xs000smhtf2rbeam9u	AMD Ryzen 3 3200G Processor with Radeon RX Vega 8 Graphics	amd-ryzen-3-3200g	CPU-A-RYZEN33200G	\N	Speed: 3.6 GHz up to 4.0 GHz\nCores-4 & Threads-4\nMemory Speed: Up to 2933MHz\nRadeon Vega 8 Graphics	6500.00	7800.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 3 3200G Processor with Radeon RX Vega 8 Graphics Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 3 3200G Processor with Radeon RX Vega 8 Graphics at ৳6,500 from LogicBay BD.	\N	f	t	2026-09-22 18:01:11.201	2026-09-22 18:07:52.584	2026-09-22 18:01:11.2
cmuczd3jq000xmhtfrbdmek7x	AMD Ryzen 5 3400G Processor with Radeon RX Vega 11 Graphics	amd-ryzen-5-3400g-processor	CPU-A-RYZEN53400G	\N	Speed: 3.7GHz up to 4.2GHz\nCache: L2: 2MB, L3: 4MB\nCores-4 & Threads-8\nMemory Speed: Up to 2933MHz	6900.00	9500.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 3400G Processor with Radeon RX Vega 11 Graphics Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 5 3400G Processor with Radeon RX Vega 11 Graphics at ৳6,900 from LogicBay BD.	\N	f	t	2026-09-22 18:01:11.99	2026-09-22 18:07:52.586	2026-09-22 18:01:11.989
cmuczd4zo0012mhtfb4mlwwb5	Intel 10th Gen Core i3 10100 Processor	intel-core-i3-10100-processor	CPU-I-COREI310100	\N	Socket Supported FCLGA1200\nSpeed 3.60 up to 4.30 GHz\nCores- 4 & Threads- 8\n6M Cache	9500.00	11300.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 10th Gen Core i3 10100 Processor Price in Bangladesh | LogicBay BD	Buy Intel 10th Gen Core i3 10100 Processor at ৳9,500 from LogicBay BD.	\N	f	t	2026-09-22 18:01:13.86	2026-09-22 18:07:52.589	2026-09-22 18:01:13.86
cmuczd5s00017mhtfw7vsvpio	AMD Ryzen 5 5500 Processor	amd-ryzen-5-5500-processor	CPU-A-RYZEN55500	\N	Speed: 3.6GHz; Up to 4.2GHz\nL2 Cache: 3MB, L3 Cache: 16MB\nCores: 6, Threads: 12\nUp to 3200MHz DDR4	10500.00	11000.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 5500 Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 5 5500 Processor at ৳10,500 from LogicBay BD.	\N	f	t	2026-09-22 18:01:14.88	2026-09-22 18:07:52.59	2026-09-22 18:01:14.879
cmuczd6zw001hmhtfr8l6jg6q	Intel Core i5-10500T 10th Gen Processor	intel-core-i5-10500t-processor	CPU-I-COREI510500T	\N	Clock Speed: 2.3 GHz up to 3.8 GHz\nCache: 12 MB Intel Smart Cache\nCPU Cores: 6, CPU Threads: 12\nSocket: LGA1200	12800.00	\N	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i5-10500T 10th Gen Processor Price in Bangladesh | LogicBay BD	Buy Intel Core i5-10500T 10th Gen Processor at ৳12,800 from LogicBay BD.	\N	f	t	2026-09-22 18:01:16.461	2026-09-22 18:07:52.592	2026-09-22 18:01:16.46
cmuczd7j2001mmhtfi4dhg601	AMD Ryzen 5 8400F Processor	amd-ryzen-5-8400f-processor	CPU-A-RYZEN58400F	\N	Clock Speed: 4.2GHz up to 4.7 GHz\nCores: 6, Threads: 12\nL2 Cache: 6MB, L3 Cache: 16MB\nSocket: AM5	11200.00	12300.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 8400F Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 5 8400F Processor at ৳11,200 from LogicBay BD.	\N	f	t	2026-09-22 18:01:17.151	2026-09-22 18:07:52.593	2026-09-22 18:01:17.15
cmuczd8q4001rmhtfh9rootv6	Intel 10th Gen Core i5-10500 Processor	intel-core-i5-10500-processor	CPU-I-COREI510500	\N	Clock Speed: 3.10 GHz up to 4.50 GHz\nCores-6 & Threads-12\n12 MB SmartCache, Socket: FCLGA1200\nIntel UHD Graphics 630	13900.00	14800.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 10th Gen Core i5-10500 Processor Price in Bangladesh | LogicBay BD	Buy Intel 10th Gen Core i5-10500 Processor at ৳13,900 from LogicBay BD.	\N	f	t	2026-09-22 18:01:18.7	2026-09-22 18:07:52.595	2026-09-22 18:01:18.699
cmuczd99j001wmhtfsi9gp0fc	Intel 10th Gen Core i5-10505 Processor	intel-core-i5-10505-processor	CPU-I-COREI510505	\N	Clock Speed: 3.20 GHz up to 4.60 GHz\nCores: 6, Threads: 12\nCache: 12 MB Intel Smart Cache\nSockets Supported: FCLGA1200	13900.00	14800.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 10th Gen Core i5-10505 Processor Price in Bangladesh | LogicBay BD	Buy Intel 10th Gen Core i5-10505 Processor at ৳13,900 from LogicBay BD.	\N	f	t	2026-09-22 18:01:19.4	2026-09-22 18:07:52.597	2026-09-22 18:01:19.399
cmuczdbc00026mhtfleor0tbj	Intel 10th Gen Core i5-10400 Processor	intel-core-i5-10400-processor	CPU-I-COREI510400	\N	Clock Speed:2.90 GHz up to 4.30 GHz\nCores-6 & Threads-12\n12 MB SmartCache\nIntel UHD Graphics 630	14000.00	16000.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 10th Gen Core i5-10400 Processor Price in Bangladesh | LogicBay BD	Buy Intel 10th Gen Core i5-10400 Processor at ৳14,000 from LogicBay BD.	\N	f	t	2026-09-22 18:01:22.08	2026-09-22 18:07:52.601	2026-09-22 18:01:22.08
cmuczdcw4002lmhtf1md8icgs	Intel 11th Gen Core i5-11500 Rocket Lake Processor	intel-core-i5-11500-11th-gen-processor	CPU-I-COREI51150011THGEN	\N	Clock Speed: 2.70 GHz Up to 4.60 GHz\nCache: 12 MB, Socket: LGA1200\nCPU Cores: 6, CPU Threads: 12\nGPU name: Intel UHD Graphics 750	15500.00	16900.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 11th Gen Core i5-11500 Rocket Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel 11th Gen Core i5-11500 Rocket Lake Processor at ৳15,500 from LogicBay BD.	\N	f	t	2026-09-22 18:01:24.1	2026-09-22 18:07:52.605	2026-09-22 18:01:24.099
cmuczddea002qmhtfyywq7t5k	AMD Ryzen 5 7500F Processor	amd-ryzen-5-7500f-processor	CPU-A-RYZEN57500F	\N	Clock Speed: 3.7GHz up to 5.0GHz\nCores: 6, Threads: 12\nL2 Cache: 6MB, L3 Cache: 32MB\nSocket: AM5	14300.00	17140.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 7500F Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 5 7500F Processor at ৳14,300 from LogicBay BD.	\N	f	t	2026-09-22 18:01:24.754	2026-09-22 18:07:52.606	2026-09-22 18:01:24.754
cmuczdepn0030mhtfnhev3nnb	Intel 11th Gen Core i5-11400 Rocket Lake Processor	intel-core-i5-11400-11th-gen-processor	CPU-I-COREI51140011THGEN	\N	Clock Speed: 2.60 GHz Up to 4.40 GHz\nCache: 12 MB, Socket: LGA1200\nCPU Cores: 6, CPU Threads: 12\nGPU name: Intel UHD Graphics 730	15500.00	17500.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 11th Gen Core i5-11400 Rocket Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel 11th Gen Core i5-11400 Rocket Lake Processor at ৳15,500 from LogicBay BD.	\N	f	t	2026-09-22 18:01:26.46	2026-09-22 18:07:52.608	2026-09-22 18:01:26.459
cmuczdf8t0035mhtfijl5ofja	AMD Ryzen 5 8500G Processor with Radeon Graphics	amd-ryzen-5-8500g-processor	CPU-A-RYZEN58500G	\N	Clock Speed: 3.5GHz up to 5.0GHz\nCores: 6, Threads: 12\nL2 Cache: 6MB, L3 Cache: 16MB\nSocket: AM5	16000.00	17500.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 8500G Processor with Radeon Graphics Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 5 8500G Processor with Radeon Graphics at ৳16,000 from LogicBay BD.	\N	f	t	2026-09-22 18:01:27.15	2026-09-22 18:07:52.609	2026-09-22 18:01:27.149
cmuczdfte003amhtfwwdfz5ss	AMD Ryzen 5 PRO 5650G Processor with Radeon Graphics	amd-ryzen-5-pro-5650g-processor	CPU-A-RYZEN5PRO5650G	\N	Speed: 3.9GHz up to 4.4GHz\nCache: L2: 3MB, L3: 16MB\nCores-6 & Threads-12\nCPU Socket: AM4	17200.00	18500.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 PRO 5650G Processor with Radeon Graphics Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 5 PRO 5650G Processor with Radeon Graphics at ৳17,200 from LogicBay BD.	\N	f	t	2026-09-22 18:01:27.89	2026-09-22 18:07:52.611	2026-09-22 18:01:27.889
cmuczdh45003kmhtfv73a0hxt	AMD Ryzen 5 5500GT AM4 Processor with Radeon Graphics	amd-ryzen-5-5500gt-processor	CPU-A-RYZEN55500GT	\N	Clock Speed: 3.6GHz; Up to 4.4GHz\nL2 Cache: 3MB; L3 Cache: 16MB\n6 Cores & 12 Threads\nCPU Socket: AM4, Zen 3 Architecture	17900.00	18000.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 5500GT AM4 Processor with Radeon Graphics Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 5 5500GT AM4 Processor with Radeon Graphics at ৳17,900 from LogicBay BD.	\N	f	t	2026-09-22 18:01:29.573	2026-09-22 18:07:52.614	2026-09-22 18:01:29.572
cmuczdjme003zmhtfflp7qp3w	AMD Ryzen 7 5700X Processor	amd-ryzen-7-5700x-processor	CPU-A-RYZEN75700X	\N	Speed: 3.4GHz Up to 4.6GHz\nL2 Cache: 4MB, L3 Cache: 32MB\nCores: 8, Threads: 16\nUp to 3200MHz DDR4	16000.00	18000.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 7 5700X Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 7 5700X Processor at ৳16,000 from LogicBay BD.	\N	f	t	2026-09-22 18:01:32.822	2026-09-22 18:07:52.618	2026-09-22 18:01:32.822
cmuczdl4t0044mhtfttb91bwf	AMD Ryzen 5 7600X Processor	amd-ryzen-5-7600x-processor	CPU-A-RYZEN57600X	\N	Clock Speed: 4.7GHz Up to 5.3GHz\nCores: 6, Threads: 12\nL2 Cache: 6MB, L3 Cache: 32MB\nSocket: AM5	18500.00	20500.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 7600X Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 5 7600X Processor at ৳18,500 from LogicBay BD.	\N	f	t	2026-09-22 18:01:34.782	2026-09-22 18:07:52.62	2026-09-22 18:01:34.781
cmuczdm4g0049mhtf5ryhrfa6	AMD Ryzen 7 PRO 5755G Processor with Radeon Graphics	amd-ryzen-7-pro-5755g-processor	CPU-A-RYZEN7PRO5755G	\N	Clock Speed: Base: 3.8GHz Boost: up to 4.6GHz\nCache: L2: 4MB, L3: 16MB; TDP: 65W\nCPU Cores-8 ; Threads-16\nCPU Socket: AM4	21500.00	22500.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 7 PRO 5755G Processor with Radeon Graphics Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 7 PRO 5755G Processor with Radeon Graphics at ৳21,500 from LogicBay BD.	\N	f	t	2026-09-22 18:01:36.065	2026-09-22 18:07:52.621	2026-09-22 18:01:36.064
cmuczdokx004jmhtfj9vasi94	Intel Core Ultra 5 225 Arrow Lake Processor	intel-core-ultra-5-225-processor	CPU-I-COREULTRA5225	\N	Clock Speed: 3.3 GHz up to 4.9 GHz\nCache: 20 MB, Socket: LGA1851\nCPU Cores: 10, CPU Threads: 10\nNPU: Intel AI Boost	20500.00	24200.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core Ultra 5 225 Arrow Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core Ultra 5 225 Arrow Lake Processor at ৳20,500 from LogicBay BD.	\N	f	t	2026-09-22 18:01:39.25	2026-09-22 18:07:52.623	2026-09-22 18:01:39.249
cmuczdpy3004omhtfpo5snty4	Intel 12th Gen Core i5-12400 Alder Lake Processor	intel-12th-gen-core-i5-12400-alder-lake-processor	CPU-I-12THGENCOREI512400ALDERLAKE	\N	Clock Speed: 2.50 GHz Up to 4.40 GHz\nCache: 18MB, Socket: LGA1700\nCPU Cores: 6, CPU Threads: 12\nGraphic: Intel UHD Graphics 730	18300.00	21000.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 12th Gen Core i5-12400 Alder Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel 12th Gen Core i5-12400 Alder Lake Processor at ৳18,300 from LogicBay BD.	\N	f	t	2026-09-22 18:01:41.02	2026-09-22 18:07:52.625	2026-09-22 18:01:41.019
cmuczdr4c004tmhtfa2xz0pnc	AMD Ryzen 5 8600G Processor with Radeon Graphics	amd-ryzen-5-8600g-processor	CPU-A-RYZEN58600G	\N	Clock Speed: 4.3GHz up to 5.0GHz\nCores: 6, Threads: 12\nL2 Cache: 6MB, L3 Cache: 16MB\nSocket: AM5	20500.00	24500.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 8600G Processor with Radeon Graphics Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 5 8600G Processor with Radeon Graphics at ৳20,500 from LogicBay BD.	\N	f	t	2026-09-22 18:01:42.54	2026-09-22 18:07:52.626	2026-09-22 18:01:42.54
cmrcbkzit001a5menuqtjvxca	Intel Core i5 14400F 14th Gen Raptor Lake Processor	intel-core-i5-14400f-14th-gen-raptor-lake-processor	INTEL-CORE-I5-14400F	Intel Core i5 14400F 14th Gen Raptor Lake Processor\nThe Intel Core i5-14400F 2.5 GHz 10-Core LGA 1700 Processor boosts your work, gaming, and multimedia production capabilities. This 14th-generation desktop CPU, built on the Intel 7 technology, offers increased power efficiency while fitting the LGA 1700 socket. The Core i5-14400F has an improved Hybrid Core Architecture, with six 2.5 GHz Performance-cores driving programs and games and four low-voltage Efficient-cores handling background chores for smooth multitasking. The built-in Intel Thread Director guarantees that the two function in tandem by dynamically and intelligently distributing tasks to the correct core at the right time. With 20MB of cache and a Turbo Boost frequency of 5 GHz, this CPU is designed to handle a wide range of applications. The Core i5-14400F also supports PCI Express 5.0 and up to 192GB of dual-channel DDR5 memory at 4800 MHz.\n\nHybrid Core Design\nThe Intel Core i5 14400F Processor gives you the speed to handle high-end games and demanding programs, while the processor's efficient cores manage low-priority and background operations such as streaming video, playing music, and transcoding media.\n\nIntel Thread Director\nThe Intel Thread Director is incorporated into the CPU cores and works with the operating system to guarantee that each of the 16 threads is allocated to the correct core at the proper time.\n\nPCIe 4.0 and 5.0\nThis Intel Core i5 14400F 14th Gen Processor provides up to four PCIe 4.0 and sixteen PCIe 5.0 lanes, for a total of 20 lanes for excellent data throughput with compatible devices.\n\nGaussian and Neural Accelerator 3.0\nThe Intel Core i5 14400F 14th Gen Raptor Lake Processor features Gaussian and Neural Accelerator 3.0 (GNA) technology, which aid in noise reduction while also improving backdrop blurring during video conferencing.\n\nBuy Intel Core i5 14400F 14th Gen Processor from the best Processor Shop in Bangladesh\nIn Bangladesh, you can get the original Intel Core i5 14400F 14th Gen Raptor Lake Processor From Star Tech. We have a large collection of the latest Intel Processor to purchase for your Desktop PC. Order Online Or Visit your Nearest Star Tech Shop to get yours at the lowest price. The Intel Core i5 14400F 14th Gen Processor comes with a 3-year warranty (No Warranty for Fan or Cooler).	Clock Speed: 3.5 GHz up to 4.7 GHz\nCache: 20 MB Intel Smart Cache\nCPU Cores: 10, CPU Threads: 16\nSocket: LGA1700	17500.00	20000.00	2000.00	IN_STOCK	11	2	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt				f	t	2026-07-08 16:56:22.229	2026-09-22 18:07:52.622	2026-07-08 16:56:22.226
cmuczdtdq0058mhtf493du620	AMD Ryzen 5 9600X AM5 Desktop Gaming Processor	amd-ryzen-5-9600x-gaming-processor	CPU-A-RYZEN59600XGAMING	\N	Clock Speed: 3.9 GHz Up to 5.4 GHz\nCores: 6, Threads: 12\nL2 Cache: 6MB, L3 Cache: 32MB\nCPU Socket: AM5	21200.00	26000.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 9600X AM5 Desktop Gaming Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 5 9600X AM5 Desktop Gaming Processor at ৳21,200 from LogicBay BD.	\N	f	t	2026-09-22 18:01:45.47	2026-09-22 18:07:52.629	2026-09-22 18:01:45.47
cmuczdtzx005dmhtfn2qf3lee	AMD Ryzen 7 7700 Gaming Processor	amd-ryzen-7-7700-processor	CPU-A-RYZEN77700	\N	Clock Speed: 3.8GHz Up to 5.3GHz\nCores: 8, Threads: 16\nL2 Cache: 8MB, L3 Cache: 32MB\nSocket: AM5	20000.00	23000.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 7 7700 Gaming Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 7 7700 Gaming Processor at ৳20,000 from LogicBay BD.	\N	f	t	2026-09-22 18:01:46.27	2026-09-22 18:07:52.63	2026-09-22 18:01:46.269
cmuczdumf005imhtf7jvtj6vw	Intel 10th Gen Core i7-10700 Processor	intel-core-i7-10700-processor	CPU-I-COREI710700	\N	Frequency: 2.90 GHz up to 4.8GHz\nCache: 16M Cache, Socket: FCLGA1200\n8 Core 16 Threads\nIntel UHD Graphics 630	24300.00	27000.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 10th Gen Core i7-10700 Processor Price in Bangladesh | LogicBay BD	Buy Intel 10th Gen Core i7-10700 Processor at ৳24,300 from LogicBay BD.	\N	f	t	2026-09-22 18:01:47.08	2026-09-22 18:07:52.631	2026-09-22 18:01:47.079
cmuczdv5l005nmhtf8y5os0bj	AMD Ryzen 7 7700X Processor	amd-ryzen-7-7700x-processor	CPU-A-RYZEN77700X	\N	Clock Speed: 4.5GHz Up to 5.4GHz\nCores: 8, Threads: 16\nL2 Cache: 8MB, L3 Cache: 32MB\nSocket: AM5	25000.00	27000.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 7 7700X Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 7 7700X Processor at ৳25,000 from LogicBay BD.	\N	f	t	2026-09-22 18:01:47.77	2026-09-22 18:07:52.632	2026-09-22 18:01:47.769
cmuczdwlt005xmhtfpxnirudz	Intel 13th Gen Core i5 13400 Raptor Lake Processor	intel-13th-gen-core-i5-13400-processor	CPU-I-13THGENCOREI513400	\N	Clock Speed: 2.50 GHz up to 4.60 GHz\nCache: 20 MB, Socket: LGA1700\nCPU Cores: 10, CPU Threads: 16\nGraphics: Intel UHD Graphics 730	19000.00	23500.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 13th Gen Core i5 13400 Raptor Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel 13th Gen Core i5 13400 Raptor Lake Processor at ৳19,000 from LogicBay BD.	\N	f	t	2026-09-22 18:01:49.65	2026-09-22 18:07:52.635	2026-09-22 18:01:49.649
cmuczdxfa0062mhtflzltg3az	Intel Core Ultra 5 250K Plus Arrow Lake Processor	intel-core-ultra-5-250k-plus-processor	CPU-I-COREULTRA5250KPLUS	\N	Clock Speed: 3.3 GHz up to 5.3 GHz\nCache: 30 MB, Socket: LGA1851\nCPU Cores: 18, CPU Threads: 18\nNPU: Intel AI Boost	27500.00	30500.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core Ultra 5 250K Plus Arrow Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core Ultra 5 250K Plus Arrow Lake Processor at ৳27,500 from LogicBay BD.	\N	f	t	2026-09-22 18:01:50.711	2026-09-22 18:07:52.636	2026-09-22 18:01:50.71
cmuczdy7l0067mhtfmmcw4qnj	Intel Core Ultra 5 245K Arrow Lake Processor	intel-core-ultra-5-245k-processor	CPU-I-COREULTRA5245K	\N	Clock Speed: 3.6 GHz up to 5.2GHz\nCache: 24 MB, Socket: LGA1851\nCPU Cores: 14, CPU Threads: 14\nNPU: Intel AI Boost	22200.00	25500.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core Ultra 5 245K Arrow Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core Ultra 5 245K Arrow Lake Processor at ৳22,200 from LogicBay BD.	\N	f	t	2026-09-22 18:01:51.73	2026-09-22 18:07:52.637	2026-09-22 18:01:51.729
cmuczdzt3006hmhtfmmgtmd2j	Intel Core i5 14600K 14th Gen Raptor Lake Processor	intel-14th-gen-core-i5-14600k-processor	CPU-I-14THGENCOREI514600K	\N	Clock Speed: 3.5 GHz up to 5.3 GHz\nCache: 24 MB, Socket: LGA1700\nCPU Cores: 14, CPU Threads: 20\nGraphics: Intel UHD Graphics 770	29500.00	33500.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i5 14600K 14th Gen Raptor Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core i5 14600K 14th Gen Raptor Lake Processor at ৳29,500 from LogicBay BD.	\N	f	t	2026-09-22 18:01:53.8	2026-09-22 18:07:52.64	2026-09-22 18:01:53.799
cmucze14l006mmhtfvuxtualh	AMD Ryzen 7 9700X AM5 Desktop Gaming Processor	amd-ryzen-7-9700x-gaming-processor	CPU-A-RYZEN79700XGAMING	\N	Clock Speed: 3.8 GHz Up to 5.5 GHz\nCores: 8, Threads: 16\nL2 Cache: 8MB, L3 Cache: 32MB\nCPU Socket: AM5	28000.00	33500.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 7 9700X AM5 Desktop Gaming Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 7 9700X AM5 Desktop Gaming Processor at ৳28,000 from LogicBay BD.	\N	f	t	2026-09-22 18:01:55.509	2026-09-22 18:07:52.64	2026-09-22 18:01:55.509
cmucze2m7006rmhtfnj6cqzuo	AMD Ryzen 9 5900X Processor	amd-ryzen-9-5900x-processor	CPU-A-RYZEN95900X	\N	Speed: 3.7GHz Up to 4.8GHz\nL2 Cache: 6MB, L3 Cache: 64MB\nCores: 12, Threads: 24\nUp to 3200MHz DDR4	35999.00	38000.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 9 5900X Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 9 5900X Processor at ৳35,999 from LogicBay BD.	\N	f	t	2026-09-22 18:01:57.44	2026-09-22 18:07:52.642	2026-09-22 18:01:57.439
cmucze4jx0071mhtf0dcgiqc1	Intel 13th Gen Core i7 13700KF Raptor Lake Processor	intel-13th-gen-core-i7-13700kf-processor	CPU-I-13THGENCOREI713700KF	\N	Clock Speed: 3.40 GHz up to 5.40 GHz\nCache: 30 MB Intel Smart Cache\nCPU Cores: 16, CPU Threads: 24\nSocket: LGA1700	39500.00	42900.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 13th Gen Core i7 13700KF Raptor Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel 13th Gen Core i7 13700KF Raptor Lake Processor at ৳39,500 from LogicBay BD.	\N	f	t	2026-09-22 18:01:59.95	2026-09-22 18:07:52.645	2026-09-22 18:01:59.949
cmucze5cu0076mhtfisxkijo2	AMD Ryzen 9 7900X Processor	amd-ryzen-9-7900x-processor	CPU-A-RYZEN97900X	\N	Clock Speed: 4.7GHz Up to 5.6GHz\nCores: 12, Threads: 24\nL2 Cache: 12MB, L3 Cache: 64MB\nSocket: AM5	39800.00	43500.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 9 7900X Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 9 7900X Processor at ৳39,800 from LogicBay BD.	\N	f	t	2026-09-22 18:02:00.99	2026-09-22 18:07:52.646	2026-09-22 18:02:00.99
cmucze6uz007bmhtfu3awyvz2	Intel 12th Gen Core i7-12700K Alder Lake Processor	intel-12th-gen-core-i7-12700k-alder-lake-processor	CPU-I-12THGENCOREI712700KALDERLAKE	\N	Clock Speed: 3.60 GHz Up to 5.0 GHz\nCores: 12, Threads: 20\nCache: 25 MB Intel Smart Cache\nSocket: LGA1700	34000.00	38500.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 12th Gen Core i7-12700K Alder Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel 12th Gen Core i7-12700K Alder Lake Processor at ৳34,000 from LogicBay BD.	\N	f	t	2026-09-22 18:02:02.94	2026-09-22 18:07:52.648	2026-09-22 18:02:02.94
cmucze7uk007gmhtfo4zk5719	Intel Core Ultra 7 270K Plus Arrow Lake Processor	intel-core-ultra-7-270k-plus-processor	CPU-I-COREULTRA7270KPLUS	\N	Clock Speed: 4.7 GHz up to 5.5 GHz\nCache: 36 MB, Socket: LGA1851\nCPU Cores: 24, CPU Threads: 24\nNPU: Intel AI Boost	38500.00	44000.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core Ultra 7 270K Plus Arrow Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core Ultra 7 270K Plus Arrow Lake Processor at ৳38,500 from LogicBay BD.	\N	f	t	2026-09-22 18:02:04.22	2026-09-22 18:07:52.649	2026-09-22 18:02:04.22
cmuczczt50008mhtf6fate690	AMD Athlon PRO 300GE AM4 Socket Desktop Processor with Radeon Vega 3 Graphics (Rebox)	amd-athlon-pro-300ge-processor	CPU-A-ATHLONPRO300GE	\N	Base Clock Speed 3.4GHz\nPackage AM4\nPCI Express PCIe 3.0	3990.00	5200.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Athlon PRO 300GE AM4 Socket Desktop Processor with Radeon Vega 3 Graphics (Rebox) Price in Bangladesh | LogicBay BD	Buy AMD Athlon PRO 300GE AM4 Socket Desktop Processor with Radeon Vega 3 Graphics (Rebox) at ৳3,990 from LogicBay BD.	\N	f	t	2026-09-22 18:01:07.145	2026-09-22 18:07:52.574	2026-09-22 18:01:07.143
cmucze9a7007lmhtf7c1gjyoc	Intel 13th Gen Core i7 13700 Raptor Lake Processor	intel-13th-gen-core-i7-13700-processor	CPU-I-13THGENCOREI713700	\N	Clock Speed: 2.10 GHz GHz up to 5.20 GHz\nCache: 30 MB, Socket: LGA1700\nCPU Cores: 16, CPU Threads: 24\nGraphics: Intel UHD Graphics 770	39000.00	44500.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 13th Gen Core i7 13700 Raptor Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel 13th Gen Core i7 13700 Raptor Lake Processor at ৳39,000 from LogicBay BD.	\N	f	t	2026-09-22 18:02:06.08	2026-09-22 18:07:52.65	2026-09-22 18:02:06.076
cmuczeb5p007vmhtfos5w9mv5	AMD Ryzen 9 9900X Gaming Processor	amd-ryzen-9-9900x-gaming-processor	CPU-A-RYZEN99900XGAMING	\N	Clock Speed: 4.4GHz Up to 5.6GHz\nCores: 12, Threads: 24\nL1 Cache: 960KB, L2 Cache: 12MB, L3 Cache: 64MB\nCPU Socket: AM5	42900.00	47990.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 9 9900X Gaming Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 9 9900X Gaming Processor at ৳42,900 from LogicBay BD.	\N	f	t	2026-09-22 18:02:08.51	2026-09-22 18:07:52.652	2026-09-22 18:02:08.506
cmuczecdv0080mhtfxcyg7pg6	Intel 13th Gen Core i7 13700K Raptor Lake Processor	intel-13th-gen-core-i7-13700k-processor	CPU-I-13THGENCOREI713700K	\N	Clock Speed: 3.40 GHz up to 5.40 GHz\nCache: 30 MB, Socket: LGA1700\nCPU Cores: 16, CPU Threads: 24\nGraphics: Intel UHD Graphics 770	43500.00	48500.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 13th Gen Core i7 13700K Raptor Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel 13th Gen Core i7 13700K Raptor Lake Processor at ৳43,500 from LogicBay BD.	\N	f	t	2026-09-22 18:02:10.1	2026-09-22 18:07:52.652	2026-09-22 18:02:10.096
cmuczecyp0085mhtfsob7rhh3	AMD Ryzen 9 5950X Processor	amd-ryzen-9-5950x-processor	CPU-A-RYZEN95950X	\N	Speed: 3.4GHz Up to 4.9GHz\nL2 Cache: 8MB, L3 Cache: 64MB\nCores: 16, Threads: 32\nUp to 3200MHz DDR4 Memory	45000.00	49000.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 9 5950X Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 9 5950X Processor at ৳45,000 from LogicBay BD.	\N	f	t	2026-09-22 18:02:10.85	2026-09-22 18:07:52.654	2026-09-22 18:02:10.846
cmuczedwm008amhtfqj5kwr8l	Intel Core i7 14700 14th Gen Raptor Lake Processor	intel-core-i7-14700-14th-gen-processor	CPU-I-COREI71470014THGEN	\N	Clock Speed: 4.2 GHz up to 5.4 GHz\nCache: 33 MB, Socket: LGA1700\nCPU Cores: 20, CPU Threads: 28\nGraphics: Intel UHD Graphics 770	39500.00	45000.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i7 14700 14th Gen Raptor Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core i7 14700 14th Gen Raptor Lake Processor at ৳39,500 from LogicBay BD.	\N	f	t	2026-09-22 18:02:12.07	2026-09-22 18:07:52.655	2026-09-22 18:02:12.066
cmuczefct008kmhtfpqzrd1i9	AMD Ryzen 9 7950X3D Gaming Processor	amd-ryzen-9-7950x3d-processor	CPU-A-RYZEN97950X3D	\N	Clock Speed: 4.2GHz Up to 5.7GHz\nCores: 16, Threads: 32\nL3 Cache: 128MB\nCPU Socket: AM5	49500.00	55000.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 9 7950X3D Gaming Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 9 7950X3D Gaming Processor at ৳49,500 from LogicBay BD.	\N	f	t	2026-09-22 18:02:13.949	2026-09-22 18:07:52.657	2026-09-22 18:02:13.946
cmuczegdh008pmhtfbp88x09g	AMD Ryzen 9 9950X Gaming Processor	amd-ryzen-9-9950x-gaming-processor	CPU-A-RYZEN99950XGAMING	\N	Clock Speed: 4.3GHz Up to 5.7GHz\nCores: 16, Threads: 32\nL1 Cache: 1280KB, L2 Cache: 16MB, L3 Cache: 64MB\nCPU Socket: AM5	53500.00	55000.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 9 9950X Gaming Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 9 9950X Gaming Processor at ৳53,500 from LogicBay BD.	\N	f	t	2026-09-22 18:02:15.269	2026-09-22 18:07:52.658	2026-09-22 18:02:15.266
cmuczehvd008umhtfve9dygqd	Intel Core i9 14900KF 14th Gen Raptor Lake Processor	intel-14th-gen-core-i9-14900kf-processor	CPU-I-14THGENCOREI914900KF	\N	Clock Speed: 3.20 GHz up to 6.00 GHz\nCache: 36 MB Intel Smart Cache\nCPU Cores: 24, CPU Threads: 32\nSocket: LGA1700	52000.00	58000.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i9 14900KF 14th Gen Raptor Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core i9 14900KF 14th Gen Raptor Lake Processor at ৳52,000 from LogicBay BD.	\N	f	t	2026-09-22 18:02:17.21	2026-09-22 18:07:52.659	2026-09-22 18:02:17.206
cmuczejhz008zmhtf833x4kqa	Intel Core i9 14900K 14th Gen Raptor Lake Processor	intel-14th-gen-core-i9-14900k-processor	CPU-I-14THGENCOREI914900K	\N	Clock Speed: 3.20 GHz up to 6.00 GHz\nCache: 36 MB Intel Smart Cache, Socket: LGA1700\nCPU Cores: 24, CPU Threads: 32\nIntel UHD Graphics 770	56800.00	62500.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i9 14900K 14th Gen Raptor Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core i9 14900K 14th Gen Raptor Lake Processor at ৳56,800 from LogicBay BD.	\N	f	t	2026-09-22 18:02:19.319	2026-09-22 18:07:52.661	2026-09-22 18:02:19.316
cmuczeku10099mhtf7n8yk5gv	AMD RYZEN 7 9850X3D Gaming Processor	amd-ryzen-7-9850x3d-processor	CPU-A-RYZEN79850X3D	\N	Clock Speed: 4.7GHz Up to 5.6GHz\nCores: 8, Threads: 16\nL1 Cache: 640 KB, L2 Cache: 8 MB, L3 Cache: 96 MB\nCPU Socket: AM5	58500.00	63000.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD RYZEN 7 9850X3D Gaming Processor Price in Bangladesh | LogicBay BD	Buy AMD RYZEN 7 9850X3D Gaming Processor at ৳58,500 from LogicBay BD.	\N	f	t	2026-09-22 18:02:21.049	2026-09-22 18:07:52.663	2026-09-22 18:02:21.046
cmuczelg9009emhtf5gg79ukw	Intel Core Ultra 9 285K Arrow Lake Processor	intel-core-ultra-9-285k-processor	CPU-I-COREULTRA9285K	\N	Clock Speed: 3.2GHz up to 5.7GHz\nCache: 36 MB, Socket: LGA1851\nCPU Cores: 24, CPU Threads: 24\nNPU: Intel AI Boost	58000.00	64500.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core Ultra 9 285K Arrow Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core Ultra 9 285K Arrow Lake Processor at ৳58,000 from LogicBay BD.	\N	f	t	2026-09-22 18:02:21.85	2026-09-22 18:07:52.664	2026-09-22 18:02:21.846
cmuczemef009jmhtf8f8nhdh8	AMD Ryzen 9 9900X3D Gaming Processor	amd-ryzen-9-9900x3d-processor	CPU-A-RYZEN99900X3D	\N	Clock Speed: 4.4GHz Up to 5.5GHz\nCores: 12; Threads: 24\nCache: L1: 960KB; L2: 12MB; L3: 128MB\nCPU Socket: AM5	61800.00	69500.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 9 9900X3D Gaming Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 9 9900X3D Gaming Processor at ৳61,800 from LogicBay BD.	\N	f	t	2026-09-22 18:02:23.079	2026-09-22 18:07:52.665	2026-09-22 18:02:23.076
cmuczen8f009omhtfeyrd47re	AMD Ryzen 9 9950X3D Gaming Processor	amd-ryzen-9-9950x3d-processor	CPU-A-RYZEN99950X3D	\N	Clock Speed: 4.3GHz Up to 5.7GHz\nCores: 16; Threads: 32\nCache: L1 : 1280KB; L2 : 16MB; L3 : 128MB\nCPU Socket: AM5	77500.00	85000.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 9 9950X3D Gaming Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 9 9950X3D Gaming Processor at ৳77,500 from LogicBay BD.	\N	f	t	2026-09-22 18:02:24.159	2026-09-22 18:07:52.666	2026-09-22 18:02:24.156
cmuczd1bg000imhtf8v98k9y1	AMD Ryzen 5 Pro 2400GE Desktop Processor with Radeon RX Vega 11 Graphics	amd-ryzen-5-pro-2400ge-processor	CPU-A-RYZEN5PRO2400GE	\N	Speed: 3.2GHz Up To 3.8GHz\nCache: L1 384KB L2 2MB L3 4MB\nCores-4 & Threads-8\nPowerful Radeon Vega graphics	6200.00	7200.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 Pro 2400GE Desktop Processor with Radeon RX Vega 11 Graphics Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 5 Pro 2400GE Desktop Processor with Radeon RX Vega 11 Graphics at ৳6,200 from LogicBay BD.	\N	f	t	2026-09-22 18:01:09.1	2026-09-22 18:07:52.581	2026-09-22 18:01:09.099
cmuczfepr0002dmdmxlb8v8or	AMD Ryzen 3 4100 Processor	amd-ryzen-3-4100-processor	CPU-A-RYZEN34100	\N	Clock Speed: 3.8GHz; Up to 4.0GHz\nL1 Cache: 256KB; L2 Cache: 2MB; L3 Cache: 4MB\n4 Cores & 8 Threads\nCPU Socket: AM4	8700.00	10000.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	\N	\N	\N	f	t	2026-09-22 18:02:59.775	2026-09-22 18:07:52.587	2026-09-22 18:02:59.772
cmuczd6dy001cmhtf6qwvxe2s	Intel Core i3 10105 10th Gen Comet Lake Processor	intel-core-i3-10105-10th-gen-processor	CPU-I-COREI31010510THGEN	\N	Socket Supported FCLGA1200\nSpeed 3.70 GHz up to 4.40 GHz\nCores- 4 & Threads- 8, 6M Cache\nIntel UHD Graphics 630	10400.00	12500.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i3 10105 10th Gen Comet Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core i3 10105 10th Gen Comet Lake Processor at ৳10,400 from LogicBay BD.	\N	f	t	2026-09-22 18:01:15.67	2026-09-22 18:07:52.591	2026-09-22 18:01:15.669
cmuczda9o0021mhtfo1gveq7b	Intel Core i5-11500T 11th Gen Processor	intel-core-i5-11500t-11th-gen-processor	CPU-I-COREI511500T11THGEN	\N	Clock Speed: 1.50 GHz Up to 3.90 GHz\nCache: 12 MB, Socket: LGA1200\nCPU Cores: 6, CPU Threads: 12\nGPU name: Intel UHD Graphics 750	15200.00	\N	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i5-11500T 11th Gen Processor Price in Bangladesh | LogicBay BD	Buy Intel Core i5-11500T 11th Gen Processor at ৳15,200 from LogicBay BD.	\N	f	t	2026-09-22 18:01:20.7	2026-09-22 18:07:52.598	2026-09-22 18:01:20.699
cmu2p7kdf007vaap1w8ihfmcu	AMD Ryzen 5 5600 Desktop Processor	amd-ryzen-5-5600	CPU-R5-5600	Ryzen 5000 series value desktop processor. Fill your own long description before publish.	Speed: 3.5GHz up to 4.4GHz\nCache: L2: 3MB, L3: 32MB; Cores-6 & Threads-12\nMemory Speed: DDR4 Up to 3200MHz\nAMD ZEN 3 Architecture	12400.00	14000.00	\N	IN_STOCK	0	5	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	Buy AMD Ryzen 5 5600 in Bangladesh | LogicBay BD	AMD Ryzen 5 5600 desktop processor. Check price and warranty at LogicBay BD.	processor amd ryzen 5 5600	f	t	2026-09-15 13:19:15.939	2026-09-22 18:07:52.6	2026-09-15 13:19:15.938
cmuczde53002vmhtfwkvc4d8o	AMD Ryzen 5 PRO 5650GE Processor with Radeon Graphics	amd-ryzen-5-pro-5650ge-processor	CPU-A-RYZEN5PRO5650GE	\N	Speed: 3.4GHz up to 4.4GHz\nCache: L2: 3MB, L3: 16MB\nCores-6 & Threads-12\nCPU Socket: AM4	16200.00	17200.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 PRO 5650GE Processor with Radeon Graphics Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 5 PRO 5650GE Processor with Radeon Graphics at ৳16,200 from LogicBay BD.	\N	f	t	2026-09-22 18:01:25.72	2026-09-22 18:07:52.607	2026-09-22 18:01:25.719
cmuczdgb8003fmhtfvn0q997d	Intel Core i3 14100 14th Gen Raptor Lake Processor	intel-core-i3-14100-14th-gen-processor	CPU-I-COREI31410014THGEN	\N	Clock Speed: 3.5 GHz up to 4.7 GHz\nCache: 12 MB, Socket: LGA1700\nCPU Cores: 4; CPU Threads: 8\nIntel UHD Graphics 730	13900.00	16500.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i3 14100 14th Gen Raptor Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core i3 14100 14th Gen Raptor Lake Processor at ৳13,900 from LogicBay BD.	\N	f	t	2026-09-22 18:01:28.533	2026-09-22 18:07:52.612	2026-09-22 18:01:28.532
cmuczdhtm003pmhtfyik2s4fj	AMD Ryzen 5 5600GT AM4 Processor with Radeon Graphics	amd-ryzen-5-5600gt-processor	CPU-A-RYZEN55600GT	\N	Clock Speed: 3.6GHz; Up to 4.6GHz\nL2 Cache: 3MB; L3 Cache: 16MB\n6 Cores & 12 Threads\nCPU Socket: AM4	17900.00	18500.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 5 5600GT AM4 Processor with Radeon Graphics Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 5 5600GT AM4 Processor with Radeon Graphics at ৳17,900 from LogicBay BD.	\N	f	t	2026-09-22 18:01:30.491	2026-09-22 18:07:52.616	2026-09-22 18:01:30.49
cmuczdnle004emhtfkbo8yhvm	AMD Ryzen 7 5700G Processor with Radeon Graphics	amd-ryzen-7-5700g-processor	CPU-A-RYZEN75700G	\N	Speed: 3.8GHz up to 4.6GHz\nCache: L2: 4MB, L3: 16MB\nCores-8 & Threads-16\nMemory Speed: Up to 3200MHz	21900.00	24000.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 7 5700G Processor with Radeon Graphics Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 7 5700G Processor with Radeon Graphics at ৳21,900 from LogicBay BD.	\N	f	t	2026-09-22 18:01:37.97	2026-09-22 18:07:52.622	2026-09-22 18:01:37.97
cmuczds3v004ymhtf4ewemk50	Intel Core i5 14400 14th Gen Raptor Lake Processor	intel-core-i5-14400-14th-gen-processor	CPU-I-COREI51440014THGEN	\N	Clock Speed: 3.5 GHz up to 4.7 GHz\nCache: 20 MB, Socket: LGA1700\nCPU Cores: 10, CPU Threads: 16\nGraphics: Intel UHD Graphics 730	19000.00	22000.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i5 14400 14th Gen Raptor Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core i5 14400 14th Gen Raptor Lake Processor at ৳19,000 from LogicBay BD.	\N	f	t	2026-09-22 18:01:43.82	2026-09-22 18:07:52.627	2026-09-22 18:01:43.819
cmuczdsld0053mhtfcewx4wa0	Intel 12th Gen Core i5-12500 Alder Lake Processor	intel-12th-gen-core-i5-12500-alder-lake-processor	CPU-I-12THGENCOREI512500ALDERLAKE	\N	Clock Speed: 3.00 GHz Up to 4.60 GHz\nCache: 18 MB, Socket: LGA1700\nCPU Cores: 6, CPU Threads: 12\nGraphics: Intel UHD Graphics 770	23200.00	25500.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 12th Gen Core i5-12500 Alder Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel 12th Gen Core i5-12500 Alder Lake Processor at ৳23,200 from LogicBay BD.	\N	f	t	2026-09-22 18:01:44.45	2026-09-22 18:07:52.628	2026-09-22 18:01:44.449
cmuczdvuc005smhtfcj5hq3j9	Intel Core i5 14500 14th Gen Raptor Lake Processor	intel-core-i5-14500-14th-gen-processor	CPU-I-COREI51450014THGEN	\N	Clock Speed: 3.7 GHz up to 5.0 GHz\nCache: 24 MB, Socket: LGA1700\nCPU Cores: 14, CPU Threads: 20\nGraphics: Intel UHD Graphics 770	27300.00	31000.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i5 14500 14th Gen Raptor Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core i5 14500 14th Gen Raptor Lake Processor at ৳27,300 from LogicBay BD.	\N	f	t	2026-09-22 18:01:48.66	2026-09-22 18:07:52.633	2026-09-22 18:01:48.66
cmuczdyzd006cmhtf8vx62wvc	AMD Ryzen 7 8700G Processor with Radeon Graphics	amd-ryzen-7-8700g-processor	CPU-A-RYZEN78700G	\N	Clock Speed: 4.2GHz Up to 5.1GHz\nCores: 8, Threads: 16\nL2 Cache: 8MB, L3 Cache: 16MB\nSocket: AM5	30500.00	33000.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 7 8700G Processor with Radeon Graphics Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 7 8700G Processor with Radeon Graphics at ৳30,500 from LogicBay BD.	\N	f	t	2026-09-22 18:01:52.73	2026-09-22 18:07:52.639	2026-09-22 18:01:52.729
cmucze3yj006wmhtfqayp3cp7	Intel 12th Gen Core i7-12700 Alder Lake Processor	intel-12th-gen-core-i7-12700-alder-lake-processor	CPU-I-12THGENCOREI712700ALDERLAKE	\N	Clock Speed: 2.10 GHz Up to 4.80 GHz\nCache: 25MB, Socket: LGA1700\nCPU Cores: 12, CPU Threads: 20\nGPU: Intel UHD Graphics 770	33000.00	37500.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel 12th Gen Core i7-12700 Alder Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel 12th Gen Core i7-12700 Alder Lake Processor at ৳33,000 from LogicBay BD.	\N	f	t	2026-09-22 18:01:59.18	2026-09-22 18:07:52.643	2026-09-22 18:01:59.18
cmuczea2u007qmhtf364bvmd6	Intel Core i7 14700KF 14th Gen Raptor Lake Processor	intel-14th-gen-core-i7-14700kf-processor	CPU-I-14THGENCOREI714700KF	\N	Clock Speed: 3.4 GHz up to 5.6 GHz\nCache: 33 MB Intel Smart Cache\nCPU Cores: 20, CPU Threads: 28\nSocket: LGA1700	44500.00	47000.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i7 14700KF 14th Gen Raptor Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core i7 14700KF 14th Gen Raptor Lake Processor at ৳44,500 from LogicBay BD.	\N	f	t	2026-09-22 18:02:07.111	2026-09-22 18:07:52.651	2026-09-22 18:02:07.107
cmuczeent008fmhtfvk0ci4tq	Intel Core i7 14700K 14th Gen Raptor Lake Processor	intel-14th-gen-core-i7-14700k-processor	CPU-I-14THGENCOREI714700K	\N	Clock Speed: 3.4 GHz up to 5.6 GHz\nCache: 33 MB, Socket: LGA1700\nCPU Cores: 20, CPU Threads: 28\nGraphics: Intel UHD Graphics 770	47500.00	53000.00	\N	IN_STOCK	10	3	cmr9bvs3l001mnjjlqu2ps65y	cmr9bvs140004njjlq3f0ltgt	Intel Core i7 14700K 14th Gen Raptor Lake Processor Price in Bangladesh | LogicBay BD	Buy Intel Core i7 14700K 14th Gen Raptor Lake Processor at ৳47,500 from LogicBay BD.	\N	f	t	2026-09-22 18:02:13.049	2026-09-22 18:07:52.656	2026-09-22 18:02:13.046
cmuczek020094mhtf8gxu25yp	AMD Ryzen 7 9800X3D Gaming Processor	amd-ryzen-7-9800x3d-processor	CPU-A-RYZEN79800X3D	\N	Clock Speed: 4.7GHz Up to 5.2GHz\nCores: 8, Threads: 16\nL1 Cache: 640 KB, L2 Cache: 8 MB, L3 Cache: 96 MB\nCPU Socket: AM5	50500.00	61500.00	\N	IN_STOCK	10	3	cmr9bvs3n001onjjl46q890qi	cmr9bvs0u0002njjlrpqvkmbi	AMD Ryzen 7 9800X3D Gaming Processor Price in Bangladesh | LogicBay BD	Buy AMD Ryzen 7 9800X3D Gaming Processor at ৳50,500 from LogicBay BD.	\N	f	t	2026-09-22 18:02:19.97	2026-09-22 18:07:52.662	2026-09-22 18:02:19.966
cmudstxzt004w12ernmf0xv62	Colorful GeForce GT710-2GD3-V 2GB Graphics Card	colorful-geforce-gt710-2gd3-v-2gb-graphics-card	GPU-COLORFUL-GT710-2GD3-V-2GB	\N	Single Fan • No Power Supply • Powered by GeForce GT710 • Integrated with 2GB GDDR5 64-bit	6500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs24000onjjll00hq9a9	Buy Colorful GeForce GT710-2GD3-V 2GB Graphics Card in Bangladesh | LogicBay BD	Colorful GeForce GT710-2GD3-V 2GB Graphics Card. Check price and warranty at LogicBay BD.	graphics card, colorful, nvidia geforce, 2gb	f	t	2026-09-23 07:46:06.81	2026-09-23 07:46:06.81	2026-09-23 07:46:06.805
cmudsty0u005r12er7fotxvp3	ASUS GeForce GT 710 2GB GDDR5 EVO Low-profile Graphics Card	asus-geforce-gt-710-2gb-gddr5-evo-low-profile-graphics-card	GPU-ASUS-GT-710-2GB-GDDR5-EVO-LOW-PROFIL	\N	Engine Clock: 954 MHz • Memory: 2GB GDDR5 • Memory Speed: 5012 MHz • Output: 1x HDMI2.0b, 1x Native DVI-D	8400.00	8500.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs160005njjlpsmet0fp	Buy ASUS GeForce GT 710 2GB GDDR5 EVO Low-profile Graphics Card in Bangladesh | LogicBay BD	ASUS GeForce GT 710 2GB GDDR5 EVO Low-profile Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, nvidia geforce, 7102gb	f	t	2026-09-23 07:46:06.847	2026-09-23 07:46:06.847	2026-09-23 07:46:06.842
cmudsty1b006512erxddomgkp	OCPC GeForce GT 730 4GB DDR3 Graphics Card	ocpc-geforce-gt-730-4gb-ddr3-graphics-card	GPU-OCPC-GT-730-4GB-DDR3	\N	Boost Clock: 700 MHz, Base Clock: 700 MHz • CUDA cores: 384, Memory Interface: 128-bit • Width: Single Slot • Outputs: 1x HDMI, 1x DVI, 1x VGA	8100.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1t000hnjjllhkj3m9h	Buy OCPC GeForce GT 730 4GB DDR3 Graphics Card in Bangladesh | LogicBay BD	OCPC GeForce GT 730 4GB DDR3 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, ocpc, nvidia geforce, 7304gb	f	t	2026-09-23 07:46:06.863	2026-09-23 07:46:06.863	2026-09-23 07:46:06.859
cmudsty2e007212er8n199i2h	MSI GT 710 2GD3H LP 2GB DDR3 Gaming Graphic Card	msi-gt-710-2gd3h-lp-2gb-ddr3-gaming-graphic-card	GPU-MSI-GT-710-2GD3H-LP-2GB-DDR3-GAMING	\N	Boost Clock: 1600 MHz • D-Sub x 1/ HDMI x 1/ DL-DVI-D x 1 • Predator: In-game video recording • Lower temperature and higher efficiency	9100.00	9300.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GT 710 2GD3H LP 2GB DDR3 Gaming Graphic Card in Bangladesh | LogicBay BD	MSI GT 710 2GD3H LP 2GB DDR3 Gaming Graphic Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 2gb	f	t	2026-09-23 07:46:06.902	2026-09-23 07:46:06.902	2026-09-23 07:46:06.897
cmudsty3q007w12ernj5jmvfr	Asus Geforce Gt 730 2GB GDDR5 Graphics Card	asus-geforce-gt-730-2gb-gddr5-graphics-card	GPU-ASUS-GT-730-2GB-GDDR5	\N	Breakthrough Graphics Performance • Auto-Extreme Technology • GPU Tweak II • Fan less Silent Cooling head Sinks	10700.00	11000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs160005njjlpsmet0fp	Buy Asus Geforce Gt 730 2GB GDDR5 Graphics Card in Bangladesh | LogicBay BD	Asus Geforce Gt 730 2GB GDDR5 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, nvidia geforce, 7302gb	f	t	2026-09-23 07:46:06.95	2026-09-23 07:46:06.95	2026-09-23 07:46:06.945
cmudsty57008a12er76xhq3lo	ARKTEK AMD Radeon RX 550 4GB GDDR5 Graphics Card	arktek-amd-radeon-rx-550-4gb-gddr5-graphics-card	GPU-ARKTEK-RX-550-4GB-GDDR5	\N	Engine Clock: 1287MHz • Stream Processors: 640SP • Memory Clock: 7000MHz • Display Outputs: 1 x HDMI, 1 x DVI, 1 x Display Port	12500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudsty55008712erkwczrpk4	Buy ARKTEK AMD Radeon RX 550 4GB GDDR5 Graphics Card in Bangladesh | LogicBay BD	ARKTEK AMD Radeon RX 550 4GB GDDR5 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, arktek, amd radeon, 5504gb	f	t	2026-09-23 07:46:07.003	2026-09-23 07:46:07.003	2026-09-23 07:46:06.998
cmudsty69008p12eric4djq2u	MSI GeForce GT 730 4GB DDR3 Graphics Card	msi-geforce-gt-730-4gb-ddr3-graphics-card	GPU-MSI-GT-730-4GB-DDR3	\N	Core Clocks 700 MHz • Memory Size: 4096 • Memory: 4GB DDR3 • Output: HDMI x1, D-SUB x1, DVI x1	12400.00	12900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce GT 730 4GB DDR3 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce GT 730 4GB DDR3 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 7304gb	f	t	2026-09-23 07:46:07.042	2026-09-23 07:46:07.042	2026-09-23 07:46:07.037
cmudsty6t009212erp9ouukyl	OCPC RX 550 XR 4GB GDDR5 Graphics Card	ocpc-rx-550-xr-4gb-gddr5-graphics-card	GPU-OCPC-RX-550-XR-4GB-GDDR5	\N	Memroy Size: 4GB GDDR5 • Base Clock: 1100 MHz • Memory Interface: 128‑bit • Video Output: 1 x DP, 1 x HDMI, 1 x DVI	13900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmr9bvs1t000hnjjllhkj3m9h	Buy OCPC RX 550 XR 4GB GDDR5 Graphics Card in Bangladesh | LogicBay BD	OCPC RX 550 XR 4GB GDDR5 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, ocpc, amd radeon, 4gb	f	t	2026-09-23 07:46:07.061	2026-09-23 07:46:07.061	2026-09-23 07:46:07.057
cmudsty80009z12erh29741nz	Gunnir Intel ARC A310 Index 4GB GDDR6 Graphics Card	gunnir-intel-arc-a310-index-4gb-gddr6-graphics-card	GPU-GUNNIR-ARC-A310-INDEX-4GB-GDDR6	\N	Maximum Graphics Clock: 2000 MHz • Video Memory: 4GB GDDR6 • Memory Frequency: 15.5 Gbps • Output Ports: DP x3, HDMI x1	12900.00	14000.00	\N	IN_STOCK	0	5	cmr9bvs3p001qnjjlnzrmtdrs	cmudsty7z009w12ercqys44k0	Buy Gunnir Intel ARC A310 Index 4GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Gunnir Intel ARC A310 Index 4GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, gunnir, intel arc, 4gb	f	t	2026-09-23 07:46:07.105	2026-09-23 07:46:07.105	2026-09-23 07:46:07.1
cmudsty9z00ba12ersqftgf46	Asus Geforce GT 730 2GB GDDR5 Graphics Card with 4 HDMI Ports	asus-geforce-gt-730-2gb-gddr5-graphics-card-with-4-hdmi-ports	GPU-ASUS-GT-730-2GB-GDDR5-WITH-4-HDMI-PO	\N	OC mode: 927 MHz (Boost Clock) • Gaming mode: 902 MHz (Boost Clock) • Memory Type: GDDR5, Memory Bus: 64-bit • Output: 4 x HDMI 1.4b, HDCP Support	16400.00	16500.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs160005njjlpsmet0fp	Buy Asus Geforce GT 730 2GB GDDR5 Graphics Card with 4 HDMI Ports in Bangladesh | LogicBay BD	Asus Geforce GT 730 2GB GDDR5 Graphics Card with 4 HDMI Ports. Check price and warranty at LogicBay BD.	graphics card, asus, nvidia geforce, 7302gb	f	t	2026-09-23 07:46:07.175	2026-09-23 07:46:07.175	2026-09-23 07:46:07.17
cmudstyav00bn12erlcbwisvg	ARKTEK AMD Radeon RX 550 8GB GDDR5 Graphics Card	arktek-amd-radeon-rx-550-8gb-gddr5-graphics-card	GPU-ARKTEK-RX-550-8GB-GDDR5	\N	Engine Clock: 1287MHz • Stream Processors: 640SP • Memory Clock: 7000MHz • Display Outputs: 1 x HDMI, 1 x DVI, 1 x Display Port	16900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudsty55008712erkwczrpk4	Buy ARKTEK AMD Radeon RX 550 8GB GDDR5 Graphics Card in Bangladesh | LogicBay BD	ARKTEK AMD Radeon RX 550 8GB GDDR5 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, arktek, amd radeon, 5508gb	f	t	2026-09-23 07:46:07.207	2026-09-23 07:46:07.207	2026-09-23 07:46:07.202
cmudstybq00c212erzrrkok1y	GIGABYTE Intel Arc A310 WINDFORCE 4G GDDR6 Graphics Card	gigabyte-intel-arc-a310-windforce-4g-gddr6-graphics-card	GPU-GIGABYTE-ARC-A310-WINDFORCE-4G-GDDR6	\N	Graphics Clock: 2000 MHz • Memory: 4GB GDDR6 • Memory Bandwidth (GB/sec): 124 GB/s • Output: DP x2, HDMI x2	15900.00	17000.00	\N	IN_STOCK	0	5	cmr9bvs3p001qnjjlnzrmtdrs	cmr9bvs2f000wnjjlhveyideo	Buy GIGABYTE Intel Arc A310 WINDFORCE 4G GDDR6 Graphics Card in Bangladesh | LogicBay BD	GIGABYTE Intel Arc A310 WINDFORCE 4G GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, gigabyte, intel arc,	f	t	2026-09-23 07:46:07.239	2026-09-23 07:46:07.239	2026-09-23 07:46:07.234
cmudstyd900cs12err78udcs9	Unika Radeon RX 580 BLIZZARDS 8GD5 V2 8GB GDDR5 Graphics Card	unika-radeon-rx-580-blizzards-8gd5-v2-8gb-gddr5-graphics-card	GPU-UNIKA-RX-580-BLIZZARDS-8GD5-V2-8GB-G	\N	Video Memory: 8GB GDDR5, Stream Processor: 2048 • Memory Clock: 7000MHz, Boost Clock: 1244MHz • Memory Interface: 256bit, Interface Type: PCI-E 3.0 • Interface: 2x DisplayPort, 1x HDMI	17800.00	18500.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudstyd500cp12er2y8o1ib9	Buy Unika Radeon RX 580 BLIZZARDS 8GD5 V2 8GB GDDR5 Graphics Card in Bangladesh | LogicBay BD	Unika Radeon RX 580 BLIZZARDS 8GD5 V2 8GB GDDR5 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, unika, amd radeon, 8gb	f	t	2026-09-23 07:46:07.293	2026-09-23 07:46:07.293	2026-09-23 07:46:07.288
cmudstyee00d812er2ojfr1rx	OCPC RX 580 8GB DDR5 XX BLACK Graphics Card	ocpc-rx-580-8gb-ddr5-xx-black-graphics-card	GPU-OCPC-RX-580-8GB-DDR5-XX-BLACK	\N	Memory Clock: 1500 Mhz • Boost Clock: Up to 1206 MHz • Stream Processors: 2048SP • Video Output: 3 x DP, 1 x HDMI	18900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmr9bvs1t000hnjjllhkj3m9h	Buy OCPC RX 580 8GB DDR5 XX BLACK Graphics Card in Bangladesh | LogicBay BD	OCPC RX 580 8GB DDR5 XX BLACK Graphics Card. Check price and warranty at LogicBay BD.	graphics card, ocpc, amd radeon, 5808gb	f	t	2026-09-23 07:46:07.334	2026-09-23 07:46:07.334	2026-09-23 07:46:07.329
cmudstyfd00dk12erznevxzpf	PELADN RX 580 8G 256Bit Dual Fans Gaming Graphics Card	peladn-rx-580-8g-256bit-dual-fans-gaming-graphics-card	GPU-PELADN-RX-580-8G-256BIT-DUAL-FANS-GA	\N	Base: 1125 Mhz • Memory Clock: Up to 1750 Mhz • Video Output: 3 x DP, 1 x HDMI • Two-fan cooling system	17999.00	19000.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmtn590a70000jq5x2w1gp882	Buy PELADN RX 580 8G 256Bit Dual Fans Gaming Graphics Card in Bangladesh | LogicBay BD	PELADN RX 580 8G 256Bit Dual Fans Gaming Graphics Card. Check price and warranty at LogicBay BD.	graphics card, peladn, amd radeon,	f	t	2026-09-23 07:46:07.369	2026-09-23 07:46:07.369	2026-09-23 07:46:07.364
cmudstyfv00du12er9xcxfmto	MSI GeForce GT 1030 AERO ITX OC 4GB GDDR4 Graphic Card	msi-geforce-gt-1030-aero-itx-oc-4gb-gddr4-graphic-card	GPU-MSI-GT-1030-AERO-ITX-OC-4GB-GDDR4	\N	Boost Clock: 1430 MHz, Memory Speed: 2100 MHz • Memory: 4GB GDDR4, Direct X 12, Open GL 4.5 • Memory BUS: 64-bit; PCI Express 3.0 • Output: HDmI x 1, DVI x 1	16999.00	19500.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce GT 1030 AERO ITX OC 4GB GDDR4 Graphic Card in Bangladesh | LogicBay BD	MSI GeForce GT 1030 AERO ITX OC 4GB GDDR4 Graphic Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 4gb	f	t	2026-09-23 07:46:07.388	2026-09-23 07:46:07.388	2026-09-23 07:46:07.383
cmudstygb00e712ervhilh295	ARKTEK RX 580 8GB 256bit GDDR5 Graphics Card	arktek-rx-580-8gb-256bit-gddr5-graphics-card	GPU-ARKTEK-RX-580-8GB-256BIT-GDDR5	\N	Video Memory: 8GB GDDR5 • Engine Clock: 1257~1340 MHz True Clock • Resolution: 3840 x 2160@120Hz • Interface: 3 x DP, 1 x HDMI	20500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudsty55008712erkwczrpk4	Buy ARKTEK RX 580 8GB 256bit GDDR5 Graphics Card in Bangladesh | LogicBay BD	ARKTEK RX 580 8GB 256bit GDDR5 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, arktek, amd radeon, 8gb	f	t	2026-09-23 07:46:07.403	2026-09-23 07:46:07.403	2026-09-23 07:46:07.399
cmudstygv00ep12erojl4bh63	PELADN RX 5500 8G GDDR6 Dual Fan Gaming Graphics Card	peladn-rx-5500-8g-gddr6-dual-fan-gaming-graphics-card	GPU-PELADN-RX-5500-8G-GDDR6-DUAL-FAN-GAM	\N	Memory Clock Speed: 1750MHz • Memory Bandwidth: 224GB/s • Two-fan cooling system • Display Outputs: 1x HDMI, 3x DisplayPort	22500.00	24500.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmtn590a70000jq5x2w1gp882	Buy PELADN RX 5500 8G GDDR6 Dual Fan Gaming Graphics Card in Bangladesh | LogicBay BD	PELADN RX 5500 8G GDDR6 Dual Fan Gaming Graphics Card. Check price and warranty at LogicBay BD.	graphics card, peladn, amd radeon,	f	t	2026-09-23 07:46:07.423	2026-09-23 07:46:07.423	2026-09-23 07:46:07.419
cmudstyhx00fe12er5x14xat3	GIGABYTE Intel Arc A380 GAMING OC 6G GDDR6 Graphics Card	gigabyte-intel-arc-a380-gaming-oc-6g-gddr6-graphics-card	GPU-GIGABYTE-ARC-A380-GAMING-OC-6G-GDDR6	\N	Graphics Clock: 2450 MHz (Reference card: 2000 MHz) • Memory: 6GB GDDR6 • Memory Bandwidth (GB/sec): 186 GB/s • Output: DP x2, HDMI x2	24500.00	26000.00	\N	IN_STOCK	0	5	cmr9bvs3p001qnjjlnzrmtdrs	cmr9bvs2f000wnjjlhveyideo	Buy GIGABYTE Intel Arc A380 GAMING OC 6G GDDR6 Graphics Card in Bangladesh | LogicBay BD	GIGABYTE Intel Arc A380 GAMING OC 6G GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, gigabyte, intel arc,	f	t	2026-09-23 07:46:07.461	2026-09-23 07:46:07.461	2026-09-23 07:46:07.457
cmudstyic00fp12eraisuhrax	ASUS Dual Radeon RX 6500 XT V2 OC Edition 4GB GDDR6 Graphics Card	asus-dual-radeon-rx-6500-xt-v2-oc-edition-4gb-gddr6-graphics-card	GPU-ASUS-DUAL-RX-6500-XT-V2-OC-EDITION-4	\N	Video Memory: 4GB GDDR6, PCI Express 4.0 • Engine Clock: Max. 2820 MHz (Boost Clock), 2670 MHz (Game Clock) • Stream Processors: 1024, Memory Speed: 18 Gbps • Display Outputs: 1x HDMI 2.1, 1x DisplayPort 1.4a	29900.00	26000.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmr9bvs160005njjlpsmet0fp	Buy ASUS Dual Radeon RX 6500 XT V2 OC Edition 4GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	ASUS Dual Radeon RX 6500 XT V2 OC Edition 4GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, amd radeon, 4gb	f	t	2026-09-23 07:46:07.476	2026-09-23 07:46:07.476	2026-09-23 07:46:07.472
cmudstyit00g312erboagu5q8	ARKTEK GTX 1660 Super 6GB GDDR6 Graphics Card	arktek-gtx-1660-super-6gb-gddr6-graphics-card	GPU-ARKTEK-GTX-1660-SUPER-6GB-GDDR6	\N	Engine Clock: 1530~1785MHz • Stream Processors: 1408SP • Memory Clock: 14Gbps • Display Outputs: 1 x DP 1 x HDMI 1 x DVI	27500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudsty55008712erkwczrpk4	Buy ARKTEK GTX 1660 Super 6GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	ARKTEK GTX 1660 Super 6GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, arktek, nvidia geforce, 6gb	f	t	2026-09-23 07:46:07.493	2026-09-23 07:46:07.493	2026-09-23 07:46:07.489
cmudstyjf00gi12erc71ye5ib	ARKTEK GeForce GTX 1660 Ti 6GB GDDR6 Graphics Card	arktek-geforce-gtx-1660-ti-6gb-gddr6-graphics-card	GPU-ARKTEK-GTX-1660-TI-6GB-GDDR6	\N	Engine Clock: 1500 ~ 1770 MHz • Stream Processors: 1536SP • Memory Clock: 12Gbps • Display Outputs: 1 x DP 1 x HDMI 1 x DVI	27500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudsty55008712erkwczrpk4	Buy ARKTEK GeForce GTX 1660 Ti 6GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	ARKTEK GeForce GTX 1660 Ti 6GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, arktek, nvidia geforce, 6gb	f	t	2026-09-23 07:46:07.515	2026-09-23 07:46:07.515	2026-09-23 07:46:07.51
cmudstyjx00gx12eruyrgituu	PELADN RX 5500 XT 8G GDDR6 Dual Fan Black Gaming Graphics Card	peladn-rx-5500-xt-8g-gddr6-dual-fan-black-gaming-graphics-card	GPU-PELADN-RX-5500-XT-8G-GDDR6-DUAL-FAN-	\N	Core Frequency: 1717MHz • Memory Clock Speed: 14000MHz • Video Output: 3DP+HDMI • Two-fan cooling system	25000.00	28000.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmtn590a70000jq5x2w1gp882	Buy PELADN RX 5500 XT 8G GDDR6 Dual Fan Black Gaming Graphics Card in Bangladesh | LogicBay BD	PELADN RX 5500 XT 8G GDDR6 Dual Fan Black Gaming Graphics Card. Check price and warranty at LogicBay BD.	graphics card, peladn, amd radeon,	f	t	2026-09-23 07:46:07.533	2026-09-23 07:46:07.533	2026-09-23 07:46:07.529
cmudstykg00h812ertr1jpxpi	OCPC GeForce GTX 1660 Ti XM 6GB GDDR6 Graphics Card	ocpc-geforce-gtx-1660-ti-xm-6gb-gddr6-graphics-card	GPU-OCPC-GTX-1660-TI-XM-6GB-GDDR6	\N	Base Clock: 1500 MHz, Boost Clock: 1770 MHz • Memory: 6GB GDDR6, CUDA Cores: 1536 • Memory Interface: 192-Bits; Bandwidth: 336.0 GB/s • Outputs: 1x DisplayPort, 1x HDMI, 1x Dual-Link DVI	29200.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1t000hnjjllhkj3m9h	Buy OCPC GeForce GTX 1660 Ti XM 6GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	OCPC GeForce GTX 1660 Ti XM 6GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, ocpc, nvidia geforce, 6gb	f	t	2026-09-23 07:46:07.552	2026-09-23 07:46:07.552	2026-09-23 07:46:07.547
cmudstyli00i312eru6zx0w43	Colorful GeForce RTX 3050 6GB V4-V GDDR6 Graphics Card	colorful-geforce-rtx-3050-6gb-v4-v-gddr6-graphics-card	GPU-COLORFUL-RTX-3050-6GB-V4-V-GDDR6	\N	Video Memory: 6GB GDDR6, Memory Bandwidth: 168 GB/s • Core Clock: Base: 1042 MHz; Boost: 1470 MHz • CUDA Cores: 2304, Memory Clock: 14 Gbps • Display Outputs: 1x DisplayPort, 1x HDMI, 1x DVI	35000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs24000onjjll00hq9a9	Buy Colorful GeForce RTX 3050 6GB V4-V GDDR6 Graphics Card in Bangladesh | LogicBay BD	Colorful GeForce RTX 3050 6GB V4-V GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, colorful, nvidia geforce, 6gb	f	t	2026-09-23 07:46:07.591	2026-09-23 07:46:07.591	2026-09-23 07:46:07.586
cmudstylz00ii12ert49h9nit	Manli GeForce RTX 3050 6GB Nebula Twin V2 GDDR6 Graphics Card	manli-geforce-rtx-3050-6gb-nebula-twin-v2-gddr6-graphics-card	GPU-MANLI-RTX-3050-6GB-NEBULA-TWIN-V2-GD	\N	Video Memory: 6GB GDDR6, Memory Clock: 14 Gbps • Core Clock: Base: 1042 MHz; Boost: 1470 MHz • CUDA Cores: 2304, Memory Bandwidth: Up to 168 GB/s • Display Outputs: 3x DisplayPort, 1x HDMI	35500.00	35900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstyly00if12er7qn7ekjz	Buy Manli GeForce RTX 3050 6GB Nebula Twin V2 GDDR6 Graphics Card in Bangladesh | LogicBay BD	Manli GeForce RTX 3050 6GB Nebula Twin V2 GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, manli, nvidia geforce, 6gb	f	t	2026-09-23 07:46:07.607	2026-09-23 07:46:07.607	2026-09-23 07:46:07.603
cmudstymh00iw12ertn6q7xqd	ARKTEK GeForce RTX 3050 8GB GDDR6 Graphics Card	arktek-geforce-rtx-3050-8gb-gddr6-graphics-card	GPU-ARKTEK-RTX-3050-8GB-GDDR6	\N	Engine Clock: 1552 ~ 1777 MHz • Stream Processors: 2460SP • Memory Clock: 14Gbps • Display Outputs: 1 x DP 1 x HDMI 1 x DVI	36000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudsty55008712erkwczrpk4	Buy ARKTEK GeForce RTX 3050 8GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	ARKTEK GeForce RTX 3050 8GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, arktek, nvidia geforce, 30508gb	f	t	2026-09-23 07:46:07.625	2026-09-23 07:46:07.625	2026-09-23 07:46:07.62
cmudstyng00jr12ervl676cgu	GIGABYTE GeForce RTX 3050 WINDFORCE OC 6GB GDDR6 Graphics Card	gigabyte-geforce-rtx-3050-windforce-oc-6gb-gddr6-graphics-card	GPU-GIGABYTE-RTX-3050-WINDFORCE-OC-6GB-G	\N	Core Clock: 1477 MHz (Reference Card: 1470 MHz) • Memory: 6GB GDDR6 • Memory Clock: 14000 MHz • Output: DP 1.4 x2, HDMI 2.1 x2	35999.00	39000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs2f000wnjjlhveyideo	Buy GIGABYTE GeForce RTX 3050 WINDFORCE OC 6GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	GIGABYTE GeForce RTX 3050 WINDFORCE OC 6GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, gigabyte, nvidia geforce, 6gb	f	t	2026-09-23 07:46:07.661	2026-09-23 07:46:07.661	2026-09-23 07:46:07.656
cmudstynv00k512er09zo19dc	GIGABYTE GeForce RTX 3050 WINDFORCE OC V2 6GB GDDR6 Graphics Card	gigabyte-geforce-rtx-3050-windforce-oc-v2-6gb-gddr6-graphics-card	GPU-GIGABYTE-RTX-3050-WINDFORCE-OC-V2-6G	\N	Video Memory: 6GB GDDR6, PCI Express 4.0 • CUDA Cores: 2304 Units, Memory Clock: 14000 MHz • Core Clocks: 1477 MHz (Reference Card: 1470 MHz) • Display Outputs: 2x DisplayPort 1.4a, 2 x HDMI 2.1	36500.00	39000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs2f000wnjjlhveyideo	Buy GIGABYTE GeForce RTX 3050 WINDFORCE OC V2 6GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	GIGABYTE GeForce RTX 3050 WINDFORCE OC V2 6GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, gigabyte, nvidia geforce, 6gb	f	t	2026-09-23 07:46:07.676	2026-09-23 07:46:07.676	2026-09-23 07:46:07.671
cmudstyoa00kj12er6tcxtl6o	GUNNIR Intel Arc A770 Photon 8G OC GDDR6 Graphics Card	gunnir-intel-arc-a770-photon-8g-oc-gddr6-graphics-card	GPU-GUNNIR-ARC-A770-PHOTON-8G-OC-GDDR6	\N	32 Xe Cores, 512 XMX Engines • Xe HPG Microarchitecture • 256-Bit Memory Interface • Interface: HDMI 2.0, DisplayPort 2.0	38000.00	39500.00	\N	IN_STOCK	0	5	cmr9bvs3p001qnjjlnzrmtdrs	cmudsty7z009w12ercqys44k0	Buy GUNNIR Intel Arc A770 Photon 8G OC GDDR6 Graphics Card in Bangladesh | LogicBay BD	GUNNIR Intel Arc A770 Photon 8G OC GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, gunnir, intel arc,	f	t	2026-09-23 07:46:07.69	2026-09-23 07:46:07.69	2026-09-23 07:46:07.685
cmudstyon00kw12ermfnga1j8	ASUS Dual GeForce RTX 3050 OC Edition 6GB GDDR6 Graphics Card	asus-dual-geforce-rtx-3050-oc-edition-6gb-gddr6-graphics-card	GPU-ASUS-DUAL-RTX-3050-OC-EDITION-6GB-GD	\N	OC mode: 1537 MHz (Boost Clock) • Default mode: 1507 MHz (Boost Clock) • Memory: 6GB GDDR6 • Output: 1x HDMI 2.1, 1x DisplayPort 1.4a, 1x DVI-D	36800.00	43000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs160005njjlpsmet0fp	Buy ASUS Dual GeForce RTX 3050 OC Edition 6GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	ASUS Dual GeForce RTX 3050 OC Edition 6GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, nvidia geforce, 6gb	f	t	2026-09-23 07:46:07.703	2026-09-23 07:46:07.703	2026-09-23 07:46:07.699
cmudstyp000l912erbijbj9cv	GUNNIR Intel Arc A770 Photon 8G OC W GDDR6 Graphics Card	gunnir-intel-arc-a770-photon-8g-oc-w-gddr6-graphics-card	GPU-GUNNIR-ARC-A770-PHOTON-8G-OC-W-GDDR6	\N	32 Xe Cores, 512 XMX Engines • Xe HPG Microarchitecture • 256-Bit Memory Interface • Interface: 1 x HDMI 2.0, 3 x DisplayPort 2.0	39000.00	42000.00	\N	IN_STOCK	0	5	cmr9bvs3p001qnjjlnzrmtdrs	cmudsty7z009w12ercqys44k0	Buy GUNNIR Intel Arc A770 Photon 8G OC W GDDR6 Graphics Card in Bangladesh | LogicBay BD	GUNNIR Intel Arc A770 Photon 8G OC W GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, gunnir, intel arc,	f	t	2026-09-23 07:46:07.716	2026-09-23 07:46:07.716	2026-09-23 07:46:07.711
cmudstypf00lm12er8j0pr81w	ARKTEK GeForce RTX 2070 SUPER 8GB GDDR6 Graphics Card	arktek-geforce-rtx-2070-super-8gb-gddr6-graphics-card	GPU-ARKTEK-RTX-2070-SUPER-8GB-GDDR6	\N	Engine Clock: 1605 ~ 1770 MHz • Stream Processors: 2560SP • Memory Clock: 14Gbps • Display Outputs: 1 x HDMI, 3x Display Port	42000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudsty55008712erkwczrpk4	Buy ARKTEK GeForce RTX 2070 SUPER 8GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	ARKTEK GeForce RTX 2070 SUPER 8GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, arktek, nvidia geforce, 8gb	f	t	2026-09-23 07:46:07.731	2026-09-23 07:46:07.731	2026-09-23 07:46:07.726
cmudstyq000m012erdbczhb09	Zotac GAMING GeForce RTX 3050 Twin Edge OC 6GB GDDR6 Graphics Card	zotac-gaming-geforce-rtx-3050-twin-edge-oc-6gb-gddr6-graphics-card	GPU-ZOTAC-GAMING-RTX-3050-TWIN-EDGE-OC-6	\N	2nd Gen Ray Tracing Cores & 3rd Gen Tensor Cores • Engine Clock Boost: 1477 MHz, Memory Clock: 14 Gbps • Cooling: Dual 70mm fans + Heatsink, PCI Express 4.0 8x • Display Output: 3 x DisplayPort 1.4a, 1 x HDMI Connector	39900.00	42900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstypz00lx12erbs68awur	Buy Zotac GAMING GeForce RTX 3050 Twin Edge OC 6GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Zotac GAMING GeForce RTX 3050 Twin Edge OC 6GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, zotac, nvidia geforce, 6gb	f	t	2026-09-23 07:46:07.752	2026-09-23 07:46:07.752	2026-09-23 07:46:07.748
cmudstyqh00me12er07ht4x7a	MSI GeForce RTX 3050 VENTUS 2X E 6G OC GDDR6 Graphics Card	msi-geforce-rtx-3050-ventus-2x-e-6g-oc-gddr6-graphics-card	GPU-MSI-RTX-3050-VENTUS-2X-E-6G-OC-GDDR6	\N	Boost Clock: 1492 MHz, Memory Speed: 14 Gbps • Memory: 6GB GDDR6, CUDA Core: 2304 Units • Memory : 6GB GDDR6, Memory BUS: 96-bit • Output: DisplayPort 1.4 x 1, HDMI 2.1 x 2	38999.00	43000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 3050 VENTUS 2X E 6G OC GDDR6 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 3050 VENTUS 2X E 6G OC GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce,	f	t	2026-09-23 07:46:07.769	2026-09-23 07:46:07.769	2026-09-23 07:46:07.765
cmudstyqu00mq12er9lwuu1py	PowerColor Reaper AMD Radeon RX 9050 8GB GDDR6 Graphics Card	powercolor-reaper-amd-radeon-rx-9050-8gb-gddr6-graphics-card	GPU-POWERCOLOR-REAPER-RX-9050-8GB-GDDR6	\N	Engine Clock: Up to 1920MHz (Game) / 2600MHz (Boost) • Memory Speed: 18.0 Gbps, Memory Interface: 128-bit • Stream Processors: 1024 Units, AMD RDNA 4 Architecture • Output Ports: 1 x HDMI 2.1b，2 x DisplayPort 2.1a	45900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudstyqt00mn12ery4avore3	Buy PowerColor Reaper AMD Radeon RX 9050 8GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	PowerColor Reaper AMD Radeon RX 9050 8GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, powercolor, amd radeon, 90508gb	f	t	2026-09-23 07:46:07.782	2026-09-23 07:46:07.782	2026-09-23 07:46:07.778
cmudstyra00n612er0m8nxkkc	Colorful iGame GeForce RTX 3050 Ultra W DUO OC V2-V 8GB GDDR6 Graphics Card	colorful-igame-geforce-rtx-3050-ultra-w-duo-oc-v2-v-8gb-gddr6-graphics-card	GPU-COLORFUL-IGAME-RTX-3050-ULTRA-W-DUO-	\N	Core Clock Base:1552Mhz; Boost:1777Mhz • One-Key OC Base:1552Mhz; Boost:1822Mhz • Memory Speed Grade: 14Gbps • Video Output: HDMI + DP + DL-DVI	39999.00	47000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs24000onjjll00hq9a9	Buy Colorful iGame GeForce RTX 3050 Ultra W DUO OC V2-V 8GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Colorful iGame GeForce RTX 3050 Ultra W DUO OC V2-V 8GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, colorful, nvidia geforce, 8gb	f	t	2026-09-23 07:46:07.798	2026-09-23 07:46:07.798	2026-09-23 07:46:07.794
cmudstyrn00nj12erq62zv1ea	PowerColor Fighter AMD Radeon RX 7600 8GB F/V2 GDDR6 Graphics Card	powercolor-fighter-amd-radeon-rx-7600-8gb-f-v2-gddr6-graphics-card	GPU-POWERCOLOR-FIGHTER-RX-7600-8GB-F-V2-	\N	Engine Clock: 2250MHz (Game), 2655MHz (Boost) • Memory: 8GB GDDR6; Memory Speed: 18 Gbps • Stream Processor: 2048 Units, AMD RDNA 3 Architecture • Output Ports: 1 x HDMI 2.1, 3 x DisplayPort 2.1	46500.00	47000.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudstyqt00mn12ery4avore3	Buy PowerColor Fighter AMD Radeon RX 7600 8GB F/V2 GDDR6 Graphics Card in Bangladesh | LogicBay BD	PowerColor Fighter AMD Radeon RX 7600 8GB F/V2 GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, powercolor, amd radeon, 76008gb	f	t	2026-09-23 07:46:07.812	2026-09-23 07:46:07.812	2026-09-23 07:46:07.807
cmudstys200nx12erlmc05dyx	Colorful GeForce RTX 3050 NB DUO V2-V 8GB GDDR6 Graphics Card	colorful-geforce-rtx-3050-nb-duo-v2-v-8gb-gddr6-graphics-card	GPU-COLORFUL-RTX-3050-NB-DUO-V2-V-8GB-GD	\N	Core Clock: Base:1552Mhz; Boost:1777Mhz • Memory Clock: 14Gbps • Memory Bandwidth: 224 GB/S • Output Ports: 1x HDMI, 1x DP, 1x DL-DVI	39000.00	48000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs24000onjjll00hq9a9	Buy Colorful GeForce RTX 3050 NB DUO V2-V 8GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Colorful GeForce RTX 3050 NB DUO V2-V 8GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, colorful, nvidia geforce, 8gb	f	t	2026-09-23 07:46:07.826	2026-09-23 07:46:07.826	2026-09-23 07:46:07.821
cmudstysg00ob12ertcimwrsh	MSI GeForce RTX 3050 VENTUS 2X XS 8GB OC GDDR6 Graphics Card	msi-geforce-rtx-3050-ventus-2x-xs-8gb-oc-gddr6-graphics-card	GPU-MSI-RTX-3050-VENTUS-2X-XS-8GB-OC-GDD	\N	Boost Clock: 1807 MHz, Memory Speed: 14 Gbps • Memory Bus: 128-bit, Interface: PCI Express Gen 4 • Dual Fan, Zero Frozr, Reinforcing Backplate • Output: DisplayPort 1.4 x1, HDMI x1	46900.00	49500.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 3050 VENTUS 2X XS 8GB OC GDDR6 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 3050 VENTUS 2X XS 8GB OC GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 8gb	f	t	2026-09-23 07:46:07.841	2026-09-23 07:46:07.841	2026-09-23 07:46:07.836
cmudstysx00or12er6svixl2h	INNO3D GeForce RTX 5050 TWIN X2 OC 8GB GDDR6 Graphics Card	inno3d-geforce-rtx-5050-twin-x2-oc-8gb-gddr6-graphics-card	GPU-INNO3D-RTX-5050-TWIN-X2-OC-8GB-GDDR6	\N	Video Memory: 8GB GDDR6, PCI Express Gen 5 • Base Clock: 2317MHz, Boost Clock: 2572MHz • CUDA Cores: 2560, Memory Clock: 20 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	52000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstysw00oo12ert0lrel91	Buy INNO3D GeForce RTX 5050 TWIN X2 OC 8GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	INNO3D GeForce RTX 5050 TWIN X2 OC 8GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, inno3d, nvidia geforce, 8gb	f	t	2026-09-23 07:46:07.858	2026-09-23 07:46:07.858	2026-09-23 07:46:07.853
cmudstytd00p512er1k2kiz1n	ZOTAC GAMING GeForce RTX 5050 Twin Edge 8GB GDDR6 Graphics Card	zotac-gaming-geforce-rtx-5050-twin-edge-8gb-gddr6-graphics-card	GPU-ZOTAC-GAMING-RTX-5050-TWIN-EDGE-8GB-	\N	Video Memory: 8GB GDDR6, PCI Express 5.0 x8 • Engine Clock: 2572 MHz, Memory Clock: 20 Gbps • Memory Bus: 128-bit, CUDA Cores: 2560 • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	49900.00	52900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstypz00lx12erbs68awur	Buy ZOTAC GAMING GeForce RTX 5050 Twin Edge 8GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	ZOTAC GAMING GeForce RTX 5050 Twin Edge 8GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, zotac, nvidia geforce, 8gb	f	t	2026-09-23 07:46:07.874	2026-09-23 07:46:07.874	2026-09-23 07:46:07.869
cmudstyts00pk12eroiqe7l8m	MSI GeForce RTX 5050 8G VENTUS 2X OC 8GB GDDR6 Graphics Card	msi-geforce-rtx-5050-8g-ventus-2x-oc-8gb-gddr6-graphics-card	GPU-MSI-RTX-5050-8G-VENTUS-2X-OC-8GB-GDD	\N	Video Memory: 8GB GDDR6, PCI Express Gen 5 x16 • Core Clock: 2617 MHz, Boost Clock: 2602 MHz • Memory Speed: 20 Gbps, CUDA Cores: 2560 Units • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	52500.00	53500.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5050 8G VENTUS 2X OC 8GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5050 8G VENTUS 2X OC 8GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 8gb	f	t	2026-09-23 07:46:07.889	2026-09-23 07:46:07.889	2026-09-23 07:46:07.884
cmudstyu600px12erl09ruej5	ZOTAC GAMING GeForce RTX 5050 Twin Edge OC 8GB GDDR6 Graphics Card	zotac-gaming-geforce-rtx-5050-twin-edge-oc-8gb-gddr6-graphics-card	GPU-ZOTAC-GAMING-RTX-5050-TWIN-EDGE-OC-8	\N	Video Memory: 8GB GDDR6, PCI Express 5.0 x8 • Engine Clock: 2602 MHz, Memory Clock: 20 Gbps • Memory Bus: 128-bit, CUDA Cores: 2560 • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	47500.00	53900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstypz00lx12erbs68awur	Buy ZOTAC GAMING GeForce RTX 5050 Twin Edge OC 8GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	ZOTAC GAMING GeForce RTX 5050 Twin Edge OC 8GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, zotac, nvidia geforce, 8gb	f	t	2026-09-23 07:46:07.902	2026-09-23 07:46:07.902	2026-09-23 07:46:07.898
cmudstyup00qc12erksr40bke	MSI GeForce RTX 5050 8G SHADOW 2X OC 8GB GDDR6 Graphics Card	msi-geforce-rtx-5050-8g-shadow-2x-oc-8gb-gddr6-graphics-card	GPU-MSI-RTX-5050-8G-SHADOW-2X-OC-8GB-GDD	\N	Video Memory: 8GB GDDR6, PCI Express Gen 5 x16 • Core Clock: 2617 MHz, Boost Clock: 2602 MHz • Memory Speed: 20 Gbps, CUDA Cores: 2560 Units • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	53500.00	53900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5050 8G SHADOW 2X OC 8GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5050 8G SHADOW 2X OC 8GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 8gb	f	t	2026-09-23 07:46:07.922	2026-09-23 07:46:07.922	2026-09-23 07:46:07.917
cmudstyv400qp12erspiq0wyb	Manli Nebula GeForce RTX 5050 8GB GDDR6 Graphics Card	manli-nebula-geforce-rtx-5050-8gb-gddr6-graphics-card	GPU-MANLI-NEBULA-RTX-5050-8GB-GDDR6	\N	Video Memory: 8GB GDDR6, Memory Clock: 20 Gbps • Core Clock: Base: 2317 MHz; Boost: 2572 MHz • CUDA Cores: 2560, Memory Bandwidth: Up to 320 GB/s • Display Outputs: 3x DisplayPort, 1x HDMI	54800.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstyly00if12er7qn7ekjz	Buy Manli Nebula GeForce RTX 5050 8GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Manli Nebula GeForce RTX 5050 8GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, manli, nvidia geforce, 8gb	f	t	2026-09-23 07:46:07.937	2026-09-23 07:46:07.937	2026-09-23 07:46:07.932
cmudstyvj00r312er5jccc8g9	INNO3D GeForce RTX 5050 TWIN X2 8GB GDDR6 Graphics Card	inno3d-geforce-rtx-5050-twin-x2-8gb-gddr6-graphics-card	GPU-INNO3D-RTX-5050-TWIN-X2-8GB-GDDR6	\N	Video Memory: 8GB GDDR6, PCI Express Gen 5 • Base Clock: 2317MHz, Boost Clock: 2572MHz • CUDA Cores: 2560, Memory Clock: 20 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	52000.00	55000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstysw00oo12ert0lrel91	Buy INNO3D GeForce RTX 5050 TWIN X2 8GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	INNO3D GeForce RTX 5050 TWIN X2 8GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, inno3d, nvidia geforce, 8gb	f	t	2026-09-23 07:46:07.951	2026-09-23 07:46:07.951	2026-09-23 07:46:07.947
cmudstyvz00rh12erbvfqi8mh	MSI GeForce RTX 5050 8G Gaming OC 8GB GDDR6 Graphics Card	msi-geforce-rtx-5050-8g-gaming-oc-8gb-gddr6-graphics-card	GPU-MSI-RTX-5050-8G-GAMING-OC-8GB-GDDR6	\N	Video Memory: 8GB GDDR6, PCI Express Gen 5 x16 • Core Clock: 2647 MHz, Boost Clock: 2632 MHz • Memory Speed: 20 Gbps, CUDA Cores: 2560 Units • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	55000.00	56900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5050 8G Gaming OC 8GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5050 8G Gaming OC 8GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 8gb	f	t	2026-09-23 07:46:07.968	2026-09-23 07:46:07.968	2026-09-23 07:46:07.963
cmudstywg00ru12erhsad21nw	ASUS Dual GeForce RTX 5050 8GB GDDR6 OC Edition Graphics Card	asus-dual-geforce-rtx-5050-8gb-gddr6-oc-edition-graphics-card	GPU-ASUS-DUAL-RTX-5050-8GB-GDDR6-OC-EDIT	\N	Engine Clock: 2647 MHz (Boost Clock), 2677 MHz (OC Mode) • Memory: 8GB GDDR6; Speed: 20 Gbps • CUDA Core: 2560, AI Performance: 421 TOPs • Output: 1x HDMI 2.1b, 3x DisplayPort 2.1b	53500.00	57000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs160005njjlpsmet0fp	Buy ASUS Dual GeForce RTX 5050 8GB GDDR6 OC Edition Graphics Card in Bangladesh | LogicBay BD	ASUS Dual GeForce RTX 5050 8GB GDDR6 OC Edition Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, nvidia geforce, 50508gb	f	t	2026-09-23 07:46:07.984	2026-09-23 07:46:07.984	2026-09-23 07:46:07.98
cmudstywv00s812ergov70jvx	Colorful iGame GeForce RTX 5050 Ultra W DUO OC 8GB-V GDDR6 Graphics Card	colorful-igame-geforce-rtx-5050-ultra-w-duo-oc-8gb-v-gddr6-graphics-card	GPU-COLORFUL-IGAME-RTX-5050-ULTRA-W-DUO-	\N	Video Memory: 8GB GDDR6, CUDA Cores: 2560 • Core Clock: Base: 2317 MHz; Boost: 2572 MHz • One-Key OC: Base: 2317 MHz; Boost: 2647 MHz • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	54000.00	58000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs24000onjjll00hq9a9	Buy Colorful iGame GeForce RTX 5050 Ultra W DUO OC 8GB-V GDDR6 Graphics Card in Bangladesh | LogicBay BD	Colorful iGame GeForce RTX 5050 Ultra W DUO OC 8GB-V GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, colorful, nvidia geforce, 8gb	f	t	2026-09-23 07:46:07.999	2026-09-23 07:46:07.999	2026-09-23 07:46:07.995
cmudstyx900sl12erckjjgnkq	PNY GeForce RTX 5060 8GB Dual Fan GDDR7 Graphics Card	pny-geforce-rtx-5060-8gb-dual-fan-gddr7-graphics-card	GPU-PNY-RTX-5060-8GB-DUAL-FAN-GDDR7	\N	Video Memory: 8GB GDDR7, PCI Express 5.0 x8 • Graphics Clock: 2280 MHz, Boost Clock: 2497 MHz • CUDA Cores: 3840, Memory Clock: 28 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	57500.00	58000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs27000rnjjlpj0622kg	Buy PNY GeForce RTX 5060 8GB Dual Fan GDDR7 Graphics Card in Bangladesh | LogicBay BD	PNY GeForce RTX 5060 8GB Dual Fan GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, pny, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.013	2026-09-23 07:46:08.013	2026-09-23 07:46:08.009
cmudstyxo00sz12erbufg1pgd	ZOTAC GeForce RTX 5060 Twin Edge 8GB GDDR7 Graphics Card	zotac-geforce-rtx-5060-twin-edge-8gb-gddr7-graphics-card	GPU-ZOTAC-RTX-5060-TWIN-EDGE-8GB-GDDR7	\N	Video Memory: 8GB GDDR7, PCI Express 5.0 x8 • Engine Clock: 2497 MHz, CUDA Cores: 3840 • Resolution Supports: Up to 4K 480Hz or 8K 165Hz with DSC • Display Outputs: 3x DisplayPort 2.1b, 1x HDMI	58900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstypz00lx12erbs68awur	Buy ZOTAC GeForce RTX 5060 Twin Edge 8GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	ZOTAC GeForce RTX 5060 Twin Edge 8GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, zotac, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.028	2026-09-23 07:46:08.028	2026-09-23 07:46:08.024
cmudstyy300td12erh4ozp6ad	ASUS Dual GeForce RTX 5060 8GB GDDR7 Graphics Card	asus-dual-geforce-rtx-5060-8gb-gddr7-graphics-card	GPU-ASUS-DUAL-RTX-5060-8GB-GDDR7	\N	Engine Clock: 2497 MHz (Boost Clock), 2527 MHz(OC Mode) • Memory: 8GB GDDR7; Speed: 28 Gbps • CUDA Core: 3840, AI Performance: 613 TOPs • Output: 1x HDMI 2.1b, 3x DisplayPort 2.1b	59500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs160005njjlpsmet0fp	Buy ASUS Dual GeForce RTX 5060 8GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	ASUS Dual GeForce RTX 5060 8GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, nvidia geforce, 50608gb	f	t	2026-09-23 07:46:08.044	2026-09-23 07:46:08.044	2026-09-23 07:46:08.039
cmudstyyj00tr12ergdnoavz3	INNO3D GeForce RTX 5060 TWIN X2 OC V2 8GB GDDR7 Graphics Card	inno3d-geforce-rtx-5060-twin-x2-oc-v2-8gb-gddr7-graphics-card	GPU-INNO3D-RTX-5060-TWIN-X2-OC-V2-8GB-GD	\N	Video Memory: 8GB GDDR7, PCI Express Gen 5 • Base Clock: 2280MHz, Boost Clock: 2527MHz • CUDA Cores: 3840, Memory Clock: 28 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	58000.00	60000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstysw00oo12ert0lrel91	Buy INNO3D GeForce RTX 5060 TWIN X2 OC V2 8GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	INNO3D GeForce RTX 5060 TWIN X2 OC V2 8GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, inno3d, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.059	2026-09-23 07:46:08.059	2026-09-23 07:46:08.054
cmudstyyz00u512er31y0ofdm	Manli Nebula GeForce RTX 5060 8GB GDDR7 Graphics Card	manli-nebula-geforce-rtx-5060-8gb-gddr7-graphics-card	GPU-MANLI-NEBULA-RTX-5060-8GB-GDDR7	\N	Video Memory: 8GB GDDR7, Memory Clock: 28 Gbps • Core Clock: Base: 2280 MHz; Boost: 2497 MHz • CUDA Cores: 3840, Memory Bandwidth: Up to 448 GB/s • Display Outputs: 3x DisplayPort, 1x HDMI	60800.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstyly00if12er7qn7ekjz	Buy Manli Nebula GeForce RTX 5060 8GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	Manli Nebula GeForce RTX 5060 8GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, manli, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.076	2026-09-23 07:46:08.076	2026-09-23 07:46:08.071
cmudstyzl00uj12err8y6n94u	PNY GeForce RTX 5060 8GB OC Dual Fan GDDR7 Graphics Card	pny-geforce-rtx-5060-8gb-oc-dual-fan-gddr7-graphics-card	GPU-PNY-RTX-5060-8GB-OC-DUAL-FAN-GDDR7	\N	Video Memory: 8GB GDDR7, PCI Express 5.0 x8 • Graphics Clock: 2280 MHz, Boost Clock: 2535 MHz • CUDA Cores: 3840, Memory Clock: 28 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	56000.00	61000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs27000rnjjlpj0622kg	Buy PNY GeForce RTX 5060 8GB OC Dual Fan GDDR7 Graphics Card in Bangladesh | LogicBay BD	PNY GeForce RTX 5060 8GB OC Dual Fan GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, pny, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.097	2026-09-23 07:46:08.097	2026-09-23 07:46:08.093
cmudstz0100ux12erhh6ccp95	ZOTAC GeForce RTX 5060 AMP 8GB GDDR7 Graphics Card	zotac-geforce-rtx-5060-amp-8gb-gddr7-graphics-card	GPU-ZOTAC-RTX-5060-AMP-8GB-GDDR7	\N	Video Memory: 8GB GDDR7, PCI Express 5.0 x8 • Engine Clock: 2550 MHz, CUDA Cores: 3840 • Resolution Supports: Up to 4K 480Hz or 8K 165Hz with DSC • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	59500.00	61900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstypz00lx12erbs68awur	Buy ZOTAC GeForce RTX 5060 AMP 8GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	ZOTAC GeForce RTX 5060 AMP 8GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, zotac, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.113	2026-09-23 07:46:08.113	2026-09-23 07:46:08.108
cmudstz0f00vb12er8zw60u9y	MSI GeForce RTX 5060 8G VENTUS 2X OC 8GB GDDR7 Graphics Card	msi-geforce-rtx-5060-8g-ventus-2x-oc-8gb-gddr7-graphics-card	GPU-MSI-RTX-5060-8G-VENTUS-2X-OC-8GB-GDD	\N	Video Memory: 8GB GDDR7, PCI Express 5 • CUDA Cores: 3840 Units, Memory Speed: 28 Gbps • Core Clocks: Extreme: 2535 MHz, Boost: 2527 MHz • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	56999.00	62900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5060 8G VENTUS 2X OC 8GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5060 8G VENTUS 2X OC 8GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.127	2026-09-23 07:46:08.127	2026-09-23 07:46:08.123
cmudstz0r00vo12ero5m3kmdh	MSI GeForce RTX 5060 8G VENTUS 2X OC V1 GDDR7 Graphics Card	msi-geforce-rtx-5060-8g-ventus-2x-oc-v1-gddr7-graphics-card	GPU-MSI-RTX-5060-8G-VENTUS-2X-OC-V1-GDDR	\N	Video Memory: 8GB GDDR7, PCI Express Gen 5 x16 • Core Clocks: Extreme: 2535 MHz, Boost: 2527 MHz • CUDA Cores: 3840 Units, Memory Speed: 28 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	59500.00	62900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5060 8G VENTUS 2X OC V1 GDDR7 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5060 8G VENTUS 2X OC V1 GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.14	2026-09-23 07:46:08.14	2026-09-23 07:46:08.135
cmudstz1400w112erm4s5durz	ASUS Dual GeForce RTX 5060 White OC Edition 8GB GDDR7 Graphics Card	asus-dual-geforce-rtx-5060-white-oc-edition-8gb-gddr7-graphics-card	GPU-ASUS-DUAL-RTX-5060-WHITE-OC-EDITION-	\N	Video Memory: 8GB GDDR7, PCI Express 5.0 • Engine Clock: 2565MHz (OC), 2535MHz (Boost Clock) • Memory Speed: 28 Gbps, CUDA Cores: 3840 • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	69000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs160005njjlpsmet0fp	Buy ASUS Dual GeForce RTX 5060 White OC Edition 8GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	ASUS Dual GeForce RTX 5060 White OC Edition 8GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.153	2026-09-23 07:46:08.153	2026-09-23 07:46:08.148
cmudstz1m00wf12ericuaoao4	GIGABYTE GeForce RTX 3060 WINDFORCE OC 12GB GDDR6 Graphics Card	gigabyte-geforce-rtx-3060-windforce-oc-12gb-gddr6-graphics-card	GPU-GIGABYTE-RTX-3060-WINDFORCE-OC-12GB-	\N	Core Clock: 1792 MHz (Reference Card: 1777 MHz) • CUDA Cores: 3584 • Memory Clock: 15000 MHz • Output: DisplayPort 1.4a x2, HDMI 2.1 x2	58000.00	65000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs2f000wnjjlhveyideo	Buy GIGABYTE GeForce RTX 3060 WINDFORCE OC 12GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	GIGABYTE GeForce RTX 3060 WINDFORCE OC 12GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, gigabyte, nvidia geforce, 12gb	f	t	2026-09-23 07:46:08.171	2026-09-23 07:46:08.171	2026-09-23 07:46:08.166
cmudstz2100wt12er8x4e02y6	Colorful iGame GeForce RTX 5060 Ultra W DUO OC 8GB-V GDDR7 Graphics Card	colorful-igame-geforce-rtx-5060-ultra-w-duo-oc-8gb-v-gddr7-graphics-card	GPU-COLORFUL-IGAME-RTX-5060-ULTRA-W-DUO-	\N	Video Memory: 8GB GDDR7, CUDA Cores: 3840 • Core Clock: Base: 2280 MHz; Boost: 2497 MHz • One-Key OC: Base: 2280 MHz; Boost: 2580 MHz • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	62000.00	65000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs24000onjjll00hq9a9	Buy Colorful iGame GeForce RTX 5060 Ultra W DUO OC 8GB-V GDDR7 Graphics Card in Bangladesh | LogicBay BD	Colorful iGame GeForce RTX 5060 Ultra W DUO OC 8GB-V GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, colorful, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.186	2026-09-23 07:46:08.186	2026-09-23 07:46:08.181
cmudstz2h00x612er1iqsd6fg	GIGABYTE GeForce RTX 5060 EAGLE MAX OC 8GB GDDR7 Graphics Card	gigabyte-geforce-rtx-5060-eagle-max-oc-8gb-gddr7-graphics-card	GPU-GIGABYTE-RTX-5060-EAGLE-MAX-OC-8GB-G	\N	Video Memory: 8GB GDDR7, PCI Express 5.0 • Core Clock: 2550 MHz (Reference card: 2497MHz) • CUDA Cores: 3840, Memory Clock: 28 Gbps • Display Outputs: 3x DisplayPort 2.1b, 1x HDMI 2.1b	62000.00	65000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs2f000wnjjlhveyideo	Buy GIGABYTE GeForce RTX 5060 EAGLE MAX OC 8GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	GIGABYTE GeForce RTX 5060 EAGLE MAX OC 8GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, gigabyte, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.201	2026-09-23 07:46:08.201	2026-09-23 07:46:08.196
cmudstz2w00xk12er6u4i3fh1	MSI GeForce RTX 3060 VENTUS 2X OC 12GB Graphics Card	msi-geforce-rtx-3060-ventus-2x-oc-12gb-graphics-card	GPU-MSI-RTX-3060-VENTUS-2X-OC-12GB	\N	12GB of GDDR6 VRAM • 3584 CUDA Cores • Ampere Architecture • Boostable up to 1807 MHz	58900.00	65900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 3060 VENTUS 2X OC 12GB Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 3060 VENTUS 2X OC 12GB Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 12gb	f	t	2026-09-23 07:46:08.217	2026-09-23 07:46:08.217	2026-09-23 07:46:08.212
cmudstz3900xx12er3h8v63o1	Sapphire Pulse AMD Radeon RX 9060 XT Gaming OC 8GB GDDR6 Graphics Card	sapphire-pulse-amd-radeon-rx-9060-xt-gaming-oc-8gb-gddr6-graphics-card	GPU-SAPPHIRE-PULSE-RX-9060-XT-GAMING-OC-	\N	Boost Clock: Up to 3290 MHz, Game Clock: Up to 2700 MHz • Memory: 8GB/128 bit GDDR6, Memory Clock: 20 Gbps Effective • Stream Processors: 2048, AMD RDNA 4 Architecture • Output Ports: 2x HDMI, 1x DisplayPort 2.1a	66900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmtn5e2yh0000udp65aqs32hi	Buy Sapphire Pulse AMD Radeon RX 9060 XT Gaming OC 8GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Sapphire Pulse AMD Radeon RX 9060 XT Gaming OC 8GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, sapphire, amd radeon, 8gb	f	t	2026-09-23 07:46:08.23	2026-09-23 07:46:08.23	2026-09-23 07:46:08.225
cmudstz3p00yb12er85j9fcv1	GUNNIR Intel Arc Pro B50 16G Low Profile GDDR6 Workstation Graphics Card	gunnir-intel-arc-pro-b50-16g-low-profile-gddr6-workstation-graphics-card	GPU-GUNNIR-ARC-PRO-B50-16G-LOW-PROFILE-G	\N	Clock Speed: 1700MHz • Memory: 16GB GDDR6; AI TOPS: 170TOPS • Memory Bandwidth: 224GB/s • Output: DisplayPort x1, HDMI x2	69000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3p001qnjjlnzrmtdrs	cmudsty7z009w12ercqys44k0	Buy GUNNIR Intel Arc Pro B50 16G Low Profile GDDR6 Workstation Graphics Card in Bangladesh | LogicBay BD	GUNNIR Intel Arc Pro B50 16G Low Profile GDDR6 Workstation Graphics Card. Check price and warranty at LogicBay BD.	graphics card, gunnir, intel arc,	f	t	2026-09-23 07:46:08.245	2026-09-23 07:46:08.245	2026-09-23 07:46:08.24
cmudstz4000yk12eriapgu48r	MSI GeForce RTX 5060 Ti 8G SHADOW 2X OC PLUS 8GB GDDR7 Graphics Card	msi-geforce-rtx-5060-ti-8g-shadow-2x-oc-plus-8gb-gddr7-graphics-card	GPU-MSI-RTX-5060-TI-8G-SHADOW-2X-OC-PLUS	\N	Video Memory: 8GB GDDR7, PCI Express 5 • CUDA Cores: 4608 Units, Memory Speed: 28 Gbps • Core Clocks: Extreme: 2617 MHz, Boost: 2602 MHz • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	71000.00	71900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5060 Ti 8G SHADOW 2X OC PLUS 8GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5060 Ti 8G SHADOW 2X OC PLUS 8GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.257	2026-09-23 07:46:08.257	2026-09-23 07:46:08.252
cmudstz4e00yx12ere42j7onb	Colorful GeForce RTX 5060 Ti Battle AX DUO 8GB-V GDDR7 Graphics Card	colorful-geforce-rtx-5060-ti-battle-ax-duo-8gb-v-gddr7-graphics-card	GPU-COLORFUL-RTX-5060-TI-BATTLE-AX-DUO-8	\N	Video Memory: 8GB GDDR7, Memory Clock: 28Gbps • Core Clock: Base: 2407 Mhz, Boost: 2572 Mhz • CUDA Cores: 4608, Memory Bandwidth: 448GB/s • Display Outputs: 3x DisplayPort 2.1b, 1x HDMI 2.1b	69900.00	72500.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs24000onjjll00hq9a9	Buy Colorful GeForce RTX 5060 Ti Battle AX DUO 8GB-V GDDR7 Graphics Card in Bangladesh | LogicBay BD	Colorful GeForce RTX 5060 Ti Battle AX DUO 8GB-V GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, colorful, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.271	2026-09-23 07:46:08.271	2026-09-23 07:46:08.266
cmudstz4s00zb12erq67te5zo	INNO3D GeForce RTX 5060 Ti 8GB TWIN X2 OC Graphics Card	inno3d-geforce-rtx-5060-ti-8gb-twin-x2-oc-graphics-card	GPU-INNO3D-RTX-5060-TI-8GB-TWIN-X2-OC	\N	Video Memory: 8GB GDDR7, PCI Express Gen 5 • Base Clock: 2317MHz, Boost Clock: 2602MHz • CUDA Cores: 4608, Memory Clock: 28Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	68500.00	72500.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstysw00oo12ert0lrel91	Buy INNO3D GeForce RTX 5060 Ti 8GB TWIN X2 OC Graphics Card in Bangladesh | LogicBay BD	INNO3D GeForce RTX 5060 Ti 8GB TWIN X2 OC Graphics Card. Check price and warranty at LogicBay BD.	graphics card, inno3d, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.285	2026-09-23 07:46:08.285	2026-09-23 07:46:08.28
cmudstz5700zp12ereevxx7xi	Colorful iGame GeForce RTX 5060 Ti Ultra W DUO OC 8GB-V GDDR7 Graphics Card	colorful-igame-geforce-rtx-5060-ti-ultra-w-duo-oc-8gb-v-gddr7-graphics-card	GPU-COLORFUL-IGAME-RTX-5060-TI-ULTRA-W-D	\N	Video Memory: 8GB GDDR7, CUDA Cores: 4608 • Core Clock: Base: 2407 MHz; Boost: 2572 MHz • One-Key OC: Base: 2407 MHz; Boost: 2632 MHz • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	71900.00	73000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs24000onjjll00hq9a9	Buy Colorful iGame GeForce RTX 5060 Ti Ultra W DUO OC 8GB-V GDDR7 Graphics Card in Bangladesh | LogicBay BD	Colorful iGame GeForce RTX 5060 Ti Ultra W DUO OC 8GB-V GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, colorful, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.299	2026-09-23 07:46:08.299	2026-09-23 07:46:08.295
cmudstz5m010212erc5xl4ajb	MSI GeForce RTX 5060 Ti 8G VENTUS 2X PLUS 8GB GDDR7 Graphics Card	msi-geforce-rtx-5060-ti-8g-ventus-2x-plus-8gb-gddr7-graphics-card	GPU-MSI-RTX-5060-TI-8G-VENTUS-2X-PLUS-8G	\N	Video Memory: 8GB GDDR7, PCI Express 5 • CUDA Cores: 4608 Units, Memory Speed: 28 Gbps • Core Clocks: Extreme: 2587 MHz, Boost: 2572 MHz • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	74000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5060 Ti 8G VENTUS 2X PLUS 8GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5060 Ti 8G VENTUS 2X PLUS 8GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.315	2026-09-23 07:46:08.315	2026-09-23 07:46:08.31
cmudstz5z010f12ergiyggfch	Colorful GeForce RTX 5060 Ti Gaming DUO 8GB-V GDDR7 Graphics Card	colorful-geforce-rtx-5060-ti-gaming-duo-8gb-v-gddr7-graphics-card	GPU-COLORFUL-RTX-5060-TI-GAMING-DUO-8GB-	\N	Video Memory: 8GB GDDR7, CUDA Cores: 3840 • Core Clock: Base: 2407 Mhz; Boost: 2572 MHz • Memory Clock: 28 Gbps, Memory Bus Width: 128 bit • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	70500.00	74000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs24000onjjll00hq9a9	Buy Colorful GeForce RTX 5060 Ti Gaming DUO 8GB-V GDDR7 Graphics Card in Bangladesh | LogicBay BD	Colorful GeForce RTX 5060 Ti Gaming DUO 8GB-V GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, colorful, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.328	2026-09-23 07:46:08.328	2026-09-23 07:46:08.323
cmudstz6f010t12eri098tx5v	MSI GeForce RTX 5060 Ti 8G VENTUS 2X OC PLUS 8GB GDDR7 Graphics Card	msi-geforce-rtx-5060-ti-8g-ventus-2x-oc-plus-8gb-gddr7-graphics-card	GPU-MSI-RTX-5060-TI-8G-VENTUS-2X-OC-PLUS	\N	Video Memory: 8GB GDDR7, PCI Express 5 • CUDA Cores: 4608 Units, Memory Speed: 28 Gbps • Core Clocks: Extreme: 2617 MHz, Boost: 2602 MHz • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	71900.00	74900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5060 Ti 8G VENTUS 2X OC PLUS 8GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5060 Ti 8G VENTUS 2X OC PLUS 8GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.343	2026-09-23 07:46:08.343	2026-09-23 07:46:08.338
cmudstz6s011612erv8om45uj	MSI GeForce RTX 5060 Ti 8G VENTUS 2X OC WHITE PLUS 8GB GDDR7 Graphics Card	msi-geforce-rtx-5060-ti-8g-ventus-2x-oc-white-plus-8gb-gddr7-graphics-card	GPU-MSI-RTX-5060-TI-8G-VENTUS-2X-OC-WHIT	\N	Video Memory: 8GB GDDR7, PCI Express Gen 5 x16 • Core Clocks: Extreme: 2617 MHz, Boost: 2602 MHz • CUDA Cores: 4608 Units, Memory Speed: 28 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	69900.00	74900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5060 Ti 8G VENTUS 2X OC WHITE PLUS 8GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5060 Ti 8G VENTUS 2X OC WHITE PLUS 8GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.357	2026-09-23 07:46:08.357	2026-09-23 07:46:08.352
cmudstz76011j12er8mljcbhz	INNO3D GeForce RTX 5060 Ti 8GB X3 OC GDDR7 Graphics Card	inno3d-geforce-rtx-5060-ti-8gb-x3-oc-gddr7-graphics-card	GPU-INNO3D-RTX-5060-TI-8GB-X3-OC-GDDR7	\N	Video Memory: 8GB GDDR7, PCI Express Gen 5 • Base Clock: 2407MHz, Boost Clock: 2602MHz • CUDA Cores: 4608, Memory Clock: 28 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	71900.00	75000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstysw00oo12ert0lrel91	Buy INNO3D GeForce RTX 5060 Ti 8GB X3 OC GDDR7 Graphics Card in Bangladesh | LogicBay BD	INNO3D GeForce RTX 5060 Ti 8GB X3 OC GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, inno3d, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.37	2026-09-23 07:46:08.37	2026-09-23 07:46:08.365
cmudstz7m011x12erwri0fu4q	MSI GeForce RTX 5060 Ti 8G VENTUS 3X OC 8GB GDDR7 Graphics Card	msi-geforce-rtx-5060-ti-8g-ventus-3x-oc-8gb-gddr7-graphics-card	GPU-MSI-RTX-5060-TI-8G-VENTUS-3X-OC-8GB-	\N	Video Memory: 8GB GDDR7, PCI Express 5 • CUDA Cores: 4608 Units, Memory Speed: 28 Gbps • Core Clocks: Extreme: 2617 MHz, Boost: 2602 MHz • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	76000.00	76900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5060 Ti 8G VENTUS 3X OC 8GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5060 Ti 8G VENTUS 3X OC 8GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.387	2026-09-23 07:46:08.387	2026-09-23 07:46:08.382
cmudstz80012a12er7s3ik2s1	PowerColor Reaper AMD Radeon RX 9060 XT 16GB GDDR6 Graphics Card	powercolor-reaper-amd-radeon-rx-9060-xt-16gb-gddr6-graphics-card	GPU-POWERCOLOR-REAPER-RX-9060-XT-16GB-GD	\N	Engine Clock: Up to 2620 MHz (Game) / 3230 MHz (Boost) • Memory Speed: 20 Gbps, Memory Interface: 128-bit • Stream Processors: 2048 Units, AMD RDNA 4 Architecture • Output Ports: 1 x HDMI 2.1b, 2 x DisplayPort 2.1a	76500.00	77000.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudstyqt00mn12ery4avore3	Buy PowerColor Reaper AMD Radeon RX 9060 XT 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	PowerColor Reaper AMD Radeon RX 9060 XT 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, powercolor, amd radeon, 16gb	f	t	2026-09-23 07:46:08.4	2026-09-23 07:46:08.4	2026-09-23 07:46:08.396
cmudstz8h012q12ertqdjdmdb	ASUS PRIME GeForce RTX 5060 Ti 8GB GDDR7 OC Edition Graphics Card	asus-prime-geforce-rtx-5060-ti-8gb-gddr7-oc-edition-graphics-card	GPU-ASUS-PRIME-RTX-5060-TI-8GB-GDDR7-OC-	\N	Engine Clock: 2617MHz (Boost Clock), 2647MHz (OC Mode) • Memory: 8GB GDDR7; Speed: 28 Gbps • CUDA Core: 4608: AI Performance: 759 TOPs • Output: 1x HDMI 2.1b, 3x DisplayPort 2.1b	78000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs160005njjlpsmet0fp	Buy ASUS PRIME GeForce RTX 5060 Ti 8GB GDDR7 OC Edition Graphics Card in Bangladesh | LogicBay BD	ASUS PRIME GeForce RTX 5060 Ti 8GB GDDR7 OC Edition Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.418	2026-09-23 07:46:08.418	2026-09-23 07:46:08.413
cmudstz8w013412erodesa63h	Sapphire Pulse AMD Radeon RX 9060 XT GAMING OC 16GB GDDR6 Graphics Card	sapphire-pulse-amd-radeon-rx-9060-xt-gaming-oc-16gb-gddr6-graphics-card	GPU-SAPPHIRE-PULSE-RX-9060-XT-GAMING-OC--2	\N	Boost Clock: Up to 3290 MHz, Game Clock: Up to 2700 MHz • Memory: 16GB/128 bit DDR6, Stream Processors: 2048 • AMD RDNA 4 Architecture, Ray Accelerator: 32 • Output: 2x HDMI, 1x DisplayPort 2.1a	82900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmtn5e2yh0000udp65aqs32hi	Buy Sapphire Pulse AMD Radeon RX 9060 XT GAMING OC 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Sapphire Pulse AMD Radeon RX 9060 XT GAMING OC 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, sapphire, amd radeon, 16gb	f	t	2026-09-23 07:46:08.433	2026-09-23 07:46:08.433	2026-09-23 07:46:08.428
cmudstz9b013h12erqja3zsvd	ASUS Dual GeForce RTX 5060 Ti 8GB GDDR7 OC Edition Graphics Card	asus-dual-geforce-rtx-5060-ti-8gb-gddr7-oc-edition-graphics-card	GPU-ASUS-DUAL-RTX-5060-TI-8GB-GDDR7-OC-E	\N	Engine Clock: 2602 MHz (Boost Clock), 2632 MHz (OC Mode) • Memory: 8GB GDDR7; Speed: 28 Gbps • CUDA Core: 4608, AI Performance: 767 TOPs • Output: 1x HDMI 2.1b, 3x DisplayPort 2.1b	86000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs160005njjlpsmet0fp	Buy ASUS Dual GeForce RTX 5060 Ti 8GB GDDR7 OC Edition Graphics Card in Bangladesh | LogicBay BD	ASUS Dual GeForce RTX 5060 Ti 8GB GDDR7 OC Edition Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, nvidia geforce, 8gb	f	t	2026-09-23 07:46:08.447	2026-09-23 07:46:08.447	2026-09-23 07:46:08.443
cmudstz9q013v12er7zg4v9o5	PowerColor Hellhound AMD Radeon RX 9060 XT 16GB GDDR6 Graphics Card	powercolor-hellhound-amd-radeon-rx-9060-xt-16gb-gddr6-graphics-card	GPU-POWERCOLOR-HELLHOUND-RX-9060-XT-16GB	\N	Engine Clock: Up to 2740 MHz (Game) / 3310 MHz (Boost) • Memory Speed: 20 Gbps, Memory Interface: 128-bit • Stream Processors: 2048 Units, AMD RDNA 4 Architecture • Output Ports: 1 x HDMI 2.1b, 2 x DisplayPort 2.1a	82800.00	84000.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudstyqt00mn12ery4avore3	Buy PowerColor Hellhound AMD Radeon RX 9060 XT 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	PowerColor Hellhound AMD Radeon RX 9060 XT 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, powercolor, amd radeon, 16gb	f	t	2026-09-23 07:46:08.463	2026-09-23 07:46:08.463	2026-09-23 07:46:08.458
cmudstza6014b12erl2br5p6h	Sapphire Pure AMD Radeon RX 9060 XT GAMING OC 16GB GDDR6 Graphics Card	sapphire-pure-amd-radeon-rx-9060-xt-gaming-oc-16gb-gddr6-graphics-card	GPU-SAPPHIRE-PURE-RX-9060-XT-GAMING-OC-1	\N	Boost Clock: Up to 3290 MHz, Game Clock: Up to 2700 MHz • Memory: 16GB/128-bit DDR6 Stream Processors: 2048 • AMD RDNA 4 Architecture, Ray Accelerator: 32 • Output: 2x HDMI, 1x DisplayPort 2.1a	84900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmtn5e2yh0000udp65aqs32hi	Buy Sapphire Pure AMD Radeon RX 9060 XT GAMING OC 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Sapphire Pure AMD Radeon RX 9060 XT GAMING OC 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, sapphire, amd radeon, 16gb	f	t	2026-09-23 07:46:08.478	2026-09-23 07:46:08.478	2026-09-23 07:46:08.474
cmudstzaj014o12erav9d93gf	PowerColor Fighter AMD Radeon RX 7700 XT 12GB GDDR6 Graphics Card	powercolor-fighter-amd-radeon-rx-7700-xt-12gb-gddr6-graphics-card	GPU-POWERCOLOR-FIGHTER-RX-7700-XT-12GB-G	\N	Engine Clock: Up to 2226 MHz (Game) / 2584 MHz (Boost) • Memory Speed: 18 Gbps, Memory Interface: 192-bit • Stream Processors: 3456 Units, AMD RDNA 3 Architecture • Output Ports: 1 x HDMI 2.1, 3 x DisplayPort 2.1	82000.00	85000.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudstyqt00mn12ery4avore3	Buy PowerColor Fighter AMD Radeon RX 7700 XT 12GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	PowerColor Fighter AMD Radeon RX 7700 XT 12GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, powercolor, amd radeon, 12gb	f	t	2026-09-23 07:46:08.491	2026-09-23 07:46:08.491	2026-09-23 07:46:08.486
cmudstzay015412erjazbb612	ASUS Dual Radeon RX 9060 XT 16GB GDDR6 Graphics Card	asus-dual-radeon-rx-9060-xt-16gb-gddr6-graphics-card	GPU-ASUS-DUAL-RX-9060-XT-16GB-GDDR6	\N	Boost Clock: Up to 3250 MHz, Game Clock: Up to 2640 MHz • Memory: 16GB/128 bit GDDR6, Memory Clock: 20 Gbps Effective • Stream Processors: 2048, AMD RDNA 4 Architecture • Output Ports:1x HDMI, 2x DisplayPort 2.1a	88000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmr9bvs160005njjlpsmet0fp	Buy ASUS Dual Radeon RX 9060 XT 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	ASUS Dual Radeon RX 9060 XT 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, amd radeon, 16gb	f	t	2026-09-23 07:46:08.506	2026-09-23 07:46:08.506	2026-09-23 07:46:08.502
cmudstzbf015i12er79zcig1c	PowerColor AMD Radeon RX 7800 XT 16GB GDDR6 Graphics Card	powercolor-amd-radeon-rx-7800-xt-16gb-gddr6-graphics-card	GPU-POWERCOLOR-RX-7800-XT-16GB-GDDR6	\N	Engine Clock: Up to 2124MHz (Game)/ 2430MHz (Boost) • Memory Speed: 19.5 Gbps, Memory Interface: 256-bit • Stream Processors: 3840 Units, AMD RDNA 3 Architecture • Output Ports: 1 x HDMI 2.1, 3 x DisplayPort 2.1	87000.00	89000.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudstyqt00mn12ery4avore3	Buy PowerColor AMD Radeon RX 7800 XT 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	PowerColor AMD Radeon RX 7800 XT 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, powercolor, amd radeon, 16gb	f	t	2026-09-23 07:46:08.523	2026-09-23 07:46:08.523	2026-09-23 07:46:08.519
cmudstzbw015y12er6x4ouhl2	ASUS Prime Radeon RX 9060 XT 16GB GDDR6 OC Edition Graphics Card	asus-prime-radeon-rx-9060-xt-16gb-gddr6-oc-edition-graphics-card	GPU-ASUS-PRIME-RX-9060-XT-16GB-GDDR6-OC-	\N	Video Memory: 16GB GDDR6, PCI Express 5.0 • Engine Clock: Max. 3330 MHz (OC), Max. 3310 MHz (Default) • Memory Speed: 20 Gbps, Stream Processors: 2048 • Output Ports: 1x Native HDMI 2.1b, 2x Native DisplayPort 2.1a	94000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmr9bvs160005njjlpsmet0fp	Buy ASUS Prime Radeon RX 9060 XT 16GB GDDR6 OC Edition Graphics Card in Bangladesh | LogicBay BD	ASUS Prime Radeon RX 9060 XT 16GB GDDR6 OC Edition Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, amd radeon, 16gb	f	t	2026-09-23 07:46:08.54	2026-09-23 07:46:08.54	2026-09-23 07:46:08.536
cmudstzc9016c12ermdsxgxr6	PowerColor Reaper AMD Radeon RX 9070 GRE 12GB GDDR6 Graphics Card	powercolor-reaper-amd-radeon-rx-9070-gre-12gb-gddr6-graphics-card	GPU-POWERCOLOR-REAPER-RX-9070-GRE-12GB-G	\N	Engine Clock: Up to 2220MHz(Game)/ 2790MHz(Boost) • Memory Speed: 18.0 Gbps, Memory Interface: 192-bit • Stream Processors: 3072 Units, AMD RDNA 4 Architecture • Output Ports: 1 x HDMI 2.1b，3 x DisplayPort 2.1a	89000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudstyqt00mn12ery4avore3	Buy PowerColor Reaper AMD Radeon RX 9070 GRE 12GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	PowerColor Reaper AMD Radeon RX 9070 GRE 12GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, powercolor, amd radeon, 12gb	f	t	2026-09-23 07:46:08.554	2026-09-23 07:46:08.554	2026-09-23 07:46:08.549
cmudstzcr016s12er4nsy9atv	PowerColor Hellhound Spectral White AMD Radeon RX 9060 XT 16GB GDDR6 Graphics Card	powercolor-hellhound-spectral-white-amd-radeon-rx-9060-xt-16gb-gddr6-graphics-card	GPU-POWERCOLOR-HELLHOUND-SPECTRAL-WHITE-	\N	Engine Clock(OC): up to 2740MHz(Game), up to 3310MHz(Boost) • Memory Speed: 20 Gbps, Memory Interface: 128-bit • Stream Processors: 2048 Units, AMD RDNA 4 Architecture • Output Ports: 1 x HDMI 2.1b, 2 x DisplayPort 2.1a	85500.00	90000.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudstyqt00mn12ery4avore3	Buy PowerColor Hellhound Spectral White AMD Radeon RX 9060 XT 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	PowerColor Hellhound Spectral White AMD Radeon RX 9060 XT 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, powercolor, amd radeon, 16gb	f	t	2026-09-23 07:46:08.571	2026-09-23 07:46:08.571	2026-09-23 07:46:08.567
cmudstzd7017712ers8312ffa	Sapphire NITRO+ AMD Radeon RX 9060 XT Gaming OC 16GB GDDR6 Graphics Card	sapphire-nitro-amd-radeon-rx-9060-xt-gaming-oc-16gb-gddr6-graphics-card	GPU-SAPPHIRE-NITRO-RX-9060-XT-GAMING-OC-	\N	Boost Clock: Up to 3320 MHz, Game Clock: Up to 2780 MHz • Memory: 16GB/128 bit GDDR6, Memory Clock: 20 Gbps Effective • Stream Processors: 2048, AMD RDNA 4 Architecture • Output Ports: 2x HDMI, 1x DisplayPort 2.1a	91900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmtn5e2yh0000udp65aqs32hi	Buy Sapphire NITRO+ AMD Radeon RX 9060 XT Gaming OC 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Sapphire NITRO+ AMD Radeon RX 9060 XT Gaming OC 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, sapphire, amd radeon, 16gb	f	t	2026-09-23 07:46:08.587	2026-09-23 07:46:08.587	2026-09-23 07:46:08.583
cmudstzdl017l12ernvl5q9rp	Sapphire PULSE AMD Radeon RX 9070 GRE OC 12GB GDDR6 Graphics Card	sapphire-pulse-amd-radeon-rx-9070-gre-oc-12gb-gddr6-graphics-card	GPU-SAPPHIRE-PULSE-RX-9070-GRE-OC-12GB-G	\N	Video Memory: 12GB GDDR6, PCI Express 5.0 x16 • Boost Clock: Up to 2920MHz, Game Clock: Up to 2340MHz • Stream Processors: 3072, AMD RDNA 4 Architecture • Display Outputs: 2x HDMI 2.1b, 2x DisplayPort 2.1a	92900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmtn5e2yh0000udp65aqs32hi	Buy Sapphire PULSE AMD Radeon RX 9070 GRE OC 12GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Sapphire PULSE AMD Radeon RX 9070 GRE OC 12GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, sapphire, amd radeon, 12gb	f	t	2026-09-23 07:46:08.601	2026-09-23 07:46:08.601	2026-09-23 07:46:08.597
cmudstze0017y12ernuvc8hwd	GUNNIR Intel Arc Pro B60 TF 24GB GDDR6 Workstation Graphics Card	gunnir-intel-arc-pro-b60-tf-24gb-gddr6-workstation-graphics-card	GPU-GUNNIR-ARC-PRO-B60-TF-24GB-GDDR6-WOR	\N	Clock Speed: 2400MHz • Memory: 24GB GDDR6; AI TOPS: 197TOPS • Memory Bandwidth: 456GB/s • Output: DisplayPort x3, HDMI x1	105000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3p001qnjjlnzrmtdrs	cmudsty7z009w12ercqys44k0	Buy GUNNIR Intel Arc Pro B60 TF 24GB GDDR6 Workstation Graphics Card in Bangladesh | LogicBay BD	GUNNIR Intel Arc Pro B60 TF 24GB GDDR6 Workstation Graphics Card. Check price and warranty at LogicBay BD.	graphics card, gunnir, intel arc, 24gb	f	t	2026-09-23 07:46:08.616	2026-09-23 07:46:08.616	2026-09-23 07:46:08.611
cmudstzec018912er97ygzvar	GUNNIR Intel Arc Pro B60 BS 24GB GDDR6 Workstation Graphics Card	gunnir-intel-arc-pro-b60-bs-24gb-gddr6-workstation-graphics-card	GPU-GUNNIR-ARC-PRO-B60-BS-24GB-GDDR6-WOR	\N	Clock Speed: 2000MHz • Memory: 24GB GDDR6; AI TOPS: 164TOPS • Memory Bandwidth: 456GB/s • Output: DisplayPort x3, HDMI x1	105000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3p001qnjjlnzrmtdrs	cmudsty7z009w12ercqys44k0	Buy GUNNIR Intel Arc Pro B60 BS 24GB GDDR6 Workstation Graphics Card in Bangladesh | LogicBay BD	GUNNIR Intel Arc Pro B60 BS 24GB GDDR6 Workstation Graphics Card. Check price and warranty at LogicBay BD.	graphics card, gunnir, intel arc, 24gb	f	t	2026-09-23 07:46:08.629	2026-09-23 07:46:08.629	2026-09-23 07:46:08.624
cmudstzes018k12erx3bms20o	Sapphire PULSE AMD Radeon RX 9070 Gaming 16GB GDDR6 Graphics Card	sapphire-pulse-amd-radeon-rx-9070-gaming-16gb-gddr6-graphics-card	GPU-SAPPHIRE-PULSE-RX-9070-GAMING-16GB-G	\N	Video Memory: 16GB GDDR6, PCI Express 5.0 x16 • Boost Clock: Up to 2520 MHz, Game Clock: Up to 2070 MHz • Stream Processors: 3584, AMD RDNA 4 Architecture • Display Outputs: 2x HDMI, 2x DisplayPort 2.1a	103500.00	110900.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmtn5e2yh0000udp65aqs32hi	Buy Sapphire PULSE AMD Radeon RX 9070 Gaming 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Sapphire PULSE AMD Radeon RX 9070 Gaming 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, sapphire, amd radeon, 16gb	f	t	2026-09-23 07:46:08.644	2026-09-23 07:46:08.644	2026-09-23 07:46:08.639
cmudstzf7018x12erpk4p5qmb	PNY GeForce RTX 5060 Ti 16GB Dual Fan GDDR7 Graphics Card	pny-geforce-rtx-5060-ti-16gb-dual-fan-gddr7-graphics-card	GPU-PNY-RTX-5060-TI-16GB-DUAL-FAN-GDDR7	\N	Video Memory: 16GB GDDR7, PCI-Express 5.0 x8 • Graphics Clock: 2407 MHz, Boost Clock: 2572 MHz • Memory Clock: 28 Gbps, Memory Interface: 128-bit • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	116500.00	115000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs27000rnjjlpj0622kg	Buy PNY GeForce RTX 5060 Ti 16GB Dual Fan GDDR7 Graphics Card in Bangladesh | LogicBay BD	PNY GeForce RTX 5060 Ti 16GB Dual Fan GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, pny, nvidia geforce, 16gb	f	t	2026-09-23 07:46:08.66	2026-09-23 07:46:08.66	2026-09-23 07:46:08.655
cmudstzfo019d12erchqdrufn	Sapphire PURE AMD Radeon RX 9070 Gaming OC 16GB GDDR6 Graphics Card	sapphire-pure-amd-radeon-rx-9070-gaming-oc-16gb-gddr6-graphics-card	GPU-SAPPHIRE-PURE-RX-9070-GAMING-OC-16GB	\N	Video Memory: 16GB GDDR6, PCI Express 5.0 x16 • Boost Clock: Up to 2700 MHz, Game Clock: Up to 2210 MHz • Stream Processors: 3584, AMD RDNA 4 Architecture • Display Outputs: 2x HDMI, 2x DisplayPort 2.1a	109000.00	115900.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmtn5e2yh0000udp65aqs32hi	Buy Sapphire PURE AMD Radeon RX 9070 Gaming OC 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Sapphire PURE AMD Radeon RX 9070 Gaming OC 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, sapphire, amd radeon, 16gb	f	t	2026-09-23 07:46:08.676	2026-09-23 07:46:08.676	2026-09-23 07:46:08.672
cmudstzg3019q12erataxvytx	Colorful GeForce RTX 5060 Ti Battle AX NB DUO 16GB-V GDDR7 Graphics Card	colorful-geforce-rtx-5060-ti-battle-ax-nb-duo-16gb-v-gddr7-graphics-card	GPU-COLORFUL-RTX-5060-TI-BATTLE-AX-NB-DU	\N	Video Memory: 16GB GDDR7, Memory Clock: 28Gbps • Core Clock: Base: 2407 Mhz, Boost: 2572 Mhz • CUDA Cores: 4608, Memory Bandwidth: 448GB/s • Display Outputs: 3x DisplayPort 2.1b, 1x HDMI 2.1b	115000.00	118000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs24000onjjll00hq9a9	Buy Colorful GeForce RTX 5060 Ti Battle AX NB DUO 16GB-V GDDR7 Graphics Card in Bangladesh | LogicBay BD	Colorful GeForce RTX 5060 Ti Battle AX NB DUO 16GB-V GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, colorful, nvidia geforce, 16gb	f	t	2026-09-23 07:46:08.691	2026-09-23 07:46:08.691	2026-09-23 07:46:08.687
cmudstzgj01a412er9tfgr32t	Sapphire NITRO+ AMD Radeon RX 9070 Gaming OC 16GB GDDR6 Graphics Card	sapphire-nitro-amd-radeon-rx-9070-gaming-oc-16gb-gddr6-graphics-card	GPU-SAPPHIRE-NITRO-RX-9070-GAMING-OC-16G	\N	Boost Clock: Up to 2700 MHz, Game Clock: Up to 2210 MHz • Memory: 16GB/ 256 bit GDDR6, 20 Gbps Effective • Stream Processors: 3584, AMD RDNA 4 Architecture • Output Ports: 2x HDMI, 2x DisplayPort 2.1a	107000.00	118900.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmtn5e2yh0000udp65aqs32hi	Buy Sapphire NITRO+ AMD Radeon RX 9070 Gaming OC 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Sapphire NITRO+ AMD Radeon RX 9070 Gaming OC 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, sapphire, amd radeon, 16gb	f	t	2026-09-23 07:46:08.707	2026-09-23 07:46:08.707	2026-09-23 07:46:08.703
cmudstzgy01ah12eriipzmrn6	PowerColor Reaper AMD Radeon RX 9070 16GB GDDR6 Graphics Card	powercolor-reaper-amd-radeon-rx-9070-16gb-gddr6-graphics-card	GPU-POWERCOLOR-REAPER-RX-9070-16GB-GDDR6	\N	Engine Clock: Up to 2070MHz(Game)/ 2520MHz(Boost) • Memory Speed: 20.0 Gbps, Memory Interface: 256-bit • Stream Processors: 3584 Units, AMD RDNA 4 Architecture • Output Ports: 1 x HDMI 2.1b, 3 x DisplayPort 2.1b	119900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudstyqt00mn12ery4avore3	Buy PowerColor Reaper AMD Radeon RX 9070 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	PowerColor Reaper AMD Radeon RX 9070 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, powercolor, amd radeon, 907016gb	f	t	2026-09-23 07:46:08.722	2026-09-23 07:46:08.722	2026-09-23 07:46:08.718
cmudstzhe01ax12ere1960uiw	Manli Nebula V2 GeForce RTX 5060 Ti 16GB GDDR7 Graphics Card	manli-nebula-v2-geforce-rtx-5060-ti-16gb-gddr7-graphics-card	GPU-MANLI-NEBULA-V2-RTX-5060-TI-16GB-GDD	\N	Video Memory: 16GB GDDR7, Memory Clock: 28 Gbps • Core Clock: Base: 2407 MHz; Boost: 2572 MHz • CUDA Cores: 4608, Memory Bandwidth: Up to 448 GB/s • Display Outputs: 3x DisplayPort, 1x HDMI	115000.00	120000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstyly00if12er7qn7ekjz	Buy Manli Nebula V2 GeForce RTX 5060 Ti 16GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	Manli Nebula V2 GeForce RTX 5060 Ti 16GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, manli, nvidia geforce, 16gb	f	t	2026-09-23 07:46:08.738	2026-09-23 07:46:08.738	2026-09-23 07:46:08.733
cmudstzhv01bb12er9i96blt7	Colorful iGame GeForce RTX 5060 Ti Ultra W DUO OC 16GB-V GDDR7 Graphics Card	colorful-igame-geforce-rtx-5060-ti-ultra-w-duo-oc-16gb-v-gddr7-graphics-card	GPU-COLORFUL-IGAME-RTX-5060-TI-ULTRA-W-D-2	\N	Video Memory: 16GB GDDR7, CUDA Cores: 4608 • Core Clock: Base: 2407 MHz; Boost: 2572 MHz • One-Key OC: Base: 2407 MHz, Boost: 2632 MHz • Display Outputs: 3x DisplayPort 2.1b, 1x HDMI 2.1b	113000.00	122000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs24000onjjll00hq9a9	Buy Colorful iGame GeForce RTX 5060 Ti Ultra W DUO OC 16GB-V GDDR7 Graphics Card in Bangladesh | LogicBay BD	Colorful iGame GeForce RTX 5060 Ti Ultra W DUO OC 16GB-V GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, colorful, nvidia geforce, 16gb	f	t	2026-09-23 07:46:08.756	2026-09-23 07:46:08.756	2026-09-23 07:46:08.751
cmudstzia01bo12ereabm993p	Manli Black Stellar GeForce RTX 5060 Ti OC 16GB GDDR7 Graphics Card	manli-black-stellar-geforce-rtx-5060-ti-oc-16gb-gddr7-graphics-card	GPU-MANLI-BLACK-STELLAR-RTX-5060-TI-OC-1	\N	Video Memory: 16GB GDDR7, Memory Clock: 28 Gbps • Core Clock: Base: 2407 MHz; Boost: 2632 MHz • CUDA Cores: 4608, Memory Bandwidth: Up to 448 GB/s • Display Outputs: 3x DisplayPort, 1x HDMI	116000.00	122000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstyly00if12er7qn7ekjz	Buy Manli Black Stellar GeForce RTX 5060 Ti OC 16GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	Manli Black Stellar GeForce RTX 5060 Ti OC 16GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, manli, nvidia geforce, 16gb	f	t	2026-09-23 07:46:08.771	2026-09-23 07:46:08.771	2026-09-23 07:46:08.766
cmudstzir01c212erq9mokixe	PNY GeForce RTX 5060 Ti 16GB OC Dual Fan GDDR7 Graphics Card	pny-geforce-rtx-5060-ti-16gb-oc-dual-fan-gddr7-graphics-card	GPU-PNY-RTX-5060-TI-16GB-OC-DUAL-FAN-GDD	\N	Video Memory: 16GB GDDR7, PCI Express 5.0 x16 • Graphics Clock: 2407 MHz, Boost Clock: 2692 MHz • CUDA Cores: 4608, Memory Clock: 28 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	116500.00	125000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs27000rnjjlpj0622kg	Buy PNY GeForce RTX 5060 Ti 16GB OC Dual Fan GDDR7 Graphics Card in Bangladesh | LogicBay BD	PNY GeForce RTX 5060 Ti 16GB OC Dual Fan GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, pny, nvidia geforce, 16gb	f	t	2026-09-23 07:46:08.787	2026-09-23 07:46:08.787	2026-09-23 07:46:08.782
cmudstzj601cg12ercrpsikef	Manli Nebula GeForce RTX 5070 12GB GDDR7 Graphics Card	manli-nebula-geforce-rtx-5070-12gb-gddr7-graphics-card	GPU-MANLI-NEBULA-RTX-5070-12GB-GDDR7	\N	Video Memory: 12GB GDDR7, Memory Clock: 28 Gbps • Core Clock: Base: 2325 MHz; Boost: 2512 MHz • CUDA Cores: 6144, Memory Bandwidth: Up to 672 GB/s • Display Outputs: 3x DisplayPort, 1x HDMI	125000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstyly00if12er7qn7ekjz	Buy Manli Nebula GeForce RTX 5070 12GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	Manli Nebula GeForce RTX 5070 12GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, manli, nvidia geforce, 12gb	f	t	2026-09-23 07:46:08.803	2026-09-23 07:46:08.803	2026-09-23 07:46:08.798
cmudstzjl01cu12eruag88lcs	Manli Polar Fox GeForce RTX 5060 Ti OC 16GB GDDR7 Graphics Card	manli-polar-fox-geforce-rtx-5060-ti-oc-16gb-gddr7-graphics-card	GPU-MANLI-POLAR-FOX-RTX-5060-TI-OC-16GB-	\N	Video Memory: 16GB GDDR7, Memory Clock: 28 Gbps • Core Clock: Base: 2407 MHz; Boost: 2602 MHz • CUDA Cores: 4608, Memory Bandwidth: Up to 448 GB/s • Display Outputs: 3x DisplayPort, 1x HDMI	119900.00	125000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstyly00if12er7qn7ekjz	Buy Manli Polar Fox GeForce RTX 5060 Ti OC 16GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	Manli Polar Fox GeForce RTX 5060 Ti OC 16GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, manli, nvidia geforce, 16gb	f	t	2026-09-23 07:46:08.817	2026-09-23 07:46:08.817	2026-09-23 07:46:08.813
cmudstzk001d812erzzl2l6h9	INNO3D GeForce RTX 5060 Ti 16GB X3 OC GDDR7 Graphics Card	inno3d-geforce-rtx-5060-ti-16gb-x3-oc-gddr7-graphics-card	GPU-INNO3D-RTX-5060-TI-16GB-X3-OC-GDDR7	\N	Video Memory: 16GB GDDR7, PCI Express Gen 5 • Base Clock: 2407MHz, Boost Clock: 2602MHz • CUDA Cores: 4608, Memory Clock: 28 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	119500.00	125000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstysw00oo12ert0lrel91	Buy INNO3D GeForce RTX 5060 Ti 16GB X3 OC GDDR7 Graphics Card in Bangladesh | LogicBay BD	INNO3D GeForce RTX 5060 Ti 16GB X3 OC GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, inno3d, nvidia geforce, 16gb	f	t	2026-09-23 07:46:08.832	2026-09-23 07:46:08.832	2026-09-23 07:46:08.828
cmudstzkf01dm12erkk556u7h	PowerColor Reaper AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card	powercolor-reaper-amd-radeon-rx-9070-xt-16gb-gddr6-graphics-card	GPU-POWERCOLOR-REAPER-RX-9070-XT-16GB-GD	\N	Engine Clock: Up to 2400MHz(Game)/ 2970MHz(Boost) • Memory Speed: 20.0 Gbps, Memory Interface: 256-bit • Stream Processors: 4096 Units, AMD RDNA 4 Architecture • Output Ports: 1 x HDMI 2.1b, 3 x DisplayPort 2.1b	124500.00	125500.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudstyqt00mn12ery4avore3	Buy PowerColor Reaper AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	PowerColor Reaper AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, powercolor, amd radeon, 16gb	f	t	2026-09-23 07:46:08.847	2026-09-23 07:46:08.847	2026-09-23 07:46:08.842
cmudstzkx01e212er7m0brwga	MSI GeForce RTX 5060 Ti 16G SHADOW 2X OC PLUS 16GB GDDR7 Graphics Card	msi-geforce-rtx-5060-ti-16g-shadow-2x-oc-plus-16gb-gddr7-graphics-card	GPU-MSI-RTX-5060-TI-16G-SHADOW-2X-OC-PLU	\N	Video Memory: 16GB GDDR7, PCI Express 5 • CUDA Cores: 4608 Units, Memory Speed: 28 Gbps • Core Clocks: Extreme: 2617 MHz, Boost: 2602 MHz • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	119900.00	125900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5060 Ti 16G SHADOW 2X OC PLUS 16GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5060 Ti 16G SHADOW 2X OC PLUS 16GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 16gb	f	t	2026-09-23 07:46:08.865	2026-09-23 07:46:08.865	2026-09-23 07:46:08.861
cmudstzlb01ef12erxgf3pcsm	Sapphire Pulse AMD Radeon RX 9070 XT Gaming 16GB GDDR6 Graphics Card	sapphire-pulse-amd-radeon-rx-9070-xt-gaming-16gb-gddr6-graphics-card	GPU-SAPPHIRE-PULSE-RX-9070-XT-GAMING-16G	\N	Boost Clock: Up to 2970 MHz, Game Clock: Up to 2400 MHz • Memory: 16GB/256 bit GDDR6, Memory Clock: 20 Gbps Effective • Stream Processors: 4096, AMD RDNA 4 Architecture • Output Ports: 2x HDMI, 2x DisplayPort 2.1a	125900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmtn5e2yh0000udp65aqs32hi	Buy Sapphire Pulse AMD Radeon RX 9070 XT Gaming 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Sapphire Pulse AMD Radeon RX 9070 XT Gaming 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, sapphire, amd radeon, 16gb	f	t	2026-09-23 07:46:08.879	2026-09-23 07:46:08.879	2026-09-23 07:46:08.875
cmudstzlq01et12erk9q77njv	ASUS Dual GeForce RTX 5060 Ti 16GB GDDR7 OC Edition Graphics Card	asus-dual-geforce-rtx-5060-ti-16gb-gddr7-oc-edition-graphics-card	GPU-ASUS-DUAL-RTX-5060-TI-16GB-GDDR7-OC-	\N	Engine Clock: 2602 MHz (Boost Clock), 2632 MHz (OC Mode) • Memory: 16GB GDDR7; Speed: 28 Gbps • CUDA Core: 4608, AI Performance: 767 TOPs • Output: 1x HDMI 2.1b, 3x DisplayPort 2.1b	125900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs160005njjlpsmet0fp	Buy ASUS Dual GeForce RTX 5060 Ti 16GB GDDR7 OC Edition Graphics Card in Bangladesh | LogicBay BD	ASUS Dual GeForce RTX 5060 Ti 16GB GDDR7 OC Edition Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, nvidia geforce, 16gb	f	t	2026-09-23 07:46:08.894	2026-09-23 07:46:08.894	2026-09-23 07:46:08.89
cmudstzm501f712erihhn7ome	Sapphire PURE AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card	sapphire-pure-amd-radeon-rx-9070-xt-16gb-gddr6-graphics-card	GPU-SAPPHIRE-PURE-RX-9070-XT-16GB-GDDR6	\N	Boost Clock: Up to 3010 MHz • Game Clock: Up to 2460 MHz • Memory: 16GB/256-bit GDDR6. 20Gbps Effective • Output: 2x HDMI, 2x DisplayPort	128900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmtn5e2yh0000udp65aqs32hi	Buy Sapphire PURE AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Sapphire PURE AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, sapphire, amd radeon, 16gb	f	t	2026-09-23 07:46:08.909	2026-09-23 07:46:08.909	2026-09-23 07:46:08.905
cmudstzmi01fk12erm3v2fgda	PowerColor Hellhound AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card	powercolor-hellhound-amd-radeon-rx-9070-xt-16gb-gddr6-graphics-card	GPU-POWERCOLOR-HELLHOUND-RX-9070-XT-16GB	\N	Engine Clock: Up to 2460MHz(Game)/ 3010MHz(Boost) • Memory Speed: 20.0 Gbps, Memory Interface: 256-bit • Stream Processors: 4096 Units, AMD RDNA 4 Architecture • Output Ports: 1 x HDMI 2.1b, 3 x DisplayPort 2.1b	129000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudstyqt00mn12ery4avore3	Buy PowerColor Hellhound AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	PowerColor Hellhound AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, powercolor, amd radeon, 16gb	f	t	2026-09-23 07:46:08.922	2026-09-23 07:46:08.922	2026-09-23 07:46:08.918
cmudstzmz01g012erery6dxfo	Manli Polar Fox V2 GeForce RTX 5070 OC 12GB GDDR7 Graphics Card	manli-polar-fox-v2-geforce-rtx-5070-oc-12gb-gddr7-graphics-card	GPU-MANLI-POLAR-FOX-V2-RTX-5070-OC-12GB-	\N	Video Memory: 12GB GDDR7, Memory Clock: 28 Gbps • Core Clock: Base: 2325 MHz; Boost: 2542 MHz • CUDA Cores: 6144, Memory Bandwidth: Up to 672 GB/s • Display Outputs: 3x DisplayPort, 1x HDMI	132500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstyly00if12er7qn7ekjz	Buy Manli Polar Fox V2 GeForce RTX 5070 OC 12GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	Manli Polar Fox V2 GeForce RTX 5070 OC 12GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, manli, nvidia geforce, 12gb	f	t	2026-09-23 07:46:08.939	2026-09-23 07:46:08.939	2026-09-23 07:46:08.935
cmudstznd01ge12er1kclmirs	MSI GeForce RTX 5070 12G SHADOW 2X OC 12GB GDDR7 Graphics Card	msi-geforce-rtx-5070-12g-shadow-2x-oc-12gb-gddr7-graphics-card	GPU-MSI-RTX-5070-12G-SHADOW-2X-OC-12GB-G	\N	Core Clock: 2557 MHz ; Boost: 2542 MHz • Memory Clock: 28 Gbps • CUDA Cores: 6144 • Output: DP 2.1b x3, HDMI 2.1b x1	126900.00	134900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5070 12G SHADOW 2X OC 12GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5070 12G SHADOW 2X OC 12GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 12gb	f	t	2026-09-23 07:46:08.954	2026-09-23 07:46:08.954	2026-09-23 07:46:08.949
cmudstznw01gs12errl0d3y40	MSI GeForce RTX 5070 12G VENTUS 2X OC 12GB GDDR7 Graphics Card	msi-geforce-rtx-5070-12g-ventus-2x-oc-12gb-gddr7-graphics-card	GPU-MSI-RTX-5070-12G-VENTUS-2X-OC-12GB-G	\N	Core Clock: 2557 MHz ; Boost: 2542 MHz • Memory Clock: 28 Gbps • CUDA Cores: 6144 • Output: DP 2.1b x3, HDMI 2.1b x1	129900.00	134900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5070 12G VENTUS 2X OC 12GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5070 12G VENTUS 2X OC 12GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 12gb	f	t	2026-09-23 07:46:08.973	2026-09-23 07:46:08.973	2026-09-23 07:46:08.968
cmudstzof01h612er2qhjwjzc	ZOTAC GAMING GeForce RTX 5070 Twin Edge OC 12GB GDDR7 White Graphics Card	zotac-gaming-geforce-rtx-5070-twin-edge-oc-12gb-gddr7-white-graphics-card	GPU-ZOTAC-GAMING-RTX-5070-TWIN-EDGE-OC-1	\N	Video Memory: 12GB GDDR7, PCI Express 5.0 x16 • Engine Clock: 2542 MHz, CUDA Cores: 6144 • Memory Clock: 28 Gbps, Memory Bus: 192-bit • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	134900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstypz00lx12erbs68awur	Buy ZOTAC GAMING GeForce RTX 5070 Twin Edge OC 12GB GDDR7 White Graphics Card in Bangladesh | LogicBay BD	ZOTAC GAMING GeForce RTX 5070 Twin Edge OC 12GB GDDR7 White Graphics Card. Check price and warranty at LogicBay BD.	graphics card, zotac, nvidia geforce, 12gb	f	t	2026-09-23 07:46:08.991	2026-09-23 07:46:08.991	2026-09-23 07:46:08.987
cmudstzoz01hl12eroy275st3	Colorful iGame GeForce RTX 5070 Ultra W OC 12GB-V GDDR7 Graphics Card	colorful-igame-geforce-rtx-5070-ultra-w-oc-12gb-v-gddr7-graphics-card	GPU-COLORFUL-IGAME-RTX-5070-ULTRA-W-OC-1	\N	Memory Clock: 28Gbps, Memory Bus: 192bit • Core Clock Base: 2325Mhz; Boost: 2512Mhz • One-Key OC Base: 2325Mhz; Boost: 2557Mhz • Output Ports: 1x HDMI 2.1b, 3x DisplayPort 2.1b	128900.00	135000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs24000onjjll00hq9a9	Buy Colorful iGame GeForce RTX 5070 Ultra W OC 12GB-V GDDR7 Graphics Card in Bangladesh | LogicBay BD	Colorful iGame GeForce RTX 5070 Ultra W OC 12GB-V GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, colorful, nvidia geforce, 12gb	f	t	2026-09-23 07:46:09.011	2026-09-23 07:46:09.011	2026-09-23 07:46:09.007
cmudstzpe01hz12erbyr7pfgz	PNY GeForce RTX 5070 ARGB EPIC-X RGB OC Triple Fan 12GB GDDR7 Graphics Card	pny-geforce-rtx-5070-argb-epic-x-rgb-oc-triple-fan-12gb-gddr7-graphics-card	GPU-PNY-RTX-5070-ARGB-EPIC-X-RGB-OC-TRIP	\N	Video Memory: 12GB GDDR7, PCI-Express 5.0 x16 • Core Clock: 2.16Ghz, Memory Interface: 192-bit • CUDA Cores: 6144, Memory Clock: 28 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	145000.00	150000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs27000rnjjlpj0622kg	Buy PNY GeForce RTX 5070 ARGB EPIC-X RGB OC Triple Fan 12GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	PNY GeForce RTX 5070 ARGB EPIC-X RGB OC Triple Fan 12GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, pny, nvidia geforce, 12gb	f	t	2026-09-23 07:46:09.026	2026-09-23 07:46:09.026	2026-09-23 07:46:09.021
cmudstzpu01if12eroji3dv7a	MSI GeForce RTX 5070 12G INSPIRE 3X OC GDDR7 Graphics Card	msi-geforce-rtx-5070-12g-inspire-3x-oc-gddr7-graphics-card	GPU-MSI-RTX-5070-12G-INSPIRE-3X-OC-GDDR7	\N	Core Clock: 2557 MHz ; Boost: 2542 MHz • Memory Clock: 28 Gbps • CUDA Cores: 6144 • Output: DP 2.1b x3, HDMI 2.1b x1	139900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5070 12G INSPIRE 3X OC GDDR7 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5070 12G INSPIRE 3X OC GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce,	f	t	2026-09-23 07:46:09.043	2026-09-23 07:46:09.043	2026-09-23 07:46:09.038
cmudstzq701ir12erp50lts1d	ASUS Dual GeForce RTX 5070 12GB GDDR7 OC Edition Graphics Card	asus-dual-geforce-rtx-5070-12gb-gddr7-oc-edition-graphics-card	GPU-ASUS-DUAL-RTX-5070-12GB-GDDR7-OC-EDI	\N	OC Mode: 2572MHz; Default : 2542MHz (Boost) • Memory: 12GB GDDR7 • CUDA Core: 6144 • Output: 1x HDMI 2.1b, 3x DisplayPort 2.1b	129999.00	140000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs160005njjlpsmet0fp	Buy ASUS Dual GeForce RTX 5070 12GB GDDR7 OC Edition Graphics Card in Bangladesh | LogicBay BD	ASUS Dual GeForce RTX 5070 12GB GDDR7 OC Edition Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, nvidia geforce, 507012gb	f	t	2026-09-23 07:46:09.056	2026-09-23 07:46:09.056	2026-09-23 07:46:09.051
cmudstzql01j412er75wrt7og	ASUS TUF Gaming GeForce RTX 4070 Ti SUPER BTF White OC Edition 16GB GDDR6X Graphics Card	asus-tuf-gaming-geforce-rtx-4070-ti-super-btf-white-oc-edition-16gb-gddr6x-graphics-card	GPU-ASUS-TUF-GAMING-RTX-4070-TI-SUPER-BT	\N	OC mode: 2670 MHz • Default mode: 2640 MHz (boost) • Memory: 16GB GDDR6X • Output: 2x HDMI 2.1, 3x DisplayPort 1.4a	151000.00	166000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs160005njjlpsmet0fp	Buy ASUS TUF Gaming GeForce RTX 4070 Ti SUPER BTF White OC Edition 16GB GDDR6X Graphics Card in Bangladesh | LogicBay BD	ASUS TUF Gaming GeForce RTX 4070 Ti SUPER BTF White OC Edition 16GB GDDR6X Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, nvidia geforce, 16gb	f	t	2026-09-23 07:46:09.07	2026-09-23 07:46:09.07	2026-09-23 07:46:09.065
cmudstzr101jh12er86uz6aws	ASUS PRIME GeForce RTX 5070 Ti 16GB GDDR7 OC Edition Graphics Card	asus-prime-geforce-rtx-5070-ti-16gb-gddr7-oc-edition-graphics-card	GPU-ASUS-PRIME-RTX-5070-TI-16GB-GDDR7-OC	\N	Engine Clock: 2527MHz (OC) ; Boost: 2497MHz • Memory Size: 16GB GDDR7, Speed: 28 Gbps • CUDA Cores: 8960, AI Performance: 1432 TOPs • Interface: Native DP 2.1b x3, Native HDMI 2.1b x1	192000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs160005njjlpsmet0fp	Buy ASUS PRIME GeForce RTX 5070 Ti 16GB GDDR7 OC Edition Graphics Card in Bangladesh | LogicBay BD	ASUS PRIME GeForce RTX 5070 Ti 16GB GDDR7 OC Edition Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, nvidia geforce, 16gb	f	t	2026-09-23 07:46:09.086	2026-09-23 07:46:09.086	2026-09-23 07:46:09.081
cmudstzrh01jx12erzg8f4cq3	PNY GeForce RTX 5070 Ti OC Triple Fan 16GB GDDR7 Graphic Card	pny-geforce-rtx-5070-ti-oc-triple-fan-16gb-gddr7-graphic-card	GPU-PNY-RTX-5070-TI-OC-TRIPLE-FAN-16GB-G	\N	Video Memory: 16GB GDDR7, PCI-Express 5.0 x16 • Core Clock: 2295 MHz, Boost Clock: 2572 MHz • CUDA Cores: 8960, Memory Clock: 28 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	181900.00	185000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs27000rnjjlpj0622kg	Buy PNY GeForce RTX 5070 Ti OC Triple Fan 16GB GDDR7 Graphic Card in Bangladesh | LogicBay BD	PNY GeForce RTX 5070 Ti OC Triple Fan 16GB GDDR7 Graphic Card. Check price and warranty at LogicBay BD.	graphics card, pny, nvidia geforce, 16gb	f	t	2026-09-23 07:46:09.102	2026-09-23 07:46:09.102	2026-09-23 07:46:09.097
cmudstzrw01kb12err5pb40z9	PNY GeForce RTX 5070 Ti ARGB EPIC-X RGB Triple Fan 16GB GDDR7 Graphics Card	pny-geforce-rtx-5070-ti-argb-epic-x-rgb-triple-fan-16gb-gddr7-graphics-card	GPU-PNY-RTX-5070-TI-ARGB-EPIC-X-RGB-TRIP	\N	Video Memory: 16GB GDDR7, PCI Express 5.0 x16 • Graphics Clock: 2.3 GHz, Boost Clock: 2.45 GHz • CUDA Cores: 8,960, Memory Clock: 28 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	185000.00	189900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs27000rnjjlpj0622kg	Buy PNY GeForce RTX 5070 Ti ARGB EPIC-X RGB Triple Fan 16GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	PNY GeForce RTX 5070 Ti ARGB EPIC-X RGB Triple Fan 16GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, pny, nvidia geforce, 16gb	f	t	2026-09-23 07:46:09.116	2026-09-23 07:46:09.116	2026-09-23 07:46:09.112
cmudstzsb01kp12erobt9aza6	GUNNIR Intel Arc Pro B70 TF 32GB GDDR6 Workstation Graphics Card	gunnir-intel-arc-pro-b70-tf-32gb-gddr6-workstation-graphics-card	GPU-GUNNIR-ARC-PRO-B70-TF-32GB-GDDR6-WOR	\N	Clock Speed: 2600MHz • Memory: 32GB GDDR6; AI TOPS: 367TOPS • Memory Bandwidth: 608GB/s • Output: DisplayPort x3, HDMI x1	192000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3p001qnjjlnzrmtdrs	cmudsty7z009w12ercqys44k0	Buy GUNNIR Intel Arc Pro B70 TF 32GB GDDR6 Workstation Graphics Card in Bangladesh | LogicBay BD	GUNNIR Intel Arc Pro B70 TF 32GB GDDR6 Workstation Graphics Card. Check price and warranty at LogicBay BD.	graphics card, gunnir, intel arc, 32gb	f	t	2026-09-23 07:46:09.131	2026-09-23 07:46:09.131	2026-09-23 07:46:09.126
cmudstzsn01l012erraic6411	GUNNIR Intel Arc Pro B70 BD 32GB GDDR6 Workstation Graphics Card	gunnir-intel-arc-pro-b70-bd-32gb-gddr6-workstation-graphics-card	GPU-GUNNIR-ARC-PRO-B70-BD-32GB-GDDR6-WOR	\N	Clock Speed: 2800MHz • Memory: 32GB GDDR6; AI TOPS: 367TOPS • Memory Bandwidth: 608GB/s • Output: DisplayPort x3, HDMI x1	192000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3p001qnjjlnzrmtdrs	cmudsty7z009w12ercqys44k0	Buy GUNNIR Intel Arc Pro B70 BD 32GB GDDR6 Workstation Graphics Card in Bangladesh | LogicBay BD	GUNNIR Intel Arc Pro B70 BD 32GB GDDR6 Workstation Graphics Card. Check price and warranty at LogicBay BD.	graphics card, gunnir, intel arc, 32gb	f	t	2026-09-23 07:46:09.143	2026-09-23 07:46:09.143	2026-09-23 07:46:09.139
cmudstzt101lb12eroaxmkvgp	MSI GeForce RTX 5070 Ti 16G SHADOW 3X OC 16GB GDDR7 Graphics Card	msi-geforce-rtx-5070-ti-16g-shadow-3x-oc-16gb-gddr7-graphics-card	GPU-MSI-RTX-5070-TI-16G-SHADOW-3X-OC-16G	\N	Core Clock: 2497 MHz ; Boost: 2482 MHz • Memory Clock: 28 Gbps • CUDA Cores: 8960 • Output: DP 2.1b x3, HDMI 2.1b x1	194000.00	194900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5070 Ti 16G SHADOW 3X OC 16GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5070 Ti 16G SHADOW 3X OC 16GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 16gb	f	t	2026-09-23 07:46:09.157	2026-09-23 07:46:09.157	2026-09-23 07:46:09.153
cmudstztf01lp12erd4lgovn1	MSI GeForce RTX 5070 Ti 16G VENTUS 3X OC 16GB GDDR7 Graphics Card	msi-geforce-rtx-5070-ti-16g-ventus-3x-oc-16gb-gddr7-graphics-card	GPU-MSI-RTX-5070-TI-16G-VENTUS-3X-OC-16G	\N	Video Memory: 16GB GDDR7, PCI Express 5.0 x16 • CUDA Cores: 8960 Units, Memory Speed: 28 Gbps • Core Clocks: Extreme: 2497 MHz, Boost: 2482 MHz • Display Outputs: 3 x DisplayPort 2.1a, 1 x HDMI	191900.00	195900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5070 Ti 16G VENTUS 3X OC 16GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5070 Ti 16G VENTUS 3X OC 16GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 16gb	f	t	2026-09-23 07:46:09.171	2026-09-23 07:46:09.171	2026-09-23 07:46:09.167
cmudstztv01m212ervmhfad1h	Manli Nebula GeForce RTX 5080 16GB GDDR7 Graphics Card	manli-nebula-geforce-rtx-5080-16gb-gddr7-graphics-card	GPU-MANLI-NEBULA-RTX-5080-16GB-GDDR7	\N	Video Memory: 16GB GDDR7, Memory Clock: 30 Gbps • Core Clock: Base: 2295 MHz; Boost: 2617 MHz • CUDA Cores: 10752, Memory Bandwidth: Up to 960 GB/s • Display Outputs: 3x DisplayPort, 1x HDMI	210000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstyly00if12er7qn7ekjz	Buy Manli Nebula GeForce RTX 5080 16GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	Manli Nebula GeForce RTX 5080 16GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, manli, nvidia geforce, 16gb	f	t	2026-09-23 07:46:09.187	2026-09-23 07:46:09.187	2026-09-23 07:46:09.183
cmudstzua01mg12er0pl1nqop	Manli Polar Fox V2 GeForce RTX 5080 OC 16GB GDDR7 Graphics Card	manli-polar-fox-v2-geforce-rtx-5080-oc-16gb-gddr7-graphics-card	GPU-MANLI-POLAR-FOX-V2-RTX-5080-OC-16GB-	\N	Video Memory: 16GB GDDR7, Memory Clock: 30 Gbps • Core Clock: Base: 2295 MHz; Boost: 2640 MHz • CUDA Cores: 10752, Memory Bandwidth: Up to 960 GB/s • Display Outputs: 3x DisplayPort, 1x HDMI	215000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstyly00if12er7qn7ekjz	Buy Manli Polar Fox V2 GeForce RTX 5080 OC 16GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	Manli Polar Fox V2 GeForce RTX 5080 OC 16GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, manli, nvidia geforce, 16gb	f	t	2026-09-23 07:46:09.203	2026-09-23 07:46:09.203	2026-09-23 07:46:09.198
cmudstzup01mu12er0nhc0tkn	PNY GeForce RTX 5070 Ti Epic-X ARGB OC Triple Fan 16GB GDDR7 Graphic Card	pny-geforce-rtx-5070-ti-epic-x-argb-oc-triple-fan-16gb-gddr7-graphic-card	GPU-PNY-RTX-5070-TI-EPIC-X-ARGB-OC-TRIPL	\N	Video Memory: 16GB GDDR7, PCI-Express 5.0 x16 • Core Clock: 2295 MHz, Boost Clock: 2640 MHz • CUDA Cores: 8960, Memory Clock: 28 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	189900.00	220000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs27000rnjjlpj0622kg	Buy PNY GeForce RTX 5070 Ti Epic-X ARGB OC Triple Fan 16GB GDDR7 Graphic Card in Bangladesh | LogicBay BD	PNY GeForce RTX 5070 Ti Epic-X ARGB OC Triple Fan 16GB GDDR7 Graphic Card. Check price and warranty at LogicBay BD.	graphics card, pny, nvidia geforce, 16gb	f	t	2026-09-23 07:46:09.217	2026-09-23 07:46:09.217	2026-09-23 07:46:09.212
cmudstzv301n812er596pukvk	PNY GeForce RTX 5080 OC 16GB Triple Fan GDDR7 Graphics Card	pny-geforce-rtx-5080-oc-16gb-triple-fan-gddr7-graphics-card	GPU-PNY-RTX-5080-OC-16GB-TRIPLE-FAN-GDDR	\N	Video Memory: 16GB GDDR7, PCI-Express 5.0 x16 • Core Clock: 2330 MHz, Boost Clock: 2620 MHz • CUDA Cores: 10752, Memory Bus: 256-bit • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	245000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs27000rnjjlpj0622kg	Buy PNY GeForce RTX 5080 OC 16GB Triple Fan GDDR7 Graphics Card in Bangladesh | LogicBay BD	PNY GeForce RTX 5080 OC 16GB Triple Fan GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, pny, nvidia geforce, 16gb	f	t	2026-09-23 07:46:09.232	2026-09-23 07:46:09.232	2026-09-23 07:46:09.227
cmudstzvg01nl12eroeblmad2	MSI GeForce RTX 5080 16G INSPIRE 3X OC 16GB GDDR7 Graphics Card	msi-geforce-rtx-5080-16g-inspire-3x-oc-16gb-gddr7-graphics-card	GPU-MSI-RTX-5080-16G-INSPIRE-3X-OC-16GB-	\N	Video Memory: 16GB GDDR7, PCI Express 5 • CUDA Cores: 10752 Units, Memory Speed: 30 Gbps • Core Clocks: Extreme: 2655 MHz, Boost: 2640 MHz • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	249000.00	249900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5080 16G INSPIRE 3X OC 16GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5080 16G INSPIRE 3X OC 16GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 16gb	f	t	2026-09-23 07:46:09.245	2026-09-23 07:46:09.245	2026-09-23 07:46:09.24
cmudstzvu01ny12erg8x8ci18	MSI GeForce RTX 5080 16G VENTUS 3X OC 16GB GDDR7 Graphics Card	msi-geforce-rtx-5080-16g-ventus-3x-oc-16gb-gddr7-graphics-card	GPU-MSI-RTX-5080-16G-VENTUS-3X-OC-16GB-G	\N	Video Memory: 16GB GDDR7, PCI Express 5 • CUDA Cores: 10752 Units, Memory Speed: 30 Gbps • Core Clocks: Extreme: 2655 MHz, Boost: 2640 MHz • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	245000.00	251900.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs1n000dnjjlcwqqzlt2	Buy MSI GeForce RTX 5080 16G VENTUS 3X OC 16GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	MSI GeForce RTX 5080 16G VENTUS 3X OC 16GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, msi, nvidia geforce, 16gb	f	t	2026-09-23 07:46:09.259	2026-09-23 07:46:09.259	2026-09-23 07:46:09.254
cmudstzw801ob12er1t56gejd	PowerColor Radeon AI PRO R9700 32GB GDDR6 Graphics Card	powercolor-radeon-ai-pro-r9700-32gb-gddr6-graphics-card	GPU-POWERCOLOR-AI-PRO-R9700-32GB-GDDR6	\N	Engine Clock: Up to 2350MHz(Game) / 2920MHz(Boost) • Memory Speed: 20.0 Gbps, Memory Interface: 256-bit • Stream Processors: 1024 Units, AMD RDNA 4 Architecture • Output Ports: 4 x DisplayPort 2.1a	295000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudstyqt00mn12ery4avore3	Buy PowerColor Radeon AI PRO R9700 32GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	PowerColor Radeon AI PRO R9700 32GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, powercolor, amd radeon, 970032gb	f	t	2026-09-23 07:46:09.273	2026-09-23 07:46:09.273	2026-09-23 07:46:09.268
cmudstzwo01op12er5dxbwwnl	Colorful iGame GeForce RTX 5080 Neptune OC 16GB-V GDDR7 Graphics Card	colorful-igame-geforce-rtx-5080-neptune-oc-16gb-v-gddr7-graphics-card	GPU-COLORFUL-IGAME-RTX-5080-NEPTUNE-OC-1	\N	Memory Clock: 30 Gbps, Memory Bus: 256 bit • Core Clock Base: 2295Mhz; Boost:2617Mhz • One-Key OC Base: 2295Mhz; Boost:2695Mhz • Output Ports: 1x HDMI 2.1b, 3x DisplayPort 2.1b	259000.00	310000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs24000onjjll00hq9a9	Buy Colorful iGame GeForce RTX 5080 Neptune OC 16GB-V GDDR7 Graphics Card in Bangladesh | LogicBay BD	Colorful iGame GeForce RTX 5080 Neptune OC 16GB-V GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, colorful, nvidia geforce, 16gb	f	t	2026-09-23 07:46:09.288	2026-09-23 07:46:09.288	2026-09-23 07:46:09.284
cmudstzx301p312eralcuv53b	PNY GeForce RTX 5090 32GB GDDR7 Overclocked Triple Fan Graphics Card	pny-geforce-rtx-5090-32gb-gddr7-overclocked-triple-fan-graphics-card	GPU-PNY-RTX-5090-32GB-GDDR7-OVERCLOCKED-	\N	Boost Speed: 2527 MHz, Bus Type: PCI-Express 5.0 x16 • Memory: 32GB GDDR7, Memory Interface: 5126-bit • CUDA Cores: 21,760, Memory Bandwidth: 1792 GB/sec • Outputs: 3x DisplayPort 2.1b, 1x HDMI 2.1b	610000.00	700000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs27000rnjjlpj0622kg	Buy PNY GeForce RTX 5090 32GB GDDR7 Overclocked Triple Fan Graphics Card in Bangladesh | LogicBay BD	PNY GeForce RTX 5090 32GB GDDR7 Overclocked Triple Fan Graphics Card. Check price and warranty at LogicBay BD.	graphics card, pny, nvidia geforce, 509032gb	f	t	2026-09-23 07:46:09.304	2026-09-23 07:46:09.304	2026-09-23 07:46:09.299
cmudstzxi01pi12erd0ul87b4	ASUS TUF Gaming GeForce RTX 5090 32GB GDDR7 OC Edition Graphics Card	asus-tuf-gaming-geforce-rtx-5090-32gb-gddr7-oc-edition-graphics-card	GPU-ASUS-TUF-GAMING-RTX-5090-32GB-GDDR7-	\N	Video Memory: 32GB GDDR7, CUDA Core: 21760 • Memory Speed: 28 Gbps, Memory Interface: 512-bit • Engine Clock: 2550 MHz(Boost clock), OC Mode: 2580 MHz • Output Ports: 2x Native HDMI 2.1b, 3x Native DisplayPort 2.1a	750000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs160005njjlpsmet0fp	Buy ASUS TUF Gaming GeForce RTX 5090 32GB GDDR7 OC Edition Graphics Card in Bangladesh | LogicBay BD	ASUS TUF Gaming GeForce RTX 5090 32GB GDDR7 OC Edition Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, nvidia geforce, 32gb	f	t	2026-09-23 07:46:09.318	2026-09-23 07:46:09.318	2026-09-23 07:46:09.314
cmudstzxy01py12er4nktmqdf	PNY GeForce RTX 5050 8GB Dual Fan GDDR6 Graphics Card	pny-geforce-rtx-5050-8gb-dual-fan-gddr6-graphics-card	GPU-PNY-RTX-5050-8GB-DUAL-FAN-GDDR6	\N	Video Memory: 8GB GDDR6, PCI Express 5.0 x8 • Clock Speed: 2317 MHz, Boost Clock: 2572 MHz • CUDA Cores: 2560, Memory Speed: 20 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	52000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs27000rnjjlpj0622kg	Buy PNY GeForce RTX 5050 8GB Dual Fan GDDR6 Graphics Card in Bangladesh | LogicBay BD	PNY GeForce RTX 5050 8GB Dual Fan GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, pny, nvidia geforce, 8gb	f	t	2026-09-23 07:46:09.334	2026-09-23 07:46:09.334	2026-09-23 07:46:09.33
cmudstzyb01qb12ersb7tri9h	ZOTAC GAMING GeForce RTX 5060 Twin Edge Plus 8GB GDDR7 Graphics Card	zotac-gaming-geforce-rtx-5060-twin-edge-plus-8gb-gddr7-graphics-card	GPU-ZOTAC-GAMING-RTX-5060-TWIN-EDGE-PLUS	\N	Video Memory: 8GB GDDR7, PCI Express 5.0 x8 • Engine Clock: 2497 MHz, CUDA Cores: 3840 • AI TOPs: 614; Memory Clock: 28 Gbps; Bus: 128-bit • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	58500.00	59500.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstypz00lx12erbs68awur	Buy ZOTAC GAMING GeForce RTX 5060 Twin Edge Plus 8GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	ZOTAC GAMING GeForce RTX 5060 Twin Edge Plus 8GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, zotac, nvidia geforce, 8gb	f	t	2026-09-23 07:46:09.348	2026-09-23 07:46:09.348	2026-09-23 07:46:09.343
cmudstzyq01qq12erh9npspv8	ASUS Dual GeForce RTX 5060 8GB GDDR7 OC Edition Graphics Card	asus-dual-geforce-rtx-5060-8gb-gddr7-oc-edition-graphics-card	GPU-ASUS-DUAL-RTX-5060-8GB-GDDR7-OC-EDIT	\N	Engine Clock: 2535 MHz (Boost Clock), 2565 MHz(OC Mode) • Memory: 8GB GDDR7; Speed: 28 Gbps • CUDA Core: 3840, AI Performance: 623 TOPs • Output: 1x HDMI 2.1b, 3x DisplayPort 2.1b	60900.00	65000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs160005njjlpsmet0fp	Buy ASUS Dual GeForce RTX 5060 8GB GDDR7 OC Edition Graphics Card in Bangladesh | LogicBay BD	ASUS Dual GeForce RTX 5060 8GB GDDR7 OC Edition Graphics Card. Check price and warranty at LogicBay BD.	graphics card, asus, nvidia geforce, 50608gb	f	t	2026-09-23 07:46:09.363	2026-09-23 07:46:09.363	2026-09-23 07:46:09.358
cmudstzz601r412erqs95tl8n	PNY GeForce RTX 5060 Ti 8GB EPIC-X RGB OC Triple Fan GDDR7 Graphics Card	pny-geforce-rtx-5060-ti-8gb-epic-x-rgb-oc-triple-fan-gddr7-graphics-card	GPU-PNY-RTX-5060-TI-8GB-EPIC-X-RGB-OC-TR	\N	Video Memory: 8GB GDDR7, PCI Express 5.0 x8 • Graphics Clock: 2407 MHz, Boost Clock: 2692 MHz • TDP: 180W, Memory Clock: 28 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	88500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs27000rnjjlpj0622kg	Buy PNY GeForce RTX 5060 Ti 8GB EPIC-X RGB OC Triple Fan GDDR7 Graphics Card in Bangladesh | LogicBay BD	PNY GeForce RTX 5060 Ti 8GB EPIC-X RGB OC Triple Fan GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, pny, nvidia geforce, 8gb	f	t	2026-09-23 07:46:09.379	2026-09-23 07:46:09.379	2026-09-23 07:46:09.374
cmudstzzl01ri12erdzjxpipj	ZOTAC GAMING GeForce RTX 5070 Twin Edge OC 12GB GDDR7 Graphics Card	zotac-gaming-geforce-rtx-5070-twin-edge-oc-12gb-gddr7-graphics-card	GPU-ZOTAC-GAMING-RTX-5070-TWIN-EDGE-OC-1-2	\N	Video Memory: 12GB GDDR7, PCI Express 5.0 x16 • Engine Clock: 2542 MHz, CUDA Cores: 6144 • Memory Clock: 28 Gbps, Memory Bus: 192-bit • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	127900.00	140000.00	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstypz00lx12erbs68awur	Buy ZOTAC GAMING GeForce RTX 5070 Twin Edge OC 12GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	ZOTAC GAMING GeForce RTX 5070 Twin Edge OC 12GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, zotac, nvidia geforce, 12gb	f	t	2026-09-23 07:46:09.393	2026-09-23 07:46:09.393	2026-09-23 07:46:09.388
cmudsu00301rx12er5fj14de0	PNY GeForce RTX 5070 Triple Fan 12GB GDDR7 Graphic Card	pny-geforce-rtx-5070-triple-fan-12gb-gddr7-graphic-card	GPU-PNY-RTX-5070-TRIPLE-FAN-12GB-GDDR7	\N	Video Memory: 12GB GDDR7, PCI-Express 5.0 x16 • Core Clock: 2325 MHz, Boost Clock: 2512 MHz • CUDA Cores: 6144, Memory Clock: 28 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	145000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs27000rnjjlpj0622kg	Buy PNY GeForce RTX 5070 Triple Fan 12GB GDDR7 Graphic Card in Bangladesh | LogicBay BD	PNY GeForce RTX 5070 Triple Fan 12GB GDDR7 Graphic Card. Check price and warranty at LogicBay BD.	graphics card, pny, nvidia geforce, 12gb	f	t	2026-09-23 07:46:09.411	2026-09-23 07:46:09.411	2026-09-23 07:46:09.407
cmudsu00h01sb12er19a9dtdu	PowerColor Red Devil AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card	powercolor-red-devil-amd-radeon-rx-9070-xt-16gb-gddr6-graphics-card	GPU-POWERCOLOR-RED-DEVIL-RX-9070-XT-16GB	\N	Engine Clock: Up to 2520MHz(Game)/ 3060MHz(Boost) • Memory Speed: 20.0 Gbps, Memory Interface: 256-bit • Stream Processors: 4096 Units, AMD RDNA 4 Architecture • Output Ports: 1 x HDMI 2.1b, 3 x DisplayPort 2.1b	137000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudstyqt00mn12ery4avore3	Buy PowerColor Red Devil AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	PowerColor Red Devil AMD Radeon RX 9070 XT 16GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, powercolor, amd radeon, 16gb	f	t	2026-09-23 07:46:09.425	2026-09-23 07:46:09.425	2026-09-23 07:46:09.421
cmudsu00w01sr12er515hcjur	ZOTAC GAMING GeForce RTX 5070 Twin Edge 12GB GDDR7 Graphics Card	zotac-gaming-geforce-rtx-5070-twin-edge-12gb-gddr7-graphics-card	GPU-ZOTAC-GAMING-RTX-5070-TWIN-EDGE-12GB	\N	Video Memory: 12GB GDDR7, PCI Express 5.0 x16 • Engine Clock: 2512 MHz, CUDA Cores: 6144 • Memory Clock: 28 Gbps, Memory Bus: 192-bit • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	129900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstypz00lx12erbs68awur	Buy ZOTAC GAMING GeForce RTX 5070 Twin Edge 12GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	ZOTAC GAMING GeForce RTX 5070 Twin Edge 12GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, zotac, nvidia geforce, 12gb	f	t	2026-09-23 07:46:09.44	2026-09-23 07:46:09.44	2026-09-23 07:46:09.436
cmudsu01c01t612ermq8g3da7	PNY GeForce RTX 5070 Ti EPIC-X RGB Overclocked Triple Fan Plus 16GB GDDR7 Graphics Card	pny-geforce-rtx-5070-ti-epic-x-rgb-overclocked-triple-fan-plus-16gb-gddr7-graphics-card	GPU-PNY-RTX-5070-TI-EPIC-X-RGB-OVERCLOCK	\N	Video Memory: 16GB GDDR7, PCI Express 5.0 x8 • Graphics Clock: 2295 MHz, Boost Clock: 2640 MHz • CUDA Cores: 8960, Memory Clock: 28 Gbps • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI 2.1b	196500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs27000rnjjlpj0622kg	Buy PNY GeForce RTX 5070 Ti EPIC-X RGB Overclocked Triple Fan Plus 16GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	PNY GeForce RTX 5070 Ti EPIC-X RGB Overclocked Triple Fan Plus 16GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, pny, nvidia geforce, 16gb	f	t	2026-09-23 07:46:09.457	2026-09-23 07:46:09.457	2026-09-23 07:46:09.452
cmudsu01x01tk12eryqchua33	PNY GeForce RTX 5080 16GB GDDR7 ARGB EPIC-X RGB Overclocked Triple Fan Graphics Card	pny-geforce-rtx-5080-16gb-gddr7-argb-epic-x-rgb-overclocked-triple-fan-graphics-card	GPU-PNY-RTX-5080-16GB-GDDR7-ARGB-EPIC-X-	\N	Clock Speed: 2.30 GHz, Boost Speed: 2.62 GHz • Memory: 16GB GDDR7 • Memory Interface: 256-bit • Outputs: 3x DisplayPort 1.4a, 1x HDMI 2.1	250500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmr9bvs27000rnjjlpj0622kg	Buy PNY GeForce RTX 5080 16GB GDDR7 ARGB EPIC-X RGB Overclocked Triple Fan Graphics Card in Bangladesh | LogicBay BD	PNY GeForce RTX 5080 16GB GDDR7 ARGB EPIC-X RGB Overclocked Triple Fan Graphics Card. Check price and warranty at LogicBay BD.	graphics card, pny, nvidia geforce, 508016gb	f	t	2026-09-23 07:46:09.477	2026-09-23 07:46:09.477	2026-09-23 07:46:09.473
cmudsu02g01tz12er1kqdue92	ZOTAC GAMING GeForce RTX 5080 AMP Extreme INFINITY 16GB GDDR7 Graphics Card	zotac-gaming-geforce-rtx-5080-amp-extreme-infinity-16gb-gddr7-graphics-card	GPU-ZOTAC-GAMING-RTX-5080-AMP-EXTREME-IN	\N	Video Memory: 16GB GDDR7, PCI Express 5.0 x16 • Engine Clock: 2670 MHz, CUDA Cores: 10752 • Resolution Supports: Up to 4K 480Hz or 8K 165Hz with DSC • Display Outputs: 3 x DisplayPort 2.1b, 1 x HDMI	253900.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudstypz00lx12erbs68awur	Buy ZOTAC GAMING GeForce RTX 5080 AMP Extreme INFINITY 16GB GDDR7 Graphics Card in Bangladesh | LogicBay BD	ZOTAC GAMING GeForce RTX 5080 AMP Extreme INFINITY 16GB GDDR7 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, zotac, nvidia geforce, 16gb	f	t	2026-09-23 07:46:09.497	2026-09-23 07:46:09.497	2026-09-23 07:46:09.492
cmudstxxt003w12er4mhgwqvu	AFOX NVIDIA GeForce GT 240 1GB GDDR3 Graphics Card	afox-nvidia-geforce-gt-240-1gb-gddr3-graphics-card	GPU-NVIDIA-AFOX-GT-240-1GB-GDDR3	\N	Video Memory: 1024MB GDDR3 • Engine Clock: 550 MHz, Memory Clock: 1400 MHz • Resolution: 2560 x 1600 • Interface: 1 x DVI, 1 x HDMI, 1 x D-Sub	5000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudsty2t007d12erj1wdtwkj	Buy AFOX NVIDIA GeForce GT 240 1GB GDDR3 Graphics Card in Bangladesh | LogicBay BD	AFOX NVIDIA GeForce GT 240 1GB GDDR3 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, nvidia, nvidia geforce, 1gb	f	t	2026-09-23 07:46:06.737	2026-09-23 07:46:43.847	2026-09-23 07:46:06.731
cmudstxz5004d12erhocnn1kr	AFOX NVIDIA GeForce GT 610 2GB GDDR3 Graphics Card	afox-nvidia-geforce-gt-610-2gb-gddr3-graphics-card	GPU-NVIDIA-AFOX-GT-610-2GB-GDDR3	\N	Video Memory: 2048MB GDDR3 • Engine Clock: 810 MHz, Memory Clock: 1333 MHz • Resolution: 2560 x 1600 • Interface: 1 x DVI, 1 x HDMI, 1 x D-Sub	5500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudsty2t007d12erj1wdtwkj	Buy AFOX NVIDIA GeForce GT 610 2GB GDDR3 Graphics Card in Bangladesh | LogicBay BD	AFOX NVIDIA GeForce GT 610 2GB GDDR3 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, nvidia, nvidia geforce, 2gb	f	t	2026-09-23 07:46:06.785	2026-09-23 07:46:43.847	2026-09-23 07:46:06.781
cmudsty09005912er0r0xr2l1	AFOX NVIDIA GeForce GT 710 2GB GDDR3 Graphics Card	afox-nvidia-geforce-gt-710-2gb-gddr3-graphics-card	GPU-NVIDIA-AFOX-GT-710-2GB-GDDR3	\N	Video Memory: 2048MB GDDR3 • Base Clock: 954 MHz, Memory Clock: 1333 MHz • Resolution: 2048 x1536 • Interface: 1 x DVI, 1 x HDMI, 1 x D-Sub	6500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudsty2t007d12erj1wdtwkj	Buy AFOX NVIDIA GeForce GT 710 2GB GDDR3 Graphics Card in Bangladesh | LogicBay BD	AFOX NVIDIA GeForce GT 710 2GB GDDR3 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, nvidia, nvidia geforce, 2gb	f	t	2026-09-23 07:46:06.826	2026-09-23 07:46:43.847	2026-09-23 07:46:06.821
cmudsty1s006k12erzk1msmf5	AFOX NVIDIA GeForce GT 710 4GB GDDR3 Graphics Card	afox-nvidia-geforce-gt-710-4gb-gddr3-graphics-card	GPU-NVIDIA-AFOX-GT-710-4GB-GDDR3	\N	Video Memory: 4096MB GDDR3 • Base Clock: 954 MHz, Memory Clock: 1600MHz • Resolution: 2048 x1536 • Interface: 1 x DVI, 1 x HDMI, 1 x D-Sub	8500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudsty2t007d12erj1wdtwkj	Buy AFOX NVIDIA GeForce GT 710 4GB GDDR3 Graphics Card in Bangladesh | LogicBay BD	AFOX NVIDIA GeForce GT 710 4GB GDDR3 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, nvidia, nvidia geforce, 4gb	f	t	2026-09-23 07:46:06.881	2026-09-23 07:46:43.847	2026-09-23 07:46:06.876
cmudsty2v007g12erze7grqbk	AFOX Radeon R7 350 2GB GDDR5 Single Fan Graphics Card	afox-radeon-r7-350-2gb-gddr5-single-fan-graphics-card	GPU-AFOX-R7-350-2GB-GDDR5-SINGLE-FAN	\N	Video Memory: 2GB GDDR5 • Engine Clock: 800 MHz • Resolution: 2560 x 1600 • Port: 1 x DVI, 1 x VGA, 1 x HDMI	9700.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudsty2t007d12erj1wdtwkj	Buy AFOX Radeon R7 350 2GB GDDR5 Single Fan Graphics Card in Bangladesh | LogicBay BD	AFOX Radeon R7 350 2GB GDDR5 Single Fan Graphics Card. Check price and warranty at LogicBay BD.	graphics card, afox, amd radeon, 2gb	f	t	2026-09-23 07:46:06.92	2026-09-23 07:46:43.847	2026-09-23 07:46:06.915
cmudsty7c009h12eruf2x7bdd	AFOX NVIDIA GeForce GT 1030 2GB GDDR5 Graphics Card	afox-nvidia-geforce-gt-1030-2gb-gddr5-graphics-card	GPU-NVIDIA-AFOX-GT-1030-2GB-GDDR5	\N	Video Memory: 2048MB GDDR5 • Base Clock: 1228MHz , Boost Clock: 1468MHz • Resolution: 4K@60Hz, CUDA Cores: 384 • Interface: 1 x DVI, 1 x HDMI	14000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudsty2t007d12erj1wdtwkj	Buy AFOX NVIDIA GeForce GT 1030 2GB GDDR5 Graphics Card in Bangladesh | LogicBay BD	AFOX NVIDIA GeForce GT 1030 2GB GDDR5 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, nvidia, nvidia geforce, 2gb	f	t	2026-09-23 07:46:07.081	2026-09-23 07:46:43.847	2026-09-23 07:46:07.076
cmudsty8j00ac12er2ib55kvk	AFOX Radeon RX 550 4GB GDDR5 Dual Fan Graphics Card	afox-radeon-rx-550-4gb-gddr5-dual-fan-graphics-card	GPU-AFOX-RX-550-4GB-GDDR5-DUAL-FAN	\N	Video Memory: 4GB GDDR5 • Engine Clock: 1183 MHz • Resolution: 7680x4320 • DVI/ DisplayPort/ HDMI	14500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudsty2t007d12erj1wdtwkj	Buy AFOX Radeon RX 550 4GB GDDR5 Dual Fan Graphics Card in Bangladesh | LogicBay BD	AFOX Radeon RX 550 4GB GDDR5 Dual Fan Graphics Card. Check price and warranty at LogicBay BD.	graphics card, afox, amd radeon, 4gb	f	t	2026-09-23 07:46:07.124	2026-09-23 07:46:43.847	2026-09-23 07:46:07.119
cmudsty9700as12erpzo0bf8w	AFOX AMD Radeon RX 580 8GB GDDR5 Dual Fan Graphics Card	afox-amd-radeon-rx-580-8gb-gddr5-dual-fan-graphics-card	GPU-AFOX-RX-580-8GB-GDDR5-DUAL-FAN	\N	Video Memory: 8GB GDDR5 • Engine Clock: 1284 MHz • Resolution: 3840 x 2160(1.4 HDR) • Interface: DVI, DisplayPort, HDMI	19500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudsty2t007d12erj1wdtwkj	Buy AFOX AMD Radeon RX 580 8GB GDDR5 Dual Fan Graphics Card in Bangladesh | LogicBay BD	AFOX AMD Radeon RX 580 8GB GDDR5 Dual Fan Graphics Card. Check price and warranty at LogicBay BD.	graphics card, afox, amd radeon, 8gb	f	t	2026-09-23 07:46:07.147	2026-09-23 07:46:43.847	2026-09-23 07:46:07.143
cmudstyca00cd12erfwj2dch9	AFOX NVIDIA GeForce GTX 750 Ti 4GB GDDR5 Graphics Card	afox-nvidia-geforce-gtx-750-ti-4gb-gddr5-graphics-card	GPU-NVIDIA-AFOX-GTX-750-TI-4GB-GDDR5	\N	Video Memory: 4096MB GDDR5 • Base Clock: 1020 MHz, Memory Clock: 5400 MHz • Bus Standard: PCI Express 3.0 • Interface: 1 x DVI, 1 x HDMI, 1x DisplayPort	18000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudsty2t007d12erj1wdtwkj	Buy AFOX NVIDIA GeForce GTX 750 Ti 4GB GDDR5 Graphics Card in Bangladesh | LogicBay BD	AFOX NVIDIA GeForce GTX 750 Ti 4GB GDDR5 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, nvidia, nvidia geforce, 4gb	f	t	2026-09-23 07:46:07.258	2026-09-23 07:46:43.847	2026-09-23 07:46:07.254
cmudstyhf00f012erp6g3d73f	AFOX NVIDIA GeForce GTX 1050 Ti 4GB GDDR5 Graphics Card	afox-nvidia-geforce-gtx-1050-ti-4gb-gddr5-graphics-card	GPU-NVIDIA-AFOX-GTX-1050-TI-4GB-GDDR5	\N	Video Memory: 4096MB GDDR5, CUDA Core: 768 • Base Clock: 1291 MHz, Boost Clock: 1392 MHz • Memory Clock: 7Gbps, Bus Standard: PCI Express 3.0 • Interface: 1 x DVI, 1 x HDMI, 1x DisplayPort	24500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudsty2t007d12erj1wdtwkj	Buy AFOX NVIDIA GeForce GTX 1050 Ti 4GB GDDR5 Graphics Card in Bangladesh | LogicBay BD	AFOX NVIDIA GeForce GTX 1050 Ti 4GB GDDR5 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, nvidia, nvidia geforce, 4gb	f	t	2026-09-23 07:46:07.443	2026-09-23 07:46:43.847	2026-09-23 07:46:07.439
cmudstykz00hn12erff1aqxl5	AFOX Geforce GTX 1660Ti 6GB GDDR6 ATX Dual Fan Graphics Card	afox-geforce-gtx-1660ti-6gb-gddr6-atx-dual-fan-graphics-card	GPU-AFOX-GTX-1660TI-6GB-GDDR6-ATX-DUAL-F	\N	Video Memory: 6144MB GDDR6, CUDA Core: 1536 • Base Clock: 1500 MHz, Boost Clock: 1770 MHz • Memory Clock: 12Gbps, Bus Standard: PCI Express 3.0 • Interface: 1 x DVI, 1 x HDMI, 1x DisplayPort	33000.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudsty2t007d12erj1wdtwkj	Buy AFOX Geforce GTX 1660Ti 6GB GDDR6 ATX Dual Fan Graphics Card in Bangladesh | LogicBay BD	AFOX Geforce GTX 1660Ti 6GB GDDR6 ATX Dual Fan Graphics Card. Check price and warranty at LogicBay BD.	graphics card, afox, nvidia geforce, 6gb	f	t	2026-09-23 07:46:07.572	2026-09-23 07:46:43.847	2026-09-23 07:46:07.567
cmudstymw00jb12erik8n3liu	AFOX Geforce RTX 3050 8GB GDDR6 Dual Fan Graphics Card	afox-geforce-rtx-3050-8gb-gddr6-dual-fan-graphics-card	GPU-AFOX-RTX-3050-8GB-GDDR6-DUAL-FAN	\N	Video Memory: GDDR6 8GB, CUDA Core: 2560 • Base Clock: 1552 MHz, Boost Clock: 1777 MHz • Memory Clock: 14Gbps, Bus Standard: PCI Express 4.0 • Interface: 1 x DVI, 1 x HDMI, 1x DisplayPort	36500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3q001snjjl5bz9ep3j	cmudsty2t007d12erj1wdtwkj	Buy AFOX Geforce RTX 3050 8GB GDDR6 Dual Fan Graphics Card in Bangladesh | LogicBay BD	AFOX Geforce RTX 3050 8GB GDDR6 Dual Fan Graphics Card. Check price and warranty at LogicBay BD.	graphics card, afox, nvidia geforce, 68gb	f	t	2026-09-23 07:46:07.641	2026-09-23 07:46:43.847	2026-09-23 07:46:07.636
cmudsurnm003wx413ca0ytn3r	Abit Radeon RX 580 8GB GDDR5 Graphics Card	abit-radeon-rx-580-8gb-gddr5-graphics-card	GPU-ABIT-RX-580-8GB-GDDR5	\N	Video Memory: 8GB GDDR5 • Core Clock: 1244Mhz • Memory Clock: 1750Mhz • Interface: 2x DisplayPort, 1x HDMI	17500.00	\N	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudsuqkh00019a62e1q94zff	Buy Abit Radeon RX 580 8GB GDDR5 Graphics Card in Bangladesh | LogicBay BD	Abit Radeon RX 580 8GB GDDR5 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, abit, amd radeon, 8gb	f	t	2026-09-23 07:46:45.25	2026-09-23 07:46:45.25	2026-09-23 07:46:45.247
cmudsuron004cx413gqz9do3r	Abit Radeon RX 6500XT 4GB GDDR6 Graphics Card	abit-radeon-rx-6500xt-4gb-gddr6-graphics-card	GPU-ABIT-RX-6500XT-4GB-GDDR6	\N	Video Memory: 4GB GDDR6 • Stream Processor: 1024 • Interface Type: PCI-E 4.0 • Interface: 1x DisplayPort, 1x HDMI	19700.00	21000.00	\N	IN_STOCK	0	5	cmr9bvs3r001unjjlz6a3qh23	cmudsuqkh00019a62e1q94zff	Buy Abit Radeon RX 6500XT 4GB GDDR6 Graphics Card in Bangladesh | LogicBay BD	Abit Radeon RX 6500XT 4GB GDDR6 Graphics Card. Check price and warranty at LogicBay BD.	graphics card, abit, amd radeon, 4gb	f	t	2026-09-23 07:46:45.287	2026-09-23 07:46:45.287	2026-09-23 07:46:45.285
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
cmr9fdu2s000dznc862mxbzdr	cmr9bvs3p001qnjjlnzrmtdrs	Multi Display	multi_display	NUMBER	\N	f	f	7	2026-07-06 16:19:28.516	2026-09-23 07:46:45.141
cmr9fdu2x000jznc8fy1302of	cmr9bvs3p001qnjjlnzrmtdrs	Interface (PCI Express)	pci_express	SELECT	\N	f	f	11	2026-07-06 16:19:28.521	2026-09-23 07:46:45.145
cmr9fdu2z000lznc8a23p949m	cmr9bvs3p001qnjjlnzrmtdrs	DirectX	directx	SELECT	\N	f	f	12	2026-07-06 16:19:28.523	2026-09-23 07:46:45.145
cmr9fdu31000pznc8qjtoyzrk	cmr9bvs3p001qnjjlnzrmtdrs	Recommended Power	recommended_psu	TEXT	\N	f	f	15	2026-07-06 16:19:28.526	2026-09-23 07:46:45.149
cmr9fdu33000rznc8knkdzgst	cmr9bvs3p001qnjjlnzrmtdrs	DisplayPort Detail	display_port	TEXT	\N	f	f	19	2026-07-06 16:19:28.527	2026-09-23 07:46:45.153
cmr9fdu35000vznc86eleam5x	cmr9bvs3p001qnjjlnzrmtdrs	HDMI Detail	hdmi	TEXT	\N	f	f	20	2026-07-06 16:19:28.53	2026-09-23 07:46:45.154
cmr9fdu38000zznc8rwpfa7k5	cmr9bvs3p001qnjjlnzrmtdrs	Warranty	warranty	TEXT	\N	f	t	22	2026-07-06 16:19:28.532	2026-09-23 07:46:45.156
cmr9fdu2i0003znc8m0i2htvy	cmr9bvs3p001qnjjlnzrmtdrs	Bus Type	bus_type	TEXT	\N	f	f	2	2026-07-06 16:19:28.506	2026-09-23 07:46:45.135
cmr9fdu2q000bznc8nqnk6n3y	cmr9bvs3p001qnjjlnzrmtdrs	Max Resolution	resolution	TEXT	\N	t	t	7	2026-07-06 16:19:28.515	2026-09-23 07:46:45.14
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
cmtn513np000h13qz5byviy69	cmr9bvs3p001qnjjlnzrmtdrs	Chipset Series	chipset_series	SELECT	\N	t	t	9	2026-09-04 15:57:49.381	2026-09-23 07:46:45.143
cmr9fdu2v000hznc8hqkuplm8	cmr9bvs3p001qnjjlnzrmtdrs	CUDA Cores (Nvidia)	cuda_cores	NUMBER	\N	f	f	10	2026-07-06 16:19:28.52	2026-09-23 07:46:45.144
cmr9fdu30000nznc8r71v4upj	cmr9bvs3p001qnjjlnzrmtdrs	OpenGL	opengl	SELECT	\N	f	f	13	2026-07-06 16:19:28.524	2026-09-23 07:46:45.146
cmtn513nz000r13qznt10k65u	cmr9bvs3p001qnjjlnzrmtdrs	No. of Fans	cooling_type	SELECT	\N	t	f	14	2026-09-04 15:57:49.391	2026-09-23 07:46:45.147
cmr9fdu34000tznc8rgc4pj4c	cmr9bvs3p001qnjjlnzrmtdrs	Power Connector	power_connector	SELECT	\N	f	f	16	2026-07-06 16:19:28.528	2026-09-23 07:46:45.151
cmtn513o3000x13qzmvkta77z	cmr9bvs3p001qnjjlnzrmtdrs	Types Of Ports	port_types	TEXT	\N	t	f	17	2026-09-04 15:57:49.396	2026-09-23 07:46:45.152
cmtn513o5000z13qznagqa6eu	cmr9bvs3p001qnjjlnzrmtdrs	No. of Ports	port_count	SELECT	\N	t	f	18	2026-09-04 15:57:49.398	2026-09-23 07:46:45.152
cmr9fdu37000xznc84up87zd7	cmr9bvs3p001qnjjlnzrmtdrs	Dimension	dimension	TEXT	\N	f	f	21	2026-07-06 16:19:28.531	2026-09-23 07:46:45.155
cmr9fdu2m0007znc8kc698wgu	cmr9bvs3p001qnjjlnzrmtdrs	Memory Clock	memory_clock	TEXT	MHz	f	f	5	2026-07-06 16:19:28.511	2026-09-23 07:46:45.138
cmr9bvs9c003onjjl73rcf6jj	cmr9bvs3p001qnjjlnzrmtdrs	GPU Chipset	gpu_chipset	TEXT	\N	t	t	8	2026-07-06 14:41:27.505	2026-09-23 07:46:45.142
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
cmu1dxwee001ndx769xazw1f3	cmr9bvs3l001mnjjlqu2ps65y	L2 Cache	l2_cache	TEXT	\N	f	f	10	2026-09-14 15:16:03.015	2026-09-15 13:19:15.5
cmu1dxweo001zdx76bzhzqfdz	cmr9bvs3l001mnjjlqu2ps65y	PCIe Version	pcie_version	SELECT	\N	f	f	16	2026-09-14 15:16:03.024	2026-09-15 13:19:15.505
cmu1dxwep0021dx76dut3p69s	cmr9bvs3l001mnjjlqu2ps65y	Processor Features	processor_features	SELECT	\N	f	f	17	2026-09-14 15:16:03.026	2026-09-15 13:19:15.506
cmu1dxwer0023dx76kkptl016	cmr9bvs3l001mnjjlqu2ps65y	Unlocked for Overclocking	unlocked	BOOLEAN	\N	f	f	18	2026-09-14 15:16:03.027	2026-09-15 13:19:15.507
cmu1dxwes0025dx762mlo5bct	cmr9bvs3l001mnjjlqu2ps65y	Cooler Included	cooler_included	BOOLEAN	\N	f	f	19	2026-09-14 15:16:03.029	2026-09-15 13:19:15.509
cmr9bvs99003injjlawntuhv3	cmr9bvs3n001onjjl46q890qi	Total Cache (L3)	cache_size	SELECT	\N	f	f	9	2026-07-06 14:41:27.499	2026-09-15 13:19:15.522
cmu1dxwfb002rdx7664s337bd	cmr9bvs3n001onjjl46q890qi	L2 Cache	l2_cache	TEXT	\N	f	f	10	2026-09-14 15:16:03.048	2026-09-15 13:19:15.523
cmu1dxwfl0033dx762vno6blw	cmr9bvs3n001onjjl46q890qi	PCIe Version	pcie_version	SELECT	\N	f	f	16	2026-09-14 15:16:03.057	2026-09-15 13:19:15.53
cmu1dxwfn0035dx76k4xttha6	cmr9bvs3n001onjjl46q890qi	Processor Features	processor_features	SELECT	\N	f	f	17	2026-09-14 15:16:03.059	2026-09-15 13:19:15.531
cmu1dxwfp0037dx7615jcy1s4	cmr9bvs3n001onjjl46q890qi	Unlocked for Overclocking	unlocked	BOOLEAN	\N	f	f	18	2026-09-14 15:16:03.062	2026-09-15 13:19:15.532
cmu1dxwfr0039dx76nb1azc3d	cmr9bvs3n001onjjl46q890qi	Cooler Included	cooler_included	BOOLEAN	\N	f	f	19	2026-09-14 15:16:03.063	2026-09-15 13:19:15.532
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
cmu1dxwev0027dx76a3oheqbe	cmr9bvs3l001mnjjlqu2ps65y	Warranty	warranty	TEXT	\N	f	t	20	2026-09-14 15:16:03.031	2026-09-22 18:01:07.076
cmu1dxwfs003bdx76iddxs55y	cmr9bvs3n001onjjl46q890qi	Warranty	warranty	TEXT	\N	f	t	20	2026-09-14 15:16:03.065	2026-09-22 18:01:07.078
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
cmu1dxwdt0013dx76nkh7s9xd	cmr9bvs3i001knjjlqcd26aib	Warranty	warranty	TEXT	\N	f	t	20	2026-09-14 15:16:02.993	2026-09-22 18:01:07.073
cmudstm1v0007beo3cop8qvma	cmr9bvs3p001qnjjlnzrmtdrs	Engine Clock	engine_clock	TEXT	\N	f	t	4	2026-09-23 07:45:51.332	2026-09-23 07:46:45.137
cmudstm2d001bbeo3ads0c96h	cmr9bvs3q001snjjl5bz9ep3j	Memory Size	memory_size	SELECT	\N	t	t	1	2026-09-23 07:45:51.35	2026-09-23 07:46:45.156
cmudstm2e001dbeo3x5q3jhx4	cmr9bvs3q001snjjl5bz9ep3j	Bus Type	bus_type	TEXT	\N	f	f	2	2026-09-23 07:45:51.35	2026-09-23 07:46:45.157
cmudstm2f001fbeo3dv8f5emy	cmr9bvs3q001snjjl5bz9ep3j	Memory Type	memory_type	SELECT	\N	t	t	3	2026-09-23 07:45:51.351	2026-09-23 07:46:45.158
cmudstm2g001jbeo3hdbgmfpi	cmr9bvs3q001snjjl5bz9ep3j	Memory Clock	memory_clock	TEXT	\N	f	f	5	2026-09-23 07:45:51.353	2026-09-23 07:46:45.16
cmudstm2h001lbeo380gki5nq	cmr9bvs3q001snjjl5bz9ep3j	Memory Bus (Bit)	memory_bus	SELECT	\N	f	f	6	2026-09-23 07:45:51.354	2026-09-23 07:46:45.16
cmudstm2i001nbeo3mp35l8b8	cmr9bvs3q001snjjl5bz9ep3j	Max Resolution	resolution	TEXT	\N	t	t	7	2026-09-23 07:45:51.354	2026-09-23 07:46:45.161
cmudstm2j001pbeo3oofajlak	cmr9bvs3q001snjjl5bz9ep3j	Multi Display	multi_display	NUMBER	\N	f	f	7	2026-09-23 07:45:51.355	2026-09-23 07:46:45.162
cmudstm2j001rbeo3t212xzp3	cmr9bvs3q001snjjl5bz9ep3j	GPU Chipset	gpu_chipset	TEXT	\N	t	t	8	2026-09-23 07:45:51.356	2026-09-23 07:46:45.162
cmudstm2k001tbeo3xb2hvl5l	cmr9bvs3q001snjjl5bz9ep3j	Chipset Series	chipset_series	SELECT	\N	t	t	9	2026-09-23 07:45:51.356	2026-09-23 07:46:45.163
cmudstm2l001vbeo3kanczbvm	cmr9bvs3q001snjjl5bz9ep3j	CUDA Cores (Nvidia)	cuda_cores	NUMBER	\N	f	f	10	2026-09-23 07:45:51.357	2026-09-23 07:46:45.164
cmudstm2l001xbeo37q65yte9	cmr9bvs3q001snjjl5bz9ep3j	Interface (PCI Express)	pci_express	SELECT	\N	f	f	11	2026-09-23 07:45:51.358	2026-09-23 07:46:45.165
cmudstm2n001zbeo3ekercypv	cmr9bvs3q001snjjl5bz9ep3j	DirectX	directx	SELECT	\N	f	f	12	2026-09-23 07:45:51.359	2026-09-23 07:46:45.165
cmudstm2t0021beo3vgz4r6f8	cmr9bvs3q001snjjl5bz9ep3j	OpenGL	opengl	SELECT	\N	f	f	13	2026-09-23 07:45:51.365	2026-09-23 07:46:45.166
cmudstm2u0023beo3f9d3ykp8	cmr9bvs3q001snjjl5bz9ep3j	No. of Fans	cooling_type	SELECT	\N	t	f	14	2026-09-23 07:45:51.366	2026-09-23 07:46:45.167
cmudstm2x0025beo3d2754ti0	cmr9bvs3q001snjjl5bz9ep3j	Recommended Power	recommended_psu	TEXT	\N	f	f	15	2026-09-23 07:45:51.37	2026-09-23 07:46:45.167
cmudstm2y0027beo3w58sp46y	cmr9bvs3q001snjjl5bz9ep3j	Power Connector	power_connector	SELECT	\N	f	f	16	2026-09-23 07:45:51.371	2026-09-23 07:46:45.168
cmudstm2z0029beo3kz24pu2r	cmr9bvs3q001snjjl5bz9ep3j	Types Of Ports	port_types	TEXT	\N	t	f	17	2026-09-23 07:45:51.372	2026-09-23 07:46:45.169
cmudstm30002bbeo3ueuhgbhd	cmr9bvs3q001snjjl5bz9ep3j	No. of Ports	port_count	SELECT	\N	t	f	18	2026-09-23 07:45:51.373	2026-09-23 07:46:45.17
cmudstm31002dbeo3yufr8wb8	cmr9bvs3q001snjjl5bz9ep3j	DisplayPort Detail	display_port	TEXT	\N	f	f	19	2026-09-23 07:45:51.373	2026-09-23 07:46:45.17
cmudstm32002fbeo31h2xmcbo	cmr9bvs3q001snjjl5bz9ep3j	HDMI Detail	hdmi	TEXT	\N	f	f	20	2026-09-23 07:45:51.374	2026-09-23 07:46:45.171
cmudstm33002hbeo3kpv0pvql	cmr9bvs3q001snjjl5bz9ep3j	Dimension	dimension	TEXT	\N	f	f	21	2026-09-23 07:45:51.375	2026-09-23 07:46:45.172
cmudstm34002jbeo33np9liw5	cmr9bvs3q001snjjl5bz9ep3j	Warranty	warranty	TEXT	\N	f	t	22	2026-09-23 07:45:51.376	2026-09-23 07:46:45.172
cmudstm34002lbeo3xl0fg6dd	cmr9bvs3r001unjjlz6a3qh23	Memory Size	memory_size	SELECT	\N	t	t	1	2026-09-23 07:45:51.377	2026-09-23 07:46:45.173
cmudstm35002nbeo3s1jw5ex7	cmr9bvs3r001unjjlz6a3qh23	Bus Type	bus_type	TEXT	\N	f	f	2	2026-09-23 07:45:51.377	2026-09-23 07:46:45.174
cmudstm36002pbeo3k8re21zp	cmr9bvs3r001unjjlz6a3qh23	Memory Type	memory_type	SELECT	\N	t	t	3	2026-09-23 07:45:51.378	2026-09-23 07:46:45.174
cmudstm36002rbeo3girfb892	cmr9bvs3r001unjjlz6a3qh23	Engine Clock	engine_clock	TEXT	\N	f	t	4	2026-09-23 07:45:51.379	2026-09-23 07:46:45.175
cmudstm37002tbeo3rwfz92f9	cmr9bvs3r001unjjlz6a3qh23	Memory Clock	memory_clock	TEXT	\N	f	f	5	2026-09-23 07:45:51.38	2026-09-23 07:46:45.176
cmr9bvs9c003nnjjldprfoq71	cmr9bvs3p001qnjjlnzrmtdrs	Memory Type	memory_type	SELECT	\N	t	t	3	2026-07-06 14:41:27.505	2026-09-23 07:46:45.136
cmudstm3e003dbeo3pam94l4t	cmr9bvs3r001unjjlz6a3qh23	No. of Fans	cooling_type	SELECT	\N	t	f	14	2026-09-23 07:45:51.387	2026-09-23 07:46:45.183
cmudstm3f003fbeo3ds8raj7d	cmr9bvs3r001unjjlz6a3qh23	Recommended Power	recommended_psu	TEXT	\N	f	f	15	2026-09-23 07:45:51.388	2026-09-23 07:46:45.184
cmudstm3g003hbeo320ra52qv	cmr9bvs3r001unjjlz6a3qh23	Power Connector	power_connector	SELECT	\N	f	f	16	2026-09-23 07:45:51.388	2026-09-23 07:46:45.185
cmudstm3h003jbeo3wzjjjwu9	cmr9bvs3r001unjjlz6a3qh23	Types Of Ports	port_types	TEXT	\N	t	f	17	2026-09-23 07:45:51.389	2026-09-23 07:46:45.185
cmudstm3h003lbeo3ly984yyi	cmr9bvs3r001unjjlz6a3qh23	No. of Ports	port_count	SELECT	\N	t	f	18	2026-09-23 07:45:51.39	2026-09-23 07:46:45.186
cmudstm3i003nbeo3ne40votb	cmr9bvs3r001unjjlz6a3qh23	DisplayPort Detail	display_port	TEXT	\N	f	f	19	2026-09-23 07:45:51.391	2026-09-23 07:46:45.187
cmudstm3j003pbeo3k1hyyicp	cmr9bvs3r001unjjlz6a3qh23	HDMI Detail	hdmi	TEXT	\N	f	f	20	2026-09-23 07:45:51.391	2026-09-23 07:46:45.187
cmudstm3k003rbeo3oqm87osf	cmr9bvs3r001unjjlz6a3qh23	Dimension	dimension	TEXT	\N	f	f	21	2026-09-23 07:45:51.392	2026-09-23 07:46:45.188
cmudstm3k003tbeo3rlwq8xyg	cmr9bvs3r001unjjlz6a3qh23	Warranty	warranty	TEXT	\N	f	t	22	2026-09-23 07:45:51.393	2026-09-23 07:46:45.189
cmr9bvs9c003mnjjl66ggue09	cmr9bvs3p001qnjjlnzrmtdrs	Memory Size	memory_size	SELECT	GB	t	t	1	2026-07-06 14:41:27.505	2026-09-23 07:46:45.131
cmr9fdu2p0009znc81h27hava	cmr9bvs3p001qnjjlnzrmtdrs	Memory Bus (Bit)	memory_bus	SELECT	\N	f	f	6	2026-07-06 16:19:28.513	2026-09-23 07:46:45.139
cmudstm2g001hbeo3trkzbee8	cmr9bvs3q001snjjl5bz9ep3j	Engine Clock	engine_clock	TEXT	\N	f	t	4	2026-09-23 07:45:51.352	2026-09-23 07:46:45.159
cmudstm38002vbeo3xsle460w	cmr9bvs3r001unjjlz6a3qh23	Memory Bus (Bit)	memory_bus	SELECT	\N	f	f	6	2026-09-23 07:45:51.38	2026-09-23 07:46:45.177
cmudstm39002xbeo3wrm1av87	cmr9bvs3r001unjjlz6a3qh23	Max Resolution	resolution	TEXT	\N	t	t	7	2026-09-23 07:45:51.381	2026-09-23 07:46:45.178
cmudstm39002zbeo3v1zcb8b4	cmr9bvs3r001unjjlz6a3qh23	Multi Display	multi_display	NUMBER	\N	f	f	7	2026-09-23 07:45:51.382	2026-09-23 07:46:45.179
cmudstm3a0031beo31gy78y9t	cmr9bvs3r001unjjlz6a3qh23	GPU Chipset	gpu_chipset	TEXT	\N	t	t	8	2026-09-23 07:45:51.383	2026-09-23 07:46:45.179
cmudstm3b0033beo3pu4ethqx	cmr9bvs3r001unjjlz6a3qh23	Chipset Series	chipset_series	SELECT	\N	t	t	9	2026-09-23 07:45:51.383	2026-09-23 07:46:45.18
cmudstm3c0035beo3ilw16etx	cmr9bvs3r001unjjlz6a3qh23	CUDA Cores (Nvidia)	cuda_cores	NUMBER	\N	f	f	10	2026-09-23 07:45:51.384	2026-09-23 07:46:45.181
cmudstm3c0037beo3pwwyqlct	cmr9bvs3r001unjjlz6a3qh23	Interface (PCI Express)	pci_express	SELECT	\N	f	f	11	2026-09-23 07:45:51.385	2026-09-23 07:46:45.181
cmudstm3d0039beo3oie2ro6h	cmr9bvs3r001unjjlz6a3qh23	DirectX	directx	SELECT	\N	f	f	12	2026-09-23 07:45:51.385	2026-09-23 07:46:45.182
cmudstm3e003bbeo3tbpxc7i8	cmr9bvs3r001unjjlz6a3qh23	OpenGL	opengl	SELECT	\N	f	f	13	2026-09-23 07:45:51.386	2026-09-23 07:46:45.183
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
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


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
-- Name: order_items_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "order_items_orderId_idx" ON public.order_items USING btree ("orderId");


--
-- Name: order_items_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "order_items_productId_idx" ON public.order_items USING btree ("productId");


--
-- Name: orders_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "orders_createdAt_idx" ON public.orders USING btree ("createdAt");


--
-- Name: orders_mobile_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX orders_mobile_idx ON public.orders USING btree (mobile);


--
-- Name: orders_orderNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "orders_orderNumber_key" ON public.orders USING btree ("orderNumber");


--
-- Name: orders_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX orders_status_idx ON public.orders USING btree (status);


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
-- Name: order_items order_items_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


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

\unrestrict q17cAbu4biJf5W14xR9ytPjYvQlDm1YUKHvHSzZek4jCscO8TbUJDcuHSDXEx9Y

