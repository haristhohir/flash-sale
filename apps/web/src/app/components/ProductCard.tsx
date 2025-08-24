import { Link } from "react-router-dom";
import Countdown from "./Countdown";
import { useEffect, useState } from "react";

export default function ProductCard({ product }: { product: any }) {
  const targetDate = new Date(product.flashSaleEndedAt);
  const [timeLeft, setTimeLeft] = useState<number>(targetDate.getTime() - new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate.getTime() - new Date().getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  function buyNow(e: React.MouseEvent) {
    if (timeLeft > 0) {
      e.preventDefault();
    }

  }

  return (
    <div className="border rounded-xl shadow hover:shadow-lg p-4 flex flex-col sm:w-full md:w-[50%] lg:w-[400px] relative">
      <div className="absolute top-2 right-4">
        <Countdown targetDateString={product.flashSaleEndedAt} />
      </div>
      <img src={product.image} alt={product.name} className="w-full h-40 object-contain rounded-lg mb-4" />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600 line-through">${product.price}</p>
      <p className="text-red-600 font-bold text-xl">${product.salePrice}</p>
      <p className="text-gray-800 mb-4">{product.description}</p>
      <Link
        to="/status"
        className={`mt-auto bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-center transition ${timeLeft > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        onClick={buyNow}
      >
        Buy Now
      </Link>
    </div >
  );
}
