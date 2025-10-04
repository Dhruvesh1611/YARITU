# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first to take advantage of Docker's cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port that your app will run on
EXPOSE 3000

# Set environment variables for Redis (adjust according to your setup)
ENV REDIS_HOST=your-redis-host
ENV REDIS_PORT=6379

# Define the command to run your Node.js app
CMD ["npm", "start"]
