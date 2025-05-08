import create from "./HttpService";

/**
 * Registration request payload interface
 * @interface RegisterRequest
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/**
 * Registration response interface
 * @interface RegisterResponse
 */
/*
export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  token: string;
}
*/


export default create("/register");