# DocHub - Nền tảng Lưu trữ và Chia sẻ Tài liệu

[![Java](https://img.shields.io/badge/Java-17-blue.svg)](https://www.java.com)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-^5.0-purple.svg)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![AWS](https://img.shields.io/badge/AWS-EC2%20%26%20S3-ff9900.svg)](https://aws.amazon.com/)

## 1. Giới thiệu

**DocHub** là một dự án ứng dụng web được xây dựng cho môn học Điện toán đám mây. Hệ thống cho phép người dùng đăng ký, đăng nhập, quản lý, tải lên và chia sẻ tài liệu một cách an toàn và hiệu quả. Dự án được thiết kế để triển khai trên nền tảng Amazon Web Services (AWS).

## 2. Kiến trúc hệ thống

Hệ thống được xây dựng theo kiến trúc microservices, tách biệt giữa Frontend và Backend để đảm bảo tính linh hoạt, dễ bảo trì và mở rộng.

```mermaid
graph TD
    subgraph "Người dùng"
        A[Trình duyệt]
    end

    subgraph "AWS Cloud"
        subgraph "Máy ảo EC2 (t2.micro)"
            B[Frontend: React App <br>(phục vụ bởi Nginx)]
            C[Backend: Java/Spring Boot App]
            D[Docker Engine]
            subgraph Docker
                E[MySQL Container]
            end
        end

        subgraph "Dịch vụ AWS khác"
            F[Amazon S3 Bucket <br>(Lưu trữ file)]
        end
    end

    A -- HTTPS --> B
    B -- API Calls --> C
    C -- CRUD metadata --> E
    C -- Upload/Download --> F

    style F fill:#FF9900,stroke:#333,stroke-width:2px
    style E fill:#00758F,stroke:#333,stroke-width:2px
```

-   **Frontend:** Xây dựng bằng React và Vite, chịu trách nhiệm hiển thị giao diện và tương tác với người dùng.
-   **Backend:** Xây dựng bằng Java và Spring Boot, xử lý toàn bộ logic nghiệp vụ, quản lý người dùng, và tương tác với các dịch vụ khác.
-   **Database:** Sử dụng MySQL chạy trong một Docker container để lưu trữ thông tin người dùng, metadata của file, và các thông tin quan trọng khác.
-   **Lưu trữ file:** Amazon S3 được sử dụng để lưu trữ nội dung các file, đảm bảo tính bền bỉ, an toàn và khả năng mở rộng.

## 3. Công nghệ sử dụng

-   **Backend:**
    -   Ngôn ngữ: Java 17
    -   Framework: Spring Boot 3.2.5
    -   Dependencies: Spring Web, Spring Data JPA, Spring Security, AWS SDK for S3.
-   **Frontend:**
    -   Framework: React 18
    -   Build tool: Vite
    -   Thư viện: Axios (để gọi API), React Router DOM.
-   **Cơ sở dữ liệu:** MySQL 8.0
-   **Containerization:** Docker
-   **Cloud Provider:** AWS (EC2, S3, IAM)

## 4. Cấu trúc thư mục

Dự án được tổ chức thành 3 thư mục chính:

-   `backend/`: Chứa toàn bộ mã nguồn và cấu hình cho ứng dụng Java Spring Boot.
-   `frontend/`: Chứa toàn bộ mã nguồn và cấu hình cho ứng dụng React.
-   `docs/`: Chứa các tài liệu liên quan đến dự án.

## 5. Hướng dẫn cài đặt và chạy dự án

### Yêu cầu
-   Java JDK 17
-   Maven 3.8+
-   Node.js 18+
-   Docker và Docker Compose

### Backend
1.  **Cấu hình:** Mở file `backend/src/main/resources/application.properties` và cập nhật thông tin kết nối tới MySQL và cấu hình AWS của bạn.
2.  **Chạy ứng dụng:**
    ```bash
    cd backend
    mvn spring-boot:run
    ```
    Server backend sẽ chạy tại `http://localhost:8080`.

### Frontend
1.  **Cài đặt thư viện:**
    ```bash
    cd frontend
    npm install
    ```
2.  **Chạy ứng dụng:**
    ```bash
    npm run dev
    ```
    Trang web sẽ có thể truy cập tại `http://localhost:5173` (hoặc một cổng khác do Vite chỉ định).

## 6. Kế hoạch triển khai (Deployment)

-   **Build Artefacts:**
    -   Backend: Build thành một file `.jar`.
    -   Frontend: Build thành các file HTML/CSS/JS tĩnh.
-   **Máy chủ EC2:**
    -   Cài đặt Java JRE, Docker, và Nginx.
    -   Chạy container MySQL.
    -   Chạy file backend `.jar`.
    -   Cấu hình Nginx để phục vụ các file tĩnh của frontend và làm reverse proxy cho các request API tới backend.
-   **Bảo mật:**
    -   Sử dụng IAM Role gán cho EC2 để cấp quyền truy cập S3 một cách an toàn.
    -   Cấu hình Security Group để chỉ mở các cổng cần thiết (80, 443, 22).
