import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const KidsMovieCard = ({ movie }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect if the device supports touch
  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  // Toggle flip/slide state
  const handleInteraction = () => setIsFlipped((prev) => !prev);

  // Animation variants for desktop (3D flip)
  const desktopVariants = {
    front: { rotateY: 0, opacity: 1 },
    back: { rotateY: 180, opacity: 1 },
  };

  // Animation variants for mobile (slide-up)
  const mobileVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="perspective-1000 cursor-pointer w-full max-w-[14rem] sm:max-w-[16rem] md:max-w-[18rem] mx-auto"
      onMouseEnter={!isTouchDevice ? () => setIsFlipped(true) : null} // Hover for desktop
      onMouseLeave={!isTouchDevice ? () => setIsFlipped(false) : null} // Hover for desktop
      onClick={isTouchDevice ? handleInteraction : null} // Tap for mobile
      whileHover={!isTouchDevice ? { scale: 1.05 } : {}} // Hover scale only for desktop
    >
      <motion.div
        className="relative w-full h-[20rem] sm:h-[22rem] md:h-[24rem] transform-style-3d"
        animate={isTouchDevice ? undefined : isFlipped ? "back" : "front"} // Desktop: 3D flip
        variants={desktopVariants}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front Side (Image) */}
        <motion.div
          className="absolute inset-0 backface-hidden rounded-xl shadow-2xl overflow-hidden"
          animate={isTouchDevice ? { opacity: 1 } : { opacity: isFlipped ? 0 : 1 }} // Always visible on mobile
        >
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Back Side (Details) */}
        {isTouchDevice ? (
          // Mobile: Slide-up panel
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gray-900 text-orange-500 p-3 sm:p-4 md:p-5 rounded-b-xl shadow-2xl flex flex-col items-center justify-center"
            initial="hidden"
            animate={isFlipped ? "visible" : "hidden"}
            variants={mobileVariants}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-center">
              {movie.title}
            </h3>
            <p className="text-xs sm:text-sm md:text-sm mb-1 sm:mb-2 text-center">{movie.genre}</p>
            <p className="text-xs sm:text-sm md:text-sm text-yellow-400 mb-2 sm:mb-4">
              IMDb: {movie.imdb}
            </p>
            <Link
              to={`/kids/${movie.id}`}
              className="bg-orange-500 text-white px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2 rounded-full font-semibold text-xs sm:text-sm md:text-base hover:bg-orange-600 transition-all"
              onClick={(e) => e.stopPropagation()} // Prevent tap from flipping back
            >
              Details
            </Link>
          </motion.div>
        ) : (
          // Desktop: 3D flip back side
          <motion.div
            className="absolute inset-0 bg-gray-900 text-orange-500 p-3 sm:p-4 md:p-5 rounded-xl shadow-2xl flex flex-col items-center justify-center backface-hidden"
            animate={{ opacity: isFlipped ? 1 : 0 }}
            style={{ transform: "rotateY(180deg)" }}
          >
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-center">
              {movie.title}
            </h3>
            <p className="text-xs sm:text-sm md:text-sm mb-1 sm:mb-2 text-center">{movie.genre}</p>
            <p className="text-xs sm:text-sm md:text-sm text-yellow-400 mb-2 sm:mb-4">
              IMDb: {movie.imdb}
            </p>
            <Link
              to={`/kids/${movie.id}`}
              className="bg-orange-500 text-white px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2 rounded-full font-semibold text-xs sm:text-sm md:text-base hover:bg-orange-600 transition-all"
            >
              Details
            </Link>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default KidsMovieCard;
