let calc = {
    displayValue: "0",
    firstValue: null,
    waitingForSecondValue: false,
    operator: null,
    answer: null
}

let history = []
let displayHistoryContainer = true

const keys = ['CE', 'C', 'Clear History', '/', 7, 8, 9, 'X', 4, 5, 6, '-', 1, 2, 3, '+', 'Show History', 0, '.', '=']

function clearEquation() {
    if (history[history.length - 1] !== 'clear') { history = [...history, 'clear'] }

    calc = {
        displayValue: "0",
        firstValue: null,
        waitingForSecondValue: false,
        operator: null,
        answer: null
    }

    resetDisplayValue()
}

function clearHistory() {
    history = []
    createHistoryDisplay()
}

function showHistoryContainer() {
    displayHistoryContainer = !displayHistoryContainer
    document.getElementById('historyContainer').hidden = displayHistoryContainer
}

function updateDisplay(value) {
    calc.displayValue = value
    document.getElementById('display').value = calc.displayValue
}

function inputDigit(digit) {
    let newValue = calc.displayValue === '0' && digit !== '.' ? digit : calc.displayValue + digit
    updateDisplay(newValue)
}

function checkForError(val) {
    // not fully working for NaN. if val === NaN it displays NaN instead of ERROR
    let answer = val === Infinity || val === NaN || val === 'NaN' ? 'ERROR' : val
    calc.answer = answer
    history = [...history, { ...calc }]
    createHistoryDisplay()
    return answer
}

function solve() {
    const { displayValue, firstValue, operator } = calc

    if (operator === '+') updateDisplay(checkForError(Number(firstValue) + Number(displayValue)))
    else if (operator === '-') updateDisplay(checkForError(Number(firstValue) - Number(displayValue)))
    else if (operator === '*') updateDisplay(checkForError(Number(firstValue) * Number(displayValue)))
    else if (operator === '/') updateDisplay(checkForError(Number(firstValue) / Number(displayValue)))
}

function buttonPressed(e) {
    let val = e.target.innerText

    if (Number(val) || val === '0') { inputDigit(val) }
    if (val === '.' && !calc.displayValue.includes('.')) { inputDigit(val) }
    else if (val === 'CE' || val === 'C' || val === 'c') { clearEquation() }
    else if (val === 'Clear History') { clearHistory() }
    else if (val === 'Show History') { showHistoryContainer() }
    else if (val === 'Enter') { solve() }
    else if (val === '+') { calc.waitingForSecondValue = true; calc.operator = '+'; calc.firstValue = calc.displayValue; resetDisplayValue() }
    else if (val === '-') { calc.waitingForSecondValue = true; calc.operator = '-'; calc.firstValue = calc.displayValue; resetDisplayValue() }
    else if (val === 'X' || val === '*') { calc.waitingForSecondValue = true; calc.operator = '*'; calc.firstValue = calc.displayValue; resetDisplayValue() }
    else if (val === '/') { calc.waitingForSecondValue = true; calc.operator = '/'; calc.firstValue = calc.displayValue; resetDisplayValue() }
    else if (val === '=') { solve() }
}

function resetDisplayValue() {
    updateDisplay("0")
}

function keyPressed(e) {
    /***
     * it is kind of weird to put e.key in this object structure but i wanted to use the buttonPressed method
     * since all of the button mapping logic is already there already.
     */
    let obj = { target: { innerText: e.key } }
    buttonPressed(obj)
}

function createNumberButtons() {
    let body = document.getElementsByTagName('body')[0]
    body.onkeyup = (event) => keyPressed(event)

    let d = document.getElementById('numbersContainer')

    keys.map(k => {
        let b = document.createElement('button')

        b.innerText = k
        b.onclick = (event) => buttonPressed(event)

        d.appendChild(b)
    })
}

function createHistoryDisplay() {
    let e = document.getElementById('equationHistory')
    e.innerHTML = ''

    if (history.length === 0) {
        let li = document.createElement('li')
        li.innerText = 'No History To Display'
        e.appendChild(li)
    }

    history.map(h => {
        const { firstValue, displayValue, operator, answer } = h
        let li = document.createElement('li')

        if (h !== 'clear') {
            li.innerText = `${firstValue} ${operator} ${displayValue} = ${answer}`
            e.appendChild(li)
        }

    })
}


