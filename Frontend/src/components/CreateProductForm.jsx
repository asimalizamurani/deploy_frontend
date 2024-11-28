import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader, PlusCircle, Upload } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';

const categories = ['jeans', 't-shirt', 'shoe', 'glasses', 'jacket', 'suit', 'bag'];
const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });

  const {createProduct, loading} = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
    } catch (error) {
      console.log("Error creating product");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      }

      reader.readAsDataURL(file);
    }
  }

  return (
    <motion.div
      className="create-product bg-gray-800 shadow-lg rounded-lg p-8 mb-8 pb-52 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ maxHeight: '80vh', overflowY: 'scroll' }} // Enable scrolling within a limited height
    >


      <h2 className="text-2xl font-semibold mb-6 text-emerald-400">Create New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={4}
            style={{ resize: 'none' }} // Disable resizing
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-300">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-300">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="">
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="image" 
          className="block text-sm font-medium text-gray-300">
            <Upload className='h-5 w-5 inline-block mr-2' />
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded</span>}
        </div>

        <button
          type="submit"
          className="flex justify-center items-center mt-4 w-full bg-emerald-500 text-white font-medium py-2 px-4 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          disabled={loading}
        >
          {loading ? (
            <>
            <Loader className='mr-2 animate-spin h-5 w-5' aria-hidden='true' />
            Loading...
            </>
          ) : (
            <>
            <PlusCircle className='mr-2 h-5 w-5' />
            Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
