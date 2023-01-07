.PHONY: all
.SILENT: cog-help cog-clean

all:  cog

turboclean:
	./turbo_clean.sh

# # # # # # # # # # # # # # # # # #
# \_______________________________
#       Commands for Cog
# /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
# # # # # # # # # # # # # # # # # #
cog-help:
	echo "commands for working with the Cog application:" && \
	echo "  • \033[0;33m make cog \033[0m - brings up the local docker compose stack for Cog Workers, API, and Redis" && \
	echo "  • \033[0;33m make cog \033[0m - brings up the production docker compose stack for Cog Workers, API, and Redis" && \
	echo "  • \033[0;33m make cog-logs \033[0m - streams logs from the local Cog docker compose stack" && \
	echo "  • \033[0;33m make cog-api \033[0m - just-in-time compiles the local typescript code to run the API process using ts-node" && \
	echo "  • \033[0;33m make cog-workers \033[0m - just-in-time compiles the local typescript code to run the Workers process using ts-node" && \
	echo "  • \033[0;33m make cog-api-prod \033[0m - builds and starts the transpiled API app with ENVIRONMENT=production" && \
	echo "  • \033[0;33m make cog-workers-prod \033[0m - builds and starts the transpiled Workers app with ENVIRONMENT=production" && \
	echo "  • \033[0;33m make cog-down \033[0m - if there is a docker compose stack for Cog running, bring it down" && \
	echo "  • \033[0;33m make cog-clean \033[0m - bring down docker compose stack for Cog, and delete all its volumes"

cog:
	docker compose -f apps/cog/docker-compose-dev.yml --env-file .env up -d --force-recreate

cog-prod:
	docker compose -f apps/cog/docker-compose.yml --env-file .env up -d --force-recreate

cog-logs:
	docker compose -f apps/cog/docker-compose-dev.yml logs -f

cog-api:
	yarn --cwd=apps/cog dev:api

cog-workers:
	yarn --cwd=apps/cog dev:workers

cog-api-prod:
	yarn --cwd=apps/cog start:api

cog-workers-prod:
	yarn --cwd=apps/cog start:workers

cog-down:
	docker compose -f apps/cog/docker-compose-dev.yml down && docker compose -f apps/cog/docker-compose.yml down 

cog-clean:
	echo "\033[0;31m warning \033[0m, cleaning out \033[0;31m all Cog working memory \033[0m including jobs and Redis!" && \
	docker compose -f apps/cog/docker-compose-dev.yml down -v && docker compose -f apps/cog/docker-compose.yml down -v 

# colors in bash: https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux