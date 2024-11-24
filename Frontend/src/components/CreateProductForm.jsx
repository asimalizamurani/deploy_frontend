import {useState} from 'react'
import { motion } from 'framer-motion'
import { PlusCircle, Upload, Loader } from 'lucide-react'

const categories = ["jeans", "t-shirt", "shoe", "glasses", "jacket", "suit", "bag"];


const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const handleSubmit = (e) => {
    
  }

  return (
    <motion.div
    className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    >

      <h2 className='text-2xl font-semibold mb-6 text-emerald-400'>Create New Product</h2>

      <form onSubmit={handleSubmit}></form>

    </motion.div>
  )
}

export default CreateProductForm