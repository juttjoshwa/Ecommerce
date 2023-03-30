import React, { Fragment, useEffect,useState } from "react";
import { CgMouse } from "react-icons/cg";
import MetaData from "../layout/MetaData";
import "./Home.css";
import Product from "./Product.js";
import { GetProduct } from "../../Actions/productAction";
import {useSelector,useDispatch} from "react-redux"
import axios from "axios";



const Home = () => {
  const [product1, setProduct] = useState([]);

  const gettingData = async () => {
    const res = await axios.get("http://localhost:4000/api/v1/products");
    const products = res.data.Products; // Accessing Products array
    console.log(products); // Logging Products array to the console
  };
  
  
  gettingData().then(() => {
    console.log(product1.data.Products);
  });
  

  const dispatch = useDispatch()
  const {loading,error,Products,ProductsCount} = useSelector(state=>state.Products)

 
  useEffect(() => {
    dispatch(GetProduct())
  }, [dispatch])
  

  const product = {
    name : "Blue Tshirt",
    image : [{url : "https://i.pinimg.com/originals/4e/5e/89/4e5e890b78604a582e7b8ae7bfda5d19.jpg"}],
    price : "$300",
    _id : "yashwa",
  };
    
  return (
    <Fragment>
     <MetaData title="Ecommerce" />

      <div className="banner">
        <p>welcome to ecommerce</p>
        <h1>find amazing products below</h1>
        <a href="#container">
          <button>
            scroll
            <CgMouse />
          </button>
        </a>
      </div>

      <h2 className="homeHeading">Featured Products</h2>
      <div className="container" id="container">
   {
    Products && Products.map(Products => (
      <product Products={Products} />
    ))
   }
      </div>
    </Fragment>
  );
};

export default Home;






