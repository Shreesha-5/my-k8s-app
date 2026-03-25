pipeline {
    agent any

    stages {

        stage('Checkout from GitHub') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/Shreesha-5/my-k8s-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t my-k8s-app:${BUILD_NUMBER} .
                docker tag my-k8s-app:${BUILD_NUMBER} shreeshakuragayla/my-k8s-app:${BUILD_NUMBER}
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'docker push shreeshakuragayala/my-k8s-app:${BUILD_NUMBER}'
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
                # Replace image tag inside deployment.yaml
                sed -i "s/IMAGE_TAG/${BUILD_NUMBER}/g" k8s/deployment.yaml

                # Load image into Minikube
                minikube image load shreeshakuragayala/my-k8s-app:${BUILD_NUMBER}

                # Apply manifests
                minikube kubectl -- apply -f k8s/deployment.yaml
                minikube kubectl -- apply -f k8s/service.yaml
                '''
            }
        }
    }
}