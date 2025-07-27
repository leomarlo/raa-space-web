'use client';

import { RegisterFormPropsWithLink } from '@/types/main';


function RegisterFormInline({ registerFormProps, link }: RegisterFormPropsWithLink) {
  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-center">{registerFormProps.title}</h1>
      <p className="text-center mb-6">
        {registerFormProps.description}
      </p>
      <form
        action={link}
        method="POST"
        className="flex flex-col sm:flex-row items-center gap-2"
      >
        <input
          type="email"
          name="email"
          placeholder={registerFormProps.placeholder}
          required
          className="px-4 py-2 bg-transparent border border-[#f5f5dc] rounded-full text-[#f5f5dc] placeholder-[#f5f5dc]/70 focus:outline-none focus:ring-2 focus:ring-[#f5f5dc]"
        />
        <button
          type="submit"
          className="px-4 py-2 border border-[#f5f5dc] bg-transparent text-[#f5f5dc] font-semibold rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
        >
          {registerFormProps.submit}
        </button>
      </form> 
    </>
  );
}


function RegisterForm({ registerFormProps, link }: RegisterFormPropsWithLink) {

  return (
    <div className="absolute inset-0 flex items-center justify-center z-18">
      <div className="border-white border-[3pt] p-8 rounded-lg z-18 bg-black text-[#f5f5dc] translate-x-10">
        <RegisterFormInline registerFormProps={registerFormProps} link={link} />
      </div>
    </div>
  );
}

// a list of register forms, basically an array of RegisterFormPropsWithLink
function RegisterFormWithDifferentLinks({formWithLinks}: {formWithLinks: RegisterFormPropsWithLink[]}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-18">
      <div className="border-white border-[3pt] p-8 rounded-lg z-18 bg-black text-[#f5f5dc] translate-x-10">
        {formWithLinks.map((formWithLink, index) => (
          <RegisterFormInline key={index} registerFormProps={formWithLink.registerFormProps} link={formWithLink.link} />
        ))}
      </div>
    </div>
  );
}

// export both functions
export { RegisterFormInline, RegisterForm , RegisterFormWithDifferentLinks};
