# Blockchain_Origin_Tracking

Need to get docker (latest version recommended), wsl2 (windows), npm (10.2.3 recommended), node (20.10.0 recommended)

### HOW TO RUN?
- Step 0: Clone code in your Linux Environment
```
git clone https://github.com/devilkun1/Blockchain_Origin_Tracking.git
cd Blockchain_Origin_Tracking
```
- Step 1: Start docker. Then move to path 'hyperledger-fabric' and run bash file in terminal
```
cd hyperledger-fabric
./install-fabric.sh
```
- Step 2: Continue move to path 'fabric-samples/test-network'
```
cd fabric-samples/test-network
```
- Step 3: Stop running containers/images to avoid conflicting by command
```
./network.sh down
```
- Step 4: Create channel with Certificate Authorities
```
./network.sh up createChannel -c mychannel -ca
```
- Step 5: Deploy the chaincode
```
./network.sh deployCC -ccn basic -ccp ../../../chaincode-custom/ -ccl javascript
```
- Step 6: Back to project directory (Blockchain_Origin_Tracking), install all packages in file package.json
```
cd ~/Blockchain_Origin_Tracking
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
