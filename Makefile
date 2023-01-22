up:
	@docker-compose up -d

down:
	@docker-compose down

cleanup:
	@docker-compose down
	@rm -rf ./db/*
	@docker rm -f $(docker ps -a -q) || true
