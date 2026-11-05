#!/usr/bin/env bash
export DEBIAN_FRONTEND=noninteractive


apt-get update -y
apt-get install -y openjdk-21-jdk-headless git


mkdir -p /home/application
cd /home/application
rm -rf concord
git clone -b ${BRANCH_NAME} ${REPO_URL} concord

# Navega para a pasta webserver
cd concord/webserver || { echo "Erro: Pasta concord/webserver não encontrada!"; exit 1; }
chmod +x mvnw
./mvnw clean package -DskipTests

cat <<EOT > /etc/systemd/system/concord-backend.service
[Unit]
Description=Concord Spring Boot API
After=network.target

[Service]
User=root
WorkingDirectory=/home/application/concord/webserver
Environment="SERVER_PORT=8082"
Environment="DATABASE_URL=jdbc:mysql://10.20.30.3:3306/mydb?createDatabaseIfNotExist=true"
Environment="DATABASE_USERNAME=${DB_USER}"
Environment="DATABASE_PASSWORD=${DB_PASS}"
Environment="ALLOWED_ORIGIN_URL=${ALLOWED_ORIGIN_URL}"
Environment="KAFKA_BOOTSTRAP_SERVERS=10.20.30.4:9092"
Environment="JWT_SECRET=${JWT_SECRET}"
ExecStart=/usr/bin/java -jar /home/application/concord/webserver/target/demo-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOT

systemctl daemon-reload
systemctl enable --now concord-backend