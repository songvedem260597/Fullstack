import React from 'react';

interface LoadingProps {
  message?: string;
}

const LoadingComponent = ({ message = "Loading..." }) => {
  return (
    <div>
      {message}
    </div>
  );
};

export default LoadingComponent;
