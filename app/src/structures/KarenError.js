class KarenError extends Error {
    constructor(message) {
        super(message);
      
        this.name = "KarenError";
    }
}

module.exports = KarenError;