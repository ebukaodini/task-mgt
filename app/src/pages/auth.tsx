import { FormEvent, useState } from "react";
import Layout from "../components/layout";
import { useForm } from "../hooks/useForm";
import { useStore } from "../models/useStore";
import { useNavigate } from "react-router-dom";
import LogoHeader from "../components/logo-header";

interface AuthProps {}
type AuthAction = "SIGNUP" | "SIGNIN";

const Auth: React.FC<AuthProps> = () => {
  const [action, updateAction] = useState<AuthAction>("SIGNIN");
  const [errorMsg, setErrorMsg] = useState<string>();
  const {
    isSubmitting,
    submitting,
    credentials,
    setCredential,
    errors,
    setErrors,
  } = useForm();
  const { signIn, signUp } = useStore();
  const navigate = useNavigate();

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    submitting(true);

    signIn(credentials)
      .then(() => {
        submitting(false);
        navigate("/projects", { replace: true });
      })
      .catch((error) => {
        submitting(false);
        setErrorMsg(error.message);
      });
  };

  const handleSignUp = (e: FormEvent) => {
    e.preventDefault();
    submitting(true);

    signUp(credentials)
      .then(() => {
        submitting(false);
        navigate("/projects", { replace: true });
      })
      .catch((error) => {
        submitting(false);
        setErrorMsg(error.message);
        console.log({ error });
      });
  };

  return (
    <Layout>
      <LogoHeader />
      <div className="w-full flex justify-center">
        {action === "SIGNIN" ? (
          // sign in form
          <form
            onSubmit={handleSignIn}
            className="bg-white rounded shadow-md p-4 flex flex-col gap-y-3 w-1/2"
          >
            <h1 className="text-lg font-semibold text-primary">
              Please Sign In
            </h1>

            {errorMsg?.length! > 0 && (
              <div className="bg-red-100 p-2 text-xs text-red-500 font-semibold">
                {errorMsg} <br />
                {errors ? (
                  Object.values(errors).map((error: any) => <li>{error}</li>)
                ) : (
                  <></>
                )}
              </div>
            )}

            <div>
              <label
                className="text-gray-400 font-semibold text-sm"
                htmlFor="signin-email"
              >
                Email
              </label>
              <input
                id="signin-email"
                type="email"
                placeholder="Enter your email address"
                className="border-2 border-gray-200 rounded text-sm py-2 px-4 w-full"
                disabled={isSubmitting}
                onChange={(e) => setCredential("email", e.target.value)}
              />
            </div>

            <div className="flex flex-col mt-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white rounded font-semibold text-sm py-2 px-4 w-full"
              >
                Sign In
              </button>

              <p className="inline-flex justify-center">or</p>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  updateAction("SIGNUP");
                  setErrors({});
                  setErrorMsg("");
                }}
                className="bg-gray-200  rounded font-semibold text-sm py-2 px-4 w-full"
              >
                Sign Up
              </button>
            </div>
          </form>
        ) : (
          // sign up form
          <form
            onSubmit={handleSignUp}
            className="bg-white rounded shadow-md p-4 flex flex-col gap-y-3 w-1/2"
          >
            <h1 className="text-lg font-semibold text-primary">
              Please Sign Up
            </h1>

            {errorMsg?.length! > 0 && (
              <div className="bg-red-100 p-2 text-xs text-red-500 font-semibold">
                {errorMsg} <br />
                {errors ? (
                  Object.values(errors).map((error: any) => <li>{error}</li>)
                ) : (
                  <></>
                )}
              </div>
            )}

            <div>
              <label
                className="text-gray-400 font-semibold text-sm"
                htmlFor="signup-first-name"
              >
                First Name
              </label>
              <input
                id="signup-first-name"
                type="text"
                placeholder="Enter your first name"
                className="border-2 border-gray-200 rounded text-sm py-2 px-4 w-full"
                disabled={isSubmitting}
                onChange={(e) => setCredential("firstName", e.target.value)}
              />
            </div>

            <div>
              <label
                className="text-gray-400 font-semibold text-sm"
                htmlFor="signup-last-name"
              >
                Last Name
              </label>
              <input
                id="signup-last-name"
                type="text"
                placeholder="Enter your last name"
                className="border-2 border-gray-200 rounded text-sm py-2 px-4 w-full"
                disabled={isSubmitting}
                onChange={(e) => setCredential("lastName", e.target.value)}
              />
            </div>

            <div>
              <label
                className="text-gray-400 font-semibold text-sm"
                htmlFor="signup-email"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                placeholder="Enter your email address"
                className="border-2 border-gray-200 rounded text-sm py-2 px-4 w-full"
                disabled={isSubmitting}
                onChange={(e) => setCredential("email", e.target.value)}
              />
            </div>

            <div className="flex flex-col mt-5">
              <button
                type="submit"
                className="bg-primary text-white rounded font-semibold text-sm py-2 px-4 w-full"
              >
                Sign Up
              </button>

              <p className="inline-flex justify-center">or</p>

              <button
                type="button"
                onClick={() => {
                  updateAction("SIGNIN");
                  setErrors({});
                  setErrorMsg("");
                }}
                className="bg-gray-200  rounded font-semibold text-sm py-2 px-4 w-full"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default Auth;
