import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  description?: string;
}

interface HeroBannerProps {
  banners: Banner[];
}

export default function HeroBanner({ banners }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fadeState, setFadeState] = useState("in");
  const timerRef = useRef<NodeJS.Timeout>();

  const navigateToBanner = (newIndex: number) => {
    if (isAnimating || newIndex === currentIndex || !banners.length) return;
    
    setIsAnimating(true);
    setFadeState("out");
    
    // Reset the timer when manually navigating
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setFadeState("in");
      setTimeout(() => {
        setIsAnimating(false);
        // Restart the timer after navigation
        startTimer();
      }, 500);
    }, 500);
  };

  const startTimer = () => {
    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Start new timer
    timerRef.current = setInterval(() => {
      const nextSlideIndex = (currentIndex + 1) % banners.length;
      if (!isAnimating && banners.length > 0) {
        navigateToBanner(nextSlideIndex);
      }
    }, 5000);
  };

  useEffect(() => {
    if (banners.length > 0) {
      startTimer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, isAnimating, banners]);

  const handleNextBanner = () => {
    const nextSlideIndex = (currentIndex + 1) % banners.length;
    navigateToBanner(nextSlideIndex);
  };

  const handlePrevBanner = () => {
    const prevSlideIndex = currentIndex === 0 ? banners.length - 1 : currentIndex - 1;
    navigateToBanner(prevSlideIndex);
  };

  const goToSpecificBanner = (index: number) => {
    navigateToBanner(index);
  };

  if (!banners.length) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-[380px] relative overflow-hidden">
          <div 
            key={currentIndex}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500 ease-in-out ${
              fadeState === "in" ? "opacity-100" : "opacity-0"
            }`}
            style={{ 
              backgroundImage: `url(${currentBanner.imageUrl})`,
              backgroundPosition: 'center 30%'
            }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
            
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
              <div className="text-center max-w-2xl">
                <h2 className="text-sm md:text-base font-accent uppercase tracking-wider mb-2">{currentBanner.subtitle}</h2>
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{currentBanner.title}</h1>
                <p className="text-lg md:text-xl mb-6 max-w-xl mx-auto">{currentBanner.description}</p>
                <a 
                  href={currentBanner.buttonLink} 
                  className="bg-primary text-white px-6 py-3 rounded-full font-accent hover:bg-primary/90 transition-colors inline-block"
                >
                  {currentBanner.buttonText}
                </a>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handlePrevBanner} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-20 transition-colors"
            aria-label="Previous banner"
            disabled={isAnimating}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={handleNextBanner} 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-20 transition-colors"
            aria-label="Next banner"
            disabled={isAnimating}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSpecificBanner(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to banner ${index + 1}`}
                disabled={isAnimating}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}