// Note: test does not automatically launch the server, so you should
// launch Esplix Server with testdata
const server = require('../backend');
const jayson = require("jayson");
const expect = require("chai").expect;

let client;

function request(name, args) {
    return new Promise( (resolve, reject) => {
        try {
            client.request(name, args, (error, response) => {
                // console.log(response);
                if (error) reject(error);
                else if ('error' in response)
                    reject(Error(response.error.message || "RPC error"));
                else resolve(response.result);
            });
        } catch (e) {
            reject(e);
        }
    });
}

function createContractInstance() {
  return request("createContractInstance",
      ["d409381eaffef914af68948a923d27fbd8ee263fac24aba47f988eb8ceb110df", {
          SELLER: "0000"
      }]);
}

describe("Esplix Server tests", function () {
    this.timeout(50000);

    before(async () => {
      const contexts = await server.createContexts({});
      client = jayson.client(server.initJaysonServer(contexts[0]));
    });

    it("No instances", async () => {
        expect(await request("getContractInstanceIDs", [])).to.be.an('array').with.lengthOf(0);
    });

    it("Create instance", async () => {
        const instanceID = await createContractInstance();
        expect(instanceID).to.be.a('string').with.lengthOf(64);
    });

    it("gets field info", async () => {
        const instanceID = await createContractInstance();
        const fieldInfo = await request("getFieldInfo", [instanceID]);
        expect(fieldInfo).to.not.be.empty;
    })

});
