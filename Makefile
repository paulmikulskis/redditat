.PHONY: all

all:  dev dev-down dev-db dev-setup dev-temporal dev-app status

up:
	docker compose up -d

turboclean:
	./turbo_clean.sh