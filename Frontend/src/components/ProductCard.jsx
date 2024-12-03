import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  console.log(product.name);

  const handleAddToCart = () => {
    if(!user) {
      toast.error("Please login to add products to your cart", { id: "login" });
      return
    } else {
      console.log(product.name, "added to the cart");
    }
  };

  return (
    <div className="flex flex-col relative overflow-hidden rounded-lg border border-gray-700 shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full transition-transform duration-300 transform hover:scale-110"
          src={product.image}
          alt="product image"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-300 hover:bg-opacity-50" />
      </div>

      <div className="mt-4 px-5 pb-5">
        <h5 className="text-2xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors duration-300">
          {product.name}
        </h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-emerald-400">${product.price}</span>
          </p>
        </div>
        <button
          className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={22} className="mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
