#!/bin/bash
#############################################################
#                                                           #
#                  Defining Commands                        #
#                                                           #
#############################################################

scriptName="ServerWebservice"

comments=()
commands=()

comments+=("Installing npm dependecies")
commands+=("npm install")

comments+=("Installing classnames")
commands+=("npm install classnames --save")

comments+=("Installing query-string")
commands+=("npm install query-string --save")

comments+=("Installing Typescript")
commands+=("npm install typescript --save")

comments+=("Installing PrimeReact")
commands+=("npm install primereact --save --force")

comments+=("Installing PrimeIcons")
commands+=("npm install primeicons --save")

comments+=("Installing types Node")
commands+=("npm install @types/node --save")

comments+=("Installing types React")
commands+=("npm install @types/react --save")

comments+=("Installing types React-Dom")
commands+=("npm install @types/react-dom --save")

comments+=("Installing npm audit fix")
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