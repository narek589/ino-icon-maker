# 🔄 CI/CD Integration Examples

Complete guide for automating icon generation in CI/CD pipelines.

## 📖 Table of Contents

- [GitHub Actions](#github-actions)
- [GitLab CI](#gitlab-ci)
- [Bitbucket Pipelines](#bitbucket-pipelines)
- [Jenkins](#jenkins)
- [CircleCI](#circleci)
- [Azure DevOps](#azure-devops)

---

## 🐙 GitHub Actions

### Basic Workflow

**.github/workflows/generate-icons.yml:**

```yaml
name: Generate App Icons

on:
  push:
    paths:
      - "assets/icon.png"
      - "assets/icon-*.png"

jobs:
  generate-icons:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Generate icons
        run: |
          npx ino-icon-maker generate \
            -i assets/icon.png \
            -o output \
            -p all \
            -z

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: app-icons
          path: output/
```

### Auto-Commit Generated Icons

```yaml
name: Generate and Commit Icons

on:
  push:
    paths:
      - "assets/icon.png"

jobs:
  generate-icons:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Generate icons
        run: |
          npx ino-icon-maker generate -i assets/icon.png -o temp -p all

          # React Native
          cp -r temp/AppIcon.appiconset ios/YourApp/Images.xcassets/
          cp -r temp/android-icons/* android/app/src/main/res/

          rm -rf temp

      - name: Commit changes
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add ios/ android/
          git diff --quiet && git diff --staged --quiet || git commit -m "chore: update app icons [skip ci]"
          git push
```

### Multi-Environment Icons

```yaml
name: Generate Icons for All Environments

on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Environment"
        required: true
        type: choice
        options:
          - dev
          - staging
          - prod

jobs:
  generate-icons:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Generate ${{ inputs.environment }} icons
        run: |
          npx ino-icon-maker generate \
            -i assets/icon-${{ inputs.environment }}.png \
            -o output/${{ inputs.environment }} \
            -p all \
            -z

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: icons-${{ inputs.environment }}
          path: output/${{ inputs.environment }}/
```

---

## 🦊 GitLab CI

### Basic Pipeline

**.gitlab-ci.yml:**

```yaml
stages:
  - generate

generate-icons:
  stage: generate
  image: node:20
  script:
    - npx ino-icon-maker generate -i assets/icon.png -o output -p all -z
  artifacts:
    paths:
      - output/
    expire_in: 1 week
  only:
    changes:
      - assets/icon.png
```

### Multi-Environment

```yaml
stages:
  - generate

.generate_icons:
  stage: generate
  image: node:20
  script:
    - |
      npx ino-icon-maker generate \
        -i assets/icon-${CI_ENVIRONMENT_NAME}.png \
        -o output/${CI_ENVIRONMENT_NAME} \
        -p all \
        -z
  artifacts:
    paths:
      - output/
    expire_in: 1 week

generate:dev:
  extends: .generate_icons
  environment:
    name: dev
  only:
    refs:
      - develop

generate:staging:
  extends: .generate_icons
  environment:
    name: staging
  only:
    refs:
      - staging

generate:prod:
  extends: .generate_icons
  environment:
    name: prod
  only:
    refs:
      - main
```

---

## 🚢 Bitbucket Pipelines

### Basic Pipeline

**bitbucket-pipelines.yml:**

```yaml
image: node:20

pipelines:
  branches:
    main:
      - step:
          name: Generate Icons
          script:
            - npm install -g ino-icon-maker
            - ino-icon generate -i assets/icon.png -o output -p all -z
          artifacts:
            - output/**

  custom:
    generate-icons:
      - step:
          name: Generate App Icons
          script:
            - npx ino-icon-maker generate -i assets/icon.png -o output -p all
          artifacts:
            - output/**
```

---

## 🔨 Jenkins

### Jenkinsfile

```groovy
pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Setup') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Generate Icons') {
            when {
                changeset "assets/icon*.png"
            }
            steps {
                sh '''
                    npx ino-icon-maker generate \
                        -i assets/icon.png \
                        -o output \
                        -p all \
                        -z
                '''
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'output/**/*', fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'Icons generated successfully!'
        }
        failure {
            echo 'Icon generation failed!'
        }
    }
}
```

---

## ⭕ CircleCI

### Config

**.circleci/config.yml:**

```yaml
version: 2.1

jobs:
  generate-icons:
    docker:
      - image: cimg/node:20.0
    steps:
      - checkout

      - run:
          name: Generate Icons
          command: |
            npx ino-icon-maker generate \
              -i assets/icon.png \
              -o output \
              -p all \
              -z

      - store_artifacts:
          path: output
          destination: app-icons

workflows:
  icon-workflow:
    jobs:
      - generate-icons:
          filters:
            branches:
              only:
                - main
                - develop
```

---

## 🔷 Azure DevOps

### Pipeline

**azure-pipelines.yml:**

```yaml
trigger:
  paths:
    include:
      - assets/icon*.png

pool:
  vmImage: "ubuntu-latest"

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: "20.x"
    displayName: "Install Node.js"

  - script: |
      npx ino-icon-maker generate \
        -i assets/icon.png \
        -o $(Build.ArtifactStagingDirectory)/icons \
        -p all \
        -z
    displayName: "Generate Icons"

  - task: PublishBuildArtifacts@1
    inputs:
      PathtoPublish: "$(Build.ArtifactStagingDirectory)/icons"
      ArtifactName: "app-icons"
      publishLocation: "Container"
```

---

## 🐳 Docker Integration

### Dockerfile

```dockerfile
FROM node:20-alpine

# Install ino-icon-maker globally
RUN npm install -g ino-icon-maker

WORKDIR /app

# Copy icon
COPY assets/icon.png .

# Generate icons
RUN ino-icon generate \
    -i icon.png \
    -o /app/output \
    -p all \
    -z

# Output is in /app/output
```

### Docker Compose

**docker-compose.yml:**

```yaml
version: "3.8"

services:
  icon-generator:
    image: node:20-alpine
    volumes:
      - ./assets:/assets
      - ./output:/output
    command: >
      sh -c "
        npm install -g ino-icon-maker &&
        ino-icon generate -i /assets/icon.png -o /output -p all -z
      "
```

### Usage

```bash
docker-compose up icon-generator
```

---

## 🔄 Advanced Workflows

### React Native Full Pipeline

**.github/workflows/react-native-icons.yml:**

```yaml
name: React Native Icons

on:
  push:
    paths:
      - "assets/icon.png"
  workflow_dispatch:

jobs:
  generate-and-test:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm install

      - name: Generate icons
        run: |
          npx ino-icon-maker generate -i assets/icon.png -o temp -p all

          # Install iOS
          cp -r temp/AppIcon.appiconset ios/YourApp/Images.xcassets/

          # Install Android
          cp -r temp/android-icons/* android/app/src/main/res/

          # Cleanup
          rm -rf temp

      - name: Install iOS dependencies
        run: |
          cd ios
          pod install
          cd ..

      - name: Build iOS
        run: |
          npx react-native run-ios --simulator="iPhone 15"

      - name: Build Android
        run: |
          cd android
          ./gradlew assembleDebug
          cd ..

      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-debug
          path: android/app/build/outputs/apk/debug/app-debug.apk
```

### Flutter Full Pipeline

```yaml
name: Flutter Icons

on:
  push:
    paths:
      - "assets/icon.png"

jobs:
  generate-and-build:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-java@v3
        with:
          distribution: "zulu"
          java-version: "11"

      - uses: subosito/flutter-action@v2
        with:
          flutter-version: "3.16.0"

      - name: Generate icons
        run: |
          npm install -g ino-icon-maker
          ino-icon generate -i assets/icon.png -o temp -p all

          # Install icons
          cp -r temp/AppIcon.appiconset ios/Runner/Assets.xcassets/
          cp -r temp/android-icons/* android/app/src/main/res/

          rm -rf temp

      - name: Install dependencies
        run: flutter pub get

      - name: Build iOS
        run: flutter build ios --release --no-codesign

      - name: Build Android
        run: flutter build apk --release

      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: flutter-apk
          path: build/app/outputs/flutter-apk/app-release.apk
```

---

## 📦 Pre-commit Hook

### Setup with Husky

```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "npm run icons"
```

**.husky/pre-commit:**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check if icon changed
if git diff --cached --name-only | grep -q "assets/icon.png"; then
  echo "🎨 Icon changed, regenerating..."
  npm run icons
  git add ios/ android/
fi
```

---

## 🎯 Best Practices

### 1. Cache Dependencies

```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### 2. Only Run on Changes

```yaml
on:
  push:
    paths:
      - "assets/icon*.png"
```

### 3. Parallel Jobs

```yaml
jobs:
  generate-ios:
    runs-on: ubuntu-latest
    # ...

  generate-android:
    runs-on: ubuntu-latest
    # ...
```

### 4. Matrix Strategy

```yaml
strategy:
  matrix:
    environment: [dev, staging, prod]
steps:
  - name: Generate ${{ matrix.environment }} icons
    run: npx ino-icon-maker generate -i assets/icon-${{ matrix.environment }}.png -o output -p all
```

---

## ✅ Testing in CI

```yaml
- name: Verify icons generated
  run: |
    # Check iOS
    test -f output/AppIcon.appiconset/Contents.json || exit 1
    test -f output/AppIcon.appiconset/Icon-App-1024x1024@1x.png || exit 1

    # Check Android
    test -f output/android-icons/mipmap-xxxhdpi/ic_launcher.png || exit 1

    echo "✅ All icons generated successfully"
```

---

**Need help with your specific CI/CD setup?** [Open an issue](https://github.com/narek589/ino-icon-maker/issues)
