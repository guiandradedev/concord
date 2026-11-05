#!/usr/bin/env bash
export DEBIAN_FRONTEND=noninteractive


sudo apt-get -y update

export DEBIAN_FRONTEND=noninteractive
apt-get install -y git curl nginx iptables-persistent

cat > /etc/sysctl.d/99-concord-gateway.conf <<'EOF'
net.ipv4.ip_forward=1
EOF

sysctl -p /etc/sysctl.d/99-concord-gateway.conf

WAN_IF=$(ip route show default | awk '{print $5; exit}')

# Encaminha o DNS recebido em 10.20.30.1 para o DNS do NAT do VirtualBox.
iptables -t nat -C PREROUTING -d 10.20.30.1 -p udp --dport 53 -j DNAT --to-destination 10.0.2.3 2>/dev/null || \
    iptables -t nat -A PREROUTING -d 10.20.30.1 -p udp --dport 53 -j DNAT --to-destination 10.0.2.3
iptables -t nat -C PREROUTING -d 10.20.30.1 -p tcp --dport 53 -j DNAT --to-destination 10.0.2.3 2>/dev/null || \
    iptables -t nat -A PREROUTING -d 10.20.30.1 -p tcp --dport 53 -j DNAT --to-destination 10.0.2.3

iptables -t nat -C POSTROUTING -s 10.20.30.0/28 -o "$WAN_IF" -j MASQUERADE 2>/dev/null || \
    iptables -t nat -A POSTROUTING -s 10.20.30.0/28 -o "$WAN_IF" -j MASQUERADE
iptables -C FORWARD -s 10.20.30.0/28 -o "$WAN_IF" -j ACCEPT 2>/dev/null || \
    iptables -I FORWARD 1 -s 10.20.30.0/28 -o "$WAN_IF" -j ACCEPT
iptables -C FORWARD -d 10.20.30.0/28 -i "$WAN_IF" -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT 2>/dev/null || \
    iptables -I FORWARD 1 -d 10.20.30.0/28 -i "$WAN_IF" -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
netfilter-persistent save

curl -fsSL https://deb.nodesource.com/setup_24.x | bash -

apt-get install -y nodejs

mkdir -p /home/application
cd /home/application
if [ ! -d /home/application/concord ]; then
    git clone -b ${BRANCH_NAME} ${REPO_URL} concord
fi

cd /home/application/concord/frontend

cat <<'EOF' > .env.production
VITE_BACKEND_URL=/api
VITE_REALTIME_GATEWAY_URL=http://localhost:8069
EOF

npm ci
npm run build


cat <<'EOT' > /etc/systemd/system/concord-frontend.service
[Unit]
Description=Concord Frontend
After=network.target

[Service]
User=root
WorkingDirectory=/home/application/concord/frontend
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm run start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOT

cp ../infra/nginx-reverse-proxy.conf /etc/nginx/sites-available/concord
sed -i 's|frontend:3000|127.0.0.1:3000|' /etc/nginx/sites-available/concord
sed -i 's|webserver:8082|10.20.30.2:8082|' /etc/nginx/sites-available/concord
sed -i 's|realtime-gateway:3000|10.20.30.5:3000|' /etc/nginx/sites-available/concord

ln -sf /etc/nginx/sites-available/concord /etc/nginx/sites-enabled/concord
rm -f /etc/nginx/sites-enabled/default

systemctl daemon-reload
systemctl enable --now concord-frontend

systemctl restart nginx