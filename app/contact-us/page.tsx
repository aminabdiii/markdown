import FormComponent from "./_components/form";

function ContactUs() {
  return (
    <div className="w-full min-h-dvh flex items-center justify-center flex-col">
      <h1 className="pb-20 font-bold text-3xl">Contact Us</h1>

      <section className="">
        <FormComponent />
      </section>
    </div>
  );
}

export default ContactUs;
