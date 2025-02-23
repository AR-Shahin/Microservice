# Use an official PHP Alpine image as the base
FROM php:8.2-fpm-alpine

# Set working directory
WORKDIR /var/www

# Install system dependencies and necessary PHP extensions
RUN apk update && apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    zip \
    git \
    libzip-dev \
    bash && \
    docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp && \
    docker-php-ext-install gd zip pdo pdo_mysql && \
    apk del libpng-dev libjpeg-turbo-dev libwebp-dev && \
    rm -rf /var/cache/apk/*

# Install Composer (PHP dependency manager)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy only the composer.json and composer.lock first to leverage Docker cache
COPY composer.json composer.lock ./

# Install Laravel dependencies
RUN composer install --no-autoloader --no-scripts

# Now, copy the rest of the application
COPY . .

# Optimize Composer autoloader (you can add flags to optimize it for production)
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

# Ensure proper permissions for Laravel folders
RUN chown -R www-data:www-data /var/www && \
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Expose port
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
