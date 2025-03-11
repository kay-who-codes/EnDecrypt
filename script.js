// Helper function for Caesar Cipher (shift by 10)
function caesarCipher(text, shift = 10) {
  return text.split('').map((char) => {
    if (/[a-zA-Z]/.test(char)) {
      const base = char === char.toLowerCase() ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
      return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
    } else if (/[0-9]/.test(char)) {
      return String.fromCharCode(((char.charCodeAt(0) - '0'.charCodeAt(0) + shift) % 10) + '0'.charCodeAt(0));
    } else {
      return char; // Leave non-alphanumeric characters unchanged
    }
  }).join('');
}

// Function to encrypt text
function encrypt(text, key) {
  // Step 1: Apply Caesar Cipher
  const caesarText = caesarCipher(text, 10);
  // Step 2: Apply Base64 Encoding
  const base64Text = btoa(caesarText);
  // Step 3: Apply AES Encryption
  const encrypted = CryptoJS.AES.encrypt(base64Text, key).toString();
  return encrypted;
}

// Function to decrypt text
function decrypt(text, key) {
  try {
    // Step 1: Apply AES Decryption
    const decryptedBytes = CryptoJS.AES.decrypt(text, key);
    const base64Text = decryptedBytes.toString(CryptoJS.enc.Utf8);
    if (!base64Text) throw new Error('Invalid key or encrypted text.');
    // Step 2: Apply Base64 Decoding
    const caesarText = atob(base64Text);
    // Step 3: Reverse Caesar Cipher
    const originalText = caesarCipher(caesarText, -10); // Shift back by 10
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