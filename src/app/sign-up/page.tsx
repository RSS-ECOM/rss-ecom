import RegistrationForm from '@/components/forms/registration-form/registration-form';

export default function SignUpPage(): JSX.Element {
  return (
    <section className="container mx-auto flex flex-col items-center pt-10">
      <h1 className="text-h1 font-bold mb-5">Create Your Account</h1>
      <RegistrationForm />
    </section>
  );
}
