package com.datapath.site.security;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import static com.datapath.site.security.SecurityConstants.SIGN_UP_URL;

@EnableWebSecurity
public class WebSecurity extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable().authorizeRequests()

                .antMatchers(HttpMethod.POST, SIGN_UP_URL).permitAll()
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .antMatchers("/api/v0.1/monitoring/login").permitAll()
                .antMatchers("/api/v0.1/monitoring/password/reset/mail").permitAll()
                .antMatchers("/api/v0.1/monitoring/password/reset/check").permitAll()
                .antMatchers("/api/v0.1/monitoring/password/reset/save").permitAll()
                .antMatchers("/api/v0.1/system-monitoring").permitAll()
                .antMatchers(HttpMethod.GET, "/api/v0.1/monitoring/users").hasAnyAuthority("admin", "configurer", "user")
                .antMatchers(HttpMethod.POST, "/api/v0.1/monitoring/users").hasAnyAuthority("admin", "configurer")
                .antMatchers(HttpMethod.PUT, "/api/v0.1/monitoring/users").hasAnyAuthority("admin", "configurer")
                .antMatchers("/api/v0.1/monitoring/users/**").hasAnyAuthority("admin", "configurer")
                .antMatchers("/api/v0.1/configuration").hasAuthority("configurer")
                .antMatchers("/api/v0.1/monitoring/**").authenticated()
                .antMatchers("/api/v0.1/checklist/**").authenticated()
                .antMatchers("/api/v0.1/mappings/**").authenticated()
                .anyRequest().permitAll()
                .and()
                .addFilter(new JWTAuthorizationFilter(authenticationManager()));
    }
}

