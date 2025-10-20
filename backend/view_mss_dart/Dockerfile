FROM dart:stable AS build

WORKDIR /app

COPY pubspec.* ./
RUN dart pub get

COPY . .

RUN dart compile exe bin/server.dart -o bin/server

FROM debian:slim-buster

WORKDIR /app

COPY --from=build /app/bin/server /app/server

EXPOSE 3003

ENV PORT=3003

CMD ["/app/server"]