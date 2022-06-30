const { response, request } = require("express");
const Storage = require("../models/storage");

const getSheet = async (req, res = response) => {
  const { containerName, name } = req.query;
  console.log(`Received ${name}`);

  try {
    const storage = new Storage();
    const bufferObj = await storage.getPhotoFromContainer(containerName, name);
    console.log(`Sending ${name}`);
    res
      .status(200)
      .json({ image: `data:image/jpg;base64,${bufferObj.toString("base64")}` });
  } catch (e) {
    res.status(500).send(e);
  }
};

const getSheetNames = async (req, res) => {
  const { containerName } = req.query;

  try {
    const storage = new Storage();
    let iterator = await storage.getPhotoListFromContainer(containerName);

    let sheetNames = [];
    let sheetDetails = {
      cover: false,
      firstPage: false,
      lastPage: false,
      innerSheetsCount: 0,
    };
    for await (const sheet of iterator) {
      sheetNames.push(sheet.name);
      if (sheet.name.startsWith("cover")) sheetDetails.cover = true;
      else if (sheet.name.startsWith("first")) sheetDetails.firstPage = true;
      else if (sheet.name.startsWith("last")) sheetDetails.lastPage = true;
      else sheetDetails.innerSheetsCount++;
    }

    res.status(200).json({
      sheetNames,
      sheetDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const postSheets = async (req, res, next) => {
  const { title } = req.body;
  const storage = new Storage();
  const { createContainerResponse, containerName } =
    await storage.createContainer(title);

  if (!createContainerResponse.requestId) {
    console.log(createContainerResponse);
    res.status(500).json({
      message: "error",
      ...createContainerResponse,
    });
    return;
  }

  try {
    await storage.uploadImages(containerName, req.files);
  } catch (e) {
    res.status(500).json({ message: "error", error: e });
    await storage.deleteContainer(containerName);
    return;
  } finally {
    console.log("Uploaded");
  }
  res.status(200).json({ message: "success", containerId: containerName });
};

module.exports = {
  getSheet,
  getSheetNames,
  postSheets,
};
