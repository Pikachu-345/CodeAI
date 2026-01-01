FROM node:20-alpine

# Install basic tools for building (Python/Make for some npm packages)
RUN apk add --no-cache python3 make g++ git bash

# Set work directory
WORKDIR /app

# Expose the standard React/Vite port
EXPOSE 5173

CMD ["tail", "-f", "/dev/null"]