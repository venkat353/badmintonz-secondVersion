FROM eclipse-temurin:21-jdk
WORKDIR /app
# Make sure this JAR name matches exactly what is in your target folder
COPY target/notification-service-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]