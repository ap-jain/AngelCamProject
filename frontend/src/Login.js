import React, { useState } from "react";
import AxiosInstance from "./components/Axios";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { useToken } from "./TokenContext"; // Import the useToken hook

function Login() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { saveToken } = useToken();
  const { saveCameraData } = useToken();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await AxiosInstance.post("authenticate/", {
        token,
      });
      if (response.status === 200) {
        saveToken(token, {
          firstName: response.data.first_name,
          lastName: response.data.last_name,
        });
        const cameras = await AxiosInstance.post("cameras/", {
          token,
        });
        saveCameraData({
          totalCamerasCount: cameras.data.results.length,
          cameras: cameras.data.results,
        });

        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="info">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Token : </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;
