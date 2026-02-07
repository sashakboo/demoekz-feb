import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Slider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isAutoPlay) {
      interval = setInterval(() => {
        goToNext();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlay, currentIndex]);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <Box className="slider-container">
      <Box className="slider-image" component="img" src={images[currentIndex]} alt={`Slide ${currentIndex}`} />
      
      <Box className="slider-controls">
        <IconButton className="prev-btn" onClick={goToPrevious}>
          <NavigateBeforeIcon style={{ fontSize: 30 }} />
        </IconButton>
        <IconButton className="next-btn" onClick={goToNext}>
          <NavigateNextIcon style={{ fontSize: 30 }} />
        </IconButton>
      </Box>
      
      <Box className="dots-container">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active-dot' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Slider;