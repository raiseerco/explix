# Esplix

This repository contains Esplix JS library which implements the official Esplix API.

Esplix library depends on low-level execution engine called Ratatosk. Esplix API abstracts low-level execution details and offers
simplified API suitable for web UI and other uses.

End users won't be able to install this library directly because it is contained in a private repository.

For this reasons, we offer esplix-sdk package which is built from this repository using webpack.

## Install 

For technical reasons(see below), Ratatosk engine needs to be installed separately. A simple way to do it is 
to run `install-ratatosk.sh` script. The whole sequence:

    git clone git@bitbucket.org:chromawallet/esplix.git
    cd esplix
    bash install-ratatosk.sh
    npm install
    npm run compile
    npm run test

`npm run compile` is needed after each modification.


## Building SDK

Running the following command:

    npm run build-sdk
    
produces esplix-sdk-0.0.1.tgz, which is an npm package which can be published or used in package.json, for example:

    "esplix-sdk": "../esplix-sdk-0.0.1.tgz",
    
