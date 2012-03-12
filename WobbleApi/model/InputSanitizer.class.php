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
        $content = InputSanitizer::sanitizeLinks($content);

        return $content;
    }
    
    public static function sanitizeLinks($content) {
        $keyword = '<a';
        $replacement = $keyword . ' target="_new"';

        $offset = 0;

        while (true) {
            $i = strpos($content, $keyword, $offset);
            if ($i === FALSE) {
                return $content;
            }
            if (substr($content, $i, strlen($replacement)) === $replacement) {
                # We already sanitized this once, skip this link
                $offset ++;
                continue;    
            }

            $end = strpos($content, '>', $i);
            if ($end === FALSE) {
                return $content;
            }

            $j = strpos($content, 'target', $i);
            if ($j === FALSE) {
                # no target was found. Just replace the starting tag and be done.
                $content = substr($content, 0, $i) .
                           $replacement .
                           substr($content, $i + 2);
                $offset = $i + 16;
            }
            else {
                # Parsing html is hard. Actually too hard for this little project to do it right here.
                # The UI only provides a simple without a way to provide a link target. Thus we just
                # abort here.
                throw new Exception('Invalid content. Do not use target attribute in links(a): SAN-001');
            }
        }
    }
}