// Note: test does not automatically launch the server, so you should
// launch Esplix Server with testdata

const jayson = require("jayson");
const expect = require("chai").expect;

const client =  jayson.client.http("http://localhost:5535/alice/jsonrpc");

function request(name, args) {
    return new Promise( (resolve, reject) => {
        try {
            client.request(name, args, (error, response) => {
                console.log(response);
                if (error) reject(error);
                else resolve(response.result);
            });
        } catch (e) {
            reject(e);
        }
    });
}

describe("Esplix Server tests", function () {
    this.timeout(50000);

    it("No instances", async () => {
        expect(await request("getContractInstanceIDs", [])).to.be.an('array').with.lengthOf(0);
    });

    it("Create instance", async () => {
        const instanceID = await request("createContractInstance",
            ["a7d3410a253e8754f8d9676e74c21af82ccd4e7866441417007d721638b4533c", {
                SELLER: "0000"
            }]);
        expect(instanceID).to.be.a('string').with.lengthOf(64);
    })

});
