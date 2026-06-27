import { Hero } from "@/components/home/Hero";
import { SocialProof } from "@/components/home/SocialProof";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { AudioExamples } from "@/components/home/AudioExamples";
import { GiftCategories } from "@/components/home/GiftCategories";
import { WhatsIncluded } from "@/components/home/WhatsIncluded";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";
import { MobileFloatingCTA } from "@/components/layout/MobileFloatingCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <HowItWorks />
      <AudioExamples />
      <Testimonials />
      <GiftCategories />
      <WhatsIncluded />
      <FAQ />
      <FinalCTA />
      <MobileFloatingCTA />
    </>
  );
}
