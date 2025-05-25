up:
	docker compose -p nerdyweirdwords up -d --build

down:
	docker compose -p nerdyweirdwords down --remove-orphans

down-vols:
	docker compose -p nerdyweirdwords down --remove-orphans --volumes

