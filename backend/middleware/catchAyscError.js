const catchAsync = (theFunc) => async (req, res, next) => {
  try {
    await theFunc(req, res, next);
  } catch (err) {
    next(err);
  }
};
export default catchAsync;
