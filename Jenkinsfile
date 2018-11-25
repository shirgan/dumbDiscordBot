node {
    def app
    try {
        stage('Clone repository') {
            /* Let's make sure we have the repository cloned to our workspace */
    
            git url: "https://github.com/dot1q/dumbDiscordBot", branch: 'dev'
        }
        
        stage('NPM Install') {
            sh 'pwd'
            sh 'rm -rf node_modules'
            sh 'npm cache clean --force'
            sh 'npm install'
        }
        
        stage('Gulp Build') {
            sh 'gulp build'
            sh 'npm run coverage'
        }
        
        stage('Quality Gate') {
            def scannerHome = tool 'SonarQube Scanner 2.8';
            withSonarQubeEnv {
                sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=com.agoasite.dumbDiscordBot:dev -Dsonar.projectName='Dumb Discord Bot' -Dsonar.projectVersion=0.1 -Dsonar.sources=src -Dsonar.sourceEncoding=UTF-8 -Dsonar.javascript.lcov.reportPaths=dist/coverage/lcov.info -Dsonar.exclusions=**/*spec.js"
            }
        }
        
        stage('Build Docker Image') {
            app = docker.build("gbrewster/dumbdiscordbot")
        }
        
        stage('Push Docker Image') {
            docker.withRegistry('https://registry.hub.docker.com', 'f1a38657-321b-4863-894f-08f07bb63829') {
                app.push("latest-dev")
            }
        }
        currentBuild.result = 'SUCCESS'
    } catch (e) {
        currentBuild.result = 'FAILURE'
        throw e
    } finally {
        step([$class: 'Mailer', notifyEveryUnstableBuild: true, recipients: "${sn_dev_email_dist_list}", sendToIndividuals: true])
    }
}
