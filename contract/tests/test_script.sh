#!/bin/bash

KEYPAIR=./tests/test_keypair.json
AUTHORITY=~/.config/solana/id.json

exception() {
  echo "Error: $1"
  exit 1
}

run_validator() {
  echo "==> Running solana test validator"
  solana-test-validator -r 1> /dev/null &
  VALIDATOR_PID=$!
  echo "==> Solana-test-validator PID: $VALIDATOR_PID"
}

test() {
  sleep 5 
  echo "==> Deploying program to test validator and running tests"
  export ANCHOR_WALLET=$AUTHORITY
  (anchor deploy --program-keypair $KEYPAIR --program-name sub_service 1> /dev/null &&
   anchor test state --skip-local-validator --skip-build --skip-deploy &&
   anchor test user --skip-local-validator --skip-build --skip-deploy &&
   anchor test service --skip-local-validator --skip-build --skip-deploy &&
   anchor test general --skip-local-validator --skip-build --skip-deploy)
}

cleanup() {
  echo "==> Test validator shut down"
  kill -9 $VALIDATOR_PID
}

run_validator
test
cleanup
