#!/bin/sh

mkdir -p .tmp
mkdir -p node-webkit/Linux64
mkdir -p node-webkit/MacOS
mkdir -p node-webkit/Windows

if [ -f '.tmp/linux64.tar.gz' ];
then
   echo "Linux already downloaded"
else
   echo "Downloading linux..."
   curl http://dl.node-webkit.org/v0.9.2/node-webkit-v0.9.2-linux-x64.tar.gz > .tmp/linux64.tar.gz
fi

if [ -f '.tmp/windows.zip' ];
then
   echo "Windows already downloaded"
else
   echo "Downloading windows..."
   curl http://dl.node-webkit.org/v0.9.2/node-webkit-v0.9.2-win-ia32.zip> .tmp/windows.zip
fi

if [ -f '.tmp/osx.zip' ];
then
   echo "OS X already downloaded"
else
   echo "Downloading OS X..."
   curl http://dl.node-webkit.org/v0.9.2/node-webkit-v0.9.2-osx-ia32.zip > .tmp/osx.zip
fi

if [ -d 'resources/node-webkit/Linux64' ];
then
   echo "Linux already extracted"
else
   echo "Extracting linux..."
   mkdir -p resources/node-webkit/
   tar zxvf  .tmp/linux64.tar.gz -C resources/node-webkit/
   mv resources/node-webkit/node-webkit-v0.9.2-linux-x64 resources/node-webkit/Linux64
fi

if [ -d 'resources/node-webkit/MacOS' ];
then
   echo "OS X already extracted"
else
   echo "Extracting OS X..."
   mkdir -p resources/node-webkit/
   unzip .tmp/osx.zip -d resources/node-webkit/MacOS
fi

if [ -d 'resources/node-webkit/Windows' ];
then
   echo "Windows already extracted"
else
   echo "Extracting Window..."
   mkdir -p resources/node-webkit/
   unzip .tmp/windows.zip -d resources/node-webkit/Windows
fi

