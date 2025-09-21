import React from 'react';
import Image from 'next/image';
import './ProductModal.css';

const ProductModal = ({ product, onClose }) => {
  if (!product) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-body">
          <div className="modal-image-container">
            <Image src={product.image} alt={product.name} width={400} height={500} className="modal-image" />
          </div>
          <div className="modal-details">
            <h2>{product.name}</h2>
            <p className="modal-description">{product.description}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Type:</strong> {product.type}</p>
            {product.occasion && <p><strong>Occasion:</strong> {product.occasion}</p>}
            <button className="rent-button">Rent Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
