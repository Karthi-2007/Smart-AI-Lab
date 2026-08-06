package com.auth.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth.entity.AppUser;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {


    @Value("${jwt.secret}")
    private String secret;


    @Value("${jwt.expiration}")
    private long expiration;


    public String generateToken(AppUser user) {

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getUserId())
                .claim("role", user.getRole().name())
                .issuedAt(new Date())
                .expiration(
                    new Date(System.currentTimeMillis() + expiration)
                )
                .signWith(getKey())
                .compact();
    }


    public String extractUsername(String token) {

        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }


    public boolean isTokenValid(
            String token,
            String email
    ) {

        return extractUsername(token)
                .equals(email);
    }


    private SecretKey getKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes()
        );
    }
}