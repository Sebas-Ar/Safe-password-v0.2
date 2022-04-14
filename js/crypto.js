const encrypt = (message) => {
    return CryptoJS.AES.encrypt(message, 'Secret Passphrase').toString()
}

const decrypt = (encrypted) => {
    return CryptoJS.AES.decrypt(encrypted, 'Secret Passphrase').toString(CryptoJS.enc.Utf8)
}

export {
    encrypt,
    decrypt
}
