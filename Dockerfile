FROM node:18-slim

# Install Python and pip
RUN apt-get update || : && apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy application files
COPY . .

# Install Python dependencies
# Using --break-system-packages is necessary in newer Debian-based images (like node:slim)
# or we could use a venv, but for a simple container, this is often acceptable.
# Alternatively, create a virtual environment.
RUN pip3 install -r requirements.txt --break-system-packages || pip3 install -r requirements.txt

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
