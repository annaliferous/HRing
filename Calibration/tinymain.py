from machine import Pin, PWM
import time

# Servo Setup for TINY2040
# Using GPIO pins 0 and 1 (good PWM pins on TINY2040)
servo1 = PWM(Pin(0))
servo2 = PWM(Pin(1))
servo1.freq(50)
servo2.freq(50)

def set_servo_angle(servo, angle):
    # Begrenze Winkel auf 0-180
    angle = max(0, min(180, angle))
    # Berechne Pulslänge: 1ms (0°) bis 2ms (180°)
    pulse_width = 1000000 + (angle * 1000000 // 180)
    servo.duty_ns(pulse_width)
    return angle

# Initialisiere Servos auf Mittelposition
set_servo_angle(servo1, 90)
set_servo_angle(servo2, 90)
print("TINY2040 ready! Send angles 0-180")

while True:
    try:
        # Lies eine Zeile von der seriellen Schnittstelle
        line = input().strip()
        
        if line:
            try:
                angle = int(line)
                print(f"Received angle: {angle}")
                
                # Bewege beide Servos
                actual_angle1 = set_servo_angle(servo1, angle)
                actual_angle2 = set_servo_angle(servo2, angle)
                
                print(f"Servos moved to {actual_angle1} degrees")
                
            except ValueError:
                print(f"Error: '{line}' is not a valid number")
                
    except EOFError:
        # Keine Eingabe verfügbar
        time.sleep(0.01)
    except KeyboardInterrupt:
        print("Stopping...")
        break
    except Exception as e:
        print(f"Error: {e}")
        time.sleep(0.1)