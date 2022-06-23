const fetch = require("cross-fetch");
const { response } = require("express");

const getSheets = async (req, res = response) => {
  const { code } = req.query;
};

const postSheets = async (req, res = response) => {};

module.exports = {
  getArtworks,
  postSheets,
};
