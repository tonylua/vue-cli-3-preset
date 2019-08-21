function CustomError(message, data) {
  const _this = Error.call(this, message);
  _this.data = data;
  return _this;
} 
Object.setPrototypeOf(CustomError, Object.create(Error.prototype, {
  constructor: {
    value: CustomError,
    enumerable: false,
    writable: false
  }
}));

// class CustomError extends Error {
//   constructor(message, data) {
//     super(message);
//     this.data = data;
//   }
// }

export default CustomError;
