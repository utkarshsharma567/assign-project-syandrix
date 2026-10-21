import MenuSection from "../components/MenuSection";


export default function Menu() {
  return (
    <div>
      {/* Page Header Banner */}
      <section className="bg-[#17191d] py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-10">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-orange">
            Freshly Made Daily
          </p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">
            Explore All Dishes
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-gray-300">
            Select your favourite category below, add items to your cart, and enjoy seamless ordering!
          </p>
        </div>
      </section>

      {/* Menu Section with filters and dishes */}
      <MenuSection />
    </div>
  );
}
