import BeachBackground from "./BeachBackground";
export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
  
      <BeachBackground />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-8 py-10">
        {/* Navbar */}
        <nav className="flex items-center justify-between">
          <h2 className="font-black uppercase tracking-widest text-yellow-300">
            BUILDER PASS
          </h2>

          <button className="rounded border-2 border-yellow-300 px-6 py-2 text-yellow-300 transition hover:bg-yellow-300 hover:text-green-900">
            About
          </button>
        </nav>

        {/* Hero */}
        <div className="flex flex-1 items-center">
          <div className="mt-24 flex w-full flex-col items-center gap-16 lg:flex-row lg:justify-between">

            {/* LEFT */}
            <div className="max-w-3xl">
              <p className="mb-4 uppercase tracking-[0.4em] text-yellow-300">
                Hacker House Goa 2026
              </p>

              <h1 className="text-7xl font-black leading-none text-yellow-300 md:text-9xl">
                BUILDER
                <br />
                PASSPORT
              </h1>

              <p className="mt-8 max-w-xl text-lg text-green-100">
                Certified for late-night debugging.
              </p>

              <button className="mt-10 border-4 border-yellow-300 bg-yellow-300 px-10 py-5 font-black uppercase tracking-wide text-green-900 transition hover:scale-105">
                Generate Passport →
              </button>
            </div>

            {/* RIGHT */}
            <div className="flex justify-center">
              <div className="relative">

  {/* Sun */}
  <div className="absolute -right-8 -top-8 h-56 w-56 rounded-full bg-yellow-300 opacity-30 blur-3xl" />

  {/* Passport */}
  <div className="relative w-[340px] min-h-[560px] rounded-[32px] bg-[#F7F2E8] p-8 shadow-2xl rotate-2">

  <p className="text-xs uppercase tracking-[0.4em] text-green-900">
    Hacker House Goa
  </p>

  <h2 className="mt-2 text-3xl font-black text-green-900">
    BUILDER PASS
  </h2>

  {/* 👇 PASTE IT HERE */}

  <div className="mt-8 flex justify-center">
    <div className="relative rotate-[-4deg] rounded-md bg-white p-3 shadow-lg">

      <div className="absolute -top-2 left-1/2 h-4 w-16 -translate-x-1/2 rotate-2 rounded-sm bg-pink-400 opacity-80" />

      <div className="flex h-52 w-44 items-center justify-center rounded bg-green-200">
        PHOTO
      </div>

    </div>
  </div>

  <div className="mt-8">
  <p className="text-xs uppercase tracking-[0.25em] text-green-700">
    Builder Name
  </p>

  <h3 className="text-3xl font-black text-green-900">
    Your Name
  </h3>

  <div className="mt-6 border-t border-green-300 pt-6">
    <p className="text-xs uppercase tracking-[0.25em] text-green-700">
      Builder Archetype
    </p>

    <p className="text-xl font-bold text-green-900">
      Coconut Compiler
    </p>
  </div>
</div>

<div className="mt-8">
</div>

<div className="mt-8 flex items-center justify-between border-t border-green-300 pt-6">
  <div>
    <p className="text-xs uppercase text-green-700">
      Issued
    </p>

    <p className="font-bold text-green-900">
      Goa · HHG26
    </p>
  </div>

  <div className="flex h-14 w-14 items-center justify-center rounded bg-green-900 text-white">
    QR
  </div>
</div>

</div>


</div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}