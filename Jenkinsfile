pipeline {
    agent any

    environment {
        IMAGE_NAME = "shreeshakuragayala/my-k8s-app"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                echo "Cleaning npm cache and removing old node_modules..."
                npm cache clean --force
                rm -rf node_modules package-lock.json
                npm install
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t my-k8s-app:${BUILD_NUMBER} .
                docker tag my-k8s-app:${BUILD_NUMBER} ${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                sh "docker push ${IMAGE_NAME}:${BUILD_NUMBER}"
            }
        }

        stage('Start Minikube if not running') {
            steps {
                sh '''
                if ! minikube status | grep -q "apiserver: Running"; then
                    echo "Minikube is not running. Starting now..."
                    minikube start --driver=docker --memory=2048 --cpus=2
                fi
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                # Replace IMAGE_TAG in deployment.yaml
                sed -i "s/IMAGE_TAG/${BUILD_NUMBER}/g" k8s/deployment.yaml

                # Load Docker image into Minikube
                minikube image load ${IMAGE_NAME}:${BUILD_NUMBER}

                # Apply Kubernetes manifests
                minikube kubectl -- apply -f k8s/deployment.yaml
                minikube kubectl -- apply -f k8s/service.yaml
                '''
            }
        }

    }

    post {
        failure {
            echo "Pipeline failed! Check logs for details."
        }
        success {
            echo "Pipeline succeeded! Deployment complete."
        }
    }
}