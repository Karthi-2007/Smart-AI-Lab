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
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
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
                    .requestMatchers("/api/business/ai/**").permitAll()
                    .requestMatchers("/api/business/dashboard/public/**").permitAll()

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
                    .requestMatchers(HttpMethod.PATCH, "/students/**", "/api/business/students/**")
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
                    .requestMatchers(HttpMethod.PATCH, "/faculty/**", "/api/business/faculty/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/faculty/**", "/api/business/faculty/**")
                        .hasRole("ADMIN")

                    // Departments
                    .requestMatchers(HttpMethod.GET, "/departments/**", "/api/business/departments/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/departments/**", "/api/business/departments/**")
                        .hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/departments/**", "/api/business/departments/**")
                        .hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PATCH, "/departments/**", "/api/business/departments/**")
                        .hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/departments/**", "/api/business/departments/**")
                        .hasRole("ADMIN")

                    // Laboratories
                    .requestMatchers(HttpMethod.GET, "/laboratories/**", "/api/business/laboratories/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/laboratories/**", "/api/business/laboratories/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/laboratories/**", "/api/business/laboratories/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.PATCH, "/laboratories/**", "/api/business/laboratories/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/laboratories/**", "/api/business/laboratories/**")
                        .hasRole("ADMIN")

                    // Equipment endpoints
                    .requestMatchers(HttpMethod.GET, "/equipments/**", "/api/business/equipments/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/equipments/**", "/api/business/equipments/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/equipments/**", "/api/business/equipments/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.PATCH, "/equipments/**", "/api/business/equipments/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/equipments/**", "/api/business/equipments/**")
                        .hasRole("ADMIN")

                    // Booking endpoints
                    .requestMatchers("/bookings/*/approve", "/api/business/bookings/*/approve").hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers("/bookings/*/reject", "/api/business/bookings/*/reject").hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers("/bookings/*/cancel", "/api/business/bookings/*/cancel").hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers("/bookings/*/issue", "/api/business/bookings/*/issue").hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers("/bookings/*/complete", "/api/business/bookings/*/complete").hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.GET, "/bookings/**", "/api/business/bookings/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/bookings/**", "/api/business/bookings/**")
                        .hasRole("STUDENT")
                    .requestMatchers(HttpMethod.PUT, "/bookings/**", "/api/business/bookings/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.PATCH, "/bookings/**", "/api/business/bookings/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/bookings/**", "/api/business/bookings/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")

                    // Fault reports
                    .requestMatchers("/faults/*/assign", "/api/business/faults/*/assign").hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers("/faults/*/resolve", "/api/business/faults/*/resolve").hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers("/faults/*/reject", "/api/business/faults/*/reject").hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers("/faults/*/cancel", "/api/business/faults/*/cancel").hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.GET, "/faults/**", "/api/business/faults/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/faults/**", "/api/business/faults/**")
                        .hasRole("STUDENT")
                    .requestMatchers(HttpMethod.PUT, "/faults/**", "/api/business/faults/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.PATCH, "/faults/**", "/api/business/faults/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")

                    // Maintenance
                    .requestMatchers("/maintenance/*/schedule", "/api/business/maintenance/*/schedule").hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers("/maintenance/*/start", "/api/business/maintenance/*/start").hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers("/maintenance/*/complete", "/api/business/maintenance/*/complete").hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers("/maintenance/*/cancel", "/api/business/maintenance/*/cancel").hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers("/maintenance/*/assign", "/api/business/maintenance/*/assign").hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.GET, "/maintenance/**", "/api/business/maintenance/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/maintenance/**", "/api/business/maintenance/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/maintenance/**", "/api/business/maintenance/**")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.PATCH, "/maintenance/**", "/api/business/maintenance/**")
                        .hasAnyRole("FACULTY", "ADMIN")

                    // Notifications
                    .requestMatchers(HttpMethod.GET, "/notifications/**", "/api/business/notifications/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.POST, "/notifications/**", "/api/business/notifications/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/notifications/**", "/api/business/notifications/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.PATCH, "/notifications/**", "/api/business/notifications/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/notifications/**", "/api/business/notifications/**")
                        .hasAnyRole("STUDENT", "FACULTY", "ADMIN")

                    // Dashboard
                    .requestMatchers("/dashboard/admin/**", "/api/business/dashboard/admin/**", "/api/business/dashboard/admin")
                        .hasRole("ADMIN")
                    .requestMatchers("/dashboard/faculty/**", "/api/business/dashboard/faculty/**", "/api/business/dashboard/faculty")
                        .hasAnyRole("FACULTY", "ADMIN")
                    .requestMatchers("/dashboard/student/**", "/api/business/dashboard/student/**", "/api/business/dashboard/student")
                        .hasAnyRole("STUDENT", "ADMIN")

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
