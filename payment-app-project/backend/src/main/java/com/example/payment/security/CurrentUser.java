package com.example.payment.security;

/**
 * The authenticated principal attached to each request by {@link JwtAuthenticationFilter}.
 * Roles are recomputed fresh from the database on every request (see the filter), so this
 * record is just a snapshot for the duration of that request.
 */
public record CurrentUser(Long id, String phoneNumber, boolean admin, boolean superAdmin) {
}
