import LoginForm from '@/components/forms/login-form/login-form';

export default function Page(): React.JSX.Element {
  return (
    <section className="registration-wrapper flex flex-col items-center justify-center">
      <h1 className="text-3xl md:text-4xl font-merriweather font-bold mb-6 text-center dark:text-foreground text-noble-brown-900">
        <span className="relative inline-block h-accent">Sign In to Your Account</span>
      </h1>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </section>
  );
}
