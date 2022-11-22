'''A sample of Python function decorators.'''

# 2022.11.22
# Nono Martínez Alonso
# Live 89
# nono.ma/live/89

# Define a custom Python decorator
def print_operation(func):
    def wrapper(a,b):
        print('Calculating...')
        print(func(a,b))
        print('Done!')
    return wrapper

# Define a Python function
def add_two(a,b):
    return a+b

# Pass our function through the decorator
add_two_decorated = print_operation(add_two)

# This function call is "decorated"
add_two_decorated(3,3)

# This function call is not "decorated"
print(f'The result of 3+3 is {add_two(3,3)}')

# Define a function automatically "decorated"
@print_operation
def add_two_autodecorated(a,b):
    return a+b

# This function call is "decorated"
add_two_autodecorated(3,3)