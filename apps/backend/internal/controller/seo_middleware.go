package controller

import (
	"strings"
	"github.com/gofiber/fiber/v2"
	"log"
)

func PrerenderMiddleware(c *fiber.Ctx) error {
	userAgent := strings.ToLower(string(c.Request().Header.UserAgent()))
	
	// Yaygın arama motoru botları
	botAgents := []string{"googlebot", "bingbot", "yandexbot", "baiduspider", "twitterbot"}
	
	isBot := false
	for _, bot := range botAgents {
		if strings.Contains(userAgent, bot) {
			isBot = true
			break
		}
	}

	if isBot {
		// Bot tespit edildiğinde yapılacak işlem (Sayfa 12'deki mantık)
		c.Set("X-Prerender-Bot", "true")
		log.Printf("SEO Botu Tespit Edildi: %s", userAgent)
		// Gerçek senaryoda burada Prerender.io gibi bir servise proxy yapılır.
	}

	return c.Next()
}