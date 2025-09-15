#include <Servo.h>

// Define the pins for the servos
const int servoPin1 = 0; // Change to the pin you've connected the first servo to
const int servoPin2 = 1; // Change to the pin you've connected the second servo to

Servo servo1; // Create servo object to control the first servo
Servo servo2; // Create servo object to control the second servo

void setup() {
  servo1.attach(servoPin1); // Attaches the first servo on pin 0 to the servo1 object
  servo2.attach(servoPin2); // Attaches the second servo on pin 1 to the servo2 object
}

void loop() {
  // Rotate servos from 0 to 180 degrees
  for (int angle = 0; angle <= 180; angle += 10) {
    servo1.write(angle); // Tell the first servo to go to the specified angle
    servo2.write(angle); // Tell the second servo to go to the specified angle
    delay(1000); // Wait for servos to reach the position
  }
  
  // Rotate servos from 180 to 0 degrees
  for (int angle = 180; angle >= 0; angle -= 10) {
    servo1.write(angle); // Tell the first servo to go to the specified angle
    servo2.write(angle); // Tell the second servo to go to the specified angle
    delay(1000); // Wait for servos to reach the position
  }
}
