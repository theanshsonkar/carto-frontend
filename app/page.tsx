import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ToolStrip } from "@/components/ToolStrip";
import { Problem } from "@/components/Problem";
import { NotDocker } from "@/components/NotDocker";
import { Inside } from "@/components/Inside";
import { BlastRadius } from "@/components/BlastRadius";
import { Guardrail } from "@/components/Guardrail";
import { Portable } from "@/components/Portable";
import { HowItWorks } from "@/components/HowItWorks";
import { Benchmarks } from "@/components/Benchmarks";
import { Trust } from "@/components/Trust";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { SectionLabel } from "@/components/ui/SectionLabel";

const TOTAL = 7;

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <ToolStrip />

        <SectionLabel name="THE RE-INDEXING TAX" index={1} total={TOTAL} />
        <Problem />

        {/* slim clarification band - no section label */}
        <NotDocker />

        <SectionLabel name="INSIDE THE CONTAINER" index={2} total={TOTAL} />
        <Inside />

        {/* full-bleed dark anchor - no section label on purpose */}
        <BlastRadius />

        <SectionLabel name="CONTEXT THAT PUSHES BACK" index={3} total={TOTAL} />
        <Guardrail />

        <SectionLabel name="BUILD ONCE · PULL ANYWHERE" index={4} total={TOTAL} />
        <Portable />

        <SectionLabel name="HOW IT WORKS" index={5} total={TOTAL} />
        <HowItWorks />

        <SectionLabel name="SPEED · BENCHMARKS" index={6} total={TOTAL} />
        <Benchmarks />

        <SectionLabel name="LICENSE · TRUST" index={7} total={TOTAL} />
        <Trust />

        <FAQ />

        <CTA />
      </main>
      <Footer />
    </>
  );
}
