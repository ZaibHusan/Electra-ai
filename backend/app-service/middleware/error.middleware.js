export const errorHandler = (
    err,
    req,
    res,
    next
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server";
  return res.status(statusCode).json({ success: false, message });
}