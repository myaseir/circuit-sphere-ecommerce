import React from "react";

const JsonLd = ({ product }: { product: any }) => {
  // 1. Safe Image Handling (Google hates missing images)
  const images = product.image_url 
    ? (Array.isArray(product.image_url) ? product.image_url : [product.image_url])
    : ["https://glacialabs.com/images/logo/logo.png"]; // Fallback to logo

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images,
    description: product.description,
    sku: String(product.id),
    mpn: String(product.id), // ✅ Google recommends MPN (Manufacturer Part Number)
    brand: {
      "@type": "Brand",
      name: "Glacia Labs",
    },
    offers: {
      "@type": "Offer",
      url: `https://glacialabs.com/shop/${product.id}`,
      priceCurrency: "PKR",
      price: product.price,
      priceValidUntil: "2027-12-31", // Extended the valid date
      availability: product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": 0, // 0 means Free Shipping
          "currency": "PKR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "PK" 
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 1,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 4,
            "unitCode": "DAY"
          }
        }
      }
    },
    // ✅ RATINGS LOGIC: Ensures formatting is safe (e.g. "4.5")
    ...(product.average_rating && Number(product.average_rating) > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Number(product.average_rating).toFixed(1),
        reviewCount: Number(product.total_reviews) || 1, // Fallback to 1 if count is missing but rating exists
        bestRating: "5",
        worstRating: "1"
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default JsonLd;