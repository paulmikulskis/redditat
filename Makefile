.PHONY: all help
.SILENT: spampage-help cog cog-help cog-clean spam-help help _spam-extension-info spam-chrome spam-firefox spam-opera spam-build admin-help setup

all: cog help

# # # # # # # # # # # # # # # # # #
# \_______________________________
#      Commands for setup, admin
# /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
# # # # # # # # # # # # # # # # # #

help: 
	make admin-help && make spam-help && make cog-help && make spampage-help

setup:
	echo " * \033[0;34mtouch-ing .yarnrc.yml\033[0m" && \
	$(if $(shell [ ! -d .yarn ] && echo "true" || echo "false"), echo "nodeLinker: node-modules" > .yarnrc.yml) && \
	echo " * \033[0;34msetting yarn to the latest version (3.x)\033[0m" && \
	yarn set version stable && \
	echo " * \033[0;34mensuring that a yarn.lock file exists\033[0m" && \
	$(if $(shell [ ! -f yarn.lock ] && echo "true" || echo "false"), touch yarn.lock) && \
	echo " * \033[0;34minstalling the \033[0;33mplugin-production-install\033[0m for yarn\033[0m" && \
	yarn plugin import https://gitlab.com/Larry1123/yarn-contrib/-/raw/master/packages/plugin-production-install/bundles/@yarnpkg/plugin-production-install.js && \
	echo " * \033[0;34minstalling all packages\033[0m"
	yarn install && \
	echo " * \033[0;34mensuring packages are linked\033[0m" && \
	yarn install && \
	echo " * \033[0;34minstalling PrismaClient libraries locally\033[0m" && \
	yarn db:generate
	echo " 🚀 boom boom!  All done!"

turboclean:
	./turbo_clean.sh

admin-help:
	echo "\033[0;100mcommands \033[0;106msetting up\033[0;100m and working with Yungsten projects\033[0m" && \
	echo "  • \033[0;33m make help \033[0m - show the top-level help message" && \
	echo "  • \033[0;33m make setup \033[0m - install and configure this monorepo (with yarn)" && \
	echo "  • \033[0;33m make turboclean \033[0m - cleans up all build artifacts related to NodeJS + Turborepo, useful for troubleshooting"

install:
	make setup

# # # # # # # # # # # # # # # # # #
# \_______________________________
#       Commands for Cog
# /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
# # # # # # # # # # # # # # # # # #
cog-help:

	echo "\033[0;100mcommands for working with the \033[0;106mCog Workflow System\033[0;100m\033[0m" && \
	echo "  • \033[0;33m make cog \033[0m - brings up the local docker compose stack for Cog Workers, API, and Redis, builds if needed" && \
	echo "  • \033[0;33m make cog-build \033[0m - builds the cog-api and cog-workers Docker images locally for use with 'make cog'" && \
	echo "  • \033[0;33m make cog-prod \033[0m - brings up the production docker compose stack for Cog Workers, API, and Redis" && \
	echo "  • \033[0;33m make cog-logs \033[0m - streams logs from the local Cog docker compose stack" && \
	echo "  • \033[0;33m make cog-api \033[0m - just-in-time compiles the local typescript code to run the API process using ts-node" && \
	echo "  • \033[0;33m make cog-workers \033[0m - just-in-time compiles the local typescript code to run the Workers process using ts-node" && \
	echo "  • \033[0;33m make cog-api-prod \033[0m - builds and starts the transpiled API app with ENVIRONMENT=production" && \
	echo "  • \033[0;33m make cog-workers-prod \033[0m - builds and starts the transpiled Workers app with ENVIRONMENT=production" && \
	echo "  • \033[0;33m make cog-down \033[0m - if there is a docker compose stack for Cog running, bring it down" && \
	echo "  • \033[0;33m make cog-clean \033[0m - bring down docker compose stack for Cog, and delete all its volumes"

cog:
	if [ -z "$$(docker images -q cog-api:latest)" ]; then \
		echo "cog-api:latest container not found, building"; \
		make cog-build; \
	else \
		echo "cog-api:latest container found, skipping build"; \
	fi
	docker compose -f apps/cog/docker-compose-dev.yml --env-file .env up -d --force-recreate

cogo: # stupid little helper command to just build then run, didn't want to clutter the help msg above
	make cog-build && make cog

cog-build:
		docker build -f apps/cog/Dockerfile --build-arg COG_SERVICE_BUILD_NAME=workers -t cog-workers:latest . && \
		docker build -f apps/cog/Dockerfile --build-arg COG_SERVICE_BUILD_NAME=api -t cog-api:latest .

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

# # # # # # # # # # # # # # # # # #
# \_______________________________
#       Commands for Spamcntrl Chrome Extension
# /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
# # # # # # # # # # # # # # # # # #
spam-help:
	echo "\033[0;100mcommands for working with the \033[0;106mSpamcntrl Chrome Extension\033[0m" && \
	echo "  • \033[0;33m make spam-chrome \033[0m - starts the Hot Extension Reload Server and builds the extension for Chromium inside of the \033[0;34mapps/spamcntrl-extension/extension\033[0m directory" && \
	echo "  • \033[0;33m make spam-firefox \033[0m - starts the Hot Extension Reload Server and builds the extension for Firefox  inside of the \033[0;34mapps/spamcntrl-extension/extension\033[0m directory" && \
	echo "  • \033[0;33m make spam-opera \033[0m - starts the Hot Extension Reload Server and builds the extension for Opera  inside of the \033[0;34mapps/spamcntrl-extension/extension\033[0m directory" && \
	echo "  • \033[0;33m make spam-build \033[0m - builds the Spamcntrl Chrome Extension inside of the before-mentioned 'extension' directory" && \
	echo "  • \033[0;33m make spam-lint \033[0m - lints the source code for the chrome extension"
	echo "  • \033[0;33m make spam-lint-fix \033[0m - fixes the auto-fixable linting errors from the source code for the chrome extension"

_spam-extension-info:
	echo "🏗️  building the Spamcntrl Browser Extension -- load it from \033[0;34mapps/spamcntrl-extension/extension/\033[0m"

spam-chrome:
	make _spam-extension-info && \
	yarn --cwd=apps/spamcntrl-extension dev:chrome

spam-firefox:
	make _spam-extension-info && \
	yarn --cwd=apps/spamcntrl-extension dev:firefox

spam-opera:
	make _spam-extension-info && \
	yarn --cwd=apps/spamcntrl-extension dev:opera

spam-build:
	make _spam-extension-info && \
	yarn --cwd=apps/spamcntrl-extension build

spam-lint:
	yarn --cwd=apps/spamcntrl-extension lint

spam-lint-fix:
	yarn --cwd=apps/spamcntrl-extension lint:fix

# # # # # # # # # # # # # # # # # #
# \_______________________________
#       Commands for Spamcntrl Landing Page
# /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
# # # # # # # # # # # # # # # # # #
spampage-help:
	echo "\033[0;100mcommands for working with the \033[0;106mSpamcntrl NextJS Landing Page\033[0m" && \
	echo "  • \033[0;33m make spampage \033[0m - runs 'yarn dev' inside the project app directory" && \
	echo "  • \033[0;33m make spampage-prod \033[0m - runs 'yarn start' inside the project app directory" && \
	echo "  • \033[0;33m make spampage-build \033[0m - builds the Spamcntrl NextJS app landing page" && \
	echo "  • \033[0;33m make spampage-lint \033[0m - lints the source code for NextJS app"
_spampage-info:
	echo "🏗️  building the Spamcntrl Browser sExtension -- load it from \033[0;34mapps/spamcntrl-extension/extension/\033[0m"

spampage:
	yarn --cwd apps/spamcntrl-landingpage dev

spampage-prod:
	yarn --cwd apps/spamcntrl-landingpage start

spampage-build:
	yarn build --filter=@yungsten/spamcntrl-landingpage

spampage-lint:
	yarn lint --filter=@yungsten/spamcntrl-landingpage

spampage-lint-fix:
	echo "not implemented yet"

# colors in bash: https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux