#!/usr/bin/env bash

set -e

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl git netcat-openbsd

curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

mkdir -p /home/application
cd /home/application
rm -rf concord
git clone --branch "${BRANCH_NAME}" --single-branch "${REPO_URL}" concord
cd concord/realtime-gateway

cat > .env <<EOF
PORT=3000
KAFKA_CLIENT_ID=${KAFKA_CLIENT_ID}
KAFKA_BROKERS=10.20.30.4:9092
EOF

npm ci
npm run build

cat > /etc/systemd/system/concord-gateway.service <<'EOF'
[Unit]
Description=Concord Realtime Gateway
Wants=network-online.target
After=network-online.target concord-default-route.service

[Service]
Type=simple
User=root
WorkingDirectory=/home/application/concord/realtime-gateway
Environment=NODE_ENV=production
ExecStartPre=/bin/sh -c 'until nc -z 10.20.30.4 9092; do sleep 2; done'
ExecStart=/usr/bin/npm run start
Restart=on-failure
RestartSec=5
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable concord-gateway
systemctl restart concord-gateway