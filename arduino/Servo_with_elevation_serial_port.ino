/*
  Controls servo position from 0-180 degrees and back
  https://wokwi.com/projects/350037178957431378
  by dlloydev, December 2022.
*/

#include <pwmWrite.h>
#include <WiFi.h>

Pwm pwm = Pwm();

const int servoPin = D1;
const int servoPin2 = D2;

//const char* ssid     = "iPhone von Bilel";
//const char* password = "6bfabuw7jetsg";

void setup() {
    //Serial.begin(115200);
    //delay(10);
 
    // We start by connecting to a WiFi network
 
    //Serial.println();
    //Serial.println();
    //Serial.print("Connecting to ");
    //Serial.println(ssid);
 
    //WiFi.begin(ssid, password);
 
    //while (WiFi.status() != WL_CONNECTED) {
        //delay(500);
        //Serial.print(".");
    //}
 
    //Serial.println("");
    //Serial.println("WiFi connected");
    //Serial.println("IP address: ");
    //Serial.println(WiFi.localIP());
    Serial.begin(9600);
  
}

void loop() {
  //for (int pos = 0; pos <= 180; pos++) {  // go from 0-180 degrees
    //pwm.writeServo(servoPin, pos);
    //pwm.writeServo(servoPin2, pos);        // set the servo position (degrees)
    //delay(15);
  //}
  //for (int pos = 180; pos >= 0; pos--) {  // go from 180-0 degrees
    //pwm.writeServo(servoPin, pos); 
    //pwm.writeServo(servoPin2, pos);       // set the servo position (degrees)
    //delay(15);
  //}

   // CHeck to see if Serial data is being received
  if (Serial.available() > 0) {
    
    // Create a new string variable to receive Serial data
    String receivedString = "";
    
    // Loop through received data and append to the receivedString variable
    while (Serial.available() > 0) {
      receivedString += char(Serial.read ());
    }
    
    // Print received Serial data
    Serial.println(receivedString); 
    
    int value=receivedString.toInt();
    value=map(value, 0, 1023, 0, 180);
    while(value==0)  
    {}
    //for (int pos = 0; pos <= value; pos++) {  // go from 0-180 degrees
       pwm.writeServo(servoPin, value);
       pwm.writeServo(servoPin2, value);        // set the servo position (degrees)
    
    //}

    //if(receivedString == "10")
       //for (int pos = 0; pos <= 180; pos++) {  // go from 0-180 degrees
       //pwm.writeServo(servoPin, pos);
       //pwm.writeServo(servoPin2, pos);        // set the servo position (degrees)
       //delay(15);
  //}  
   // else
   //   Serial.println("No data recieved");
  }
 
  //give input 
  //Serial.println("enter a Value");
  //while(Serial.available()==0)
  //{}
  //int pos=Serial.parseInt();
  //pwm.writeServo(servoPin, pos);
  //pwm.writeServo(servoPin2, pos);
 // while(1);

}
