const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

// Envia o arquivo recebido pelo Multer ao Cloudinary.
function enviarImagemMembro(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ionos/membros",
        resource_type: "image"
      },
      (error, resultado) => {
        if (error) {
          return reject(error);
        }

        resolve({
          imagemUrl: resultado.secure_url,
          imagemPublicId: resultado.public_id
        });
      }
    );

    Readable
      .from(file.buffer)
      .pipe(stream);
  });
}

// Remove uma imagem pelo identificador do Cloudinary.
async function excluirImagemMembro(publicId) {
  if (!publicId) {
    return;
  }

  const resultado = await cloudinary.uploader.destroy(
    publicId,
    { resource_type: "image" }
  );

  if (
    resultado.result !== "ok" &&
    resultado.result !== "not found"
  ) {
    throw new Error(
      "Não foi possível excluir a imagem do Cloudinary."
    );
  }
}

module.exports = {
  enviarImagemMembro,
  excluirImagemMembro
};