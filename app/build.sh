git pull
npm i
npm run build
sudo rm -rf $REX_PATH/*
sudo mv dist $REX_PATH
cd $REX_PATH/dist
sudo mv * ..