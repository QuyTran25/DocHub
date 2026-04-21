package com.dochub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dochub.dto.AuthResponse;
import com.dochub.dto.LoginRequest;
import com.dochub.dto.RegisterRequest;
import com.dochub.model.User;
import com.dochub.repository.UserRepository;
import com.dochub.security.JwtTokenProvider;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public AuthResponse register(RegisterRequest request) {
        // Validate input
        if (request.getUsername() == null || request.getUsername().trim().length() < 3) {
            return new AuthResponse("Tên đăng nhập phải có ít nhất 3 ký tự");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return new AuthResponse("Mật khẩu phải có ít nhất 6 ký tự");
        }
        if (request.getEmail() == null || !request.getEmail().contains("@")) {
            return new AuthResponse("Email không hợp lệ");
        }

        // Kiểm tra trùng username
        if (userRepository.existsByUsername(request.getUsername().trim())) {
            return new AuthResponse("Tên đăng nhập đã tồn tại");
        }

        // Kiểm tra trùng email
        if (userRepository.existsByEmail(request.getEmail().trim())) {
            return new AuthResponse("Email đã được sử dụng");
        }

        // Tạo user mới
        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail().trim());
        user.setFullName(request.getFullName() != null ? request.getFullName().trim() : request.getUsername());
        user.setRole("user");

        User saved = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(saved.getId(), saved.getUsername());
        return new AuthResponse(saved.getId(), saved.getUsername(), saved.getEmail(), saved.getFullName(), saved.getRole(), token);
    }

    public AuthResponse login(LoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return new AuthResponse("Vui lòng nhập đầy đủ thông tin");
        }

        String username = request.getUsername().trim();

        // Tìm user theo username
        return userRepository.findByUsername(username)
            .map(user -> {
                if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                    String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername());
                    return new AuthResponse(user.getId(), user.getUsername(), user.getEmail(), user.getFullName(), user.getRole(), token);
                } else {
                    return new AuthResponse("Tên đăng nhập hoặc mật khẩu không chính xác");
                }
            })
            .orElse(new AuthResponse("Tên đăng nhập hoặc mật khẩu không chính xác"));
    }
}
