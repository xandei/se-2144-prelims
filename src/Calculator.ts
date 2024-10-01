class Calculator {
    private display: HTMLElement;
    private currentInput: string = '';
    private operator: string = '';
    private previousInput: string = '';
    private isOperatorPressed: boolean = false;
    private isDecimalPressed: boolean = false;
    private isOff: boolean = false; // flag for calculator being off

    constructor() {
      this.display = document.getElementById('display') as HTMLElement;
      this.initEventListeners();
      this.updateDisplay();
    }

    private initEventListeners() {
      const numberButtons = document.querySelectorAll('.number');
      const operatorButtons = document.querySelectorAll('.operator');
      const equalsButton = document.getElementById('equals') as HTMLElement;
      const clearButton = document.getElementById('ac') as HTMLElement;
      const backspaceButton = document.getElementById('backspace') as HTMLElement;
      const byeButton = document.getElementById('bye') as HTMLElement;
      const helloButton = document.getElementById('hello') as HTMLElement;

      // Add event listeners for all buttons
      numberButtons.forEach(button => {
        button.addEventListener('click', () => {
          this.handleNumberInput(button.textContent);
        });
      });

      operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
          this.handleOperatorInput(button.textContent);
        });
      });

      equalsButton.addEventListener('click', () => {
        this.handleEquals();
      });

      clearButton.addEventListener('click', () => {
        this.handleClear(); // Use handleClear instead of clearDisplay
      });

      backspaceButton.addEventListener('click', () => {
        this.handleBackspace();
      });

      byeButton.addEventListener('click', () => {
        this.handleBye();
      });

      helloButton.addEventListener('click', () => {
        this.handleHello();
      });
    }

    private handleNumberInput(value: string) {
      if (!this.isOff) {
        if (this.currentInput.length < 8) {
          if (this.isOperatorPressed) {
            this.currentInput = value;
            this.isOperatorPressed = false;
            this.isDecimalPressed = false;
          } else {
            this.currentInput += value;
          }
          this.updateDisplay();
        }
      }
    }

    private handleOperatorInput(operator: string) {
      if (!this.isOff) {
        if (!this.isOperatorPressed) {
          this.previousInput = this.currentInput;
          this.operator = operator;
          this.isOperatorPressed = true;
          this.isDecimalPressed = false;
        }
      }
    }

    private handleEquals() {
      if (!this.isOff) {
        if (this.operator && this.previousInput && this.currentInput) {
          this.calculateResult();
          this.previousInput = '';
          this.operator = '';
        }
      }
    }

    private handleBackspace() {
      if (!this.isOff) {
        this.currentInput = this.currentInput.slice(0, -1);
        this.updateDisplay();
      }
    }

    private handleBye() {
      this.display.textContent = 'Goodbye';
      this.isOff = true; // turns off the calculator
      setTimeout(() => {
        this.display.textContent = ''; // clears the display after 1.5 seconds
      }, 1500);
    }

    private handleHello() {
      const greetings = ['Hola', 'Kamusta', 'Bonjour', 'Ciao', 'Hallo'];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      this.display.textContent = randomGreeting;
    }

    private handleClear() {
      this.operator = '';
      this.previousInput = '';
      this.isOperatorPressed = false;
      this.isDecimalPressed = false;
      this.isOff = false; // Turn the calculator back on
      this.currentInput = ''; // Display '0'
      this.updateDisplay();
      this.display.textContent = '0';
    }
    
    private calculateResult() {
      if (!this.isOff) {
        let result: number;
        switch (this.operator) {
          case '+':
            result = parseFloat(this.previousInput) + parseFloat(this.currentInput);
            break;
          case '-':
            result = parseFloat(this.previousInput) - parseFloat(this.currentInput);
            break;
          case '*':
            result = parseFloat(this.previousInput) * parseFloat(this.currentInput);
            break;
          case '/':
            result = parseFloat(this.previousInput) / parseFloat(this.currentInput);
            break;
          default:
            result = 0;
        }
        this.currentInput = result.toString();
        this.updateDisplay();
      }
    }

    private updateDisplay() {
      this.display.textContent = this.currentInput;
    }
  }

  // Initialize the calculator
  const calculator = new Calculator();