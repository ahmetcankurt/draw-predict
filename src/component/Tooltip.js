import React, { useState, useEffect, memo } from 'react';

const CustomTooltip = ({
  content,
  position = 'top',
  color = '#fff',
  backgroundColor = '#000',
  width = '120px',
  height = 'auto',
  borderRadius = '4px',
  fontSize = '12px',
  children,
  showAlways = false, // Tooltip'in her zaman gösterilmesi için bir prop
  isSwitchOn = false, // Switch durumu
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Eğer showAlways true ise ve isSwitchOn false ise, tooltip'i görünür yap
    if (showAlways && !isSwitchOn) {
      setIsVisible(true);
    } else if (showAlways && isSwitchOn) {
      setIsVisible(false);
    }
  }, [showAlways, isSwitchOn]);

  const tooltipStyle = {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
    padding: '3px',
  };

  const tooltipContentStyle = {
    visibility: isVisible ? 'visible' : 'hidden',
    backgroundColor: backgroundColor,
    color: color,
    textAlign: 'center',
    padding: '8px',
    borderRadius: borderRadius,
    position: 'absolute',
    zIndex: 1,
    width: width,
    height: height,
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    fontSize: fontSize,
  };

  const arrowStyle = {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  };

  const positionStyles = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: '8px',
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: '8px',
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginRight: '8px',
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: '8px',
    },
  };

  const arrowPositionStyles = {
    top: {
      borderWidth: '8px 8px 0 8px',
      borderColor: `${backgroundColor} transparent transparent transparent`,
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    bottom: {
      borderWidth: '0 8px 8px 8px',
      borderColor: `transparent transparent ${backgroundColor} transparent`,
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    left: {
      borderWidth: '8px 0 8px 8px',
      borderColor: `transparent transparent transparent ${backgroundColor}`,
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    right: {
      borderWidth: '8px 8px 8px 0',
      borderColor: `transparent ${backgroundColor} transparent transparent`,
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
    },
  };

  return (
    <div
    className=''
      style={tooltipStyle}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => {
        if (!showAlways) setIsVisible(false);
      }}
    >
      {children}
      <div style={{ ...tooltipContentStyle, ...positionStyles[position] }}>
        {content}
        <div style={{ ...arrowStyle, ...arrowPositionStyles[position] }} />
      </div>
    </div>
  );
};

export default  memo(CustomTooltip);