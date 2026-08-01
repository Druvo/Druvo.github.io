pipeline {
    agent any
    
    environment {
        REMOTE_HOST = '192.168.0.50'
        REMOTE_USER = 'druvo'
        REMOTE_PATH = '/var/www/resume'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Backup on Corex') {
            steps {
                sshagent(['corex-ssh']) {
                    bat """
                        ssh -o StrictHostKeyChecking=no %REMOTE_USER%@%REMOTE_HOST% "sudo tar czf /tmp/resume-backup-%BUILD_ID%.tar.gz -C /var/www resume 2>/dev/null || true"
                    """
                }
            }
        }
        
        stage('Deploy to Corex') {
            steps {
                sshagent(['corex-ssh']) {
                    bat """
                        ssh -o StrictHostKeyChecking=no %REMOTE_USER%@%REMOTE_HOST% "sudo mkdir -p %REMOTE_PATH%"
                        scp -o StrictHostKeyChecking=no -r *.html *.css *.js %REMOTE_USER%@%REMOTE_HOST%:/tmp/resume-deploy/
                        scp -o StrictHostKeyChecking=no -r css js img fonts vendors scss %REMOTE_USER%@%REMOTE_HOST%:/tmp/resume-deploy/ 2>nul || true
                        ssh -o StrictHostKeyChecking=no %REMOTE_USER%@%REMOTE_HOST% "sudo cp -r /tmp/resume-deploy/* %REMOTE_PATH%/ && sudo chown -R www-data:www-data %REMOTE_PATH% && rm -rf /tmp/resume-deploy"
                    """
                }
            }
        }
        
        stage('Verify') {
            steps {
                sshagent(['corex-ssh']) {
                    bat """
                        ssh -o StrictHostKeyChecking=no %REMOTE_USER%@%REMOTE_HOST% "curl -s -o /dev/null -w '%%{http_code}' https://resume.druvium.xyz/"
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo 'Resume deployed successfully to https://resume.druvium.xyz'
        }
    }
}
