#!/bin/bash
. ../Config/global.conf
trap ctrl_c INT

function ctrl_c() {
        cmd="s/$api_server_port/<<insert_port_here>>/g"
		sed -i $cmd src/server.js
}

cmd="s/<<insert_port_here>>/$api_server_port/g"
sed -i $cmd src/server.js
npm start
ctrl_c
