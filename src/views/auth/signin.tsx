import { LoginForm } from "@/components/login-form";

const Signin = () => {
  return (
    <div
      className="flex items-center justify-center w-screen min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/auth.jpeg')" }}
    >
      <div className="absolute inset-0 bg-background/10 backdrop-blur-sm" />
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
};

export default Signin;
