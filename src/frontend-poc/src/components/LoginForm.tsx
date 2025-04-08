import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginService, { LoginCredentials } from "../services/LoginService";
import apiClient from "../services/api-client";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." }),
  password: z
    .string({ invalid_type_error: "Password is required." })
    .min(4, { message: "Password must be at least 4 characters." }),
});
// Detta är istället för att skapa ett FormData interface
type FormData = z.infer<typeof schema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const loginUser = (loginCredentials: LoginCredentials) => {
    LoginService.post(loginCredentials)
      .then(() => {
        console.log("Login successful");
      })
      .catch((err) => {
        console.log("Login failed");
        console.log(err.response.data);
      });
  };

  const getStudents = () => {
    apiClient
      .get("/students", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Students: ", response.data);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
      });
  };

  const onSubmit = (data: FieldValues) => {
    loginUser(data as LoginCredentials);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onClick={() => console.log(/*errors*/)}
      >
        <div className="mb-3">
          <label htmlFor="MyUsername" className="form-label">
            Username
          </label>
          <input
            {...register("username")}
            id="MyUsername"
            type="text"
            className="form-control"
          />
          {errors.username && (
            <p className="text-danger">{errors.username.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="MyAge" className="form-label">
            Password
          </label>
          <input
            {...register("password")}
            id="MyPassword"
            type="password"
            className="form-control"
          />
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
        </div>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
      <button className="btn btn-secondary" onClick={getStudents}>
        GetStudents
      </button>
    </div>
  );
};

export default LoginForm;
