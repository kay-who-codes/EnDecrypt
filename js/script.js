// Function to convert text to binary
function textToBinary(text) {
  return text.split('').map((char) => {
    return char.charCodeAt(0).toString(2).padStart(8, '0'); // Convert to 8-bit binary
  }).join(' ');
}

// Function to convert binary to text
function binaryToText(binary) {
  return binary.split(' ').map((bin) => {
    return String.fromCharCode(parseInt(bin, 2));
  }).join('');
}

// Function to encrypt text
function encrypt(text, key) {
  // Step 1: Convert text to binary
  const binaryText = textToBinary(text);
  // Step 2: Encode binary output using Base64
  const base64Text = btoa(binaryText);
  // Step 3: Encrypt Base64 output using AES
  const encrypted = CryptoJS.AES.encrypt(base64Text, key).toString();
  return encrypted;
}

// Function to decrypt text
function decrypt(text, key) {
  try {
    // Step 1: Decrypt AES output using the key
    const decryptedBytes = CryptoJS.AES.decrypt(text, key);
    const base64Text = decryptedBytes.toString(CryptoJS.enc.Utf8);
    if (!base64Text) throw new Error('Invalid key or encrypted text.');
    // Step 2: Decode Base64 output back to binary
    const binaryText = atob(base64Text);
    // Step 3: Convert binary back to text
    const originalText = binaryToText(binaryText);
    return originalText;
  } catch (e) {
    return 'Invalid key or encrypted text.';
  }
}

// DOM Elements
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const keyInput = document.getElementById('keyInput');
const modeToggle = document.querySelectorAll('input[name="mode"]');

// Function to Update Output Automatically
function updateOutput() {
  const text = inputText.value.trim();
  const key = keyInput.value.trim();
  const selectedMode = document.querySelector('input[name="mode"]:checked').value;

  if (text && key) {
    if (selectedMode === 'encrypt') {
      outputText.value = encrypt(text, key);
    } else {
      outputText.value = decrypt(text, key);
    }
  } else {
    outputText.value = '';
  }
}

// Event Listeners
inputText.addEventListener('input', updateOutput);
keyInput.addEventListener('input', updateOutput);
modeToggle.forEach((radio) => {
  radio.addEventListener('change', updateOutput);
});