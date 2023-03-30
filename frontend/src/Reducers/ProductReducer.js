import {
    All_PRODUCT_REQUSET,
    All_PRODUCT_SUCSSCE,
    All_PRODUCT_fail,
    CLEAR_ERRORS,
  } from "../Constants/ProductConstants.js";
  
  export const ProductReducer = (state = { products: [] }, actions) => {
    switch (actions.type) {
      case All_PRODUCT_REQUSET:
        return {
          loading: true,
          products: [],
        };
      case All_PRODUCT_SUCSSCE:
        return {
          loading: false,
          Products: actions.payload.products,
          ProductsCount: actions.payload.productsCount,
        };
      case All_PRODUCT_fail:
        return {
          ...state,
          error: null,
        };
      case CLEAR_ERRORS:
        return {
          loading: false,
          error: actions.payload,
        };
      default:
        return state;
    }
  };
  