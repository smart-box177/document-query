import { SignupForm } from "@/components/signup-form";

const Signup = () => {
  return (
    <div
      className="flex items-center justify-center w-screen min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/auth.jpeg')" }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="relative z-10">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
