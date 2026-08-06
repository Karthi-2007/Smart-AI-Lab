package com.smartlab.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret:ChangeThisToARandom256BitSecretKeySharedByBothServicesForSmartLabAI}")
    private String secret;

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public List<SimpleGrantedAuthority> getRoles(String token) {
        Claims claims = extractClaims(token);
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        Object roleObj = claims.get("role");
        if (roleObj instanceof String roleStr) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + roleStr));
            authorities.add(new SimpleGrantedAuthority(roleStr));
        }

        Object rolesObj = claims.get("roles");
        if (rolesObj instanceof List<?> rolesList) {
            for (Object r : rolesList) {
                if (r != null) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + r.toString()));
                    authorities.add(new SimpleGrantedAuthority(r.toString()));
                }
            }
        }

        return authorities;
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = extractClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
