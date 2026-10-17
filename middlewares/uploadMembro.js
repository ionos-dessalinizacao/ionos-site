const multer = require("multer");

const uploadMembro = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },

  fileFilter(req, file, callback) {
    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!tiposPermitidos.includes(file.mimetype)) {
      return callback(
        new Error("Envie uma imagem JPG, PNG ou WEBP.")
      );
    }

    callback(null, true);
  }
});

module.exports = uploadMembro;