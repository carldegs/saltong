import ApiError from './ApiError';

class PrivateRoundError extends ApiError {
  constructor() {
    super(401, 'Not yet authorized to access private round');
  }
}

export default PrivateRoundError;
