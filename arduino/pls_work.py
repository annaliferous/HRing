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

# Initialize servo positions
set_servo_position(servo1, 0)
set_servo_position(servo2, 0)

while True:
    value_string = sys.stdin.readline().strip()  # Read the input
    print(f"Received from serial: {value_string}")  # Debugging: print received value

    try:
        pos1 = int(value_string)
        pos2 = int(value_string)
        
        if 0 <= pos1 <= 180:
            set_servo_position(servo1, pos1)
            set_servo_position(servo2, pos2)
            print(f"Servo1: {pos1}°, Servo2: {pos2}°")
        else:
            print("Position out of range (0-180 degrees).")

    except ValueError:
        print("Invalid input. Please enter a valid integer between 0 and 180.")
