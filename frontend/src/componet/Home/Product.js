import React from 'react'
import { Link } from 'react-router-dom'
import ReactStar from "react-rating-stars-component"


const options = {
  edit : false,
  color : "rgba(20,20,20,0.1)",
  activeColor :"tomato",
  value : 2.5 ,
  isHalf : true ,
  size : window.innerWidth < 600 ? 20 : 25 ,
}
const product = ({product}) => {
  return (
    <Link className='productCard' to={product._id} >
      <img src={product.image[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <ReactStar {...options}/>
        <span>
          (256 Review)
        </span>
      </div>
      <span>{product.price}</span>

    </Link>
  )
}

export default product