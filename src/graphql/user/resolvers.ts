import UserService, { CreateUserPayload } from "../../services/user";

const queries = {
  getUserToken: async (_: any, payload: { email: string; password: string }) => {
    const token = await UserService.getUserToken({
      email: payload.email,
      password: payload.password,
    });
    return token;
  },
  getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
    if (context && context.user) {
      const id = context.user.id;
      const user = await UserService.getUserById(id);
      return user;
    }
    throw new Error("I don't know who are you");
  },
};

const mutations = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
  deleteUserByEmail: async (_: any, payload: { email: string }, context: any) => {

    //check if user passed the token for delete request
    if (context?.user) {
      if (context.user.email === payload.email) {
        const res = await UserService.deleteUserByEmail(payload)
        return "User has been deleted"
      } else {
        throw new Error("Invalid delete request")
      }
    }
    else {
      throw new Error("Invalid Token")
    }
  }
};

export const resolvers = { queries, mutations };
