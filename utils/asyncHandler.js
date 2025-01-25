const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}
// Wrapper function for try-catch
const tryCatchWrapper = (fn) => async (req, res, next) => {
    try {
      await fn(req, res, next); // Execute the wrapped function
    } catch (error) {
      // Handle error here (log it, send response, etc.)
      console.error('Error:', error?.message);
      // Send a standard error response
      res.status(500).json({ error: 'Something went wrong', details: error?.message });
    }
  };
export { tryCatchWrapper, asyncHandler }