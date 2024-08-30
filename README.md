# Synchronium

**Synchronium** is a full-featured social media platform built using the MERN stack. It enables users to securely authenticate with JWT, interact through posts, and receive real-time notifications. The platform leverages React Query for efficient data fetching, ensuring a seamless user experience. Tailored for scalability and performance.

Check it out here: https://synchronium.onrender.com/

## Table of Contents

-   [Features](#features)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Run the application](#run-the-application)
-   [Contributing](#contributing)

## Features

-   **Modular Design:** Architected a modular and reusable component structure, facilitating easy maintenance, scalability, and future development.
-   **User Authentication:** Secure authentication using JWT for login and registration.
-   **Robust Notification System:** Developed a real-time notification system to boost user engagement and interaction within the platform.
-   **Responsive Design:** Mobile-friendly interface for a seamless experience on any device.

## Prerequisites

Make sure you have the following installed on your machine:

-   Node.js (v14 or later)
-   MongoDB (local or cloud instance)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Faraz-Ansari/synchronium
    cd synchronium
    ```

2. Install dependencies for both client and server:

    ```bash
    npm install

    cd frontend
    npm install
    ```

3. Create a `.env` file in the `api` directory and add the following:

    ```
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_clodinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

## Run the application

1. Start the backend server:

    ```bash
    npm start
    ```

2. Start the frontend server:

    ```bash
    cd frontend
    npm start
    ```

3. Open your browser and navigate to `http://localhost:5173`.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure your code adheres to the project's coding standards.
