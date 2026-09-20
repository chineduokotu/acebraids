const units = (value) => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;

export const getLowStockThreshold = (product, variant) => units(variant?.lowStockThreshold ?? product?.lowStockThreshold ?? 5);

export const getVariantLabel = (variant = {}) => [...new Set([
  variant.label, variant.color, variant.length, variant.capSize,
].filter(Boolean))].join(' / ');

// IDs take precedence so two styles with the same colour/length never share stock.
export const resolveVariant = (product, selection = {}) => {
  const variants = product?.variants || [];
  if (!variants.length) return null;
  const id = selection?._id || selection?.variantId;
  if (id) return variants.find((variant) => String(variant._id) === String(id));
  if (selection?.sku) {
    const matches = variants.filter((variant) => variant.sku === selection.sku);
    return matches.length === 1 ? matches[0] : undefined;
  }
  const fields = ['label', 'color', 'length', 'capSize'].filter((field) => selection?.[field]);
  const matches = variants.filter((variant) => fields.every((field) => variant[field] === selection[field]));
  return matches.length === 1 ? matches[0] : undefined;
};

export const getInitialVariant = (product) => product?.variants?.find((variant) => units(variant.stock) > 0)
  || product?.variants?.[0] || null;

export const getAvailableStock = (product, selection) => {
  if (!product || product.isSoldOut) return 0;
  if (product.variants?.length) return units(resolveVariant(product, selection)?.stock);
  return units(product.stock);
};

export const getTotalStock = (product) => {
  if (!product || product.isSoldOut) return 0;
  return product.variants?.length
    ? product.variants.reduce((total, variant) => total + units(variant.stock), 0)
    : units(product.stock);
};

export const getVariantKey = (product, variant) => JSON.stringify([
  String(product._id),
  !product.variants?.length ? 'base' : variant?._id || variant?.sku || getVariantLabel(variant),
]);

const matchesSelection = (item, product, variant) => {
  if (String(item.product) !== String(product._id)) return false;
  if (!product.variants?.length) return true;
  const storedVariant = resolveVariant(product, { ...item.variant, _id: item.variantId || item.variant?._id });
  return Boolean(storedVariant && getVariantKey(product, storedVariant) === getVariantKey(product, variant));
};

export const getRemainingStock = (cart, product, selection) => {
  if (!product) return 0;
  const variant = resolveVariant(product, selection);
  const inCart = cart.reduce((total, item) => total + (matchesSelection(item, product, variant) ? units(item.qty) : 0), 0);
  return Math.max(0, getAvailableStock(product, selection) - inCart);
};

const stockMessage = (name, stock) => stock === 0
  ? `"${name}" is currently out of stock.`
  : `Only ${stock} units of "${name}" are currently available, including those already in your bag.`;

export const addCartItem = (cart, product, selection, qty = 1) => {
  if (!Number.isSafeInteger(qty) || qty <= 0) return { cart, added: false, message: 'Please choose a whole quantity of at least 1.' };
  const variant = resolveVariant(product, selection);
  if (product.variants?.length && !variant) return { cart, added: false, message: 'Please select an available product option.' };
  const stock = getAvailableStock(product, variant);
  const matching = cart.filter((item) => matchesSelection(item, product, variant));
  const currentQty = matching.reduce((total, item) => total + units(item.qty), 0);
  const refreshed = cart.map((item) => matchesSelection(item, product, variant) ? { ...item, stock } : item);
  if (currentQty + qty > stock) return { cart: refreshed, added: false, message: stockMessage(product.name, stock) };

  const item = {
    variantKey: getVariantKey(product, variant),
    product: product._id,
    variantId: variant?._id,
    name: product.name,
    slug: product.slug,
    image: product.images?.[0]?.url || '/uploads/IMG_4065.PNG',
    price: variant?.priceOverride ?? product.discountPrice ?? product.price,
    regularPrice: product.price,
    variant: variant ? {
      _id: variant._id, label: variant.label || '', color: variant.color || '',
      length: variant.length || '', capSize: variant.capSize || '', sku: variant.sku || '',
    } : {},
    stock,
    lowStockThreshold: getLowStockThreshold(product, variant),
    qty: currentQty + qty,
  };
  return {
    cart: [...cart.filter((entry) => !matchesSelection(entry, product, variant)), item],
    added: true,
    message: `Added "${product.name}" to your bag!`,
  };
};

export const updateCartQuantity = (cart, variantKey, qty) => {
  if (!Number.isSafeInteger(qty)) return { cart, message: 'Please choose a whole quantity.' };
  if (qty <= 0) return { cart: cart.filter((item) => item.variantKey !== variantKey) };
  const item = cart.find((entry) => entry.variantKey === variantKey);
  if (!item) return { cart };
  // Older saved bags need a stock refresh before their quantity can increase.
  const stock = item.stock == null ? item.qty : units(item.stock);
  if (qty > stock && qty > item.qty) return { cart, message: stockMessage(item.name, stock) };
  return { cart: cart.map((entry) => entry.variantKey === variantKey ? { ...entry, qty } : entry) };
};

export const refreshCartStock = (cart, product) => cart.map((item) => {
  if (String(item.product) !== String(product._id)) return item;
  const variant = resolveVariant(product, { ...item.variant, _id: item.variantId || item.variant?._id });
  return { ...item, stock: getAvailableStock(product, { ...item.variant, _id: item.variantId || item.variant?._id }), lowStockThreshold: getLowStockThreshold(product, variant) };
});

export const getCheckoutError = (error, fallback) => error?.response?.data?.message || error?.message || fallback;
