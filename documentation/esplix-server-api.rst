Esplix Server API
====================

Functions
-----------

getContractInstanceIDs(context, args)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Returns all instance IDs from a specific context.

args: none.

getFields(context, args)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Returns all fields from a contract.

args: chainID.

getApplicableActions(context, args)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Returns all applicable actions from a contract.

args: chainID.

getActionParams(context, args)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Returns all params of a specific action.

args: chainID, actionName.

performAction(context, args)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Performs an action in a contract.

args: chainID, actionName, actionArgs.

createContractInstance(context, args)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Creates a new contract instance.

args: contractHash, params.

Sample Code
-----------
Before running this sample, make sure you start the server. You can then connect to it using the ``jayson`` npm module::

  const jayson = require("jayson");
  const client =  jayson.client.http("http://localhost:5535/alice/jsonrpc");

  client.request('createContractInstance', ["a7d3410a253e8754f8d9676e74c21af82ccd4e7866441417007d721638b4533c", {SELLER: "0000"}], function(err, response) {
    if(err) throw err;
    console.log("Contract instance ID: "+response.result);

    client.request('getFields', [response.result], function(err, response) {
      if(err) throw err;
      console.log("Contract fields:");
      console.log(response.result);
    });
  });
