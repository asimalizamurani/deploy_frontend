import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, Home, MapPin, Globe, Loader, ArrowRight } from "lucide-react";
import axios from "../lib/axios.js";

const OrderFormPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    province: "",
    city: "",
    phone: "",                  
  });
  const { cart, total } = useCartStore();
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const products = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      }));
      const res = await axios.post("/orders/create", {
        products,
        address: formData,
        totalAmount: total,
      });
      toast.success(res.data.message);
       // Clear local cart state immediately
      useCartStore.getState().clearCart();

      // Redirect to Stripe checkout
      window.location.href = res.data.sessionUrl;
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 h-screen overflow-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Enter Your Details
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md
                  shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Asim Ali"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md
                  shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="example@gmail.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300">
                Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Home className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md
                  shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="123 Main St"
                />
              </div>
            </div>
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-300">
                Province
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="province"
                  name="province"
                  type="text"
                  required
                  value={formData.province}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md
                  shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Province"
                />
              </div>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-300">
                City
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md
                  shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="City"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                Phone
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md
                  shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="123-456-7890"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent
              rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700
              focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-emerald-500 transition duration-150 ease-in-out
              disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                  Loading...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-5 w-5" aria-hidden="true" />
                  Submit
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderFormPage;