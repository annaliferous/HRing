#include <Servo.h>

Servo myservo1;  // create servo object to control a servo
Servo myservo2;
int pos1 = 0;    // variable to store the servo position
int pos2 = 0;

void setup() {
  Serial.begin(115200);
  myservo1.attach(0);  // attaches the servo on pin 0 to the servo object
  myservo1.write(0);   // initialize servo position
  myservo2.attach(1);  // attaches the servo on pin 1 to the servo object
  myservo2.write(0);   // initialize servo position
}
void loop() {
  if (Serial.available() > 0) {
    String valueString = Serial.readStringUntil('\n');
    pos1 = valueString.toInt();
    pos2 = valueString.toInt(); //360 - pos1
    myservo1.write(pos1); // set the servo position
    myservo2.write(pos2); // set the servo position


    //delay(10); so the motors move together
    
 
  }
}