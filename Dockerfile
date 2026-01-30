# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Install Maven
RUN apk add --no-cache maven

# Copy pom.xml first for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar (named app.jar due to finalName in pom.xml)
COPY --from=build /app/target/app.jar app.jar

# Expose port
EXPOSE 8080

# Start command - Railway sets PORT env variable
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -Dspring.profiles.active=mysql -jar app.jar"]
