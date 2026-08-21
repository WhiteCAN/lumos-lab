package com.study.lab.javafundamental.iostring;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;
import java.util.StringTokenizer;
import java.util.regex.Pattern;

@Service
public class JavaIoStringService {

    public IoStringParseResponse parse(IoStringParseRequest request) {
        String delimiter = request.delimiter();
        List<String> scannerTokens = new ArrayList<>();
        try (Scanner scanner = new Scanner(request.text())) {
            scanner.useDelimiter("\\s*" + Pattern.quote(delimiter) + "\\s*");
            while (scanner.hasNext()) {
                scannerTokens.add(scanner.next().trim());
            }
        }

        List<String> tokenizerTokens = new ArrayList<>();
        StringTokenizer tokenizer = new StringTokenizer(request.text(), delimiter);
        while (tokenizer.hasMoreTokens()) {
            tokenizerTokens.add(tokenizer.nextToken().trim());
        }

        List<String> splitTokens = Arrays.stream(request.text().split(Pattern.quote(delimiter)))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .toList();

        return new IoStringParseResponse(
                scannerTokens,
                tokenizerTokens,
                splitTokens,
                "많은 입력은 BufferedReader + StringTokenizer 조합을 먼저 떠올리고, 간단한 콘솔 실습은 Scanner를 써도 됩니다.",
                """
                BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
                StringTokenizer st = new StringTokenizer(br.readLine(), ",");
                while (st.hasMoreTokens()) {
                    int value = Integer.parseInt(st.nextToken().trim());
                }
                """
        );
    }

    public IoStringConcatResponse concat(IoStringConcatRequest request) {
        StringBuilder builder = new StringBuilder();
        StringBuffer buffer = new StringBuffer();

        for (int index = 0; index < request.repeatCount(); index++) {
            builder.append(request.word());
            buffer.append(request.word());
        }

        return new IoStringConcatResponse(
                builder.toString(),
                buffer.toString(),
                builder.length(),
                List.of(
                        "StringBuilder는 동기화를 하지 않아 단일 스레드 문자열 조립에 주로 사용합니다.",
                        "StringBuffer는 메서드가 동기화되어 멀티스레드 공유 상황에서 고려할 수 있습니다.",
                        "String을 반복해서 + 하면 중간 문자열 객체가 많이 생길 수 있습니다."
                ),
                """
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < repeatCount; i++) {
                    builder.append(word);
                }
                String result = builder.toString();
                """
        );
    }
}
