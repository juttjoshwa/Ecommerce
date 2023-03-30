import axios from "axios";
import {
  All_PRODUCT_REQUSET,
  All_PRODUCT_SUCSSCE,
  All_PRODUCT_fail,
  CLEAR_ERRORS,
} from "../Constants/ProductConstants.js";

export const GetProduct = () => async (dispatch) => {
  try {
    dispatch({
      type: All_PRODUCT_REQUSET,
    })
    
    const data = await axios.get("http://localhost:4000/api/v1/products");
    dispatch({
        type : All_PRODUCT_SUCSSCE,
        payload : data,
    })
    console.log(data)
  } catch (error) {
    dispatch({
      type: All_PRODUCT_fail,
      payload: error.response.data.message,
    });
  }
};


// just for clearing errors
export const clearErros = () => async (dispatch) => {
dispatch({
    type : CLEAR_ERRORS
})
}