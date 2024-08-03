import React from 'react';
import '../../styles/styles.css';
interface LineComponentProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  pointsRequired: number;
  onClick: () => void;
}

const LineComponent: React.FC<LineComponentProps> = ({ fromX, fromY, toX, toY, pointsRequired, onClick }) => {
  const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
  const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);

  return (
    <div
      className="line-component"
      style={{
        position: 'absolute',
        left: `${fromX}px`,
        top: `${fromY}px`,
        width: `${length}px`,
        backgroundColor: 'gold',
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 0',
        borderBottom: '2px solid gold',
      }}
      onClick={onClick}
    >
      <div
        style={{
          position: 'absolute',
          left: `${length / 2}px`,
          top: '-10px',
          backgroundColor: 'silver',
          color: 'black',
          padding: '1px 3px',
          borderRadius: '3px',
          fontSize: '12px',
          zIndex: 1,
          transform: 'translateX(-50%)',
        }}
      >
        {pointsRequired}
      </div>
    </div>
  );
};

export default LineComponent;
