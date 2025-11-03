FROM dart:stable

WORKDIR /app

COPY pubspec.* ./
RUN dart pub get

COPY . .

RUN dart compile exe bin/server.dart -o bin/server

EXPOSE 3003
ENV PORT=3003

CMD ["/app/bin/server"]
