export function Stars() {
  // Create an array of star positions
  const stars = [
    { x: 10, y: 15 },
    { x: 25, y: 30 },
    { x: 40, y: 20 },
    { x: 60, y: 40 },
    { x: 75, y: 10 },
    { x: 90, y: 25 },
    { x: 15, y: 60 },
    { x: 35, y: 75 },
    { x: 55, y: 85 },
    { x: 80, y: 65 },
  ];

  return (
    <div className="fixed inset-0 opacity-20 pointer-events-none">
      {stars.map((star, index) => (
        <div 
          key={index}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(2px 2px at ${star.x}vw ${star.y}vh, white, transparent)`,
          }}
        />
      ))}
    </div>
  );
}
