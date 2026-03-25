.PHONY: up down restart reset fresh status

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

reset:
	docker compose down
	docker compose up --build -d

fresh:
	docker compose down -v --remove-orphans
	docker image prune -f
	docker compose up --build -d

status:
	docker compose ps
