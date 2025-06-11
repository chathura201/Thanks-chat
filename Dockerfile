# Use official Node.js LTS image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install dependencies for canvas
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install npm packages
RUN npm install

# Copy all source files
COPY . .

# Expose port if needed (Telegram bot doesn't need this by default)
# EXPOSE 3000

# Start bot
CMD ["node", "bot.js"]
