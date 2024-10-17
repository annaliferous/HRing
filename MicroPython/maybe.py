from machine import Pin, PWM
import sys

# Constants for servo movement
SERVO_MIN = 1000  # Minimum pulse width for servo (in microseconds)
SERVO_MAX = 2000  # Maximum pulse width for servo (in microseconds)

# Setup servos
servo1 = PWM(Pin(0))
servo2 = PWM(Pin(1))

# Set frequency to 50Hz for standard servos
servo1.freq(50)
servo2.freq(50)

def map_value(value, in_min, in_max, out_min, out_max):
    return int((value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)

def set_servo_position(servo, position):
    # Map position (0-180 degrees) to pulse width (1000-2000 microseconds)
    pulse_width = map_value(position, 0, 180, SERVO_MIN, SERVO_MAX)
    servo.duty_ns(pulse_width * 1000)  # Set duty cycle in nanoseconds

# Main loop
while True:
    # Read from standard input (blocking until user presses Enter)
    value_string = sys.stdin.read().strip()  # Read the serial input from Thonny
    try:
        position = int(value_string)
        if 0 <= position <= 180:
            set_servo_position(servo1, position)
            set_servo_position(servo2, position)
        else:
            print("Position out of range (0-180 degrees)")
    except ValueError:
        print("Invalid input. Please enter a number between 0 and 180.")
