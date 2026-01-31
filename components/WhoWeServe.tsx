import { GraduationCap, Users, Microscope, Rocket } from "lucide-react";

const items = [
  {
    title: "Students",
    desc: "Undergraduate and postgraduate students learning CPU and SoC design",
    icon: GraduationCap,
  },
  {
    title: "Professors",
    desc: "Educators teaching computer architecture and digital design",
    icon: Users,
  },
  {
    title: "Researchers",
    desc: "Academic researchers exploring hardware architecture",
    icon: Microscope,
  },
  {
    title: "Startups",
    desc: "Early-stage companies prototyping embedded systems",
    icon: Rocket,
  },
];

export default function WhoWeServe() {
  return (
    <section className="relative py-28 bg-black">
      <div className="mx-auto max-w-7xl px-6 text-center">

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
          Who We Serve
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-base md:text-lg text-muted max-w-2xl mx-auto">
          Empowering education, research, and innovation in hardware design
        </p>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item.title}
              className="
                relative
                rounded-xl
                border border-yellow/20
                bg-gradient-to-b from-[#0b1220] to-black
                p-6
                text-left
                shadow-[0_0_40px_rgba(250,204,21,0.08)]
                transition
                hover:shadow-[0_0_55px_rgba(250,204,21,0.18)]
              "
            >
              {/* Icon */}
              <div className="mb-5 inline-flex rounded-full border border-yellow/30 p-3 text-yellow shadow-[0_0_25px_rgba(250,204,21,0.4)]">
                <item.icon className="h-5 w-5" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-yellow">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}