import { searchProducts, listCategories, getProduct } from '../src/lib/ai/catalogTools';

async function main() {
  const search = await searchProducts({ query: 'Ryzen', limit: 3 });
  console.log('search', {
    total: search.total,
    names: search.products.map((p) => p.name),
  });

  const categories = await listCategories();
  console.log('categories', categories.length);

  if (search.products[0]) {
    const detail = await getProduct({ slug: search.products[0].slug });
    console.log('detail', detail);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
