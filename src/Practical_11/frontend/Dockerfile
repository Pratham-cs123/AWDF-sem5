# Practical 11: Frontend Multi-Stage Dockerfile
FROM node:18 AS build

WORKDIR /app

# Copy package descriptors and install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source code and compile production bundle
COPY . .
RUN npm run build

# Expose Vite preview port
EXPOSE 5173

# Serve built production assets with host binding
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
