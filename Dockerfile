# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy ONLY main source code (no tests)
COPY src/main src/main

# Build without tests
RUN mvn clean package -DskipTests -Dmaven.test.skip=true

# Debug: list what was built
RUN ls -la target/

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar (named app.jar due to finalName in pom.xml)
COPY --from=build /app/target/app.jar app.jar

# Expose port
EXPOSE 8080

# Start command - Railway sets PORT env variable
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -Dspring.profiles.active=mysql -jar app.jar"]
