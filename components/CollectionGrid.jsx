import React from 'react';
import Image from 'next/image';
import styles from '../app/collection/collection.module.css';
import isRemote from '../utils/isRemote';
import SkeletonLoader from './SkeletonLoader';

export default function CollectionGrid({ products, columns = 3, onProductClick }) {
  const colsClass = `cols-${columns}`;

  return (
    <div className={`${styles['product-grid']} ${styles['grid-view']} ${styles[colsClass]}`}>
      {products.map((product) => (
        <article className={styles['product-card']} key={product.id} onClick={() => onProductClick(product)}>
          <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '116.33%' }}>
            {product.image && (isRemote(product.image) || (typeof product.image === 'string' && product.image.startsWith('blob:'))) ? (
              <Image src={product.image} alt={product.name} className={styles['product-image']} fill style={{ objectFit: 'cover' }} unoptimized={true} loading="lazy" />
            ) : (
              <div style={{ position: 'absolute', inset: 0 }}>
                <SkeletonLoader style={{ width: '100%', height: '100%' }} />
              </div>
            )}
          </div>
          <div className={styles['card-info']}>
            <p>{product.name}<br />{product.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
