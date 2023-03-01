package com.example.springsocial.security;

import com.example.springsocial.payload.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(RestAuthenticationEntryPoint.class);

    @Override
    public void commence(HttpServletRequest httpServletRequest,
                         HttpServletResponse httpServletResponse,
                         AuthenticationException e) throws IOException, ServletException {
        logger.error("Responding with unauthorized error. Message - {}", e.getMessage());
        ApiResponse unauthorizedUserResponse = new ApiResponse(false, e.getLocalizedMessage());
        ObjectMapper objectMapper = new ObjectMapper();
        String unauthorizedUserResponseJson = objectMapper.writeValueAsString(unauthorizedUserResponse);
//        httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED,
//                e.getMessage());
        httpServletResponse.setContentType("application/json");
        httpServletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        httpServletResponse.getWriter().write(unauthorizedUserResponseJson);
    }
}