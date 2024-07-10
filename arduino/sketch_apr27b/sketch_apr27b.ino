#include <WiFi.h>
#include <WebServer.h>
#include <WebSocketsServer.h>



const char* ssid = "eduroam";
const char* password = "W3fD4mIwtbI4Tp";

void setup() {
  // Start Serial
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Connected to Wi-Fi");
