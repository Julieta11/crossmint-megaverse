# Megaverse Creation Challenge Solution

Welcome to my solution for the Crossmint coding challenge. I've crafted a unique Megaverse-- a captivating 2D space teeming with celestial wonders like 🪐POLYanets, 🌙SOLoons, and ☄comETHs.

## Table of Contents

- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Dependencies](#dependencies)
- [Automated Testing](#automated-testing)

## Getting Started

To dive into the Megaverse creation process, follow these steps:

1. Clone the repository to your local machine.
2. Install Dependencies
Navigate to the cloned repository directory and install the necessary dependencies by running:

```bash
npm install
```
This ensures that all required packages and modules are properly installed.

3. Set up Docker Environment
Set up the Docker environment for containerized execution. Ensure Docker is installed on your machine and run the following command to build the Docker image:

```bash
make build
```
This command creates the Docker image with the required configuration for the Megaverse creation process.

4. Execute Megaverse Creation
Once the Docker image is successfully built, execute the Megaverse creation process by running:

```bash
make run
```

## API Endpoints
Once the Megaverse is up and running, you can interact with the following API endpoints:

Create Megaverse:
```
Endpoint: http://localhost:3000/api/createMegaverse
Method: POST
```

Empty Megaverse:
```
Endpoint: http://localhost:3000/api/emptyMegaverse
Method: DELETE
```

These endpoints allow you to perform specific actions within the Megaverse environment. Make sure to use the appropriate HTTP methods when interacting with each endpoint.

## Folder Structure

The repository follows a structured layout for better organization:

- **src**: Contains the source code.
  - **interfaces**: Holds API and utility interfaces.
  - **utils**: Holds utility functions for Megaverse creation.
  - **controllers**: Holds the router and the correspongin handler functions.
  - **middlewares**: Contains the erroHandler logic.
  - **services**: Holds the whole create a megaverse process.
  - **index.ts**: Entry point for the Megaverse creation.
- **test**: Includes automated tests for validation.

## Dependencies

Ensure the following dependencies are installed before running the solution:

- [Node.js](https://nodejs.org/): JavaScript runtime for executing scripts.
- [npm](https://www.npmjs.com/): Node.js package manager for installing dependencies.
- [Docker](https://www.docker.com/): Containerization platform for consistent execution.
- [Make](https://www.gnu.org/software/make/): Build automation tool for simplified execution.

## Automated Testing

The repository includes automated tests to validate the functionality of the Megaverse creation process. Run tests using `make test`.
