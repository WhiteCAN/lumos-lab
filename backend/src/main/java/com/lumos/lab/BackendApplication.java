package com.lumos.lab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 애플리케이션 시작을 위한 메인 클래스입니다.
 */
@SpringBootApplication
public class BackendApplication {

	/**
	 * 애플리케이션을 구동하는 메인 메서드입니다.
	 */
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
