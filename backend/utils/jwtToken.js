// create tokken and saving in cookies

const sendTokken = (user, statusCode, res) => {
  const tokken = user.getJWTToken();

  // options for cookies

  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60*1000),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token",tokken,options).json({
    success : true,
    user,
    tokken,
  })
};

export default sendTokken
