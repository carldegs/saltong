import ApiError from './ApiError';

class FileNotFoundError extends ApiError {
  constructor(fileName: string) {
    super(404, `File ${fileName} not found`);
  }
}

export default FileNotFoundError;
