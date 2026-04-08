pipeline {
    agent any

    environment {
        IMAGE_NAME = "my-k8s-app"
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
                rm -rf node_modules package-lock.json
                npm install
                '''
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

        stage('Build and Load Docker Image into Minikube') {
            steps {
                sh '''
                # Use Minikube Docker environment
                eval $(minikube docker-env)

                # Build image with tag
                docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .

                # Deploy to Kubernetes
                sed -i "s/IMAGE_TAG/${BUILD_NUMBER}/g" k8s/deployment.yaml
                minikube kubectl -- apply -f k8s/deployment.yaml
                minikube kubectl -- apply -f k8s/service.yaml
                minikube service my-k8s-app-service --url &
sleep 5


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