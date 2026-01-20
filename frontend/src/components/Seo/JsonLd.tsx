import React from "react";

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
      name: "Glacia Labs",
    },
    offers: {
      "@type": "Offer",
      url: `https://www.glacialabs.com/shop/${product.id}`,
      priceCurrency: "PKR",
      price: product.price,
      priceValidUntil: "2026-12-31",
      availability: product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": 0, // Free Shipping
          "currency": "PKR"
        },
        // ✅ NEW: Restrict shipping region to Pakistan only
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
    ...(product.average_rating > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.average_rating,
        reviewCount: product.total_reviews || 1,
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