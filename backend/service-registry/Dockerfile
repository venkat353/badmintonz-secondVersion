# 1. Start with a valid Java 21 base image (Eclipse Temurin)
FROM eclipse-temurin:21-jdk

# 2. Create a folder inside the container
WORKDIR /app

# 3. Copy the JAR file
COPY target/service-registry-0.0.1-SNAPSHOT.jar app.jar

# 4. Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]