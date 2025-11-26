# ---------- BUILD STAGE ----------
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy Maven wrapper and project files
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

# Make wrapper executable
RUN chmod +x mvnw

# Download all dependencies
RUN ./mvnw dependency:go-offline

# Copy the remainder of the source
COPY src src

# Build the application (with a basic retry to handle transient Maven/Central hiccups)
RUN ./mvnw clean package -DskipTests || (echo "Retrying Maven build..." && ./mvnw clean package -DskipTests)


# ---------- RUN STAGE ----------
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the packaged jar
COPY --from=build /app/target/fungiflow-0.0.1-SNAPSHOT.jar app.jar

# Render will pass PORT
ENV SPRING_PROFILES_ACTIVE=prod

# For logging consistency
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Expose a port (optional for documentation)
EXPOSE 8080

# Start app using Render's PORT
CMD ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]
