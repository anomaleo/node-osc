node-osc (0.1.0)

This repository contains the initial implementation of a node based OpenSoundControl 
middleware that captures, corrects and re-routes incoming OSC messages from ZIGSIM to Max 
or any other OSC listening client on a local machine. 

Software Requirements: 
Install the latest Node.js LTS distribution from here https://nodejs.org/en.

Running node-osc from source code
Clone this repository: git clone git@github.com:anomaleo/node-osc.git
Navigate to repository folder: cd node-osc
Install dependencies: npm install
Run: node index.js 8010 8011 /OSC/NAMESPACE
