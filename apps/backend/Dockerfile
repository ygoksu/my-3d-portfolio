# AŞAMA 1: Derleme (Build)
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# Statik binary derle (Döküman Sayfa 10 - Alpine uyumlu)
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/main.go

# AŞAMA 2: Çalıştırma (Run)
FROM alpine:latest
WORKDIR /root/
# Sadece derlenmiş dosyayı kopyala (Boyut optimizasyonu)
COPY --from=builder /app/main .
EXPOSE 3000
CMD ["./main"]
