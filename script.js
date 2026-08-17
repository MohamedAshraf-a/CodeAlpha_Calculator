const currentDisplay = document.getElementById("currentDisplay");
const previousDisplay = document.getElementById("previousDisplay");

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const actionButtons = document.querySelectorAll(".action");
const equalsButton = document.querySelector(".equals");


let currentNumber = "";
let previousNumber = "";
let operation = null;
let shouldResetDisplay = false;


/* Update Display */

function updateDisplay() {

    currentDisplay.textContent = currentNumber || "0";

    if (previousNumber && operation) {
        previousDisplay.textContent =
            `${previousNumber} ${getOperationSymbol(operation)}`;
    } else {
        previousDisplay.textContent = "";
    }

}


/* Operation Symbols */

function getOperationSymbol(operator) {

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        "%": "%"
    };

    return symbols[operator] || operator;
}


/* Add Number */

function appendNumber(number) {

    if (shouldResetDisplay) {
        currentNumber = "";
        shouldResetDisplay = false;
    }

    // Prevent multiple decimal points
    if (number === "." && currentNumber.includes(".")) {
        return;
    }

    // Prevent unnecessary leading zeros
    if (number === "0" && currentNumber === "0") {
        return;
    }

    if (number === "." && currentNumber === "") {
        currentNumber = "0";
    }

    currentNumber += number;

    updateDisplay();
}


/* Select Operation */

function chooseOperation(selectedOperation) {

    if (currentNumber === "" && previousNumber === "") {
        return;
    }

    if (currentNumber === "" && previousNumber !== "") {
        operation = selectedOperation;
        updateDisplay();
        return;
    }

    if (previousNumber !== "" && operation !== null) {
        calculate();
    }

    previousNumber = currentNumber;
    currentNumber = "";

    operation = selectedOperation;

    updateDisplay();
}


/* Calculate */

function calculate() {

    if (
        previousNumber === "" ||
        currentNumber === "" ||
        operation === null
    ) {
        return;
    }

    const previous = parseFloat(previousNumber);
    const current = parseFloat(currentNumber);

    let result;

    switch (operation) {

        case "+":
            result = previous + current;
            break;

        case "-":
            result = previous - current;
            break;

        case "*":
            result = previous * current;
            break;

        case "/":

            if (current === 0) {
                currentNumber = "Error";
                previousNumber = "";
                operation = null;

                updateDisplay();

                return;
            }

            result = previous / current;
            break;

        case "%":
            result = previous % current;
            break;

        default:
            return;
    }


    // Avoid long floating point numbers
    result = Number(result.toFixed(10));

    currentNumber = result.toString();

    previousNumber = "";
    operation = null;

    shouldResetDisplay = true;

    updateDisplay();
}


/* Clear */

function clearCalculator() {

    currentNumber = "";
    previousNumber = "";
    operation = null;
    shouldResetDisplay = false;

    updateDisplay();
}


/* Delete */

function deleteNumber() {

    if (shouldResetDisplay) {
        return;
    }

    currentNumber = currentNumber.slice(0, -1);

    updateDisplay();
}


/* Button Events */


/* Numbers */

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.textContent;

        appendNumber(value);

    });

});


/* Operators */

operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        const operator = button.dataset.operation;

        chooseOperation(operator);

    });

});


/* Clear & Delete */

actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteNumber();
        }

    });

});


/* Equals */

equalsButton.addEventListener("click", calculate);


/* Keyboard Support */

document.addEventListener("keydown", (event) => {

    const key = event.key;


    // Numbers

    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {

        appendNumber(key);

        return;
    }


    // Operators

    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        chooseOperation(key);

        return;
    }


    // Percentage

    if (key === "%") {

        chooseOperation("%");

        return;
    }


    // Enter / Equal

    if (key === "Enter" || key === "=") {

        event.preventDefault();

        calculate();

        return;
    }


    // Backspace

    if (key === "Backspace") {

        deleteNumber();

        return;
    }


    // Escape

    if (key === "Escape") {

        clearCalculator();

        return;
    }

});