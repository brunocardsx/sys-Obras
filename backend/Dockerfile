# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY backend/package.json ./backend/

# Install dependencies
RUN yarn install --frozen-lockfile
RUN cd backend && npm install

# Copy source code
COPY . .

# Build backend
RUN cd backend && npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
