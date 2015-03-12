#!/bin/bash

if [ ! -e node_modules/app-config.json ]
then
    ln -s ../app/app-config.json node_modules/app-config.json
fi

if [ ! -e node_modules/scripts ]
then
    ln -s ../app/scripts node_modules/scripts
fi
