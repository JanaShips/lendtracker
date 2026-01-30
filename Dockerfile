# ============================================
# LendTracker Backend - Production Dockerfile
# ============================================

# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Install Maven
RUN apk add --no-cache maven

# Copy pom.xml first for dependency caching
COPY pom.xml .

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN mvn package -DskipTests -Dmaven.test.skip=true

# ============================================
# Runtime stage
# ============================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Add non-root user for security
RUN addgroup -g 1001 -S lendtracker && \
    adduser -u 1001 -S lendtracker -G lendtracker

# Copy the built jar
COPY --from=build /app/target/*.jar app.jar

# Change ownership
RUN chown -R lendtracker:lendtracker /app

# Switch to non-root user
USER lendtracker

# Expose port
EXPOSE 8080

# JVM options for container environment
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -q --spider http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
