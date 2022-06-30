const expect = require("chai").expect;
const Storage = require("../models/storage");

const testContainer = "dinesh-kiruthika-a2d7e5";
const testBlobName = "1.jpg";
const testURL = "https://gravitystudio.blob.core.windows.net/";
const testTitle = "Liara's Baptism Album";

describe("Testing Azure Blob Storage - Retrieval", function () {
  const storage = new Storage();
  this.timeout(60000);

  it("Is creating BlobServiceClient", () => {
    expect(storage.blobServiceClient.url).to.equal(testURL);
  });

  it("Is getting list of blobs from container", async () => {
    let iter = await storage.getPhotoListFromContainer(testContainer);
    expect((await iter.next()).value.name).to.equal(testBlobName);
  });

  it("Is getting a photo from a Container", async (done) => {
    setTimeout(done, 60000);
    let blobData = await storage.getPhotosFromContainer(
      testContainer,
      testBlobName
    );
    expect(typeof blobData).to.equal("string");
  });
});

describe("Testing Azure Blob Storage - Storing", function () {
  const storage = new Storage();
  it("Is creating Container", async () => {
    const response = await storage.createContainer(testTitle);
    console.log(response);
    expect(typeof response.createContainerResponse.requestId).to.equal(
      "string"
    );
  });
});
