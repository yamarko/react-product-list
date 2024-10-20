import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct, Product } from '../features/products/productsSlice';
import styles from './AddProductModal.module.css';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const initialProductState = {
    imageUrl: '',
    name: '',
    count: 0,
    size: { width: 0, height: 0 },
    weight: '',
  };
  const [product, setProduct] = useState<Omit<Product, 'id' | 'comments'>>(initialProductState);

  useEffect(() => {
    if (isOpen) {
      setProduct(initialProductState);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (product.name) {
      dispatch(addProduct({ ...product, id: Date.now(), comments: [] }));
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Add Product</h2>
        <div className={styles.inputContainer}> 
          <label htmlFor="name">Name:</label>
          <input name="name" placeholder="Name" onChange={handleChange} value={product.name} />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="imageUrl">Image URL:</label>
          <input name="imageUrl" placeholder="Image URL" onChange={handleChange} value={product.imageUrl} />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="count">Count:</label>
          <input name="count" type="number" min="0" placeholder="Count" onChange={handleChange} value={product.count} />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="weight">Weight:</label>
          <input name="weight" placeholder="Weight" onChange={handleChange} value={product.weight} />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="width">Width:</label>
          <input name="width" type="number" min="0" placeholder="Width" onChange={handleChange} value={product.size.width} />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="height">Height:</label>
          <input name="height" type="number" min="0" placeholder="Height" onChange={handleChange} value={product.size.height} />
        </div>
        <div>
        <button className={styles.addPruductButton} onClick={handleSubmit}>Add</button>
        <button className={styles.addPruductButton} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
