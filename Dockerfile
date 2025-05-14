FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . ./

# Accept VITE_URL_PATH as a build argument
ARG VITE_URL_PATH
ENV VITE_URL_PATH=${VITE_URL_PATH}

# Build the frontend
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]