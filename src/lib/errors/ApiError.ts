interface ErrorJson<T> {
  message: string;
  payload: T;
  statusCode: number;
}

class ApiError<T = Record<string, unknown>> extends Error {
  message: string;
  payload: T;
  statusCode: number;

  constructor(statusCode: number, message: string, payload?: T) {
    super(message);
    this.message = message;
    this.payload = payload;
    this.statusCode = statusCode;
  }

  toJson(): ErrorJson<T> {
    return {
      message: this.message,
      payload: this.payload,
      statusCode: this.statusCode,
    };
  }
}

export default ApiError;
