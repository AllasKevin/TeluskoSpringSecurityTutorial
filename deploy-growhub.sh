#!/bin/bash
set -e

# Variables
IMAGE_NAME="growhub-upcloud"
REGISTRY="ghcr.io/allaskevin"
TAG="latest"
FULL_IMAGE_NAME="$REGISTRY/$IMAGE_NAME:$TAG"
NAMESPACE="default"
DEPLOYMENT_NAME="growhub"

echo "🔧 Building React app static files..."
npm --prefix src/frontend-poc run build

echo "🔧 Building Docker image..."
docker build -t $IMAGE_NAME .

echo "🏷️ Tagging image..."
docker tag $IMAGE_NAME $FULL_IMAGE_NAME

echo "📤 Pushing image to registry..."
docker push $FULL_IMAGE_NAME

echo "🚀 Applying the current Kubernetes deployment..."
kubectl apply -f ./k8s/deployment.yaml -n $NAMESPACE

echo "🚀 Applying the current Kubernetes service..."
kubectl apply -f ./k8s/service.yaml -n $NAMESPACE

echo "🚀 Restarting Kubernetes deployment..."
kubectl rollout restart deployment $DEPLOYMENT_NAME -n $NAMESPACE

echo "✅ Deployment complete!"
