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

## Copyright & License information

Copyright (c) 2016-2018 ChromaWay AB. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.

You may find the License in file named LICENSE or [here](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

