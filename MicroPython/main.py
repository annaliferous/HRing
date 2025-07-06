import sys
from machine import Pin, PWM

SERVO_MIN = 1000
SERVO_MAX = 2000

servo1 = PWM(Pin(0))
servo2 = PWM(Pin(1))
servo1.freq(50)
servo2.freq(50)

def map_value(value, in_min, in_max, out_min, out_max):
    return int((value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)

def set_servo_position(servo, position):
    pulse_width = map_value(position, 0, 180, SERVO_MIN, SERVO_MAX)
    servo.duty_ns(pulse_width * 1000)
    return pulse_width

# Initialize servo positions
set_servo_position(servo1, 0)
set_servo_position(servo2, 0)

while True:
    try:
        value_string = sys.stdin.readline().strip()
        if value_string:  # Only process if we received something
            pos1 = int(value_string)
            pos2 = int(value_string)
            
            if 0 <= pos1 <= 180:
                pulse1 = set_servo_position(servo1, pos1)
                pulse2 = set_servo_position(servo2, pos2)
                
                # Sende Bestätigung zurück an den Server
                # Format: "OK:pos1,pos2,pulse1,pulse2"
                response = f"OK:{pos1},{pos2},{pulse1},{pulse2}"
                print(response)
                sys.stdout.flush()  # Wichtig: Buffer leeren
            else:
                print("ERROR:Position out of range (0-360 degrees)")
                sys.stdout.flush()
                
    except ValueError:
        print("ERROR:Invalid input format")
        sys.stdout.flush()
    except Exception as e:
        print(f"ERROR:{str(e)}")
        sys.stdout.flush()