# Auto-Scaling Node.js Application using Docker and Google Cloud

## Overview

This project demonstrates a **custom auto-scaling system** built from scratch using:

* Local VM monitoring
* Docker containerization
* Google Cloud VM provisioning

The system monitors CPU usage on a local machine and **automatically provisions new cloud VMs** when usage exceeds a threshold.

---

## Architecture

```
Local VM (Debian)
   ├── Node.js App (Dockerized)
   ├── CPU Monitoring Script
   └── Autoscaler Trigger
           ↓
Google Cloud Platform (GCP)
   ├── Instance Template
   └── Auto-created VMs
           └── Run Docker Container
```

---

## Tech Stack

* Node.js (Backend)
* Docker (Containerization)
* Bash (Automation Script)
* Google Cloud Platform (VM provisioning)
* mpstat (CPU Monitoring)

---

## Step 1: Node.js Application

A basic Express-based backend was created with endpoints such as:

* `/products`
* `/cart`
* `/checkout`

---

##  Step 2: Docker Setup

### Dockerfile

```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
```

### Build Image

```
docker build -t fashion-app .
```

### Run Container

```
docker run -p 3000:3000 fashion-app
```

---

## Step 3: Push to Registry

Using Docker Hub:

```
docker login
docker tag fashion-app <your-username>/fashion-app
docker push <your-username>/fashion-app
```

---

##  Step 4: GCP Instance Template

### Startup Script (`startup.sh`)

```bash
#!/bin/bash

exec > /var/log/startup-script.log 2>&1

apt-get update -y
apt-get install -y docker.io

systemctl start docker
systemctl enable docker

sleep 5

docker pull <your-username>/fashion-app
docker run -d -p 3000:3000 --restart always <your-username>/fashion-app
```

---

### Create Template

```
gcloud compute instance-templates create my-template \
  --machine-type=e2-medium \
  --image-family=debian-11 \
  --image-project=debian-cloud \
  --metadata-from-file startup-script=startup.sh
```

---

## 🧪 Step 5: Test VM Creation

```
gcloud compute instances create test-vm \
  --source-instance-template=my-template \
  --zone=us-central1-a
```

---

##  Step 6: Autoscaling Script

### autoscale.sh

```bash
#!/bin/bash

THRESHOLD=75
COOLDOWN=60
ZONE="us-central1-a"
TEMPLATE="my-template"
MAX_VMS=5

last_scale_time=0

get_cpu_usage() {
    read cpu user nice system idle iowait irq softirq steal guest < /proc/stat
    total1=$((user + nice + system + idle + iowait + irq + softirq + steal))
    idle1=$idle

    sleep 1

    read cpu user nice system idle iowait irq softirq steal guest < /proc/stat
    total2=$((user + nice + system + idle + iowait + irq + softirq + steal))
    idle2=$idle

    total_diff=$((total2 - total1))
    idle_diff=$((idle2 - idle1))

    cpu_usage=$((100 * (total_diff - idle_diff) / total_diff))
    echo $cpu_usage
}

while true; do
    cpu_usage=$(get_cpu_usage)

    echo "CPU Usage: $cpu_usage%"

    current_time=$(date +%s)
    time_diff=$((current_time - last_scale_time))

    vm_count=$(gcloud compute instances list \
        --filter="name:autoscaled-vm" \
        --format="value(name)" | wc -l)

    if [ "$cpu_usage" -gt "$THRESHOLD" ] && \
       [ $time_diff -gt $COOLDOWN ] && \
       [ $vm_count -lt $MAX_VMS ]; then

        vm_name="autoscaled-vm-$(date +%s)"

        gcloud compute instances create $vm_name \
            --source-instance-template=$TEMPLATE \
            --zone=$ZONE

        last_scale_time=$current_time
    fi

    sleep 10
done
```

---

##  Key Safeguards

* **Cooldown (60s):** prevents rapid scaling
* **Max VM Limit (5):** avoids excessive cost
* **Unique VM names:** avoids conflicts

---


## 🌐 Accessing Application

1. Get VM external IP
2. Open:

```
http://<external-ip>:3000
```

---

## Future Improvements

* Add Load Balancer
* Use Managed Instance Groups (MIG)
* Integrate Prometheus + AlertManager
* Move to Kubernetes (HPA)

---


