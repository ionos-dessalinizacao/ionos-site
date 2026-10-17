const cloudinary = require("../config/cloudinary");

// ==========================================
// ENVIAR IMAGEM PARA O CLOUDINARY
// ==========================================

async function enviarImagemArquivo(arquivo, pasta) {

  return new Promise((resolve, reject) => {

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `ionos/${pasta}`,
        resource_type: "image"
      },

      (error, resultado) => {

        if (error) {

          console.error(
            "Erro ao enviar imagem para o Cloudinary:",
            error
          );

          return reject(error);
        }

        resolve({
          url: resultado.secure_url,
          publicId: resultado.public_id
        });

      }
    );

    uploadStream.end(arquivo.buffer);

  });

}

module.exports = {
  enviarImagemArquivo
};