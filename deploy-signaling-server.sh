#!/bin/bash
set -e

# Variables
IMAGE_NAME="signaling-server"
REGISTRY="ghcr.io/allaskevin"
TAG="latest"
FULL_IMAGE_NAME="$REGISTRY/$IMAGE_NAME:$TAG"
NAMESPACE="default"
DEPLOYMENT_NAME="signaling-server"

echo "📁 Copying shared folder into signaling-server..."
cp -r src/shared src/signaling-server/shared

echo "🔧 Building Docker image..."
docker build -t $IMAGE_NAME ./src/signaling-server

echo "🧹 Cleaning up temporary shared folder..."
rm -rf src/signaling-server/shared

echo "🏷️ Tagging image..."
docker tag $IMAGE_NAME $FULL_IMAGE_NAME

echo "📤 Pushing image to registry..."
docker push $FULL_IMAGE_NAME

echo "🚀 Applying the current Kubernetes deployment..."
kubectl apply -f ./src/signaling-server/k8s/deployment.yaml -n $NAMESPACE

echo "🚀 Applying the current Kubernetes service..."
kubectl apply -f ./src/signaling-server/k8s/service.yaml -n $NAMESPACE

echo "🚀 Restarting Kubernetes deployment..."
kubectl rollout restart deployment $DEPLOYMENT_NAME -n $NAMESPACE

echo "✅ Deployment complete!"
