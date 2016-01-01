#!/bin/bash

echo "Simple script to rebuild your local docker base images based on tag"
if [ $# -eq 0 ]; then
 echo ' Failed - Not enough arguments, please pass tag for base image'
 exit 1
fi
# 	True of the length if "STRING" is zero.
if  [  -z $1  ] ; then
 echo ' Failed - Not enough arguments, please pass tag for base image'
 exit 1
fi
BASEIMAGE=Dockerfile.base.$1
if [ ! -e $BASEIMAGE ]; then
 echo "Failed - Dockerfile for base image $BASEIMAGE does not exist"
 exit 1
fi
DEVIMAGE=Dockerfile.dev.$1
if [ ! -e $DEVIMAGE ]; then
 echo "Failed - Dockerfile for dev image $DEVIMAGE does not exist"
 exit 1
fi

echo docker build -f $BASEIMAGE -t pufftml-base/$1 .
docker build -f Dockerfile.base.$1 -t pufftml-base/$1 .

echo docker build -f $DEVIMAGE -t pufftml-base/dev-$1 .
docker build -f Dockerfile.dev.$1 -t pufftml-base/dev-$1 .
