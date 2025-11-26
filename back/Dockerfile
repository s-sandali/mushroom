# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper and pom first to leverage Docker layer caching
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

# Ensure wrapper is executable
RUN chmod +x mvnw

# Download dependencies (go offline)
RUN ./mvnw -q dependency:go-offline

# Copy the rest of the source
COPY src src

# Build the application jar
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built jar from previous stage
COPY --from=build /app/target/fungiflow-0.0.1-SNAPSHOT.jar app.jar

# Expose default port (Render will set PORT env var)
EXPOSE 8080

# Use PORT env var if provided (Render sets this), otherwise 8080
ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
