import { z } from "zod";
//zod is a TypeScript-first schema declaration and validation library. It allows you to define the shape of your data and validate it at runtime. In this code snippet, we are using zod to create a schema for validating a username input field in a sign-up form. The schema specifies that the username must be a string with a minimum length of 3 characters and a maximum length of 20 characters. Additionally, it must match a regular expression that allows only letters, numbers, and underscores. If the input does not meet these criteria, appropriate error messages will be provided.

//so the what zod is doing here is creating a schema for validating a username input field in a sign-up form. The schema specifies that the username must be a string with a minimum length of 3 characters and a maximum length of 20 characters. Additionally, it must match a regular expression that allows only letters, numbers, and underscores. If the input does not meet these criteria, appropriate error messages will be provided.
export const usernameValidation = z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" });

// Now we can use this schema to validate the entire sign-up form data which includes username, email, and password fields.
//here the object method is used to create a schema for an object with the specified properties. Each property is defined using the zod validation methods. The email field is validated to be a valid email address using the email method, and the password field is validated to have a minimum length of 6 characters using the min method. If any of these validations fail, appropriate error messages will be provided.
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
})
