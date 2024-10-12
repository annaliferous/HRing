from machine import Pin, PWM
import sys

# Constants for servo movement (pulse width in microseconds)
SERVO_MIN = 1000  # Minimum pulse width (in microseconds)
SERVO_MAX = 2000  # Maximum pulse width (in microseconds)

# Set up servos on pins 0 and 1
servo1 = PWM(Pin(0))
servo2 = PWM(Pin(1))

# Set frequency to 50Hz for standard servos
servo1.freq(50)
servo2.freq(50)

def map_value(value, in_min, in_max, out_min, out_max):
    """Map the input value from one range to another"""
    return int((value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)

def set_servo_position(servo, position):
    """Set servo position, mapping 0-180 degrees to PWM pulse width"""
    pulse_width = map_value(position, 0, 180, SERVO_MIN, SERVO_MAX)
    servo.duty_ns(pulse_width * 1000)  # Convert to nanoseconds for duty cycle

# Initialize servo positions to 0
set_servo_position(servo1, 0)
set_servo_position(servo2, 0)

while True:
    # Read from standard input (serial) via Thonny or another serial terminal
    value_string = sys.stdin.read().strip()  # Blocking read until Enter is pressed

    try:
        pos1 = int(value_string)
        if 0 <= pos1 <= 180:
            pos2 = 360 - pos1  # Modify this logic based on your requirement

            # Make sure pos2 is in the valid range
            pos2 = max(0, min(180, pos2))

            # Set both servos to the desired positions
            set_servo_position(servo1, pos1)
            set_servo_position(servo2, pos2)

            print(f"Servo1: {pos1}°, Servo2: {pos2}°")

        else:
            print("Position out of range (0-180 degrees).")

    except ValueError:
        print("Invalid input. Please enter a valid integer between 0 and 180.")
