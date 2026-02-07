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
    <Box 
      className="slider-container" 
      sx={{ 
        position: 'relative', 
        overflow: 'hidden', 
        width: '100%', 
        maxWidth: '100%',
        mx: 'auto',
        height: { xs: '200px', sm: '300px', md: '400px' }
      }}
    >
      <Box 
        className="slider-image" 
        component="img" 
        src={images[currentIndex]} 
        alt={`Slide ${currentIndex}`} 
        sx={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          display: 'block'
        }}
      />

      <Box className="slider-controls" sx={{ 
        position: 'absolute', 
        top: '50%', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        transform: 'translateY(-50%)',
        px: 2
      }}>
        <IconButton 
          className="prev-btn" 
          onClick={goToPrevious}
          sx={{ 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.7)',
            }
          }}
        >
          <NavigateBeforeIcon style={{ fontSize: 30 }} />
        </IconButton>
        <IconButton 
          className="next-btn" 
          onClick={goToNext}
          sx={{ 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.7)',
            }
          }}
        >
          <NavigateNextIcon style={{ fontSize: 30 }} />
        </IconButton>
      </Box>

      <Box className="dots-container" sx={{ 
        position: 'absolute', 
        bottom: 10, 
        left: 0, 
        right: 0, 
        display: 'flex', 
        justifyContent: 'center',
        gap: 1
      }}>
        {images.slice(0, 9).map((_, index) => (  // Limit to first 9 images for dots
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active-dot' : ''}`}
            onClick={() => goToSlide(index)}
            style={{
              height: '15px',
              width: '15px',
              margin: '0 5px',
              backgroundColor: index === currentIndex ? '#717171' : '#bbb',
              borderRadius: '50%',
              display: 'inline-block',
              cursor: 'pointer'
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Slider;