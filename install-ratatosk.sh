#!/bin/bash

cd ..
git clone git@bitbucket.org:chromawallet/ratatosk.git
cd ratatosk
npm install
npm run compile
