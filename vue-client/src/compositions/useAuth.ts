import {
  LoginInput,
  SignupInput,
  useLoginMutation,
  User,
  useSignupMutation
} from "@/apollo-graphql/generated/graphql.types";
import { reactive, ref } from "vue";

export default function useAuth() {
  const udt = window.localStorage.getItem("udt");
  const jtk = window.localStorage.getItem("jtk");
  const auth = reactive<{
    user: {
      __typename?: "User";
    } & Pick<User, "name" | "email" | "id">;
    token: string;
  }>({
    user: udt ? JSON.parse(udt) : {},
    token: jtk ? jtk : ""
  });
  const authError = ref("");
  const { mutate: signupMutation, onError: onSignupError } = useSignupMutation(
    {}
  );
  const { mutate: loginMutation, onError: onLoginError } = useLoginMutation({});

  onSignupError((error: any) => {
    console.log(error);
    if (error) {
      authError.value = error.message;
    }
  });

  function signup(e: SignupInput) {
    const returnResult = signupMutation({ ...e });
    returnResult.then((result) => {
      const { data } = result;
      if (data) {
        //localstorage for state persistence
        window.localStorage.setItem("udt", JSON.stringify(data.signup.user));
        window.localStorage.setItem("jtk", data.signup.token);
        //setting state
        auth.user = data.signup.user;
        auth.token = data.signup.token;
      }
    });
  }
  function login(e: LoginInput) {
    const returnResult = loginMutation({ ...e });
    returnResult.then((result) => {
      const { data } = result;
      if (data) {
        //localstorage for state persistence
        window.localStorage.setItem("udt", JSON.stringify(data.login.user));
        window.localStorage.setItem("jtk", data.login.token);
        //setting state
        auth.user = data.login.user;
        auth.token = data.login.token;
      }
    });
  }

  onLoginError((error: any) => {
    if (error) {
      console.log(error);
      authError.value = error.message;
    }
  });

  return {
    auth,
    signup,
    login,
    authError
  };
}
