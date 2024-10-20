import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeProduct, addProduct, Product } from '../features/products/productsSlice';
import AddProductModal from './AddProductModal'; 
import styles from './ProductList.module.css';
import { Link } from 'react-router-dom';

const ProductList: React.FC = () => {
  const products = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();
  const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);
  const [productIdToRemove, setProductIdToRemove] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState('name');
  const [isAddModalOpen, setAddModalOpen] = useState(false); 
  useEffect(() => {
    if (products.length === 0) { 
      fetch('http://localhost:3001/products')
        .then(response => response.json())
        .then(data => {
          data.forEach((product: Product) => {
            dispatch(addProduct({ ...product, id: Number(product.id) }));
          });
        });
    }
  }, [dispatch, products.length]);

  const handleRemoveClick = (id: number) => {
    setProductIdToRemove(id);
    setRemoveModalOpen(true);
  };

  const confirmRemoveProduct = () => {
    if (productIdToRemove !== null) {
      dispatch(removeProduct(productIdToRemove));
      setRemoveModalOpen(false);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'count') {
      return a.count - b.count;
    }
    return 0;
  });

  return (
    <div className={styles.mainList}>
      <h1>Product List</h1>
      <button className={styles.mainAddProductButton} onClick={() => setAddModalOpen(true)}>Add Product</button>
      <div className={styles.sortContainer}>
        <label htmlFor="sortSelect">Sort by:</label>
        <select id="sortSelect" className={styles.sortSelect} onChange={(e) => setSortOption(e.target.value)}>
          <option value="name">Name</option>
          <option value="count">Count</option>
        </select>
      </div> 
      <ul className={styles.productList}>
        {sortedProducts.map(product => (
          <li key={product.id} className={styles.productItem}>
            <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
            <div className={styles.productInfo}>
              <Link to={`/product/${product.id}`}>
                <p>Name: {product.name}</p>
              </Link>
              <p className={styles.countText}>Count: {product.count}</p>
              <button className={styles.deleteButton} onClick={() => handleRemoveClick(product.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {isRemoveModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>Are you sure you want to delete this product?</p>
            <div>
              <button className={styles.modalDeleteButton} onClick={confirmRemoveProduct}>Yes</button>
              <button className={styles.modalDeleteButton} onClick={() => setRemoveModalOpen(false)}>No</button>
            </div>
          </div>
        </div>
      )}
      <AddProductModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
};

export default ProductList;
