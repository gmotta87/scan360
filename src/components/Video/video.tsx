import React from 'react';

// Define the props type for TypeScript
type VideoComponentProps = {
  videoSrc: string;
};

const VideoComponent: React.FC<VideoComponentProps> = ({ videoSrc }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center', // Center horizontally
      alignItems: 'center', // Center vertically
      height: '100vh', // Set the height of the div to full viewport height or as needed
      width: '100%', // Ensure the div takes the full width of its parent
    }}>
      <video autoPlay muted loop playsInline className="swiper-background-video" style={{
        maxWidth: '100%', // Ensure the video does not exceed the width of its container
        maxHeight: '100vh', // Optional: Restrict the video's maximum height to the viewport height
      }}>
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoComponent;
