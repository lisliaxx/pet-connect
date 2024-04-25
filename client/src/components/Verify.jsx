import { useEffect, useState } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { useNavigate } from "react-router-dom";

export default function Verify() {
    const navigate = useNavigate();
    const token = useAuthToken();
    const [status, setStatus] = useState('Verifying...'); // Status message for user feedback
    console.log("Sending token:", token);

    useEffect(() => {
        async function verifyToken() {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/verify`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    // If the server responds with a bad status, handle it as an error
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const user = await response.json();

                if (user && user.auth0Id) {
                    navigate("/home");
                } else {
                    setStatus('Failed to verify. Please login again.');
                    // Optionally redirect to login or handle according to your flow
                }
            } catch (error) {
                console.error("Verification failed:", error);
                setStatus(`Verification error: ${error.message}`);
                // Optionally navigate to an error page or login page
            }
        }

        if (token) {
            verifyToken();
        } else {
            setStatus('No token found, please login.');
            // Optionally navigate to login page
        }
    }, [token, navigate]);

    return <div>{status}</div>; // Display current status to the user
}
