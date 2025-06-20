import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../stores/useProductStore";

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts(); // Fetch all products for admin dashboard
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders/admin");
        setOrders(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    };

    fetchOrders();
  }, [fetchAllProducts]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <AnalyticsTab />
      <div className="my-8">
        <CreateProductForm />
        <ProductsList />
      </div>
      <div className="space-y-4 mt-8">
        {orders.length === 0 ? (
          <div className="text-gray-400">No orders found.</div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="p-4 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-bold mb-2">Order ID: {order._id}</h2>
              <p>User ID: {order.user._id}</p>
              <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
              <p>Status: {order.status}</p>
              <h3 className="text-lg font-bold mt-4">Products:</h3>
              <ul className="list-disc list-inside">
                {order.products.map((item) => (
                  <li key={item.product._id}>
                    {item.product.name} - Quantity: {item.quantity}
                  </li>
                ))}
              </ul>
              <h3 className="text-lg font-bold mt-4">Address:</h3>
              <p>Name: {order.address.name}</p>
              <p>Email: {order.address.email}</p>
              <p>Address: {order.address.address}</p>
              <p>Province: {order.address.province}</p>
              <p>City: {order.address.city}</p>
              <p>Phone: {order.address.phone}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPage;