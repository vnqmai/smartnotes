import { SignUp } from "@clerk/nextjs"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SmartNotes - Sign Up",
}


const SignUpPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp
        forceRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}
        fallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}
        appearance={{ variables: { colorPrimary: "#0F172A" } }}
      />
    </div>
  )
}

export default SignUpPage;
