package com.example.payment.util;

import java.util.LinkedHashSet;
import java.util.Set;

public final class PhoneUtils {

    private PhoneUtils() {
    }

    public static String normalize(String phone) {
        return phone == null ? null : phone.replaceAll("[\\s\\-()]", "");
    }

    /** Returns common Nigerian local and international spellings for phone lookups. */
    public static Set<String> lookupVariants(String phone) {
        String normalized = normalize(phone);
        Set<String> variants = new LinkedHashSet<>();
        if (normalized == null || normalized.isBlank()) return variants;

        variants.add(normalized);
        String digits = normalized.startsWith("+") ? normalized.substring(1) : normalized;
        variants.add(digits);

        if (digits.startsWith("234") && digits.length() == 13) {
            String national = digits.substring(3);
            variants.add("0" + national);
            variants.add("+234" + national);
        } else if (digits.startsWith("0") && digits.length() == 11) {
            String national = digits.substring(1);
            variants.add("234" + national);
            variants.add("+234" + national);
        } else if (digits.length() == 10 && digits.charAt(0) != '0') {
            variants.add("0" + digits);
            variants.add("234" + digits);
            variants.add("+234" + digits);
        }
        return variants;
    }
}
