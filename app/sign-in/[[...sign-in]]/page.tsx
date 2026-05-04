import { SignIn } from "@clerk/nextjs"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SmartNotes - Sign In",
}

const SignInPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn
        forceRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
        fallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
        appearance={{ variables: { colorPrimary: "#0F172A" } }}
      />
    </div>
  )
}

export default SignInPage;
