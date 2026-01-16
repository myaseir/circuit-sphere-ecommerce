


const JsonLd = ({ product }: { product: any }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: Array.isArray(product.image_url) ? product.image_url : [product.image_url],
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Circuit Sphere",
    },
    offers: {
      "@type": "Offer",
      url: `https://circuitsphere.pk/shop/${product.id}`, // Change to your real domain
      priceCurrency: "PKR",
      price: product.price, // Make sure this is the final number (no "PKR" string)
      availability: product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default JsonLd;