'use strict';

/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

const account1 = {
  owner: 'Philip Cheang',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-07-17T17:01:17.194Z',
    '2023-07-15T23:36:17.929Z',
    '2023-07-11T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2023-07-15T18:49:59.371Z',
    '2023-07-17T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // looping over 2 arrays at the same time
    const date = new Date(acc.movementsDates[i]); // convert string to javascript object that why saved into a variable called date

    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    // new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(mov);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
////////////////////////////
// implement countdown timer
const startLogOutTimer = function () {
  const tick = function () {
    // need to convert number to string to use padStart add 0 to single
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease 1s
    time--; // placement is key to count to 0
  };

  // Set time to 5 minutes
  let time = 300;
  // Call the timer every second
  tick(); // call immediately
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  // how to find current account you're in and put it in a variable
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    // define option object
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      month: 'numeric', // long, 2-digit, numeric
      day: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    // // grab the user browser location
    // const locale = navigator.language;

    // add options DateTimeFormat
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // // How to add a 0 in front of day when it is a single digit
    // const day = `${now.getDate()}`.padStart(2, 0); // first convert day to a string using a template literal. then add padStart 2 represent characters and 0 is the number you want to start with if it is a single digit
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minute = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${month}/${day}/${year}, ${hour}:${minute}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset the Timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset the Timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
///////////////////////////////////////
// Converting and Checking Numbers
console.log(23 === 23.0);

// Base 10 is 0 to 9. 1/10 = 0.1. 3/10 = 3.333333
//Binary base 2 is 0 1
console.log(0.1 + 0.2); // not able to do precise calculations in JavaScript
console.log(0.1 + 0.2 === 0.3); // false but should be true

// Conversion string to number
console.log(Number('23'));
console.log(+'23'); // Convert string to number

// Parsing
console.log(Number.parseInt('30px', 10)); //string must start with a number to parse
console.log(Number.parseInt('e23', 10)); // not a number since start with a letter.NaN

console.log(Number.parseInt('2.5rem', 10)); // it will stop at decimal point. 2

// ParseFloat is best used with css
console.log(Number.parseFloat('2.5rem', 10)); // float would read even after decimal point. 2.5
// Use isFinite over isNaN method. Check if value is not a number
console.log(Number.isNaN(20)); // is it NoT a Number. False because 20 is a Number
console.log(Number.isNaN('20')); // False because it is converted to a number
console.log(Number.isNaN(+'20X')); // True because it is not a number
console.log(Number.isNaN(23 / 0)); // not allowed Infinity which is NaN

console.log(Number.isInteger(23)); // true because it is a number with no decimal point
console.log(Number.isInteger(23.5)); // false because it is a float
console.log(Number.isInteger(23 / 0)); // flase

// isFinite is the best way to check for value is a real number
console.log(Number.isFinite(20)); // true because it is a number
console.log(Number.isFinite('20')); // false because it is NaN
console.log(Number.isFinite(+'20X')); // false because it is NaN
console.log(Number.isFinite(23 / 0)); // false because it is NaN
*/
/*
////////////////////////////////////
// Math and Rounding
console.log(Math.sqrt(25)); // how to calculate square root. 5
console.log(25 ** (1 / 2)); // 5
console.log(8 ** (1 / 3)); // calculate cubic root.. 2

// This is how you get the higher value
console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.max(5, 18, '23', 11, 2)); // this does type conversion.
console.log(Math.max(5, 18, '23px', 11, 2)); // this does not parse. NaN

// This how you get the lower value
console.log(Math.min(5, 18, 23, 11, 2)); // this does not parse. NaN
// Calculate radius of an image
console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.trunc(Math.random() * 6 + 1));

const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min); // Math.random is between 0 and 1.
console.log(randomInt(10, 20));

// Rounding Integers
console.log(Math.round(23.6)); // round to nearest integer. 24
console.log(Math.round(23.1)); // 23

console.log(Math.ceil(33.1)); // round up 34
console.log(Math.ceil(33.2)); // round up 34
// Cut out after decimal
console.log(Math.floor(23.9)); // round down 23
console.log(Math.floor('23.7')); // 23

console.log(Math.trunc(23.3)); // remove all decimal 23

console.log(Math.trunc(-23.6)); // -23
console.log(Math.floor(-23.6)); // -24

//Rounding decimals
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));
4;
*/
/*
///////////////////////////////////////
// The Remainder Operator
console.log(8 % 3); // 2
console.log(8 / 3); // 2.6

console.log(6 % 2); // 0
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(51));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // every 2nd time
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    // every 3rd time
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});
////////////////////////
// Numeric Separators
// sepearate by thousands separator
const diameter = 287_460_000_000;
console.log(diameter);
// separate by decimal separator
const price = 345_99;
console.log(price);

const transferFee1 = 15_00;
const transferFee2 = 1_000;

const PI = 3.1415;

console.log(Number('230000'));
*/
/*
//////////////////////////////////
// Working with BigInt
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);
//Operations
console.log(1000n + 1000n);
console.log(2138834682340987234987234n * 10000n);
// console.log(Math.sqrt(16n)); // cannot convert a Bigint Value to a number

const huge = 2020219409184n;
const num = 23;
console.log(huge * BigInt(num));

console.log(20n > 15); // true
console.log(20n === 20); // false
// Exceptions
console.log(typeof 20n);
console.log(20n == '20'); // true because it is a logical statement

console.log(huge + ' is REALLY big!!!');

// Divisions
console.log(10n / 3n); // 3n. basically cut off the rest after decimal point
console.log(10 / 3); // 3.333333
*/
/////////////////////////////////
// Creating Dates
/*
const now = new Date();
console.log(now);

console.log(new Date('Jul 17 2023 14:07:12'));
console.log(new Date('December 24, 2015'));
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2037, 10, 19, 15, 23, 5)); // month is 0 based that why 10 is November
console.log(new Date(2037, 10, 31)); // Dec 01 2037 auto correct to next day

console.log(new Date(0));
console.log(new Date(1 * 24 * 60 * 60 * 1000)); // 86400000 is the timestamp that will be used for the next day
*/
/*
// Working with Dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear()); // don't use getYear
console.log(future.getMonth() + 1); // month
console.log(future.getDate()); // 19 is day
console.log(future.getDay()); // 4. mean Thursday
console.log(future.getHours()); // 15
console.log(future.getMinutes()); // 23
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime()); // 2142278580000 millisecond pass since january 1970 which is a timestamp

console.log(new Date(2142278580000));

console.log(Date.now()); // this will give you date now in time stamp

future.setFullYear(2040); // how to autocorrect year
console.log(future);
*/
/*
//////////////////////////////////
// Operation with Date
const future = new Date(2037, 10, 19, 15, 23);
console.log(+future); // + is a short way to use Number function
// Convert timestamp to Date
const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24); // 1000ms in a second 60 seconds in one minute 60 minutes in one hour and 24 hours in one day

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));

console.log(days1); // 10 days
// Moment.js can be used to calculate dates that require hours and minutes
*/
/*
//////////////////////////////////////
// Internationalizing Numbers (Intl)

const num = 3884764.23;

const options = {
  style: 'currency',
  unit: 'celsius',
  currency: 'USD',
  // useGrouping: false,
};
console.log('US: ', new Intl.NumberFormat('en-US', options).format(num)); // format number to US locale
console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num));

console.log('Syria: ', new Intl.NumberFormat('ar-Sy', options).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num)
);
*/
/*
///////////////////////////////////
// Timers: setTimeout and setInterval
const ingredients = ['olives', 'spinach'];
// example asynchronous javascript
// callback function
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
  3000,
  ...ingredients
); // you put the arguments after seconds delayed
console.log('Waiting...');
// remove timer if ingredients include spinach
if (ingredients.includes('spinach')) clearTimeout(pizzaTimer); // clearTimeout delete timer

// setInterval
// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 3000);
*/
