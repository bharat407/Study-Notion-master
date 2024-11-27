import React, { useEffect, useState } from "react";
import { ratingsEndpoints } from "../../../services/apis";
import { apiConnector } from "../../../services/apiConnector";
import RatingStars from "../../common/RatingStars";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const RatingSlider = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const getReviews = async () => {
      setLoading(true);
      try {
        const res = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );
        setReviews(res.data.data);
        console.log("LOGGING REVIEWS", res);
      } catch (error) {
        console.log("LOGGING Review ERROR", error);
      } finally {
        setLoading(false);
      }
    };
    getReviews();
  }, []);

  useEffect(() => {
    const autoSlideInterval = setInterval(() => {
      if (!isTransitioning && !loading) {
        goToNext();
      }
    }, 3000);

    return () => clearInterval(autoSlideInterval);
  }, [currentIndex, isTransitioning, loading]);

  const goToSlide = (index) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToPrevious = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) =>
        prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Calculate visible slides based on screen width
  const getVisibleSlides = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }
    return 1;
  };

  const renderSkeletons = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-2"
        >
          <div className="bg-richblack-800 p-4 rounded-lg h-[150px]">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton circle width={36} height={36} />
              <div className="flex-1">
                <Skeleton height={20} width="60%" />
                <Skeleton height={16} width="40%" />
              </div>
            </div>
            <Skeleton count={2} />
            <div className="mt-2">
              <Skeleton width={100} />
            </div>
          </div>
        </div>
      ));
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="flex overflow-hidden gap-4">{renderSkeletons()}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8">
      {/* Main slider container */}
      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${
              currentIndex * (100 / getVisibleSlides())
            }%)`,
          }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-2"
            >
              <div className="flex flex-col gap-3 min-h-[150px] bg-richblack-800 p-3 text-[14px] text-richblack-25 rounded-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={review?.user?.image}
                    alt="user"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-richblack-5">
                      {review?.user?.firstName} {review?.user?.lastName}
                    </h3>
                    <p className="text-[12px] font-medium text-richblack-500">
                      {review?.course?.courseName}
                    </p>
                  </div>
                </div>
                <div className="font-medium text-richblack-25">
                  {review?.review?.slice(0, 70)}...
                </div>
                <RatingStars Review_Count={review?.rating} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-richblack-600 hover:bg-richblack-900 rounded-full p-2 ml-2 transition-colors z-10"
        disabled={isTransitioning}
      >
        <svg
          className="w-6 h-6 text-richblack-25"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-richblack-600 hover:bg-richblack-900 rounded-full p-2 mr-2 transition-colors z-10"
        disabled={isTransitioning}
      >
        <svg
          className="w-6 h-6 text-richblack-25"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots navigation */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-richblack-5" : "bg-richblack-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default RatingSlider;
