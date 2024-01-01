# Blockchain_Origin_Tracking

Need to get docker, wsl (windows), npm (10.2.3 recommended), node (20.10.0 recommended)

### HOW TO RUN?
- Step 1: From folder 'hyperledger-fabric', run bash file in terminal
```
./install-fabric.sh
```
- Step 2: Move to path fabric-samples/test-network
```
cd fabric-samples/test-network
```
- Step 3: Start docker, stop running containers/images to avoid conflicting by command
```
./network.sh down
```
- Step 4: Creat channel with Certificate Authorities
```
./network.sh up createChannel -c mychannel -ca
```
- Step 5: Deploy the chaincode
```
./network.sh deployCC -ccn basic -ccp ../../../chaincode-custom/ -ccl javascript
```
- Step 6: Back to project directory (Blockchain_Origin_Tracking), install all packages in file package.json
```
npm install
```
- Step 7: Start the web project
```
npm start
```
The app will be running on port 3000
```
http://localhost:3000
```