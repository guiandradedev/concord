#!/usr/bin/env bash

set -euo pipefail

readonly bootstrap_server="${KAFKA_BOOTSTRAP_SERVER:-kafka:9092}"

until /opt/kafka/bin/kafka-broker-api-versions.sh \
  --bootstrap-server "$bootstrap_server" > /dev/null 2>&1
do
  sleep 2
done

/opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server "$bootstrap_server" \
  --create \
  --if-not-exists \
  --topic my-topic \
  --partitions 1 \
  --replication-factor 1
