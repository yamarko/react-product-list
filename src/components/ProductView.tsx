import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Product, updateProduct } from '../features/products/productsSlice';
import styles from './ProductView.module.css';

const ProductView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = useSelector((state: RootState) => state.products.find(p => p.id === Number(id)));
  const dispatch = useDispatch();

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(product || null);
  const [newComment, setNewComment] = useState('');

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedProduct) {
      const { name, value } = e.target;
      setEditedProduct({ ...editedProduct, [name]: value });
    }
  };

  const handleEditSubmit = () => {
    if (editedProduct) {
      dispatch(updateProduct(editedProduct));
      setEditModalOpen(false);
    }
  };

  const handleAddComment = () => {
    if (product && newComment) {
      const updatedProduct = {
        ...product,
        comments: [...product.comments, newComment],
      };
      dispatch(updateProduct(updatedProduct));
      setNewComment('');
    }
  };

  const handleDeleteComment = (comment: string) => {
    if (product) {
      const updatedProduct = {
        ...product,
        comments: product.comments.filter(c => c !== comment),
      };
      dispatch(updateProduct(updatedProduct));
    }
  };

  return (
    <div className={styles.mainView}>
      <h1>Product Details</h1>
      
      {product && (
        <div className={styles.productDetails}>
          <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
          <p><strong>Name:</strong> {product.name}</p>
          <p><strong>Count:</strong> {product.count}</p>
          <p><strong>Weight:</strong> {product.weight}</p>
          <p><strong>Size:</strong> {product.size.width} x {product.size.height}</p>
        </div>
      )}

      <button className={styles.editProductButton} onClick={() => setEditModalOpen(true)}>Edit</button>

      {isEditModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Edit Product</h2>
            <input name="name" value={editedProduct?.name} onChange={handleEditChange} />
            <input name="imageUrl" value={editedProduct?.imageUrl} onChange={handleEditChange} />
            <input name="count" type="number" value={editedProduct?.count} onChange={handleEditChange} />
            <input name="weight" value={editedProduct?.weight} onChange={handleEditChange} />
            <input name="width" type="number" value={editedProduct?.size.width} onChange={handleEditChange} />
            <input name="height" type="number" value={editedProduct?.size.height} onChange={handleEditChange} />
            <button className={styles.modalEditProductButton} onClick={handleEditSubmit}>Save</button>
            <button className={styles.modalEditProductButton} onClick={() => setEditModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div>
        <h3>Comments</h3>
        <ul>
          {product?.comments.map((comment, index) => (
            <li key={index}>
              {comment}
              <div> 
              <button className={styles.deleteCommentButton} onClick={() => handleDeleteComment(comment)}>Delete</button>
              </div>
              
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
};

export default ProductView;
