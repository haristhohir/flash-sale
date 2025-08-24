import { Link } from "react-router-dom";
import Countdown from "./Countdown";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ product }: { product: any }) {
  const { token } = useAuth();
  const targetDate = new Date(product.flashSaleStartedAt);
  const targetEndDate = new Date(product.flashSaleEndedAt);
  const [timeLeft, setTimeLeft] = useState<number>(targetDate.getTime() - new Date().getTime());
  const [timeLeftToEnd, setTimeLeftToEnd] = useState<number>(targetEndDate.getTime() - new Date().getTime());
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate.getTime() - new Date().getTime());
      setTimeLeftToEnd(targetEndDate.getTime() - new Date().getTime());


      if (timeLeft <= 0 && timeLeftToEnd > 0) {
        if (!isEnabled) setIsEnabled(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  async function buyNow(e: React.MouseEvent) {
    if (!isEnabled) {
      e.preventDefault();
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/product/purchase", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: product.id }),
      });

      if (!res.ok) throw new Error("Failed to Purchase");

    } catch (err: any) {
      alert(err.message || "Something went wrong");
    }
  }
  return (
    <div className="border rounded-xl shadow hover:shadow-lg p-4 flex flex-col sm:w-full md:w-[50%] lg:w-[400px] relative">
      <div className="absolute top-2 right-4">
        {timeLeftToEnd > 0 ? <Countdown targetDateString={product.flashSaleStartedAt} /> : <p className="text-red-500 text-lg font-bold"> Flash Sale Ended</p>}
      </div >
      <img src={product.image} alt={product.name} className="w-full h-40 object-contain rounded-lg mb-4" />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600 line-through">${product.price}</p>
      <p className="text-red-600 font-bold text-xl">${product.salePrice}</p>
      <p className="text-gray-800 mb-4">{product.description}</p>
      <Link
        to={`/status/${product.flashSaleId}`}
        className={`mt-auto bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-center transition ${!isEnabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        onClick={buyNow}
      >
        Buy Now
      </Link>
    </div >
  );
}
