.PHONY: test

IMAGE_NAME = planet-challenge
CONTAINER_NAME = planet-challenge-container

# Linter
lint-fix:
	npm run lint:fix

# Run unit tests
test:
	npm test

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Run the Docker container
run:
	docker run -p 3000:3000 --name $(CONTAINER_NAME) $(IMAGE_NAME)

# Stop and remove the Docker container
stop:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)
