import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

import './index.css'

const statusConstants = {
  onInitial: 'INITIAL',
  onSuccess: 'SUCCESS',
  onLoading: 'LOADING',
  onFailure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProductsDetails: [],
    activeStatus: statusConstants.onInitial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({activeStatus: statusConstants.onLoading})

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    try {
      const response = await fetch(apiUrl, options)
      const data = await response.json()
      if (response.ok === true) {
        const updatedData = {
          availability: data.availability,
          brand: data.brand,
          description: data.description,
          id: data.id,
          imageUrl: data.image_url,
          price: data.price,
          rating: data.rating,
          title: data.title,
          totalReviews: data.total_reviews,
        }
        const similarProductsDetailsFromResponse = data.similar_products.map(
          eachSimilar => ({
            availability: eachSimilar.availability,
            brand: eachSimilar.brand,
            description: eachSimilar.description,
            id: eachSimilar.id,
            imageUrl: eachSimilar.image_url,
            price: eachSimilar.price,
            rating: eachSimilar.rating,
            title: eachSimilar.title,
            totalReviews: eachSimilar.total_reviews,
          }),
        )
        this.setState({
          productData: updatedData,
          similarProductsDetails: similarProductsDetailsFromResponse,
          activeStatus: statusConstants.onSuccess,
        })
      } else {
        this.setState({
          activeStatus: statusConstants.onFailure,
        })
      }
    } catch (error) {
      this.setState({
        activeStatus: statusConstants.onFailure,
      })
    }
  }

  getSimilarProducts = () => {
    const {similarProductsDetails} = this.state

    return (
      <div>
        <h2>Similar Products</h2>
        <ul className="similar-products">
          {similarProductsDetails.map(eachProduct => (
            <SimilarProductItem product={eachProduct} key={eachProduct.id} />
          ))}
        </ul>
      </div>
    )
  }

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onAddToCart = () => {
    console.log('Item added to cart')
  }

  renderSuccessView = () => {
    const {productData, quantity} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData

    return (
      <div className="product-details-container">
        <div className="product-details">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product-info">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="rating-container1">
              <div className="rating">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-icon"
                />
              </div>
              <p className="product-description">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="availability">
              <span className="label">Available:</span> {availability}
            </p>
            <p className="product-description">
              <span className="label">Brand:</span> {brand}
            </p>
            <hr className="horizontal-line" />
            <div className="quantity-container">
              <button
                className="quantity-button"
                onClick={this.onDecrementQuantity}
                type="button"
                disabled={quantity <= 1}
                data-testid="minus"
              >
                <BsDashSquare alt="minus" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                className="quantity-button"
                onClick={this.onIncrementQuantity}
                type="button"
                data-testid="plus"
              >
                <BsPlusSquare alt="plus" />
              </button>
            </div>
            <button
              className="add-to-cart-btn"
              onClick={this.onAddToCart}
              type="button"
            >
              ADD TO CART
            </button>
          </div>
        </div>
        {this.getSimilarProducts()}
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>

      <Link to="/products">
        <button
          type="button"
          className="button"
          onClick={this.getProductDetails}
        >
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderFinalResult = () => {
    const {activeStatus} = this.state

    switch (activeStatus) {
      case statusConstants.onSuccess:
        return this.renderSuccessView()
      case statusConstants.onFailure:
        return this.renderFailureView()
      case statusConstants.onLoading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-item-details-container">
        <Header />
        {this.renderFinalResult()}
      </div>
    )
  }
}

export default ProductItemDetails
