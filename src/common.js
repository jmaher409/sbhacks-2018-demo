module.exports = {
    isValidMessage(parsed) {
        return parsed && parsed.from && parsed.content;
    }
} 