import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem.jsx";
import { useProductStore } from "../stores/useProductStore.js";
import FeaturedProducts from "../components/FeaturedProducts.jsx";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bag.jpg" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jacket.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/sunglasses.jpg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirt.jpg" },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);
  return (
    <div className="relative h-screen text-white overflow-y-auto overflow-x-hidden mx-auto px-4 sm:px-6 lg:px-8 py-16 scrollbar-hide">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/shoes.jpg')" }}></div>
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 mb-4">
          Explore Our Categories
        </h1>
        {/* <p className="text-xl text-gray-800 mb-12">
          Discover the latest trends
        </p> */}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <CategoryItem
              category={category}
              key={category.name}
              className="transform transition-transform duration-300 hover:scale-105"
            />
          ))} 
        </div>

        {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
      </div>
    </div>
  );
};

export default HomePage