const crypto = require('crypto');
const key = 'a_secret_key';
console.log('Secret key: ', key)
const iv = crypto.randomBytes(16);
const iv64 = iv.toString('base64')
console.log('iv: ', iv)
function sha256Hash(input) {
    const hash = crypto.createHash('sha256');
    const hashed = hash.update(input, 'utf-8').digest();
    console.log('Hashed key: \nfrom: ' + input);
    console.log( 'to: ', hashed )
    return hashed;
}
  
function encrypt(data, key, iv, algorithm = 'aes-256-cbc') {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
}


function encryptData() {
    const data = 'Hello, World!';
    
    const secretKey = sha256Hash(key);
    console.log("Secret Key: ", secretKey)
    
    const encryptedData = encrypt(data, secretKey, iv);

    console.log('Encrypted Data:', encryptedData);
    return encryptedData;
}

// ===========================================================================

function decrypt(encryptedData, key, iv, algorithm = 'aes-256-cbc') {
  // Ensure the key is the correct length (32 bytes for AES-256-CBC)
  const keyBuffer = Buffer.from(key, 'utf-8').slice(0, 32);

  // Convert the IV from a hexadecimal string to a Buffer
  const ivBuffer = Buffer.from(iv, 'hex');

  // Create the decipher
  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);

  // Decrypt the data
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
  decryptedData += decipher.final('utf-8');

  return decryptedData;
}

// Example usage
const encryptedData = encryptData(); // Replace with your actual encrypted data

const secretKey = sha256Hash(key);

const decryptedData = decrypt(encryptedData, secretKey, Buffer.from(iv64, 'base64'));

console.log('Decrypted Data:', decryptedData);

