// Note: test does not automatically launch the server, so you should
// launch Esplix Server with testdata
const server = require('../server');
const jayson = require("jayson");
const expect = require("chai").expect;

var client;

function request(name, args) {
    return new Promise( (resolve, reject) => {
        try {
            client.request(name, args, (error, response) => {
                // console.log(response);
                if (error) reject(error);
                else resolve(response.result);
            });
        } catch (e) {
            reject(e);
        }
    });
}

async function createContractInstance() {
  return request("createContractInstance",
      ["a7d3410a253e8754f8d9676e74c21af82ccd4e7866441417007d721638b4533c", {
          SELLER: "0000"
      }]);
}

describe("Esplix Server tests", function () {
    this.timeout(50000);

    before(async () => {
      const contexts = await server.createContexts();
      client = jayson.client(server.initJaysonServer(contexts[0]));
    });

    it("No instances", async () => {
        expect(await request("getContractInstanceIDs", [])).to.be.an('array').with.lengthOf(0);
    });

    it("Create instance", async () => {
        const instanceID = await createContractInstance();
        expect(instanceID).to.be.a('string').with.lengthOf(64);
    })

    it("gets field info", async () => {
        const instanceID = await createContractInstance();
        const fieldInfo = await request("getFieldInfo", [instanceID]);
        expect(fieldInfo).to.not.be.empty;
    })

});
