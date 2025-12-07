import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl border-2"
          }
        }}
        routing="path"
        path="/sign-up"
      />
    </div>
  )
}
