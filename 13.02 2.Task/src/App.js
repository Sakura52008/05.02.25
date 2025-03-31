import React, { useEffect, useState, useRef } from 'react';

const ShapeNinja = () => {
  const [shapes, setShapes] = useState([]);
  const [score, setScore] = useState(0);
  const [isCutting, setIsCutting] = useState(false);
  const [knifeTrail, setKnifeTrail] = useState([]);
  const gameRef = useRef(null);

  const shapeTypes = ['square', 'circle', 'triangle'];
  const colors = ['red', 'blue', 'yellow', 'purple', 'orange'];

  const spawnShape = () => {
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 50;
    const x = Math.random() * 80 + 10; 
    const velocityY = -(Math.random() * 1.5 + 1.5);
    const velocityX = (Math.random() - 0.5) * 0.5;

    setShapes((prev) => [
      ...prev,
      {
        id: Math.random(),
        type,
        color,
        x,
        y: 300,
        size,
        velocityY,
        velocityX,
        isSplit: false,
        isFalling: false,
        isDead: false,
      },
    ]);
  };

  const handleMouseMove = (e) => {
    const rect = gameRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isCutting) {
      setKnifeTrail((prev) => [...prev, { x: mouseX, y: mouseY }].slice(-10));

      setShapes((prevShapes) =>
        prevShapes.flatMap((shape) => {
          if (shape.isSplit || shape.isDead) return [shape];

          const shapeCenterX = (shape.x / 100) * rect.width + shape.size / 2;
          const shapeCenterY = shape.y + shape.size / 2;

          const hit =
            mouseX > shapeCenterX - shape.size / 2 &&
            mouseX < shapeCenterX + shape.size / 2 &&
            mouseY > shapeCenterY - shape.size / 2 &&
            mouseY < shapeCenterY + shape.size / 2;

          if (hit) {
            setScore((prevScore) => prevScore + 2);

            const halfSize = shape.size / 2;
            return [
              {
                ...shape,
                id: Math.random(),
                size: halfSize,
                x: shape.x,
                y: shape.y,
                velocityX: -1,
                velocityY: 1,
                isSplit: true,
                isFalling: true,
              },
              {
                ...shape,
                id: Math.random(),
                size: halfSize,
                x: shape.x + (halfSize / rect.width) * 100,
                y: shape.y,
                velocityX: 1,
                velocityY: 1,
                isSplit: true,
                isFalling: true,
              },
            ];
          }

          return [shape];
        })
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(spawnShape, 1500);

    const animate = () => {
      setShapes((prev) =>
        prev
          .map((shape) => {
            const isRising = shape.velocityY < 0;
            const isAtPeak = shape.y <= 100;

            const newVelocityY =
              isAtPeak && isRising && !shape.isFalling
                ? Math.abs(shape.velocityY)
                : shape.velocityY;

            return {
              ...shape,
              y: shape.y + newVelocityY,
              x: shape.x + shape.velocityX,
              velocityY: shape.isFalling ? shape.velocityY + 0.1 : newVelocityY,
            };
          })
          .filter((shape) => shape.y < 300)
      );

      requestAnimationFrame(animate);
    };

    animate();

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#013220',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        ref={gameRef}
        onMouseDown={() => setIsCutting(true)}
        onMouseUp={() => {
          setIsCutting(false);
          setKnifeTrail([]);
        }}
        onMouseMove={handleMouseMove}
        style={{
          backgroundColor: '#0a3312',
          position: 'relative',
          width: '60%',
          height: '60vh',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid #0f0',
          cursor: 'crosshair',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: 'white',
            fontSize: '20px',
          }}
        >
          Фигурный ниндзя брат
        </div>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: 'white',
            fontSize: '20px',
          }}
        >
          Очки: {score}
        </div>
        {shapes.map((shape) => (
          <div
            key={shape.id}
            style={{
              position: 'absolute',
              left: `${shape.x}%`,
              top: `${shape.y}px`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              backgroundColor: shape.color,
              clipPath:
                shape.type === 'circle'
                  ? 'circle(50%)'
                  : shape.type === 'triangle'
                  ? 'polygon(50% 0, 0 100%, 100% 100%)'
                  : 'none',
              opacity: shape.isSplit ? 0.9 : 1,
            }}
          />
        ))}
        {knifeTrail.map((point, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${point.x}px`,
              top: `${point.y}px`,
              width: '12px',
              height: '12px',
              backgroundColor: 'white',
              borderRadius: '50%',
              opacity: (index + 1) / knifeTrail.length,
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ShapeNinja;
