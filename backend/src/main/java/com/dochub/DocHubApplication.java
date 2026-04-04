package com.dochub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DocHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(DocHubApplication.class, args);
	}

}
