class Calculator {
    private display: HTMLElement; // element to show the display of the calculator
    private currentInput: string = ''; // stores the current input from the user
    private operator: string = ''; // stores the current operator
    private previousInput: string = ''; // stores the previous input before the operator
    private isOperatorPressed: boolean = false; // flag to check if an operator has been pressed
    private isDecimalPressed: boolean = false; // flag to check if a decimal has been pressed
    private isOff: boolean = false; // flag to check if the calculator is off

    constructor() {
        this.display = document.getElementById('display') as HTMLElement; // get the display element
        this.initEventListeners(); // initialize event listeners for buttons
        this.updateDisplay(); // update the display initially
        this.updateDisplayColor(); // set initial display color based on the state
    }

    private initEventListeners() {
        // get button elements from the DOM
        const numberButtons = document.querySelectorAll('.number');
        const operatorButtons = document.querySelectorAll('.operator');
        const equalsButton = document.getElementById('equals') as HTMLElement;
        const clearButton = document.getElementById('ac') as HTMLElement;
        const backspaceButton = document.getElementById('backspace') as HTMLElement;
        const byeButton = document.getElementById('bye') as HTMLElement;
        const helloButton = document.getElementById('hello') as HTMLElement;
        const decimalButton = document.getElementById('decimal') as HTMLElement;
        const toggleSignButton = document.getElementById('toggle-sign') as HTMLElement;

        // add event listeners for number buttons
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleNumberInput(button.textContent!); // handle number input
            });
        });

        // add event listeners for operator buttons
        operatorButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleOperatorInput(button.textContent!); // handle operator input
            });
        });

        // add event listeners for other buttons
        equalsButton.addEventListener('click', () => {
            this.handleEquals(); // handle equals button click
        });
        clearButton.addEventListener('click', () => {
            this.handleClear(); // handle clear button click
        });
        backspaceButton.addEventListener('click', () => {
            this.handleBackspace(); // handle backspace button click
        });
        byeButton.addEventListener('click', () => {
            this.handleBye(); // handle bye button click
        });
        helloButton.addEventListener('click', () => {
            this.handleHello(); // handle hello button click
        });
        decimalButton.addEventListener('click', () => {
            this.handleDecimal(); // handle decimal button click
        });
        toggleSignButton.addEventListener('click', () => {
            this.handleToggleSign(); // handle toggle sign button click
        });
    }

    private handleNumberInput(value: string) {
        if (!this.isOff) {
            if (this.currentInput.length < 18) { // limit input length
                this.isOperatorPressed = false; // reset operator flag when a number is pressed

                // allow adding a negative number only at the start
                if (this.currentInput === '' && value === '-') {
                    this.currentInput = '-'; // set current input to negative
                } else if (this.currentInput !== '-') {
                    // append the value if it's a number and a decimal isn't already present
                    if (value !== '.' || !this.currentInput.includes('.')) {
                        this.currentInput += value; // concatenate current input
                    }
                }

                this.updateDisplay(); // update the display with the current input
            }
        }
    }

    private handleOperatorInput(operator: string) {
        if (!this.isOff && !this.isOperatorPressed && this.currentInput) {
            if (this.operator) {
                // calculate result if there's already an operator
                this.calculateResult();
            }
            this.previousInput += this.currentInput + ' '; // store the current input
            this.currentInput = ''; // clear current input
            this.operator = operator; // set the operator
            this.isOperatorPressed = true; // set operator pressed flag
            this.updateDisplay(); // update display with current operation
        }
    }

    private handleEquals() {
        if (!this.isOff && this.previousInput && this.currentInput) {
            this.calculateResult(); // calculate result when equals is pressed
            this.updateDisplay(); // show the result on display
        }
    }

    private handleClear() {
        // reset all variables to clear calculator state
        this.operator = '';
        this.previousInput = '';
        this.isOperatorPressed = false;
        this.isOff = false;
        this.currentInput = '';
        this.updateDisplay(); // clear the display
        this.updateDisplayColor(); // reset display color to white
    }

    private handleBackspace() {
        if (!this.isOff) {
            this.currentInput = this.currentInput.slice(0, -1); // remove the last character from current input
            this.updateDisplay(); // Update the display
        }
    }

    private handleBye() {
        this.display.textContent = 'Goodbye'; // show goodbye message
        this.isOff = true; // set calculator state to off
        this.updateDisplayColor(); // change display color to black
        setTimeout(() => {
            this.display.textContent = ''; // clear display after a delay
        }, 1500);
    }

    private handleHello() {
        if (!this.isOff) { // check if the calculator is on
            const greetings = ['Hola', 'Kamusta', 'Bonjour', 'Ciao', 'Hallo'];
            const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]; // random greeting
            this.display.textContent = randomGreeting; // display greeting
        }
    }

    private handleDecimal() {
        if (!this.isOff) {
            // allow a decimal point only if it hasn't been pressed yet
            if (!this.isDecimalPressed) {
                // check if currentInput is empty
                if (this.currentInput === '') {
                    this.currentInput = '0.'; // start with '0.' if current input is empty
                } else if (!this.currentInput.includes('.')) {
                    this.currentInput += '.'; // append decimal point if it doesn't exist
                }
                this.isDecimalPressed = true; // set flag to indicate decimal has been pressed
                this.updateDisplay(); // update the display
            }
        }
    }


    private calculateResult() {
        if (!this.isOff) {
            let result: number;
            const prev = parseFloat(this.previousInput.trim()); // parse previous input
            const curr = parseFloat(this.currentInput); // parse current input
            
            // handle error if inputs are not valid numbers
            if (isNaN(prev) || isNaN(curr)) {
                this.currentInput = 'Error'; // show error message
                this.previousInput = ''; // clear previous input
                return;
            }

            // perform calculation based on the operator
            switch (this.operator) {
                case '+':
                    result = prev + curr; // addition
                    break;
                case '-':
                    result = prev - curr; // subtraction
                    break;
                case '*':
                    result = prev * curr; // multiplication
                    break;
                case '/':
                    result = curr !== 0 ? prev / curr : 0; // handle division by zero
                    break;
                default:
                    result = 0; // default case
            }

            this.currentInput = result.toString(); // convert result to string
            this.previousInput = ''; // reset previous input after calculation
            this.operator = ''; // reset operator
            this.isOperatorPressed = false; // reset operator pressed flag
            this.isDecimalPressed = false; // reset decimal flag
            this.updateDisplay(); // show result
        }
    }

    private handleToggleSign() {
        if (!this.isOff && this.currentInput) {
            // toggle the sign of the current input
            if (this.currentInput.startsWith('-')) {
                this.currentInput = this.currentInput.substring(1); // remove the '-' sign
            } else {
                this.currentInput = '-' + this.currentInput; // add the '-' sign
            }
            this.updateDisplay(); // update the display
        }
    }

    private updateDisplay() {
        // update display to show both previous input and current input
        this.display.textContent = `${this.previousInput}${this.operator ? ' ' + this.operator + ' ' : ''}${this.currentInput}`;
    }

    private updateDisplayColor() {
        // change display color based on whether the calculator is off or on
        if (this.isOff) {
            this.display.style.backgroundColor = 'black'; // set background to black
            this.display.style.color = 'white'; // set text color to white
        } else {
            this.display.style.backgroundColor = 'white'; // set background to white
            this.display.style.color = 'black'; // set text color to black
        }
    }
    }

const calculator = new Calculator();
