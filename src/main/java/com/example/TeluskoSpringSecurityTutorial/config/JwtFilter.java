package com.example.TeluskoSpringSecurityTutorial.config;

import com.example.TeluskoSpringSecurityTutorial.service.JWTService;
import com.example.TeluskoSpringSecurityTutorial.service.MyUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicReference;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JWTService jwtService;

    @Autowired
    ApplicationContext context;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        AtomicReference<String> authHeader = new AtomicReference<>(request.getHeader("Authorization"));
        String token = null;
        String username = null;

        if(request.getCookies() != null) {
            Arrays.stream(request.getCookies()).forEach(cookie -> {
                if(cookie.getName().equals("jwt")) {
                    authHeader.set("Bearer " + cookie.getValue()); // TODO: Change the logic so that the 'Bearer ' prefix is not redundantly added here and then removed below
                }
            });
        }


        if(authHeader.get() != null && authHeader.get().startsWith("Bearer ")) {
            token = authHeader.get().substring(7);
            username = jwtService.extractUsername(token);
        }

        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = context.getBean(MyUserDetailsService.class).loadUserByUsername(username);

            if(jwtService.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // Skip filtering for login, register, index, and static resources
        return path.equals("/login") || path.equals("/register") ||
                path.equals("/") || path.equals("/index.html") ||
                path.startsWith("/static/");
    }

    /*
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        AtomicReference<String> authHeader = new AtomicReference<>(request.getHeader("Authorization"));
        String token = null;
        String username = null;
        System.out.println("Inside JwtFilter. cookies.length: " + request.getCookies().length);
        Arrays.stream(request.getCookies()).forEach(cookie -> {
            System.out.println("Cookie: " + cookie.getName() + " = " + cookie.getValue());
            if(cookie.getName().equals("jwt")) {
                System.out.println("Found JWT cookie: " + cookie.getValue());
                authHeader.set("Bearer " + cookie.getValue());
            }
        });
        System.out.println("Inside JwtFilter. authHeader: " + authHeader);

        if(authHeader.get() != null && authHeader.get().startsWith("Bearer ")) {
            token = authHeader.get().substring(7);
            username = jwtService.extractUsername(token);
        }

        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = context.getBean(MyUserDetailsService.class).loadUserByUsername(username);

            if(jwtService.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
 */
}
