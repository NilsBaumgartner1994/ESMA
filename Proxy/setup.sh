#!/bin/bash
#############################################################
#                                                           #
#          Performing Commands are on the Bottom            #
#                                                           #
#############################################################

scriptName="API"

comments=()
commands=()

comments+=("Installing latest npm version")
commands+=("curl -L https://www.npmjs.com/install.sh | sh")

comments+=("Installing npm dependecies")
commands+=("npm install")

comments+=("Installing Babel Class Properties Plugin, for accessing Class Variables")
commands+=("npm install --save-dev @babel/plugin-proposal-class-properties")

comments+=("Installing npm winston (Logger Software)")
commands+=("npm install winston --save")

comments+=("Installing npm winston daily rotate (Logger Software)")
commands+=("npm install winston-daily-rotate-file --save")

comments+=("Security: Installing npm helmet (Logger Software)")
commands+=("npm install helmet --save")

comments+=("Installing npm file System")
commands+=("npm install file-system --save")

comments+=("Installing npm mySQL")
commands+=("npm install mysql --save")

comments+=("Installing npm Schedule")
commands+=("npm install node-schedule --save")

comments+=("Installing npm Systeminformation")
commands+=("npm install systeminformation --save")

comments+=("Installing Firebase Admin")
commands+=("npm install firebase-admin --save")

comments+=("Installing npm path")
commands+=("npm install path --save")

comments+=("Installing plugin-proposal-class-properties")
commands+=("npm i @babel/plugin-proposal-class-properties")

comments+=("Installing @babel/preset-env")
commands+=("npm i @babel/preset-env")

comments+=("Installing @babel/preset-react")
commands+=("npm i @babel/preset-react")

comments+=("Installing babel-polyfill")
commands+=("npm i babel-polyfill")

comments+=("Installing http-status-codes")
commands+=("npm i http-status-codes")

comments+=("Installing express-http-proxy")
commands+=("npm i express-http-proxy")

comments+=("Installing express-basic-auth")
commands+=("npm i express-basic-auth")



comments+=("Running npm audit fix")
commands+=("npm audit fix")

#############################################################
#                    Arguments parsing                      #
#############################################################

POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -ps|--percentagestart)
    PERCENTAGESTART="$2"
    shift # past argument
    shift # past value
    ;;
    -pe|--percentageend)
    PERCENTAGEEND="$2"
    shift # past argument
    shift # past value
    ;;
    -v|--verbose)
    VERBOSE="-v"
    shift # past argument
    ;;
    -h|--help)
    HELP=YES
    shift # past argument
    ;;
    *)    # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

if [[ -n $1 ]]; then
    echo "Unkown Argument: ${1}"
    echo "Use -h for Help"
    exit
fi

if [[ $HELP = YES ]]; then
    echo "Possible Parameters:"
    echo "-ps <1...100>      (Percentage Start: Default 1)"
    echo "-pe <1...100>      (Percentage End: Default 100)"
    echo "-v                 (Verbose: Shows output log)"
    echo "-h                 (Help: Shows this output)"
    exit
fi

PERCENTAGESTARTVARIABLE=${PERCENTAGESTART:-1}
PERCENTAGEENDVARIABLE=${PERCENTAGEEND:-100}
VERBOSEVARIABE=${VERBOSE:-" "}


#############################################################
#                    Progress Bar                           #
#############################################################
prog() {
    local w=80 percentagegiven=$1;  shift
    p=$((percentagegiven*(PERCENTAGEENDVARIABLE-PERCENTAGESTARTVARIABLE)/100+PERCENTAGESTARTVARIABLE))
    # print those dots on a fixed-width space plus the percentage etc. 
    printf "\r\033[K| \e[32m%3d %%\e[0m | %s" "$(tput cols)" "" "$p" "$*"; 
}


#############################################################
#                  Verbose Mode Set                         #
#############################################################

VERBOSEMODE="&>/dev/null"
if [[ $VERBOSEVARIABE = "-v" ]]
then
    VERBOSEMODE=""
fi

run(){
	eval "$* ${VERBOSEMODE}"
}


#############################################################
#                                                           #
#                 Performing Commands                       #
#                                                           #
#############################################################

prog 1 ${scriptName}: Setup Start

commandsSize=${#commands[@]}
progressPercent=1

for i in "${!comments[@]}"; do 
  prog ${progressPercent} ${scriptName}: ${comments[$i]}
  run ${commands[$i]}  
  progressPercent=$((100*(i+1)/commandsSize))
done

prog 100 ${scriptName}: Setup Complete
echo ""

