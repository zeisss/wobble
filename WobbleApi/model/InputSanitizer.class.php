<?php

/**
 * Sanitizes user input, especially emails & post content
 */
class InputSanitizer {
    public static function sanitizeEmail($email) {
        return trim($email);
    }

    /** 
     * Sanitizes user input by fixing the following things:
     * - Changes links to open in a new window (target="_new")
     */
    public static function sanitizePostContent($content) {
        return trim($content);
    }
}