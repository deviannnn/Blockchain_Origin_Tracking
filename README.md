# Blockchain_Origin_Tracking

Need to get docker, wsl (windows), npm (10.2.3 recommended), node (20.10.0 recommended)

### HOW TO RUN?
#### *Please stay in project folder (Blockchain_Origin_Tracking) in all steps !!!
- Step 1: Run bash file to install Hyperledger Fabric (if installed, go straight to Step 2):
```
cd hyperledger-fabric;./install-fabric.sh
```
- Step 2: Do not forget to start docker first, then stop running containers/images by:
```
cd hyperledger-fabric/fabric-samples/test-network;./network.sh down
```
- Step 4: Create channel with Certificate Authorities:
```
cd hyperledger-fabric/fabric-samples/test-network;./network.sh up createChannel -c mychannel -ca
```
- Step 5: Deploy the chaincode:
```
cd hyperledger-fabric/fabric-samples/test-network;./network.sh deployCC -ccn basic -ccp ../../../chaincode-custom/ -ccl javascript
```
- Step 6: Back to project directory, install all packages in file package.json:
```
npm install
```
- Step 7: Start the web project:
```
npm start
```
The app will be running on port 3000
```
http://localhost:3000
```