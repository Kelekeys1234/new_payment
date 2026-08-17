package com.example.payment.util;

public final class PhoneUtils {

    private PhoneUtils() {
    }

    public static String normalize(String phone) {
        return phone == null ? null : phone.replaceAll("[\\s\\-()]", "");
    }
}
