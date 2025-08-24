import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

type Purchase = {
  id: number;
  name: string;
  productId: number;
  userId: number;
  flashSaleId: number;
  price: number;
  quantity: number;
  createdAt: string;
};

export default function PurchaseStatus() {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const res = await fetch(`http://localhost:3000/product/purchase/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data, error } = await res.json();
        if (!res.ok) {
          throw new Error(error.message || "Failed to fetch purchase status");
        }

        setPurchase(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading purchase status...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">❌ {error}</p>;
  }

  if (!purchase) {
    return <p className="text-center text-gray-500">No purchase found.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">✅ Purchase Successful</h1>
      <div className="space-y-2">
        <p><span className="font-semibold">Product ID:</span> {purchase.flashSaleId}</p>
        <p><span className="font-semibold">Name:</span> {purchase.name}</p>
        <p><span className="font-semibold">Quantity:</span> {purchase.quantity}</p>
        <p><span className="font-semibold">Total Price:</span> ${purchase.price}</p>
        <p><span className="font-semibold">Purchased At:</span> {new Date(purchase.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
