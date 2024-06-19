#include <pwmWrite.h>
//#include <WiFi.h>

Pwm pwm = Pwm();

const int servoPin1 = 1;
const int servoPin2 = D2;
const int servoPin3 = D3;

int valueposition;

void setup()
{

  Serial.begin(9600);
}

void loop()
{

  // Check to see if Serial data is being received
  if (Serial.available() > 0)
  {

    // Create a new string variable to receive Serial data
    String receivedString = "";

    // Loop through received data and append to the receivedString variable
    while (Serial.available() > 0)
    {
      receivedString += char(Serial.read());
    }

    // Print received Serial data
    int value = receivedString.toInt();

    pwm.writeServo(servoPin, value);
    //pwm.writeServo(servoPin2, value);
  }
}
