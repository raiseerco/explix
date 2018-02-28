# Esplix

This repository contains Esplix JS library which implements the official Esplix API.

Esplix library depends on low-level execution engine called Ratatosk. Esplix API abstracts low-level execution details and offers
simplified API suitable for web UI and other uses.

End users won't be able to install this library directly because it is contained in a private repository.

For this reasons, we offer esplix-sdk package which is built from this repository using webpack.

## Building SDK

Running the following command:

    npm run build-sdk
    
produces esplix-sdk-0.0.1.tgz, which is an npm package which can be published or used in package.json, for example:

    "esplix-sdk": "../esplix-sdk-0.0.1.tgz",
    
