// Checks if an argument is prime
function isPrime(x) {
    for(let i = 2, s = Math.sqrt(x); i <= s; i++){
		if(x % i === 0) {return false;}
	}
    return x > 1;
}

// returns a random integer between min (inclusive) and max (exclusive)
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// Generates a number that might be prime
function generatePrime(min, max) {
	return getRandomInt(Math.floor(min / 2), Math.floor(max / 2)) * 2 + 1;
}

// finds the Highest Common Factor or argument a and argument b
function highestCommonFactor(a, b) {
	if (b === 0) {
		return a;
	}
	else {
		return highestCommonFactor(b, a % b);
	}
}

// calculates the private key exponent from the public key exponent
function modInverse(a, m) {
	for (let x = 1; x < m; x++) {
		if ((a * x) % m === 1) {
			return x;
		}
	}
	return 1;
}


// https://stackoverflow.com/questions/5989429/pow-and-mod-function-optimization
function expMod(base, exp, mod) {
	if (exp === 0) {return 1;}
	if (exp % 2 === 0) {
		return Math.pow(expMod(base, (exp / 2), mod), 2) % mod;
	}
	else {
		return (base * expMod(base, (exp - 1), mod)) % mod;
	}
}



let globalPrivateKeyExponent;

function start() {
	let prime0, prime1, prime, keyModulus, publicKeyExponent, privateKeyExponent, outString, charInt, inputLength;

	// check for existing keys
	let check = document.getElementById("mod").value.replace(/\s/g, "");

	if (check !== "") {

		// get them

		keyModulus = document.getElementById("mod").value.replace(/\s/g, "");
		publicKeyExponent = document.getElementById("public").value.replace(/\s/g, "");
		privateKeyExponent = document.getElementById("private").value.replace(/\s/g, "");
		if (privateKeyExponent === "") {
			privateKeyExponent = globalPrivateKeyExponent;
		}

	}
	else {

		document.getElementById("privatelabel").innerHTML = "<p>Click to Show Private Key Exponent...</p>";

		// generate new keys
		do {
			prime0 = generatePrime(64, 256);
			prime = isPrime(prime0);
		}
		while (prime === false);

		do {
			prime1 = generatePrime(64, 256);
			prime = isPrime(prime1);
		}
		while (prime === false);


		//Generate the key modulus - this is used in the encryption and decryption methods
		keyModulus = prime0 * prime1;

		//Generate the euler totient - this is used to generate the private key exponent from the public key exponent
		let eulerTotient = (prime0 - 1) * (prime1 - 1);

		//Use Euclid's Algorithm to verify that publicKeyExponent and eulerTotient are coprime
		let factor;
		do {
			publicKeyExponent = getRandomInt(1, eulerTotient);
			factor = highestCommonFactor(publicKeyExponent, eulerTotient);
		}
		while (factor !== 1);

		// calculates the private key exponent from the public key exponent
		privateKeyExponent = modInverse(publicKeyExponent, eulerTotient);
	}


	// get input
	let encrypt = document.getElementById("encrypt").checked;
	let inputString = document.getElementById("input").value;
	outString = "";
	inputLength = inputString.normalize().length;

	for (let index = 0; (index < inputLength); index += 1) {
		if ((encrypt === true)) {
			charInt = expMod(inputString.charCodeAt(index), publicKeyExponent, keyModulus);
		} else {
			charInt = expMod(inputString.charCodeAt(index), privateKeyExponent, keyModulus);
		}
		outString += String.fromCharCode(charInt);


	}
	document.getElementById("output").value = outString;

	document.getElementById("mod").value = keyModulus;
	document.getElementById("public").value = publicKeyExponent;
	globalPrivateKeyExponent = privateKeyExponent;


}

function showPrivate() {
	document.getElementById("private").value = globalPrivateKeyExponent;
	document.getElementById("privatelabel").innerHTML = "<p>Private Key Exponent:</p>";
}
