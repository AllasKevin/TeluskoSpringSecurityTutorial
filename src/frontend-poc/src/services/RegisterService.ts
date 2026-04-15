import create from './HttpService';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export default create('/register');
