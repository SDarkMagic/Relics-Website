class NotFound extends Error {
    constructor (message = 'Not Found') {
        super(message);
        this.name = this.constructor.name;
        this.status = 404;
        Error.captureStackTrace(this, this.constructor);
      }
}

module.exports = NotFound