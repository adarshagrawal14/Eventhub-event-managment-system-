  import React, { useState, useEffect } from "react";
  import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
  import { Link } from "react-router-dom";
  import "./EventSlider.css";

  const EventSlider = ({ events = [], autoPlay = true, intervalTime = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (events.length > 0) {
        setIsLoading(false); // Stop loading once events are available
      }
    }, [events]);

    const nextSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    };

    const prevSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
    };

    useEffect(() => {
      if (!autoPlay || events.length === 0) return;

      const interval = setInterval(nextSlide, intervalTime);
      return () => clearInterval(interval);
    }, [autoPlay, intervalTime, currentIndex, events.length]);

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };

    useEffect(() => {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const getSlideIndex = (index) => (index + events.length) % events.length;
    const defaultImage = "/assets/EventHubLogo12.png"; // Ensure this path is correct

    if (isLoading) {
      return <div className="loading-spinner">Loading...</div>; // Add a spinner while loading
    }

    if (events.length === 0) {
      return <div className="no-events-message">No events available.</div>;
    }

    return (
      <div className="event-slider-container">
        <button className="slider-arrow left" onClick={prevSlide}>
          <BsArrowLeft />
        </button>
        <div className="event-slider">
          {events.map((event, index) => {
            const position =
              index === currentIndex
                ? "active"
                : index === getSlideIndex(currentIndex - 1)
                ? "previous"
                : index === getSlideIndex(currentIndex + 1)
                ? "next"
                : "hidden";

            return (
              <div key={event._id || index} className={`slide ${position}`}>
                <Link to={`/event/${event._id || "#"}`}>
                  <img
                    src={
                      event.image
                        ? `http://localhost:4000/${event.image.replace("\\", "/")}`
                        : defaultImage
                    }
                    alt={event.title || "Event"}
                    className="event-slider-image"
                    loading="lazy" // Lazy load the images
                  />
                  {position === "active" && (
                    <p className="event-slider-title">{event.title || "Untitled Event"}</p>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
        <button className="slider-arrow right" onClick={nextSlide}>
          <BsArrowRight />
        </button>
      </div>
    );
  };

  export default EventSlider;
