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
                    openTasks(
                       canComputeNew: false,
                       defaultEncoding: '',
                       excludePattern: 'src/angular-material-shared-demo/node_modules/**/*',
                       healthy: '',
                       high: 'HACK, FIXME',
                       ignoreCase: true,
                       low: '',
                       normal: 'TODO',
                       pattern: '**/*.cs, **/*.g4, **/*.ts',
                       unHealthy: '')
                       xunit testTimeMargin: '3000', thresholdMode: 1, thresholds: [failed(), skipped()], tools: [JUnit(deleteOutputFiles: true, failIfNotNew: true, pattern: '**/*karma-results.xml', skipNoTestFiles: false, stopProcessingIfError: true)]
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
        }
    }
}