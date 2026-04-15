# Real-Time Chat Application

This is a real-time chat application built using Node.js and Socket.io. It allows users to send and receive messages instantly.

## Features

*   **Real-Time Communication:** Uses Socket.io to enable bidirectional, real-time event-based communication between clients and the server.
*   **Instant Messaging:** Users can send text messages that appear instantly on other users' screens.

## Project Structure

The project currently contains a `backend` directory which holds the server-side code.

*   `backend/`: Contains the Node.js backend code, package configurations, and environment variables.

## Getting Started

### Prerequisites

*   Node.js installed on your machine.
*   npm (Node Package Manager).

### Installation

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install all dependencies:
    ```bash
    npm install
    ```

### Running the Application

1.  Ensure you have created a `.env` file in the `backend` directory with the necessary configurations.
2.  Start the backend server:
    ```bash
    npm start
    ```
    (Or `npm run dev` if a development script is configured in `package.json`).

## Technologies Used

*   **Node.js:** JavaScript runtime environment.
*   **Socket.io:** For real-time functionality.
*   **Express:** (Expected) web framework for Node.js.
