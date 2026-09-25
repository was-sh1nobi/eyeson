"use client";

// آدرس عکس‌های هر کارت رو اینجا قرار بده
const services = [
  {
    id: 1,
    title: "Web UI Design",
    description:
      "Modern websites and landing pages designed for clarity, usability, and conversion.",
    imageUrl: "/uiux/card1.webp",
  },
  {
    id: 2,
    title: "Mobile App UI Design",
    description:
      "Intuitive mobile experiences designed for iOS and Android applications.",
    imageUrl: "/uiux/card2.webp",
  },
  {
    id: 3,
    title: "Dashboard UI Design",
    description:
      "Data driven interfaces that simplify workflows and improve decision making.",
    imageUrl: "/uiux/card3.webp",
  },
  {
    id: 4,
    title: "Design Systems",
    description:
      "Scalable design systems and reusable components built for consistency and growth.",
    imageUrl: "/uiux/card4.webp",
  },
  {
    id: 5,
    title: "Interactive Prototypes",
    description:
      "Clickable prototypes that help validate ideas, user flows, and product experiences before\n" +
        "development.",
    imageUrl: "/uiux/card5.webp",
  },
  {
    id: 6,
    title: "UI Redesign & Optimization",
    description:
      "Improve existing products with better usability, navigation, accessibility, and visual design.",
    imageUrl: "/uiux/card6.webp",
  },
];

export default function UiUxServicesSection() {
  return (
    <section className="relative w-full overflow-hidden py-20 lg:py-32">
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8">
        {/* هدر بخش */}
        <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
          <h2 className="text-[36px] font-bold tracking-tight text-[#32c9b4] sm:text-[44px] lg:text-[50px]">
            UI/UX Design Services
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray-300 sm:text-[16px] lg:text-[17px]">
            Design solutions for websites, SaaS products, mobile applications, and digital platforms.
          </p>
        </div>

        {/* گرید سرویس‌ها */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {services.map((service) => (
            <div key={service.id} className="group flex flex-col">
              {/* کادر عکس */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-white/5 bg-[#0a1820] shadow-lg transition-[transform,border-color,box-shadow] duration-300 group-hover:-translate-y-1.5 group-hover:border-cyan-500/20 group-hover:shadow-[0_15px_40px_rgba(17,169,157,0.15)]">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* متن‌های زیر عکس */}
              <div className="mt-6 flex flex-col px-1">
                <h3 className="text-[22px] font-bold tracking-tight text-white lg:text-[24px]">
                  {service.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.65] text-gray-300">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
