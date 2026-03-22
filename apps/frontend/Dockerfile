# AŞAMA 1: Build (Vite)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx vite build

# AŞAMA 2: Yayın (Nginx) - Döküman Sayfa 10
FROM nginx:stable-alpine
# Vite'ın ürettiği dist klasörünü Nginx'e kopyala
COPY --from=builder /app/dist /usr/share/nginx/html
# SPA yapısı için 404 hatalarını index.html'e yönlendir (Fallback)
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]  