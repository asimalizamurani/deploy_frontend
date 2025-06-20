import { useState } from "react";
import { motion } from "framer-motion";
import { Trash, Star, Edit, Save, X } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
  const { products, deleteProduct, toggleFeaturedProduct, updateProduct } = useProductStore();
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (product) => {
    setEditId(product._id);
    setEditData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    await updateProduct(id, editData);
    setEditId(null);
    setEditData({});
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Featured</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {products?.map((product) => (
            <tr key={product._id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt={product.name} />
                  </div>
                  <div className="ml-4">
                    {editId === product._id ? (
                      <input
                        className="text-sm font-medium text-white bg-gray-700 rounded px-2 py-1"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                      />
                    ) : (
                      <div className="text-sm font-medium text-white">{product.name}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editId === product._id ? (
                  <input
                    className="text-sm text-gray-300 bg-gray-700 rounded px-2 py-1"
                    name="price"
                    type="number"
                    value={editData.price}
                    onChange={handleEditChange}
                  />
                ) : (
                  <div className="text-sm text-gray-300">${product.price}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editId === product._id ? (
                  <input
                    className="text-sm text-gray-300 bg-gray-700 rounded px-2 py-1"
                    name="category"
                    value={editData.category}
                    onChange={handleEditChange}
                  />
                ) : (
                  <div className="text-sm text-gray-300">{product.category}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => toggleFeaturedProduct(product._id)}
                  className={`p-1 rounded-full ${product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"} hover:bg-yellow-500 transition-colors duration-200`}
                >
                  <Star className="h-5 w-5" />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                {editId === product._id ? (
                  <>
                    <button onClick={() => saveEdit(product._id)} className="text-green-500 hover:text-green-400"><Save className="w-5 h-5" /></button>
                    <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-300"><X className="w-5 h-5" /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(product)} className="text-blue-500 hover:text-blue-400"><Edit className="w-5 h-5" /></button>
                    <button onClick={() => deleteProduct(product._id)} className="text-red-500 hover:text-red-400"><Trash className="w-5 h-5" /></button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductsList;