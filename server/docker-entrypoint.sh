#!/bin/sh
set -e

echo "Waiting for MySQL to be ready..."
until nc -z mysql 3306; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done

echo "Waiting for Redis to be ready..."
until nc -z redis 6379; do
  echo "Redis is unavailable - sleeping"
  sleep 2
done

echo "Starting application..."
exec npm start
