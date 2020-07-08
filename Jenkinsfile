pipeline {
    agent {
        node {
            label 'master'
            customWorkspace 'workspace/angular-material-shared'
        }
    }
    environment {
        KeyVaultBaseUrl = credentials('AzureCiKeyVaultBaseUrl')
        KeyVaultClientId = credentials('AzureCiKeyVaultClientId')
        KeyVaultClientSecret = credentials('AzureCiKeyVaultClientSecret')
    }
    stages {
        stage ('Test') {
            steps {
                powershell './build.ps1 NgLibraryTest'
            }
            post {
                always {
					recordIssues(
						tools: [
							taskScanner(
								excludePattern: '**/*node_modules/**/*', 
								highTags: 'HACK, FIXME', 
								ignoreCase: true, 
								includePattern: '**/*.cs, **/*.g4, **/*.ts, **/*.js', 
								normalTags: 'TODO')
							]) 
                }
            }
        }
        stage ('Publish npm library') {
            steps {
                powershell './build.ps1 NgLibraryPublish+PublishGitHubRelease'
            }
        }
    }
    post {
        always {
            step([$class: 'Mailer',
                notifyEveryUnstableBuild: true,
                recipients: "georg@dangl.me",
                sendToIndividuals: true])
            cleanWs()
        }
    }
}