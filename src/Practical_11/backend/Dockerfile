# Practical 11: Backend Dockerfile
FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Expose backend API port
EXPOSE 5000

# Start Express server
CMD ["node", "server.js"]
