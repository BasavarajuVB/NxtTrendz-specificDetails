// // Write your code here

// import './index.css'

import './index.css'

const SimilarProductItem = ({product}) => {
  const {imageUrl, title, brand, price, rating} = product

  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-img"
      />
      <h3 className="similar-product-title">{title}</h3>
      <p className="similar-product-brand">by {brand}</p>
      <div className="similar-product-details">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="similar-product-rating">
          <span>{rating}</span>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-icon"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
