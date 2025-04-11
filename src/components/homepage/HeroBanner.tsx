import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PrimaryButton } from "@/components/ui/primary-button"

interface BannerItem {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  banners?: BannerItem[];
}

export default function HeroBanner({
  title = "Set up your marketplace for free",
  subtitle = "Limited period offer: You set up shop, we handle the rest. Sign up as a seller today and enjoy free listing and shipping.",
  backgroundImage = "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
  ctaText = "Sign up",
  ctaLink = "/products",
  banners = []
}: HeroBannerProps) {
  // If banners array is provided, use it. Otherwise, create a single banner from props
  const allBanners = banners.length > 0 
    ? banners 
    : [{ title, subtitle, backgroundImage, ctaText, ctaLink }];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("");
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-cycle through banners
  useEffect(() => {
    if (allBanners.length <= 1) return;

    autoPlayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, [allBanners.length]);

  const nextSlide = () => {
    if (animationClass !== "") return;
    
    setAnimationClass("slide-left");
    
    animationTimerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % allBanners.length);
      setAnimationClass("");
    }, 500);
  };

  const prevSlide = () => {
    if (animationClass !== "") return;
    
    setAnimationClass("slide-right");
    
    animationTimerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? allBanners.length - 1 : prev - 1));
      setAnimationClass("");
    }, 500);
  };

  const goToSlide = (index: number) => {
    if (animationClass !== "" || index === currentIndex) return;
    
    const direction = index > currentIndex ? "slide-left" : "slide-right";
    setAnimationClass(direction);
    
    animationTimerRef.current = setTimeout(() => {
      setCurrentIndex(index);
      setAnimationClass("");
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto pt-2 pb-4">
      <div className="relative bg-gray-900 text-white overflow-hidden">
        <div className={`banner-container ${animationClass}`}>
          <div className="current-banner">
      <div className="absolute inset-0">
        <Image
                src={allBanners[currentIndex].backgroundImage}
                alt="Banner Image"
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
          quality={90}
        />
      </div>
            <div className="relative max-w-7xl mx-auto px-12 sm:px-16 lg:px-24 py-10 md:py-16">
              <div className="max-w-3xl">
                <h1 className="text-2xl md:text-4xl font-bold mb-2 font-playfair">
                  {allBanners[currentIndex].title}
                </h1>
                <p className="text-sm md:text-lg text-gray-200">
                  {allBanners[currentIndex].subtitle}
                </p>
                <Link href={allBanners[currentIndex].ctaLink}>
                  <PrimaryButton className="mt-4 px-6 py-2 bg-white text-gray-900 hover:bg-gray-100 text-sm md:text-base">
                    {allBanners[currentIndex].ctaText}
                  </PrimaryButton>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="next-banner">
            <div className="absolute inset-0">
              <Image
                src={allBanners[(currentIndex + 1) % allBanners.length].backgroundImage}
                alt="Next Banner Image"
                fill
                priority={false}
                className="object-cover opacity-40"
                sizes="100vw"
                quality={90}
              />
            </div>
            <div className="relative max-w-7xl mx-auto px-12 sm:px-16 lg:px-24 py-10 md:py-16">
              <div className="max-w-3xl">
                <h1 className="text-2xl md:text-4xl font-bold mb-2 font-playfair">
                  {allBanners[(currentIndex + 1) % allBanners.length].title}
                </h1>
                <p className="text-sm md:text-lg text-gray-200">
                  {allBanners[(currentIndex + 1) % allBanners.length].subtitle}
                </p>
                <Link href={allBanners[(currentIndex + 1) % allBanners.length].ctaLink}>
                  <PrimaryButton className="mt-4 px-6 py-2 bg-white text-gray-900 hover:bg-gray-100 text-sm md:text-base">
                    {allBanners[(currentIndex + 1) % allBanners.length].ctaText}
                  </PrimaryButton>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="prev-banner">
            <div className="absolute inset-0">
              <Image
                src={allBanners[currentIndex === 0 ? allBanners.length - 1 : currentIndex - 1].backgroundImage}
                alt="Previous Banner Image"
                fill
                priority={false}
                className="object-cover opacity-40"
                sizes="100vw"
                quality={90}
              />
            </div>
            <div className="relative max-w-7xl mx-auto px-12 sm:px-16 lg:px-24 py-10 md:py-16">
              <div className="max-w-3xl">
                <h1 className="text-2xl md:text-4xl font-bold mb-2 font-playfair">
                  {allBanners[currentIndex === 0 ? allBanners.length - 1 : currentIndex - 1].title}
        </h1>
                <p className="text-sm md:text-lg text-gray-200">
                  {allBanners[currentIndex === 0 ? allBanners.length - 1 : currentIndex - 1].subtitle}
                </p>
                <Link href={allBanners[currentIndex === 0 ? allBanners.length - 1 : currentIndex - 1].ctaLink}>
                  <PrimaryButton className="mt-4 px-6 py-2 bg-white text-gray-900 hover:bg-gray-100 text-sm md:text-base">
                    {allBanners[currentIndex === 0 ? allBanners.length - 1 : currentIndex - 1].ctaText}
          </PrimaryButton>
        </Link>
      </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .banner-container {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          
          .current-banner, .next-banner, .prev-banner {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transition: transform 0.5s ease-in-out;
          }
          
          .current-banner {
            transform: translateX(0);
            z-index: 10;
          }
          
          .next-banner {
            transform: translateX(100%);
            z-index: 5;
          }
          
          .prev-banner {
            transform: translateX(-100%);
            z-index: 5;
          }
          
          .slide-left .current-banner {
            transform: translateX(-100%);
          }
          
          .slide-left .next-banner {
            transform: translateX(0);
          }
          
          .slide-right .current-banner {
            transform: translateX(100%);
          }
          
          .slide-right .prev-banner {
            transform: translateX(0);
          }
        `}</style>

        {/* Ensure we always have a display even with no animation class */}
        <div className="relative py-10 md:py-16 opacity-0">
          {/* This is just a spacer div to maintain the height */}
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 font-playfair">
              {allBanners[currentIndex].title}
            </h1>
            <p className="text-sm md:text-lg">
              {allBanners[currentIndex].subtitle}
            </p>
            <div className="mt-4 px-6 py-2 inline-block">
              {allBanners[currentIndex].ctaText}
            </div>
          </div>
        </div>

        {/* Navigation buttons for banner slider */}
        {allBanners.length > 1 && (
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full px-4 flex justify-between z-30">
            <button 
              onClick={prevSlide}
              className="bg-white bg-opacity-50 rounded-full p-2 text-gray-800 hover:bg-opacity-70 transition-all"
              aria-label="Previous banner"
              disabled={animationClass !== ""}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="bg-white bg-opacity-50 rounded-full p-2 text-gray-800 hover:bg-opacity-70 transition-all"
              aria-label="Next banner"
              disabled={animationClass !== ""}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Dots indicator for banner slider */}
        {allBanners.length > 1 && (
          <div className="absolute bottom-4 w-full flex justify-center gap-2 z-30">
            {allBanners.map((_, index) => (
              <button 
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
                disabled={animationClass !== ""}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
    </div>  
    </div>
  )
} 