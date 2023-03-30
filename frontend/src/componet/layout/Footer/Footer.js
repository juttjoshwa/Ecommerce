import React from "react";
import playStore from "../../../img/playstore.png";
import Appstore from "../../../img/Appstore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftfooter">
        <h4>DOWMLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={Appstore} alt="Appstore" />
      </div>
      <div className="midFooter">
        <h1>ECOMMERCE.</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2021 &copy; MeAbhiSingh</p>
      </div>
      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="http://instagram.com/meabhisingh">Instagram</a>
        <a href="https://github.com/juttjoshwa">GitHub</a>
        <a href="http://instagram.com/meabhisingh">LinkedIn</a>
      </div>
    </footer>
  );
};

export default Footer;
