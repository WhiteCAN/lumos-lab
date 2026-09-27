package com.lumos.lab.pattern.book;

import java.util.List;
import java.util.Map;

public record BookPatternResult(String pattern, List<String> steps, Map<String, Object> result) {}
