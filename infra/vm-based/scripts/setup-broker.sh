#!/usr/bin/env bash
set -e

export DEBIAN_FRONTEND=noninteractive

apt-get update -y
apt-get install -y curl openjdk-17-jre-headless

id kafka >/dev/null 2>&1 || useradd --system --home-dir /opt/kafka --shell /usr/sbin/nologin kafka

if [ ! -x /opt/kafka/bin/kafka-server-start.sh ]; then
    curl --retry 3 -fsSL https://dlcdn.apache.org/kafka/4.3.1/kafka_2.13-4.3.1.tgz -o /tmp/kafka.tgz
    mkdir -p /opt/kafka
    tar -xzf /tmp/kafka.tgz --strip-components=1 -C /opt/kafka
    rm -f /tmp/kafka.tgz
fi

mkdir -p /var/lib/kafka/data

cat > /opt/kafka/config/server.properties <<'EOF'
process.roles=broker,controller
node.id=1
controller.quorum.bootstrap.servers=localhost:9093
listeners=PLAINTEXT://0.0.0.0:9092,CONTROLLER://0.0.0.0:9093
advertised.listeners=PLAINTEXT://10.20.30.4:9092
listener.security.protocol.map=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
controller.listener.names=CONTROLLER
inter.broker.listener.name=PLAINTEXT
log.dirs=/var/lib/kafka/data
num.partitions=1
offsets.topic.replication.factor=1
transaction.state.log.replication.factor=1
transaction.state.log.min.isr=1
auto.create.topics.enable=true
EOF

chown -R kafka:kafka /opt/kafka /var/lib/kafka

if [ ! -f /var/lib/kafka/data/meta.properties ]; then
    KAFKA_CLUSTER_ID=$(/opt/kafka/bin/kafka-storage.sh random-uuid)
    runuser -u kafka -- /opt/kafka/bin/kafka-storage.sh format --standalone -t "$KAFKA_CLUSTER_ID" -c /opt/kafka/config/server.properties
fi

cat > /etc/systemd/system/kafka.service <<'EOF'
[Unit]
Description=Apache Kafka
Wants=network-online.target
After=network-online.target concord-default-route.service

[Service]
Type=simple
User=kafka
Group=kafka
WorkingDirectory=/opt/kafka
Environment="KAFKA_HEAP_OPTS=-Xms256m -Xmx512m"
ExecStart=/opt/kafka/bin/kafka-server-start.sh /opt/kafka/config/server.properties
ExecStop=/opt/kafka/bin/kafka-server-stop.sh
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable kafka
systemctl restart kafka

for attempt in $(seq 1 30); do
    if /opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server 10.20.30.4:9092 >/dev/null 2>&1; then
        break
    fi
    sleep 2
done

mkdir -p /home/application
cd /home/application
rm -rf concord
git clone --branch "${BRANCH_NAME}" --single-branch "${REPO_URL}" concord
cd concord/infra/kafka

chmod +x init-topics.sh
KAFKA_BOOTSTRAP_SERVER=10.20.30.4:9092 ./init-topics.sh