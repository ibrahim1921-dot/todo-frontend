const getApiUrl = () => {
    // check if we are in production or development
    if(import.meta.env.PROD) {
        return (
          import.meta.env.VITE_API_URL_PROD ||
          "https://todo-backend-nsrf.onrender.com"
        );
    }

    return (
      import.meta.env.VITE_API_URL|| "http://localhost:5000"
    );
}

export const API_URL = getApiUrl();

//Log the API URL for debugging purposes in development mode
if(import.meta.env.DEV) {
    console.log("API URL:", API_URL);
}

export const API_NAME = "Task Management API";
export const APP_VERSION = "1.0.0";