FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean install -DskipTests
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/fungiflow-0.0.1-SNAPSHOT.jar"]
