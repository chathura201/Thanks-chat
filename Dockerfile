# Install build tools + dependencies for canvas & node-gyp
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install npm packages
RUN npm install --unsafe-perm

# Copy rest of the source code
COPY . .

# Start bot
CMD ["node", "bot.js"]
