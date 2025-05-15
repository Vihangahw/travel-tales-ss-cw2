# TravelTales App
## Description
TravelTales is a web application where users can share and explore travel experiences. It allows users to create, edit, and search blog posts about their travels, including country details fetched directly from the RestCountries API. The app features a React frontend and an Express backend, running in Docker containers.
## Prerequisites

- **Docker**: Ensure Docker and Docker Compose are installed on your system.
- **Node.js**: Required for local development (optional if using Docker).
- **Internet Access**: Needed to fetch country data from the RestCountries API.

## Setup Instructions

**Clone the Repository:**

    git clone https://github.com/Vihangahw/travel-tales-ss-cw2.git
    cd travel-tales-ss-cw2


**Set Up Environment Variables:**

- Create a backend/.env file with:
    ```
    JWT_SECRET=secretkeyman
    NODE_ENV=development
**Run the App:**

Start the Docker containers: 

    docker-compose up --build


## Accessing the App

- **Frontend**: http://localhost:5174
- **Backend**: http://localhost:4000

## Stopping the App

Stop the Docker containers:
```
docker-compose down
