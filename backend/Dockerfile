FROM eclipse-temurin:21-jdk AS builder

WORKDIR /workspace
COPY gradlew gradlew.bat settings.gradle build.gradle ./
COPY gradle ./gradle
COPY src ./src
RUN chmod +x gradlew && ./gradlew bootJar --no-daemon

FROM eclipse-temurin:21-jre

WORKDIR /app
RUN useradd --system --uid 1001 --create-home app
COPY --from=builder --chown=app:app /workspace/build/libs/*.jar /app/app.jar

USER app
EXPOSE 8080 9090
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
