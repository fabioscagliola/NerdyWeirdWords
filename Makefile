up:
	docker compose -p nerdyweirdwords up -d --build --pull always

down:
	docker compose -p nerdyweirdwords down --remove-orphans

down-vols:
	docker compose -p nerdyweirdwords down --remove-orphans --volumes

watch:
	docker compose -f compose-development.yaml -p nerdyweirdwords watch

