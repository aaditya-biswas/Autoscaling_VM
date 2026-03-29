#!/bin/bash

THRESHOLD=75
COOLDOWN=60 # Necessary to stop creating a lot of VM's
ZONE="us-central1-a"
TEMPLATE='my-template'
MAX_VMS=5

last_scale_time=0

echo "Starting the analyzer"

while true; do
	# Get CPU Idle %
	idle=$(mpstat 1 1 | awk '/Average/ {print $NF}')
	

	# Convert CPU usage
	cpu_usage=$(echo "100 - $idle" | bc)
	echo "CPU Usage: $cpu_usage%"

	current_time=$(date +%s)
	time_diff=$((current_time - last_scale_time))
	
	# Count current VMs
	vm_count=$(gcloud compute instances list \
		--filter="name~'^autoscaled-vm'" \
		--format="value(name)" | wc -l )

	echo "Current autoscaled VMs: $vm_count"

	# Check scaling conditions
	if (($(echo "$cpu_usage > $THRESHOLD" | bc -l))) && \
		[ $time_diff -gt $COOLDOWN ] && \
		[ $vm_count -lt $MAX_VMS ]; then
		echo "High CPU usage detected. Scaling ..."
		
		vm_name="autoscaled-vm-$(date +%s)"

		gcloud compute instances create $vm_name \
			--source-instance-template=$TEMPLATE \
			--zone=$ZONE
		last_scale_time=$current_time
		echo "Created VM : $vm_name"
	fi
done
