const { response } = require("express");
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
      else if (sheet.name.startsWith("first-page"))
        sheetDetails.firstPage = true;
      else if (sheet.name.startsWith("last-page")) sheetDetails.lastPage = true;
      else sheetDetails.innerSheetsCount++;
    }

    res.status(200).json({
      sheetNames,
      sheetDetails,
    });
  } catch (e) {
    res.status(500).send(e);
  }
};

const postSheets = async (req, res = response) => {};

module.exports = {
  getSheet,
  getSheetNames,
  postSheets,
};
