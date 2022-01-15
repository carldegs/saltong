import ApiError from './ApiError';

class ContextNoProviderError extends ApiError {
  constructor(hook: string, provider: string) {
    super(500, `${hook} must be used within ${provider}`);
  }
}

export default ContextNoProviderError;
