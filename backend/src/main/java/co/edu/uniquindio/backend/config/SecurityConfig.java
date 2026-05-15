package co.edu.uniquindio.backend.config;

import co.edu.uniquindio.backend.security.TokenAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    public SecurityConfig() {
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
            CorsConfigurationSource corsConfigurationSource,
            TokenAuthenticationFilter tokenAuthenticationFilter) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/login", "/api/auth/register-cliente").permitAll()
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/inmuebles/**",
                                "/api/ordenamientos/**")
                        .permitAll()
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/carrusel-inmuebles/**",
                                "/api/recomendaciones/**",
                                "/api/rangos-precio/**")
                        .authenticated()
                        .requestMatchers("/api/clientes/**").authenticated()
                        .requestMatchers("/api/busqueda-hash/**").hasAnyRole("ADMIN", "CLIENTE")
                        .requestMatchers("/api/visitas/**").authenticated()
                        .requestMatchers("/api/validaciones/**").hasRole("ADMIN")
                        .requestMatchers("/api/solicitudes/**").authenticated()
                        .requestMatchers(
                                "/api/asesores/**",
                                "/api/rotacion-asesores/**",
                                "/api/operaciones/**",
                                "/api/alertas/**",
                                "/api/contratos/**",
                                "/api/reportes/**",
                                "/api/grafos/**",
                                "/api/historial-inmuebles/**",
                                "/api/eventos-inusuales/**",
                                "/api/motor-alertas",
                                "/api/motor-alertas/**")
                        .hasRole("ADMIN")
                        .anyRequest().authenticated());

        return http.build();
    }
}
