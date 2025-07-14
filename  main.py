import sys
from machine import Pin, PWM
import time

SERVO_MIN = 1000
SERVO_MAX = 2000

servo1 = PWM(Pin(0))
servo2 = PWM(Pin(1))
servo1.freq(50)
servo2.freq(50)

print("🟢 USB serial ready")

def map_value(value, in_min, in_max, out_min, out_max):
    return int((value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)

def set_servo_position(servo, position):
    pulse_width = map_value(position, 0, 180, SERVO_MIN, SERVO_MAX)
    servo.duty_ns(pulse_width * 1000)

set_servo_position(servo1, 0)
set_servo_position(servo2, 0)

while True:
    try:
        value_string = sys.stdin.readline().strip()
        print(f"🔵 Received over USB: {value_string}")
        pos = int(value_string)
        
        if 0 <= pos <= 180:
            set_servo_position(servo1, pos)
            set_servo_position(servo2, pos)
            print(f"✅ Servo moved to {pos}")
        else:
            print("❗ Value out of range (0–180)")
    except Exception as e:
        print(f"❌ Error: {e}")

