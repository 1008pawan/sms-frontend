"use client";
import React from "react";
import Counting from "@/components/Counting";
import Experts from "@/components/Experts";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import OurSpecialized from "@/components/OurSpecialized";
import PhotoGallery from "@/components/PhotoGallery";
import ScrollReveal from "@/components/ScrollReveal";
import Testimonial from "@/components/Testimonial";
import Header from "@/components/Header";
import TrustSection from "@/components/TrustSection";
import AdressSection from "@/components/AdressSection";

const page = () => {
  return (
    <div className="bg-zinc-50">
      <Header />
      <ScrollReveal delay={0.2}>
        <HeroSection />
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <Counting />
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <OurSpecialized />
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <Experts />
      </ScrollReveal>
      {/* <ScrollReveal delay={0.2}>
        <TrustSection />
      </ScrollReveal> */}
      <ScrollReveal delay={0.2}>
        <PhotoGallery />
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <Testimonial />
      </ScrollReveal>
      {/* <ScrollReveal delay={0.2}>
        <AdressSection />
      </ScrollReveal> */}
      <ScrollReveal delay={0.2}>
        <Footer />
      </ScrollReveal>
    </div>
  );
};

export default page;
