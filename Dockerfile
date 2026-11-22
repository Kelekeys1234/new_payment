FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app
COPY payment-app-project/backend/pom.xml ./pom.xml
COPY payment-app-project/backend/src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre

WORKDIR /app
COPY --from=build /app/target/nehemiah-building-payment-1.0.0.jar ./app.jar

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec java -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
