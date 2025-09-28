import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const CursorWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
`;

const CursorDot = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: var(--color-accent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
  box-shadow: 0 0 10px rgba(75, 207, 234, 0.7);
  z-index: 10000;
`;

const CursorTrail = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background-color: rgba(75, 207, 234, ${props => props.opacity});
  transform: translate(-50%, -50%);
  transition: transform 0.1s;
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 0 5px rgba(75, 207, 234, ${props => props.opacity});
`;

const CursorAnimation = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState([]);
  const trailLength = 15;

  useEffect(() => {
    const updateCursorPosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateCursorStyle = () => {
      const element = document.elementFromPoint(position.x, position.y);
      if (element) {
        const cursorStyle = window.getComputedStyle(element).cursor;
        setIsPointer(cursorStyle === 'pointer');
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updateCursorPosition);
    window.addEventListener('mousemove', updateCursorStyle);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      window.removeEventListener('mousemove', updateCursorStyle);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [position]);

  useEffect(() => {
    // Update trail positions
    setTrail(prevTrail => {
      // Add current position to the beginning
      const newTrail = [{ x: position.x, y: position.y, id: Date.now() }, ...prevTrail];
      // Limit trail length
      return newTrail.slice(0, trailLength);
    });

    // Update trail at a higher frequency for smoother animation
    const intervalId = setInterval(() => {
      setTrail(prevTrail => {
        if (prevTrail.length === 0) return prevTrail;
        return prevTrail.map((point, index) => {
          if (index === 0) return { ...point, x: position.x, y: position.y };
          return point;
        });
      });
    }, 10);

    return () => clearInterval(intervalId);
  }, [position]);

  return (
    <CursorWrapper>
      {trail.map((point, index) => (
        <CursorTrail
          key={point.id}
          style={{ left: point.x, top: point.y }}
          size={(trailLength - index) * 0.8}
          opacity={(trailLength - index) / (trailLength * 2)}
        />
      ))}
      <CursorDot
        style={{
          left: position.x,
          top: position.y,
          width: isPointer ? '16px' : isClicking ? '6px' : '8px',
          height: isPointer ? '16px' : isClicking ? '6px' : '8px',
          opacity: isClicking ? 0.8 : 1
        }}
      />
    </CursorWrapper>
  );
};

export default CursorAnimation;