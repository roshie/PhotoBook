const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
require("dotenv").config();

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw Error("Azure Storage Connection string not found");
}

class Storage {
  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
  }

  async getPhotoListFromContainer(containerName) {
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    return containerClient.listBlobsFlat();
  }

  async getPhotoFromContainer(containerName, blobName) {
    /**
     * @param containerName - name of the container
     * @param blobName - name of the blob/sheet
     * @returns dataStream
     */
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded = await streamToBuffer(
      downloadBlockBlobResponse.readableStreamBody
    );
    return downloaded;
  }

  async uploadImages(containerName, files) {
    try {
      const containerClient =
        this.blobServiceClient.getContainerClient(containerName);

      for (const file of files) {
        const blockBlobClient = await containerClient.getBlockBlobClient(
          file.originalname
        );
        // Upload buffer
        await blockBlobClient.uploadData(file.buffer);
      }
    } catch (e) {
      console.log(e);
      return { message: "error" };
    }
  }

  async createContainer(name) {
    /**
     * @param title - title of the container
     * @returns { createContainerResponse, containerName }
     */
    name = name.replace(/[^a-z0-9]/gi, "");
    const containerName =
      name.substring(0, name.length > 15 ? 15 : name.length).toLowerCase() +
      uuidv1().substring(0, 8);
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    // Create the container
    const createContainerResponse = await containerClient.create();
    return { createContainerResponse, containerName };
  }

  async deleteContainer(containerName) {
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    const deleteContainerResponse = await containerClient.delete();
    return deleteContainerResponse;
  }
}

// utility Function
const streamToBuffer = async (readableStream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
};

const randomStr = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = Storage;
