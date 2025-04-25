# Use OpenJDK as base image
FROM openjdk:17-jdk-slim

# Set environment variable
ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    JAVA_OPTS=""

# Add JAR file
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# Run the app
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
