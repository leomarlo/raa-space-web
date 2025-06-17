'use client';


export default function RegisterForm() {

  return (
    <div className="absolute inset-0 flex items-center justify-center z-18">
      <div className="border-white border-[3pt] p-8 rounded-lg z-18 bg-black text-[#f5f5dc] translate-x-10">
        <h1 className="text-4xl font-bold mb-6 text-center">REGISTER AT RAA SPACE</h1>
        <p className="text-center mb-6">
          If you want to be part of the RAA Space, please enter your email below.
        </p>
        <form
          action="https://formspree.io/f/xkgbwlyr"
          method="POST"
          className="flex flex-col sm:flex-row items-center gap-2"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="px-4 py-2 bg-transparent border border-[#f5f5dc] rounded-full text-[#f5f5dc] placeholder-[#f5f5dc]/70 focus:outline-none focus:ring-2 focus:ring-[#f5f5dc]"
          />
          <button
            type="submit"
            className="px-4 py-2 border border-[#f5f5dc] bg-transparent text-[#f5f5dc] font-semibold rounded-full hover:bg-[#f5f5dc] hover:text-black transition"
          >
            ENTER
          </button>
        </form>
      </div>
    </div>
  );
}
