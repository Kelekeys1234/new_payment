package com.example.payment.security;

import com.example.payment.model.User;
import com.example.payment.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Resolves the {@link Authentication} for each request from a bearer JWT. Deliberately
 * re-fetches the user from the database by phone on every request (rather than trusting
 * role claims baked into the token at issue time) so that admin grants and the hardcoded
 * super-admin phone take effect immediately, without requiring a re-login.
 */
@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final String superAdminPhone;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository,
                                    @Value("${app.security.super-admin-phone}") String superAdminPhone) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.superAdminPhone = superAdminPhone;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            String phoneNumber = jwtService.extractPhoneNumber(token);
            if (phoneNumber != null) {
                Optional<User> userOpt = userRepository.findByPhoneNumber(phoneNumber);
                if (userOpt.isPresent()) {
                    authenticate(userOpt.get());
                } else {
                    log.debug("JWT valid but no user found for phone {}", phoneNumber);
                }
            }
        }
        filterChain.doFilter(request, response);
    }

    private void authenticate(User user) {
        boolean superAdmin = superAdminPhone.equals(user.getPhoneNumber());
        boolean admin = superAdmin || Boolean.TRUE.equals(user.getAdmin());

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        if (admin) authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        if (superAdmin) authorities.add(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"));

        CurrentUser principal = new CurrentUser(user.getId(), user.getPhoneNumber(), admin, superAdmin);
        var authentication = new UsernamePasswordAuthenticationToken(principal, null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
