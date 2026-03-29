# MAISON Fashion Studio: Auto-Scaling Node.js Application

## 1. Overview
This repository contains the implementation for the Auto-Scaling Node.js Application (referred to locally as "App") for MAISON Fashion Studio. The system is designed to monitor CPU usage on a local Virtual Machine. When utilisation exceeds a defined threshold, it automatically provisions new Google Cloud VMs to ensure uninterrupted service availability. 

The application itself is a full-featured Express.js backend serving a rich editorial frontend. It is containerised using Docker and deployed on GCP instances that are created on-demand by a custom Bash autoscaling engine.

* **Runtime:** Node.js 18 + Express  
* **Containerisation:** Docker  
* **Cloud Provider:** Google Cloud Platform (GCP)  
* **Monitoring:** `mpstat` CPU sampling + custom Bash autoscaler  
* **Scaling Trigger:** CPU usage > 75% for a 60-second cooldown window  
* **Max Cloud VMs:** 5 (configurable)  

## 2. Technology Stack
* **Node.js 18:** Express-based REST backend serving the Collection, Atelier, Moodboard, and Lookbook APIs.  
* **Docker:** Containerises the App for consistent, reproducible deployments across local and cloud environments.  
* **Docker Hub:** Central image registry where VMs pull the latest app image on startup.  
* **Bash:** Uses `autoscale.sh` to poll `mpstat` every 10 seconds and trigger `gcloud` when the CPU threshold is exceeded.  
* **GCP Compute:** Provisions on-demand Debian-11 `e2-medium` VMs from an instance template using the `gcloud` CLI.  
* **mpstat:** Provides low-level CPU measurement without requiring external agent dependencies.  

## 3. Application Structure & Endpoints
The backend exposes the following REST endpoints:
* `GET /api/designs` - List all designs  
* `POST /api/designs` - Create a new design  
* `DELETE /api/designs/:id` - Remove a design  

The static frontend (Collection, Atelier, Moodboard, Lookbook) is served from the `/public` directory. 

**Directory Structure:**
* `App/`
  * `package.json` (dependencies & scripts)  
  * `server.js` (Express server)  
  * `README.md`  
  * `Dockerfile`  
  * `public/`
    * `index.html`  
    * `style.css`  
    * `app.js`  

## 4. Step-by-Step Implementation

### Step 4.1: Docker Setup
Create a `Dockerfile` in the root directory:
```dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]
````

Build and run the image locally:

```bash
docker build -t app .
docker run -p 3000:3000 app
```

Tag and push to Docker Hub:

```bash
docker tag app <your-username>/app
docker push <your-username>/app
```

### Step 4.2: GCP Instance Template & Startup Script

When a new cloud VM boots, it automatically runs `startup.sh`. Save this script:

```bash
#!/bin/bash
exec > /var/log/startup-script.log 2>&1
apt-get update -y
apt-get install -y docker.io
systemctl start docker
systemctl enable docker
docker pull <your-username>/app
docker run -d -p 3000:3000 --restart always <your-username>/app
```

Register the GCP template using the `gcloud` CLI:

```bash
gcloud compute instance-templates create my-template \
--machine-type=e2-medium \
--image-family debian-11 \
--image-project-debian-cloud \
--metadata-from-file startup-script=startup.sh
```

### Step 4.3: The Autoscaler Daemon

The `autoscale.sh` script runs as a background daemon on the local VM. It enforces a 60-second cooldown period, a 5 VM maximum cap, and uses timestamp suffixes to avoid naming collisions.

Save as `autoscale.sh` and make executable (`chmod +x`):

```bash
#!/bin/bash
THRESHOLD=75
COOLDOWN=60
ZONE="us-central1-a"
TEMPLATE="my-template"
MAX_VMS=5
last_scale_time=0

while true; do
  now=$(date +%s)
  idle=$(mpstat 1 1 | awk '/Average/ {print $NF}')
  cpu_usage=$(echo "100 - $idle" | bc)
  
  vms=$(gcloud compute instances list \
    --filter="name: autoscaled-vm" \
    --format="value(name)" | wc -l)
    
  if [ $cpu_usage -gt $THRESHOLD ] && [ $((now - last_scale_time)) -gt $COOLDOWN ]; then
    if [ $vms -lt $MAX_VMS ]; then
      name="autoscaled-vm-$(date +%s)"
      gcloud compute instances create $name \
        --source-instance-template=$TEMPLATE \
        --zone=$ZONE
      last_scale_time=$now
    fi
  fi
   
done
```

Run the autoscaler in the background with logging:

```bash
nohup bash autoscale.sh >> /var/log/autoscale.log 2>&1 &
```

## 5. Key Safeguards

* **Cooldown (60 s):** Prevents multiple VMs from being created in rapid succession during a spike.
* **VM Cap (5):** Hard limit on GCP VMs prevents unbounded cost growth.
* **Unique VM Names:** Timestamp suffix ensures no naming conflicts between autoscaled instances.
* **Log File:** `/var/log/autoscale.log` captures every CPU reading and scale event.
* **Startup Script Log:** `/var/log/startup-script.log` on each cloud VM records container pull/run status.
* **Firewall Rule Scoping:** Network tags restrict the HTTPS firewall rule to only App-tagged instances.

---


