package com.study.lab.javafundamental.collection;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class JavaCollectionServiceTest {

    private final JavaCollectionService service = new JavaCollectionService();

    @Test
    void compareReturnsCoreCollectionCharacteristics() {
        CollectionCompareResponse response = service.compare();

        assertThat(response.items())
                .extracting(CollectionCompareItem::name)
                .contains("ArrayList", "LinkedList", "HashMap", "TreeMap", "ArrayDeque");
    }

    @Test
    void demoExplainsHashSetDuplicateRemoval() {
        CollectionDemoResponse response = service.demo(new CollectionDemoRequest(
                "HashSet",
                "ADD",
                List.of("A", "B", "A")
        ));

        assertThat(response.finalState()).containsExactly("A", "B");
        assertThat(response.steps()).anyMatch(step -> step.contains("중복"));
        assertThat(response.codeExample()).contains("new HashSet");
    }
}
