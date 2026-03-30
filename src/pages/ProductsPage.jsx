import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCartStore } from '../store/useCartStore'; 
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    // Gọi API lấy sản phẩm (Thành viên 02 cung cấp)
    axios.get('http://localhost:8000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8 grid grid-cols-4 gap-4 bg-zinc-950 text-white">
      {products.map(product => (
        <div key={product.id} className="border border-zinc-800 p-4 rounded-xl">
          <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-contain" />
          <h3 className="mt-2 font-bold">{product.name}</h3>
          <p className="text-blue-400">{Number(product.price).toLocaleString()}đ</p>
          
          <button 
            onClick={() => {
                addToCart(product);
                alert("Đã thêm vào giỏ hàng!");
            }}
            className="w-full mt-4 bg-blue-600 py-2 rounded-lg"
          >
            Thêm vào giỏ
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductsPage;