import RegistrationForm from '@/components/forms/registration-form/registration-form';

export default function SignUpPage(): JSX.Element {
  return (
    <section className="registration-wrapper flex flex-col items-center justify-center">
      <h1 className="text-3xl md:text-4xl font-merriweather font-bold mb-6 text-center dark:text-foreground text-noble-brown-900">
        <span className="relative inline-block h-accent">Create Your Account</span>
      </h1>
      <RegistrationForm />
    </section>
  );
}
