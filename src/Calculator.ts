class Calculator {
  private display: HTMLElement; // Element to show the display of the calculator
  private currentInput: string = ''; // Stores the current input from the user
  private operator: string = ''; // Stores the current operator
  private previousInput: string = ''; // Stores the previous input before the operator
  private isOperatorPressed: boolean = false; // Flag to check if an operator has been pressed
  private isDecimalPressed: boolean = false; // Flag to check if a decimal has been pressed
  private isOff: boolean = false; // Flag to check if the calculator is off

  constructor() {
      this.display = document.getElementById('display') as HTMLElement; // Get the display element
      this.initEventListeners(); // Initialize event listeners for buttons
      this.updateDisplay(); // Update the display initially
      this.updateDisplayColor(); // Set initial display color based on the state
  }

  private initEventListeners() {
      // Get button elements from the DOM
      const numberButtons = document.querySelectorAll('.number');
      const operatorButtons = document.querySelectorAll('.operator');
      const equalsButton = document.getElementById('equals') as HTMLElement;
      const clearButton = document.getElementById('ac') as HTMLElement;
      const backspaceButton = document.getElementById('backspace') as HTMLElement;
      const byeButton = document.getElementById('bye') as HTMLElement;
      const helloButton = document.getElementById('hello') as HTMLElement;
      const decimalButton = document.getElementById('decimal') as HTMLElement;
      const toggleSignButton = document.getElementById('toggle-sign') as HTMLElement;

      // Add event listeners for number buttons
      numberButtons.forEach(button => {
          button.addEventListener('click', () => {
              this.handleNumberInput(button.textContent!); // Handle number input
          });
      });

      // Add event listeners for operator buttons
      operatorButtons.forEach(button => {
          button.addEventListener('click', () => {
              this.handleOperatorInput(button.textContent!); // Handle operator input
          });
      });

      // Add event listeners for other buttons
      equalsButton.addEventListener('click', () => {
          this.handleEquals(); // Handle equals button click
      });
      clearButton.addEventListener('click', () => {
          this.handleClear(); // Handle clear button click
      });
      backspaceButton.addEventListener('click', () => {
          this.handleBackspace(); // Handle backspace button click
      });
      byeButton.addEventListener('click', () => {
          this.handleBye(); // Handle bye button click
      });
      helloButton.addEventListener('click', () => {
          this.handleHello(); // Handle hello button click
      });
      decimalButton.addEventListener('click', () => {
          this.handleDecimal(); // Handle decimal button click
      });
      toggleSignButton.addEventListener('click', () => {
          this.handleToggleSign(); // Handle toggle sign button click
      });
  }

  private handleNumberInput(value: string) {
      if (!this.isOff) {
          if (this.currentInput.length < 18) { // Limit input length
              this.isOperatorPressed = false; // Reset operator flag when a number is pressed

              // Allow adding a negative number only at the start
              if (this.currentInput === '' && value === '-') {
                  this.currentInput = '-'; // Set current input to negative
              } else if (this.currentInput !== '-') {
                  // Append the value if it's a number and a decimal isn't already present
                  if (value !== '.' || !this.currentInput.includes('.')) {
                      this.currentInput += value; // Concatenate current input
                  }
              }

              this.updateDisplay(); // Update the display with the current input
          }
      }
  }

  private handleOperatorInput(operator: string) {
      if (!this.isOff && !this.isOperatorPressed && this.currentInput) {
          if (this.operator) {
              // Calculate result if there's already an operator
              this.calculateResult();
          }
          this.previousInput += this.currentInput + ' '; // Store the current input
          this.currentInput = ''; // Clear current input
          this.operator = operator; // Set the operator
          this.isOperatorPressed = true; // Set operator pressed flag
          this.updateDisplay(); // Update display with current operation
      }
  }

  private handleEquals() {
      if (!this.isOff && this.previousInput && this.currentInput) {
          this.calculateResult(); // Calculate result when equals is pressed
          this.updateDisplay(); // Show the result on display
      }
  }

  private handleClear() {
      // Reset all variables to clear calculator state
      this.operator = '';
      this.previousInput = '';
      this.isOperatorPressed = false;
      this.isOff = false;
      this.currentInput = '';
      this.updateDisplay(); // Clear the display
      this.updateDisplayColor(); // Reset display color to white
  }

  private handleBackspace() {
      if (!this.isOff) {
          this.currentInput = this.currentInput.slice(0, -1); // Remove the last character from current input
          this.updateDisplay(); // Update the display
      }
  }

  private handleBye() {
      this.display.textContent = 'Goodbye'; // Show goodbye message
      this.isOff = true; // Set calculator state to off
      this.updateDisplayColor(); // Change display color to black
      setTimeout(() => {
          this.display.textContent = ''; // Clear display after a delay
      }, 1500);
  }

  private handleHello() {
      if (!this.isOff) { // Check if the calculator is on
          const greetings = ['Hola', 'Kamusta', 'Bonjour', 'Ciao', 'Hallo'];
          const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]; // Random greeting
          this.display.textContent = randomGreeting; // Display greeting
      }
  }

  private handleDecimal() {
      if (!this.isOff) {
          // Allow a decimal point only if it hasn't been pressed yet
          if (!this.isDecimalPressed) {
              if (this.currentInput === '') {
                  this.currentInput = '0.'; // Start with '0.' if current input is empty
              } else if (!this.currentInput.includes('.')) {
                  this.currentInput += '.'; // Append decimal point if it doesn't exist
              }
              this.isDecimalPressed = true; // Set flag to indicate decimal has been pressed
              this.updateDisplay(); // Update the display
          }
      }
  }

  private calculateResult() {
      if (!this.isOff) {
          let result: number;
          const prev = parseFloat(this.previousInput.trim()); // Parse previous input
          const curr = parseFloat(this.currentInput); // Parse current input
          
          // Handle error if inputs are not valid numbers
          if (isNaN(prev) || isNaN(curr)) {
              this.currentInput = 'Error'; // Show error message
              this.previousInput = ''; // Clear previous input
              return;
          }

          // Perform calculation based on the operator
          switch (this.operator) {
              case '+':
                  result = prev + curr; // Addition
                  break;
              case '-':
                  result = prev - curr; // Subtraction
                  break;
              case '*':
                  result = prev * curr; // Multiplication
                  break;
              case '/':
                  result = curr !== 0 ? prev / curr : 0; // Handle division by zero
                  break;
              default:
                  result = 0; // Default case
          }

          this.currentInput = result.toString(); // Convert result to string
          this.previousInput = ''; // Reset previous input after calculation
          this.operator = ''; // Reset operator
          this.isOperatorPressed = false; // Reset operator pressed flag
          this.isDecimalPressed = false; // Reset decimal flag
          this.updateDisplay(); // Show result
      }
  }

  private handleToggleSign() {
      if (!this.isOff && this.currentInput) {
          // Toggle the sign of the current input
          if (this.currentInput.startsWith('-')) {
              this.currentInput = this.currentInput.substring(1); // Remove the '-' sign
          } else {
              this.currentInput = '-' + this.currentInput; // Add the '-' sign
          }
          this.updateDisplay(); // Update the display
      }
  }

  private updateDisplay() {
      // Update display to show both previous input and current input
      this.display.textContent = `${this.previousInput}${this.operator ? ' ' + this.operator + ' ' : ''}${this.currentInput}`;
  }

  private updateDisplayColor() {
      // Change display color based on whether the calculator is off or on
      if (this.isOff) {
          this.display.style.backgroundColor = 'black'; // Set background to black
          this.display.style.color = 'white'; // Set text color to white
      } else {
          this.display.style.backgroundColor = 'white'; // Set background to white
          this.display.style.color = 'black'; // Set text color to black
      }
  }
}

// Initialize the calculator
const calculator = new Calculator();
