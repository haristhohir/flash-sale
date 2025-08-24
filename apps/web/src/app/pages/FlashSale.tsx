
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

type Product = {
  id: number;
  name: string;
  price: number;
  salePrice: number;
  image: string;
  flashSaleEndedAt: string;
};

export default function FlashSale() {
  const { token } = useAuth(); // get token from context
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        setError("You must be logged in to view flash sale products.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/product/flash-sale", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const { data } = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Flash Sale</h2>
      </div>
      <div className="flex align-middle justify-center">
        {
          product ? <ProductCard key={product.id} product={product} /> : null
        }
      </div>
    </div>
  );
}


