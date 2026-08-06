package com.smartlab.config;

import com.smartlab.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.config.Customizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/error").permitAll()

                    // Public Contact Us endpoint (anonymous submit allowed)
                    .requestMatchers(HttpMethod.POST, "/contact-messages/**", "/api/business/contact-messages/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/contact-messages/**", "/api/business/contact-messages/**").hasAnyRole("ADMIN", "FACULTY")
                    .requestMatchers(HttpMethod.PUT, "/contact-messages/**", "/api/business/contact-messages/**").hasAnyRole("ADMIN", "FACULTY")
                    .requestMatchers(HttpMethod.DELETE, "/contact-messages/**", "/api/business/contact-messages/**").hasRole("ADMIN")

                    // Students
                    .requestMatchers(HttpMethod.GET, "/students/**", "/api/business/students/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/students/**", "/api/business/students/**")
                        .hasAnyRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/students/**", "/api/business/students/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/students/**", "/api/business/students/**")
                        .hasAnyRole("ADMIN")

                    // Faculty endpoints
                    .requestMatchers(HttpMethod.GET, "/faculty/**", "/api/business/faculty/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/faculty/**", "/api/business/faculty/**")
                        .hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/faculty/**", "/api/business/faculty/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/faculty/**", "/api/business/faculty/**")
                        .hasRole("ADMIN")

                    // Departments & Laboratories
                    .requestMatchers("/departments/**", "/api/business/departments/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers("/laboratories/**", "/api/business/laboratories/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")

                    // Equipment endpoints
                    .requestMatchers(HttpMethod.GET, "/equipments/**", "/api/business/equipments/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/equipments/**", "/api/business/equipments/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/equipments/**", "/api/business/equipments/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/equipments/**", "/api/business/equipments/**")
                        .hasRole("ADMIN")

                    // Booking endpoints
                    .requestMatchers(HttpMethod.GET, "/bookings/**", "/api/business/bookings/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/bookings/**", "/api/business/bookings/**")
                        .hasRole("STUDENT")
                    .requestMatchers(HttpMethod.PUT, "/bookings/**", "/api/business/bookings/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/bookings/**", "/api/business/bookings/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")

                    // Fault reports
                    .requestMatchers(HttpMethod.GET, "/faults/**", "/api/business/faults/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/faults/**", "/api/business/faults/**")
                        .hasRole("STUDENT")
                    .requestMatchers(HttpMethod.PUT, "/faults/**", "/api/business/faults/**")
                        .hasAnyRole("FACULTY", "ADMIN")

                    // Maintenance
                    .requestMatchers(HttpMethod.GET, "/maintenance/**", "/api/business/maintenance/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/maintenance/**", "/api/business/maintenance/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/maintenance/**", "/api/business/maintenance/**")
                        .hasAnyRole("FACULTY", "ADMIN")

                    // Reports
                    .requestMatchers("/reports/**", "/api/business/reports/**")
                        .hasAnyRole("FACULTY", "ADMIN")

                    .anyRequest().authenticated())
            .exceptionHandling(handling -> handling
                    .authenticationEntryPoint((request, response, ex) -> {
                        response.setStatus(HttpStatus.UNAUTHORIZED.value());
                        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                        response.getWriter().write("{\"error\":\"Missing or invalid token\"}");
                    })
                    .accessDeniedHandler((request, response, ex) -> {
                        response.setStatus(HttpStatus.FORBIDDEN.value());
                        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                        response.getWriter().write("{\"error\":\"You do not have permission for this action\"}");
                    }))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
