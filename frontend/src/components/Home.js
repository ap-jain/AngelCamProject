import React from 'react';
import { useToken } from '../TokenContext'; // Import the useToken hook

const Home = () => {
  const { token, userData } = useToken(); // Get the token and userData from context

  return (
    <div>      
    </div>
  );
};

export default Home;
