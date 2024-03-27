/**
 * An object that contains a list of prime numbers calculated
 * to a maximum possible value.
 */
let lastPrimesCalculated = {
	lastMaxPrimeNumber: 0,
	lastCalculatedPrimeNumbers: [],
}

/**
 * This function returns a list of all prime numbers which are smaller than the
 * last maximum recieved by the function.
 * If the current max is bigger than the last maximum prime calculated, a new
 * the function will calculate, save, and return all primes smaller than max.
 *
 * This is a variation of the "Sieve of Eratosthenes" algorithm, that saves the last
 * largest amount of primes calculated for future use.
 *
 */
const getAllPrimeNumbersUpToMax = (maximum) => {
	if (maximum < lastPrimesCalculated.lastMaxPrimeNumber) {
		return [...lastPrimesCalculated.lastCalculatedPrimeNumbers]
	}

	const markingArray = new Array(Math.floor(maximum / 2)).fill(true)
	for (let i = 0; i < markingArray.length; i++) {
		if (!markingArray[i]) continue

		const jumpValue = 2 * i + 3
		for (let j = i + jumpValue; j < markingArray.length; j += jumpValue) {
			markingArray[j] = false
		}
	}

	const resultArray = [2]
	for (let i = 0; i < markingArray.length; i++) {
		if (markingArray[i]) resultArray.push(2 * i + 3)
	}

	lastPrimesCalculated.lastMaxPrimeNumber = maximum
	lastPrimesCalculated.lastCalculatedPrimeNumbers = [...resultArray]

	return resultArray
}

/**
 * An object representing an enum with class names for table cells.
 */
const numberType = {
	REGULAR: 'regular',
	SEMI_PRIME: 'semi-prime',
	BRILLIANT: 'brilliant',
	EMPTY: '',
}

/**
 * The length of a row in the table of numbers.
 */
const ROW_LENGTH = 10

/**
 * results object as requested in the test.
 */
let results = ''

/**
 * This function returns a list of all prime factors of the number
 * that may include duplicates like [2, 2] for the number 4.
 *
 */
const getPrimeFactorsWithDuplicates = (number) => {
	const primeFactors = getAllPrimeNumbersUpToMax(number / 2)
	const resultArray = []
	let temp = number
	for (let i = 0; i < primeFactors.length && primeFactors[i] <= temp; i++) {
		if (temp % primeFactors[i] == 0) {
			resultArray.push(primeFactors[i])
			temp /= primeFactors[i]
			i--
		}
	}
	return resultArray
}

/**
 * Returns the amount of digits in the number.
 */
const countDigits = (number) => {
	let count = 0
	while (number > 0) {
		count++
		number = Math.floor(number / 10)
	}
	return count
}

/**
 * Returns the number type of number.
 */
const getNumberType = (number) => {
	if (number < 4) return numberType.REGULAR
	const factors = getPrimeFactorsWithDuplicates(number)
	if (factors.length != 2) return numberType.REGULAR
	if (countDigits(factors[0]) != countDigits(factors[1])) return numberType.SEMI_PRIME
	return numberType.BRILLIANT
}

/**
 * Creates a DOM table element with all the numbers and their colours.
 * Also saves the results stringified JSON as requested in the test.
 */
const createTableAndSaveResults = (number) => {
	let res = {
		semi: [],
		brilliant: [],
	}

	const table = document.createElement('table')
	for (let i = 1; i <= number; i += ROW_LENGTH) {
		const row = document.createElement('tr')
		for (let j = 0; j < ROW_LENGTH; j++) {
			const num = i + j
			const cell = document.createElement('td')

			if (num <= number) {
				const type = getNumberType(num)
				switch (type) {
					case numberType.BRILLIANT:
						res.brilliant.push({ s: num.toString() })
					case numberType.SEMI_PRIME:
						res.semi.push({ s: num.toString() })
						break
					default:
				}
				cell.innerText = num
				cell.classList.add(type)
			}

			row.appendChild(cell)
		}
		table.appendChild(row)
	}
	results = JSON.stringify(res)
	return table
}

/**
 * Returns the results string as a JSON object.
 */
const getResults = () => {
	return JSON.parse(results)
}

/**
 * This function is invoked when the calculate button is pressed.
 */
const cmdCalculate = () => {
	const inputField = document.getElementById('input-field')
	const input = inputField.value
	if (isNaN(input)) return toggleInvalidInput()

	const inputNumber = Number(input)
	if (inputNumber <= 0) return toggleInvalidInput()

	getAllPrimeNumbersUpToMax(inputNumber)
	const outputDiv = document.getElementById('output-div')
	outputDiv.innerHTML = ''

	const table = createTableAndSaveResults(inputNumber)
	outputDiv.appendChild(table)
}

/**
 * This function is invoked when the input is invalid
 * and when the error message button is pressed to release it.
 */
const toggleInvalidInput = () => {
	const popupDiv = document.getElementById('popup-div')
	const calculateButton = document.getElementById('cmdCalculate')

	if (calculateButton.disabled) {
		popupDiv.classList.add('hidden')
		calculateButton.disabled = false
	} else {
		popupDiv.classList.remove('hidden')
		calculateButton.disabled = true
	}
}

/**
 * This funtion is invoked when the body of the website is loaded.
 */
const initFunction = () => {
	const cmdCalculateButton = document.getElementById('cmdCalculate')
	const errorPopupButton = document.getElementById('error-button')

	errorPopupButton.addEventListener('click', toggleInvalidInput)
	cmdCalculateButton.addEventListener('click', cmdCalculate)
}
