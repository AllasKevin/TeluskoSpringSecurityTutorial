import create from "./HttpService"

export interface LoginCredentials {
    username: string;
    password: string;
  }



export default create("/login");