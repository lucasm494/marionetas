import { useState, useRef } from 'react';
import './Carousel.css';

function Carousel({ items = [], onItemSelect, type = 'items', onAddNew }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const scrollToIndex = (index) => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const itemWidth = scrollWidth / items.length;
      carouselRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
    }
    setCurrentIndex(index);
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const itemWidth = carouselRef.current.scrollWidth / items.length;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    }
  };

  const nextItem = () => {
    const nextIndex = (currentIndex + 1) % items.length;
    scrollToIndex(nextIndex);
  };

  const prevItem = () => {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    scrollToIndex(prevIndex);
  };

  return (
    <div className="carousel">
      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button className="carousel-arrow carousel-arrow-prev" onClick={prevItem}>
            ‹
          </button>
          <button className="carousel-arrow carousel-arrow-next" onClick={nextItem}>
            ›
          </button>
        </>
      )}

      {/* Carousel Items */}
      <div 
        className="carousel-container"
        ref={carouselRef}
        onScroll={handleScroll}
      >
        {type === 'items' ? (
          // Items Carousel (for clothing, objects, etc.)
          <>
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="carousel-item"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify(item));
                }}
                title={item.name}
              >
                <div className="item-preview">
                  {item.emoji || '👕'}
                </div>
                <span className="item-name">{item.name}</span>
              </div>
            ))}
          </>
        ) : (
          // Management Carousel (for created characters/scenarios)
          <>
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="carousel-item management-item"
                onClick={() => onItemSelect(item)}
              >
                <div className="item-preview">
                  {item.emoji || '👤'}
                </div>
                <span className="item-name">{item.name}</span>
              </div>
            ))}
            {/* Add New Button */}
            <div 
              className="carousel-item add-new-item"
              onClick={onAddNew}
            >
              <div className="item-preview">
                +
              </div>
              <span className="item-name">
                {type === 'characters' ? 'New Character' : 'New Scenario'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className="carousel-dots">
          {items.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Carousel;